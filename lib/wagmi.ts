import { http, createConfig } from 'wagmi'
import { fallback } from 'viem'
import { baseSepolia, base } from 'wagmi/chains'
import { baseAccount, metaMask } from 'wagmi/connectors'

const isProd = process.env.NEXT_PUBLIC_CHAIN_ID === '8453'

// Dedicated CDP Node RPC (higher rate limits than the free public
// mainnet.base.org / sepolia.base.org endpoints, which 429 under any
// real traffic).
const CDP_RPC = process.env.NEXT_PUBLIC_BASE_RPC_URL
const BASE_SEPOLIA_RPC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'

// Fallback chain: try the dedicated CDP RPC first, automatically fall
// back to the public endpoint if it fails for any reason (rate limit,
// network restriction in a specific webview/in-app browser, etc.) —
// without this, a single blocked/failing RPC silently makes every
// onchain read return empty data instead of erroring visibly.
const baseTransport = CDP_RPC
  ? fallback([http(CDP_RPC), http('https://mainnet.base.org')])
  : http('https://mainnet.base.org')

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
    [base.id]: baseTransport,
    [baseSepolia.id]: http(BASE_SEPOLIA_RPC),
  },
})

export const CHAIN = isProd ? base : baseSepolia
