import { http, createConfig } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { coinbaseWallet, metaMask } from 'wagmi/connectors'

const isProd = process.env.NEXT_PUBLIC_CHAIN_ID === '8453'

export const config = createConfig({
  chains: isProd ? [base] : [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'Chip Chain',
      appLogoUrl: 'https://chipchain.app/logo.png',
    }),
    metaMask(),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
})

export const CHAIN = isProd ? base : baseSepolia
