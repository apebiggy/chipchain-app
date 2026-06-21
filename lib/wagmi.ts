import { http, createConfig } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { baseAccount, metaMask } from 'wagmi/connectors'

const isProd = process.env.NEXT_PUBLIC_CHAIN_ID === '8453'

// Dedicated CDP Node RPC (higher rate limits than the free public
// mainnet.base.org / sepolia.base.org endpoints, which 429 under any
// real traffic). Falls back to the public endpoint if not configured.
const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC_URL || undefined // undefined → wagmi default
const BASE_SEPOLIA_RPC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'

export const config = createConfig({
  chains: isProd ? [base] : [baseSepolia],
  connectors: [
    // Base Account connector — replaces the legacy coinbaseWallet
    // connector, which showed a "Coinbase"-branded popup even after
    // Coinbase Wallet's rebrand to Base App. This one matches current
    // Base branding throughout the connection flow.
    baseAccount({
      appName: 'Chip Chain',
      appLogoUrl: `${process.env.NEXT_PUBLIC_URL || 'https://chipchain.shop'}/branding/icon-1024.png`,
    }),
    metaMask(),
  ],
  transports: {
    [base.id]: http(BASE_RPC),
    [baseSepolia.id]: http(BASE_SEPOLIA_RPC),
  },
})

export const CHAIN = isProd ? base : baseSepolia
