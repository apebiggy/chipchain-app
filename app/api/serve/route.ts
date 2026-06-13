import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { wallet, chipAmount, txHash, headline, headlineIndex, rare } = await req.json()

    if (!wallet || !txHash) {
      return NextResponse.json({ error: 'Missing wallet or txHash' }, { status: 400 })
    }

    // Upsert player row if doesn't exist
    await supabaseAdmin
      .from('players')
      .upsert(
        { wallet_address: wallet, last_seen: new Date().toISOString() },
        { onConflict: 'wallet_address', ignoreDuplicates: true }
      )

    // Record the serve
    await supabaseAdmin.from('serves').insert({
      wallet_address: wallet,
      chip_amount:    chipAmount,
      type:           'manual',
      tx_hash:        txHash,
      headline:       headline,
      rare:           rare,
    })

    // Record the wrap for the collection grid
    await supabaseAdmin.from('wraps').insert({
      wallet_address: wallet,
      headline_index: headlineIndex,
      rare:           rare,
      tx_hash:        txHash,
    })

    // Increment stats
    await supabaseAdmin.rpc('increment_served', { wallet_addr: wallet })

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('serve API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
