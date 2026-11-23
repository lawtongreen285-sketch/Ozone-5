import React, { useState } from "react";
import {
  Activity, ArrowUpRight, Atom, BookOpen, BrainCircuit, Check, ChevronDown,
  ChevronRight, CircleHelp, Code2, Compass, FileText, Globe2, History,
  LayoutDashboard, Menu, Mic, Paperclip, Search, Send, Settings, ShieldCheck,
  Sparkles, TrendingUp, X, Zap
} from "lucide-react";

const modes = [
  { name: "Research", detail: "Deep insights", icon: Search, prompt: "Research this topic using reliable sources" },
  { name: "Learn", detail: "Understand anything", icon: BookOpen, prompt: "Teach me this topic step by step" },
  { name: "Code", detail: "Build & debug", icon: Code2, prompt: "Help me design and debug this code" },
  { name: "Analyse", detail: "Data & trends", icon: TrendingUp, prompt: "Analyse this information and explain the findings" },
  { name: "Create", detail: "Write & design", icon: Sparkles, prompt: "Help me create something original" },
  { name: "Explore", detail: "Discover the web", icon: Globe2, prompt: "Explore this topic across the web" }
];
const nav = [
  ["Home", LayoutDashboard], ["AI Assistant", BrainCircuit], ["Deep Research", Search],
  ["Knowledge Hub", BookOpen], ["Document Analysis", FileText], ["Multimedia Tools", Atom],
  ["History", History], ["Settings", Settings]
];

export default function App() {
  const [active, setActive] = useState("Home");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [research, setResearch] = useState(true);
  const [notice, setNotice] = useState("");
  const [history, setHistory] = useState([]);

  async function submit(text = message) {
    const question = text.trim();
    if (!question || busy) return;
    setMessage(question); setBusy(true); setAnswer(null); setNotice("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, research })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The request could not be completed.");
      setAnswer(data); setHistory(h => [{ question, answer: data.answer, time: new Date() }, ...h].slice(0, 20));
    } catch (e) {
      setNotice(e.message + " You can still explore the interface; configure the server API keys to enable live AI and web research.");
    } finally { setBusy(false); }
  }

  const pageTitle = active === "Home" ? "Your intelligence workspace" : active;
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><Atom size={27}/></div>
        <div><div className="brand-name">OZONE <span>5</span></div><div className="brand-tag">INTELLIGENCE REDEFINED</div></div>
        <button className="icon-btn close-nav" onClick={() => setMobileNav(false)}><X/></button>
      </div>
      <div className="side-caption">WORKSPACE</div>
      <nav>{nav.map(([label, Icon]) => <button key={label} className={`nav-link ${active===label?"selected":""}`} onClick={() => {setActive(label);setMobileNav(false);}}>
        <Icon size={18}/><span>{label}</span>{label==="Deep Research" && <span className="nav-new">NEW</span>}
      </button>)}</nav>
      <div className="side-bottom">
        <div className="pro-card"><div className="pro-icon"><Zap size={19}/></div><div><strong>OZONE 5 Pro</strong><p>Unlock advanced capabilities</p></div><ChevronRight size={16}/></div>
        <div className="secure-note"><ShieldCheck size={15}/> Privacy-conscious by design</div>
        <div className="profile"><div className="avatar">O5</div><div><strong>Welcome</strong><small>Personal workspace</small></div><ChevronDown size={16}/></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="icon-btn menu-btn" onClick={() => setMobileNav(true)}><Menu/></button>
        <div className="breadcrumb"><span>OZONE 5</span><ChevronRight size={14}/><b>{active}</b></div>
        <div className="top-actions"><div className="status"><i/> Systems ready</div><button className="icon-btn" title="Help"><CircleHelp size={19}/></button></div>
      </header>

      <div className="content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span/> RESEARCH · REASONING · DISCOVERY</div>
            <h1>{active==="Home" ? <>Go beyond<br/><em>the obvious.</em></> : <>{pageTitle}<br/><em>with OZONE 5.</em></>}</h1>
            <p>Ask better questions. Explore credible sources. Turn information into understanding.</p>
            <div className="hero-pills"><span><Globe2 size={14}/> Web-aware research</span><span><ShieldCheck size={14}/> Source transparency</span></div>
          </div>
          <div className="orbital-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="planet"><Atom size={64}/></div><div className="orbit-dot"/></div>
          <div className="hero-glow"/>
        </section>

        <section className="ask-panel">
          <div className="ask-heading"><div className="assistant-icon"><BrainCircuit size={25}/></div><div><h2>What would you like to explore?</h2><p>OZONE 5 helps you investigate, understand and create.</p></div></div>
          <form className="composer" onSubmit={e=>{e.preventDefault();submit();}}>
            <textarea value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit();}}} placeholder="Ask a question, explore an idea, or describe a challenge…" rows="2"/>
            <div className="composer-tools"><div className="tool-left"><span className="privacy-label"><ShieldCheck size={13}/> Your workspace</span><label className="research-toggle"><input type="checkbox" checked={research} onChange={e=>setResearch(e.target.checked)}/> Web research</label></div><div className="tool-right"><button type="button" className="attach-btn" title="Attachments coming soon"><Paperclip size={18}/></button><button className="send-btn" disabled={!message.trim()||busy}>{busy?<span className="spinner"/>:<Send size={17}/>}<span>{busy?"Working":"Ask OZONE"}</span></button></div></div>
          </form>
          {notice && <div className="notice">{notice}</div>}
        </section>

        {answer && <section className="answer-panel"><div className="answer-top"><div><span className="eyebrow">OZONE RESPONSE</span><h2>Research brief</h2></div><span className="answer-badge"><Check size={13}/> Generated</span></div><p className="answer-text">{answer.answer}</p>{answer.sources?.length>0 && <div className="sources"><h3>Sources consulted</h3>{answer.sources.map((s,i)=><a href={s.url} target="_blank" rel="noreferrer" key={s.url}><span>{i+1}</span><div><strong>{s.title}</strong><small>{s.url}</small></div><ArrowUpRight size={15}/></a>)}</div>}{answer.demo && <small className="demo-note">Demo response — add API keys to enable live research and AI answers.</small>}</section>}

        <section className="section-block"><div className="section-heading"><div><div className="eyebrow">YOUR TOOLKIT</div><h2>Choose your direction</h2></div><button className="text-link" onClick={()=>setActive("AI Assistant")}>Explore workspace <ArrowUpRight size={15}/></button></div>
          <div className="mode-grid">{modes.map(({name,detail,icon:Icon,prompt},i)=><button className="mode-card" key={name} onClick={()=>{setActive(name==="Research"?"Deep Research":"AI Assistant");setMessage(prompt+": ");document.querySelector("textarea")?.focus();}}>
            <div className={`mode-icon mode-${i}`}><Icon size={20}/></div><div className="mode-name">{name}</div><div className="mode-detail">{detail}</div><ArrowUpRight className="mode-arrow" size={15}/>
          </button>)}</div>
        </section>

        <section className="lower-grid">
          <div className="info-card"><div className="card-heading"><div><span className="eyebrow">BUILT FOR CLARITY</span><h3>Research with context</h3></div><div className="card-symbol"><Search size={19}/></div></div><p>Bring together useful information, compare perspectives and keep track of the sources behind an answer.</p><div className="feature-list"><span><Check size={14}/> Source links when web research is enabled</span><span><Check size={14}/> Clear separation of evidence and interpretation</span><span><Check size={14}/> Useful summaries, not just search results</span></div></div>
          <div className="info-card history-card"><div className="card-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h3>Your explorations</h3></div><History size={19} className="muted-icon"/></div>{history.length===0?<div className="empty-history"><div className="empty-icon"><History size={22}/></div><p>Your recent questions will appear here.</p><small>Start a conversation to build your history.</small></div>:history.slice(0,4).map((h,i)=><button className="history-item" key={i} onClick={()=>{setMessage(h.question);setAnswer({answer:h.answer,sources:[]});}}><span>{h.question}</span><ChevronRight size={15}/></button>)}</div>
        </section>
        <footer><span>© {new Date().getFullYear()} OZONE 5</span><span>Beyond answers. Towards understanding.</span><span className="footer-secure"><ShieldCheck size={13}/> Built with transparency in mind</span></footer>
      </div>
    </main>
  </div>;
}