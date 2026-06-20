import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Chip Chain',
  description: 'Privacy Policy for Chip Chain, an onchain game built on Base.',
}

const S = {
  page: { maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px', fontFamily: 'Georgia, serif', color: '#222', lineHeight: 1.65 },
  back: { display: 'inline-block', marginBottom: 24, color: '#0052ff', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontSize: 14, fontWeight: 700 },
  h1: { fontSize: 32, marginBottom: 4, color: '#111' },
  updated: { fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#888', marginBottom: 32 },
  h2: { fontSize: 20, marginTop: 36, marginBottom: 10, color: '#111', borderBottom: '2px solid #eee', paddingBottom: 6 },
  p: { marginBottom: 14, fontSize: 15.5 },
  ul: { marginBottom: 14, paddingLeft: 22, fontSize: 15.5 },
  li: { marginBottom: 6 },
  strong: { fontWeight: 700 },
  callout: { background: '#e8f0ff', border: '1.5px solid #0052ff', borderRadius: 8, padding: '14px 18px', marginBottom: 14, fontSize: 14.5 },
  table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: 14, fontSize: 14 },
  th: { textAlign: 'left' as const, borderBottom: '2px solid #111', padding: '6px 10px', fontFamily: 'Arial, sans-serif', fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: 1 },
  td: { borderBottom: '1px solid #eee', padding: '6px 10px', verticalAlign: 'top' as const },
} as const

export default function PrivacyPage() {
  return (
    <div style={S.page}>
      <Link href="/" style={S.back}>← Back to Chip Chain</Link>
      <h1 style={S.h1}>Privacy Policy</h1>
      <p style={S.updated}>Last updated: June 2026</p>

      <p style={S.p}>
        This Privacy Policy explains what information Chip Chain ("the Game") collects, how it's
        used, and your choices. By using the Game, you agree to this policy.
      </p>

      <div style={S.callout}>
        <strong style={S.strong}>The short version:</strong> we don't collect names, emails, or
        any personal identity information. We store your wallet address and your gameplay
        activity (serves, $CHIP balances, Auto Serve status) so the game and leaderboard work. We
        don't sell data, run ads, or track you across other sites.
      </div>

      <h2 style={S.h2}>1. Information We Collect</h2>
      <p style={S.p}>When you connect a wallet and play, we store the following in our database:</p>
      <table style={S.table}>
        <thead>
          <tr><th style={S.th}>Data</th><th style={S.th}>Why</th></tr>
        </thead>
        <tbody>
          <tr><td style={S.td}>Wallet address</td><td style={S.td}>Identifies your account; required for all gameplay and the leaderboard</td></tr>
          <tr><td style={S.td}>Basename (if set)</td><td style={S.td}>Displayed in place of your address where available</td></tr>
          <tr><td style={S.td}>Serve counts, $CHIP balances</td><td style={S.td}>Gameplay state, leaderboard ranking</td></tr>
          <tr><td style={S.td}>Auto Serve status</td><td style={S.td}>Determines passive $CHIP crediting</td></tr>
          <tr><td style={S.td}>Transaction hashes, headlines, timestamps</td><td style={S.td}>Records of in-game actions (serves, withdrawals)</td></tr>
        </tbody>
      </table>
      <p style={S.p}>
        We do <strong style={S.strong}>not</strong> collect your name, email address, IP address
        (beyond what our hosting providers log automatically for standard security/operational
        purposes — see Section 3), or any government ID. We never ask for or store your private
        keys or seed phrase.
      </p>

      <h2 style={S.h2}>2. Onchain Data Is Public</h2>
      <p style={S.p}>
        Every serve, withdrawal, and Auto Serve transaction happens on Base, a public blockchain.
        Wallet addresses, transaction amounts, and timestamps for these actions are permanently
        visible to anyone via Basescan or similar block explorers — this is inherent to how
        blockchains work and is outside our control. Do not connect a wallet to Chip Chain if you
        don't want your activity on that wallet to be publicly associable with this game.
      </p>

      <h2 style={S.h2}>3. Third-Party Services</h2>
      <p style={S.p}>We rely on the following infrastructure providers, each with their own privacy practices:</p>
      <ul style={S.ul}>
        <li style={S.li}><strong style={S.strong}>Supabase</strong> — hosts our application database (wallet addresses, gameplay data described above)</li>
        <li style={S.li}><strong style={S.strong}>Vercel</strong> — hosts the website and may log standard web request data (e.g. IP address, browser type) for security and performance purposes, per their own privacy policy</li>
        <li style={S.li}><strong style={S.strong}>Coinbase Developer Platform / OnchainKit</strong> — used to resolve Basenames and connect wallets</li>
        <li style={S.li}><strong style={S.strong}>Wallet providers</strong> (MetaMask, Coinbase Wallet) — handle your wallet connection and transaction signing; we never see your private keys</li>
      </ul>

      <h2 style={S.h2}>4. Cookies & Tracking</h2>
      <p style={S.p}>
        We don't use advertising or behavioral-tracking cookies, and we don't sell or share your
        data with advertisers. Wallet-connector libraries may use local browser storage to
        remember your connection state between visits — this is functional, not used for
        tracking, and stays on your device.
      </p>

      <h2 style={S.h2}>5. Data Retention</h2>
      <p style={S.p}>
        We retain gameplay data (wallet address, serve history, $CHIP balances) for as long as
        the Game operates, since this data is required for the leaderboard and for any future
        rewards calculation. Onchain transaction data cannot be deleted by us or anyone — it's
        permanent by the nature of blockchain technology.
      </p>

      <h2 style={S.h2}>6. Your Choices</h2>
      <p style={S.p}>
        You can stop using the Game at any time by simply disconnecting your wallet — we won't
        contact you, since we don't collect any contact information. If you'd like your
        off-chain database record (e.g. basename association) removed, contact us via X (see
        Section 8); note this can't remove your onchain transaction history, which is
        permanent and public regardless.
      </p>

      <h2 style={S.h2}>7. Children's Privacy</h2>
      <p style={S.p}>
        Chip Chain is not directed at, and should not be used by, anyone under the legal age
        required to use cryptocurrency wallets and onchain applications in their jurisdiction.
      </p>

      <h2 style={S.h2}>8. Changes & Contact</h2>
      <p style={S.p}>
        We may update this policy from time to time; continued use of the Game after changes are
        posted constitutes acceptance. Questions can be sent via our X (Twitter) account:{' '}
        <a href="https://x.com/ChipChainShop" target="_blank" rel="noopener noreferrer" style={{ color: '#0052ff' }}>
          @ChipChainShop
        </a>.
      </p>

      <p style={{ ...S.p, marginTop: 28 }}>
        See also our <Link href="/terms" style={{ color: '#0052ff' }}>Terms of Service</Link>.
      </p>
    </div>
  )
}
