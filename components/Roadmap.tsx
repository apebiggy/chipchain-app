'use client'
import { useState } from 'react'

interface Milestone { label: string; done?: boolean }
interface Phase {
  emoji: string
  title: string
  subtitle: string
  timeframe: string
  items: Milestone[]
  status: 'live' | 'next' | 'future'
}

const PHASES: Phase[] = [
  {
    emoji: '🍟',
    title: 'Phase 1 — Chip Chain (Testnet)',
    subtitle: 'Prove the core loop on Base Sepolia',
    timeframe: 'Now',
    status: 'live',
    items: [
      { label: 'Core game: serve, earn $CHIP, mint Newspaper Wraps', done: true },
      { label: 'Auto Serve passive earning', done: true },
      { label: 'Leaderboard with collection multiplier', done: true },
      { label: 'Open testing — target: 50-200 active testers', done: false },
      { label: 'Bug fixes + balance tuning based on real play', done: false },
    ],
  },
  {
    emoji: '📣',
    title: 'Phase 2 — Community & Socials',
    subtitle: 'Build a real audience before launch',
    timeframe: 'Next',
    status: 'next',
    items: [
      { label: 'Official X (Twitter) account — daily leaderboard shoutouts' },
      { label: 'Farcaster channel — native to Base ecosystem' },
      { label: 'Discord/Telegram for tester feedback' },
      { label: 'Realistic target: 500-1,000 wallets connected pre-mainnet' },
      { label: 'Submit to Base App featured mini-apps directory' },
    ],
  },
  {
    emoji: '⛓',
    title: 'Phase 3 — Mainnet Launch',
    subtitle: 'Move from Base Sepolia to Base Mainnet',
    timeframe: '4-8 weeks after Phase 2',
    status: 'future',
    items: [
      { label: 'Redeploy all 4 contracts to Base Mainnet' },
      { label: 'CDP Paymaster — sponsored gas for players' },
      { label: 'Treasury starts collecting real ETH fees' },
      { label: 'Testnet $CHIP balances + Wrap collections snapshotted' },
      { label: 'Target: 1,000-3,000 onchain transactions in first month' },
    ],
  },
  {
    emoji: '🪙',
    title: 'Phase 4 — $CHIP Token Event (TGE)',
    subtitle: 'Reward early testers and players',
    timeframe: 'After mainnet traction',
    status: 'future',
    items: [
      { label: '$CHIP becomes a real, tradeable token' },
      { label: 'Snapshot rewards based on testnet $CHIP + Wrap collection multiplier' },
      { label: 'Completionists (20/20 Wraps) receive 2x allocation' },
      { label: 'Liquidity pool on a Base DEX (Aerodrome/Uniswap)' },
      { label: 'Full tokenomics published before TGE date' },
    ],
  },
  {
    emoji: '🍔',
    title: 'Phase 5 — New Restaurants',
    subtitle: 'Expand beyond the chippy',
    timeframe: 'Post-TGE, based on demand',
    status: 'future',
    items: [
      { label: '🌮 Taco Truck — new menu, new headlines, new wraps' },
      { label: '🍕 Pizza Place — multiplayer rush-hour mode' },
      { label: '🍛 Curry House — spice-level mechanic affects tips' },
      { label: '🥡 Chinese Takeaway — daily specials rotation' },
      { label: 'Cross-restaurant leaderboard + shared $CHIP economy' },
    ],
  },
]

export function Roadmap() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const statusStyle: Record<Phase['status'], React.CSSProperties> = {
    live:   { background: '#27ae60', color: '#fff' },
    next:   { background: '#FFD700', color: '#111' },
    future: { background: '#eee', color: '#888' },
  }
  const statusLabel: Record<Phase['status'], string> = {
    live: '● LIVE', next: '◐ NEXT', future: '○ PLANNED',
  }

  return (
    <div style={S.container}>
      <div style={S.header}>🗺️ Roadmap</div>
      <div style={S.list}>
        {PHASES.map((phase, i) => {
          const isOpen = openIndex === i
          return (
            <div key={i} style={S.item}>
              <button onClick={() => setOpenIndex(isOpen ? null : i)} style={S.question}>
                <span style={S.phaseEmoji}>{phase.emoji}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={S.phaseTitle}>{phase.title}</div>
                  <div style={S.phaseSubtitle}>{phase.subtitle} · {phase.timeframe}</div>
                </div>
                <span style={{ ...S.statusBadge, ...statusStyle[phase.status] }}>
                  {statusLabel[phase.status]}
                </span>
                <span style={S.chevron}>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div style={S.answer}>
                  {phase.items.map((item, j) => (
                    <div key={j} style={S.milestone}>
                      <span style={{ color: item.done ? '#27ae60' : '#bbb' }}>
                        {item.done ? '✓' : '○'}
                      </span>
                      <span style={{ color: item.done ? '#111' : '#666', fontWeight: item.done ? 800 : 500 }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div style={S.footer}>
        Targets are intentionally modest — built incrementally based on real player feedback, not hype.
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  container: { background: '#fff', border: '3px solid #111', borderRadius: 12, overflow: 'hidden' },
  header: {
    background: '#27ae60', color: '#fff', padding: '10px 14px', fontFamily: 'serif',
    fontSize: 16, fontWeight: 900,
  },
  list: { display: 'flex', flexDirection: 'column' },
  item: { borderBottom: '1px solid #f0f0f0' },
  question: {
    width: '100%', background: 'none', border: 'none', textAlign: 'left',
    padding: '10px 12px', fontSize: 13, fontWeight: 800, color: '#111',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
  },
  phaseEmoji: { fontSize: 22, flexShrink: 0 },
  phaseTitle: { fontSize: 13, fontWeight: 900, color: '#111' },
  phaseSubtitle: { fontSize: 10, color: '#999', fontWeight: 600, marginTop: 1 },
  statusBadge: {
    fontSize: 9, fontWeight: 900, padding: '3px 7px', borderRadius: 4, flexShrink: 0,
    letterSpacing: 0.5,
  },
  chevron: { fontSize: 18, fontWeight: 900, color: '#0052ff', flexShrink: 0 },
  answer: { padding: '0 12px 12px 44px', display: 'flex', flexDirection: 'column', gap: 6 },
  milestone: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, lineHeight: 1.4 },
  footer: {
    padding: '8px 12px', fontSize: 10, color: '#aaa', borderTop: '1px solid #f0f0f0',
    textAlign: 'center', fontStyle: 'italic',
  },
}
