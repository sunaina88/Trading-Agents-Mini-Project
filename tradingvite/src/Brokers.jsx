import React, { useState } from "react";
import "./Brokers.css";

function Brokers() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [hoveredBroker, setHoveredBroker] = useState(null);

  const filters = [
    { id: "all", label: "Best rated" },
    { id: "stocks", label: "For Stocks" },
    { id: "futures", label: "Futures" },
    { id: "forex", label: "Forex" },
    { id: "crypto", label: "Crypto" },
    { id: "etfs", label: "ETFs" },
    { id: "options", label: "Options" },
  ];

  const brokers = [
    {
      id: 1,
      name: "Alice Blue",
      badge: "NEW",
      logo: "🔷",
      color: "#e8f4f8",
      accentColor: "#2196f3",
      markets: ["Stocks", "Futures", "Options"],
      rating: 4.6,
      reviews: "2.4M",
      commission: "₹20 per Order",
      tagline: "Trade Flat ₹20 per Order!",
      features: ["Free Demat", "Advanced Charts", "Mobile App"],
      minDeposit: "₹0",
    },
    {
      id: 2,
      name: "Fyers",
      badge: "HOT",
      logo: "⚡",
      color: "#e3f2fd",
      accentColor: "#2962ff",
      markets: ["Stocks", "Futures", "Options"],
      rating: 4.5,
      reviews: "1.1K",
      commission: "FREE Demat A/C",
      tagline: "FREE Demat A/C with 0 AMC",
      features: ["Zero Brokerage", "API Access", "Real-time Data"],
      minDeposit: "₹0",
    },
    {
      id: 3,
      name: "Dhan",
      badge: null,
      logo: "💎",
      color: "#e8f5e9",
      accentColor: "#4caf50",
      markets: ["Stocks", "Futures", "Options"],
      rating: 4.3,
      reviews: "673.9K",
      commission: "Free Demat A/C",
      tagline: "Free Demat A/C, ₹0 AMC",
      features: ["Smart Orders", "Portfolio Analytics", "MTF Trading"],
      minDeposit: "₹0",
    },
    {
      id: 4,
      name: "Interactive Brokers",
      badge: "GLOBAL",
      logo: "🌐",
      color: "#ffebee",
      accentColor: "#f44336",
      markets: ["Stocks", "Futures", "Options", "Forex"],
      rating: 4.3,
      reviews: "134.2K",
      commission: "Low Trading Costs",
      tagline: "Low Trading Costs",
      features: ["Global Markets", "Institutional Grade", "Research Tools"],
      minDeposit: "$0",
    },
    {
      id: 5,
      name: "Share.Market",
      badge: null,
      logo: "📊",
      color: "#f3e5f5",
      accentColor: "#9c27b0",
      markets: ["Stocks", "Futures", "ETFs", "Options"],
      rating: 4.1,
      reviews: "1.1.5K",
      commission: "Free Demat",
      tagline: "Free Demat with ₹0 AMC",
      features: ["Easy Interface", "Learning Resources", "Quick Setup"],
      minDeposit: "₹0",
    },
    {
      id: 6,
      name: "Paytm Money",
      badge: "APP",
      logo: "💳",
      color: "#e1f5fe",
      accentColor: "#00bcd4",
      markets: ["Stocks", "Futures"],
      rating: 3.9,
      reviews: "1.7M",
      commission: "₹0 Commission",
      tagline: "Invest with zero commission",
      features: ["UPI Payments", "Mutual Funds", "Digital Gold"],
      minDeposit: "₹100",
    },
    {
      id: 7,
      name: "Motilal Oswal",
      badge: null,
      logo: "🏛️",
      color: "#fff3e0",
      accentColor: "#ff9800",
      markets: ["Stocks", "Futures"],
      rating: 3.8,
      reviews: "4.4K",
      commission: "Premium Service",
      tagline: "Trusted since 1987",
      features: ["Research Reports", "Advisory Services", "Wealth Management"],
      minDeposit: "₹5000",
    },
    {
      id: 8,
      name: "Bajaj Broking",
      badge: null,
      logo: "🏢",
      color: "#e0f2f1",
      accentColor: "#009688",
      markets: ["Stocks", "Futures", "Options"],
      rating: 3.3,
      reviews: "2.3K",
      commission: "Flexible Plans",
      tagline: "Part of Bajaj Finserv",
      features: ["Margin Trading", "Expert Advice", "Premium Support"],
      minDeposit: "₹1000",
    },
  ];

  const stats = [
    {
      number: "4,075,901",
      label: "Traders connected through us",
      color: "#9c27b0",
    },
    {
      number: "364,142,034",
      label: "Successfully executed live orders",
      color: "#00bcd4",
    },
  ];

  return (
    <div className="brokers-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Trade Smarter</span>
            <br />
            with Verified Brokers
          </h1>
          <p className="hero-subtitle">
            Get trading with verified brokers today. Zero commission, instant
            setup.
          </p>
        </div>

        <div className="filters-container">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-btn ${selectedFilter === filter.id ? "active" : ""}`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="brokers-grid">
        {brokers.map((broker) => (
          <div
            key={broker.id}
            className="broker-card"
            style={{
              "--card-bg": broker.color,
              "--accent-color": broker.accentColor,
            }}
            onMouseEnter={() => setHoveredBroker(broker.id)}
            onMouseLeave={() => setHoveredBroker(null)}
          >
            {broker.badge && (
              <div
                className="broker-badge"
                style={{ backgroundColor: broker.accentColor }}
              >
                {broker.badge}
              </div>
            )}

            <div className="broker-header">
              <div className="broker-logo-wrapper">
                <div
                  className="broker-logo"
                  style={{ backgroundColor: broker.accentColor }}
                >
                  <span className="logo-icon">{broker.logo}</span>
                </div>
              </div>
              <div className="broker-info">
                <h3 className="broker-name">{broker.name}</h3>
                <div className="broker-markets">
                  {broker.markets.map((market, idx) => (
                    <span key={idx} className="market-tag">
                      {market}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="broker-stats">
              <div className="stat-item">
                <div className="stat-rating">
                  <span className="stars">
                    {"⭐".repeat(Math.floor(broker.rating))}
                  </span>
                  <span className="rating-number">{broker.rating}</span>
                </div>
                <span className="stat-label">{broker.reviews} Reviews</span>
              </div>
            </div>

            <div className="broker-commission">
              <div
                className="commission-badge"
                style={{ backgroundColor: broker.accentColor }}
              >
                {broker.commission}
              </div>
              <p className="commission-text">{broker.tagline}</p>
            </div>

            <div className="broker-features">
              {broker.features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>

            <div className="broker-actions">
              <button className="btn-secondary">
                <span className="btn-icon">🔗</span>
                Open Account
              </button>
              <button
                className="btn-primary"
                style={{ backgroundColor: broker.accentColor }}
              >
                Learn More
              </button>
            </div>

            <div className="broker-min-deposit">
              Min. Deposit: <strong>{broker.minDeposit}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="compare-section">
        <button className="compare-btn">
          <span className="compare-icon">⚖️</span>
          Compare All Brokers
        </button>
      </div>

      <div className="stats-section">
        <h2 className="stats-title">
          Every trade a<br />
          <span className="hashtag">#TradingView</span>
        </h2>
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-number" style={{ color: stat.color }}>
                {stat.number}
              </div>
              <div className="stat-description">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <div className="cta-visual">
            <div className="rocket-container">
              <div className="rocket">🚀</div>
              <div className="rocket-trail"></div>
            </div>
          </div>
          <h2 className="cta-title">LOOK FIRST / THEN LEAP.</h2>
          <p className="cta-subtitle">
            Start your trading journey with confidence
          </p>
          <button className="cta-button">Get Started Today</button>
        </div>
      </div>
    </div>
  );
}

export default Brokers;
