'use client'
import { useLeaderboard, formatName, LeaderEntry } from '@/hooks/useLeaderboard'
interface Props { currentAddress?: string }
export function Leaderboard({ currentAddress }: Props) {
  const { leaders, loading, lastUpdate } = useLeaderboard(30000)
  const medals: Record<number,string> = { 0:'🥇', 1:'🥈', 2:'🥉' }
  if (loading) return (
    <div style={S.container}>
      <div style={S.header}>🏆 Top 50 · Chip Chain</div>
      <div style={S.empty}>Loading leaderboard...</div>
    </div>
  )
  if (!leaders.length) return (
    <div style={S.container}>
      <div style={S.header}>🏆 Top 50 · Chip Chain</div>
      <div style={S.empty}><div style={{fontSize:40,marginBottom:8}}>🍟</div>No players yet — be the first to serve!</div>
    </div>
  )
  return (
    <div style={S.container}>
      <div style={S.header}>
        <span>🏆 Top 50 · Chip Chain</span>
        {lastUpdate && <span style={S.updated}>Updated {lastUpdate.toLocaleTimeString()}</span>}
      </div>
      <div style={S.colHeaders}>
        <span style={{width:28}}>#</span>
        <span style={{flex:1}}>Player</span>
        <span style={{width:80,textAlign:'right'}}>Served</span>
        <span style={{width:90,textAlign:'right'}}>$CHIP</span>
      </div>
      <div style={S.scroll}>
        {leaders.map((e:LeaderEntry,i:number) => {
          const isYou = currentAddress?.toLowerCase() === e.wallet_address.toLowerCase()
          const name  = formatName(e)
          const isBase = name.includes('.base')
          return (
            <div key={e.wallet_address} style={{...S.row, background:isYou?'#e8f0ff':i%2===0?'#fff':'#fafafa', borderLeft:isYou?'3px solid #0052ff':'3px solid transparent'}}>
              <span style={S.rank}>{medals[i]||i+1}</span>
              <span style={{flex:1,overflow:'hidden'}}>
                {isBase
                  ? <span><span style={S.baseName}>{name.replace('.base','')}</span><span style={S.baseSuffix}>.base</span></span>
                  : <span style={S.address}>{name}</span>}
                {isYou && <span style={S.youBadge}>YOU</span>}
              </span>
              <span style={S.served}>{e.total_served.toLocaleString()}</span>
              <span style={S.chip}>{e.total_chip.toLocaleString()}</span>
            </div>
          )
        })}
      </div>
      <div style={S.footer}>Live · Refreshes every 30s · {leaders.length} players</div>
    </div>
  )
}
const S: Record<string,React.CSSProperties> = {
  container:  {background:'#fff',border:'3px solid #111',borderRadius:12,overflow:'hidden',display:'flex',flexDirection:'column'},
  header:     {background:'#1757a8',color:'#fff',padding:'10px 14px',fontFamily:'serif',fontSize:16,fontWeight:900,display:'flex',justifyContent:'space-between',alignItems:'center'},
  updated:    {fontSize:10,color:'rgba(255,255,255,.6)',fontWeight:400},
  colHeaders: {display:'flex',padding:'4px 12px',fontSize:9,fontWeight:900,color:'#aaa',letterSpacing:1.5,textTransform:'uppercase',borderBottom:'1.5px solid #eee',gap:8},
  scroll:     {overflowY:'auto',maxHeight:420},
  row:        {display:'flex',alignItems:'center',padding:'7px 12px',gap:8,borderBottom:'1px solid #f0f0f0',fontSize:13},
  rank:       {width:28,fontWeight:900,fontSize:13,color:'#888',flexShrink:0},
  baseName:   {fontWeight:900,color:'#111'},
  baseSuffix: {color:'#0052ff',fontWeight:900},
  address:    {fontFamily:'monospace',fontSize:11,color:'#888'},
  youBadge:   {marginLeft:6,background:'#0052ff',color:'#fff',fontSize:8,fontWeight:900,padding:'1px 5px',borderRadius:3},
  served:     {width:80,textAlign:'right',color:'#888',fontSize:12,fontWeight:700,flexShrink:0},
  chip:       {width:90,textAlign:'right',color:'#e67e22',fontWeight:900,fontSize:13,flexShrink:0},
  empty:      {padding:32,textAlign:'center',color:'#aaa',fontWeight:700,fontSize:13},
  footer:     {padding:'6px 12px',fontSize:10,color:'#bbb',borderTop:'1px solid #f0f0f0',textAlign:'center'},
}
