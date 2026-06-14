import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chip Chain — The Great British Fry-Off',
  description: 'Serve fish & chips. Earn $CHIP onchain. Live on Base.',
  openGraph: {
    title: 'Chip Chain',
    description: 'The Great British Fry-Off — onchain on Base',
    images: ['/og-image.png'],
  },
  other: {
    // Farcaster frame manifest
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_URL}/og-image.png`,
    'fc:frame:button:1': '🍟 Play Chip Chain',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_URL}/api/frame`,
    // Base Builder Code domain verification
    'base:app_id': '6a2eb9d2894040438b8e6449',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
