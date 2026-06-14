'use client'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useBalance } from 'wagmi'
import { supabase } from '@/lib/supabase'
import { CONTRACTS, GAME_ABI, CHIP_ABI } from '@/lib/contracts'

export function usePlayerProfile() {
  const { address, isConnected } = useAccount()
  const [servedToday, setServedToday] = useState(0)
  const [tick, setTick] = useState(0)

  const { data: playerData, isLoading, refetch: refetchPd } = useReadContract({
    address: CONTRACTS.GAME_CONTRACT, abi: GAME_ABI, functionName: 'getPlayerData',
    args: [address!], query: { enabled: !!address },
  })
  const { data: chipBal, refetch: refetchChip } = useReadContract({
    address: CONTRACTS.CHIP_TOKEN, abi: CHIP_ABI, functionName: 'pointsBalance',
    args: [address!], query: { enabled: !!address },
  })
  const { data: ethBal } = useBalance({ address, query: { enabled: !!address } })

  useEffect(() => {
    if (!address) return
    supabase.from('players')
      .upsert({ wallet_address: address, last_seen: new Date().toISOString() }, { onConflict: 'wallet_address', ignoreDuplicates: false })
      .select('served_today').single()
      .then(({ data }: { data: { served_today: number } | null }) => { if (data) setServedToday(data.served_today ?? 0) })
  }, [address, tick])

  function refetch() { refetchPd(); refetchChip(); setTick(t => t + 1) }

  return {
    chipBalance:  chipBal ? Number(chipBal) : 0,
    hasAutoServe: playerData ? Boolean(playerData[0]) : false,
    profileChip:  playerData ? Number(playerData[1]) : 0,
    totalServed:  playerData ? Number(playerData[2]) : 0,
    totalEarned:  playerData ? Number(playerData[3]) : 0,
    ethBalance:   ethBal ? parseFloat(ethBal.formatted).toFixed(6) + ' ETH' : '0 ETH',
    servedToday, isLoading, isConnected, address, refetch,
  }
}
