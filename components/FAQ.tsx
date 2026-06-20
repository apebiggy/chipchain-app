'use client'
import { useState } from 'react'

interface QA { q: string; a: string }

const FAQS: QA[] = [
  {
    q: '🍟 What is $CHIP?',
    a: '$CHIP is your onchain points balance, earned every time you serve a customer or run Auto Serve. It is currently a non-transferable points system — not a tradeable token yet.',
  },
  {
    q: '⛓ Onchain $CHIP vs Profile $CHIP — what\'s the difference?',
    a: 'Onchain $CHIP is minted directly to your wallet every time you press SERVE IT — permanent and visible on Basescan. Profile $CHIP accumulates from Auto Serve (100 every 10 min) and sits in your account until you withdraw it onchain (small fee applies).',
  },
  {
    q: '📰 What are Newspaper Wraps?',
    a: 'Every time you press SERVE IT manually, you mint a collectible Newspaper Wrap NFT with a random tabloid headline, plus a 10% chance of being a ⭐ Rare edition. There are 20 possible wrap types in total (10 headlines × normal/rare). Note: Auto Serve earns $CHIP but does not award Newspaper Wraps — you\'ll need to serve manually to grow your collection.',
  },
  {
    q: '🏆 How do $CHIP and Newspaper Wraps affect rewards?',
    a: 'Both your total $CHIP balance and your Newspaper Wrap collection are being tracked now to determine standings ahead of the upcoming rewards round and the $CHIP token event (TGE). The leaderboard reflects your current ranking based on these.',
  },
  {
    q: '⭐ What happens if I collect all 20 Newspaper Wraps?',
    a: 'Completing the full collection (all 10 headlines in both normal and rare editions) permanently doubles the $CHIP you earn from every manual SERVE IT going forward — minted directly onchain. A 🏆 2x badge appears next to your order once active. Past earnings aren\'t affected — only future serves. Check the "Collection" progress bar on your Profile tab.',
  },
  {
    q: '🤖 How does Auto Serve work?',
    a: 'Pay a one-time fee (0.003 ETH) to activate Auto Serve. It earns 100 $CHIP every 10 minutes into your Profile balance — even while you\'re not actively playing. Withdraw to onchain $CHIP anytime. Note: Auto Serve does not award Newspaper Wraps — only manual SERVE IT actions do, so keep playing manually to fill out your collection.',
  },
  {
    q: '💰 What are the protocol fees for?',
    a: 'Every SERVE IT, withdrawal, and Auto Serve purchase sends a small ETH fee to the Treasury contract. This funds ongoing development, rewards, and future features — fully visible onchain.',
  },
  {
    q: '🚀 Is this testnet or real?',
    a: 'Chip Chain is live on Base Mainnet — all contracts are deployed, verified, and fully functional with real ETH and real onchain $CHIP. Earlier progress made during the testnet phase (both $CHIP balances and Newspaper Wrap collections) is combined into your live leaderboard total.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div style={S.container}>
      <div style={S.header}>❓ FAQ — $CHIP, Wraps & Rewards</div>
      <div style={S.list}>
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div key={i} style={S.item}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={S.question}
              >
                <span>{item.q}</span>
                <span style={S.chevron}>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <div style={S.answer}>{item.a}</div>}
            </div>
          )
        })}
      </div>
      <div style={S.footer}>
        <a href="/terms" style={S.footerLink}>Terms of Service</a>
        <span style={{ color: '#ddd', margin: '0 8px' }}>·</span>
        <a href="/privacy" style={S.footerLink}>Privacy Policy</a>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  container: { background: '#fff', border: '3px solid #111', borderRadius: 12, overflow: 'hidden' },
  header: {
    background: '#1757a8', color: '#fff', padding: '10px 14px', fontFamily: 'serif',
    fontSize: 16, fontWeight: 900,
  },
  list: { display: 'flex', flexDirection: 'column' },
  item: { borderBottom: '1px solid #f0f0f0' },
  question: {
    width: '100%', background: 'none', border: 'none', textAlign: 'left',
    padding: '12px 14px', fontSize: 13, fontWeight: 800, color: '#111',
    cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: 8,
  },
  chevron: { fontSize: 18, fontWeight: 900, color: '#0052ff', flexShrink: 0 },
  answer: {
    padding: '0 14px 14px', fontSize: 12, color: '#666', lineHeight: 1.6,
  },
  footer: { padding: '12px 14px', textAlign: 'center', borderTop: '1px solid #f0f0f0' },
  footerLink: { fontSize: 11, color: '#999', textDecoration: 'underline' },
}
