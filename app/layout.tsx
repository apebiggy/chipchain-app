import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'
export const metadata: Metadata = {
  title: 'Chip Chain — The Great British Fry-Off',
  description: 'Serve fish & chips. Earn $CHIP onchain. Live on Base.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
