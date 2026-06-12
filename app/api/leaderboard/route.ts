import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('leaderboard').select('*')
    if (error) throw error
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Leaderboard error:', err)
    return NextResponse.json([], { status: 500 })
  }
}
