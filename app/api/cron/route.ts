import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { CONTRACTS } from '@/lib/contracts'
const CHIPS_PER_TICK = 15
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { data: players } = await supabaseAdmin.from('players').select('wallet_address').eq('auto_serve_active', true)
    if (!players?.length) return NextResponse.json({ ok: true, credited: 0 })
    const account = privateKeyToAccount(`0x${process.env.BACKEND_PRIVATE_KEY}` as `0x${string}`)
    const walletClient = createWalletClient({ account, chain: baseSepolia, transport: http('https://sepolia.base.org') })
    const publicClient = createPublicClient({ chain: baseSepolia, transport: http('https://sepolia.base.org') })
    const addresses = players.map(p => p.wallet_address as `0x${string}`)
    const amounts   = players.map(() => BigInt(CHIPS_PER_TICK))
    const hash = await walletClient.writeContract({
      address: CONTRACTS.GAME_CONTRACT,
      abi: [{ name:'batchCreditProfile', type:'function', stateMutability:'nonpayable', inputs:[{name:'players',type:'address[]'},{name:'amounts',type:'uint256[]'}], outputs:[] }],
      functionName: 'batchCreditProfile', args: [addresses, amounts],
    })
    await publicClient.waitForTransactionReceipt({ hash })
    for (const p of players) await supabaseAdmin.rpc('add_profile_chip', { wallet_addr: p.wallet_address, amount: CHIPS_PER_TICK })
    return NextResponse.json({ ok: true, credited: players.length })
  } catch (err) {
    console.error('Cron error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
