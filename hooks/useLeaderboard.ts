'use client'
import { useEffect, useState, useCallback } from 'react'
export interface LeaderEntry { wallet_address:string; basename:string|null; profile_chip:number; total_served:number; onchain_chip:number; total_chip:number }
export function formatAddress(addr:string){ return addr.slice(0,6)+'...'+addr.slice(-4) }
export function formatName(e:LeaderEntry){ return e.basename || formatAddress(e.wallet_address) }
export function useLeaderboard(interval=30000) {
  const [leaders,setLeaders]=useState<LeaderEntry[]>([])
  const [loading,setLoading]=useState(true)
  const [lastUpdate,setLastUpdate]=useState<Date|null>(null)
  const fetch_=useCallback(async()=>{
    try{ const r=await fetch('/api/leaderboard'); setLeaders(await r.json()); setLastUpdate(new Date()) }
    catch(e){ console.error(e) } finally{ setLoading(false) }
  },[])
  useEffect(()=>{ fetch_(); const t=setInterval(fetch_,interval); return ()=>clearInterval(t) },[fetch_,interval])
  return { leaders, loading, lastUpdate, refetch:fetch_ }
}
