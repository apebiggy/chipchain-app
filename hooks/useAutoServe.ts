'use client'
import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, GAME_ABI, AUTO_SERVE_FEE, WITHDRAW_FEE } from '@/lib/contracts'

export type TxStatus = 'idle' | 'signing' | 'pending' | 'confirmed' | 'error'

export function useAutoServe() {
  const { address } = useAccount()
  const [buyStatus,      setBuyStatus]      = useState<TxStatus>('idle')
  const [withdrawStatus, setWithdrawStatus] = useState<TxStatus>('idle')
  const [buyHash,        setBuyHash]        = useState<`0x${string}` | undefined>()
  const [withdrawHash,   setWithdrawHash]   = useState<`0x${string}` | undefined>()
  const [error,          setError]          = useState<string | null>(null)

  const { writeContractAsync } = useWriteContract()

  useWaitForTransactionReceipt({ hash: buyHash })
  useWaitForTransactionReceipt({ hash: withdrawHash })

  async function buyAutoServe() {
    try {
      setBuyStatus('signing')
      setError(null)
      const hash = await writeContractAsync({
        address: CONTRACTS.GAME_CONTRACT,
        abi: GAME_ABI,
        functionName: 'buyAutoServe',
        args: [],
        value: AUTO_SERVE_FEE,
      })
      setBuyHash(hash)
      setBuyStatus('pending')

      // Mark as active in Supabase
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address ?? '',
        },
        body: JSON.stringify({ action: 'activate_autoserve' }),
      })

      setBuyStatus('confirmed')
      return hash
    } catch (err: any) {
      setBuyStatus('error')
      setError(err?.shortMessage || 'Transaction failed')
      throw err
    }
  }

  async function withdrawProfile() {
    try {
      setWithdrawStatus('signing')
      setError(null)
      const hash = await writeContractAsync({
        address: CONTRACTS.GAME_CONTRACT,
        abi: GAME_ABI,
        functionName: 'withdrawProfile',
        args: [],
        value: WITHDRAW_FEE,
      })
      setWithdrawHash(hash)
      setWithdrawStatus('pending')

      // Clear profile balance in Supabase (and record withdrawal for leaderboard sync)
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address ?? '',
        },
        body: JSON.stringify({ action: 'clear_profile_chip', txHash: hash }),
      })

      setWithdrawStatus('confirmed')
      return hash
    } catch (err: any) {
      setWithdrawStatus('error')
      setError(err?.shortMessage || 'Transaction failed')
      throw err
    }
  }

  return {
    buyAutoServe,
    withdrawProfile,
    buyStatus,
    withdrawStatus,
    error,
  }
}
