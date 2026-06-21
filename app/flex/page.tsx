import type { Metadata } from 'next'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://chipchain.shop'

interface Props {
  searchParams: { chip?: string; served?: string; multiplier?: string; t?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const chip = searchParams.chip || '0'
  const served = searchParams.served || '0'
  const multiplier = searchParams.multiplier === '1'

  const imageUrl = `${BASE_URL}/api/flex-image?chip=${chip}&served=${served}&multiplier=${multiplier ? '1' : '0'}&t=${searchParams.t || '0'}`
  const title = `I've earned ${chip} $CHIP at Chip Chain 🍟⛓`
  const description = `${served} customers served${multiplier ? ' · 🏆 2x multiplier active' : ''} — The Great British Fry-Off, live on Base.`

  return {
    title,
    description,
    openGraph: { title, description, images: [imageUrl] },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  }
}

export default function FlexPage({ searchParams }: Props) {
  const chip = searchParams.chip || '0'
  const served = searchParams.served || '0'
  const multiplier = searchParams.multiplier === '1'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24, textAlign: 'center', fontFamily: 'Nunito, sans-serif',
      background: 'linear-gradient(160deg, #1a90d8 0%, #0d5a96 100%)',
    }}>
      <img src="/branding/logo-full.png" alt="Chip Chain" style={{ width: 130, height: 'auto', marginBottom: 14 }} />
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 30, color: '#fff', textShadow: '2px 2px 0 #111', marginBottom: 6 }}>
        🏆 {chip} $CHIP earned
      </h1>
      <p style={{ color: '#FFD700', fontWeight: 800, marginBottom: 24, fontSize: 15 }}>
        {served} customers served{multiplier ? ' · 2x multiplier active 🔥' : ''}
      </p>
      <Link href="/play" style={{
        background: '#FFD700', color: '#111', border: '3px solid #111', borderRadius: 10,
        padding: '12px 28px', fontSize: 16, fontWeight: 900, textDecoration: 'none',
        boxShadow: '4px 4px 0 #111',
      }}>
        🍟 Play Chip Chain
      </Link>
    </div>
  )
}
