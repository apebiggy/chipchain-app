# Chip Chain — Next.js App Setup

## Your contract addresses (Base Mainnet)
- CHIP_TOKEN:     0xa840fd34783438dd09B8eA6EA6ad70fF88d25C4E
- WRAP_NFT:       0x9ab1860fBE07140755C71aa7F990fb6681Fe9B84
- TREASURY:       0x8bf32413417dF502A5E8C7E3576F019cF4c10B22
- GAME_CONTRACT:  0xe0683F840949976C0f7304f5AA6B9b9450Ae9c4c

(Testnet/Base Sepolia v1 addresses, for local dev only — set NEXT_PUBLIC_CHAIN_ID=84532 to use these instead:
CHIP_TOKEN 0x8bf32413417dF502A5E8C7E3576F019cF4c10B22 · WRAP_NFT 0xa840fd34783438dd09B8eA6EA6ad70fF88d25C4E ·
TREASURY 0x331f36834E8446B00054AaD0655077fcF90F7409 · GAME_CONTRACT 0x2b494475705d6197014f0BD06f909398688bd169)

## Step 1 — Install and run locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Opens at http://localhost:3000
```

## Step 2 — Fill in .env.local

Open .env.local and fill in:
1. NEXT_PUBLIC_CDP_PROJECT_ID  → get from portal.cdp.coinbase.com
2. NEXT_PUBLIC_ONCHAINKIT_API_KEY → same portal
3. NEXT_PUBLIC_SUPABASE_URL → from supabase.com project settings
4. NEXT_PUBLIC_SUPABASE_ANON_KEY → from supabase.com
5. SUPABASE_SERVICE_KEY → from supabase.com
6. BACKEND_PRIVATE_KEY → your second MetaMask wallet private key
7. CRON_SECRET → any random string e.g. "chipchain-cron-2024"

## Step 3 — Set up Supabase

In Supabase SQL editor, run:

```sql
CREATE TABLE players (
  wallet_address    TEXT PRIMARY KEY,
  basename          TEXT,
  profile_chip      INTEGER DEFAULT 0,
  served_today      INTEGER DEFAULT 0,
  total_served      INTEGER DEFAULT 0,
  auto_serve_active BOOLEAN DEFAULT false,
  last_seen         TIMESTAMP DEFAULT now(),
  created_at        TIMESTAMP DEFAULT now()
);

CREATE TABLE serves (
  id             BIGSERIAL PRIMARY KEY,
  wallet_address TEXT,
  chip_amount    INTEGER,
  type           TEXT,
  tx_hash        TEXT,
  headline       TEXT,
  rare           BOOLEAN DEFAULT false,
  created_at     TIMESTAMP DEFAULT now()
);

CREATE TABLE auto_serve_log (
  id             BIGSERIAL PRIMARY KEY,
  wallet_address TEXT,
  chips_earned   INTEGER,
  created_at     TIMESTAMP DEFAULT now()
);

CREATE OR REPLACE FUNCTION increment_served(wallet_addr TEXT)
RETURNS void AS $$
  UPDATE players
  SET served_today = served_today + 1,
      total_served = total_served + 1
  WHERE wallet_address = wallet_addr;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION add_profile_chip(wallet_addr TEXT, amount INTEGER)
RETURNS void AS $$
  UPDATE players
  SET profile_chip = profile_chip + amount
  WHERE wallet_address = wallet_addr;
$$ LANGUAGE sql;
```

## Step 4 — Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add all .env.local variables to Vercel dashboard:
Project → Settings → Environment Variables

## Step 5 — Test

1. Open http://localhost:3000
2. Connect MetaMask (Base Mainnet)
3. Press GET NEXT CUSTOMER
4. Pick menu items
5. Press SERVE IT → MetaMask should pop up with the current serve fee (read live via getFees() — check Basescan if unsure of the exact current value)
6. Confirm → check basescan.org for the transaction
