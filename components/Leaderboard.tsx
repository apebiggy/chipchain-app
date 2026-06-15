'use client'
import { useName } from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'
import { useLeaderboard, formatName, formatAddress, LeaderEntry } from '@/hooks/useLeaderboard'

interface Props { currentAddress?: string }

const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function LeaderRow({ entry, isYou, isPinned = false }: { entry: LeaderEntry; isYou: boolean; isPinned?: boolean }) {
  // Resolve Basename onchain (Base mainnet registry) for this address.
  // `as any` works around a type-only mismatch between the project's viem
  // version and OnchainKit's internally bundled viem (Chain type shapes differ
  // structurally but are runtime-compatible).
  const { data: resolvedName, isLoading: nameLoading } = useName({
    address: entry.wallet_address as `0x${string}`,
    chain: base as any,
  })

  const fallback = formatName(entry)
  const name = resolvedName || fallback
  const isBase = !nameLoading && (name.endsWith('.base') || name.endsWith('.base.eth'))
  const baseLabel = name.replace(/\.base(\.eth)?$/, '')
  const baseSuffix = name.endsWith('.base.eth') ? '.base.eth' : '.base'

  return (
    <div
      style={{
        ...S.row,
        background: isYou ? '#e8f0ff' : 'transparent',
        borderLeft: isYou ? '3px solid #0052ff' : '3px solid transparent',
        borderTop: isPinned ? '2px dashed #ddd' : undefined,
      }}
    >
      <span style={S.rank}>{medals[entry.rank] || `#${entry.rank}`}</span>
      <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', minWidth: 0 }}>
        {isBase ? (
          <span>
            <span style={S.baseName}>{baseLabel}</span>
            <span style={S.baseSuffix}>{baseSuffix}</span>
          </span>
        ) : (
          <span style={S.address}>{nameLoading ? formatAddress(entry.wallet_address) : name}</span>
        )}
        {isYou && <span style={S.youBadge}>YOU</span>}
      </span>
      <span style={S.served}>{entry.total_served.toLocaleString()}</span>
      <span style={S.chip}>
        {entry.total_chip.toLocaleString()}
        {entry.collection_complete && <span style={S.multiplierBadge}>2x</span>}
      </span>
    </div>
  )
}

export function Leaderboard({ currentAddress }: Props) {
  const { top50, you, loading, lastUpdate } = useLeaderboard(currentAddress, 30000)

  if (loading) {
    return (
      <div style={S.container}>
        <div style={S.header}>🏆 Top 50 · Chip Chain</div>
        <div style={S.empty}>Loading leaderboard...</div>
      </div>
    )
  }

  if (!top50.length) {
    return (
      <div style={S.container}>
        <div style={S.header}>🏆 Top 50 · Chip Chain</div>
        <div style={S.empty}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🍟</div>
          No players yet — be the first to serve!
        </div>
      </div>
    )
  }

  return (
    <div style={S.container}>
      <div style={S.header}>
        <span>🏆 Top 50 · Chip Chain</span>
        {lastUpdate && <span style={S.updated}>Updated {lastUpdate.toLocaleTimeString()}</span>}
      </div>

      <div style={S.colHeaders}>
        <span style={{ width: 28 }}>#</span>
        <span style={{ flex: 1 }}>Player</span>
        <span style={{ width: 52, textAlign: 'right' }}>Served</span>
        <span style={{ width: 72, textAlign: 'right' }}>$CHIP</span>
      </div>

      <div style={S.scroll}>
        {top50.map((entry) => (
          <LeaderRow
            key={entry.wallet_address}
            entry={entry}
            isYou={currentAddress?.toLowerCase() === entry.wallet_address.toLowerCase()}
          />
        ))}

        {/* Pinned "you" row if outside top 50 */}
        {you && <LeaderRow key={`you-${you.wallet_address}`} entry={you} isYou isPinned />}
      </div>

      <div style={S.footer}>
        Live · Refreshes every 30s · {top50.length} players shown
        {you && (
          <span style={{ display: 'block', marginTop: 2, color: '#0052ff', fontWeight: 900 }}>
            Your rank: #{you.rank}
          </span>
        )}
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  container:  { background: '#fff', border: '3px solid #111', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  header:     { background: '#1757a8', color: '#fff', padding: '10px 14px', fontFamily: 'serif', fontSize: 16, fontWeight: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  updated:    { fontSize: 10, color: 'rgba(255,255,255,.6)', fontWeight: 400 },
  colHeaders: { display: 'flex', padding: '4px 8px', fontSize: 9, fontWeight: 900, color: '#aaa', letterSpacing: 1.5, textTransform: 'uppercase', borderBottom: '1.5px solid #eee', gap: 6 },
  scroll:     { overflowY: 'auto', maxHeight: 420 },
  row:        { display: 'flex', alignItems: 'center', padding: '7px 8px', gap: 6, borderBottom: '1px solid #f0f0f0', fontSize: 13 },
  rank:       { width: 28, fontWeight: 900, fontSize: 13, color: '#888', flexShrink: 0 },
  baseName:   { fontWeight: 900, color: '#111' },
  baseSuffix: { color: '#0052ff', fontWeight: 900 },
  address:    { fontFamily: 'monospace', fontSize: 10.5, color: '#888', whiteSpace: 'nowrap' },
  youBadge:   { marginLeft: 6, background: '#0052ff', color: '#fff', fontSize: 8, fontWeight: 900, padding: '1px 5px', borderRadius: 3 },
  served:     { width: 52, textAlign: 'right', color: '#888', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  chip:       { width: 72, textAlign: 'right', color: '#e67e22', fontWeight: 900, fontSize: 13, flexShrink: 0 },
  multiplierBadge: {
    marginLeft: 4, background: '#FFD700', color: '#111', fontSize: 9, fontWeight: 900,
    padding: '1px 4px', borderRadius: 3, border: '1px solid #cc1111',
  },
  empty:      { padding: 32, textAlign: 'center', color: '#aaa', fontWeight: 700, fontSize: 13 },
  footer:     { padding: '8px 12px', fontSize: 10, color: '#bbb', borderTop: '1px solid #f0f0f0', textAlign: 'center' },
}
