'use client'
import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, GAME_ABI, BUILDER_CODE_SUFFIX } from '@/lib/contracts'
import { useFees } from '@/hooks/useFees'

export type TxStatus = 'idle' | 'signing' | 'pending' | 'confirmed' | 'error'

export function useAutoServe() {
  const { address } = useAccount()
  const [buyStatus,      setBuyStatus]      = useState<TxStatus>('idle')
  const [withdrawStatus, setWithdrawStatus] = useState<TxStatus>('idle')
  const [buyHash,        setBuyHash]        = useState<`0x${string}` | undefined>()
  const [withdrawHash,   setWithdrawHash]   = useState<`0x${string}` | undefined>()
  const [error,          setError]          = useState<string | null>(null)

  const { writeContractAsync } = useWriteContract()
  const { autoServeFee, withdrawFee } = useFees()

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
        value: autoServeFee,
        dataSuffix: BUILDER_CODE_SUFFIX,
      })
      setBuyHash(hash)
      setBuyStatus('pending')

      // Mark as active in Supabase — retry a couple times since this is
      // the only thing that gets this wallet into the cron job's player
      // list. (usePlayerProfile also self-heals this on next page load
      // as a backstop, but we still want to catch failures here.)
      let activated = false
      for (let i = 0; i < 3 && !activated; i++) {
        try {
          const res = await fetch('/api/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'x-wallet-address': address ?? '',
            },
            body: JSON.stringify({ action: 'activate_autoserve' }),
          })
          activated = res.ok
        } catch {
          // network error — retry
        }
        if (!activated && i < 2) await new Promise(r => setTimeout(r, 1000))
      }
      if (!activated) {
        console.warn('Auto Serve activated onchain but Supabase sync failed — will self-heal on next page load')
      }

      setBuyStatus('confirmed')
      return hash
    } catch (err: any) {
      console.error('buyAutoServe error:', err)
      setBuyStatus('error')
      setError(err?.shortMessage || 'Transaction failed')
      throw err
    }
  }

  async function withdrawProfile(onchainAmount: number) {
    try {
      setWithdrawStatus('signing')
      setError(null)
      const hash = await writeContractAsync({
        address: CONTRACTS.GAME_CONTRACT,
        abi: GAME_ABI,
        functionName: 'withdrawProfile',
        args: [],
        value: withdrawFee,
        dataSuffix: BUILDER_CODE_SUFFIX,
      })
      setWithdrawHash(hash)
      setWithdrawStatus('pending')

      // Clear profile balance in Supabase (and record withdrawal for leaderboard
      // sync) — pass the live onchain amount read just before this call, not
      // whatever Supabase's own profile_chip column currently holds, since
      // those two can drift out of sync.
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address ?? '',
        },
        body: JSON.stringify({ action: 'clear_profile_chip', txHash: hash, onchainAmount }),
      })

      setWithdrawStatus('confirmed')
      return hash
    } catch (err: any) {
      console.error('withdrawProfile error:', err)
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
