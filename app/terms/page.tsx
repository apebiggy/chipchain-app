import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Chip Chain',
  description: 'Terms of Service for Chip Chain, an onchain game built on Base.',
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
  callout: { background: '#fff8e1', border: '1.5px solid #FFD700', borderRadius: 8, padding: '14px 18px', marginBottom: 14, fontSize: 14.5 },
} as const

export default function TermsPage() {
  return (
    <div style={S.page}>
      <Link href="/" style={S.back}>← Back to Chip Chain</Link>
      <h1 style={S.h1}>Terms of Service</h1>
      <p style={S.updated}>Last updated: June 2026</p>

      <p style={S.p}>
        These Terms of Service ("Terms") govern your use of Chip Chain (the "Game"), an onchain
        game built on Base. By connecting a wallet and using the Game, you agree to these Terms.
        If you do not agree, do not use the Game.
      </p>

      <h2 style={S.h2}>1. Eligibility</h2>
      <p style={S.p}>
        You must be of legal age in your jurisdiction to use cryptocurrency wallets and interact
        with smart contracts. You are responsible for ensuring that your use of the Game complies
        with the laws applicable to you, including any restrictions on cryptocurrency, NFTs, or
        onchain gaming in your country or region.
      </p>

      <h2 style={S.h2}>2. How the Game Works</h2>
      <p style={S.p}>
        Chip Chain is a fish-and-chip-shop simulation game. Players connect a wallet, serve
        virtual customers, and earn <strong style={S.strong}>$CHIP</strong> — an onchain points
        balance minted via smart contract on Base. Completed orders may also mint a
        "Newspaper Wrap" NFT. An optional "Auto Serve" subscription earns $CHIP passively over
        time. All core actions (serving, withdrawing, activating Auto Serve) require a small ETH
        fee, paid to an onchain Treasury contract.
      </p>

      <h2 style={S.h2}>3. $CHIP Is Not Currently a Financial Instrument</h2>
      <div style={S.callout}>
        $CHIP is currently a <strong style={S.strong}>non-transferable, in-game points
        balance</strong>. It is not a financial instrument, security, or currency. It cannot be
        traded, sold, or transferred outside the Game, and it has no guaranteed monetary value.
        Newspaper Wrap NFTs are in-game collectibles with no guaranteed value.
      </div>

      <h2 style={S.h2}>4. Planned $CHIP Token Event (TGE)</h2>
      <p style={S.p}>
        We intend to launch a real, tradeable $CHIP token in the future (a "Token Generation
        Event" or "TGE"), as described on our Roadmap. Any future token allocation is currently
        expected to take into account in-game $CHIP balances and Newspaper Wrap collection
        progress accumulated by players. However:
      </p>
      <ul style={S.ul}>
        <li style={S.li}>The TGE has <strong style={S.strong}>not occurred</strong> and may be
          delayed, modified, or cancelled at our sole discretion.</li>
        <li style={S.li}>No specific date, exchange rate, allocation formula, or token supply is
          guaranteed or promised by these Terms or by any in-game messaging.</li>
        <li style={S.li}>Eligibility criteria, snapshot timing, and final allocation mechanics may
          change before any TGE and will be published separately if and when finalized.</li>
        <li style={S.li}>Nothing in the Game or these Terms constitutes an offer or sale of
          securities, an investment contract, or a promise of future profit. Do not play the Game,
          or accumulate $CHIP or Newspaper Wraps, as a financial investment or with an expectation
          of profit from the efforts of others.</li>
        <li style={S.li}>Any future token, if launched, may be subject to additional, separate
          terms and regulatory restrictions (including geographic restrictions) at that time.</li>
      </ul>

      <h2 style={S.h2}>5. Fees and Wallets</h2>
      <p style={S.p}>
        You are solely responsible for the security of your own wallet, private keys, and seed
        phrases. We never ask for your private keys. All fees (serve, withdraw, Auto Serve) are
        paid in real ETH on Base Mainnet and are non-refundable once a transaction is confirmed
        onchain. Network/gas fees are outside our control and may fluctuate.
      </p>

      <h2 style={S.h2}>6. Smart Contract & Blockchain Risk</h2>
      <p style={S.p}>
        The Game relies on smart contracts deployed on Base. Blockchain transactions are
        irreversible. While we take reasonable care in developing and testing our contracts, smart
        contracts may contain bugs or vulnerabilities, and we do not guarantee the Game or its
        contracts are error-free or secure. You use the Game and interact with its contracts
        entirely at your own risk.
      </p>

      <h2 style={S.h2}>7. No Warranty</h2>
      <p style={S.p}>
        The Game is provided <strong style={S.strong}>"as is" and "as available"</strong>, without
        warranties of any kind, whether express or implied, including but not limited to
        merchantability, fitness for a particular purpose, or non-infringement. We do not
        guarantee uninterrupted or error-free operation of the Game, our website, or any related
        backend services.
      </p>

      <h2 style={S.h2}>8. Limitation of Liability</h2>
      <p style={S.p}>
        To the fullest extent permitted by law, we will not be liable for any indirect,
        incidental, special, consequential, or punitive damages, or any loss of funds, tokens, or
        NFTs, arising from your use of the Game, including losses due to smart contract bugs,
        wallet compromise, network congestion, or third-party services (including RPC providers,
        wallet software, or Supabase/Vercel infrastructure we rely on).
      </p>

      <h2 style={S.h2}>9. Prohibited Conduct</h2>
      <ul style={S.ul}>
        <li style={S.li}>Exploiting bugs or vulnerabilities in the Game's smart contracts or
          backend for unintended gain</li>
        <li style={S.li}>Using bots, scripts, or automation to interact with the Game outside of
          its intended Auto Serve mechanism</li>
        <li style={S.li}>Attempting to disrupt, overload, or attack the Game's infrastructure</li>
        <li style={S.li}>Using the Game for any unlawful purpose</li>
      </ul>
      <p style={S.p}>
        We reserve the right to restrict access to the Game for any wallet address found engaging
        in the above conduct, including excluding such addresses from any future TGE allocation.
      </p>

      <h2 style={S.h2}>10. Changes to the Game and These Terms</h2>
      <p style={S.p}>
        We may update, modify, or discontinue features of the Game at any time, including fee
        amounts (via onchain owner functions), game mechanics, or the Roadmap. We may also update
        these Terms from time to time; continued use of the Game after changes are posted
        constitutes acceptance of the revised Terms.
      </p>

      <h2 style={S.h2}>11. Contact</h2>
      <p style={S.p}>
        Questions about these Terms can be sent via our X (Twitter) account:{' '}
        <a href="https://x.com/ChipChainShop" target="_blank" rel="noopener noreferrer" style={{ color: '#0052ff' }}>
          @ChipChainShop
        </a>.
      </p>
    </div>
  )
}
