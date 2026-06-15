'use client'
import { useEffect, useState } from 'react'
import { useWraps } from '@/hooks/useWraps'
import { HEADLINES } from '@/lib/contracts'

interface Props { address?: string }

export function WrapGallery({ address }: Props) {
  const { collection, loading } = useWraps(address)
  const [showCelebration, setShowCelebration] = useState(false)

  // Build a lookup: "index-rare" -> count
  const counts: Record<string, number> = {}
  collection.forEach(c => {
    counts[`${c.headline_index}-${c.rare}`] = c.count
  })

  const totalCollected = collection.reduce((sum, c) => sum + c.count, 0)
  const uniqueOwned    = collection.length
  const totalPossible  = HEADLINES.length * 2 // normal + rare per headline
  const rareOwned      = collection.filter(c => c.rare).reduce((sum, c) => sum + c.count, 0)

  // Show a one-time celebration the first time we detect a complete collection
  useEffect(() => {
    if (loading || !address) return
    if (uniqueOwned < totalPossible) return

    const flagKey = `chipchain_wrap_celebrated_${address.toLowerCase()}`
    try {
      if (!localStorage.getItem(flagKey)) {
        setShowCelebration(true)
        localStorage.setItem(flagKey, '1')
      }
    } catch {
      // localStorage unavailable (e.g. private browsing) — skip celebration
    }
  }, [loading, address, uniqueOwned, totalPossible])

  if (loading) {
    return (
      <div style={S.container}>
        <div style={S.header}>📰 Newspaper Wrap Collection</div>
        <div style={S.empty}>Loading your collection...</div>
      </div>
    )
  }

  return (
    <>
      {showCelebration && (
        <div style={S.modalOverlay} onClick={() => setShowCelebration(false)}>
          <div style={S.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalEmoji}>🎉🏆🎉</div>
            <div style={S.modalTitle}>COLLECTION COMPLETE!</div>
            <div style={S.modalSubtitle}>
              You've collected all {totalPossible} Newspaper Wraps — every headline, normal &amp; ⭐ rare!
            </div>
            <div style={S.modalMultiplier}>2x $CHIP multiplier unlocked</div>
            <div style={S.modalNote}>
              Applied to your leaderboard ranking and the upcoming rewards round
            </div>
            <button style={S.modalButton} onClick={() => setShowCelebration(false)}>
              Nice! 🍟
            </button>
          </div>
        </div>
      )}

      <div style={S.container}>
        <div style={S.header}>
          <span>📰 Newspaper Wrap Collection</span>
          <span style={S.count}>
            {uniqueOwned}/{totalPossible} types · {totalCollected} total
            {rareOwned > 0 ? ` · ${rareOwned} rare ⭐` : ''}
          </span>
        </div>

        {/* Multiplier progress */}
        <div style={S.multiplierBar}>
          {uniqueOwned >= totalPossible ? (
            <div style={S.multiplierComplete}>
              🏆 COLLECTION COMPLETE — <b>2x $CHIP multiplier active!</b>
            </div>
          ) : (
            <>
              <div style={S.multiplierText}>
                Collect all <b>{totalPossible}</b> wraps to unlock a <b>2x $CHIP multiplier</b> for the upcoming rewards round
              </div>
              <div style={S.progressTrack}>
                <div style={{ ...S.progressFill, width: `${(uniqueOwned / totalPossible) * 100}%` }} />
              </div>
              <div style={S.progressLabel}>{uniqueOwned} / {totalPossible} collected</div>
            </>
          )}
        </div>

        <div style={S.grid}>
          {HEADLINES.map((headline, idx) => (
            <div key={`normal-${idx}`} style={{ display: 'contents' }}>
              {/* Normal version */}
              {renderCard(headline, idx, false, counts[`${idx}-false`] || 0)}
              {/* Rare version */}
              {renderCard(headline, idx, true, counts[`${idx}-true`] || 0)}
            </div>
          ))}
        </div>

        <div style={S.footer}>
          Collect every headline in both normal and ⭐ rare editions — minted on every SERVE IT
        </div>
      </div>
    </>
  )
}

function renderCard(headline: string, idx: number, rare: boolean, count: number) {
  const owned = count > 0
  return (
    <div
      key={`${idx}-${rare}`}
      style={{
        ...S.card,
        ...(owned ? (rare ? S.cardRare : S.cardOwned) : S.cardLocked),
      }}
    >
      {rare && (
        <div style={{ ...S.rareBadge, ...(owned ? {} : S.rareBadgeLocked) }}>
          ⭐ RARE
        </div>
      )}
      <div style={S.masthead}>THE DAILY CHIP</div>
      <div style={owned ? S.headline : S.headlineLocked}>
        {owned ? headline : '???????????????????????'}
      </div>
      <div style={S.cardFooter}>
        {owned ? (
          <span style={S.countBadge}>×{count}</span>
        ) : (
          <span style={S.lockedText}>🔒 not yet</span>
        )}
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  modalCard: {
    background: '#FFD700', border: '4px solid #111', borderRadius: 14,
    boxShadow: '6px 6px 0 #111', padding: '28px 24px', maxWidth: 360,
    textAlign: 'center', fontFamily: 'serif',
  },
  modalEmoji:     { fontSize: 40, marginBottom: 8 },
  modalTitle:     { fontSize: 26, fontWeight: 900, color: '#cc1111', textShadow: '2px 2px 0 #111', letterSpacing: 1, marginBottom: 8 },
  modalSubtitle:  { fontSize: 13, color: '#333', marginBottom: 14, lineHeight: 1.4 },
  modalMultiplier: {
    background: '#27ae60', color: '#fff', fontWeight: 900, fontSize: 18,
    padding: '8px 14px', borderRadius: 8, border: '2px solid #111',
    boxShadow: '3px 3px 0 #111', marginBottom: 10, display: 'inline-block',
  },
  modalNote:   { fontSize: 11, color: '#555', marginBottom: 18, lineHeight: 1.4 },
  modalButton: {
    background: '#cc1111', color: '#fff', border: '3px solid #111', borderRadius: 8,
    padding: '10px 28px', fontWeight: 900, fontSize: 15, cursor: 'pointer',
    boxShadow: '3px 3px 0 #111',
  },
  container: { background: '#fff', border: '3px solid #111', borderRadius: 12, overflow: 'hidden' },
  header: {
    background: '#cc1111', color: '#fff', padding: '10px 14px', fontFamily: 'serif',
    fontSize: 16, fontWeight: 900, display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: 4,
  },
  count: { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.9)' },
  multiplierBar: {
    padding: '10px 12px', borderBottom: '1.5px solid #f0f0f0', background: '#fafafa',
  },
  multiplierText: { fontSize: 11, color: '#555', marginBottom: 6, lineHeight: 1.4 },
  progressTrack: {
    height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden', border: '1px solid #ddd',
  },
  progressFill: {
    height: '100%', background: 'linear-gradient(90deg, #FFD700, #e67e22)',
    borderRadius: 4, transition: 'width 0.3s',
  },
  progressLabel: { fontSize: 10, color: '#aaa', marginTop: 4, textAlign: 'right', fontWeight: 700 },
  multiplierComplete: {
    background: '#e8f9ee', border: '2px solid #27ae60', borderRadius: 6,
    padding: '8px 10px', fontSize: 12, color: '#1a7a42', textAlign: 'center', fontWeight: 700,
  },
  empty: { padding: 32, textAlign: 'center', color: '#aaa', fontWeight: 700, fontSize: 13 },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: 8, padding: 12,
  },
  card: {
    border: '2px solid #111', borderRadius: 6, padding: '10px 8px',
    position: 'relative', minHeight: 100, display: 'flex', flexDirection: 'column',
    fontFamily: 'serif',
  },
  cardOwned: { background: '#fdfbf5' },
  cardRare: {
    background: 'linear-gradient(135deg, #fffbe6, #fff3c4)',
    border: '2px solid #FFD700', boxShadow: '0 0 0 1px #cc1111 inset',
  },
  cardLocked: {
    background: '#f0f0f0', borderColor: '#ddd', opacity: 0.6,
  },
  rareBadge: {
    position: 'absolute', top: -8, right: -6, background: '#FFD700', color: '#111',
    fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4,
    border: '1.5px solid #111', transform: 'rotate(8deg)',
  },
  rareBadgeLocked: { background: '#ccc', color: '#888', borderColor: '#bbb' },
  masthead: {
    fontSize: 9, fontWeight: 900, letterSpacing: 2, color: '#999',
    borderBottom: '1.5px solid #ddd', paddingBottom: 4, marginBottom: 6,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 11, fontWeight: 900, color: '#111', lineHeight: 1.25, flex: 1,
    textTransform: 'uppercase',
  },
  headlineLocked: {
    fontSize: 11, fontWeight: 900, color: '#bbb', lineHeight: 1.25, flex: 1,
    letterSpacing: 2,
  },
  cardFooter: {
    display: 'flex', justifyContent: 'flex-end', fontSize: 10, marginTop: 6,
    paddingTop: 4, borderTop: '1px dashed #ddd',
  },
  countBadge: {
    background: '#27ae60', color: '#fff', fontWeight: 900, padding: '1px 6px',
    borderRadius: 4, fontFamily: 'sans-serif',
  },
  lockedText: { color: '#bbb', fontFamily: 'sans-serif', fontWeight: 700 },
  footer: {
    padding: '8px 12px', fontSize: 10, color: '#aaa', borderTop: '1px solid #f0f0f0',
    textAlign: 'center',
  },
}
