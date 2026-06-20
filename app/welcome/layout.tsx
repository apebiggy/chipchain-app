import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chip Chain — The Great British Fry-Off',
  description: 'Serve fish & chips, earn $CHIP onchain, collect Newspaper Wrap NFTs, and climb the leaderboard. Live on Base Mainnet.',
  openGraph: {
    title: 'Chip Chain — The Great British Fry-Off',
    description: 'Serve fish & chips, earn $CHIP onchain, collect Newspaper Wrap NFTs, and climb the leaderboard. Live on Base Mainnet.',
    images: ['/branding/welcome-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chip Chain — The Great British Fry-Off',
    description: 'Serve fish & chips, earn $CHIP onchain, collect Newspaper Wrap NFTs, and climb the leaderboard. Live on Base Mainnet.',
    images: ['/branding/welcome-og.png'],
  },
}

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return children
}
