'use client'
import { useReadContract } from 'wagmi'
import {
  CONTRACTS,
  GAME_ABI,
  SERVE_FEE_FALLBACK,
  WITHDRAW_FEE_FALLBACK,
  AUTO_SERVE_FEE_FALLBACK,
} from '@/lib/contracts'

/**
 * Reads the current serve/withdraw/auto-serve fees LIVE from the
 * ChippyChain contract via getFees(). This is the single source of
 * truth — never hardcode fee constants elsewhere, since they will
 * silently drift out of sync the moment the contract is redeployed
 * or fees are adjusted via setServeFee/setWithdrawFee/setAutoServeFee.
 *
 * Falls back to the last-known-good hardcoded values only until the
 * very first onchain read resolves (avoids a loading-state flash).
 */
export function useFees() {
  const { data, isLoading, isError } = useReadContract({
    address: CONTRACTS.GAME_CONTRACT,
    abi: GAME_ABI,
    functionName: 'getFees',
    query: {
      staleTime: 60_000, // fees rarely change; avoid hammering the RPC
    },
  })

  const serveFee      = data ? data[0] : SERVE_FEE_FALLBACK
  const withdrawFee   = data ? data[1] : WITHDRAW_FEE_FALLBACK
  const autoServeFee  = data ? data[2] : AUTO_SERVE_FEE_FALLBACK

  return { serveFee, withdrawFee, autoServeFee, isLoading, isError }
}
