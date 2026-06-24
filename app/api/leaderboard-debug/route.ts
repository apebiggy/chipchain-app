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
const DEPLOY_BLOCK  = BigInt(47336423)

const SERVE_CLAIMED_EVENT = parseAbiItem(
  'event ServeClaimed(address indexed player, uint256 chip, uint256 wrapId, bool doubled)'
)

export async function GET() {
  try {
    const currentBlock = await client.getBlockNumber()

    let events = []
    let error = null
    try {
      events = await client.getLogs({
        address: GAME_CONTRACT,
        event:   SERVE_CLAIMED_EVENT,
        fromBlock: DEPLOY_BLOCK,
        toBlock:   'latest',
      })
    } catch (e: any) {
      error = e.message
    }

    return NextResponse.json({
      gameContract:  GAME_CONTRACT,
      deployBlock:   DEPLOY_BLOCK.toString(),
      currentBlock:  currentBlock.toString(),
      blockRange:    (currentBlock - DEPLOY_BLOCK).toString(),
      eventsFound:   events.length,
      firstEvent:    events[0] ?? null,
      error,
    })
  } catch (err: any) {
    return NextResponse.json({ fatal: err.message }, { status: 500 })
  }
}
