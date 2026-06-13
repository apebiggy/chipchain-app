import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet')
  if (!wallet) return NextResponse.json({ error: 'No wallet' }, { status: 400 })

  try {
    const { data, error } = await supabaseAdmin
      .from('wrap_collection')
      .select('*')
      .eq('wallet_address', wallet)

    if (error) throw error

    return NextResponse.json({ collection: data || [] })
  } catch (err) {
    console.error('Wraps fetch error:', err)
    return NextResponse.json({ collection: [], error: String(err) }, { status: 500 })
  }
}
