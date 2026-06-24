'use client'
import { useEffect, useState, useCallback } from 'react'

export interface LeaderEntry {
  wallet_address:      string
  basename:            string | null
  chip_balance:        number
  profile_chip:        number
  total_chip:          number
  wrap_count:          number
  total_served:        number
  auto_serve_active:   boolean
  collection_complete: boolean
  rank:                number
}

export function formatAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function formatName(entry: { basename: string | null; wallet_address: string }): string {
  return entry.basename || formatAddress(entry.wallet_address)
}

export function useLeaderboard(currentAddress: string | undefined, interval = 30000) {
  const [top50,      setTop50]      = useState<LeaderEntry[]>([])
  const [you,        setYou]        = useState<LeaderEntry | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error,      setError]      = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    try {
      const url = currentAddress
        ? `/api/leaderboard?wallet=${currentAddress}`
        : '/api/leaderboard'
      const res  = await fetch(url)
      const data = await res.json()
      if (data.error) setError(data.error)
      setTop50(data.top50 || [])
      setYou(data.you || null)
      setLastUpdate(new Date())
    } catch (err: any) {
      console.error('Leaderboard fetch failed:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [currentAddress])

  useEffect(() => {
    fetch_()
    const t = setInterval(fetch_, interval)
    return () => clearInterval(t)
  }, [fetch_, interval])

  return { top50, you, loading, lastUpdate, error, refetch: fetch_ }
}
