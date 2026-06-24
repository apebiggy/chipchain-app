import { NextResponse } from 'next/server'
import { createPublicClient, http, parseAbiItem, fallback } from 'viem'
import { base } from 'viem/chains'

export const dynamic = 'force-dynamic'

const transport = process.env.NEXT_PUBLIC_BASE_RPC_URL
  ? fallback([
      http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
      http('https://mainnet.base.org'),
    ])
  : http('https://mainnet.base.org')

const client = createPublicClient({ chain: base, transport })

const GAME_CONTRACT = process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`

const SERVE_CLAIMED_EVENT = parseAbiItem(
  'event ServeClaimed(address indexed player, uint256 chip, uint256 wrapId, bool doubled)'
)
const PROFILE_WITHDRAWN_EVENT = parseAbiItem(
  'event ProfileWithdrawn(address indexed player, uint256 chip)'
)
const PROFILE_CREDITED_EVENT = parseAbiItem(
  'event ProfileCredited(address indexed player, uint256 chip)'
)
const GET_PLAYER_DATA = parseAbiItem(
  'function getPlayerData(address player) view returns (bool hasAutoServe, uint256 profileChip, uint256 served, uint256 totalEarned, bool hasMultiplier)'
)

// ChippyChain mainnet deploy block — confirmed on Basescan:
// https://basescan.org/block/47336423
const DEPLOY_BLOCK = BigInt(47336423)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const currentWallet = searchParams.get('wallet')?.toLowerCase()

    // Read all three event types from mainnet contract
    const [serveEvents, withdrawEvents, creditEvents] = await Promise.all([
      client.getLogs({ address: GAME_CONTRACT, event: SERVE_CLAIMED_EVENT,    fromBlock: DEPLOY_BLOCK, toBlock: 'latest' }),
      client.getLogs({ address: GAME_CONTRACT, event: PROFILE_WITHDRAWN_EVENT, fromBlock: DEPLOY_BLOCK, toBlock: 'latest' }),
      client.getLogs({ address: GAME_CONTRACT, event: PROFILE_CREDITED_EVENT,  fromBlock: DEPLOY_BLOCK, toBlock: 'latest' }),
    ])

    console.log(`Onchain leaderboard: ${serveEvents.length} serves, ${withdrawEvents.length} withdrawals, ${creditEvents.length} credits`)

    // Aggregate per player
    const playerMap = new Map<string, { servedCount: number; onchainChip: bigint }>()

    for (const e of serveEvents) {
      const addr = e.args.player!.toLowerCase()
      const cur  = playerMap.get(addr) || { servedCount: 0, onchainChip: BigInt(0) }
      playerMap.set(addr, { servedCount: cur.servedCount + 1, onchainChip: cur.onchainChip + e.args.chip! })
    }
    for (const e of withdrawEvents) {
      const addr = e.args.player!.toLowerCase()
      const cur  = playerMap.get(addr) || { servedCount: 0, onchainChip: BigInt(0) }
      playerMap.set(addr, { ...cur, onchainChip: cur.onchainChip + e.args.chip! })
    }
    // ProfileCredited: don't double-count — these show in profileChip from getPlayerData

    if (playerMap.size === 0) return NextResponse.json({ top50: [], you: null })

    const addresses = Array.from(playerMap.keys())

    // Multicall to get live profile balance + status for all players
    const playerDataResults = await client.multicall({
      contracts: addresses.map(addr => ({
        address:      GAME_CONTRACT,
        abi:          [GET_PLAYER_DATA],
        functionName: 'getPlayerData',
        args:         [addr as `0x${string}`],
      })),
    })

    const entries = addresses.map((addr, i) => {
      const evData     = playerMap.get(addr)!
      const pd         = playerDataResults[i]
      const playerData = pd.status === 'success' ? pd.result as readonly [boolean, bigint, bigint, bigint, boolean] : null
      const profileChip   = playerData ? playerData[1] : BigInt(0)
      const hasAutoServe  = playerData ? playerData[0] : false
      const hasMultiplier = playerData ? playerData[4] : false
      const totalChip     = evData.onchainChip + profileChip

      return {
        wallet_address:      addr,
        basename:            null,
        total_served:        evData.servedCount,
        onchain_chip:        Number(evData.onchainChip),
        profile_chip:        Number(profileChip),
        total_chip:          Number(totalChip),
        auto_serve_active:   hasAutoServe,
        collection_complete: hasMultiplier,
      }
    })

    // Sort + rank
    const sorted = entries
      .filter(e => e.total_chip > 0 || e.total_served > 0)
      .sort((a, b) => b.total_chip - a.total_chip)

    let rank = 1
    const ranked = sorted.map((e, i) => {
      if (i > 0 && e.total_chip < sorted[i - 1].total_chip) rank = i + 1
      return { ...e, rank }
    })

    const top50 = ranked.slice(0, 50)
    let you = null
    if (currentWallet) {
      const inTop50 = top50.some(e => e.wallet_address === currentWallet)
      if (!inTop50) you = ranked.find(e => e.wallet_address === currentWallet) || null
    }

    return NextResponse.json({ top50, you })

  } catch (err) {
    console.error('Onchain leaderboard error:', err)
    return NextResponse.json({ top50: [], you: null }, { status: 500 })
  }
}
