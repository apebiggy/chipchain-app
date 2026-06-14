import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { CONTRACTS, GAME_ABI } from '@/lib/contracts'

const CHIPS_PER_TICK = 10  // 10 CHIP per minute = 600/hour = 14,400/day

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
    const account = privateKeyToAccount(
      `0x${process.env.BACKEND_PRIVATE_KEY}` as `0x${string}`
    )

    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http('https://sepolia.base.org'),
    })

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http('https://sepolia.base.org'),
    })

    // Batch credit all active players at once
    const addresses = players.map((p: { wallet_address: string }) => p.wallet_address as `0x${string}`)
    const amounts   = players.map(() => BigInt(CHIPS_PER_TICK))

    const hash = await walletClient.writeContract({
      address: CONTRACTS.GAME_CONTRACT,
      abi: [
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
      ],
      functionName: 'batchCreditProfile',
      args: [addresses, amounts],
    })

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
