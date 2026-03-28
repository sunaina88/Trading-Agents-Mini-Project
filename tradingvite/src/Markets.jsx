import { useState, useEffect, useRef, useCallback } from "react";
import "./Markets.css";

const COUNTRIES = [
  { code:"IN", label:"India",  flag:"🇮🇳", exchange:"BSE",    currency:"₹"   },
  { code:"US", label:"USA",    flag:"🇺🇸", exchange:"NASDAQ", currency:"$"   },
];

const COMPANY_TICKERS = {
  IN:["RELIANCE.NS","TCS.NS","HDFCBANK.NS","INFY.NS","ICICIBANK.NS","BAJFINANCE.NS","WIPRO.NS","SBIN.NS","TATAMOTORS.NS","AXISBANK.NS","HINDUNILVR.NS","ITC.NS","KOTAKBANK.NS","LT.NS","MARUTI.NS","NTPC.NS","ONGC.NS","POWERGRID.NS","SUNPHARMA.NS","TECHM.NS","ULTRACEMCO.NS","ADANIPORTS.NS","ASIANPAINT.NS","BHARTIARTL.NS","CIPLA.NS","DRREDDY.NS","GRASIM.NS","HEROMOTOCO.NS","JSWSTEEL.NS"],
  US:["AAPL","MSFT","GOOGL","AMZN","NVDA","META","TSLA","JPM","BAC","NFLX","DIS","V","MA","HD","PFE","KO","PEP","WMT","COST","MCD","NKE","ADBE","CRM","INTC","CSCO","ORCL","IBM","AMD","UBER","SPOT"],
};

const TV_SYMBOL = {
  "RELIANCE.NS": "BSE:RELIANCE",
  "TCS.NS": "BSE:TCS",
  "HDFCBANK.NS": "BSE:HDFCBANK",
  "INFY.NS": "BSE:INFY",
  "ICICIBANK.NS": "BSE:ICICIBANK",
  "BAJFINANCE.NS": "BSE:BAJFINANCE",
  "WIPRO.NS": "BSE:WIPRO",
  "SBIN.NS": "BSE:SBIN",
  "TATAMOTORS.NS": "BSE:TATAMOTORS",
  "AXISBANK.NS": "BSE:AXISBANK",
  "HINDUNILVR.NS": "BSE:HINDUNILVR",
  "ITC.NS": "BSE:ITC",
  "KOTAKBANK.NS": "BSE:KOTAKBANK",
  "LT.NS": "BSE:LT",
  "MARUTI.NS": "BSE:MARUTI",
  "NTPC.NS": "BSE:NTPC",
  "ONGC.NS": "BSE:ONGC",
  "POWERGRID.NS": "BSE:POWERGRID",
  "SUNPHARMA.NS": "BSE:SUNPHARMA",
  "TECHM.NS": "BSE:TECHM",
  "ULTRACEMCO.NS": "BSE:ULTRACEMCO",
  "ADANIPORTS.NS": "BSE:ADANIPORTS",
  "ASIANPAINT.NS": "BSE:ASIANPAINT",
  "BHARTIARTL.NS": "BSE:BHARTIARTL",
  "CIPLA.NS": "BSE:CIPLA",
  "DRREDDY.NS": "BSE:DRREDDY",
  "GRASIM.NS": "BSE:GRASIM",
  "HEROMOTOCO.NS": "BSE:HEROMOTOCO",
  "JSWSTEEL.NS": "BSE:JSWSTEEL",
  "AAPL": "AAPL", "MSFT": "MSFT", "GOOGL": "GOOGL", "AMZN": "AMZN",
  "NVDA": "NVDA", "META": "META", "TSLA": "TSLA", "JPM": "JPM",
  "BAC": "BAC", "NFLX": "NFLX", "DIS": "DIS", "V": "V",
  "MA": "MA", "HD": "HD", "PFE": "PFE", "KO": "KO",
  "PEP": "PEP", "WMT": "WMT", "COST": "COST", "MCD": "MCD",
  "NKE": "NKE", "ADBE": "ADBE", "CRM": "CRM", "INTC": "INTC",
  "CSCO": "CSCO", "ORCL": "ORCL", "IBM": "IBM", "AMD": "AMD",
  "UBER": "UBER", "SPOT": "SPOT",
};

const MOCK = {
  IN:[
    {ticker:"RELIANCE.NS",name:"Reliance Industries",price:"2,947",change:"+1.24",pct:"+1.24%"},
    {ticker:"TCS.NS",name:"Tata Consultancy Services",price:"3,812",change:"-0.43",pct:"-0.43%"},
    {ticker:"HDFCBANK.NS",name:"HDFC Bank",price:"1,724",change:"+0.87",pct:"+0.87%"},
    {ticker:"INFY.NS",name:"Infosys",price:"1,489",change:"-0.61",pct:"-0.61%"},
    {ticker:"ICICIBANK.NS",name:"ICICI Bank",price:"1,246",change:"+1.12",pct:"+1.12%"},
    {ticker:"BAJFINANCE.NS",name:"Bajaj Finance",price:"933",change:"-3.74",pct:"-3.74%"},
    {ticker:"WIPRO.NS",name:"Wipro",price:"490",change:"+0.32",pct:"+0.32%"},
    {ticker:"SBIN.NS",name:"State Bank of India",price:"812",change:"+0.95",pct:"+0.95%"},
    {ticker:"TATAMOTORS.NS",name:"Tata Motors",price:"949",change:"+2.31",pct:"+2.31%"},
    {ticker:"AXISBANK.NS",name:"Axis Bank",price:"1,190",change:"-0.18",pct:"-0.18%"},
    {ticker:"HINDUNILVR.NS",name:"Hindustan Unilever",price:"2,345",change:"+0.67",pct:"+0.67%"},
    {ticker:"ITC.NS",name:"ITC Limited",price:"425",change:"+1.15",pct:"+1.15%"},
    {ticker:"KOTAKBANK.NS",name:"Kotak Mahindra Bank",price:"1,756",change:"+0.92",pct:"+0.92%"},
    {ticker:"LT.NS",name:"Larsen & Toubro",price:"3,245",change:"+1.34",pct:"+1.34%"},
    {ticker:"MARUTI.NS",name:"Maruti Suzuki",price:"12,345",change:"+0.78",pct:"+0.78%"},
    {ticker:"NTPC.NS",name:"NTPC Limited",price:"345",change:"+0.45",pct:"+0.45%"},
    {ticker:"ONGC.NS",name:"Oil & Natural Gas Corp",price:"245",change:"+1.67",pct:"+1.67%"},
    {ticker:"POWERGRID.NS",name:"Power Grid Corp",price:"298",change:"+0.23",pct:"+0.23%"},
    {ticker:"SUNPHARMA.NS",name:"Sun Pharmaceutical",price:"1,456",change:"+1.89",pct:"+1.89%"},
    {ticker:"TECHM.NS",name:"Tech Mahindra",price:"1,234",change:"+0.56",pct:"+0.56%"},
    {ticker:"ULTRACEMCO.NS",name:"UltraTech Cement",price:"9,876",change:"+1.12",pct:"+1.12%"},
    {ticker:"ADANIPORTS.NS",name:"Adani Ports",price:"1,345",change:"+2.34",pct:"+2.34%"},
    {ticker:"ASIANPAINT.NS",name:"Asian Paints",price:"2,987",change:"+0.89",pct:"+0.89%"},
    {ticker:"BHARTIARTL.NS",name:"Bharti Airtel",price:"1,234",change:"+0.67",pct:"+0.67%"},
    {ticker:"CIPLA.NS",name:"Cipla",price:"1,456",change:"+1.23",pct:"+1.23%"},
    {ticker:"DRREDDY.NS",name:"Dr. Reddy's Labs",price:"5,678",change:"+0.78",pct:"+0.78%"},
    {ticker:"GRASIM.NS",name:"Grasim Industries",price:"2,345",change:"+1.56",pct:"+1.56%"},
    {ticker:"HEROMOTOCO.NS",name:"Hero MotoCorp",price:"4,321",change:"+0.34",pct:"+0.34%"},
    {ticker:"JSWSTEEL.NS",name:"JSW Steel",price:"876",change:"+2.12",pct:"+2.12%"},
  ],
  US:[
    {ticker:"AAPL",name:"Apple Inc",price:"213.49",change:"+0.74",pct:"+0.74%"},
    {ticker:"MSFT",name:"Microsoft Corporation",price:"415.22",change:"+0.51",pct:"+0.51%"},
    {ticker:"GOOGL",name:"Alphabet Inc",price:"178.35",change:"-0.29",pct:"-0.29%"},
    {ticker:"AMZN",name:"Amazon.com Inc",price:"203.47",change:"+1.02",pct:"+1.02%"},
    {ticker:"NVDA",name:"NVIDIA Corporation",price:"875.39",change:"+2.18",pct:"+2.18%"},
    {ticker:"META",name:"Meta Platforms Inc",price:"562.74",change:"+1.87",pct:"+1.87%"},
    {ticker:"TSLA",name:"Tesla Inc",price:"177.84",change:"-1.43",pct:"-1.43%"},
    {ticker:"JPM",name:"JPMorgan Chase & Co",price:"234.11",change:"+0.38",pct:"+0.38%"},
    {ticker:"BAC",name:"Bank of America Corp",price:"43.72",change:"+0.22",pct:"+0.22%"},
    {ticker:"NFLX",name:"Netflix Inc",price:"689.45",change:"+1.23",pct:"+1.23%"},
    {ticker:"DIS",name:"Walt Disney Co",price:"112.34",change:"+0.67",pct:"+0.67%"},
    {ticker:"V",name:"Visa Inc",price:"289.56",change:"+0.89",pct:"+0.89%"},
    {ticker:"MA",name:"Mastercard Inc",price:"498.12",change:"+1.34",pct:"+1.34%"},
    {ticker:"HD",name:"Home Depot Inc",price:"412.78",change:"+0.45",pct:"+0.45%"},
    {ticker:"PFE",name:"Pfizer Inc",price:"28.90",change:"+0.12",pct:"+0.12%"},
    {ticker:"KO",name:"Coca-Cola Co",price:"67.23",change:"+0.78",pct:"+0.78%"},
    {ticker:"PEP",name:"PepsiCo Inc",price:"178.45",change:"+0.56",pct:"+0.56%"},
    {ticker:"WMT",name:"Walmart Inc",price:"89.12",change:"+0.34",pct:"+0.34%"},
    {ticker:"COST",name:"Costco Wholesale",price:"987.65",change:"+1.23",pct:"+1.23%"},
    {ticker:"MCD",name:"McDonald's Corp",price:"312.45",change:"+0.67",pct:"+0.67%"},
    {ticker:"NKE",name:"Nike Inc",price:"145.67",change:"+1.45",pct:"+1.45%"},
    {ticker:"ADBE",name:"Adobe Inc",price:"567.89",change:"+2.34",pct:"+2.34%"},
    {ticker:"CRM",name:"Salesforce Inc",price:"345.67",change:"+1.78",pct:"+1.78%"},
    {ticker:"INTC",name:"Intel Corp",price:"23.45",change:"+0.23",pct:"+0.23%"},
    {ticker:"CSCO",name:"Cisco Systems",price:"56.78",change:"+0.89",pct:"+0.89%"},
    {ticker:"ORCL",name:"Oracle Corp",price:"156.34",change:"+1.12",pct:"+1.12%"},
    {ticker:"IBM",name:"IBM Corp",price:"234.56",change:"+0.45",pct:"+0.45%"},
    {ticker:"AMD",name:"Advanced Micro Devices",price:"123.45",change:"+2.67",pct:"+2.67%"},
    {ticker:"UBER",name:"Uber Technologies",price:"78.90",change:"+1.34",pct:"+1.34%"},
    {ticker:"SPOT",name:"Spotify Technology",price:"456.78",change:"+0.78",pct:"+0.78%"},
  ]
};

// ── TradingView Widget ────────────────────────────────────────────────────────
function TVChart({ symbol }) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current || !symbol) return;
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    containerRef.current.appendChild(wrapper);
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true, symbol, interval: 'D', timezone: 'Asia/Kolkata',
      theme: 'dark', style: '1', locale: 'en', backgroundColor: '#0d1117',
      gridColor: 'rgba(255,255,255,0.04)', hide_top_toolbar: false,
      hide_legend: false, allow_symbol_change: false, save_image: false,
      calendar: false, support_host: 'https://www.tradingview.com',
      width: '100%', height: '100%',
    });
    wrapper.appendChild(script);
    return () => {
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
    };
  }, [symbol]);
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// ── Confidence Gauge ──────────────────────────────────────────────────────────
function ConfidenceGauge({ confidence, verdict }) {
  const getColor = (c) => c >= 80 ? "#22c55e" : c >= 60 ? "#84cc16" : c >= 40 ? "#eab308" : c >= 20 ? "#f97316" : "#ef4444";
  const color = getColor(confidence);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;
  const verdictColor = verdict === "BUY" ? "#22c55e" : verdict === "SELL" ? "#ef4444" : "#f59e0b";
  return (
    <div className="gauge-wrap">
      <div className="gauge-label">AI Confidence</div>
      <div style={{ position: "relative", width: 160, height: 160 }}>
        <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="80" cy="80" r="54" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10"/>
          <circle cx="80" cy="80" r="54" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}/>
        </svg>
        <div className="gauge-center">
          <span className="gauge-pct" style={{ color }}>{confidence}%</span>
          <span className="gauge-sub">confidence</span>
        </div>
      </div>
      <div className="verdict-badge" style={{ color: verdictColor, borderColor: verdictColor, background: `${verdictColor}18` }}>
        {verdict === "BUY" ? "▲" : verdict === "SELL" ? "▼" : "◆"} {verdict}
      </div>
    </div>
  );
}

// ── Stat Row ──────────────────────────────────────────────────────────────────
function StatRow({ label, value, highlight }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value" style={highlight ? { color: highlight } : {}}>{value}</span>
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ icon, title, children, accentColor }) {
  return (
    <div className="analysis-section-card" style={{ borderTopColor: accentColor || "#00bcd4" }}>
      <div className="section-card-header">
        <span className="section-card-icon">{icon}</span>
        <span className="section-card-title">{title}</span>
      </div>
      <div className="section-card-body">{children}</div>
    </div>
  );
}

// ── Analysis Panel ────────────────────────────────────────────────────────────
function AnalysisPanel({ analysis, ticker }) {
  const { verdict, confidence, summary } = analysis;

  const parseSection = (text, key) => {
    const regex = new RegExp(`${key}:([\\s\\S]*?)(?=\\n[A-Z][A-Z ]+:|$)`);
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };
  const parseKeyValue = (block) =>
    block.split("\n").filter(l => l.trim()).map(line => {
      const parts = line.split(":").map(s => s.trim());
      return { key: parts[0], val: parts.slice(1).join(":").trim() };
    }).filter(x => x.key && x.val);

  const technical = parseKeyValue(parseSection(summary, "TECHNICAL INDICATORS"));
  const sentiment = parseKeyValue(parseSection(summary, "MARKET SENTIMENT"));
  const context   = parseKeyValue(parseSection(summary, "MARKET CONTEXT"));
  const ml        = parseKeyValue(parseSection(summary, "MACHINE LEARNING SIGNAL"));
  const consensus = parseKeyValue(parseSection(summary, "RESEARCH CONSENSUS"));
  const keyFactor = (() => { const m = summary.match(/Key Factor:\s*(.+)/); return m ? m[1].trim() : ""; })();

  const verdictColor = verdict === "BUY" ? "#22c55e" : verdict === "SELL" ? "#ef4444" : "#f59e0b";
  const winner = consensus.find(c => c.key === "Winner")?.val;
  const mlConf = parseFloat(ml.find(m => m.key === "Confidence")?.val || 0);

  const signalColor = (val) => {
    if (!val) return undefined;
    const v = val.toLowerCase();
    if (v === "up" || v === "bullish" || v.includes("above")) return "#22c55e";
    if (v === "down" || v === "bearish" || v.includes("below")) return "#ef4444";
    if (v === "sideways" || v === "neutral") return "#94a3b8";
    return undefined;
  };
  const sentimentColor = (val) => {
    const n = parseFloat(val);
    if (isNaN(n)) return undefined;
    return n > 0.1 ? "#22c55e" : n < -0.1 ? "#ef4444" : "#94a3b8";
  };

  return (
    <div className="analysis-panel-wrap">
      {/* Verdict Banner */}
      <div className="verdict-banner" style={{ borderColor: `${verdictColor}40`, background: `${verdictColor}08` }}>
        <div className="verdict-banner-left">
          <div className="verdict-banner-tag">Research Consensus</div>
          <div className="verdict-banner-ticker">{ticker.replace(/\.(NS)$/, "")}</div>
          {winner && (
            <div className="verdict-banner-winner">
              Bear vs Bull → <strong style={{ color: verdictColor }}>{winner} wins</strong>
            </div>
          )}
        </div>
        <div className="verdict-banner-center">
          <ConfidenceGauge confidence={confidence} verdict={verdict} />
        </div>
        {keyFactor && (
          <div className="verdict-banner-right">
            <div className="keyfactor-label">Key Factor</div>
            <div className="keyfactor-text">"{keyFactor}"</div>
          </div>
        )}
      </div>

      {/* 4 Section Cards */}
      <div className="analysis-grid">
        <SectionCard icon="📈" title="Technical Indicators" accentColor="#3b82f6">
          {technical.map(({ key, val }) => (
            <StatRow key={key} label={key} value={val} highlight={signalColor(val)} />
          ))}
        </SectionCard>
        <SectionCard icon="🧠" title="Machine Learning Signal" accentColor="#a855f7">
          {ml.map(({ key, val }) => (
            <StatRow key={key} label={key} value={val} highlight={signalColor(val)} />
          ))}
          <div className="ml-strength-bar-wrap">
            <span className="stat-label">Confidence Visual</span>
            <div className="ml-strength-bar">
              <div className="ml-strength-fill" style={{ width: `${mlConf * 100}%`, background: "#a855f7" }} />
            </div>
          </div>
        </SectionCard>
        <SectionCard icon="📰" title="Market Sentiment" accentColor="#f59e0b">
          {sentiment.map(({ key, val }) => (
            <StatRow key={key} label={key} value={val} highlight={sentimentColor(val)} />
          ))}
        </SectionCard>
        <SectionCard icon="🌐" title="Market Context" accentColor="#06b6d4">
          {context.map(({ key, val }) => (
            <StatRow key={key} label={key} value={val} highlight={signalColor(val)} />
          ))}
        </SectionCard>
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
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis,  setAnalysis]  = useState(null);
  const [error,     setError]     = useState(null);

  const loadCompanies = useCallback(async (code) => {
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

  const handleSelect = (co) => { setSelected(co); setAnalysis(null); setError(null); };

  const runAnalysis = async () => {
    if (!selected) return;
    setAnalyzing(true); setError(null); setAnalysis(null);
    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: selected.ticker })
      });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const data = await response.json();
      if (data.success) { setAnalysis(data); } else { setError(data.error || "Analysis failed"); }
    } catch (err) {
      setError(err.message || "Could not connect to analysis server. Make sure api_server.py is running on port 5000.");
      console.error("Analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const ci = COUNTRIES.find(c => c.code === country);
  const tvSym = selected ? (TV_SYMBOL[selected.ticker] || selected.ticker) : null;
  const shortTicker = selected?.ticker.replace(/\.(NS)$/, "");

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
                onClick={() => { setCountry(c.code); setSelected(null); setAnalysis(null); setError(null); }}>
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
                      <span className="mkt-co-tk">{co.ticker.replace(/\.(NS)$/, "")}</span>
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
            <p>Pick any stock from the sidebar to view live market charts and run AI analysis.</p>
          </div>
        ) : (
          <>
            {/* Sticky header */}
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

            {/* Chart — fixed height, never resized */}
            <div className="mkt-chart-fixed">
              {tvSym && <TVChart key={tvSym} symbol={tvSym}/>}
            </div>

            {/* Run button bar */}
            <div className="mkt-action-bar">
              <button className="mkt-run-btn" onClick={runAnalysis} disabled={analyzing}>
                {analyzing
                  ? <><span className="mkt-spinner"/> Running Analysis…</>
                  : <><span>🚀</span> Run AI Analysis</>
                }
              </button>
              {error && <div className="mkt-error-inline">⚠️ {error}</div>}
            </div>

            {/* Analysis panel — below chart, page scrolls down to show it */}
            {analysis && <AnalysisPanel analysis={analysis} ticker={selected.ticker} />}
          </>
        )}
      </main>
    </div>
  );
}