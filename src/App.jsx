import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Search, BarChart2, Mail, Calendar,
  TrendingUp, Settings, Bell, ChevronRight, X, Plus,
  Play, Pause, Zap, Target, Users, DollarSign, Clock,
  CheckCircle, AlertCircle, ArrowUpRight, Filter,
  Building2, MapPin, Star, Send, Eye, MessageSquare,
  RefreshCw, ChevronDown, ToggleLeft, ToggleRight,
  Briefcase, Award, GripVertical
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

/* ─── FONTS ─────────────────────────────────────────────────────────── */
const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap";
document.head.appendChild(FONT_LINK);

/* ─── THEME ─────────────────────────────────────────────────────────── */
const T = {
  bg:       "#080D24",
  bg2:      "#0C1235",
  card:     "#0F1845",
  card2:    "#131D50",
  border:   "rgba(255,255,255,0.07)",
  border2:  "rgba(255,255,255,0.12)",
  accent:   "#1B6EF3",
  teal:     "#00D4FF",
  green:    "#2ECC8B",
  amber:    "#F5A623",
  red:      "#FF5C5C",
  purple:   "#A855F7",
  txt:      "#FFFFFF",
  txt2:     "#8BA3C7",
  txt3:     "#546A8C",
};

/* ─── GLOBAL STYLES ──────────────────────────────────────────────────── */
const globalStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  ::-webkit-scrollbar-track { background: transparent; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.6)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dots { 0%{content:'.'} 33%{content:'..'} 66%{content:'...'} 100%{content:'.'} }
  .dots::after { content:'.'; animation: dots 1.4s infinite; }
  .fadeUp { animation: fadeUp .35s ease both; }
`;
const styleEl = document.createElement("style");
styleEl.textContent = globalStyle;
document.head.appendChild(styleEl);

/* ─── DATA ───────────────────────────────────────────────────────────── */
const LEADS_INIT = [
  { id:1, co:"Al-Rashid Industrial Group",  ind:"Manufacturing", rev:120, loc:"North Riyadh",    icp:87, st:"engaged",           rd:72, la:"Email #2 opened — 1 day ago",          ceo:"Fahad Al-Rashid",    title:"CEO"   },
  { id:2, co:"Tameer Contracting Co.",       ind:"Construction",  rev:65,  loc:"Al-Olaya",        icp:74, st:"outreach",           rd:45, la:"Email #1 sent — 3 days ago",           ceo:"Abdullah Al-Otaibi", title:"CEO"   },
  { id:3, co:"Nour Express Logistics",       ind:"Logistics",     rev:28,  loc:"Industrial City", icp:91, st:"meeting_scheduled",  rd:82, la:"Meeting confirmed: May 8",             ceo:"Khalid Al-Harbi",    title:"COO"   },
  { id:4, co:"Gulf Medical Supplies",        ind:"Healthcare",    rev:55,  loc:"South Riyadh",    icp:68, st:"new",                rd:20, la:"Discovered today",                     ceo:"—",                  title:"GM"    },
  { id:5, co:"Al-Watan Insurance Brokers",   ind:"Insurance",     rev:18,  loc:"Al-Olaya",        icp:95, st:"proposal",           rd:91, la:"Proposal sent — awaiting response",    ceo:"Saud Al-Qahtani",    title:"Owner" },
  { id:6, co:"Riyadh Steel Products",        ind:"Manufacturing", rev:195, loc:"Jubail Industrial",icp:83, st:"outreach",          rd:38, la:"Email #1 sent — 5 days ago",           ceo:"Omar Al-Qahtani",    title:"CEO"   },
  { id:7, co:"Kingdom Real Estate Dev.",     ind:"Real Estate",   rev:230, loc:"North Riyadh",    icp:71, st:"new",                rd:15, la:"Qualified — pending outreach",         ceo:"—",                  title:"Owner" },
  { id:8, co:"Bright Star Trading Co.",      ind:"Retail",        rev:42,  loc:"Al-Malqa",        icp:58, st:"new",                rd:10, la:"Discovered — 2 days ago",              ceo:"—",                  title:"GM"    },
];

const MEETINGS = [
  { id:1, d:"08", m:"MAY", day:"Thu", time:"10:00 AM", contact:"Abdullah Al-Otaibi", title:"CEO",             co:"Tameer Contracting Co.",      rd:68, icp:74 },
  { id:2, d:"12", m:"MAY", day:"Mon", time:"02:00 PM", contact:"Khalid Al-Harbi",    title:"COO",             co:"Nour Express Logistics",      rd:82, icp:91 },
  { id:3, d:"14", m:"MAY", day:"Wed", time:"11:00 AM", contact:"Mohammed Al-Ghamdi", title:"General Manager", co:"Al-Rashid Industrial Group",  rd:72, icp:87 },
  { id:4, d:"19", m:"MAY", day:"Mon", time:"09:30 AM", contact:"Saud Al-Qahtani",    title:"Owner",           co:"Al-Watan Insurance Brokers",  rd:91, icp:95 },
];

const ACTIVITY = [
  { icon:"🔍", c:T.accent,  txt:"Discovered 7 new leads in Al-Malqa district, Riyadh",            ts:"2 min ago"   },
  { icon:"✅", c:T.green,   txt:"Qualified: Al-Rashid Industrial Group (Score: 87/100)",           ts:"18 min ago"  },
  { icon:"✉️", c:T.teal,    txt:"Email sent to CEO, Al-Noor Steel — Touch #1",                     ts:"1 hr ago"    },
  { icon:"📅", c:T.green,   txt:"Meeting booked: Abdullah Al-Otaibi, May 8, 10:00 AM",             ts:"3 hrs ago"   },
  { icon:"🔔", c:T.amber,   txt:"READINESS ALERT: Al-Watan Insurance crossed 90% threshold",       ts:"5 hrs ago"   },
  { icon:"✉️", c:T.teal,    txt:"Email opened: Tameer Contracting Co. — 2nd open",                 ts:"Yesterday"   },
];

const WEEKLY_DATA = [
  { w:"W14", leads:18, meets:1 }, { w:"W15", leads:22, meets:2 },
  { w:"W16", leads:15, meets:1 }, { w:"W17", leads:28, meets:3 },
  { w:"W18", leads:19, meets:2 }, { w:"W19", leads:24, meets:3 },
  { w:"W20", leads:31, meets:4 }, { w:"W21", leads:25, meets:3 },
];

const INDUSTRY_DATA = [
  { name:"Insurance", value:95, fill:"#2ECC8B" }, { name:"Logistics", value:88, fill:"#1B6EF3" },
  { name:"Manufacturing", value:85, fill:"#00D4FF" }, { name:"Construction", value:74, fill:"#F5A623" },
  { name:"Real Estate", value:71, fill:"#A855F7" }, { name:"Healthcare", value:68, fill:"#FF8C00" },
  { name:"Retail", value:58, fill:"#FF5C5C" },
];

const CONV_DATA = [
  { w:"W17", qual:20, meet:7 }, { w:"W18", qual:23, meet:9 },
  { w:"W19", qual:25, meet:10 }, { w:"W20", qual:27, meet:12 }, { w:"W21", qual:26.8, meet:10.5 },
];

const EMAIL_PERF = [
  { seq:"Manufacturing", open:53, reply:9 },
  { seq:"Logistics", open:59, reply:9 },
  { seq:"Insurance", open:50, reply:0 },
];

const PIPELINE_PIE = [
  { name:"New Leads", value:38 }, { name:"Outreach", value:18 },
  { name:"Engaged", value:9 },  { name:"Meeting", value:4 }, { name:"Proposal", value:1 },
];
const PIE_COLORS = [T.accent, T.teal, T.amber, T.green, T.purple];

/* ─── HELPERS ───────────────────────────────────────────────────────── */
const icpColor   = s => s >= 75 ? T.green : s >= 50 ? T.amber : T.red;
const rdColor    = r => r >= 70 ? T.green : r >= 40 ? T.amber : T.accent;

/* ─── SMALL COMPONENTS ──────────────────────────────────────────────── */
const Tag = ({ children, color = T.accent }) => (
  <span style={{ background:`${color}22`, color, border:`1px solid ${color}44`,
    borderRadius:4, padding:"2px 7px", fontSize:9, fontWeight:500, whiteSpace:"nowrap" }}>
    {children}
  </span>
);

const Btn = ({ children, variant="default", onClick, style={}, small }) => {
  const base = { fontFamily:"'IBM Plex Sans',sans-serif", cursor:"pointer", borderRadius:6,
    fontSize: small?10:11, fontWeight:500, transition:"all .15s",
    padding: small?"3px 8px":"6px 12px", display:"inline-flex", alignItems:"center", gap:5 };
  const vs = {
    default: { background:`${T.accent}18`, border:`1px solid ${T.accent}33`, color:"#7BA7F5" },
    primary: { background:`linear-gradient(135deg,${T.accent},#0D5CD4)`, border:"none", color:"#fff" },
    green:   { background:`${T.green}18`, border:`1px solid ${T.green}33`, color:T.green },
    amber:   { background:`${T.amber}18`, border:`1px solid ${T.amber}33`, color:T.amber },
    red:     { background:`${T.red}18`, border:`1px solid ${T.red}33`, color:T.red },
    ghost:   { background:"transparent", border:`1px solid ${T.border2}`, color:T.txt2 },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...vs[variant], ...style }}
      onMouseEnter={e => e.currentTarget.style.opacity = ".8"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
      {children}
    </button>
  );
};

const Card = ({ children, style={}, className="" }) => (
  <div className={className} style={{ background:T.card, border:`1px solid ${T.border}`,
    borderRadius:10, padding:14, ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:10, fontWeight:600,
    color:T.txt2, textTransform:"uppercase", letterSpacing:".6px", marginBottom:10 }}>
    {children}
  </div>
);

const IcpBadge = ({ score }) => (
  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, fontWeight:700, color:icpColor(score) }}>
    ● {score}
  </span>
);

const RdBar = ({ pct }) => (
  <div style={{ height:2, background:"rgba(255,255,255,0.07)", borderRadius:1, marginTop:5 }}>
    <div style={{ height:2, borderRadius:1, width:`${pct}%`, background:rdColor(pct), transition:"width .4s" }} />
  </div>
);

const KpiCard = ({ icon: Icon, label, value, trend, pct, color=T.accent }) => (
  <Card>
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
      <Icon size={16} color={color} />
      <span style={{ fontSize:9, color:T.green, display:"flex", alignItems:"center", gap:3 }}>
        <ArrowUpRight size={9}/>{trend}
      </span>
    </div>
    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:22, fontWeight:700,
      marginTop:8, animation:"countUp .5s ease" }}>{value}</div>
    <div style={{ fontSize:10, color:T.txt2, marginTop:2 }}>{label}</div>
    <div style={{ height:2, background:"rgba(255,255,255,0.07)", borderRadius:1, marginTop:10 }}>
      <div style={{ height:2, borderRadius:1, width:`${pct}%`,
        background:`linear-gradient(90deg,${T.accent},${T.teal})` }} />
    </div>
  </Card>
);

/* ─── LOADING SPINNER ────────────────────────────────────────────────── */
const Spinner = () => (
  <div style={{ width:12, height:12, border:`2px solid ${T.teal}33`,
    borderTop:`2px solid ${T.teal}`, borderRadius:"50%", animation:"spin .8s linear infinite" }} />
);

/* ─── AI RESULT BOX ──────────────────────────────────────────────────── */
const AiResultBox = ({ text, loading }) => {
  if (!text && !loading) return null;
  return (
    <div style={{ background:`${T.teal}08`, border:`1px solid ${T.teal}22`,
      borderRadius:7, padding:11, marginTop:8, fontSize:11, lineHeight:1.85, color:T.txt2,
      animation:"fadeUp .3s ease" }}>
      {loading
        ? <div style={{ display:"flex", alignItems:"center", gap:8, color:T.teal }}>
            <Spinner /> <span>Generating<span className="dots"/></span>
          </div>
        : text}
    </div>
  );
};

/* ─── DRAWER ─────────────────────────────────────────────────────────── */
const LeadDrawer = ({ lead, onClose }) => {
  const [hyp, setHyp] = useState("");
  const [hypLoading, setHypLoading] = useState(false);

  const genHyp = useCallback(async () => {
    setHypLoading(true); setHyp("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:200,
          system:"You are an expert consultant at Efficiency Steps Consulting (ESC), specializing in Saudi SMEs. Given a company profile, generate a specific pain-point hypothesis (2-3 sentences) for a sales consultant. Reference ESC thresholds: SAR 50M=founder bottleneck, SAR 100M=governance drag, SAR 250M=leadership fragmentation. Output ONLY the hypothesis.",
          messages:[{ role:"user", content:`Company: ${lead.co}, Industry: ${lead.ind}, Revenue: SAR ${lead.rev}M` }]
        })
      });
      const d = await r.json();
      setHyp(d.content?.find(x=>x.type==="text")?.text || "Unable to generate.");
    } catch { setHyp("API unavailable — ensure API access is configured."); }
    setHypLoading(false);
  }, [lead]);

  const breakdown = [
    ["Industry Match", Math.round(lead.icp * .34)],
    ["Revenue Fit",    Math.round(lead.icp * .25)],
    ["Location",       Math.round(lead.icp * .21)],
    ["Data Quality",   Math.round(lead.icp * .20)],
  ];

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.6)",zIndex:200,
        display:"flex",justifyContent:"flex-end" }}>
      <div className="fadeUp" style={{ width:360,height:"100%",background:T.bg2,
        borderLeft:`1px solid ${T.border}`,overflowY:"auto",padding:18 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
          <div>
            <div style={{ fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:600 }}>{lead.co}</div>
            <Tag color={T.accent}>{lead.ind}</Tag>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:T.txt2,cursor:"pointer",fontSize:18 }}>
            <X size={16}/>
          </button>
        </div>

        <div style={{ display:"flex",gap:8,marginBottom:14 }}>
          <span style={{ background:`${icpColor(lead.icp)}18`,border:`1px solid ${icpColor(lead.icp)}33`,
            borderRadius:7,padding:"5px 12px",fontFamily:"'Space Mono',monospace",
            fontSize:14,fontWeight:700,color:icpColor(lead.icp) }}>ICP {lead.icp}/100</span>
          <span style={{ background:`${rdColor(lead.rd)}18`,border:`1px solid ${rdColor(lead.rd)}33`,
            borderRadius:10,padding:"5px 10px",fontSize:10,color:rdColor(lead.rd) }}>
            Readiness {lead.rd}%
          </span>
        </div>

        <Card style={{ marginBottom:10 }}>
          <SectionTitle>ICP Score Breakdown</SectionTitle>
          {breakdown.map(([lb,pt])=>(
            <div key={lb} style={{ display:"flex",justifyContent:"space-between",
              fontSize:11,marginBottom:5,paddingBottom:5,borderBottom:`1px solid ${T.border}` }}>
              <span style={{ color:T.txt2 }}>{lb}</span>
              <span style={{ fontFamily:"'Space Mono',monospace",color:T.txt }}>{pt} pts</span>
            </div>
          ))}
        </Card>

        <Card style={{ marginBottom:10 }}>
          <SectionTitle>Company Profile</SectionTitle>
          {[
            ["Est. Revenue", `SAR ${lead.rev}M`],
            ["Location", lead.loc],
            ["Decision-Maker", lead.ceo !== "—" ? `${lead.ceo} · ${lead.title}` : `${lead.title} (to be enriched)`],
            ["Last Activity", lead.la],
          ].map(([k,v])=>(
            <div key={k} style={{ display:"flex",gap:8,fontSize:11,marginBottom:6,lineHeight:1.6 }}>
              <span style={{ color:T.txt2,minWidth:110,flexShrink:0 }}>{k}</span>
              <span style={{ color:T.txt }}>{v}</span>
            </div>
          ))}
        </Card>

        <div style={{ marginBottom:12 }}>
          <SectionTitle>Pain Point Hypothesis</SectionTitle>
          {!hyp && !hypLoading &&
            <div style={{ fontSize:11,color:T.txt2,marginBottom:8 }}>
              Click below to generate an AI-powered pain point hypothesis for this prospect.
            </div>}
          <AiResultBox text={hyp} loading={hypLoading} />
          <Btn variant="primary" onClick={genHyp} style={{ width:"100%",justifyContent:"center",marginTop:8 }}>
            <Zap size={12}/> Generate Pain Point Hypothesis
          </Btn>
        </div>

        <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:12,display:"flex",gap:7 }}>
          <Btn variant="green" style={{ flex:1,justifyContent:"center" }} onClick={onClose}>
            <Plus size={11}/> Pipeline
          </Btn>
          <Btn variant="primary" style={{ flex:1,justifyContent:"center" }} onClick={onClose}>
            <Send size={11}/> Outreach
          </Btn>
          <Btn onClick={onClose}>Skip</Btn>
        </div>
      </div>
    </div>
  );
};

/* ─── READINESS MODAL ───────────────────────────────────────────────── */
const ReadinessModal = ({ leads, onClose, onBook }) => {
  const hot = [...leads].sort((a,b)=>b.rd-a.rd)[0];
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.65)",
        zIndex:300,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <Card className="fadeUp" style={{ width:360,padding:22 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
          <Bell size={18} color={T.amber}/>
          <span style={{ fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:600 }}>
            High-Readiness Lead Alert
          </span>
          <button onClick={onClose} style={{ marginLeft:"auto",background:"none",border:"none",
            color:T.txt2,cursor:"pointer" }}><X size={14}/></button>
        </div>
        <div style={{ background:`${T.green}0A`,border:`1px solid ${T.green}25`,
          borderRadius:8,padding:12,marginBottom:12 }}>
          <div style={{ fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600 }}>{hot.co}</div>
          <div style={{ fontSize:11,color:T.txt2,marginTop:3 }}>{hot.ind} · SAR {hot.rev}M · ICP {hot.icp}/100</div>
          <div style={{ fontSize:11,color:T.green,marginTop:5 }}>
            Readiness Score: {hot.rd}% — Recommend booking a meeting now
          </div>
        </div>
        <div style={{ fontSize:11,color:T.txt2,marginBottom:14,lineHeight:1.7 }}>
          This lead has crossed the readiness threshold. Engagement signals suggest optimal timing for a 30-minute discovery call.
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <Btn variant="primary" style={{ flex:1,justifyContent:"center" }} onClick={()=>{onClose();onBook();}}>
            <Calendar size={11}/> Book Meeting Now
          </Btn>
          <Btn style={{ flex:1,justifyContent:"center" }} onClick={onClose}>Remind Later</Btn>
        </div>
      </Card>
    </div>
  );
};

/* ─── CUSTOM TOOLTIP ─────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:T.bg2,border:`1px solid ${T.border2}`,borderRadius:6,
      padding:"7px 11px",fontSize:11 }}>
      <div style={{ color:T.txt2,marginBottom:4 }}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{ color:p.color,marginBottom:2 }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SCREEN 1 — DASHBOARD
═══════════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const funnelStages = [
    { lb:"Discovered", n:142, c:"#1B6EF3", h:70 },
    { lb:"Qualified",  n:38,  c:"#0C9BC4", h:60 },
    { lb:"Outreach",   n:18,  c:"#0D9B7A", h:50 },
    { lb:"Engaged",    n:9,   c:"#1AB87A", h:40 },
    { lb:"Meetings",   n:4,   c:"#2ECC8B", h:30 },
    { lb:"Proposal",   n:1,   c:"#22A46E", h:22 },
  ];

  return (
    <div className="fadeUp">
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12 }}>
        <KpiCard icon={Search}      label="Leads Discovered" value="142"      trend="+12% vs last month" pct={71} color={T.accent} />
        <KpiCard icon={CheckCircle} label="Qualified Leads"   value="38"       trend="+8% vs last month"  pct={76} color={T.teal}   />
        <KpiCard icon={Calendar}    label="Meetings Booked"   value="4"        trend="+1 vs last month"   pct={80} color={T.green}  />
        <KpiCard icon={DollarSign}  label="Pipeline Value"    value="SAR 1.2M" trend="SAR 200K added"     pct={60} color={T.amber}  />
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          <Card>
            <SectionTitle>Pipeline Funnel — April 2026</SectionTitle>
            <div style={{ display:"flex",alignItems:"flex-end",gap:3,height:80,marginBottom:8 }}>
              {funnelStages.map((s,i)=>(
                <div key={s.lb} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end" }}>
                  <div style={{ width:"100%",background:s.c,borderRadius:5,height:s.h,
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"opacity .2s" }}
                    onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
                    onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                    <span style={{ fontFamily:"'Space Mono',monospace",fontSize:11,fontWeight:700,color:"#fff" }}>{s.n}</span>
                    <span style={{ fontSize:7,color:"rgba(255,255,255,.7)",marginTop:1 }}>{s.lb}</span>
                  </div>
                  {i < funnelStages.length-1 && (
                    <div style={{ position:"absolute",pointerEvents:"none" }}/>
                  )}
                </div>
              ))}
            </div>
            <div style={{ fontSize:10,color:T.txt2,textAlign:"center" }}>
              142 discovered → 38 qualified (26.7%) → 4 meetings (10.5%) → 1 proposal
            </div>
          </Card>

          <Card>
            <SectionTitle>Weekly Performance — Last 8 Weeks</SectionTitle>
            <ResponsiveContainer width="100%" height={165}>
              <BarChart data={WEEKLY_DATA} margin={{top:5,right:5,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="w" tick={{fill:T.txt3,fontSize:9}} tickLine={false} axisLine={false}/>
                <YAxis yAxisId="left" tick={{fill:T.txt3,fontSize:9}} tickLine={false} axisLine={false}/>
                <YAxis yAxisId="right" orientation="right" tick={{fill:T.teal,fontSize:9}} tickLine={false} axisLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar yAxisId="left" dataKey="leads" name="Leads" fill={`${T.accent}80`} radius={[3,3,0,0]}/>
                <Line yAxisId="right" type="monotone" dataKey="meets" name="Meetings"
                  stroke={T.teal} strokeWidth={2} dot={{r:3,fill:T.teal}} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card>
          <SectionTitle>Live Agent Activity Feed</SectionTitle>
          {ACTIVITY.map((a,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,
              padding:"7px 0",borderBottom:`1px solid ${T.border}` }}>
              <div style={{ width:24,height:24,borderRadius:"50%",background:`${a.c}22`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0 }}>
                {a.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11,lineHeight:1.5 }}>{a.txt}</div>
                <div style={{ fontSize:9,color:T.txt2,marginTop:1 }}>{a.ts}</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:10,marginTop:2,
            fontSize:10,color:T.txt2,lineHeight:1.7 }}>
            ESC Proven Outcomes:&nbsp;
            <span style={{color:T.green}}>15–35% cost reduction</span> ·&nbsp;
            <span style={{color:T.teal}}>2–5x faster decisions</span> ·&nbsp;
            <span style={{color:T.amber}}>+30% productivity</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SCREEN 2 — LEAD DISCOVERY
═══════════════════════════════════════════════════════════════════════ */
const SCAN_STEPS = [
  "Connecting to Google Maps API — Riyadh Districts",
  "Scanning Al-Olaya Business District (34 found)...",
  "Scanning North Riyadh Industrial Zone (21 found)...",
  "Cross-referencing Chamber of Commerce Registry",
  "Filtering by ICP criteria: SAR 20M–300M Revenue",
  "Running AI ICP scoring model on 89 candidates",
  "Enriching decision-maker data via firmographic sources",
  "Deduplicating against existing pipeline — 47 net-new leads",
];

const Discovery = ({ onOpenDrawer }) => {
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanFound, setScanFound] = useState(0);
  const tmRef = useRef(null);

  const rows = [
    { co:"Al-Rashid Group",          ind:"Manufacturing", rev:"SAR 120M", loc:"North Riyadh",    icp:87, src:"Google Maps",          leadIdx:0 },
    { co:"Tameer Contracting",        ind:"Construction",  rev:"SAR 65M",  loc:"Al-Olaya",        icp:74, src:"Chamber of Commerce",  leadIdx:1 },
    { co:"Nour Express Logistics",    ind:"Logistics",     rev:"SAR 22M",  loc:"Industrial City", icp:91, src:"Google Maps",          leadIdx:2 },
    { co:"Gulf Medical Supplies",     ind:"Healthcare",    rev:"SAR 55M",  loc:"South Riyadh",    icp:68, src:"Zawya Directory",      leadIdx:3 },
    { co:"Riyadh Steel Products",     ind:"Manufacturing", rev:"SAR 195M", loc:"Jubail Industrial",icp:83, src:"Google Maps",         leadIdx:5 },
    { co:"Kingdom Real Estate Dev.",  ind:"Real Estate",   rev:"SAR 230M", loc:"North Riyadh",    icp:71, src:"Chamber of Commerce", leadIdx:6 },
    { co:"Al-Watan Insurance Brokers",ind:"Insurance",     rev:"SAR 18M",  loc:"Al-Olaya",        icp:95, src:"Google Maps",         leadIdx:4 },
    { co:"Bright Star Trading Co.",   ind:"Retail",        rev:"SAR 42M",  loc:"Al-Malqa",        icp:58, src:"Zawya Directory",     leadIdx:7 },
  ];
  const [added, setAdded] = useState({});

  const runScan = () => {
    setScanning(true); setScanStep(0); setScanFound(0);
    let step = 0, found = 0;
    tmRef.current = setInterval(() => {
      if (step >= SCAN_STEPS.length) { clearInterval(tmRef.current); return; }
      found += Math.floor(Math.random()*9)+2;
      setScanStep(step+1); setScanFound(found);
      step++;
    }, 700);
  };

  useEffect(()=>()=>clearInterval(tmRef.current),[]);

  const thStyle = { textAlign:"left",padding:"7px 10px",fontSize:9,color:T.txt2,
    borderBottom:`1px solid ${T.border}`,fontWeight:500,textTransform:"uppercase",letterSpacing:".3px" };
  const tdStyle = { padding:"8px 10px",borderBottom:`1px solid ${T.border}`,verticalAlign:"middle" };

  return (
    <div className="fadeUp">
      <div style={{ display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center" }}>
        {["Riyadh|Jeddah|Dammam|All KSA","All Industries|Manufacturing|Logistics|Insurance|Real Estate|Construction|Healthcare|Retail",
          "All Sizes|SAR 20M–50M|SAR 50M–100M|SAR 100M–300M"].map((opts,i)=>(
          <select key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:5,
            color:T.txt,fontSize:11,padding:"5px 8px",fontFamily:"'IBM Plex Sans',sans-serif",cursor:"pointer" }}>
            {opts.split("|").map(o=><option key={o} style={{background:T.bg2}}>{o}</option>)}
          </select>
        ))}
        <Btn variant="primary" onClick={runScan}><Search size={11}/> Run Discovery Scan</Btn>
        <Btn><Filter size={11}/> Import from Directory</Btn>
      </div>

      {scanning && (
        <div className="fadeUp" style={{ background:`${T.accent}08`,border:`1px solid ${T.accent}20`,
          borderRadius:8,padding:12,marginBottom:12 }}>
          <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:T.teal,marginBottom:5 }}>
            [Step {scanStep}/{SCAN_STEPS.length}] {SCAN_STEPS[Math.min(scanStep,SCAN_STEPS.length)-1] || "Initializing..."}
          </div>
          <div style={{ height:5,background:"rgba(255,255,255,0.06)",borderRadius:3 }}>
            <div style={{ height:5,borderRadius:3,width:`${Math.round((scanStep/8)*100)}%`,
              background:`linear-gradient(90deg,${T.accent},${T.teal})`,transition:"width .5s" }}/>
          </div>
          <div style={{ fontSize:10,color:T.txt2,marginTop:5 }}>
            Companies found so far: {scanFound} | Running ICP pre-filter...
          </div>
        </div>
      )}

      <Card>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr>
              {["Company","Industry","Revenue","Location","ICP Score","Source","Action"].map(h=>(
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} onClick={()=>onOpenDrawer(LEADS_INIT[r.leadIdx])}
                style={{ cursor:"pointer",transition:"background .15s" }}
                onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}08`}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{...tdStyle,fontWeight:500,fontSize:12}}>{r.co}</td>
                <td style={tdStyle}><Tag>{r.ind}</Tag></td>
                <td style={{...tdStyle,fontFamily:"'Space Mono',monospace",fontSize:10}}>{r.rev}</td>
                <td style={{...tdStyle,fontSize:10,color:T.txt2}}>{r.loc}</td>
                <td style={tdStyle}><IcpBadge score={r.icp}/></td>
                <td style={{...tdStyle,fontSize:10,color:T.txt2}}>{r.src}</td>
                <td style={tdStyle} onClick={e=>e.stopPropagation()}>
                  {added[i]
                    ? <Tag color={T.green}>✓ Added</Tag>
                    : <Btn variant="green" small onClick={()=>setAdded(p=>({...p,[i]:true}))}>
                        + Pipeline
                      </Btn>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SCREEN 3 — LEAD PIPELINE (KANBAN)
═══════════════════════════════════════════════════════════════════════ */
const PIPE_COLS = [
  { k:"new",              lb:"New Leads",         c:T.accent, bg:`${T.accent}15` },
  { k:"outreach",         lb:"Outreach Sent",      c:T.teal,   bg:`${T.teal}10`  },
  { k:"engaged",          lb:"Engaged",            c:T.amber,  bg:`${T.amber}10` },
  { k:"meeting_scheduled",lb:"Meeting Scheduled",  c:T.green,  bg:`${T.green}10` },
  { k:"proposal",         lb:"Proposal",           c:T.purple, bg:`${T.purple}10`},
];

const Pipeline = ({ leads, setLeads, onOpenDrawer }) => {
  const [dragId, setDragId] = useState(null);

  const handleDrop = (e, newSt) => {
    e.preventDefault();
    if (!dragId) return;
    setLeads(prev => prev.map(l => l.id === dragId ? {...l, st:newSt} : l));
    setDragId(null);
  };

  return (
    <div className="fadeUp">
      <div style={{ display:"flex",gap:8,marginBottom:12,alignItems:"center" }}>
        {["All Industries|Manufacturing|Logistics","All Scores|75–100 (High)|50–75 (Mid)|<50 (Low)",
          "All Dates|This Week|This Month"].map((opts,i)=>(
          <select key={i} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:5,
            color:T.txt,fontSize:11,padding:"5px 8px",fontFamily:"'IBM Plex Sans',sans-serif" }}>
            {opts.split("|").map(o=><option key={o} style={{background:T.bg2}}>{o}</option>)}
          </select>
        ))}
        <span style={{ fontSize:10,color:T.txt2,marginLeft:4 }}>Drag cards to update stage</span>
      </div>

      <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:6,minHeight:360 }}>
        {PIPE_COLS.map(col=>{
          const colLeads = leads.filter(l=>l.st===col.k);
          return (
            <div key={col.k} style={{ minWidth:180,width:180,flexShrink:0 }}>
              <div style={{ padding:"7px 9px",borderRadius:"7px 7px 0 0",background:col.bg,
                color:col.c,fontSize:10,fontWeight:600,display:"flex",justifyContent:"space-between" }}>
                {col.lb}
                <span style={{ background:"rgba(255,255,255,0.15)",borderRadius:8,
                  padding:"1px 6px",fontSize:9 }}>{colLeads.length}</span>
              </div>
              <div onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,col.k)}
                style={{ background:"rgba(255,255,255,0.02)",border:`1px solid ${T.border}`,
                  borderTop:"none",borderRadius:"0 0 7px 7px",padding:5,minHeight:280 }}>
                {colLeads.map(l=>(
                  <div key={l.id} draggable
                    onDragStart={()=>setDragId(l.id)}
                    onDragEnd={()=>setDragId(null)}
                    onClick={()=>onOpenDrawer(l)}
                    style={{ background:T.card,border:`1px solid ${l.id===dragId?col.c:T.border}`,
                      borderRadius:7,padding:9,marginBottom:5,cursor:"grab",transition:"all .15s",
                      opacity:l.id===dragId?.5:1 }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=col.c;e.currentTarget.style.transform="translateY(-1px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="none";}}>
                    <div style={{ fontSize:11,fontWeight:600,marginBottom:4,lineHeight:1.3 }}>{l.co}</div>
                    <div style={{ display:"flex",gap:3,flexWrap:"wrap",marginBottom:5 }}>
                      <Tag small color={T.accent}>{l.ind}</Tag>
                      <span style={{ fontFamily:"'Space Mono',monospace",fontSize:9,
                        color:icpColor(l.icp),fontWeight:700 }}>ICP {l.icp}</span>
                    </div>
                    <div style={{ display:"flex",justifyContent:"space-between",fontSize:9,color:T.txt2 }}>
                      <span>Readiness {l.rd}%</span>
                      {l.rd>=50 && <span style={{color:T.amber}}>⚡ Hot</span>}
                    </div>
                    <RdBar pct={l.rd}/>
                    <div style={{ fontSize:9,color:T.txt3,marginTop:4 }}>{l.la}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SCREEN 4 — OUTREACH CAMPAIGNS
═══════════════════════════════════════════════════════════════════════ */
const EN_EMAIL = `Subject: Operational Excellence for [Company Name] — A Specific Opportunity

Dear [First Name],

Leaders at companies like yours — operating at the SAR [Revenue] scale — often find that growth creates invisible cracks in execution speed and margin control.

We've helped 60+ Saudi SMEs resolve exactly this, not with advice, but with embedded systems that produce measurable results within 90 days: 15–35% cost reduction, 2–5x faster decisions, +30% productivity.

Would a focused 30-minute conversation make sense? I can show you what breaking point your current scale is approaching — and what it's costing you monthly.

Best regards,
[Sender Name]
Efficiency Steps Consulting`;

const AR_EMAIL = `الموضوع: التميز التشغيلي لـ [اسم الشركة] — فرصة محددة

السيد / [الاسم الأول] المحترم،

يواجه قادة الشركات في مرحلة النمو التي تمر بها شركتكم تحديات خفية تؤثر على سرعة التنفيذ والهوامش الربحية.

لقد ساعدنا أكثر من 60 شركة سعودية صغيرة ومتوسطة على تجاوز هذه التحديات، ليس بالنصائح، بل بأنظمة تشغيلية متكاملة تحقق نتائج قابلة للقياس خلال 90 يوماً: تخفيض التكاليف 15-35%، وتسريع القرارات 2-5 أضعاف، وزيادة الإنتاجية 30%.

هل يناسبكم محادثة تشخيصية مدتها 30 دقيقة هذا الأسبوع؟

مع التقدير،
[اسم المرسل]
كفاءة الخطوات للاستشارات الإدارية`;

const SEQS = [
  { name:"Manufacturing Segment — Operational Efficiency Angle", enrolled:12, sent:34, opened:18, opPct:53, replies:3, repPct:9,  next:"Tomorrow, 9:00 AM",      status:"active" },
  { name:"Logistics Owner — Supply Chain Resilience",             enrolled:8,  sent:22, opened:13, opPct:59, replies:2, repPct:9,  next:"Thu, May 8 · 9:30 AM",  status:"active" },
  { name:"Insurance Brokerage — Performance System Angle",        enrolled:4,  sent:10, opened:5,  opPct:50, replies:0, repPct:0,  next:"Paused",                 status:"paused" },
];

const Outreach = () => {
  const [langs, setLangs] = useState(["en","en","ar"]);
  const [tones, setTones] = useState(["executive","formal","problem"]);
  const [open, setOpen] = useState([false,false,false]);
  const [aiEmail, setAiEmail] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const toggleOpen = i => setOpen(p => p.map((v,j)=>j===i?!v:v));

  const genEmail = async (seq) => {
    setAiLoading(true); setAiEmail("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514",max_tokens:300,
          system:"You write hyper-personalized B2B sales emails for Efficiency Steps Consulting, a Saudi business transformation firm. Emails must: never reference social media, be respectful of Saudi executive culture, reference ESC outcomes (15-35% cost reduction, 2-5x faster decisions, +30% productivity), be under 150 words, avoid generic consulting jargon. Output ONLY the email, no preamble.",
          messages:[{role:"user",content:`Write a personalized initial outreach email for the ${seq.name} sequence. ${seq.enrolled} leads enrolled, primarily targeting Saudi SMEs at growth stage.`}]
        })
      });
      const d = await r.json();
      setAiEmail(d.content?.find(x=>x.type==="text")?.text || "Unable to generate.");
    } catch { setAiEmail("API unavailable."); }
    setAiLoading(false);
  };

  const TONE_OPTS = [["formal","Formal Arabic"],["executive","Executive Direct"],["problem","Problem-Focused"]];

  return (
    <div className="fadeUp">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <div style={{ fontSize:12,color:T.txt2 }}>
          <span style={{ color:T.green,fontWeight:600 }}>{SEQS.filter(s=>s.status==="active").length} Active</span> sequences ·&nbsp;
          {SEQS.reduce((a,s)=>a+s.enrolled,0)} leads enrolled
        </div>
        <Btn variant="primary"><Plus size={11}/> New Sequence</Btn>
      </div>

      {SEQS.map((s,i)=>(
        <div key={i} style={{ background:T.card,border:`1px solid ${T.border}`,
          borderRadius:9,padding:13,marginBottom:9 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
            <div>
              <div style={{ fontSize:12,fontWeight:600,marginBottom:3 }}>{s.name}</div>
              <div style={{ fontSize:10,color:T.txt2 }}>{s.enrolled} enrolled · Next: {s.next}</div>
            </div>
            <span style={{ fontSize:9,padding:"2px 8px",borderRadius:8,
              background: s.status==="active"?`${T.green}15`:`${T.amber}15`,
              color: s.status==="active"?T.green:T.amber }}>
              {s.status==="active"?"● Active":"⏸ Paused"}
            </span>
          </div>

          <div style={{ display:"flex",gap:14,fontSize:10,color:T.txt2,marginBottom:8 }}>
            {[["Sent",s.sent,""],["Opened",s.opened,` (${s.opPct}%)`],["Replies",s.replies,` (${s.repPct}%)`]].map(([lb,v,ex])=>(
              <div key={lb}>{lb}&nbsp;
                <span style={{ fontFamily:"'Space Mono',monospace",color:T.txt,fontWeight:700 }}>{v}</span>
                <span style={{ color:T.green }}>{ex}</span>
              </div>
            ))}
          </div>

          <div style={{ display:"flex",alignItems:"center",gap:3,marginBottom:10 }}>
            {["Day 1","Day 3","Day 7","Day 12","Day 21"].map((d,j)=>(
              <div key={j} style={{ display:"flex",alignItems:"center",flex:j<4?"auto":"0 0 auto",gap:3 }}>
                <div title={d} style={{ width:18,height:18,borderRadius:"50%",
                  background: j<3?`${T.green}20`:`${T.accent}20`,
                  border:`1px solid ${j<3?T.green:T.accent}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:8,color:j<3?T.green:T.teal }}>{j+1}</div>
                {j<4 && <div style={{ flex:1,height:1,background:`${T.accent}30`,minWidth:12 }}/>}
              </div>
            ))}
          </div>

          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:7 }}>
            <div style={{ display:"flex",gap:4 }}>
              {TONE_OPTS.map(([k,lb])=>(
                <button key={k} onClick={()=>setTones(p=>p.map((t,j)=>j===i?k:t))}
                  style={{ padding:"3px 9px",borderRadius:5,fontSize:9,cursor:"pointer",
                    fontFamily:"'IBM Plex Sans',sans-serif",transition:"all .15s",
                    background: tones[i]===k?`${T.accent}25`:"transparent",
                    border:`1px solid ${tones[i]===k?T.accent:T.border}`,
                    color: tones[i]===k?T.txt:T.txt2 }}>{lb}</button>
              ))}
            </div>
            <div style={{ display:"flex",gap:6,alignItems:"center" }}>
              <div style={{ display:"flex",gap:2,background:T.card2,border:`1px solid ${T.border}`,
                borderRadius:5,padding:2 }}>
                {["EN","AR"].map(lg=>(
                  <button key={lg} onClick={()=>setLangs(p=>p.map((l,j)=>j===i?lg.toLowerCase():l))}
                    style={{ padding:"3px 10px",borderRadius:4,fontSize:10,cursor:"pointer",
                      border:"none",fontFamily:"'IBM Plex Sans',sans-serif",transition:"all .15s",
                      background:langs[i]===(lg.toLowerCase())?T.accent:"transparent",
                      color:langs[i]===(lg.toLowerCase())?"#fff":T.txt2 }}>{lg}</button>
                ))}
              </div>
              <Btn onClick={()=>toggleOpen(i)}>
                <Eye size={11}/> Preview {open[i]?"▴":"▾"}
              </Btn>
              <Btn variant="primary" onClick={()=>genEmail(s)}>
                <Zap size={11}/> AI Personalize
              </Btn>
            </div>
          </div>

          {open[i] && (
            <div className="fadeUp" style={{ marginTop:9 }}>
              <div style={{ background:T.bg2,border:`1px solid ${T.border}`,
                borderRadius:7,padding:12,fontSize:11,lineHeight:1.8,
                whiteSpace:"pre-wrap",dir:langs[i]==="ar"?"rtl":"ltr",
                fontFamily:langs[i]==="ar"?"'IBM Plex Sans',sans-serif":"'IBM Plex Sans',sans-serif" }}>
                {langs[i]==="ar" ? AR_EMAIL : EN_EMAIL}
              </div>
            </div>
          )}
        </div>
      ))}

      {(aiEmail || aiLoading) && (
        <Card style={{ marginTop:10 }}>
          <SectionTitle>AI-Personalized Email Draft</SectionTitle>
          <AiResultBox text={aiEmail} loading={aiLoading}/>
        </Card>
      )}

      <Card style={{ marginTop:10 }}>
        <SectionTitle>Batch Send Control</SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12 }}>
          {[["Leads Selected","12"],["Send Window","Tue–Thu, 9–11 AM (KSA)"],
            ["Max Per Day","20 emails / day"],["Est. Delivery","May 6–8, 2026"]].map(([l,v])=>(
            <div key={l}>
              <div style={{ fontSize:9,color:T.txt2,marginBottom:3,textTransform:"uppercase",letterSpacing:".3px" }}>{l}</div>
              <div style={{ fontSize:12,fontWeight:500 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:7 }}>
          <Btn variant="primary"><Send size={11}/> Review &amp; Schedule Send</Btn>
          <Btn><Eye size={11}/> Preview in Arabic</Btn>
          <Btn variant="amber"><Pause size={11}/> Pause All</Btn>
        </div>
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SCREEN 5 — MEETINGS BOOKED
═══════════════════════════════════════════════════════════════════════ */
const MeetingsBrief = ({ meeting, leads }) => {
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const lead = leads.find(l=>l.co===meeting.co) || { ind:"Contracting", rev:65 };

  const gen = async () => {
    setLoading(true); setBrief("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514",max_tokens:450,
          system:"You are a senior consultant at Efficiency Steps Consulting. Generate a pre-meeting brief with exactly these 4 labeled sections:\n\nCOMPANY SNAPSHOT:\nLIKELY PAIN POINT:\nRECOMMENDED OPENING QUESTION:\nESC CASE STUDY TO REFERENCE:\n\nEach section: 1-2 sentences. Be specific, executive-ready, Saudi SME-aware.",
          messages:[{role:"user",content:`Company: ${meeting.co}, Industry: ${lead.ind}, Revenue: SAR ${lead.rev}M, Contact: ${meeting.contact} (${meeting.title}), ICP: ${meeting.icp}, Readiness: ${meeting.rd}%`}]
        })
      });
      const d = await r.json();
      setBrief(d.content?.find(x=>x.type==="text")?.text || "Unable to generate.");
    } catch { setBrief("API unavailable."); }
    setLoading(false);
  };

  const renderBrief = (txt) => {
    const LABELS = ["COMPANY SNAPSHOT:","LIKELY PAIN POINT:","RECOMMENDED OPENING QUESTION:","ESC CASE STUDY TO REFERENCE:"];
    const lines = txt.split("\n").filter(Boolean);
    return lines.map((line,i) => {
      const isLabel = LABELS.some(lb=>line.startsWith(lb));
      return (
        <div key={i} style={{ marginBottom: isLabel?2:8, color: isLabel?T.teal:T.txt2,
          fontSize: isLabel?9:11, fontWeight: isLabel?600:400,
          textTransform: isLabel?"uppercase":undefined, letterSpacing: isLabel?".5px":undefined }}>
          {line}
        </div>
      );
    });
  };

  return (
    <div style={{ marginTop:8 }}>
      <Btn variant="primary" small onClick={gen}>
        <Briefcase size={10}/> Generate Lead Brief
      </Btn>
      {(brief || loading) && (
        <div className="fadeUp" style={{ background:`${T.teal}06`,border:`1px solid ${T.teal}18`,
          borderRadius:7,padding:11,marginTop:8,lineHeight:1.85 }}>
          {loading
            ? <div style={{ display:"flex",alignItems:"center",gap:8,color:T.teal,fontSize:11 }}>
                <Spinner/> <span>Generating brief<span className="dots"/></span>
              </div>
            : renderBrief(brief)}
        </div>
      )}
    </div>
  );
};

const Meetings = ({ leads }) => {
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const meetDays = [8,12,14,19];
  const calCells = [];
  for(let i=0;i<4;i++) calCells.push({d:null,other:true});
  for(let i=1;i<=31;i++) calCells.push({d:i,other:false,has:meetDays.includes(i),today:i===21});

  return (
    <div className="fadeUp" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,alignItems:"start" }}>
      <div>
        <Card style={{ marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
            <SectionTitle style={{ margin:0 }}>May 2026</SectionTitle>
            <div style={{ display:"flex",gap:5 }}>
              <Btn small>Week</Btn>
              <Btn small variant="primary">Month</Btn>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:8 }}>
            {DAYS.map(d=>(
              <div key={d} style={{ fontSize:9,color:T.txt2,textAlign:"center",padding:"3px 0",fontWeight:500 }}>{d}</div>
            ))}
            {calCells.map((c,i)=>(
              <div key={i} style={{ fontSize:10,textAlign:"center",padding:"5px 3px",
                borderRadius:5,position:"relative",cursor:c.has?"pointer":"default",
                color: c.other?T.txt3:c.today?T.teal:c.has?T.txt:T.txt2,
                background: c.today?`${T.accent}25`:c.has?`${T.green}10`:"transparent",
                fontWeight: c.today||c.has?600:400 }}>
                {c.d}
                {c.has && <div style={{ width:4,height:4,borderRadius:"50%",background:T.green,
                  position:"absolute",bottom:1,left:"50%",transform:"translateX(-50%)" }}/>}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>ESC Case Study Quick Reference</SectionTitle>
          {[
            { co:"Logistics Co. (SAR 20M)",   r:"35% cost reduction · SAR 4.2M saved · OTD 71%→93%",      c:T.green  },
            { co:"Steel Mfr. (SAR 200M)",     r:"30% productivity · 90% less downtime · SAR 7.3M benefit", c:T.teal   },
            { co:"Insurance Brokerage (SAR 12M)", r:"Revenue SAR 12M→16.8M · Client churn 18%→12%",        c:T.accent },
          ].map((cs,i)=>(
            <div key={i} style={{ marginBottom:10,paddingBottom:10,
              borderBottom:i<2?`1px solid ${T.border}`:"none" }}>
              <div style={{ fontSize:11,fontWeight:600 }}>{cs.co}</div>
              <div style={{ fontSize:10,color:cs.c,marginTop:3 }}>{cs.r}</div>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <SectionTitle>Upcoming Meetings ({MEETINGS.length} confirmed)</SectionTitle>
        {MEETINGS.map((m,i)=>(
          <div key={m.id} style={{ display:"flex",alignItems:"flex-start",gap:10,
            padding:"10px 0",borderBottom:i<MEETINGS.length-1?`1px solid ${T.border}`:"none" }}>
            <div style={{ background:`${T.accent}15`,border:`1px solid ${T.accent}25`,
              borderRadius:7,padding:"7px 10px",textAlign:"center",minWidth:44,flexShrink:0 }}>
              <div style={{ fontFamily:"'Space Mono',monospace",fontSize:18,fontWeight:700,color:T.accent }}>{m.d}</div>
              <div style={{ fontSize:9,color:T.txt2 }}>{m.m}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:600 }}>{m.contact}</div>
              <div style={{ fontSize:10,color:T.txt2,marginTop:2 }}>{m.title} · {m.co}</div>
              <div style={{ fontSize:10,color:T.txt2,marginTop:2 }}>
                ⏰ {m.day}, {m.time} ·&nbsp;
                ICP <span style={{color:icpColor(m.icp)}}>{m.icp}</span> ·&nbsp;
                Readiness {m.rd}%
              </div>
              <MeetingsBrief meeting={m} leads={leads}/>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SCREEN 6 — PERFORMANCE REPORTS
═══════════════════════════════════════════════════════════════════════ */
const Reports = () => (
  <div className="fadeUp">
    <div style={{ background:`${T.teal}06`,border:`1px solid ${T.teal}15`,
      borderRadius:9,padding:14,marginBottom:12,fontFamily:"'Space Mono',monospace",fontSize:11 }}>
      <div style={{ fontSize:12,fontWeight:700,color:T.teal,marginBottom:6 }}>
        Weekly Report — April 14–20, 2026
      </div>
      <div style={{ borderTop:`1px solid ${T.teal}18`,margin:"6px 0"}}/>
      {[
        ["Leads Discovered","47","+12% vs last week",T.green],
        ["Leads Qualified","11","23% qualification rate",T.green],
        ["Emails Sent","28","2.3 batches",T.txt],
        ["Email Open Rate","58%","Target: >40% ✅",T.green],
        ["Reply Rate","9%","Target: >5% ✅",T.green],
        ["Meetings Booked","2","Target: 3–5/month, on track",T.amber],
        ["Pipeline Value Added","SAR 480,000","This week",T.green],
      ].map(([lb,v,note,c])=>(
        <div key={lb} style={{ display:"flex",justifyContent:"space-between",lineHeight:2 }}>
          <span style={{ color:T.txt2 }}>{lb}</span>
          <span style={{ color:c }}>{v}&nbsp;<span style={{ fontSize:9,color:T.txt2 }}>{note}</span></span>
        </div>
      ))}
      <div style={{ borderTop:`1px solid ${T.teal}18`,marginTop:6,paddingTop:6 }}>
        <div style={{ fontSize:10,color:T.teal }}>Agent Status: Calibration Phase — Week 2 of 4</div>
        <div style={{ fontSize:9,color:T.txt2,marginTop:2 }}>Next Action: Review 5 flagged leads before Friday send batch</div>
      </div>
    </div>

    <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:12 }}>
      {[{n:"142",l:"Total Leads"},{n:"26.8%",l:"Qual. Rate"},{n:"10.5%",l:"Meeting Rate"},
        {n:"SAR 1.2M",l:"Pipeline"},{n:"58%",l:"Open Rate"},{n:"9%",l:"Reply Rate"}].map(s=>(
        <Card key={s.l} style={{ textAlign:"center",padding:"11px 8px" }}>
          <div style={{ fontFamily:"'Space Mono',monospace",fontSize:16,fontWeight:700,color:T.teal }}>{s.n}</div>
          <div style={{ fontSize:9,color:T.txt2,marginTop:3 }}>{s.l}</div>
        </Card>
      ))}
    </div>

    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
      <Card>
        <SectionTitle>Funnel Conversion — Weekly Trend</SectionTitle>
        <ResponsiveContainer width="100%" height={155}>
          <LineChart data={CONV_DATA} margin={{top:5,right:5,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="w" tick={{fill:T.txt3,fontSize:9}} tickLine={false} axisLine={false}/>
            <YAxis tick={{fill:T.txt3,fontSize:9}} tickLine={false} axisLine={false} tickFormatter={v=>v+"%"}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Line type="monotone" dataKey="qual" name="Qual%" stroke={T.accent} strokeWidth={2} dot={{r:3,fill:T.accent}}/>
            <Line type="monotone" dataKey="meet" name="Meet%" stroke={T.teal} strokeWidth={2} dot={{r:3,fill:T.teal}}/>
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionTitle>Email Performance by Sequence</SectionTitle>
        <ResponsiveContainer width="100%" height={155}>
          <BarChart data={EMAIL_PERF} margin={{top:5,right:5,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="seq" tick={{fill:T.txt3,fontSize:9}} tickLine={false} axisLine={false}/>
            <YAxis tick={{fill:T.txt3,fontSize:9}} tickLine={false} axisLine={false} tickFormatter={v=>v+"%"}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="open" name="Open%" fill={`${T.accent}80`} radius={[3,3,0,0]}/>
            <Bar dataKey="reply" name="Reply%" fill={`${T.green}80`} radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
      <Card>
        <SectionTitle>ICP Score by Industry Segment</SectionTitle>
        <ResponsiveContainer width="100%" height={155}>
          <BarChart data={INDUSTRY_DATA} layout="vertical" margin={{top:5,right:5,left:50,bottom:0}}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.04)"/>
            <XAxis type="number" domain={[0,100]} tick={{fill:T.txt3,fontSize:9}} tickLine={false} axisLine={false}/>
            <YAxis type="category" dataKey="name" tick={{fill:T.txt3,fontSize:9}} tickLine={false} axisLine={false} width={60}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="value" name="Avg ICP" radius={[0,3,3,0]}>
              {INDUSTRY_DATA.map((d,i)=><Cell key={i} fill={`${d.fill}90`}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionTitle>Pipeline Stage Distribution</SectionTitle>
        <ResponsiveContainer width="100%" height={155}>
          <PieChart>
            <Pie data={PIPELINE_PIE} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
              paddingAngle={3} dataKey="value">
              {PIPELINE_PIE.map((d,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
            </Pie>
            <Tooltip content={<CustomTooltip/>}/>
            <Legend iconType="circle" iconSize={8} formatter={(v)=><span style={{fontSize:9,color:T.txt2}}>{v}</span>}/>
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <Card style={{ marginTop:10 }}>
      <SectionTitle>ESC Benchmark Outcomes</SectionTitle>
      {[
        {lb:"Cost Reduction Delivered",v:"35%",t:"15–35%",met:true},
        {lb:"Decision Speed Improvement",v:"3x",t:"2–5x",met:true},
        {lb:"Productivity Gain",v:"+28%",t:"+30%",met:false},
        {lb:"Working Capital Released",v:"SAR 1.6M",t:"Per engagement",met:true},
      ].map(b=>(
        <div key={b.lb} style={{ display:"flex",alignItems:"center",gap:10,
          padding:"7px 0",borderBottom:`1px solid ${T.border}` }}>
          <span style={{ flex:1,fontSize:12 }}>{b.lb}</span>
          <span style={{ fontFamily:"'Space Mono',monospace",fontSize:13,fontWeight:700,
            color:b.met?T.green:T.amber,marginRight:8 }}>{b.v}</span>
          <span style={{ fontSize:10,color:T.txt2 }}>Target: {b.t}</span>
          <span style={{ marginLeft:6 }}>{b.met?"✅":"⚡"}</span>
        </div>
      ))}
    </Card>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   SCREEN 7 — AGENT SETTINGS
═══════════════════════════════════════════════════════════════════════ */
const INDUSTRIES = ["Manufacturing","Logistics","Insurance","Construction","Healthcare","Retail","Real Estate"];
const WEIGHTS = [
  {lb:"Industry Match",pct:30,c:T.accent},
  {lb:"Revenue Fit",pct:25,c:T.teal},
  {lb:"Location (Riyadh)",pct:20,c:T.green},
  {lb:"Digital Presence",pct:15,c:T.amber},
  {lb:"Firmographic Quality",pct:10,c:T.purple},
];

const AgentSettings = () => {
  const [inds, setInds] = useState(["Manufacturing","Logistics","Insurance","Construction","Real Estate"]);

  const FieldLabel = ({children}) => (
    <div style={{ fontSize:9,color:T.txt2,marginBottom:4,textTransform:"uppercase",letterSpacing:".3px" }}>
      {children}
    </div>
  );
  const Input = ({value,readOnly}) => (
    <input defaultValue={value} readOnly={readOnly}
      style={{ background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,
        color:T.txt,fontSize:11,padding:"6px 9px",width:"100%",
        fontFamily:"'IBM Plex Sans',sans-serif",outline:"none",cursor:readOnly?"default":"text" }}/>
  );
  const Select = ({opts,sel}) => (
    <select defaultValue={sel}
      style={{ background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,
        color:T.txt,fontSize:11,padding:"6px 9px",width:"100%",fontFamily:"'IBM Plex Sans',sans-serif" }}>
      {opts.map(o=><option key={o} style={{background:T.bg2}}>{o}</option>)}
    </select>
  );

  return (
    <div className="fadeUp" style={{ maxWidth:600 }}>
      <Card style={{ marginBottom:10 }}>
        <SectionTitle>Ideal Customer Profile (ICP)</SectionTitle>
        <FieldLabel>Target Industries</FieldLabel>
        <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:12 }}>
          {INDUSTRIES.map(ind=>(
            <label key={ind} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,cursor:"pointer" }}>
              <input type="checkbox" checked={inds.includes(ind)} style={{accentColor:T.accent}}
                onChange={()=>setInds(p=>p.includes(ind)?p.filter(x=>x!==ind):[...p,ind])}/>
              {ind}
            </label>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
          <div><FieldLabel>Decision-Maker Titles</FieldLabel><Input value="CEO, COO, General Manager, Owner"/></div>
          <div><FieldLabel>Ownership Type</FieldLabel><Select opts={["Founder-led & Second-generation","Corporate / Listed","All"]} sel="Founder-led & Second-generation"/></div>
          <div><FieldLabel>Revenue Min</FieldLabel><Input value="SAR 20M"/></div>
          <div><FieldLabel>Revenue Max</FieldLabel><Input value="SAR 300M"/></div>
          <div><FieldLabel>Growth Stage</FieldLabel><Select opts={["Scaling (SAR 50M–250M)","Early Growth","Mature"]} sel="Scaling (SAR 50M–250M)"/></div>
          <div><FieldLabel>Primary Geography</FieldLabel><Select opts={["Riyadh (Primary) + All KSA","Riyadh Only","All KSA"]} sel="Riyadh (Primary) + All KSA"/></div>
        </div>
        <div style={{ fontSize:10,color:T.txt2,lineHeight:1.7 }}>
          Pain Signal Keywords: Rapid headcount growth · Founder bottleneck · Margin erosion · Delayed decision-making
        </div>
      </Card>

      <Card style={{ marginBottom:10 }}>
        <SectionTitle>Lead Scoring Weights</SectionTitle>
        <div style={{ fontSize:10,color:T.txt2,marginBottom:10 }}>Signals used in AI ICP scoring model</div>
        {WEIGHTS.map(w=>(
          <div key={w.lb} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
            <div style={{ fontSize:11,color:T.txt2,width:145,flexShrink:0 }}>{w.lb}</div>
            <div style={{ flex:1,height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,position:"relative" }}>
              <div style={{ position:"absolute",left:0,top:0,height:4,borderRadius:2,
                width:`${w.pct}%`,background:w.c }}/>
            </div>
            <div style={{ fontFamily:"'Space Mono',monospace",fontSize:10,color:T.txt,width:30,textAlign:"right" }}>
              {w.pct}%
            </div>
          </div>
        ))}
        <div style={{ fontSize:10,color:T.txt3,marginTop:4 }}>Total: 100% · Contact NKU Technologies to reconfigure</div>
      </Card>

      <Card style={{ marginBottom:10 }}>
        <SectionTitle>Email &amp; Outreach Settings</SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
          {[
            {lb:"Sending Domain",    v:"outreach@efficiencysteps.sa"},
            {lb:"Daily Send Limit",  v:"20 emails / day"},
            {lb:"Send Window",       v:"Tue–Thu, 9 AM–12 PM (KSA)"},
            {lb:"Language Default",  v:"Bilingual (EN + AR)"},
            {lb:"Warm-up Status",    v:"✅ Domain warmed (Day 18/30)"},
            {lb:"Bounce Rate",       v:"1.2% (Healthy)"},
          ].map(f=>(
            <div key={f.lb}><FieldLabel>{f.lb}</FieldLabel><Input value={f.v} readOnly/></div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom:10 }}>
        <SectionTitle>AI Agent Configuration</SectionTitle>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
          <div><FieldLabel>AI Model</FieldLabel><Select opts={["claude-sonnet-4-20250514"]} sel="claude-sonnet-4-20250514"/></div>
          <div><FieldLabel>Agent Mode</FieldLabel><Select opts={["Semi-Autonomous","Full-Auto","Manual Approval"]} sel="Semi-Autonomous"/></div>
          <div><FieldLabel>Email Tone Default</FieldLabel><Select opts={["Executive Direct","Formal Arabic Business","Problem-Focused"]} sel="Executive Direct"/></div>
          <div><FieldLabel>Hypothesis Depth</FieldLabel><Select opts={["Concise (2–3 sentences)","Standard (4–5)","Detailed"]} sel="Concise (2–3 sentences)"/></div>
        </div>
      </Card>

      <Card>
        <SectionTitle>CRM Integration</SectionTitle>
        {["HubSpot","Pipedrive","Notion CRM","Custom Webhook"].map(crm=>(
          <div key={crm} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
            background:"rgba(255,255,255,0.02)",border:`1px solid ${T.border}`,
            borderRadius:7,padding:"9px 12px",marginBottom:5 }}>
            <div>
              <div style={{ fontSize:12,fontWeight:500 }}>{crm}</div>
              <div style={{ fontSize:10,color:T.txt2 }}>⚙️ Not connected</div>
            </div>
            <Btn small>Connect</Btn>
          </div>
        ))}
        <div style={{ fontSize:10,color:T.txt3,marginTop:8 }}>
          Contact NKU Technologies to configure custom webhook or API integration
        </div>
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { ic:LayoutDashboard, lb:"Dashboard",         k:"dashboard" },
  { ic:Search,          lb:"Lead Discovery",    k:"discovery" },
  { ic:BarChart2,       lb:"Lead Pipeline",     k:"pipeline"  },
  { ic:Mail,            lb:"Outreach Campaigns",k:"outreach"  },
  { ic:Calendar,        lb:"Meetings Booked",   k:"meetings"  },
  { ic:TrendingUp,      lb:"Performance Reports",k:"reports"  },
  { ic:Settings,        lb:"Agent Settings",    k:"settings"  },
];

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [agentOn, setAgentOn] = useState(true);
  const [leads, setLeads] = useState(LEADS_INIT);
  const [drawer, setDrawer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const go = (k) => { setScreen(k); setDrawer(null); };
  const toggleAgent = () => setAgentOn(p=>!p);

  const renderScreen = () => {
    switch(screen) {
      case "dashboard": return <Dashboard/>;
      case "discovery": return <Discovery onOpenDrawer={setDrawer}/>;
      case "pipeline":  return <Pipeline leads={leads} setLeads={setLeads} onOpenDrawer={setDrawer}/>;
      case "outreach":  return <Outreach/>;
      case "meetings":  return <Meetings leads={leads}/>;
      case "reports":   return <Reports/>;
      case "settings":  return <AgentSettings/>;
      default:          return <Dashboard/>;
    }
  };

  return (
    <div style={{ display:"flex",height:"100vh",background:T.bg,
      fontFamily:"'IBM Plex Sans',sans-serif",color:T.txt,overflow:"hidden" }}>

      {/* SIDEBAR */}
      <div style={{ width:215,minWidth:215,background:T.bg2,
        borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column" }}>
        <div style={{ padding:"16px 14px 12px",borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:700,
            background:`linear-gradient(135deg,${T.accent},${T.teal})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>ESC</div>
          <div style={{ fontSize:9,color:T.txt2,marginTop:1,letterSpacing:".3px" }}>
            Sales Intelligence Platform
          </div>
          <div style={{ fontSize:8,color:T.txt3,marginTop:1 }}>by NKU Technologies</div>
        </div>

        {/* AGENT TOGGLE */}
        <div style={{ padding:"9px 14px",borderBottom:`1px solid ${T.border}`,
          display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:10,color:T.txt2,flex:1 }}>AI Agent</span>
          <div onClick={toggleAgent} style={{ cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
            {agentOn
              ? <ToggleRight size={24} color={T.accent}/>
              : <ToggleLeft  size={24} color={T.txt3}/>}
          </div>
        </div>

        {/* NAV */}
        <nav style={{ flex:1,padding:"6px 0",overflowY:"auto" }}>
          {NAV_ITEMS.map(({ ic:Icon, lb, k })=>(
            <div key={k} onClick={()=>go(k)}
              style={{ display:"flex",alignItems:"center",gap:9,padding:"9px 14px",
                cursor:"pointer",fontSize:12,transition:"all .15s",
                borderLeft:`2px solid ${screen===k?T.accent:"transparent"}`,
                background: screen===k?`${T.accent}15`:"transparent",
                color: screen===k?T.txt:T.txt2 }}
              onMouseEnter={e=>{ if(screen!==k) e.currentTarget.style.background=`${T.accent}0A`; }}
              onMouseLeave={e=>{ if(screen!==k) e.currentTarget.style.background="transparent"; }}>
              <Icon size={14} color={screen===k?T.accent:T.txt3}/>
              {lb}
            </div>
          ))}
        </nav>

        <div style={{ padding:"10px 14px",borderTop:`1px solid ${T.border}`,
          display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:26,height:26,borderRadius:"50%",
            background:`linear-gradient(135deg,${T.accent},${T.teal})`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700 }}>
            ESC
          </div>
          <div>
            <div style={{ fontSize:11,fontWeight:500 }}>ESC Admin</div>
            <div style={{ fontSize:9,color:T.txt2 }}>Sales Intelligence</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden" }}>
        {/* PAUSE BANNER */}
        {!agentOn && (
          <div style={{ padding:"6px 18px",background:`${T.red}0A`,
            borderBottom:`1px solid ${T.red}20`,textAlign:"center",
            fontSize:11,color:"#ff9090",flexShrink:0 }}>
            ⚠ Agent paused — no emails will be sent until you resume.
          </div>
        )}

        {/* TOPBAR */}
        <div style={{ padding:"10px 18px",borderBottom:`1px solid ${T.border}`,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          background:T.bg2,flexShrink:0 }}>
          <div style={{ fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:600 }}>
            {NAV_ITEMS.find(n=>n.k===screen)?.lb}
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:5,
              background:agentOn?`${T.green}12`:`${T.red}12`,
              border:`1px solid ${agentOn?T.green:T.red}30`,borderRadius:20,
              padding:"3px 10px",fontSize:10,color:agentOn?T.green:T.red }}>
              <div style={{ width:5,height:5,borderRadius:"50%",
                background:agentOn?T.green:T.red,
                animation:agentOn?"pulse 2s infinite":"none" }}/>
              {agentOn?"Agent Active":"Agent Paused"}
            </div>
            <button onClick={()=>setShowModal(true)}
              style={{ background:"none",border:"none",cursor:"pointer",
                color:T.txt2,display:"flex",alignItems:"center" }}>
              <Bell size={15}/>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1,overflowY:"auto",padding:"16px 18px" }}>
          {renderScreen()}
        </div>
      </div>

      {/* DRAWER */}
      {drawer && <LeadDrawer lead={drawer} onClose={()=>setDrawer(null)}/>}

      {/* READINESS MODAL */}
      {showModal && (
        <ReadinessModal
          leads={leads}
          onClose={()=>setShowModal(false)}
          onBook={()=>go("meetings")}
        />
      )}
    </div>
  );
}
