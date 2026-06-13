'use client'
import { useEffect, useState, useCallback } from 'react'

export interface CollectionEntry {
  headline_index: number
  rare:           boolean
  count:          number
  last_minted:    string
}

export function useWraps(address: string | undefined) {
  const [collection, setCollection] = useState<CollectionEntry[]>([])
  const [loading,    setLoading]    = useState(true)

  const fetch_ = useCallback(async () => {
    if (!address) { setCollection([]); setLoading(false); return }
    try {
      const res  = await fetch(`/api/wraps?wallet=${address}`)
      const data = await res.json()
      setCollection(data.collection || [])
    } catch (err) {
      console.error('Wraps fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { fetch_() }, [fetch_])

  return { collection, loading, refetch: fetch_ }
}
