'use client'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────
// CHIP CHAIN — Landing Page ("/welcome")
// Pop-art British chippy aesthetic, real game mechanics/copy.
// "Play Now" buttons link to "/" (the live game).
// ─────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  '⛓ $CHIP MINTED ONCHAIN ON EVERY SERVE',
  '📰 20 NEWSPAPER WRAPS TO COLLECT',
  '⭐ COMPLETE THE SET FOR A 2x MULTIPLIER',
  '🤖 AUTO SERVE EARNS 10 $CHIP/MIN PASSIVELY',
  '🏆 CLIMB THE LIVE TOP-50 LEADERBOARD',
  '⛓ LIVE ON BASE MAINNET — REAL $CHIP, REAL ONCHAIN',
  '💰 ALL FEES VISIBLE ONCHAIN VIA TREASURY',
]

const FEATURES = [
  {
    emoji: '🐟',
    title: 'Serve Real Customers',
    text: 'Each customer has a unique order and tip. Tap menu items — fish, chips, sauces, drinks — to match what they want, then SERVE IT.',
  },
  {
    emoji: '⛓',
    title: '$CHIP Minted Onchain',
    text: 'Every manual serve mints $CHIP points directly to your wallet — permanent, visible on Basescan, no middleman.',
  },
  {
    emoji: '📰',
    title: 'Newspaper Wrap NFTs',
    text: '10 tabloid headlines × normal/rare = 20 collectible wraps. Each manual serve mints one, with a 10% chance of a ⭐ Rare edition.',
  },
  {
    emoji: '⭐',
    title: 'Collect Them All → 2x',
    text: 'Complete your 20/20 Wrap collection to permanently double the $CHIP minted from every future SERVE IT — applied automatically, onchain.',
  },
  {
    emoji: '🤖',
    title: 'Auto Serve — Passive $CHIP',
    text: 'Pay a one-time 0.003 ETH fee to earn 10 $CHIP/minute automatically into your profile balance. Withdraw to onchain $CHIP anytime.',
  },
  {
    emoji: '🏆',
    title: 'Live Top-50 Leaderboard',
    text: 'Ranked by total $CHIP (onchain + profile). Updates every 30 seconds — see exactly where you stand.',
  },
]

const STEPS = [
  { n: '1', emoji: '🔌', title: 'Connect Wallet', text: 'Connect on Base Mainnet — MetaMask or Coinbase Wallet.' },
  { n: '2', emoji: '🔔', title: 'Get a Customer', text: 'Press "Get Next Customer" to see their order and tip ($CHIP reward).' },
  { n: '3', emoji: '🍟', title: 'Build & Serve', text: 'Tap the right menu items, then SERVE IT — a real Base transaction.' },
  { n: '4', emoji: '🎉', title: 'Earn & Collect', text: '$CHIP mints to your wallet + a random Newspaper Wrap NFT. Repeat, climb the board.' },
]

const FEES = [
  { action: 'SERVE IT (manual)', fee: '0.000005 ETH', result: 'Mints $CHIP + Newspaper Wrap NFT' },
  { action: 'Withdraw Profile $CHIP', fee: '0.000005 ETH', result: 'Converts Auto Serve balance to onchain $CHIP' },
  { action: 'Activate Auto Serve', fee: '0.003 ETH (one-time)', result: 'Unlocks 10 $CHIP/min passive earning' },
]

const ROADMAP_SUMMARY = [
  { emoji: '🍟', title: 'Phase 1 — Testnet', status: 'COMPLETE', color: '#27ae60', text: 'Core loop proven on Base Sepolia — serve, earn $CHIP, collect Wraps, Auto Serve, leaderboard.' },
  { emoji: '⛓', title: 'Phase 2 — Mainnet Launch', status: 'LIVE', color: '#27ae60', text: 'Live now on Base Mainnet — real ETH fees, real onchain $CHIP, testnet progress carried forward.' },
  { emoji: '📣', title: 'Phase 3 — Community', status: 'NOW', color: '#FFD700', text: 'X, Farcaster channel, Discord — building a real audience now that mainnet is live.' },
  { emoji: '🍟', title: 'Phase 4 — $CHIP TGE', status: 'PLANNED', color: '#eee', text: '$CHIP becomes tradeable. Total $CHIP + Wrap collections snapshotted for rewards.' },
  { emoji: '🍔', title: 'Phase 5 — New Restaurants', status: 'PLANNED', color: '#eee', text: 'Taco Truck, Pizza Place, Curry House — shared $CHIP economy across menus.' },
]

const FAQ_TEASER = [
  { q: '🚀 Is this testnet or real?', a: 'Live on Base Mainnet — fully functional with real ETH and real onchain $CHIP. Testnet-era progress (both $CHIP and Wraps) is combined into your live leaderboard total.' },
  { q: '🍟 What is $CHIP?', a: 'Your onchain points balance, earned by serving customers or running Auto Serve. Non-transferable for now — not a tradeable token yet.' },
  { q: '📰 Do I get Wraps from Auto Serve?', a: 'No — only manual SERVE IT actions mint Newspaper Wraps. Auto Serve earns $CHIP only.' },
  { q: '💰 Where do the fees go?', a: 'Every serve, withdrawal, and Auto Serve purchase sends a small ETH fee to the Treasury contract — fully visible onchain, funding development and future rewards.' },
]

export default function WelcomePage() {
  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Fredoka:wght@500;600;700;900&family=Nunito:wght@400;700;800;900&display=swap');

        .cc-halftone {
          background-image: radial-gradient(rgba(0,0,0,0.06) 1.4px, transparent 1.4px);
          background-size: 14px 14px;
        }
        .cc-hard {
          border: 3px solid #111;
          box-shadow: 5px 5px 0 #111;
        }
        .cc-hard-sm {
          border: 2.5px solid #111;
          box-shadow: 3px 3px 0 #111;
        }
        @keyframes cc-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .cc-ticker-track {
          display: flex;
          width: max-content;
          animation: cc-ticker 32s linear infinite;
        }
        @media (max-width: 720px) {
          .cc-grid-2 { grid-template-columns: 1fr !important; }
          .cc-grid-3 { grid-template-columns: 1fr !important; }
          .cc-hero-title { font-size: 52px !important; }
        }
      `}</style>

      {/* ── NAV ────────────────────────────────────────────── */}
      <div style={S.nav}>
        <div style={S.navInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/branding/icon-1024.png" alt="Chip Chain" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            <span style={S.navTitle}>CHIP CHAIN</span>
          </div>
          <Link href="/" style={S.navBtn}>🍟 Play Now</Link>
        </div>
      </div>

      {/* ── HERO ───────────────────────────────────────────── */}
      <div style={{ ...S.hero }} className="cc-halftone">
        <img src="/branding/icon-1024.png" alt="Chip Chain logo" style={S.heroLogo} />
        <h1 className="cc-hero-title" style={S.heroTitle}>CHIP CHAIN</h1>
        <div style={S.heroSubtitle}>THE GREAT BRITISH FRY-OFF</div>
        <div style={{ ...S.badge, background: '#27ae60' }} className="cc-hard-sm">
          🟢 LIVE ON BASE MAINNET
        </div>
        <p style={S.heroText}>
          Run your own onchain chip shop. Serve customers, earn <b>$CHIP</b> directly
          to your wallet, collect <b>Newspaper Wrap NFTs</b>, and climb the live
          leaderboard — every transaction is real, on Base.
        </p>
        <Link href="/" style={S.ctaBtn} className="cc-hard">🍟 PLAY NOW — CONNECT WALLET</Link>
      </div>

      {/* ── TICKER ─────────────────────────────────────────── */}
      <div style={S.ticker}>
        <div className="cc-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} style={S.tickerItem}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── PITCH ──────────────────────────────────────────── */}
      <div style={S.section}>
        <h2 style={S.h2}>🐟 What is Chip Chain?</h2>
        <p style={S.pitchText}>
          Chip Chain is a fish &amp; chip shop simulation where every order you serve
          is a real Base transaction. Build each customer's order from a full British
          chippy menu — fish, chips, wedges, mushy peas, sauces and drinks — then hit
          <b> SERVE IT</b> to mint <b>$CHIP</b> points and a collectible{' '}
          <b>Newspaper Wrap NFT</b> straight to your wallet.
        </p>
        <p style={S.pitchText}>
          No middlemen, no off-chain points database pretending to be onchain — your
          balance, your Wraps, and your leaderboard rank are all backed by contracts
          you can verify on Basescan.
        </p>
      </div>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <div style={S.section}>
        <h2 style={S.h2}>🎮 Core Mechanics</h2>
        <div className="cc-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={S.card} className="cc-hard-sm">
              <div style={{ fontSize: 32, marginBottom: 8 }}>{f.emoji}</div>
              <div style={S.cardTitle}>{f.title}</div>
              <div style={S.cardText}>{f.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <div style={{ ...S.section, background: '#fff' }}>
        <h2 style={S.h2}>📋 How It Works</h2>
        <div className="cc-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginTop: 16 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={S.stepCard} className="cc-hard-sm">
              <div style={S.stepNum}>{s.n}</div>
              <div style={{ fontSize: 28, margin: '6px 0' }}>{s.emoji}</div>
              <div style={S.cardTitle}>{s.title}</div>
              <div style={S.cardText}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ONCHAIN FEES ───────────────────────────────────── */}
      <div style={S.section}>
        <h2 style={S.h2}>⛓ Every Action, Onchain</h2>
        <div style={S.feeTable} className="cc-hard">
          <div style={S.feeHeaderRow}>
            <span style={{ flex: 1.4 }}>Action</span>
            <span style={{ flex: 1 }}>Fee</span>
            <span style={{ flex: 2 }}>Result</span>
          </div>
          {FEES.map((f, i) => (
            <div key={i} style={{ ...S.feeRow, borderBottom: i === FEES.length - 1 ? 'none' : '1.5px solid #f0f0f0' }}>
              <span style={{ flex: 1.4, fontWeight: 900 }}>{f.action}</span>
              <span style={{ flex: 1, color: '#cc1111', fontWeight: 900 }}>{f.fee}</span>
              <span style={{ flex: 2, color: '#666' }}>{f.result}</span>
            </div>
          ))}
        </div>
        <p style={{ ...S.pitchText, marginTop: 12, fontSize: 13, color: '#888', textAlign: 'center' }}>
          All fees flow to the <b>Treasury contract</b> — fully transparent and
          verifiable onchain, funding ongoing development and future rewards.
        </p>
      </div>

      {/* ── ROADMAP SUMMARY ────────────────────────────────── */}
      <div style={{ ...S.section, background: '#fff' }}>
        <h2 style={S.h2}>🗺️ Roadmap</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {ROADMAP_SUMMARY.map((p, i) => (
            <div key={i} style={S.roadmapRow} className="cc-hard-sm">
              <span style={{ fontSize: 26, flexShrink: 0 }}>{p.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={S.cardTitle}>{p.title}</div>
                <div style={{ ...S.cardText, marginTop: 2 }}>{p.text}</div>
              </div>
              <span style={{ ...S.statusBadge, background: p.color, color: p.color === '#eee' ? '#888' : '#111' }}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
        <p style={{ ...S.pitchText, marginTop: 14, fontSize: 12, color: '#aaa', textAlign: 'center', fontStyle: 'italic' }}>
          Targets are intentionally modest — built incrementally based on real player feedback, not hype.
        </p>
      </div>

      {/* ── FAQ TEASER ─────────────────────────────────────── */}
      <div style={S.section}>
        <h2 style={S.h2}>❓ Quick FAQ</h2>
        <div className="cc-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
          {FAQ_TEASER.map((f, i) => (
            <div key={i} style={S.faqCard} className="cc-hard-sm">
              <div style={{ ...S.cardTitle, marginBottom: 6 }}>{f.q}</div>
              <div style={S.cardText}>{f.a}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/" style={S.secondaryBtn} className="cc-hard-sm">See full FAQ in the app →</Link>
        </div>
      </div>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <div style={{ ...S.hero, paddingTop: 50, paddingBottom: 60 }} className="cc-halftone">
        <h2 style={{ ...S.heroTitle, fontSize: 42 }}>READY TO FRY?</h2>
        <p style={{ ...S.heroText, marginBottom: 24 }}>
          Connect your wallet and serve your first customer in under a minute.
        </p>
        <Link href="/" style={S.ctaBtn} className="cc-hard">🍟 PLAY CHIP CHAIN NOW</Link>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <div style={S.footer}>
        <img src="/branding/icon-1024.png" alt="Chip Chain" style={{ width: 56, height: 56, borderRadius: '50%', marginBottom: 10 }} />
        <div style={S.footerTitle}>CHIP CHAIN</div>
        <div style={S.footerSubtitle}>THE GREAT BRITISH FRY-OFF</div>
        <div style={{ ...S.badge, background: '#0052ff', color: '#fff', marginTop: 12 }} className="cc-hard-sm">
          BUILT ON BASE
        </div>
        <div style={S.footerNote}>
          Live on Base Mainnet · Real ETH fees · Onchain transparency by design
        </div>
        <div style={{ marginTop: 14 }}>
          <a href="/terms" style={{ fontSize: 11, color: '#666', textDecoration: 'underline' }}>Terms of Service</a>
          <span style={{ color: '#444', margin: '0 8px' }}>·</span>
          <a href="/privacy" style={{ fontSize: 11, color: '#666', textDecoration: 'underline' }}>Privacy Policy</a>
        </div>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'Nunito, sans-serif', color: '#111', background: '#f5f0e8', overflowX: 'hidden' },

  nav: { background: '#fff', borderBottom: '3px solid #111', position: 'sticky', top: 0, zIndex: 10 },
  navInner: { maxWidth: 960, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navTitle: { fontFamily: 'Bangers, serif', fontSize: 24, color: '#cc1111', letterSpacing: 1 },
  navBtn: { background: '#FFD700', border: '2.5px solid #111', borderRadius: 8, padding: '8px 16px', fontWeight: 900, fontSize: 13, color: '#111', textDecoration: 'none', boxShadow: '2.5px 2.5px 0 #111' },

  hero: {
    textAlign: 'center', padding: '56px 20px 48px',
    backgroundImage: 'linear-gradient(rgba(26,144,216,0.62), rgba(26,144,216,0.62)), url(/branding/shop-bg.jpg)',
    backgroundSize: 'cover', backgroundPosition: 'center',
  },
  heroLogo: { width: 140, height: 140, borderRadius: '50%', marginBottom: 16, border: '4px solid #111', boxShadow: '6px 6px 0 #111' },
  heroTitle: { fontFamily: 'Bangers, serif', fontSize: 72, color: '#fff', margin: 0, letterSpacing: 3, textShadow: '4px 4px 0 #111' },
  heroSubtitle: { fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 18, color: '#FFD700', letterSpacing: 4, marginTop: 6, textShadow: '2px 2px 0 #111' },
  badge: { display: 'inline-block', marginTop: 18, padding: '6px 16px', borderRadius: 20, fontWeight: 900, fontSize: 12, color: '#fff', letterSpacing: 1 },
  heroText: { maxWidth: 580, margin: '20px auto 0', fontSize: 16, lineHeight: 1.6, color: '#fff', fontWeight: 700 },
  ctaBtn: { display: 'inline-block', marginTop: 24, background: '#FFD700', color: '#111', fontFamily: 'Fredoka, sans-serif', fontWeight: 900, fontSize: 18, padding: '16px 36px', borderRadius: 10, textDecoration: 'none', border: '3px solid #111' },
  heroNote: { maxWidth: 520, margin: '18px auto 0', fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 700, lineHeight: 1.5 },

  ticker: { background: '#111', color: '#FFD700', overflow: 'hidden', whiteSpace: 'nowrap', padding: '10px 0' },
  tickerItem: { fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: 1, padding: '0 32px', flexShrink: 0 },

  section: { maxWidth: 960, margin: '0 auto', padding: '48px 20px' },
  h2: { fontFamily: 'Fredoka, sans-serif', fontWeight: 900, fontSize: 28, textAlign: 'center', margin: 0, color: '#111' },
  pitchText: { fontSize: 15, lineHeight: 1.7, color: '#444', maxWidth: 700, margin: '14px auto 0' },

  card: { background: '#fff', borderRadius: 10, padding: 18, textAlign: 'left' },
  cardTitle: { fontFamily: 'Fredoka, sans-serif', fontWeight: 800, fontSize: 15, color: '#111' },
  cardText: { fontSize: 12.5, color: '#777', lineHeight: 1.5, marginTop: 4 },

  stepCard: { background: '#f9f6f0', borderRadius: 10, padding: '16px 14px', textAlign: 'center' },
  stepNum: { fontFamily: 'Bangers, serif', fontSize: 22, color: '#cc1111', background: '#FFD700', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #111', margin: '0 auto' },

  feeTable: { background: '#fff', borderRadius: 10, overflow: 'hidden' },
  feeHeaderRow: { display: 'flex', background: '#111', color: '#FFD700', fontSize: 11, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', padding: '10px 16px' },
  feeRow: { display: 'flex', alignItems: 'center', padding: '12px 16px', fontSize: 13 },

  roadmapRow: { display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 10, padding: '12px 16px' },
  statusBadge: { fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 5, letterSpacing: 1, flexShrink: 0 },

  faqCard: { background: '#fff', borderRadius: 10, padding: 16 },

  secondaryBtn: { display: 'inline-block', background: '#fff', color: '#0052ff', fontFamily: 'Fredoka, sans-serif', fontWeight: 800, fontSize: 14, padding: '10px 22px', borderRadius: 8, textDecoration: 'none', border: '2.5px solid #0052ff' },

  footer: { textAlign: 'center', padding: '40px 20px', background: '#111' },
  footerTitle: { fontFamily: 'Bangers, serif', fontSize: 28, color: '#FFD700', letterSpacing: 2 },
  footerSubtitle: { fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', letterSpacing: 3, marginTop: 2 },
  footerNote: { fontSize: 11, color: '#888', marginTop: 14, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 },
}
