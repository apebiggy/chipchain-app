import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia, base } from 'viem/chains'
import { CONTRACTS } from '@/lib/contracts'

const isProd = process.env.NEXT_PUBLIC_CHAIN_ID === '8453'
const ACTIVE_CHAIN = isProd ? base : baseSepolia
// Dedicated CDP Node RPC (higher rate limits than the free public
// endpoints, which 429 under repeated cron polling). Falls back to
// the public endpoint if not configured.
const RPC_URL = isProd
  ? (process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org')
  : (process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org')

const CHIPS_PER_TICK = 100  // 100 CHIP per 10-minute tick = same 14,400/day effective rate

const BATCH_CREDIT_ABI = [
  {
    name: 'batchCreditProfile',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'players', type: 'address[]' },
      { name: 'amounts', type: 'uint256[]' },
    ],
    outputs: [],
  },
] as const

export async function GET(req: NextRequest) {
  // Verify cron secret
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all active auto-serve players
    const { data: players, error } = await supabaseAdmin
      .from('players')
      .select('wallet_address')
      .eq('auto_serve_active', true)

    if (error || !players?.length) {
      return NextResponse.json({ ok: true, credited: 0 })
    }

    // Set up backend wallet
    const rawKey = (process.env.BACKEND_PRIVATE_KEY || '').trim().replace(/^0x/i, '')
    const account = privateKeyToAccount(`0x${rawKey}` as `0x${string}`)

    const walletClient = createWalletClient({
      account,
      chain: ACTIVE_CHAIN,
      transport: http(RPC_URL),
    })

    const publicClient = createPublicClient({
      chain: ACTIVE_CHAIN,
      transport: http(RPC_URL),
    })

    // Batch credit all active players at once
    const addresses = players.map((p: { wallet_address: string }) => p.wallet_address as `0x${string}`)
    const amounts   = players.map(() => BigInt(CHIPS_PER_TICK))

    // Send with retry: refetch nonce on "nonce too low" (handles lagging/inconsistent RPC nodes)
    const MAX_ATTEMPTS = 4
    let hash: `0x${string}` | undefined
    let lastErr: unknown
    let nonceOverride: number | undefined

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      let nonce: number
      if (nonceOverride !== undefined) {
        // Use the exact nonce the network told us it expects
        nonce = nonceOverride
      } else {
        // Take the higher of 'pending' and 'latest' nonce, in case one RPC node is lagging
        const [pendingNonce, latestNonce] = await Promise.all([
          publicClient.getTransactionCount({ address: account.address, blockTag: 'pending' }),
          publicClient.getTransactionCount({ address: account.address, blockTag: 'latest' }),
        ])
        nonce = Math.max(pendingNonce, latestNonce)
      }

      try {
        hash = await walletClient.writeContract({
          address: CONTRACTS.GAME_CONTRACT,
          abi: BATCH_CREDIT_ABI,
          functionName: 'batchCreditProfile',
          args: [addresses, amounts],
          nonce,
        })
        break // success
      } catch (err) {
        lastErr = err
        const msg = String(err)
        if (msg.includes('nonce too low') && attempt < MAX_ATTEMPTS) {
          // The error itself contains the authoritative nonce, e.g.
          // "nonce too low: next nonce 2266, tx nonce 2265" — use it
          // directly instead of re-asking a lagging RPC node.
          const m = msg.match(/next nonce (\d+)/)
          nonceOverride = m ? parseInt(m[1], 10) : nonce + 1
          console.warn(`Cron attempt ${attempt} hit nonce-too-low (tried ${nonce}), retrying with ${nonceOverride}...`)
          await new Promise((r) => setTimeout(r, 1500 * attempt))
          continue
        }
        throw err
      }
    }

    if (!hash) {
      throw lastErr ?? new Error('Failed to send batchCreditProfile after retries')
    }

    await publicClient.waitForTransactionReceipt({ hash })

    // Update Supabase profile balances
    for (const player of players) {
      await supabaseAdmin.rpc('add_profile_chip', {
        wallet_addr: player.wallet_address,
        amount:      CHIPS_PER_TICK,
      })
    }

    // Log auto-serve activity
    await supabaseAdmin.from('auto_serve_log').insert(
      players.map((p: { wallet_address: string }) => ({
        wallet_address: p.wallet_address,
        chips_earned:   CHIPS_PER_TICK,
      }))
    )

    return NextResponse.json({ ok: true, credited: players.length, hash })

  } catch (err) {
    console.error('Cron error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
