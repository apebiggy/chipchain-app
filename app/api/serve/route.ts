import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
export async function POST(req: NextRequest) {
  try {
    const { wallet, chipAmount, txHash, headline, rare } = await req.json()
    if (!wallet || !txHash) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    await supabaseAdmin.from('players').upsert({ wallet_address: wallet, last_seen: new Date().toISOString() }, { onConflict: 'wallet_address', ignoreDuplicates: true })
    await supabaseAdmin.from('serves').insert({ wallet_address: wallet, chip_amount: chipAmount, type: 'manual', tx_hash: txHash, headline, rare })
    await supabaseAdmin.rpc('increment_served', { wallet_addr: wallet })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('serve API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
