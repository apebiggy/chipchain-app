import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://v0-chipchain.vercel.app'),
  title: 'Chip Chain — The Great British Fry-Off',
  description: 'Serve fish & chips, earn $CHIP onchain, and collect Newspaper Wrap NFTs in this British chippy game built on Base.',
  keywords: ['Chip Chain', 'Base', 'onchain game', 'fish and chips', 'crypto game', 'NFT', '$CHIP', 'Base Sepolia', 'web3 game'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Chip Chain — The Great British Fry-Off',
    description: 'Serve fish & chips, earn $CHIP onchain, and collect Newspaper Wrap NFTs in this British chippy game built on Base.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chip Chain — The Great British Fry-Off',
    description: 'Serve fish & chips, earn $CHIP onchain, and collect Newspaper Wrap NFTs in this British chippy game built on Base.',
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
