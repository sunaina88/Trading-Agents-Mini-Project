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

// ── Technical Indicator Bar ────────────────────────────────────────────────────────
// REMOVED - Keeping UI simple

// ── Sentiment Display ────────────────────────────────────────────────────────
// REMOVED - Keeping UI simple

// ── Risk Factors Display ────────────────────────────────────────────────────────
// REMOVED - Keeping UI simple

// ── Researcher Arguments ────────────────────────────────────────────────────────
// REMOVED - Keeping UI simple

// ── Confidence Gauge Component ────────────────────────────────────────────────────────
function ConfidenceGauge({ confidence, verdict }) {
  const getColor = (conf) => {
    if (conf >= 80) return "#22c55e"; // Green - Strong
    if (conf >= 60) return "#84cc16"; // Lime - Good
    if (conf >= 40) return "#eab308"; // Yellow - Moderate
    if (conf >= 20) return "#f97316"; // Orange - Weak
    return "#ef4444"; // Red - Very Weak
  };
  
  const color = getColor(confidence);
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;
  
  const getVerdictColor = () => {
    if (verdict === "BUY") return "#22c55e";
    if (verdict === "SELL") return "#ef4444";
    return "#f59e0b";
  };
  
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      padding: "20px",
      backgroundColor: "rgba(255,255,255,0.02)",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.1)"
    }}>
      <div style={{ position: "relative", width: "150px", height: "150px" }}>
        <svg width="150" height="150" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="75"
            cy="75"
            r="50"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="75"
            cy="75"
            r="50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
          />
        </svg>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: color
          }}>
            {confidence}%
          </div>
          <div style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.6)",
            marginTop: "4px"
          }}>
            Confidence
          </div>
        </div>
      </div>
      
      <div style={{
        fontSize: "24px",
        fontWeight: "bold",
        color: getVerdictColor(),
        padding: "12px 24px",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: "8px",
        border: `2px solid ${getVerdictColor()}`
      }}>
        {verdict}
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

  const handleSelect = (co) => {
    setSelected(co);
    setAnalysis(null);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!selected) return;
    
    setAnalyzing(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ticker: selected.ticker })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (err) {
      setError(err.message || "Could not connect to analysis server. Make sure api_server.py is running on port 5000.");
      console.error("Analysis error:", err);
    } finally {
      setAnalyzing(false);
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
            <p>Pick any stock from the sidebar to view live market charts and run AI analysis.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "0", padding: "0" }}>
            {/* Header */}
            <div className="mkt-chdr" style={{flexShrink: 0}}>
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

            {/* Scrollable Control Panel */}
            <div style={{flexShrink: 0, overflowY: "auto", padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)"}}>
              {/* Analysis Button */}
              <button
                onClick={runAnalysis}
                disabled={analyzing}
                style={{
                  padding: "12px 24px",
                  backgroundColor: analyzing ? "#666" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: analyzing ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s",
                  maxWidth: "300px",
                  marginBottom: error || analysis ? "16px" : "0"
                }}
                onMouseOver={(e) => !analyzing && (e.target.style.backgroundColor = "#2563eb")}
                onMouseOut={(e) => !analyzing && (e.target.style.backgroundColor = "#3b82f6")}
              >
                {analyzing ? "🔄 Running Analysis..." : "🚀 Run AI Analysis"}
              </button>

              {/* Error message */}
              {error && (
                <div style={{
                  padding: "12px 16px",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.5)",
                  borderRadius: "8px",
                  color: "#fca5a5",
                  marginBottom: analysis ? "16px" : "0"
                }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Analysis Results */}
              {analysis && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {/* Confidence Gauge */}
                  <div>
                    <h3 style={{ marginBottom: "16px", color: "rgba(255,255,255,0.8)" }}>Market Signal</h3>
                    <ConfidenceGauge 
                      confidence={analysis.confidence} 
                      verdict={analysis.verdict}
                    />
                  </div>

                  {/* Summary */}
                  <div style={{
                    padding: "20px",
                    backgroundColor: "rgba(255,255,255,0.02)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    <h3 style={{ marginBottom: "12px", color: "rgba(255,255,255,0.8)" }}>Analysis Summary</h3>
                    <pre style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.6)",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      fontFamily: "monospace",
                      margin: 0
                    }}>
                      {analysis.summary}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* TradingView chart - Takes remaining space */}
            <div style={{flex: 1, minHeight: 0, overflow: "hidden", background: "#0d1117"}}>
              {tvSym && <TVChart symbol={tvSym}/>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}