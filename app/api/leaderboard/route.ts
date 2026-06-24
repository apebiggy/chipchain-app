import { NextResponse } from 'next/server'
import { createPublicClient, http, fallback } from 'viem'
import { base } from 'viem/chains'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const transport = process.env.NEXT_PUBLIC_BASE_RPC_URL
  ? fallback([
      http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
      http('https://mainnet.base.org'),
    ])
  : http('https://mainnet.base.org')

const client = createPublicClient({ chain: base, transport })

const CHIP_TOKEN    = process.env.NEXT_PUBLIC_CHIP_TOKEN    as `0x${string}`
const WRAP_NFT      = process.env.NEXT_PUBLIC_WRAP_NFT      as `0x${string}`
const GAME_CONTRACT = process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`

const BALANCE_OF = [{
  name: 'balanceOf',
  type: 'function',
  stateMutability: 'view',
  inputs:  [{ name: 'account', type: 'address' }],
  outputs: [{ name: '', type: 'uint256' }],
}] as const

const GET_PLAYER_DATA = [{
  name: 'getPlayerData',
  type: 'function',
  stateMutability: 'view',
  inputs:  [{ name: 'player', type: 'address' }],
  outputs: [
    { name: 'hasAutoServe',  type: 'bool'    },
    { name: 'profileChip',   type: 'uint256' },
    { name: 'served',        type: 'uint256' },
    { name: 'totalEarned',   type: 'uint256' },
    { name: 'hasMultiplier', type: 'bool'    },
  ],
}] as const

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const currentWallet = searchParams.get('wallet')?.toLowerCase()

    // ── 1. Get wallet list from Supabase ─────────────────────────
    const { data: players, error } = await supabaseAdmin
      .from('players')
      .select('wallet_address, basename, auto_serve_active')
      .order('created_at', { ascending: true })

    if (error) throw new Error(`Supabase error: ${error.message}`)
    if (!players || players.length === 0) {
      return NextResponse.json({ top50: [], you: null })
    }

    const addresses = players.map(p => p.wallet_address as `0x${string}`)

    // ── 2. Multicall — chip balance, wrap count, profile data ────
    const chipCalls    = addresses.map(addr => ({ address: CHIP_TOKEN,    abi: BALANCE_OF,      functionName: 'balanceOf',     args: [addr] }))
    const wrapCalls    = addresses.map(addr => ({ address: WRAP_NFT,      abi: BALANCE_OF,      functionName: 'balanceOf',     args: [addr] }))
    const profileCalls = addresses.map(addr => ({ address: GAME_CONTRACT, abi: GET_PLAYER_DATA, functionName: 'getPlayerData', args: [addr] }))

    const [chipResults, wrapResults, profileResults] = await Promise.all([
      client.multicall({ contracts: chipCalls,    allowFailure: true }),
      client.multicall({ contracts: wrapCalls,    allowFailure: true }),
      client.multicall({ contracts: profileCalls, allowFailure: true }),
    ])

    // ── 3. Build entries ─────────────────────────────────────────
    const entries = players.map((p, i) => {
      const chipBal     = chipResults[i]?.status    === 'success' ? Number(chipResults[i].result)    : 0
      const wrapCount   = wrapResults[i]?.status    === 'success' ? Number(wrapResults[i].result)    : 0
      const profileData = profileResults[i]?.status === 'success' ? profileResults[i].result         : null

      const profileChip   = profileData ? Number(profileData[1]) : 0
      const hasAutoServe  = profileData ? Boolean(profileData[0]) : false
      const hasMultiplier = profileData ? Boolean(profileData[4]) : false
      const totalServed   = profileData ? Number(profileData[2])  : 0

      // Total chip = minted onchain balance + pending profile balance
      const totalChip = chipBal + profileChip

      return {
        wallet_address:      p.wallet_address,
        basename:            p.basename ?? null,
        chip_balance:        chipBal,
        profile_chip:        profileChip,
        total_chip:          totalChip,
        wrap_count:          wrapCount,
        total_served:        totalServed,
        auto_serve_active:   hasAutoServe,
        collection_complete: hasMultiplier,
      }
    })

    // ── 4. Sort + rank ───────────────────────────────────────────
    const sorted = entries
      .filter(e => e.total_chip > 0 || e.wrap_count > 0 || e.total_served > 0)
      .sort((a, b) => b.total_chip - a.total_chip)

    let rank = 1
    const ranked = sorted.map((e, i) => {
      if (i > 0 && e.total_chip < sorted[i - 1].total_chip) rank = i + 1
      return { ...e, rank }
    })

    const top50 = ranked.slice(0, 50)
    const you   = currentWallet
      ? ranked.find(e => e.wallet_address.toLowerCase() === currentWallet) ?? null
      : null

    return NextResponse.json({ top50, you })

  } catch (err: any) {
    console.error('Leaderboard error:', err)
    return NextResponse.json({ top50: [], you: null, error: err.message }, { status: 500 })
  }
}
