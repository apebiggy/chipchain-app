import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://chipchain.shop'),
  title: 'Chip Chain — The Great British Fry-Off',
  description: 'Serve fish & chips, earn $CHIP onchain, collect Newspaper Wrap NFTs, and climb the leaderboard. Live on Base Mainnet.',
  keywords: ['Chip Chain', 'Base', 'Base Mainnet', 'onchain game', 'fish and chips', 'crypto game', 'NFT', '$CHIP', 'web3 game'],
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
    description: 'Serve fish & chips, earn $CHIP onchain, collect Newspaper Wrap NFTs, and climb the leaderboard. Live on Base Mainnet.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chip Chain — The Great British Fry-Off',
    description: 'Serve fish & chips, earn $CHIP onchain, collect Newspaper Wrap NFTs, and climb the leaderboard. Live on Base Mainnet.',
    images: ['/og-image.png'],
  },
  other: {
    // Google Search Console domain verification
    'google-site-verification': 'YCgzKxH_MigVA7rAx5ieqPK26Cl_oaL2FHlOkHixUmY',
    // Mini App embed metadata — current standard (fc:miniapp replaces
    // the older fc:frame tags). Makes this page shareable as a rich,
    // interactive card in Base App / Farcaster feeds.
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: `${process.env.NEXT_PUBLIC_URL || 'https://chipchain.shop'}/branding/embed-image-3x2.png`,
      button: {
        title: 'Play Chip Chain',
        action: {
          type: 'launch_frame',
          name: 'Chip Chain',
          url: `${process.env.NEXT_PUBLIC_URL || 'https://chipchain.shop'}/play`,
          splashImageUrl: `${process.env.NEXT_PUBLIC_URL || 'https://chipchain.shop'}/branding/splash-200.png`,
          splashBackgroundColor: '#1a90d8',
        },
      },
    }),
    // Base Builder Code domain verification
    'base:app_id': '6a2eb9d2894040438b8e6449',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Chip Chain',
    alternateName: 'Chip Chain — The Great British Fry-Off',
    description: 'Serve fish & chips, earn $CHIP onchain, collect Newspaper Wrap NFTs, and climb the leaderboard. Live on Base Mainnet.',
    url: process.env.NEXT_PUBLIC_URL || 'https://chipchain.shop',
    image: `${process.env.NEXT_PUBLIC_URL || 'https://chipchain.shop'}/og-image.png`,
    applicationCategory: 'Game',
    operatingSystem: 'Web',
    genre: ['Simulation', 'Onchain Game'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free to play, small ETH network fees apply per action',
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
