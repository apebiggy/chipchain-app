import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://chipchain.shop'

export async function GET() {
  const manifest = {
    // ── Account association — proves domain ownership ────────────
    // Signed via Farcaster's manifest tool, verified: payload decodes
    // to {"domain":"chipchain.shop"}, header confirms FID 3338228
    // (custody key 0x36E8...4553).
    accountAssociation: {
      header: 'eyJmaWQiOjMzMzgyMjgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgzNkU4RjdlMzVmQzJCZTQ3NWE1ZTlmNUEwMDc2ZUE4ZkI2OGE0NTUzIn0',
      payload: 'eyJkb21haW4iOiJjaGlwY2hhaW4uc2hvcCJ9',
      signature: 'hIdIguFwoZfHR3yJ4KTMTOQeVrXCanTWkZ9/VmK4YgBgQeyms1tLPqwM7xcSvsLEXOeU4Bi0Mvz6oBYsZ0uUMhs=',
    },

    miniapp: {
      version: '1',
      name: 'Chip Chain',
      homeUrl: `${BASE_URL}/play`,
      iconUrl: `${BASE_URL}/branding/icon-1024.png`,
      splashImageUrl: `${BASE_URL}/branding/splash-200.png`,
      splashBackgroundColor: '#1a90d8',

      subtitle: 'The Great British Fry-Off',
      description: 'Serve fish and chips, earn $CHIP onchain, and collect Newspaper Wrap NFTs in this British chippy game built on Base. Live on Base Mainnet now.',
      tagline: 'Serve, earn, collect onchain',

      screenshotUrls: [
        `${BASE_URL}/branding/screenshot1-play.png`,
        `${BASE_URL}/branding/screenshot2-leaderboard.png`,
        `${BASE_URL}/branding/screenshot3-profile-wraps.png`,
      ],

      primaryCategory: 'games',
      tags: ['gaming', 'onchain', 'base', 'nft', 'leaderboard'],

      heroImageUrl: `${BASE_URL}/og-image.png`,
      ogTitle: 'Chip Chain - Live on Base',
      ogDescription: 'Serve fish and chips, earn $CHIP onchain, and climb the leaderboard. Live on Base Mainnet.',
      ogImageUrl: `${BASE_URL}/og-image.png`,

      buttonTitle: 'Play Chip Chain',
    },
  }

  return NextResponse.json(manifest)
}
