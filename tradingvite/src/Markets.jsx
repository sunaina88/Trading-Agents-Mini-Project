import { useState, useEffect, useRef, useCallback } from "react";
import "./Markets.css";

const COUNTRIES = [
  { code:"IN", label:"India",  flag:"🇮🇳", exchange:"NSE",    currency:"₹"   },
  { code:"US", label:"USA",    flag:"🇺🇸", exchange:"NASDAQ", currency:"$"   },
  { code:"CN", label:"China",  flag:"🇨🇳", exchange:"HKEX",   currency:"HK$" },
];

const COMPANY_TICKERS = {
  IN:["RELIANCE.NS","TCS.NS","HDFCBANK.NS","INFY.NS","ICICIBANK.NS","BAJFINANCE.NS","WIPRO.NS","SBIN.NS","TATAMOTORS.NS","AXISBANK.NS"],
  US:["AAPL","MSFT","GOOGL","AMZN","NVDA","META","TSLA","JPM","WMT","BAC"],
  CN:["0700.HK","9988.HK","3690.HK","9618.HK","0941.HK"],
};

const TV_SYMBOL = {
  "RELIANCE.NS":"NSE:RELIANCE","TCS.NS":"NSE:TCS","HDFCBANK.NS":"NSE:HDFCBANK",
  "INFY.NS":"NSE:INFY","ICICIBANK.NS":"NSE:ICICIBANK","BAJFINANCE.NS":"NSE:BAJFINANCE",
  "WIPRO.NS":"NSE:WIPRO","SBIN.NS":"NSE:SBIN","TATAMOTORS.NS":"NSE:TATAMOTORS","AXISBANK.NS":"NSE:AXISBANK",
  "AAPL":"NASDAQ:AAPL","MSFT":"NASDAQ:MSFT","GOOGL":"NASDAQ:GOOGL","AMZN":"NASDAQ:AMZN",
  "NVDA":"NASDAQ:NVDA","META":"NASDAQ:META","TSLA":"NYSE:TSLA","JPM":"NYSE:JPM",
  "WMT":"NYSE:WMT","BAC":"NYSE:BAC",
  "0700.HK":"HKEX:700","9988.HK":"HKEX:9988","3690.HK":"HKEX:3690","9618.HK":"HKEX:9618","0941.HK":"HKEX:941",
};

const MOCK = {
  IN:[
    {ticker:"RELIANCE.NS",name:"Reliance Industries",price:"2,947",change:"+1.24",pct:"+1.24%"},
    {ticker:"TCS.NS",name:"Tata Consultancy",price:"3,812",change:"-0.43",pct:"-0.43%"},
    {ticker:"HDFCBANK.NS",name:"HDFC Bank",price:"1,724",change:"+0.87",pct:"+0.87%"},
    {ticker:"INFY.NS",name:"Infosys",price:"1,489",change:"-0.61",pct:"-0.61%"},
    {ticker:"ICICIBANK.NS",name:"ICICI Bank",price:"1,246",change:"+1.12",pct:"+1.12%"},
    {ticker:"BAJFINANCE.NS",name:"Bajaj Finance",price:"933",change:"-3.74",pct:"-3.74%"},
    {ticker:"WIPRO.NS",name:"Wipro",price:"490",change:"+0.32",pct:"+0.32%"},
    {ticker:"SBIN.NS",name:"SBI",price:"812",change:"+0.95",pct:"+0.95%"},
    {ticker:"TATAMOTORS.NS",name:"Tata Motors",price:"949",change:"+2.31",pct:"+2.31%"},
    {ticker:"AXISBANK.NS",name:"Axis Bank",price:"1,190",change:"-0.18",pct:"-0.18%"},
  ],
  US:[
    {ticker:"AAPL",name:"Apple Inc",price:"213.49",change:"+0.74",pct:"+0.74%"},
    {ticker:"MSFT",name:"Microsoft",price:"415.22",change:"+0.51",pct:"+0.51%"},
    {ticker:"GOOGL",name:"Alphabet",price:"178.35",change:"-0.29",pct:"-0.29%"},
    {ticker:"AMZN",name:"Amazon",price:"203.47",change:"+1.02",pct:"+1.02%"},
    {ticker:"NVDA",name:"NVIDIA",price:"875.39",change:"+2.18",pct:"+2.18%"},
    {ticker:"META",name:"Meta Platforms",price:"562.74",change:"+1.87",pct:"+1.87%"},
    {ticker:"TSLA",name:"Tesla",price:"177.84",change:"-1.43",pct:"-1.43%"},
    {ticker:"JPM",name:"JPMorgan Chase",price:"234.11",change:"+0.38",pct:"+0.38%"},
    {ticker:"WMT",name:"Walmart",price:"92.18",change:"+0.65",pct:"+0.65%"},
    {ticker:"BAC",name:"Bank of America",price:"43.72",change:"+0.22",pct:"+0.22%"},
  ],
  CN:[
    {ticker:"0700.HK",name:"Tencent",price:"371.20",change:"+1.53",pct:"+1.53%"},
    {ticker:"9988.HK",name:"Alibaba",price:"82.45",change:"-0.82",pct:"-0.82%"},
    {ticker:"3690.HK",name:"Meituan",price:"141.30",change:"+2.04",pct:"+2.04%"},
    {ticker:"9618.HK",name:"JD.com",price:"124.60",change:"-1.10",pct:"-1.10%"},
    {ticker:"0941.HK",name:"China Mobile",price:"75.35",change:"+0.45",pct:"+0.45%"},
  ],
};

const AGENT_META = {
  fundamentals:{label:"Fundamentals",icon:"📊",color:"#00bcd4"},
  sentiment:   {label:"Sentiment",   icon:"💬",color:"#ab47bc"},
  news:        {label:"News",        icon:"📰",color:"#42a5f5"},
  technical:   {label:"Technical",   icon:"📈",color:"#26a69a"},
  bullish:     {label:"Bull Case",   icon:"🐂",color:"#66bb6a"},
  bearish:     {label:"Bear Case",   icon:"🐻",color:"#ef5350"},
  risk:        {label:"Risk Mgmt",   icon:"🛡️",color:"#ffa726"},
};

// ── Claude AI Analysis via Anthropic API ─────────────────────────────────────
async function fetchClaudeAnalysis(ticker, name, price, change, country) {
  const prompt = `You are a professional multi-agent stock market analyst system. Analyze the stock "${name}" (ticker: ${ticker}, market: ${country}) with current price ${price} and today's change: ${change}%.

Respond ONLY with a valid JSON object — no markdown, no backticks, no explanation outside the JSON. Use exactly this structure:

{
  "signal": "BUY",
  "confidence": 72.4,
  "decision": "Two to three sentence portfolio manager summary and action recommendation.",
  "agents": {
    "fundamentals": { "signal": "BUY", "score": 74.2, "summary": "Two to three sentence fundamental analysis." },
    "sentiment":    { "signal": "HOLD","score": 61.0, "summary": "Two to three sentence sentiment analysis." },
    "news":         { "signal": "BUY", "score": 68.5, "summary": "Two to three sentence news-based analysis." },
    "technical":    { "signal": "SELL","score": 55.1, "summary": "Two to three sentence technical analysis with indicators." },
    "bullish":      { "score": 78.0, "summary": "Two to three sentence bull case." },
    "bearish":      { "score": 42.0, "summary": "Two to three sentence bear case." },
    "risk":         { "level": "MEDIUM", "summary": "Two to three sentence risk management note." }
  }
}

Rules:
- signal must be "BUY", "SELL", or "HOLD"
- confidence is a float between 55.0 and 94.0
- agent scores are floats between 30.0 and 95.0
- risk level must be "LOW", "MEDIUM", or "HIGH"
- base analysis on your real knowledge of ${name} — be specific and realistic
- let the ${change}% daily change influence technical and sentiment signals`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`API ${response.status}`);
  const data = await response.json();
  const raw = data.content.map(b => b.text || "").join("");
  const clean = raw.replace(/```json|```/gi, "").trim();
  return JSON.parse(clean);
}

// ── TradingView Widget ────────────────────────────────────────────────────────
function TVChart({ symbol }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbol, interval:"D", timezone:"Etc/UTC", theme:"dark",
      style:"1", locale:"en", backgroundColor:"#0d1117",
      gridColor:"rgba(255,255,255,0.04)", hide_top_toolbar:false,
      hide_legend:false, allow_symbol_change:false, save_image:false,
      calendar:false, width:"100%", height:"100%",
    });
    ref.current.appendChild(s);
  }, [symbol]);
  return <div ref={ref} style={{width:"100%",height:"100%"}} />;
}

// ── Sentiment Bar ─────────────────────────────────────────────────────────────
function SentimentBar({ score }) {
  const pct = Math.max(0, Math.min(100, score));
  const zones = [
    {label:"Strong Sell",color:"#c62828"},
    {label:"Sell",       color:"#ef5350"},
    {label:"Neutral",    color:"#ffa726"},
    {label:"Buy",        color:"#66bb6a"},
    {label:"Strong Buy", color:"#2e7d32"},
  ];
  const zoneIdx = Math.min(4, Math.floor(pct / 20));
  const current = zones[zoneIdx];
  const bars = Array.from({length:30},(_,i)=>{
    const v = 40 + Math.sin(i*0.5)*15 + (score-50)*0.3 + (i%3)*3;
    return Math.max(15,Math.min(95,v));
  });

  return (
    <div className="sb-wrap">
      <div className="sb-header">
        <span className="sb-title">Market Sentiment</span>
        <span className="sb-current" style={{color:current.color}}>{current.label}</span>
      </div>
      <div className="sb-track">
        {zones.map(z=>(
          <div key={z.label} className="sb-zone" style={{background:z.color}}/>
        ))}
        <div className="sb-needle" style={{left:`${pct}%`}}>
          <div className="sb-nl" style={{background:current.color}}/>
          <div className="sb-nd" style={{background:current.color}}/>
          <span className="sb-nv" style={{color:current.color}}>{Math.round(pct)}</span>
        </div>
      </div>
      <div className="sb-zone-labels">
        {zones.map(z=>(<span key={z.label} style={{color:z.color}}>{z.label}</span>))}
      </div>
      <div className="sb-timeline">
        <span className="sb-tl-label">30-day trend</span>
        <div className="sb-tl-bars">
          {bars.map((h,i)=>{
            const c = h>55?"#66bb6a":h<45?"#ef5350":"#ffa726";
            return <div key={i} className="sb-tl-bar" style={{height:`${h}%`,background:c}}/>;
          })}
        </div>
      </div>
    </div>
  );
}

// ── Signal Badge ──────────────────────────────────────────────────────────────
function SignalBadge({signal}){
  const c={BUY:"#00e676",SELL:"#ff5252",HOLD:"#ffd740"};
  return <span className="sig-badge" style={{color:c[signal]||"#aaa",borderColor:c[signal]||"#aaa"}}>{signal}</span>;
}

// ── AI Loading Steps Panel ────────────────────────────────────────────────────
const AI_STEPS = [
  {icon:"📊", label:"Scanning fundamentals…"},
  {icon:"💬", label:"Reading market sentiment…"},
  {icon:"📰", label:"Parsing recent news…"},
  {icon:"📈", label:"Running technical analysis…"},
  {icon:"🐂", label:"Building bull case…"},
  {icon:"🐻", label:"Building bear case…"},
  {icon:"🛡️", label:"Assessing risk profile…"},
  {icon:"🤖", label:"Portfolio manager deciding…"},
];

function AILoadingPanel({ ticker }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s < AI_STEPS.length - 1 ? s+1 : s)), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ai-loading-panel">
      <div className="ai-loading-ticker">{ticker}</div>
      <div className="ai-loading-title">Running Multi-Agent AI Analysis</div>
      <div className="ai-loading-steps">
        {AI_STEPS.map((s, i) => (
          <div key={i} className={`ai-step ${i < step ? "done" : i === step ? "active" : "pending"}`}>
            <span className="ai-step-icon">{s.icon}</span>
            <span className="ai-step-label">{s.label}</span>
            <span className="ai-step-status">
              {i < step ? "✓" : i === step ? <span className="ai-dot-spin"/> : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Markets() {
  const [country,   setCountry]   = useState("IN");
  const [companies, setCompanies] = useState(MOCK["IN"]);
  const [listLoad,  setListLoad]  = useState(false);
  const [selected,  setSelected]  = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [analysis,  setAnalysis]  = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError,   setAiError]   = useState(null);
  const [expanded,  setExpanded]  = useState(null);

  const loadCompanies = useCallback(async(code) => {
    setListLoad(true);
    try {
      const tickers = COMPANY_TICKERS[code].join(",");
      const res = await fetch(`/api/companies?tickers=${tickers}`);
      if (!res.ok) throw new Error();
      setCompanies(await res.json());
    } catch {
      setCompanies(MOCK[code]);
    } finally {
      setListLoad(false);
    }
  }, []);

  useEffect(() => { loadCompanies(country); }, [country, loadCompanies]);

  const handleSelect = async (co) => {
    setSelected(co); setAnalysis(null); setExpanded(null); setAiError(null);
    setPreview({loading: true});
    await new Promise(r => setTimeout(r, 400));
    const chg = parseFloat(co.change);
    const score = Math.min(95, Math.max(5, 50 + chg * 5 + (Math.random()-0.5) * 8));
    const signal = score > 62 ? "BUY" : score < 38 ? "SELL" : "HOLD";
    setPreview({score, signal, loading: false});
  };

  const runAnalysis = async () => {
    if (!selected) return;
    setAiLoading(true); setAnalysis(null); setAiError(null);
    const ci = COUNTRIES.find(c => c.code === country);
    try {
      const result = await fetchClaudeAnalysis(
        selected.ticker, selected.name,
        `${ci?.currency}${selected.price}`,
        selected.change, ci?.label
      );
      setAnalysis(result);
    } catch (err) {
      setAiError("Analysis unavailable. Check your connection and try again.");
      console.error("Claude API error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const ci = COUNTRIES.find(c => c.code === country);
  const tvSym = selected ? (TV_SYMBOL[selected.ticker] || selected.ticker) : null;
  const shortTicker = selected?.ticker.replace(/\.(NS|HK)$/, "");

  return (
    <div className="mkt-root">

      {/* ── Sidebar ── */}
      <aside className="mkt-sidebar">
        <div className="mkt-sb-top">
          <span className="mkt-sb-heading">Markets</span>
          <div className="mkt-ctabs">
            {COUNTRIES.map(c => (
              <button key={c.code}
                className={`mkt-ctab ${country === c.code ? "active" : ""}`}
                onClick={() => {
                  setCountry(c.code); setSelected(null);
                  setPreview(null); setAnalysis(null); setAiError(null);
                }}>
                <span>{c.flag}</span><span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mkt-list">
          <div className="mkt-list-lbl">{ci?.flag} {ci?.exchange} Stocks</div>
          {listLoad
            ? Array.from({length:8}).map((_,i) => (
                <div key={i} className="mkt-skel" style={{animationDelay:`${i*0.06}s`}}/>
              ))
            : companies.map(co => {
                const pos = !co.change.startsWith("-");
                return (
                  <button key={co.ticker}
                    className={`mkt-co ${selected?.ticker === co.ticker ? "active" : ""}`}
                    onClick={() => handleSelect(co)}>
                    <div className="mkt-co-l">
                      <span className="mkt-co-tk">{co.ticker.replace(/\.(NS|HK)$/, "")}</span>
                      <span className="mkt-co-nm">{co.name}</span>
                    </div>
                    <div className="mkt-co-r">
                      <span className="mkt-co-px">{ci?.currency}{co.price}</span>
                      <span className={`mkt-co-ch ${pos ? "pos" : "neg"}`}>{co.pct}</span>
                    </div>
                  </button>
                );
              })
          }
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="mkt-main">
        {!selected ? (
          <div className="mkt-empty">
            <div className="mkt-empty-ico">📊</div>
            <h2>Select a company to begin</h2>
            <p>Pick any stock from the sidebar to view live charts and Claude-powered AI analysis.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mkt-chdr">
              <div>
                <span className="mkt-ctk">{shortTicker}</span>
                <span className="mkt-cnm">{selected.name}</span>
              </div>
              <div className="mkt-cpx-wrap">
                <span className="mkt-cpx">{ci?.currency}{selected.price}</span>
                <span className={`mkt-cch ${!selected.change.startsWith("-") ? "pos" : "neg"}`}>
                  {selected.pct}
                </span>
              </div>
            </div>

            {/* TradingView chart */}
            <div className="mkt-chart">
              {tvSym && <TVChart symbol={tvSym}/>}
            </div>

            {/* Sentiment bar */}
            <div className="mkt-sent-wrap">
              {preview?.loading
                ? <div className="mkt-sent-loading"><span className="mkt-spinner"/>Calculating sentiment…</div>
                : preview && <SentimentBar score={preview.score}/>
              }
            </div>

            {/* Action strip — hidden while AI is running */}
            {preview && !preview.loading && !aiLoading && (
              <div className="mkt-action">
                <div className="mkt-qs">
                  <span className="mkt-qs-lbl">Quick Signal</span>
                  <SignalBadge signal={preview.signal}/>
                  <span className="mkt-qs-conf">{Math.round(preview.score)}% confidence</span>
                </div>
                <button className="mkt-run" onClick={runAnalysis}>
                  🤖 Run AI Analysis
                </button>
              </div>
            )}

            {/* AI loading steps */}
            {aiLoading && <AILoadingPanel ticker={shortTicker}/>}

            {/* Error state */}
            {aiError && !aiLoading && (
              <div className="mkt-error">
                <span>⚠️ {aiError}</span>
                <button className="mkt-retry" onClick={runAnalysis}>Retry</button>
              </div>
            )}

            {/* Analysis results */}
            {analysis && !aiLoading && (
              <div className="mkt-panel mkt-panel-anim">

                {/* Decision banner */}
                <div className={`mkt-dec sig-${analysis.signal}`}>
                  <div className="mkt-dec-l">
                    <span className="mkt-dec-lbl">Portfolio Manager Decision</span>
                    <div className="mkt-dec-row">
                      <SignalBadge signal={analysis.signal}/>
                      <span className="mkt-dec-conf">{analysis.confidence}% confidence</span>
                    </div>
                    <p className="mkt-dec-txt">{analysis.decision}</p>
                  </div>
                  <div className={`mkt-dec-big sig-${analysis.signal}`}>
                    {analysis.signal === "BUY" ? "↑" : analysis.signal === "SELL" ? "↓" : "◆"}
                  </div>
                </div>

                {/* Agent breakdown */}
                <div className="mkt-agents-ttl">Agent Breakdown</div>
                <div className="mkt-agents">
                  {Object.entries(analysis.agents).map(([key, agent], idx) => {
                    const m = AGENT_META[key];
                    if (!m) return null;
                    const open = expanded === key;
                    return (
                      <div key={key}
                        className={`mkt-ac ${open ? "open" : ""}`}
                        style={{"--ac": m.color, animationDelay: `${idx * 0.07}s`}}
                        onClick={() => setExpanded(open ? null : key)}>
                        <div className="mkt-ac-top">
                          <span className="mkt-ac-ico">{m.icon}</span>
                          <div className="mkt-ac-info">
                            <span className="mkt-ac-lbl">{m.label}</span>
                            {agent.signal && <SignalBadge signal={agent.signal}/>}
                            {agent.level && (
                              <span className="mkt-rl" data-lv={agent.level}>{agent.level} RISK</span>
                            )}
                          </div>
                          {agent.score && (
                            <span className="mkt-ac-sc">{agent.score}</span>
                          )}
                        </div>
                        <p className="mkt-ac-sum">
                          {open ? agent.summary : agent.summary.slice(0, 90) + "…"}
                        </p>
                        <span className="mkt-ac-tog">{open ? "▲ collapse" : "▼ expand"}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Re-run */}
                <button className="mkt-rerun" onClick={runAnalysis}>
                  🔄 Re-run Analysis
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}