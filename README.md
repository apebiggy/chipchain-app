# 🐟 Chip Chain — The Great British Fry-Off

An onchain fish & chip shop game built on **Base**. Serve customers, earn **$CHIP** points, collect **Newspaper Wrap NFTs**, and climb the leaderboard ahead of the upcoming rewards round and **$CHIP TGE**.

Built for the Base ecosystem as a mini app.

---

## 🎮 How it plays

1. **Get a customer** — each one has a unique order and tip amount
2. **Build the order** — tap menu items (fish, chips, sauces, drinks) to match what they want
3. **SERVE IT** — fires a real Base transaction:
   - Mints **$CHIP** points directly to your wallet
   - Mints a collectible **Newspaper Wrap NFT** with a random tabloid headline (+10% chance of a ⭐ Rare edition)
4. **Auto Serve** — pay a one-time fee (0.003 ETH) to earn **100 $CHIP every 10 minutes** passively into a profile balance, withdraw onchain anytime

---

## 📰 Newspaper Wrap Collection

There are **20 wrap types** in total (10 headlines × normal/rare editions). Your Profile tab shows a sticker-album style grid — locked cards show `???` until collected.

**🏆 Collect all 20 → unlock a 2x $CHIP multiplier** on the leaderboard, applied to your ranking ahead of the rewards round.

---

## 🏆 Leaderboard & Rewards

The Top 50 leaderboard tracks total $CHIP (onchain + profile balance), with the 2x multiplier applied for completionists. Your own rank is always shown — even if you're outside the top 50, your row is pinned at the bottom. Players with a registered [Basename](https://base.org/names) (`.base` / `.base.eth`) have it displayed in place of their wallet address, resolved live via OnchainKit.

**Both your $CHIP balance and Newspaper Wrap collection are being tracked now** to determine standings ahead of the upcoming rewards round and the $CHIP token event (TGE).

---

## 🌐 Landing page & Base App

A marketing landing page lives at `/welcome` (pop-art British chippy theme, real game mechanics, links into the live game at `/`). The app is registered on [Base.dev](https://base.dev) with a Builder Code (`bc_h20d7bcz`) for onchain attribution — Base App traffic is automatically tagged.

---

## ⛓ Live on Base Mainnet

| Contract | Address |
|---|---|
| ChipToken (`$CHIP`) | [`0xa840fd34783438dd09B8eA6EA6ad70fF88d25C4E`](https://basescan.org/address/0xa840fd34783438dd09B8eA6EA6ad70fF88d25C4E) |
| NewspaperWrap (NFT) | [`0x9ab1860fBE07140755C71aa7F990fb6681Fe9B84`](https://basescan.org/address/0x9ab1860fBE07140755C71aa7F990fb6681Fe9B84) |
| ChipTreasury | [`0x8bf32413417dF502A5E8C7E3576F019cF4c10B22`](https://basescan.org/address/0x8bf32413417dF502A5E8C7E3576F019cF4c10B22) |
| ChippyChain (game) | [`0xe0683F840949976C0f7304f5AA6B9b9450Ae9c4c`](https://basescan.org/address/0xe0683F840949976C0f7304f5AA6B9b9450Ae9c4c) |

<details>
<summary>Testnet (Base Sepolia) — historical, v1 contracts</summary>

| Contract | Address |
|---|---|
| ChipToken (`$CHIP`) | [`0x8bf32413417dF502A5E8C7E3576F019cF4c10B22`](https://sepolia.basescan.org/address/0x8bf32413417dF502A5E8C7E3576F019cF4c10B22) |
| NewspaperWrap (NFT) | [`0xa840fd34783438dd09B8eA6EA6ad70fF88d25C4E`](https://sepolia.basescan.org/address/0xa840fd34783438dd09B8eA6EA6ad70fF88d25C4E) |
| ChipTreasury | [`0x331f36834E8446B00054AaD0655077fcF90F7409`](https://sepolia.basescan.org/address/0x331f36834E8446B00054AaD0655077fcF90F7409) |
| ChippyChain (game) | [`0x2b494475705d6197014f0BD06f909398688bd169`](https://sepolia.basescan.org/address/0x2b494475705d6197014f0BD06f909398688bd169) |

</details>

---

## 🍟 Tokenomics

**$CHIP is currently a non-transferable onchain points system** — not a financial instrument, not tradeable, not listed on any exchange. Points are earned by playing. A real, tradeable **$CHIP token (TGE)** is planned post-launch (see Roadmap), with allocations based on total mainnet $CHIP balances and Newspaper Wrap collection progress.

Every transaction sends a small protocol fee to an onchain **Treasury** contract:

| Action | Fee | Destination |
|---|---|---|
| SERVE IT (manual) | 0.000005 ETH | Treasury |
| Withdraw profile $CHIP | 0.000005 ETH | Treasury |
| Buy Auto Serve | 0.003 ETH (one-time) | Treasury |

All treasury withdrawals are logged onchain with a reason, fully transparent.

---

## 🗺️ Roadmap

| Phase | Status | Highlights |
|---|---|---|
| 🍟 **1 — Chip Chain (Testnet)** | ✅ Live | Core game, Auto Serve, Wrap collection, leaderboard + multiplier |
| 📣 **2 — Community & Socials** | ◐ Next | X, Farcaster, Discord; target 500-1,000 wallets; Base App submission |
| ⛓ **3 — Mainnet Launch** | ○ Planned | Redeploy contracts, CDP Paymaster, real Treasury fees |
| 🍟 **4 — $CHIP TGE** | ○ Planned | Snapshot rewards, 2x for Wrap completionists, DEX liquidity |
| 🍔 **5 — New Restaurants** | ○ Planned | Taco Truck, Pizza Place, Curry House, Chinese Takeaway |

Targets are intentionally modest — built incrementally based on real player feedback, not hype. Full details available in-app via the 🗺️ Roadmap badge.

---

## 🛠 Tech stack

- **Smart contracts**: Solidity 0.8.20, OpenZeppelin v5
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Onchain**: wagmi, viem, Base Mainnet
- **Wallet**: Coinbase Wallet (OnchainKit) + MetaMask
- **Backend**: Supabase (Postgres) — players, serves, wraps, leaderboard
- **Auto Serve cron**: external cron service hitting `/api/cron` every 10 minutes

---

## 🚀 Running locally

```bash
git clone https://github.com/YOUR_USERNAME/chipchain-app.git
cd chipchain-app
npm install
cp .env.example .env.local
# Fill in .env.local with your own keys (see comments in the file)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect a wallet on **Base Mainnet**, and play. (Set `NEXT_PUBLIC_CHAIN_ID=84532` in `.env.local` to run against Base Sepolia testnet instead.)

### Supabase setup

Run the SQL migrations in order via the Supabase SQL Editor:
1. Base schema — `players`, `serves`, `auto_serve_log` tables + `increment_served()` / `add_profile_chip()` functions
2. `leaderboard_ranked` + `leaderboard` views (ranked, with "your rank" support)
3. `wraps` table + `wrap_collection` view (Newspaper Wrap tracking)
4. `wrap_completion` view + multiplier-aware leaderboard update

---

## 📜 Smart contract architecture

```
ChippyChain (game logic)
   ├── claimServe()      → mints $CHIP + NewspaperWrap NFT, fee → Treasury
   ├── buyAutoServe()     → one-time subscription, fee → Treasury
   ├── withdrawProfile()  → moves profile balance to onchain $CHIP, fee → Treasury
   ├── creditProfile()    → backend-only, credits auto-serve earnings (100 every 10 min)
   └── getPlayerData()    → returns full player stats in one call

ChipToken ($CHIP)
   └── Non-transferable ERC-20, mint-only by ChippyChain

NewspaperWrap (NFT)
   └── ERC-721, minted on every manual serve with randomised headline + rarity
       (10 headlines × normal/rare = 20 collectible types)

ChipTreasury
   └── Collects all protocol fees, owner-withdrawable with onchain reason log
```

---

## 📁 Project structure

```
chipchain-app/
├── app/
│   ├── page.tsx              # Main game UI (Play / Top 50 / Profile tabs)
│   ├── layout.tsx
│   ├── icon.png               # Favicon
│   ├── apple-icon.png         # Apple touch icon
│   ├── robots.ts              # robots.txt generation
│   ├── sitemap.ts             # sitemap.xml generation
│   ├── providers.tsx         # wagmi + OnchainKit providers
│   ├── welcome/
│   │   ├── page.tsx           # Marketing landing page
│   │   └── layout.tsx         # OG/Twitter metadata for /welcome
│   └── api/
│       ├── serve/route.ts        # Records serves + wrap mints
│       ├── profile/route.ts      # Player profile read/update
│       ├── leaderboard/route.ts  # Top 50 + your rank
│       ├── wraps/route.ts        # Collection counts
│       └── cron/route.ts         # Auto Serve credit (100 every 10 min)
├── components/
│   ├── Leaderboard.tsx       # Top 50, resolves Basenames via OnchainKit
│   ├── WrapGallery.tsx       # 20-card collection grid + multiplier progress
│   ├── FAQ.tsx
│   └── Roadmap.tsx
├── hooks/
│   ├── usePlayerProfile.ts
│   ├── useServe.ts
│   ├── useAutoServe.ts
│   ├── useLeaderboard.ts
│   └── useWraps.ts
├── public/
│   └── branding/              # Logos, shop background, OG images
└── lib/
    ├── contracts.ts          # ABIs, addresses, headlines
    ├── wagmi.ts
    └── supabase.ts
```

---

## 📄 License

MIT
