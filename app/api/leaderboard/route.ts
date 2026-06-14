import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const wallet = req.nextUrl.searchParams.get('wallet')

    // Top 50
    const { data: top50, error } = await supabaseAdmin
      .from('leaderboard')
      .select('*')

    if (error) throw error

    let you = null

    if (wallet) {
      const inTop50 = top50?.some(
        (p: any) => p.wallet_address.toLowerCase() === wallet.toLowerCase()
      )

      if (!inTop50) {
        // Fetch the current player's row + rank from the full ranked view
        const { data: yourRow } = await supabaseAdmin
          .from('leaderboard_ranked')
          .select('*')
          .ilike('wallet_address', wallet)
          .single()

        if (yourRow) you = yourRow
      }
    }

    return NextResponse.json({ top50: top50 || [], you })
  } catch (err) {
    console.error('Leaderboard error:', err)
    return NextResponse.json({ top50: [], you: null }, { status: 500 })
  }
}
