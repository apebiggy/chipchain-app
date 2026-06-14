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
  totalServed:   number
  totalEarned:   number
  ethBalance:    string
  // Offchain (Supabase)
  servedToday:   number
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
        .select('served_today, basename')
        .single()
      if (data) {
        setServedToday(data.served_today ?? 0)
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
  const totalServed   = playerData ? Number(playerData[2]) : 0
  const totalEarned   = playerData ? Number(playerData[3]) : 0
  const chipBalance   = chipBal    ? Number(chipBal)        : 0

  return {
    chipBalance,
    hasAutoServe,
    profileChip,
    totalServed,
    totalEarned,
    ethBalance: ethBal ? `${parseFloat(ethBal.formatted).toFixed(6)} ETH` : '0 ETH',
    servedToday,
    basename,
    isLoading:   pdLoading || chipLoading,
    isConnected,
    address,
    refetch,
  }
}
