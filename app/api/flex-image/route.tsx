import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const TAGLINES = [
  'More chips than a chippy on a Friday night 🍟🔥',
  'Serving chips faster than the queue forms 🍟⚡',
  'This shop never closes — onchain and proud 🐟⛓',
  "Mushy peas optional. $CHIP isn't. 🟢🍟",
]

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const chip = searchParams.get('chip') || '0'
  const served = searchParams.get('served') || '0'
  const multiplier = searchParams.get('multiplier') === '1'
  const tagline = TAGLINES[Number(searchParams.get('t') || 0) % TAGLINES.length]

  const logoUrl = `${origin}/branding/logo-full.png`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #1a90d8 0%, #0d5a96 100%)',
          position: 'relative',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top tag */}
        <div
          style={{
            display: 'flex',
            background: '#FFD700',
            color: '#111',
            fontSize: 22,
            fontWeight: 900,
            padding: '8px 24px',
            borderRadius: 999,
            border: '3px solid #111',
            letterSpacing: 2,
            marginBottom: 24,
          }}
        >
          🏆 CHIP CHAIN FLEX
        </div>

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} width={150} height={120} style={{ marginBottom: 10 }} />

        {/* Big number */}
        <div
          style={{
            display: 'flex',
            fontSize: 92,
            fontWeight: 900,
            color: '#fff',
            textShadow: '4px 4px 0 #111',
            letterSpacing: 1,
          }}
        >
          {chip} $CHIP
        </div>

        {/* Subtext */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 30,
            fontWeight: 700,
            color: '#fff',
            marginTop: 6,
          }}
        >
          <span>🍟 {served} served</span>
          {multiplier && (
            <span
              style={{
                display: 'flex',
                background: '#27ae60',
                color: '#fff',
                padding: '4px 16px',
                borderRadius: 999,
                border: '2px solid #111',
                fontSize: 22,
              }}
            >
              🏆 2x ACTIVE
            </span>
          )}
        </div>

        {/* Funny tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            fontStyle: 'italic',
            color: '#FFD700',
            marginTop: 30,
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          {tagline}
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            position: 'absolute',
            bottom: 26,
            fontSize: 20,
            fontWeight: 900,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: 1,
          }}
        >
          THE GREAT BRITISH FRY-OFF · LIVE ON BASE
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
