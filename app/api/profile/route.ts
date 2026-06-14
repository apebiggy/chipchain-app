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

    const body = await req.json()
    const { action } = body

    if (action === 'activate_autoserve') {
      await supabaseAdmin
        .from('players')
        .update({ auto_serve_active: true })
        .eq('wallet_address', wallet)
    }

    if (action === 'clear_profile_chip') {
      // Fetch current profile_chip so we can preserve it in the leaderboard total
      const { data: playerRow } = await supabaseAdmin
        .from('players')
        .select('profile_chip')
        .eq('wallet_address', wallet)
        .single()

      const withdrawnAmount = playerRow?.profile_chip ?? 0

      if (withdrawnAmount > 0) {
        // Record the withdrawal as a "serve" so onchain_chip stays in sync
        // with the player's actual minted $CHIP balance (withdrawProfile mints
        // tokens equal to the withdrawn amount). This keeps total_chip
        // (onchain_chip + profile_chip) constant across a withdrawal —
        // it just moves from the "pending" bucket to the "minted" bucket.
        await supabaseAdmin.from('serves').insert({
          wallet_address: wallet,
          chip_amount:    withdrawnAmount,
          type:           'profile_withdraw',
          tx_hash:        body.txHash ?? null,
        })
      }

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
