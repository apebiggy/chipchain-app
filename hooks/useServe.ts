'use client'
import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, GAME_ABI, randomHeadline } from '@/lib/contracts'
import { useFees } from '@/hooks/useFees'

export type ServeStatus = 'idle' | 'signing' | 'pending' | 'confirmed' | 'error'

export function useServe() {
  const [status, setStatus] = useState<ServeStatus>('idle')
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<string | null>(null)

  const { writeContractAsync } = useWriteContract()
  const { serveFee } = useFees()

  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  async function serve(chipAmount: number, address: string) {
    try {
      setStatus('signing')
      setError(null)

      const { headline, headlineIndex, rare } = randomHeadline()

      const hash = await writeContractAsync({
        address: CONTRACTS.GAME_CONTRACT,
        abi: GAME_ABI,
        functionName: 'claimServe',
        args: [BigInt(chipAmount), headline, headlineIndex, rare],
        value: serveFee,
      })

      setTxHash(hash)
      setStatus('pending')

      // Record in Supabase
      await fetch('/api/serve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: address,
          chipAmount,
          txHash: hash,
          headline,
          headlineIndex,
          rare,
        }),
      })

      setStatus('confirmed')
      return hash

    } catch (err: any) {
      setStatus('error')
      setError(err?.shortMessage || err?.message || 'Transaction failed')
      throw err
    }
  }

  function reset() {
    setStatus('idle')
    setTxHash(undefined)
    setError(null)
  }

  return { serve, status, txHash, error, isSuccess, reset }
}
