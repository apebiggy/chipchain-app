'use client'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useBalance } from 'wagmi'
import { supabase } from '@/lib/supabase'
import { CONTRACTS, GAME_ABI, CHIP_ABI } from '@/lib/contracts'

export interface PlayerProfile {
  // Onchain
  chipBalance:   number
  hasAutoServe:  boolean
  profileChip:   number
  mainnetServed: number  // serves on the current mainnet contract only (resets on redeploy)
  totalEarned:   number
  hasMultiplier: boolean
  ethBalance:    string
  ethBalanceWei: bigint
  // Offchain (Supabase) — combined testnet + mainnet, matches leaderboard
  totalServed:   number
  servedToday:   number  // NOTE: despite the name, this is a lifetime count, not daily — see usePlayerProfile.ts
  basename:      string | null
  // Status
  isLoading:     boolean
  isConnected:   boolean
  address:       `0x${string}` | undefined
  // Refetch
  refetch:       () => void
}

export function usePlayerProfile(): PlayerProfile {
  const { address, isConnected } = useAccount()
  const [servedToday, setServedToday] = useState(0)
  const [combinedServed, setCombinedServed] = useState(0)
  const [basename, setBasename] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  // ── Onchain reads ────────────────────────────────────────────
  const { data: playerData, isLoading: pdLoading, refetch: refetchPd } = useReadContract({
    address: CONTRACTS.GAME_CONTRACT,
    abi: GAME_ABI,
    functionName: 'getPlayerData',
    args: [address!],
    query: { enabled: !!address, refetchInterval: 15_000 },
  })

  const { data: chipBal, isLoading: chipLoading, refetch: refetchChip } = useReadContract({
    address: CONTRACTS.CHIP_TOKEN,
    abi: CHIP_ABI,
    functionName: 'pointsBalance',
    args: [address!],
    query: { enabled: !!address, refetchInterval: 15_000 },
  })

  const { data: ethBal } = useBalance({
    address,
    query: { enabled: !!address },
  })

  // ── Supabase profile ─────────────────────────────────────────
  useEffect(() => {
    if (!address) return
    async function loadProfile() {
      const { data } = await supabase
        .from('players')
        .upsert(
          { wallet_address: address, last_seen: new Date().toISOString() },
          { onConflict: 'wallet_address', ignoreDuplicates: false }
        )
        .select('served_today, total_served, basename')
        .single()
      if (data) {
        setServedToday(data.served_today ?? 0)
        setCombinedServed(data.total_served ?? 0)
        setBasename(data.basename ?? null)
      }
    }
    loadProfile()
  }, [address, tick])

  function refetch() {
    refetchPd()
    refetchChip()
    setTick(t => t + 1)
  }

  const hasAutoServe  = playerData ? Boolean(playerData[0]) : false
  const profileChip   = playerData ? Number(playerData[1]) : 0
  const mainnetServed = playerData ? Number(playerData[2]) : 0
  const totalEarned   = playerData ? Number(playerData[3]) : 0
  const hasMultiplier = playerData ? Boolean(playerData[4]) : false
  const chipBalance   = chipBal    ? Number(chipBal)        : 0

  // ── Self-heal: if onchain says Auto Serve is active but the one-time
  // post-purchase Supabase PATCH silently failed (no error handling there),
  // the cron job would otherwise never see this wallet and Profile $CHIP
  // would stay stuck at 0 forever. Reconcile once per address per session —
  // onchain is the source of truth, so this is always safe/idempotent.
  const reconciledRef = useState(() => new Set<string>())[0]
  useEffect(() => {
    if (!address || !hasAutoServe) return
    const key = address.toLowerCase()
    if (reconciledRef.has(key)) return
    reconciledRef.add(key)

    fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-wallet-address': address },
      body: JSON.stringify({ action: 'activate_autoserve' }),
    }).catch(() => {
      // Will retry next mount/address-change; harmless no-op until then.
      reconciledRef.delete(key)
    })
  }, [address, hasAutoServe, reconciledRef])

  return {
    chipBalance,
    hasAutoServe,
    profileChip,
    mainnetServed,
    totalEarned,
    hasMultiplier,
    ethBalance: ethBal ? `${parseFloat(ethBal.formatted).toFixed(6)} ETH` : '0 ETH',
    ethBalanceWei: ethBal ? ethBal.value : BigInt(0),
    totalServed: combinedServed,
    servedToday,
    basename,
    isLoading:   pdLoading || chipLoading,
    isConnected,
    address,
    refetch,
  }
}
