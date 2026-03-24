import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Country.css";

// ─── Country + index config ───────────────────────────────────────────────────
const COUNTRIES = [
  { code: "US", name: "United States",  flag: "🇺🇸", market: "NYSE / NASDAQ",             currency: "USD", region: "Americas",    symbol: "%5EGSPC",   index: "S&P 500"       },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", market: "London Stock Exchange",      currency: "GBP", region: "Europe",      symbol: "%5EFTSE",   index: "FTSE 100"      },
  { code: "JP", name: "Japan",          flag: "🇯🇵", market: "Tokyo Stock Exchange",       currency: "JPY", region: "Asia Pacific", symbol: "%5EN225",   index: "Nikkei 225"    },
  { code: "DE", name: "Germany",        flag: "🇩🇪", market: "Frankfurt Stock Exchange",   currency: "EUR", region: "Europe",      symbol: "%5EGDAXI",  index: "DAX 40"        },
  { code: "IN", name: "India",          flag: "🇮🇳", market: "NSE / BSE",                  currency: "INR", region: "Asia Pacific", symbol: "%5ENSEI",   index: "NIFTY 50"      },
  { code: "CN", name: "China",          flag: "🇨🇳", market: "Shanghai Stock Exchange",    currency: "CNY", region: "Asia Pacific", symbol: "000001.SS", index: "SSE Composite"  },
  { code: "AU", name: "Australia",      flag: "🇦🇺", market: "Australian Securities Exch", currency: "AUD", region: "Asia Pacific", symbol: "%5EAXJO",   index: "ASX 200"       },
  { code: "CA", name: "Canada",         flag: "🇨🇦", market: "Toronto Stock Exchange",     currency: "CAD", region: "Americas",    symbol: "%5EGSPTSE", index: "TSX Composite"  },
  { code: "BR", name: "Brazil",         flag: "🇧🇷", market: "B3 Exchange",                currency: "BRL", region: "Americas",    symbol: "%5EBVSP",   index: "Ibovespa"       },
  { code: "SG", name: "Singapore",      flag: "🇸🇬", market: "Singapore Exchange",         currency: "SGD", region: "Asia Pacific", symbol: "%5ESTI",    index: "STI"           },
  { code: "KR", name: "South Korea",    flag: "🇰🇷", market: "Korea Stock Exchange",       currency: "KRW", region: "Asia Pacific", symbol: "%5EKS11",   index: "KOSPI"         },
  { code: "FR", name: "France",         flag: "🇫🇷", market: "Euronext Paris",             currency: "EUR", region: "Europe",      symbol: "%5EFCHI",   index: "CAC 40"        },
];

const REGIONS = ["All", "Americas", "Europe", "Asia Pacific"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n == null ? "N/A" : n.toLocaleString("en-US", { maximumFractionDigits: 2 });

const fmtPct = (n) =>
  n == null ? "N/A" : (n >= 0 ? "+" : "") + n.toFixed(2) + "%";

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Country() {
  const [search,       setSearch]       = useState("");
  const [activeRegion, setActiveRegion] = useState("All");
  const [selected,     setSelected]     = useState(null);
  const [liveData,     setLiveData]     = useState({});
  const [loadingSet,   setLoadingSet]   = useState(new Set(COUNTRIES.map((c) => c.symbol)));
  const [errorSet,     setErrorSet]     = useState(new Set());
  const [lastUpdated,  setLastUpdated]  = useState(null);

  // ── fetch a single symbol via allorigins CORS proxy → Yahoo Finance ──────────
  const fetchQuote = useCallback(async (symbol) => {
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooUrl)}`;

    const res  = await fetch(proxyUrl);
    const json = await res.json();
    const data = JSON.parse(json.contents);

    const meta      = data?.chart?.result?.[0]?.meta;
    const closes    = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
    const prevClose = closes[closes.length - 2] ?? meta?.chartPreviousClose;
    const price     = meta?.regularMarketPrice;
    const pctChange =
      prevClose && price
        ? ((price - prevClose) / prevClose) * 100
        : (meta?.regularMarketChangePercent ?? null);

    return {
      price,
      pctChange,
      marketState:  meta?.marketState   ?? "CLOSED",
      currency:     meta?.currency      ?? "—",
      exchangeName: meta?.exchangeName  ?? "—",
    };
  }, []);

  // ── fetch all 12 markets in parallel ────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoadingSet(new Set(COUNTRIES.map((c) => c.symbol)));
    setErrorSet(new Set());

    const results = await Promise.allSettled(
      COUNTRIES.map(async (c) => {
        const quote = await fetchQuote(c.symbol);
        return { symbol: c.symbol, quote };
      })
    );

    const next = {};
    const errs = new Set();

    results.forEach((r) => {
      if (r.status === "fulfilled" && r.value.quote) {
        next[r.value.symbol] = r.value.quote;
      } else {
        const sym = r.status === "fulfilled" ? r.value.symbol : null;
        if (sym) errs.add(sym);
      }
    });

    setLiveData(next);
    setLoadingSet(new Set());
    setErrorSet(errs);
    setLastUpdated(new Date().toLocaleTimeString());
  }, [fetchQuote]);

  // ── on mount + every 60 s ────────────────────────────────────────────────────
  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 60_000);
    return () => clearInterval(id);
  }, [fetchAll]);

  // ── filtered list ────────────────────────────────────────────────────────────
  const filtered = COUNTRIES.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.name.toLowerCase().includes(q) || c.market.toLowerCase().includes(q)) &&
      (activeRegion === "All" || c.region === activeRegion)
    );
  });

  const openCount = Object.values(liveData).filter(
    (d) => d.marketState === "REGULAR"
  ).length;

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="country-page">

      {/* ── HERO ── */}
      <div className="country-hero">
        <div className="country-hero-bg" />
        <div className="country-hero-content">
          <span className="country-hero-tag">🌐 Live Global Markets</span>
          <h1 className="country-hero-title">
            Explore Markets <br />
            <span className="country-hero-accent">By Country</span>
          </h1>
          <p className="country-hero-subtitle">
            Real-time index data via Yahoo Finance · auto-refreshes every 60 s
          </p>
        </div>

        <div className="country-stats-row">
          <div className="country-stat">
            <span className="country-stat-value">{COUNTRIES.length}</span>
            <span className="country-stat-label">Markets</span>
          </div>
          <div className="country-stat-divider" />
          <div className="country-stat">
            <span className="country-stat-value">{openCount}</span>
            <span className="country-stat-label">Open Now</span>
          </div>
          <div className="country-stat-divider" />
          <div className="country-stat">
            <span className="country-stat-value">{COUNTRIES.length - openCount}</span>
            <span className="country-stat-label">Closed</span>
          </div>
          {lastUpdated && (
            <>
              <div className="country-stat-divider" />
              <div className="country-stat">
                <span className="country-stat-value country-stat-time">{lastUpdated}</span>
                <span className="country-stat-label">Last Updated</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="country-controls">
        <div className="country-search-wrap">
          <span className="country-search-icon">🔍</span>
          <input
            className="country-search"
            type="text"
            placeholder="Search country or exchange..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="country-region-tabs">
          {REGIONS.map((r) => (
            <button
              key={r}
              className={`country-region-tab ${activeRegion === r ? "active" : ""}`}
              onClick={() => setActiveRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>

        <button className="country-refresh-btn" onClick={fetchAll}>
          🔄 Refresh
        </button>
      </div>

      {/* ── GRID ── */}
      <div className="country-grid">
        {filtered.map((c) => {
          const live     = liveData[c.symbol];
          const isLoading = loadingSet.has(c.symbol);
          const hasError  = errorSet.has(c.symbol);
          const isOpen    = live?.marketState === "REGULAR";
          const positive  = live ? (live.pctChange ?? 0) >= 0 : true;

          return (
            <div
              key={c.code}
              className={`country-card ${selected === c.code ? "selected" : ""}`}
              onClick={() => setSelected(selected === c.code ? null : c.code)}
            >
              {/* Top */}
              <div className="country-card-top">
                <span className="country-flag">{c.flag}</span>

                {isLoading ? (
                  <span className="country-status loading">
                    <span className="status-dot" /> Loading…
                  </span>
                ) : hasError ? (
                  <span className="country-status error">⚠ Unavailable</span>
                ) : (
                  <span className={`country-status ${isOpen ? "open" : "closed"}`}>
                    <span className="status-dot" />
                    {isOpen ? "Open" : "Closed"}
                  </span>
                )}
              </div>

              <h3 className="country-name">{c.name}</h3>
              <p  className="country-market">{c.market}</p>

              <div className="country-card-divider" />

              {/* Bottom */}
              <div className="country-card-bottom">
                <div className="country-index-info">
                  <span className="country-index-label">{c.index}</span>
                  {isLoading
                    ? <span className="skeleton-line" />
                    : <span className="country-index-value">{live ? fmt(live.price) : "—"}</span>
                  }
                </div>

                {isLoading
                  ? <span className="skeleton-badge" />
                  : live
                    ? <div className={`country-change ${positive ? "positive" : "negative"}`}>
                        {fmtPct(live.pctChange)}
                      </div>
                    : null
                }
              </div>

              {/* Expanded */}
              {selected === c.code && (
                <div className="country-card-detail">
                  <div className="detail-row">
                    <span className="detail-label">Currency</span>
                    <span className="detail-value">{live?.currency ?? c.currency}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Region</span>
                    <span className="detail-value">{c.region}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Exchange</span>
                    <span className="detail-value">{live?.exchangeName ?? c.market}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Market State</span>
                    <span className={`detail-value ${isOpen ? "open-text" : "closed-text"}`}>
                      {live?.marketState ?? "—"}
                    </span>
                  </div>
                  <Link to="/markets" className="country-detail-btn">
                    View Full Market →
                  </Link>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="country-empty">
            <span>🌐</span>
            <p>No countries found for "<strong>{search}</strong>"</p>
          </div>
        )}
      </div>
    </div>
  );
}