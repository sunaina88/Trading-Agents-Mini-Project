import { useState, useEffect, useCallback } from "react";
import "./Markets.css";

// ─── Finnhub API key ───────────────────────────────────────────────────────────
const FINNHUB_KEY = "d701in9r01qjh1odsl00d701in9r01qjh1odsl0g";

// ─── Country config ────────────────────────────────────────────────────────────
const COUNTRIES = [
  { code: "IN", label: "India", flag: "🇮🇳", exchange: "NSE", currency: "₹" },
  { code: "US", label: "USA", flag: "🇺🇸", exchange: "NASDAQ", currency: "$" },
  { code: "CN", label: "China", flag: "🇨🇳", exchange: "HKEX", currency: "HK$" },
];

// ─── Company lists ─────────────────────────────────────────────────────────────
// finnhubSymbol → what Finnhub uses for price data
// tvSymbol      → what TradingView uses for the chart
const COMPANIES = {
  IN: [
    {
      ticker: "RELIANCE",
      finnhubSymbol: "NSE:RELIANCE",
      tvSymbol: "NSE:RELIANCE",
      name: "Reliance Industries",
    },
    {
      ticker: "TCS",
      finnhubSymbol: "NSE:TCS",
      tvSymbol: "NSE:TCS",
      name: "Tata Consultancy",
    },
    {
      ticker: "HDFCBANK",
      finnhubSymbol: "NSE:HDFCBANK",
      tvSymbol: "NSE:HDFCBANK",
      name: "HDFC Bank",
    },
    {
      ticker: "INFY",
      finnhubSymbol: "NSE:INFY",
      tvSymbol: "NSE:INFY",
      name: "Infosys",
    },
    {
      ticker: "ICICIBANK",
      finnhubSymbol: "NSE:ICICIBANK",
      tvSymbol: "NSE:ICICIBANK",
      name: "ICICI Bank",
    },
    {
      ticker: "KOTAKBANK",
      finnhubSymbol: "NSE:KOTAKBANK",
      tvSymbol: "NSE:KOTAKBANK",
      name: "Kotak Mahindra Bank",
    },
    {
      ticker: "HINDUNILVR",
      finnhubSymbol: "NSE:HINDUNILVR",
      tvSymbol: "NSE:HINDUNILVR",
      name: "Hindustan Unilever",
    },
    {
      ticker: "SBIN",
      finnhubSymbol: "NSE:SBIN",
      tvSymbol: "NSE:SBIN",
      name: "State Bank of India",
    },
    {
      ticker: "BHARTIARTL",
      finnhubSymbol: "NSE:BHARTIARTL",
      tvSymbol: "NSE:BHARTIARTL",
      name: "Bharti Airtel",
    },
    {
      ticker: "ITC",
      finnhubSymbol: "NSE:ITC",
      tvSymbol: "NSE:ITC",
      name: "ITC Limited",
    },
  ],
  US: [
    {
      ticker: "AAPL",
      finnhubSymbol: "AAPL",
      tvSymbol: "NASDAQ:AAPL",
      name: "Apple Inc",
    },
    {
      ticker: "MSFT",
      finnhubSymbol: "MSFT",
      tvSymbol: "NASDAQ:MSFT",
      name: "Microsoft",
    },
    {
      ticker: "GOOGL",
      finnhubSymbol: "GOOGL",
      tvSymbol: "NASDAQ:GOOGL",
      name: "Alphabet",
    },
    {
      ticker: "AMZN",
      finnhubSymbol: "AMZN",
      tvSymbol: "NASDAQ:AMZN",
      name: "Amazon",
    },
    {
      ticker: "NVDA",
      finnhubSymbol: "NVDA",
      tvSymbol: "NASDAQ:NVDA",
      name: "NVIDIA",
    },
    {
      ticker: "META",
      finnhubSymbol: "META",
      tvSymbol: "NASDAQ:META",
      name: "Meta Platforms",
    },
    {
      ticker: "TSLA",
      finnhubSymbol: "TSLA",
      tvSymbol: "NYSE:TSLA",
      name: "Tesla",
    },
    {
      ticker: "JPM",
      finnhubSymbol: "JPM",
      tvSymbol: "NYSE:JPM",
      name: "JPMorgan Chase",
    },
    {
      ticker: "WMT",
      finnhubSymbol: "WMT",
      tvSymbol: "NYSE:WMT",
      name: "Walmart",
    },
    {
      ticker: "BAC",
      finnhubSymbol: "BAC",
      tvSymbol: "NYSE:BAC",
      name: "Bank of America",
    },
  ],
  CN: [
    {
      ticker: "0700.HK",
      finnhubSymbol: "HKEX:700",
      tvSymbol: "HKEX:700",
      name: "Tencent",
    },
    {
      ticker: "9988.HK",
      finnhubSymbol: "HKEX:9988",
      tvSymbol: "HKEX:9988",
      name: "Alibaba",
    },
    {
      ticker: "3690.HK",
      finnhubSymbol: "HKEX:3690",
      tvSymbol: "HKEX:3690",
      name: "Meituan",
    },
    {
      ticker: "9618.HK",
      finnhubSymbol: "HKEX:9618",
      tvSymbol: "HKEX:9618",
      name: "JD.com",
    },
    {
      ticker: "0941.HK",
      finnhubSymbol: "HKEX:941",
      tvSymbol: "HKEX:941",
      name: "China Mobile",
    },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n, isINR) {
  return Number(n).toLocaleString(isINR ? "en-IN" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function sign(n) {
  return Number(n) >= 0
    ? `+${Number(n).toFixed(2)}`
    : `${Number(n).toFixed(2)}`;
}
function pctF(n) {
  return Number(n) >= 0
    ? `+${Number(n).toFixed(2)}%`
    : `${Number(n).toFixed(2)}%`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Finnhub quote — direct CORS, no proxy needed
// /quote returns { c: currentPrice, d: change, dp: changePct, h, l, o, pc }
// ─────────────────────────────────────────────────────────────────────────────
async function fetchFinnhub(finnhubSymbol) {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(finnhubSymbol)}&token=${FINNHUB_KEY}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const d = await res.json();
    if (!d.c || d.c === 0) throw new Error("no price");
    const isINR = finnhubSymbol.startsWith("NSE:");
    return {
      price: fmt(d.c, isINR),
      change: sign(d.d ?? 0),
      pct: pctF(d.dp ?? 0),
      open: d.o,
      high: d.h,
      low: d.l,
      prev: d.pc,
      isINR,
      live: true,
    };
  } catch {
    return null;
  }
}

// ─── Fallback: Yahoo Finance via allorigins proxy ──────────────────────────────
async function fetchYahoo(yahooTicker) {
  const isINR = yahooTicker.endsWith(".NS");
  try {
    const yUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=1d&range=2d`;
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(yUrl)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const wrap = await res.json();
    const json = JSON.parse(wrap.contents);
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) throw new Error("no price");
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - prevClose;
    const changePct = prevClose ? (change / prevClose) * 100 : 0;
    return {
      price: fmt(price, isINR),
      change: sign(change),
      pct: pctF(changePct),
      open: meta.regularMarketOpen,
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      prev: prevClose,
      isINR,
      live: true,
    };
  } catch {
    return null;
  }
}

// ─── Master fetch: Finnhub first, Yahoo fallback ──────────────────────────────
// Converts ticker → Yahoo format for fallback
const YAHOO_TICKER = {
  "NSE:RELIANCE": "RELIANCE.NS",
  "NSE:TCS": "TCS.NS",
  "NSE:HDFCBANK": "HDFCBANK.NS",
  "NSE:INFY": "INFY.NS",
  "NSE:ICICIBANK": "ICICIBANK.NS",
  "NSE:KOTAKBANK": "KOTAKBANK.NS",
  "NSE:HINDUNILVR": "HINDUNILVR.NS",
  "NSE:SBIN": "SBIN.NS",
  "NSE:BHARTIARTL": "BHARTIARTL.NS",
  "NSE:ITC": "ITC.NS",
  "HKEX:700": "0700.HK",
  "HKEX:9988": "9988.HK",
  "HKEX:3690": "3690.HK",
  "HKEX:9618": "9618.HK",
  "HKEX:941": "0941.HK",
};

async function fetchQuote(co) {
  // Try Finnhub first
  const r = await fetchFinnhub(co.finnhubSymbol);
  if (r) return r;
  // Fallback to Yahoo
  const yTicker = YAHOO_TICKER[co.finnhubSymbol] ?? co.finnhubSymbol;
  return await fetchYahoo(yTicker);
}

// ─────────────────────────────────────────────────────────────────────────────
// TradingView chart — correct URL format that actually respects the symbol
// Using /chart/ path with symbol in query string
// ─────────────────────────────────────────────────────────────────────────────
function TVChart({ tvSymbol }) {
  // Encode the symbol properly for TradingView URL
  const encodedSymbol = encodeURIComponent(tvSymbol);
  const src = `https://s.tradingview.com/widgetembed/?frameElementId=tv_chart&symbol=${encodedSymbol}&interval=D&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=0&saveimage=0&toolbarbg=0d1117&studies=[]&theme=dark&style=1&timezone=Asia%2FKolkata&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart`;

  return (
    <iframe
      key={tvSymbol}
      src={src}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
      }}
      allow="clipboard-read; clipboard-write"
      allowFullScreen
    />
  );
}

// ─── Stat cell ─────────────────────────────────────────────────────────────────
function Stat({ label, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        padding: "10px 16px",
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        style={{
          fontSize: "9px",
          color: "#484f58",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          fontFamily: "monospace",
          color: color || "#e6edf3",
          whiteSpace: "nowrap",
        }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

// ─── Status dot ───────────────────────────────────────────────────────────────
function Dot({ s }) {
  if (s === "loading")
    return (
      <span
        style={{
          fontSize: "7px",
          color: "#ffd740",
          marginLeft: "4px",
          border: "1px solid rgba(255,215,64,0.5)",
          borderRadius: "2px",
          padding: "1px 3px",
          fontWeight: 700,
          verticalAlign: "middle",
        }}
      >
        …
      </span>
    );
  if (s === "live")
    return (
      <span
        style={{
          fontSize: "7px",
          color: "#00e676",
          marginLeft: "4px",
          border: "1px solid rgba(0,230,118,0.5)",
          borderRadius: "2px",
          padding: "1px 3px",
          fontWeight: 700,
          verticalAlign: "middle",
        }}
      >
        ●
      </span>
    );
  if (s === "error")
    return (
      <span
        style={{
          fontSize: "7px",
          color: "#ff5252",
          marginLeft: "4px",
          border: "1px solid rgba(255,82,82,0.5)",
          borderRadius: "2px",
          padding: "1px 3px",
          fontWeight: 700,
          verticalAlign: "middle",
        }}
      >
        !
      </span>
    );
  return null;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Markets() {
  const [country, setCountry] = useState("IN");
  const [companies, setCompanies] = useState(COMPANIES["IN"]);
  const [status, setStatus] = useState({});
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Load sidebar prices for all companies ────────────────────────────────────
  const loadAll = useCallback(async (code) => {
    const base = COMPANIES[code];
    setCompanies(base);
    const init = {};
    base.forEach((c) => {
      init[c.ticker] = "loading";
    });
    setStatus(init);

    base.forEach(async (co) => {
      const q = await fetchQuote(co);
      setCompanies((prev) =>
        prev.map((p) => (p.ticker === co.ticker ? { ...p, ...(q ?? {}) } : p)),
      );
      setStatus((prev) => ({ ...prev, [co.ticker]: q ? "live" : "error" }));
    });
  }, []);

  const switchCountry = (code) => {
    if (code === country) return;
    setCountry(code);
    setSelected(null);
    setDetail(null);
  };

  useEffect(() => {
    loadAll(country);
  }, [country, loadAll]);

  // ── Select company ─────────────────────────────────────────────────────────
  const handleSelect = async (co) => {
    setSelected(co);
    setDetail(null);
    setLoading(true);
    const q = await fetchQuote(co);
    setDetail(q);
    setLoading(false);
  };

  const ci = COUNTRIES.find((c) => c.code === country);
  const isUp = detail ? !String(detail.change ?? "").startsWith("-") : true;

  return (
    <div className="mkt-root">
      {/* ── Sidebar ── */}
      <aside className="mkt-sidebar">
        <div className="mkt-sb-top">
          <span className="mkt-sb-heading">Markets</span>
          <div className="mkt-ctabs">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                className={`mkt-ctab ${country === c.code ? "active" : ""}`}
                onClick={() => switchCountry(c.code)}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mkt-list">
          <div className="mkt-list-lbl">
            {ci?.flag} {ci?.exchange} Stocks
          </div>
          {companies.map((co) => {
            const s = status[co.ticker];
            const pos = co.change ? !String(co.change).startsWith("-") : true;
            return (
              <button
                key={co.ticker}
                className={`mkt-co ${selected?.ticker === co.ticker ? "active" : ""}`}
                onClick={() => handleSelect(co)}
              >
                <div className="mkt-co-l">
                  <span className="mkt-co-tk">
                    {co.ticker.replace(/\.(HK)$/, "")}
                    <Dot s={s} />
                  </span>
                  <span className="mkt-co-nm">{co.name}</span>
                </div>
                <div className="mkt-co-r">
                  {co.price ? (
                    <>
                      <span className="mkt-co-px">
                        {ci?.currency}
                        {co.price}
                      </span>
                      <span className={`mkt-co-ch ${pos ? "pos" : "neg"}`}>
                        {co.pct}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: "10px", color: "#484f58" }}>
                      {s === "loading" ? "fetching…" : "N/A"}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="mkt-main">
        {!selected ? (
          <div className="mkt-empty">
            <div className="mkt-empty-ico">📊</div>
            <h2>Select a company to begin</h2>
            <p>Live prices via Finnhub · Charts by TradingView</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div className="mkt-chdr" style={{ flexShrink: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span className="mkt-ctk">
                  {selected.ticker.replace(/\.(HK)$/, "")}
                </span>
                <span className="mkt-cnm">{selected.name}</span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#8b949e",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "4px",
                    padding: "2px 7px",
                    fontFamily: "monospace",
                  }}
                >
                  {selected.tvSymbol}
                </span>
                {loading && (
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#00bcd4",
                      background: "rgba(0,188,212,0.1)",
                      border: "1px solid rgba(0,188,212,0.3)",
                      borderRadius: "4px",
                      padding: "2px 7px",
                      fontWeight: 700,
                    }}
                  >
                    FETCHING…
                  </span>
                )}
                {detail && !loading && (
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#00e676",
                      background: "rgba(0,230,118,0.1)",
                      border: "1px solid rgba(0,230,118,0.3)",
                      borderRadius: "4px",
                      padding: "2px 7px",
                      fontWeight: 700,
                    }}
                  >
                    LIVE
                  </span>
                )}
              </div>
              {detail && (
                <div className="mkt-cpx-wrap">
                  <span className="mkt-cpx">
                    {ci?.currency}
                    {detail.price}
                  </span>
                  <span className={`mkt-cch ${isUp ? "pos" : "neg"}`}>
                    {detail.change} ({detail.pct})
                  </span>
                </div>
              )}
            </div>

            {/* Stats bar */}
            {detail && (
              <div
                style={{
                  display: "flex",
                  flexShrink: 0,
                  overflowX: "auto",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <Stat
                  label="Open"
                  value={`${ci?.currency}${fmt(detail.open ?? 0, detail.isINR)}`}
                />
                <Stat
                  label="High"
                  value={`${ci?.currency}${fmt(detail.high ?? 0, detail.isINR)}`}
                  color="#00e676"
                />
                <Stat
                  label="Low"
                  value={`${ci?.currency}${fmt(detail.low ?? 0, detail.isINR)}`}
                  color="#ff5252"
                />
                <Stat
                  label="Prev Close"
                  value={`${ci?.currency}${fmt(detail.prev ?? 0, detail.isINR)}`}
                />
                <Stat
                  label="Change"
                  value={detail.change}
                  color={isUp ? "#00e676" : "#ff5252"}
                />
                <Stat
                  label="Change %"
                  value={detail.pct}
                  color={isUp ? "#00e676" : "#ff5252"}
                />
              </div>
            )}

            {/* TradingView Chart */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                background: "#0d1117",
              }}
            >
              <TVChart key={selected.tvSymbol} tvSymbol={selected.tvSymbol} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}