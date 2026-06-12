export const CONTRACTS = {
  CHIP_TOKEN:    process.env.NEXT_PUBLIC_CHIP_TOKEN    as `0x${string}`,
  WRAP_NFT:      process.env.NEXT_PUBLIC_WRAP_NFT      as `0x${string}`,
  TREASURY:      process.env.NEXT_PUBLIC_TREASURY      as `0x${string}`,
  GAME_CONTRACT: process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`,
}
export const SERVE_FEE      = BigInt("4000000000000")
export const WITHDRAW_FEE   = BigInt("4000000000000")
export const AUTO_SERVE_FEE = BigInt("1600000000000000")
export const GAME_ABI = [
  { name:"claimServe",type:"function",stateMutability:"payable",inputs:[{name:"chipAmount",type:"uint256"},{name:"headline",type:"string"},{name:"rare",type:"bool"}],outputs:[] },
  { name:"buyAutoServe",type:"function",stateMutability:"payable",inputs:[],outputs:[] },
  { name:"withdrawProfile",type:"function",stateMutability:"payable",inputs:[],outputs:[] },
  { name:"getPlayerData",type:"function",stateMutability:"view",inputs:[{name:"player",type:"address"}],outputs:[{name:"hasAutoServe",type:"bool"},{name:"profileChip",type:"uint256"},{name:"served",type:"uint256"},{name:"totalEarned",type:"uint256"}] },
] as const
export const CHIP_ABI = [
  { name:"pointsBalance",type:"function",stateMutability:"view",inputs:[{name:"account",type:"address"}],outputs:[{name:"",type:"uint256"}] },
] as const
export const HEADLINES = ["CHIPS TOO SOGGY, SAYS BLOKE FROM KETTERING","LOCAL CHIPPY GOES ONCHAIN — WIFE BAFFLED","CURRY SAUCE VOTED NATIONAL TREASURE","MAN FINDS RARE NFT IN FISH SUPPER","CHIPPY OWNER BECOMES BASE MILLIONAIRE","VINEGAR LEVELS CRITICALLY LOW","MUSHY PEAS DAO SPLITS TOWN IN TWO","BATTERED MARS BAR MAKES SHOCK COMEBACK","BLOKE EATS 47 CHIPS IN 60 SECONDS"]
export function randomHeadline(){return{headline:HEADLINES[Math.floor(Math.random()*HEADLINES.length)],rare:Math.random()<0.1}}
