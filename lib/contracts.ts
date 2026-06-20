// ── Contract addresses ─────────────────────────────────────────
export const CONTRACTS = {
  CHIP_TOKEN:    process.env.NEXT_PUBLIC_CHIP_TOKEN    as `0x${string}`,
  WRAP_NFT:      process.env.NEXT_PUBLIC_WRAP_NFT      as `0x${string}`,
  TREASURY:      process.env.NEXT_PUBLIC_TREASURY      as `0x${string}`,
  GAME_CONTRACT: process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`,
}

// ── Fees ───────────────────────────────────────────────────────
export const SERVE_FEE      = BigInt("4000000000000")     // 0.000004 ETH in wei
export const WITHDRAW_FEE   = BigInt("4000000000000")     // 0.000004 ETH in wei
export const AUTO_SERVE_FEE = BigInt("3000000000000000")  // 0.003 ETH in wei

// ── ChippyChain ABI ────────────────────────────────────────────
export const GAME_ABI = [
  {
    name: "claimServe",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "chipAmount",    type: "uint256" },
      { name: "headline",      type: "string"  },
      { name: "headlineIndex", type: "uint8"   },
      { name: "rare",          type: "bool"    },
    ],
    outputs: [],
  },
  {
    name: "buyAutoServe",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    name: "withdrawProfile",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    name: "getPlayerData",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "player", type: "address" }],
    outputs: [
      { name: "hasAutoServe", type: "bool"    },
      { name: "profileChip",  type: "uint256" },
      { name: "served",       type: "uint256" },
      { name: "totalEarned",  type: "uint256" },
      { name: "hasMultiplier", type: "bool"   },
    ],
  },
  {
    name: "autoServeHolders",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "profileBalance",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const

// ── ChipToken ABI ──────────────────────────────────────────────
export const CHIP_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "pointsBalance",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const

// ── Treasury ABI ───────────────────────────────────────────────
export const TREASURY_ABI = [
  {
    name: "getStats",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "balance",         type: "uint256" },
      { name: "deposited",       type: "uint256" },
      { name: "withdrawn",       type: "uint256" },
      { name: "withdrawalCount", type: "uint256" },
    ],
  },
] as const

// ── Newspaper headlines ────────────────────────────────────────
export const HEADLINES = [
  "CHIPS TOO SOGGY, SAYS BLOKE FROM KETTERING",
  "LOCAL CHIPPY GOES ONCHAIN — WIFE BAFFLED",
  "CURRY SAUCE VOTED NATIONAL TREASURE",
  "MAN FINDS RARE NFT IN FISH SUPPER",
  "CHIPPY OWNER BECOMES BASE MILLIONAIRE",
  "VINEGAR LEVELS CRITICALLY LOW, WARNS CHIEF",
  "MUSHY PEAS DAO SPLITS TOWN IN TWO",
  "BATTERED MARS BAR MAKES SHOCK COMEBACK",
  "SEAGULL NICKS LAST CHIP — ABSOLUTE DISGRACE",
  "BLOKE EATS 47 CHIPS IN 60 SECONDS",
]

export function randomHeadline(): { headline: string; headlineIndex: number; rare: boolean } {
  const headlineIndex = Math.floor(Math.random() * HEADLINES.length)
  const headline = HEADLINES[headlineIndex]
  const rare = Math.random() < 0.1
  return { headline, headlineIndex, rare }
}

// ── NewspaperWrap ABI ──────────────────────────────────────────
export const WRAP_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getWrap",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "headline",      type: "string"  },
      { name: "rare",          type: "bool"    },
      { name: "blockNum",      type: "uint256" },
      { name: "originalOwner", type: "address" },
      { name: "serveNumber",   type: "uint256" },
    ],
  },
  {
    name: "hasCompleteCollection",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "player", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "uniqueTypesOwned",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "WrapMinted",
    type: "event",
    inputs: [
      { name: "player",  type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: false },
      { name: "rare",    type: "bool",    indexed: false },
    ],
  },
] as const
