import { http, createConfig } from 'wagmi'
import { fallback } from 'viem'
import { baseSepolia, base } from 'wagmi/chains'
import { baseAccount, metaMask, injected } from 'wagmi/connectors'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'

const isProd = process.env.NEXT_PUBLIC_CHAIN_ID === '8453'

const CDP_RPC = process.env.NEXT_PUBLIC_BASE_RPC_URL
const BASE_SEPOLIA_RPC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'

const baseTransport = CDP_RPC
  ? fallback([http(CDP_RPC), http('https://mainnet.base.org')])
  : http('https://mainnet.base.org')

export const config = createConfig({
  chains: isProd ? [base] : [baseSepolia],
  connectors: [
    farcasterMiniApp(),
    baseAccount({
      appName: 'Chip Chain',
      appLogoUrl: `${process.env.NEXT_PUBLIC_URL || 'https://chipchain.shop'}/branding/icon-1024.png`,
    }),
    injected(), // Rainbow, Trust, Brave, and any other EIP-1193 browser wallet
    metaMask(),
  ],
  transports: {
    [base.id]: baseTransport,
    [baseSepolia.id]: http(BASE_SEPOLIA_RPC),
  },
})

export const CHAIN = isProd ? base : baseSepolia
