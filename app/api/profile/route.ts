import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET — fetch a player profile
export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet')
  if (!wallet) return NextResponse.json({ error: 'No wallet' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('players')
    .select('*')
    .eq('wallet_address', wallet)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH — update profile state
export async function PATCH(req: NextRequest) {
  try {
    // Get wallet from auth header (simplified — add SIWE for production)
    const wallet = req.headers.get('x-wallet-address')
    if (!wallet) return NextResponse.json({ error: 'No wallet' }, { status: 401 })

    const { action } = await req.json()

    if (action === 'activate_autoserve') {
      await supabaseAdmin
        .from('players')
        .update({ auto_serve_active: true })
        .eq('wallet_address', wallet)
    }

    if (action === 'clear_profile_chip') {
      await supabaseAdmin
        .from('players')
        .update({ profile_chip: 0 })
        .eq('wallet_address', wallet)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
