import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Upload, Link2, Scissors, Type, Mic2, Download, Play,
  CheckCircle2, ArrowRight, Zap, TrendingUp, SkipForward, Pause,
} from "lucide-react";

// ── Tokens ────────────────────────────────────────────────────────────────────
const C = {
  accent:      "#7C3AED",
  accentLight: "#8B5CF6",
  teal:        "#00D2A8",
  yellow:      "#F59E0B",
};

const STEPS = [
  { id:"upload",     icon:Upload,   label:"Upload",      sub:"Drop file or paste URL",         color:C.accentLight },
  { id:"transcribe", icon:Type,     label:"Transcribe",  sub:"Whisper AI, timestamped",        color:C.teal },
  { id:"detect",     icon:Scissors, label:"Highlights",  sub:"GPT-4 virality scoring",         color:C.accentLight },
  { id:"captions",   icon:Type,     label:"Captions",    sub:"Animated TikTok-style",          color:C.teal },
  { id:"voiceover",  icon:Mic2,     label:"Voiceover",   sub:"ElevenLabs natural voice",       color:C.yellow },
  { id:"export",     icon:Download, label:"Export",      sub:"1080p · TikTok, Reels, Shorts",  color:C.teal },
];

const CLIPS = [
  { title:"Morning routine hook", platform:"TikTok", score:94, duration:"0:30" },
  { title:"Key insight moment",   platform:"Reels",  score:88, duration:"0:15" },
  { title:"Emotional story arc",  platform:"Shorts", score:91, duration:"1:00" },
  { title:"Viral CTA ending",     platform:"TikTok", score:86, duration:"0:30" },
];

const CAPTION_WORDS = [
  {word:"THIS",hi:true},{word:"is",hi:false},{word:"HOW",hi:true},
  {word:"you",hi:false},{word:"go",hi:false},{word:"VIRAL",hi:true},
  {word:"in",hi:false},{word:"SECONDS",hi:true},
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function Counter({ to, suffix="", duration=1200 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let n=0; const step=to/(duration/16);
    const t=setInterval(()=>{ n+=step; if(n>=to){setV(to);clearInterval(t);}else setV(Math.floor(n)); },16);
    return ()=>clearInterval(t);
  }, [to, duration]);
  return <>{v.toLocaleString()}{suffix}</>;
}

// shared card style
const card = (extra={}) => ({
  background:"rgba(255,255,255,0.03)",
  border:"1px solid rgba(255,255,255,0.08)",
  borderRadius:16,
  backdropFilter:"blur(12px)",
  ...extra,
});

// ── Step panels ───────────────────────────────────────────────────────────────
function UploadStep({ active }) {
  const [prog, setProg] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(()=>{
    if(!active){setProg(0);setDone(false);return;}
    setProg(0);setDone(false);
    const t=setInterval(()=>setProg(p=>{if(p>=100){clearInterval(t);setDone(true);return 100;}return p+1.8;}),28);
    return ()=>clearInterval(t);
  },[active]);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{
        border:`2px dashed ${active?"rgba(139,92,246,0.5)":"rgba(255,255,255,0.1)"}`,
        borderRadius:16,padding:"24px 16px",textAlign:"center",
        background:active?"rgba(139,92,246,0.05)":"transparent",transition:"all 0.4s",
      }}>
        <div style={{
          width:48,height:48,borderRadius:14,margin:"0 auto 12px",
          background:active?"rgba(139,92,246,0.2)":"rgba(255,255,255,0.05)",
          display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.4s",
        }}>
          <Upload size={20} color={active?"#a78bfa":"rgba(255,255,255,0.25)"} />
        </div>
        <p style={{margin:"0 0 4px",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)"}}>morning-routine-full.mp4</p>
        <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.3)"}}>47 minutes · 2.1 GB</p>
        {active&&(
          <div style={{marginTop:16}}>
            <div style={{height:3,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden"}}>
              <div style={{width:`${prog}%`,height:"100%",background:`linear-gradient(90deg,${C.accent},${C.teal})`,borderRadius:99,transition:"width 0.08s"}} />
            </div>
            <p style={{margin:"6px 0 0",fontSize:11,color:"rgba(255,255,255,0.35)"}}>
              {done?"✓ Upload complete":`Uploading… ${Math.floor(prog)}%`}
            </p>
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1,...card({padding:"10px 12px",display:"flex",alignItems:"center",gap:8,borderRadius:12})}} >
          <Link2 size={12} color="rgba(255,255,255,0.3)" />
          <span style={{fontSize:11,color:active?"rgba(255,255,255,0.45)":"rgba(255,255,255,0.2)",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
            https://youtube.com/watch?v=...
          </span>
        </div>
        <div style={{
          padding:"10px 16px",borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer",
          background:active?C.accent:"rgba(255,255,255,0.05)",
          color:active?"#fff":"rgba(255,255,255,0.2)",transition:"all 0.3s",
        }}>Import</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {["YouTube","TikTok","Instagram","Facebook","Twitch"].map(p=>(
          <span key={p} style={{
            fontSize:10,padding:"3px 8px",borderRadius:6,
            border:`1px solid ${active?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.05)"}`,
            color:active?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.18)",transition:"all 0.3s",
          }}>{p}</span>
        ))}
      </div>
    </div>
  );
}

function TranscribeStep({ active }) {
  const lines=[
    {t:"00s",text:"I wake up every single morning at 5AM and"},
    {t:"04s",text:"it has completely changed my life in ways I"},
    {t:"08s",text:"never expected. The first thing I do is..."},
    {t:"12s",text:"hydrate. Not coffee. Water. Here's why that"},
    {t:"16s",text:"matters more than anything else you'll do..."},
  ];
  const [shown,setShown]=useState(0);
  useEffect(()=>{
    if(!active){setShown(0);return;}
    let i=0;
    const t=setInterval(()=>{i++;setShown(i);if(i>=lines.length)clearInterval(t);},380);
    return ()=>clearInterval(t);
  },[active]);
  return (
    <div style={{...card(),overflow:"hidden"}}>
      <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:active?C.teal:"rgba(255,255,255,0.2)",boxShadow:active?`0 0 8px ${C.teal}`:"none"}} />
        <span style={{fontSize:10,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>
          {active?"Whisper AI — transcribing…":"Awaiting audio"}
        </span>
      </div>
      <div style={{padding:14,display:"flex",flexDirection:"column",gap:10,minHeight:140}}>
        {lines.map((l,i)=>(
          <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",opacity:i<shown?1:0,transform:i<shown?"translateY(0)":"translateY(8px)",transition:"all 0.3s"}}>
            <span style={{fontFamily:"monospace",fontSize:9,color:`${C.teal}80`,marginTop:2,flexShrink:0}}>{l.t}</span>
            <p style={{margin:0,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>{l.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetectStep({ active }) {
  const [scores,setScores]=useState([0,0,0,0]);
  useEffect(()=>{
    if(!active){setScores([0,0,0,0]);return;}
    const targets=[94,88,91,86];
    const timers=targets.map((target,i)=>setTimeout(()=>{
      let v=0;
      const t=setInterval(()=>{v+=2.5;setScores(s=>{const n=[...s];n[i]=Math.min(Math.floor(v),target);return n;});if(v>=target)clearInterval(t);},18);
    },i*280));
    return ()=>timers.forEach(clearTimeout);
  },[active]);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {CLIPS.map((clip,i)=>(
        <div key={clip.title} style={{
          ...card({padding:"10px 12px",display:"flex",alignItems:"center",gap:10,borderRadius:12}),
          opacity:scores[i]>0?1:0.3,transition:"all 0.4s",
          background:scores[i]>0?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.01)",
        }}>
          <div style={{width:36,height:44,borderRadius:10,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,background:`linear-gradient(145deg,${C.accent}30,${C.teal}15)`}}>🎬</div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{margin:"0 0 3px",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.9)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{clip.title}</p>
            <div style={{display:"flex",gap:6,marginBottom:5}}>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{clip.platform}</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.15)"}}>·</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{clip.duration}</span>
            </div>
            <div style={{height:3,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden"}}>
              <div style={{width:`${scores[i]}%`,height:"100%",background:`linear-gradient(90deg,${C.accent},${C.teal})`,borderRadius:99,transition:"width 0.1s"}} />
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <p style={{margin:"0 0 2px",fontSize:18,fontWeight:900,color:C.teal,fontVariantNumeric:"tabular-nums"}}>{scores[i]}<span style={{fontSize:10}}>%</span></p>
            <div style={{display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end"}}>
              <TrendingUp size={9} color={C.teal} />
              <span style={{fontSize:9,color:`${C.teal}90`}}>viral</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CaptionsStep({ active }) {
  const [aw,setAw]=useState(-1);
  useEffect(()=>{
    if(!active){setAw(-1);return;}
    let i=0;
    const t=setInterval(()=>{setAw(i%CAPTION_WORDS.length);i++;},380);
    return ()=>clearInterval(t);
  },[active]);
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:24,flexWrap:"wrap"}}>
      <div style={{
        width:140,background:"#0a0a0f",
        border:"2px solid rgba(255,255,255,0.1)",borderRadius:32,padding:8,
        boxShadow:`0 24px 64px rgba(0,0,0,0.7),inset 0 0 20px rgba(139,92,246,0.05)`,
        flexShrink:0,
      }}>
        <div style={{
          borderRadius:24,overflow:"hidden",aspectRatio:"9/16",
          background:"linear-gradient(170deg,#0f0c29,#302b63,#24243e)",
          display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:20,position:"relative",
        }}>
          <div style={{position:"absolute",top:"38%",left:"50%",transform:"translate(-50%,-50%)",width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Play size={12} fill="white" color="white" style={{marginLeft:2}} />
          </div>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:3,padding:"0 6px"}}>
            {CAPTION_WORDS.map((w,i)=>(
              <span key={i} style={{
                fontSize:8,fontWeight:900,padding:"2px 5px",borderRadius:3,transition:"all 0.15s",
                background:i===aw?(w.hi?C.teal:"#fff"):(w.hi?`${C.teal}50`:"rgba(255,255,255,0.15)"),
                color:i===aw?"#000":(w.hi?"#fff":"rgba(255,255,255,0.5)"),
                transform:i===aw?"scale(1.15)":"scale(1)",
              }}>{w.word}</span>
            ))}
          </div>
        </div>
      </div>
      {active&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[{label:"Style",val:"TikTok Bold",col:C.teal},{label:"Font",val:"Syne Black",col:C.accentLight},{label:"Speed",val:"1 word/0.4s",col:C.yellow}].map(x=>(
            <div key={x.label} style={{...card({padding:"8px 12px",borderRadius:10})}}>
              <p style={{margin:"0 0 2px",fontSize:9,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{x.label}</p>
              <p style={{margin:0,fontSize:12,fontWeight:700,color:x.col}}>{x.val}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VoiceoverStep({ active }) {
  const [playing,setPlaying]=useState(false);
  const [bars,setBars]=useState(Array(28).fill(3));
  useEffect(()=>{if(!active){setPlaying(false);return;}setTimeout(()=>setPlaying(true),500);},[active]);
  useEffect(()=>{
    if(!playing){setBars(Array(28).fill(3));return;}
    const t=setInterval(()=>setBars(Array(28).fill(0).map(()=>Math.random()*30+3)),75);
    return ()=>clearInterval(t);
  },[playing]);
  const voices=[
    {name:"Aria",tag:"Warm",col:"#f472b6"},
    {name:"Max",tag:"Energetic",col:"#60a5fa"},
    {name:"Nova",tag:"Professional",col:"#a78bfa"},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {voices.map((v,i)=>(
          <div key={v.name} style={{
            ...card({padding:"10px 8px",borderRadius:12,textAlign:"center",cursor:"pointer"}),
            borderColor:active&&i===0?`${C.accent}60`:"rgba(255,255,255,0.07)",
            background:active&&i===0?`${C.accent}12`:"rgba(255,255,255,0.02)",
          }}>
            <div style={{width:32,height:32,borderRadius:"50%",margin:"0 auto 6px",background:`${v.col}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:v.col}}>{v.name[0]}</div>
            <p style={{margin:"0 0 2px",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>{v.name}</p>
            <p style={{margin:0,fontSize:9,color:"rgba(255,255,255,0.3)"}}>{v.tag}</p>
          </div>
        ))}
      </div>
      <div style={{...card({padding:14,borderRadius:14}),borderColor:active?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.05)"}}>
        <div style={{display:"flex",alignItems:"flex-end",gap:2,height:40,justifyContent:"center",marginBottom:10}}>
          {bars.map((h,i)=>(
            <div key={i} style={{width:3,height:h,borderRadius:99,transition:"height 0.07s",background:i<10?C.accent:"rgba(255,255,255,0.1)"}} />
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setPlaying(p=>!p)} style={{
            width:34,height:34,borderRadius:"50%",border:"none",cursor:"pointer",
            background:active?C.accent:"rgba(255,255,255,0.1)",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          }}>
            {playing?<Pause size={11} color="white"/>:<Play size={11} fill="white" color="white" style={{marginLeft:1}}/>}
          </button>
          <div style={{flex:1}}>
            <p style={{margin:"0 0 2px",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.85)"}}>Aria · Warm Voice</p>
            <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,0.3)"}}>0:48 · 1.0×</p>
          </div>
          {active&&playing&&(
            <span style={{fontSize:9,padding:"3px 8px",borderRadius:99,fontWeight:700,background:`${C.teal}15`,color:C.teal,border:`1px solid ${C.teal}30`}}>● LIVE</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ExportStep({ active }) {
  const [done,setDone]=useState([false,false,false,false]);
  useEffect(()=>{
    if(!active){setDone([false,false,false,false]);return;}
    CLIPS.forEach((_,i)=>setTimeout(()=>setDone(d=>{const n=[...d];n[i]=true;return n;}),i*350+200));
  },[active]);
  const plats=["TikTok","Reels","Shorts","TikTok"];
  const platCols=["#fff","#f9a8d4","#f87171","#fff"];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {CLIPS.map((clip,i)=>(
        <div key={clip.title} style={{
          display:"flex",alignItems:"center",gap:10,
          background:done[i]?`${C.teal}08`:"rgba(255,255,255,0.02)",
          border:`1px solid ${done[i]?`${C.teal}25`:"rgba(255,255,255,0.06)"}`,
          borderRadius:12,padding:"10px 14px",transition:"all 0.5s",
        }}>
          <div style={{width:32,height:32,borderRadius:9,flexShrink:0,background:done[i]?`${C.teal}15`:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s"}}>
            {done[i]?<CheckCircle2 size={15} color={C.teal}/>:<Download size={14} color="rgba(255,255,255,0.25)"/>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{margin:"0 0 2px",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.85)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{clip.title}</p>
            <p style={{margin:0,fontSize:10,fontWeight:600,color:platCols[i]}}>{plats[i]} · 1080p · MP4</p>
          </div>
          <span style={{fontSize:11,fontWeight:700,color:done[i]?C.teal:"rgba(255,255,255,0.15)",transition:"all 0.3s",flexShrink:0}}>
            {done[i]?"Ready ✓":"···"}
          </span>
        </div>
      ))}
      {active&&done[3]&&(
        <div style={{background:`${C.teal}08`,border:`1px solid ${C.teal}20`,borderRadius:12,padding:"10px 14px",textAlign:"center",marginTop:4}}>
          <p style={{margin:"0 0 2px",fontSize:13,fontWeight:700,color:C.teal}}>🎉 All 4 clips exported!</p>
          <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,0.35)"}}>Ready to post · 1080p · Optimised per platform</p>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Demo() {
  const [activeStep,setActiveStep]=useState(0);
  const [autoPlay,setAutoPlay]=useState(true);
  const timerRef=useRef(null);
  const isMobile=useIsMobile();

  const startTimer=()=>{
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>setActiveStep(s=>(s+1)%STEPS.length),4500);
  };
  useEffect(()=>{if(autoPlay)startTimer();else clearInterval(timerRef.current);return()=>clearInterval(timerRef.current);},[autoPlay]);
  const goTo=(i)=>{setActiveStep(i);if(autoPlay)startTimer();};

  const stepPanels=[
    <UploadStep    active={activeStep===0}/>,
    <TranscribeStep active={activeStep===1}/>,
    <DetectStep    active={activeStep===2}/>,
    <CaptionsStep  active={activeStep===3}/>,
    <VoiceoverStep active={activeStep===4}/>,
    <ExportStep    active={activeStep===5}/>,
  ];

  const ActiveIcon=STEPS[activeStep].icon;
  const stepColor=STEPS[activeStep].color;

  return (
    <div style={{
      minHeight:"100vh",width:"100%",background:"#050508",
      color:"#fff",fontFamily:"'Syne',system-ui,sans-serif",
      position:"relative",overflowX:"hidden",
    }}>

      {/* ── Background ── */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stripes" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <rect width="56" height="56" fill="transparent"/>
              <rect x="0" y="0" width="1" height="56" fill="rgba(139,92,246,0.07)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stripes)"/>
        </svg>
        <div style={{position:"absolute",top:"-15%",left:"-5%",width:"55vw",height:"55vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:"-15%",right:"-5%",width:"45vw",height:"45vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,210,168,0.1) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 35%,rgba(5,5,8,0.65) 100%)"}}/>
      </div>

      {/* ── Nav ── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        background:"rgba(5,5,8,0.8)",backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:`0 ${isMobile?"16px":"32px"}`,height:52,
      }}>
        <Link to="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
          <div style={{width:26,height:26,borderRadius:8,background:C.accent,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#fff",fontWeight:900,fontSize:10}}>V</span>
          </div>
          <span style={{color:"#fff",fontWeight:900,fontSize:15,letterSpacing:"-0.02em"}}>
            VIR<span style={{color:C.teal}}>A</span>
          </span>
        </Link>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Link to="/" style={{color:"rgba(255,255,255,0.4)",fontSize:12,textDecoration:"none"}}>← Back</Link>
          <Link to="/auth" style={{
            background:C.accent,color:"#fff",fontSize:12,fontWeight:700,
            padding:"7px 16px",borderRadius:9,textDecoration:"none",
            boxShadow:`0 0 18px ${C.accent}50`,whiteSpace:"nowrap",
          }}>Try VIRA Free</Link>
        </div>
      </nav>

      {/* ── Content ── */}
      <div style={{position:"relative",zIndex:1,width:"100%",padding:`${isMobile?"72px 16px 40px":"80px 24px 48px"}`,boxSizing:"border-box"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:isMobile?32:40,maxWidth:640,marginInline:"auto"}}>
          <div style={{
            display:"inline-flex",alignItems:"center",gap:6,
            background:`${C.accent}18`,border:`1px solid ${C.accent}35`,
            borderRadius:99,padding:"5px 14px",marginBottom:16,
          }}>
            <Play size={9} color="#a78bfa" fill="#a78bfa"/>
            <span style={{fontSize:10,fontWeight:700,color:"#a78bfa",letterSpacing:"0.06em",textTransform:"uppercase"}}>Interactive Demo</span>
          </div>
          <h1 style={{
            margin:"0 0 12px",
            fontSize:isMobile?"clamp(28px,8vw,40px)":"clamp(36px,5vw,64px)",
            fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.05,
            background:"linear-gradient(135deg,#fff 30%,rgba(255,255,255,0.5))",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          }}>
            See VIRA in{" "}
            <span style={{background:`linear-gradient(90deg,${C.accentLight},${C.teal})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>action.</span>
          </h1>
          <p style={{margin:0,fontSize:isMobile?13:15,color:"rgba(255,255,255,0.38)",lineHeight:1.6}}>
            Watch how VIRA turns a 47-minute video into 4 viral clips — automatically.
          </p>
        </div>

        {/* Stats — 2×2 on mobile, 4×1 on desktop */}
        <div style={{
          display:"grid",
          gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",
          gap:isMobile?8:10,
          marginBottom:isMobile?20:28,
        }}>
          {[
            {label:"Video Length",  val:47, suffix:" min"},
            {label:"Processing",    val:3,  suffix:" min"},
            {label:"Clips Made",    val:4,  suffix:" clips"},
            {label:"Viral Score",   val:90, suffix:"%"},
          ].map(({label,val,suffix})=>(
            <div key={label} style={{...card({padding:isMobile?"14px 10px":"18px 14px",borderRadius:14,textAlign:"center"})}}>
              <p style={{margin:"0 0 4px",fontSize:isMobile?22:26,fontWeight:900,color:"#fff",letterSpacing:"-0.03em"}}>
                {activeStep>=2?<Counter to={val} suffix={suffix}/>:`0${suffix}`}
              </p>
              <p style={{margin:0,fontSize:9,color:"rgba(255,255,255,0.28)",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700}}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Demo area ── */}
        {isMobile ? (
          // MOBILE: step tabs on top, panel below
          <div style={{display:"flex",flexDirection:"column",gap:12}}>

            {/* Scrollable step tabs */}
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
              {STEPS.map((step,i)=>{
                const Icon=step.icon;
                const isActive=activeStep===i;
                const isDone=activeStep>i;
                return (
                  <button key={step.id} onClick={()=>goTo(i)} style={{
                    display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                    padding:"8px 10px",borderRadius:12,border:"none",cursor:"pointer",flexShrink:0,
                    background:isActive?`${C.accent}20`:isDone?`${C.teal}08`:"rgba(255,255,255,0.03)",
                    borderWidth:1,borderStyle:"solid",
                    borderColor:isActive?`${C.accent}50`:isDone?`${C.teal}20`:"rgba(255,255,255,0.06)",
                    opacity:(!isActive&&!isDone)?0.45:1,transition:"all 0.2s",
                    minWidth:60,
                  }}>
                    <div style={{width:28,height:28,borderRadius:9,background:isActive?`${C.accent}25`:isDone?`${C.teal}18`:"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {isDone?<CheckCircle2 size={13} color={C.teal}/>:<Icon size={13} color={isActive?"#a78bfa":"rgba(255,255,255,0.3)"}/>}
                    </div>
                    <span style={{fontSize:9,fontWeight:700,color:isActive?"#fff":isDone?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.3)",whiteSpace:"nowrap"}}>{step.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Panel */}
            <div style={{background:"rgba(10,10,18,0.9)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,overflow:"hidden",backdropFilter:"blur(16px)"}}>
              {/* Panel header */}
              <div style={{
                padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",
                display:"flex",alignItems:"center",justifyContent:"space-between",
                background:`linear-gradient(90deg,${stepColor}10,transparent)`,
              }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:10,background:`${stepColor}20`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <ActiveIcon size={14} color={stepColor}/>
                  </div>
                  <div>
                    <p style={{margin:"0 0 1px",fontSize:13,fontWeight:800,color:"#fff"}}>{STEPS[activeStep].label}</p>
                    <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,0.3)"}}>{STEPS[activeStep].sub}</p>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>{activeStep+1}/{STEPS.length}</span>
                  <button onClick={()=>goTo((activeStep+1)%STEPS.length)} style={{width:28,height:28,borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.05)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <SkipForward size={12} color="rgba(255,255,255,0.5)"/>
                  </button>
                </div>
              </div>
              <div style={{padding:16}}>{stepPanels[activeStep]}</div>
              {/* Progress bar */}
              <div style={{padding:"0 16px 16px",display:"flex",gap:4}}>
                {STEPS.map((_,i)=>(
                  <button key={i} onClick={()=>goTo(i)} style={{
                    flex:1,height:3,borderRadius:99,border:"none",cursor:"pointer",
                    background:i===activeStep?stepColor:i<activeStep?`${C.teal}50`:"rgba(255,255,255,0.1)",
                    boxShadow:i===activeStep?`0 0 6px ${stepColor}80`:"none",transition:"all 0.3s",
                  }}/>
                ))}
              </div>
            </div>

            {/* Mobile autoplay controls */}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setAutoPlay(a=>!a)} style={{
                flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                padding:"10px 14px",borderRadius:11,border:"none",cursor:"pointer",
                background:autoPlay?`${C.accent}15`:"rgba(255,255,255,0.03)",
                borderWidth:1,borderStyle:"solid",
                borderColor:autoPlay?`${C.accent}35`:"rgba(255,255,255,0.07)",
                color:autoPlay?"#a78bfa":"rgba(255,255,255,0.35)",
                fontSize:12,fontWeight:600,fontFamily:"inherit",
              }}>
                <div style={{width:6,height:6,borderRadius:"50%",background:autoPlay?C.teal:"rgba(255,255,255,0.2)",boxShadow:autoPlay?`0 0 8px ${C.teal}`:"none"}}/>
                {autoPlay?"Auto-playing":"Paused"}
              </button>
              <button onClick={()=>{setActiveStep(0);if(autoPlay)startTimer();}} style={{
                padding:"10px 16px",borderRadius:11,border:"1px solid rgba(255,255,255,0.07)",cursor:"pointer",
                background:"rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.35)",
                fontSize:12,fontWeight:600,fontFamily:"inherit",
              }}>↺ Restart</button>
            </div>
          </div>

        ) : (
          // DESKTOP: sidebar + panel side by side
          <div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:14}}>

            {/* Sidebar */}
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {STEPS.map((step,i)=>{
                const Icon=step.icon;
                const isActive=activeStep===i;
                const isDone=activeStep>i;
                return (
                  <button key={step.id} onClick={()=>goTo(i)} style={{
                    width:"100%",display:"flex",alignItems:"center",gap:10,
                    padding:"11px 12px",borderRadius:14,border:"none",cursor:"pointer",textAlign:"left",
                    background:isActive?`${C.accent}18`:isDone?`${C.teal}08`:"rgba(255,255,255,0.02)",
                    borderWidth:1,borderStyle:"solid",
                    borderColor:isActive?`${C.accent}45`:isDone?`${C.teal}20`:"rgba(255,255,255,0.05)",
                    opacity:(!isActive&&!isDone)?0.4:1,transition:"all 0.2s",
                  }}>
                    <div style={{width:34,height:34,borderRadius:11,flexShrink:0,background:isActive?`${C.accent}25`:isDone?`${C.teal}18`:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
                      {isDone?<CheckCircle2 size={14} color={C.teal}/>:<Icon size={14} color={isActive?"#a78bfa":"rgba(255,255,255,0.3)"}/>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{margin:"0 0 1px",fontSize:13,fontWeight:700,color:isActive?"#fff":isDone?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.32)"}}>{step.label}</p>
                      <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,0.2)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{step.sub}</p>
                    </div>
                    {isDone&&<span style={{fontSize:9,color:`${C.teal}80`,fontWeight:700,flexShrink:0}}>✓</span>}
                  </button>
                );
              })}

              {/* Autoplay controls */}
              <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:5}}>
                <button onClick={()=>setAutoPlay(a=>!a)} style={{
                  display:"flex",alignItems:"center",gap:8,padding:"9px 12px",
                  borderRadius:11,border:"none",cursor:"pointer",
                  background:autoPlay?`${C.accent}15`:"rgba(255,255,255,0.03)",
                  borderWidth:1,borderStyle:"solid",
                  borderColor:autoPlay?`${C.accent}35`:"rgba(255,255,255,0.07)",
                  color:autoPlay?"#a78bfa":"rgba(255,255,255,0.35)",
                  fontSize:12,fontWeight:600,fontFamily:"inherit",
                }}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:autoPlay?C.teal:"rgba(255,255,255,0.2)",boxShadow:autoPlay?`0 0 8px ${C.teal}`:"none"}}/>
                  {autoPlay?"Auto-playing":"Paused"}
                </button>
                <button onClick={()=>{setActiveStep(0);if(autoPlay)startTimer();}} style={{
                  padding:"9px 12px",borderRadius:11,border:"1px solid rgba(255,255,255,0.07)",cursor:"pointer",
                  background:"rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.35)",
                  fontSize:12,fontWeight:600,fontFamily:"inherit",
                }}>↺ Restart</button>
              </div>
            </div>

            {/* Panel */}
            <div style={{background:"rgba(10,10,18,0.88)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:24,overflow:"hidden",backdropFilter:"blur(16px)",boxShadow:`0 40px 100px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06)`}}>
              <div style={{
                padding:"14px 22px",borderBottom:"1px solid rgba(255,255,255,0.06)",
                display:"flex",alignItems:"center",justifyContent:"space-between",
                background:`linear-gradient(90deg,${stepColor}10,transparent)`,
              }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:11,background:`${stepColor}20`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <ActiveIcon size={15} color={stepColor}/>
                  </div>
                  <div>
                    <p style={{margin:"0 0 2px",fontSize:14,fontWeight:800,color:"#fff"}}>{STEPS[activeStep].label}</p>
                    <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.3)"}}>{STEPS[activeStep].sub}</p>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>{activeStep+1} / {STEPS.length}</span>
                  <button onClick={()=>goTo((activeStep+1)%STEPS.length)} style={{width:30,height:30,borderRadius:9,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.05)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <SkipForward size={12} color="rgba(255,255,255,0.5)"/>
                  </button>
                </div>
              </div>
              <div style={{padding:"22px 22px",minHeight:340,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                {stepPanels[activeStep]}
              </div>
              <div style={{padding:"0 22px 20px",display:"flex",gap:5}}>
                {STEPS.map((_,i)=>(
                  <button key={i} onClick={()=>goTo(i)} style={{
                    flex:1,height:3,borderRadius:99,border:"none",cursor:"pointer",
                    background:i===activeStep?stepColor:i<activeStep?`${C.teal}50`:"rgba(255,255,255,0.1)",
                    boxShadow:i===activeStep?`0 0 8px ${stepColor}80`:"none",transition:"all 0.3s",
                  }}/>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop:isMobile?28:36,borderRadius:24,
          padding:isMobile?"32px 20px":"52px 48px",
          textAlign:"center",position:"relative",overflow:"hidden",
          background:"linear-gradient(135deg,rgba(124,58,237,0.15) 0%,rgba(0,210,168,0.07) 100%)",
          border:"1px solid rgba(124,58,237,0.25)",
        }}>
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.5}} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stripes2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                <rect width="40" height="40" fill="transparent"/>
                <rect x="0" y="0" width="1" height="40" fill="rgba(139,92,246,0.1)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stripes2)"/>
          </svg>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"60%",height:"100%",background:"radial-gradient(ellipse,rgba(124,58,237,0.2) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:99,padding:"4px 12px",marginBottom:16}}>
              <Zap size={10} color={C.yellow}/>
              <span style={{fontSize:10,fontWeight:700,color:"#fcd34d"}}>Free to start — no credit card</span>
            </div>
            <h2 style={{
              margin:"0 0 10px",
              fontSize:isMobile?"clamp(22px,6vw,32px)":"clamp(28px,4vw,44px)",
              fontWeight:900,letterSpacing:"-0.03em",
              background:"linear-gradient(135deg,#fff,rgba(255,255,255,0.7))",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            }}>Ready to try it yourself?</h2>
            <p style={{margin:"0 0 28px",fontSize:isMobile?13:15,color:"rgba(255,255,255,0.38)",lineHeight:1.6,maxWidth:380,marginInline:"auto"}}>
              Join 180,000+ creators using VIRA to turn long videos into viral clips automatically.
            </p>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <Link to="/auth" style={{
                display:"inline-flex",alignItems:"center",gap:8,
                background:`linear-gradient(135deg,${C.accent},${C.accentLight})`,
                color:"#fff",fontSize:14,fontWeight:800,
                padding:isMobile?"12px 24px":"14px 32px",
                borderRadius:13,textDecoration:"none",
                boxShadow:`0 8px 28px ${C.accent}50`,
              }}>
                Start for free <ArrowRight size={15}/>
              </Link>
              <Link to="/" style={{
                display:"inline-flex",alignItems:"center",gap:6,
                background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",
                color:"rgba(255,255,255,0.65)",fontSize:13,fontWeight:700,
                padding:isMobile?"12px 20px":"14px 24px",
                borderRadius:13,textDecoration:"none",
              }}>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{display:none;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
      `}</style>
    </div>
  );
}