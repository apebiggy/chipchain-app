'use client'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { CONTRACTS, GAME_ABI, AUTO_SERVE_FEE, WITHDRAW_FEE } from '@/lib/contracts'

export type TxStatus = 'idle'|'signing'|'pending'|'confirmed'|'error'

export function useAutoServe() {
  const [buyStatus,      setBuyStatus]      = useState<TxStatus>('idle')
  const [withdrawStatus, setWithdrawStatus] = useState<TxStatus>('idle')
  const { writeContractAsync } = useWriteContract()

  async function buyAutoServe() {
    try {
      setBuyStatus('signing')
      const hash = await writeContractAsync({ address:CONTRACTS.GAME_CONTRACT, abi:GAME_ABI, functionName:'buyAutoServe', args:[], value:AUTO_SERVE_FEE })
      setBuyStatus('pending')
      await fetch('/api/profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'activate_autoserve'})})
      setBuyStatus('confirmed'); return hash
    } catch(err:any){ setBuyStatus('error'); throw err }
  }

  async function withdrawProfile() {
    try {
      setWithdrawStatus('signing')
      const hash = await writeContractAsync({ address:CONTRACTS.GAME_CONTRACT, abi:GAME_ABI, functionName:'withdrawProfile', args:[], value:WITHDRAW_FEE })
      setWithdrawStatus('pending')
      await fetch('/api/profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'clear_profile_chip'})})
      setWithdrawStatus('confirmed'); return hash
    } catch(err:any){ setWithdrawStatus('error'); throw err }
  }
  return { buyAutoServe, withdrawProfile, buyStatus, withdrawStatus }
}
