'use client'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { coinbaseWallet, metaMask } from 'wagmi/connectors'
import { usePlayerProfile } from '@/hooks/usePlayerProfile'
import { useServe } from '@/hooks/useServe'
import { useAutoServe } from '@/hooks/useAutoServe'
import { Leaderboard } from '@/components/Leaderboard'
import { WrapGallery } from '@/components/WrapGallery'
import { FAQ } from '@/components/FAQ'
import { Roadmap } from '@/components/Roadmap'

const CUSTOMERS = [
  { e:'👴', n:'Barry',  q:'"Same as usual, love"',           o:['fish','chips','salt','ketchup','coke'],          tip:25 },
  { e:'👵', n:'Doreen', q:'"Not too much vinegar!"',          o:['fish','chips','mayo','oj'],                      tip:28 },
  { e:'🧔', n:'Gary',   q:'"Absolutely starving mate"',       o:['chips','wedges','ketchup','hpsauce','lager'],    tip:28 },
  { e:'💁', n:'Sharon', q:'"Is the coleslaw fresh today?"',   o:['fish','slaw','mayo','oj'],                       tip:32 },
  { e:'👷', n:'Trevor', q:'"Large cod, extra chips cheers"',  o:['fish','chips','wedges','salt','hpsauce','lager'],tip:42 },
  { e:'🕵️', n:'Colin',  q:'"Just chips please pal"',          o:['chips','salt','ketchup'],                       tip:15 },
  { e:'👩‍💼', n:'Mandy', q:'"No salt — watching my sodium"',   o:['fish','chips','mayo','slaw','oj'],               tip:42 },
  { e:'🎅', n:'Terry',  q:'"Merry Christmas! Large order!"',  o:['fish','chips','wedges','ketchup','mayo','lager'],tip:60 },
  { e:'🧑', n:'Kyle',   q:'"Extra salt yeah? Cheers"',        o:['chips','wedges','salt','hpsauce','lager'],       tip:22 },
  { e:'👩', n:'Bev',    q:'"Whatever\'s hottest!"',            o:['fish','slaw','chips','ketchup','oj'],            tip:30 },
]

const MENU = [
  { id:'fish',    nm:'Fish',         ico:'🐟' },
  { id:'chips',   nm:'Chips',        ico:'🍟' },
  { id:'wedges',  nm:'Wedges',       ico:'🥔' },
  { id:'slaw',    nm:'Coleslaw',     ico:'🥗' },
  { id:'mayo',    nm:'Mayo',         ico:'🥛' },
  { id:'ketchup', nm:'Ketchup',      ico:'🍅' },
  { id:'hpsauce', nm:'HP Sauce',     ico:'🟤' },
  { id:'salt',    nm:'Salt',         ico:'🧂' },
  { id:'pepper',  nm:'Pepper',       ico:'⬛' },
  { id:'coke',    nm:'Coke',         ico:'🥤' },
  { id:'oj',      nm:'OJ',           ico:'🍊' },
  { id:'lager',   nm:'Pint of Lager',ico:'🍺' },
]

type Tab = 'play' | 'leaderboard' | 'profile'

export default function Home() {
  const { isConnected, address } = useAccount()
  const { connect }    = useConnect()
  const { disconnect } = useDisconnect()
  const profile = usePlayerProfile()
  const { serve, status: serveStatus } = useServe()
  const { buyAutoServe, withdrawProfile, buyStatus, withdrawStatus } = useAutoServe()

  const [activeTab,   setActiveTab]   = useState<Tab>('play')
  const [customer,    setCustomer]    = useState<typeof CUSTOMERS[0] | null>(null)
  const [tray,        setTray]        = useState<string[]>([])
  const [queue,       setQueue]       = useState<typeof CUSTOMERS>([])
  const [timerLeft,   setTimerLeft]   = useState(0)
  const [serving,     setServing]     = useState(false)
  const [showFaq,     setShowFaq]     = useState(false)
  const [showRoadmap, setShowRoadmap] = useState(false)
  const [step,        setStep]        = useState(1)
  const [lastMsg,     setLastMsg]     = useState('')

  useEffect(() => {
    setQueue([...CUSTOMERS].sort(() => Math.random() - 0.5).slice(0, 3))
  }, [])

  useEffect(() => {
    if (!customer || timerLeft <= 0 || serving) return
    const t = setInterval(() => {
      setTimerLeft(v => {
        if (v <= 1) {
          setCustomer(null); setTray([]); setLastMsg('Customer walked out! 😤')
          return 0
        }
        return v - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [customer, timerLeft, serving])

  function getNextCustomer() {
    const q = queue.length ? queue : [...CUSTOMERS].sort(() => Math.random() - 0.5)
    setCustomer(q[0])
    setQueue(q.slice(1))
    setTray([])
    setTimerLeft(40)
    setStep(2)
    setLastMsg('')
    setServing(false)
  }

  function addItem(id: string) { if (customer) setTray(t => [...t, id]) }
  function removeItem(idx: number) { setTray(t => t.filter((_, i) => i !== idx)) }

  const orderReady = customer
    ? JSON.stringify([...tray].sort()) === JSON.stringify([...customer.o].sort())
    : false

  async function handleServe() {
    if (!customer || !address || !orderReady) return
    const tip = Math.min(customer.tip, 100)
    setServing(true)
    try {
      await serve(tip, address)
      setLastMsg(`⛓ +${tip} $CHIP minted onchain!`)
      setCustomer(null); setTray([]); setStep(1); setTimerLeft(0)
      profile.refetch()
      setQueue(prev => {
        const extra = [...CUSTOMERS].sort(() => Math.random() - 0.5)[0]
        return [...prev, extra]
      })
    } catch {
      setLastMsg('Transaction cancelled or failed')
    } finally {
      setServing(false)
    }
  }

  // ── Wallet connect screen ────────────────────────────────────
  if (!isConnected) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#1a90d8', padding:24, textAlign:'center', fontFamily:'Nunito,sans-serif' }}>
        <div style={{ fontSize:80, marginBottom:16 }}>🐟</div>
        <h1 style={{ fontFamily:'serif', fontSize:48, color:'#cc1111', textShadow:'3px 3px 0 #111', marginBottom:8, letterSpacing:4 }}>CHIP CHAIN</h1>
        <p style={{ color:'#fff', fontWeight:800, marginBottom:28, fontSize:16 }}>The Great British Fry-Off · Live on Base Sepolia</p>
        <button onClick={() => connect({ connector: coinbaseWallet({ appName:'Chip Chain' }) })}
          style={{ background:'#0052ff', color:'#fff', border:'3px solid #111', borderRadius:10, padding:'14px 32px', fontSize:18, fontWeight:900, cursor:'pointer', marginBottom:12, boxShadow:'5px 5px 0 #003dbf', width:'100%', maxWidth:320 }}>
          Connect Base Wallet
        </button>
        <button onClick={() => connect({ connector: metaMask() })}
          style={{ background:'#fff', color:'#111', border:'3px solid #111', borderRadius:10, padding:'14px 32px', fontSize:18, fontWeight:900, cursor:'pointer', boxShadow:'5px 5px 0 #111', width:'100%', maxWidth:320 }}>
          🦊 Connect MetaMask
        </button>
        <p style={{ color:'rgba(255,255,255,.6)', fontSize:12, marginTop:12 }}>Base Sepolia Testnet · No real funds needed</p>
      </div>
    )
  }

  // ── Main app ─────────────────────────────────────────────────
  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:16, fontFamily:'Nunito,sans-serif', paddingBottom:20 }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ fontFamily:'serif', fontSize:26, color:'#cc1111', fontWeight:900 }}>🐟 CHIP CHAIN</div>
          <button onClick={() => setShowFaq(true)} style={{
            background:'#FFD700', border:'2px solid #111', borderRadius:'50%',
            width:24, height:24, fontWeight:900, fontSize:13, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'2px 2px 0 #111', flexShrink:0,
          }} title="FAQ — $CHIP, Wraps & Rewards">
            ?
          </button>
          <button onClick={() => setShowRoadmap(true)} style={{
            background:'#27ae60', border:'2px solid #111', borderRadius:'50%',
            width:24, height:24, fontWeight:900, fontSize:12, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'2px 2px 0 #111', flexShrink:0,
          }} title="Roadmap">
            🗺️
          </button>
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ background:'#111', color:'#FFD700', borderRadius:6, padding:'4px 10px', fontSize:12, fontWeight:800 }}>
            ⛓ {profile.chipBalance} $CHIP
          </div>
          <div style={{ background:'#e8f0ff', color:'#0052ff', borderRadius:6, padding:'4px 10px', fontSize:12, fontWeight:800, border:'1.5px solid #0052ff' }}>
            👤 {profile.profileChip}
          </div>
          <button onClick={() => disconnect()} style={{ background:'none', border:'1.5px solid #ddd', borderRadius:6, padding:'4px 8px', fontSize:10, cursor:'pointer', color:'#aaa' }}>
            {address?.slice(0,6)}...{address?.slice(-4)} ✕
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display:'flex', marginBottom:14, border:'2.5px solid #111', borderRadius:8, overflow:'hidden' }}>
        {([
          { id:'play',        label:'🍟 PLAY'        },
          { id:'leaderboard', label:'🏆 TOP 50'       },
          { id:'profile',     label:'👤 PROFILE'      },
        ] as { id:Tab; label:string }[]).map((tab, i, arr) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex:1, padding:'10px 6px', fontWeight:900, fontSize:13,
            cursor:'pointer', border:'none',
            background: activeTab === tab.id ? '#FFD700' : '#eee',
            color: '#111',
            borderRight: i < arr.length-1 ? '2px solid #111' : 'none',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PLAY TAB ─────────────────────────────────────────── */}
      {activeTab === 'play' && (
        <>
          {/* Steps */}
          <div style={{ display:'flex', marginBottom:12, border:'2.5px solid #111', borderRadius:8, overflow:'hidden' }}>
            {[{n:1,t:'🛎️ Get customer'},{n:2,t:'🍟 Pick items'},{n:3,t:'✅ Serve it!'}].map((s,i) => (
              <div key={s.n} style={{ flex:1, padding:'7px 4px', textAlign:'center', fontSize:11, fontWeight:800,
                background: step===s.n?'#FFD700':step>s.n?'#27ae60':'#eee',
                color: step>s.n?'#fff':'#111',
                borderRight: i<2?'2px solid #111':'none' }}>
                {s.t}
              </div>
            ))}
          </div>

          {/* Info strip */}
          <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
            <div style={{ flex:1, background:'#e8f9ee', border:'2px solid #27ae60', borderRadius:8, padding:'7px 10px', fontSize:11, fontWeight:800, color:'#1a7a42', minHeight:44, display:'flex', alignItems:'center', gap:6 }}>
              ⛓ <span><b>Manual serve</b> — tokens go onchain to your wallet every SERVE IT</span>
            </div>
            <div style={{ flex:1, background:'#e8f0ff', border:'2px solid #0052ff', borderRadius:8, padding:'7px 10px', fontSize:11, fontWeight:800, color:'#003cbf', minHeight:44, display:'flex', alignItems:'center', gap:6 }}>
              🤖 <span><b>Auto Serve</b> — earns 10 $CHIP/min into your profile. Withdraw anytime.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
            <button onClick={getNextCustomer} style={{ flex:2, minHeight:48, background:'#FFD700', border:'3px solid #111', borderRadius:8, fontWeight:900, fontSize:15, cursor:'pointer', boxShadow:'3px 3px 0 #111' }}>
              🛎️ GET NEXT CUSTOMER
            </button>
            <button onClick={() => profile.hasAutoServe ? setLastMsg('Auto-serve active! Check Profile tab.') : buyAutoServe()}
              disabled={buyStatus==='signing'||buyStatus==='pending'}
              style={{ flex:1, minHeight:48, background:profile.hasAutoServe?'#27ae60':'#fff', color:profile.hasAutoServe?'#fff':'#111', border:'3px solid #111', borderRadius:8, fontWeight:900, fontSize:13, cursor:'pointer', boxShadow:'3px 3px 0 #111' }}>
              {buyStatus==='signing'?'⏳ Signing...':buyStatus==='pending'?'⏳ Confirming...':profile.hasAutoServe?'🤖 Auto ON · +10/min':'🤖 Hire ($5) · 10/min'}
            </button>
            <button onClick={() => withdrawProfile()}
              disabled={profile.profileChip===0||withdrawStatus==='signing'||withdrawStatus==='pending'}
              style={{ flex:1, minHeight:48, background:'#fff', color:'#0052ff', border:'3px solid #0052ff', borderRadius:8, fontWeight:900, fontSize:13, cursor:'pointer', boxShadow:'3px 3px 0 #0052ff', opacity:profile.profileChip===0?0.5:1 }}>
              {withdrawStatus==='signing'?'⏳ Signing...':withdrawStatus==='pending'?'⏳ Confirming...':'⬇️ Withdraw'}
            </button>
          </div>

          {/* Two columns */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>

            {/* LEFT: Order */}
            <div style={{ background:'#fff', border:'3px solid #111', borderRadius:10, overflow:'hidden' }}>
              <div style={{ background:'#e67e22', color:'#fff', padding:'8px 12px', fontWeight:900, fontSize:14 }}>
                {customer?`${customer.e} ${customer.n}'s Order`:'WAITING FOR CUSTOMER'}
              </div>
              <div style={{ padding:12 }}>
                {/* Queue */}
                {queue.slice(0,3).map((c,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'2px 0', borderBottom:'1px solid #f5f5f5', fontSize:11, fontWeight:800, color:'#999' }}>
                    <span>{c.e}</span><span style={{ flex:1 }}>{c.n}</span>
                    <span style={{ color:'#27ae60' }}>+{c.tip}$</span>
                  </div>
                ))}

                {customer ? (
                  <div style={{ marginTop:10, paddingTop:10, borderTop:'2px dashed #eee' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                      <span style={{ fontSize:38 }}>{customer.e}</span>
                      <div>
                        <div style={{ fontWeight:900, fontSize:15 }}>{customer.n}</div>
                        <div style={{ fontSize:10, color:'#888', fontStyle:'italic' }}>{customer.q}</div>
                        <div style={{ background:'#FFD700', display:'inline-block', padding:'2px 8px', borderRadius:4, border:'1.5px solid #111', fontSize:10, fontWeight:900, marginTop:4 }}>
                          💰 +{customer.tip} $CHIP
                        </div>
                      </div>
                    </div>
                    {/* Timer bar */}
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                      <div style={{ flex:1, height:7, background:'#eee', borderRadius:4, overflow:'hidden' }}>
                        <div style={{ height:'100%', borderRadius:4, transition:'width 1s,background .3s',
                          width:`${(timerLeft/40)*100}%`,
                          background:timerLeft>20?'#27ae60':timerLeft>10?'#e67e22':'#cc1111' }} />
                      </div>
                      <span style={{ fontSize:11, fontWeight:900 }}>{timerLeft}s</span>
                    </div>
                    {/* Order items */}
                    <div style={{ fontSize:9, fontWeight:900, color:'#aaa', letterSpacing:2, marginBottom:5 }}>THEY WANT:</div>
                    {Array.from(new Set(customer.o)).map(id => {
                      const m = MENU.find(x=>x.id===id)!
                      const cnt  = customer.o.filter(x=>x===id).length
                      const have = tray.filter(x=>x===id).length
                      const ok   = have>=cnt&&have>0
                      return (
                        <div key={id} style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 7px', marginBottom:2, borderRadius:5,
                          background:ok?'#e6f9ee':'#f8f8f8', border:`1.5px solid ${ok?'#27ae60':'#e0e0e0'}` }}>
                          <span style={{ fontSize:16 }}>{m.ico}</span>
                          <span style={{ fontWeight:800, fontSize:12 }}>{cnt>1?`${cnt}x `:''}{m.nm}</span>
                          {ok && <span style={{ marginLeft:'auto', color:'#27ae60', fontWeight:900 }}>✓</span>}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign:'center', padding:'16px 0', color:'#ccc', fontSize:12 }}>
                    <div style={{ fontSize:36, marginBottom:6 }}>🛎️</div>
                    Press GET NEXT CUSTOMER
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Menu */}
            <div style={{ background:'#fff', border:'3px solid #111', borderRadius:10, overflow:'hidden' }}>
              <div style={{ background:'#cc1111', color:'#fff', padding:'8px 12px', fontWeight:900, fontSize:14 }}>
                🍽️ BUILD THE ORDER
              </div>
              <div style={{ fontSize:9, fontWeight:900, color:'#aaa', letterSpacing:2, padding:'5px 8px 2px' }}>MENU — TAP TO ADD</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:3, padding:'0 6px 6px' }}>
                {MENU.map(m => {
                  const inOrd = customer?.o.includes(m.id)
                  return (
                    <button key={m.id} onClick={() => addItem(m.id)} disabled={!customer}
                      style={{ background:inOrd?'#e8f0fd':'#fff', border:`2px solid ${inOrd?'#1757a8':'#111'}`,
                        borderRadius:7, padding:'5px 2px', cursor:customer?'pointer':'not-allowed',
                        textAlign:'center', opacity:customer&&!inOrd?0.4:1,
                        minHeight:52, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:20, lineHeight:1 }}>{m.ico}</span>
                      <span style={{ fontSize:8, fontWeight:900, color:'#555', marginTop:2, textTransform:'uppercase' }}>{m.nm}</span>
                    </button>
                  )
                })}
              </div>

              {/* Serve button */}
              <div style={{ padding:'0 6px 6px' }}>
                <button onClick={handleServe}
                  disabled={!orderReady||serveStatus==='signing'||serveStatus==='pending'}
                  style={{ width:'100%', minHeight:50, background:orderReady?'#27ae60':'#ccc',
                    color:orderReady?'#fff':'#999', border:'3px solid #111', borderRadius:8,
                    fontWeight:900, fontSize:20, cursor:orderReady?'pointer':'not-allowed',
                    boxShadow:orderReady?'0 4px 0 #1a7a42,0 4px 0 2px #111':'none' }}>
                  {serveStatus==='signing'?'⏳ Signing...':serveStatus==='pending'?'⏳ Confirming...':'🍟 SERVE IT!'}
                </button>
              </div>

              {/* Tray */}
              {tray.length>0&&(
                <div style={{ borderTop:'1px dashed #eee', margin:'0 6px 6px', paddingTop:5 }}>
                  <div style={{ fontSize:8, fontWeight:900, color:'#aaa', letterSpacing:2, marginBottom:3 }}>YOUR TRAY — TAP TO REMOVE</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                    {tray.map((id,i)=>{
                      const m=MENU.find(x=>x.id===id)!
                      return (
                        <button key={i} onClick={()=>removeItem(i)}
                          style={{ background:'#fff', border:'1.5px solid #111', borderRadius:5, padding:'2px 6px', fontSize:11, fontWeight:800, cursor:'pointer' }}>
                          {m.ico} {m.nm}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status message */}
          {lastMsg && (
            <div style={{ marginTop:12, background:'#111', color:'#FFD700', borderRadius:8, padding:'10px 16px', fontWeight:800, fontSize:14, textAlign:'center' }}>
              {lastMsg}
            </div>
          )}

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:12 }}>
            {[
              { label:'⛓ Onchain $CHIP', value:profile.chipBalance },
              { label:'👤 Profile $CHIP', value:profile.profileChip },
              { label:'🍟 Total Served',  value:profile.totalServed },
            ].map(s=>(
              <div key={s.label} style={{ background:'#111', borderRadius:8, padding:'8px 10px', textAlign:'center' }}>
                <div style={{ fontSize:8, color:'#888', letterSpacing:2, textTransform:'uppercase' }}>{s.label}</div>
                <div style={{ fontSize:22, fontWeight:900, color:'#FFD700', fontFamily:'serif' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── LEADERBOARD TAB ──────────────────────────────────── */}
      {activeTab === 'leaderboard' && (
        <Leaderboard currentAddress={address} />
      )}

      {/* ── PROFILE TAB ──────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <>
        <div style={{ background:'#fff', border:'3px solid #111', borderRadius:12, overflow:'hidden' }}>
          <div style={{ background:'#1757a8', color:'#fff', padding:'10px 14px', fontFamily:'serif', fontSize:16, fontWeight:900 }}>
            👤 Your Profile
          </div>
          <div style={{ padding:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
              {[
                { label:'⛓ Onchain $CHIP', value:profile.chipBalance, color:'#e67e22' },
                { label:'👤 Profile $CHIP', value:profile.profileChip, color:'#0052ff' },
                { label:'🍟 Served Today',  value:profile.servedToday, color:'#FFD700' },
                { label:'📊 Total Served',  value:profile.totalServed, color:'#27ae60' },
              ].map(s=>(
                <div key={s.label} style={{ background:'#f8f8f8', borderRadius:8, padding:12, border:'1.5px solid #eee' }}>
                  <div style={{ fontSize:9, fontWeight:900, color:'#aaa', letterSpacing:2, textTransform:'uppercase' }}>{s.label}</div>
                  <div style={{ fontSize:28, fontWeight:900, color:s.color, fontFamily:'serif' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Auto Serve status */}
            <div style={{
              background: profile.hasAutoServe ? '#e8f9ee' : '#f8f8f8',
              border: `1.5px solid ${profile.hasAutoServe ? '#27ae60' : '#eee'}`,
              borderRadius: 8, padding: 12, marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 24 }}>🤖</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 13, color: profile.hasAutoServe ? '#1a7a42' : '#888' }}>
                  {profile.hasAutoServe ? 'Auto Serve ACTIVE' : 'Auto Serve not active'}
                </div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                  {profile.hasAutoServe
                    ? 'Earning 10 $CHIP every minute into your profile balance'
                    : 'Hire for $5 (one-time) to earn 10 $CHIP/min passively'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 16, fontFamily: 'monospace' }}>
              Wallet: {address}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <button onClick={()=>withdrawProfile()}
                disabled={profile.profileChip===0||withdrawStatus==='signing'||withdrawStatus==='pending'}
                style={{ minHeight:48, background:'#fff', color:'#0052ff', border:'3px solid #0052ff', borderRadius:8, fontWeight:900, fontSize:15, cursor:'pointer', boxShadow:'3px 3px 0 #0052ff', opacity:profile.profileChip===0?0.5:1 }}>
                {withdrawStatus==='signing'?'⏳ Signing...':withdrawStatus==='pending'?'⏳ Confirming...':'⬇️ WITHDRAW PROFILE $CHIP ONCHAIN'}
              </button>
              <button onClick={()=>disconnect()}
                style={{ minHeight:44, background:'none', border:'1.5px solid #ddd', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer', color:'#888' }}>
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <WrapGallery address={address} />
        </div>

        <div style={{ marginTop: 12 }}>
          <FAQ />
        </div>

        <div style={{ marginTop: 12 }}>
          <Roadmap />
        </div>
        </>
      )}

      {/* FAQ MODAL — accessible from any tab via the ? badge */}
      {showFaq && (
        <div
          onClick={() => setShowFaq(false)}
          style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:1000,
            display:'flex', alignItems:'center', justifyContent:'center', padding:16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth:520, width:'100%', maxHeight:'85vh', overflowY:'auto', borderRadius:12 }}
          >
            <div style={{ position:'relative' }}>
              <button onClick={() => setShowFaq(false)} style={{
                position:'absolute', top:8, right:8, zIndex:10,
                background:'#fff', border:'2px solid #111', borderRadius:'50%',
                width:28, height:28, fontWeight:900, fontSize:16, cursor:'pointer',
                boxShadow:'2px 2px 0 #111',
              }}>
                ✕
              </button>
              <FAQ />
            </div>
          </div>
        </div>
      )}

      {/* ROADMAP MODAL — accessible from any tab via the 🗺️ badge */}
      {showRoadmap && (
        <div
          onClick={() => setShowRoadmap(false)}
          style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:1000,
            display:'flex', alignItems:'center', justifyContent:'center', padding:16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth:520, width:'100%', maxHeight:'85vh', overflowY:'auto', borderRadius:12 }}
          >
            <div style={{ position:'relative' }}>
              <button onClick={() => setShowRoadmap(false)} style={{
                position:'absolute', top:8, right:8, zIndex:10,
                background:'#fff', border:'2px solid #111', borderRadius:'50%',
                width:28, height:28, fontWeight:900, fontSize:16, cursor:'pointer',
                boxShadow:'2px 2px 0 #111',
              }}>
                ✕
              </button>
              <Roadmap />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
