import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./Home.css";

function Home() {
  const [marketData, setMarketData] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [forexData, setForexData] = useState([]);
  const [stockIndices, setStockIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [globalChart, setGlobalChart] = useState([]);
  const [intradayChart, setIntradayChart] = useState([]);
  const [timeRange, setTimeRange] = useState('1D');
  const [scrollY, setScrollY] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const heroRef = useRef(null);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate realistic intraday chart data
  const generateIntradayData = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30);
    const data = [];
    let basePrice = 25500;
    let currentPrice = basePrice;

    // Generate data points every 5 minutes from 9:30 AM to current time
    const currentMinutes = (now.getHours() * 60 + now.getMinutes());
    const startMinutes = 9 * 60 + 30; // 9:30 AM
    const endMinutes = Math.min(currentMinutes, 16 * 60); // Up to 4:00 PM or current time

    for (let minutes = startMinutes; minutes <= endMinutes; minutes += 5) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const time = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      
      // Add realistic price movements with volatility
      const volatility = Math.random() * 40 - 20;
      const trend = -0.5; // Slight downward trend
      currentPrice += trend + volatility;
      
      data.push({
        time,
        price: parseFloat(currentPrice.toFixed(2)),
        volume: Math.random() * 1000000 + 500000
      });
    }

    return data;
  };

  // Fetch real-time market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const cryptoResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=true&price_change_percentage=24h'
        );
        const cryptoData = await cryptoResponse.json();
        
        const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
        const globalData = await globalResponse.json();
        
        const forexResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const forexRates = await forexResponse.json();
        
        const majorPairs = [
          { pair: 'EUR/USD', rate: forexRates.rates.EUR, base: 'EUR' },
          { pair: 'GBP/USD', rate: forexRates.rates.GBP, base: 'GBP' },
          { pair: 'USD/JPY', rate: forexRates.rates.JPY, base: 'JPY' },
          { pair: 'USD/CHF', rate: forexRates.rates.CHF, base: 'CHF' },
          { pair: 'AUD/USD', rate: forexRates.rates.AUD, base: 'AUD' },
          { pair: 'USD/CAD', rate: forexRates.rates.CAD, base: 'CAD' }
        ];
        
        const processedForex = majorPairs.map(pair => ({
          ...pair,
          change: (Math.random() * 2 - 1).toFixed(2),
          volume: `$${(Math.random() * 500 + 100).toFixed(0)}B`
        }));
        
        const indices = [
          { name: 'S&P 500', symbol: 'SPX', price: '4,783.45', change: '+0.85', volume: '$2.1T', up: true },
          { name: 'NASDAQ', symbol: 'IXIC', price: '15,011.35', change: '+1.12', volume: '$1.8T', up: true },
          { name: 'DOW JONES', symbol: 'DJI', price: '37,248.35', change: '+0.43', volume: '$1.5T', up: true },
          { name: 'FTSE 100', symbol: 'FTSE', price: '7,512.45', change: '-0.21', volume: '$890B', up: false },
          { name: 'DAX', symbol: 'GDAXI', price: '16,742.89', change: '+0.67', volume: '$720B', up: true },
          { name: 'NIKKEI 225', symbol: 'N225', price: '33,464.17', change: '+1.23', volume: '$650B', up: true }
        ];
        
        setMarketData(cryptoData);
        setGlobalStats(globalData.data);
        setForexData(processedForex);
        setStockIndices(indices);
        
        const charts = {};
        cryptoData.forEach(coin => {
          if (coin.sparkline_in_7d && coin.sparkline_in_7d.price) {
            charts[coin.id] = coin.sparkline_in_7d.price.map((price, index) => ({
              time: index,
              price: price
            }));
          }
        });
        setChartData(charts);
        
        const globalChartData = Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          crypto: 2.3 + Math.sin(i / 3) * 0.2 + Math.random() * 0.1,
          stocks: 95 + Math.cos(i / 4) * 3 + Math.random() * 2,
          forex: 7.2 + Math.sin(i / 5) * 0.5 + Math.random() * 0.3
        }));
        setGlobalChart(globalChartData);
        
        // Generate intraday chart
        const intraday = generateIntradayData();
        setIntradayChart(intraday);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(6)}`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    return `$${volume.toLocaleString()}`;
  };

  const formatMarketCap = (cap) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const stats = globalStats ? [
    { 
      label: "Crypto Market Cap", 
      value: formatMarketCap(globalStats.total_market_cap?.usd || 0), 
      change: "+12.5%" 
    },
    { 
      label: "24h Volume", 
      value: formatVolume(globalStats.total_volume?.usd || 0), 
      change: "+8.2%" 
    },
    { 
      label: "Active Markets", 
      value: globalStats.active_cryptocurrencies?.toLocaleString() || "20K+", 
      change: "+15" 
    },
    { 
      label: "BTC Dominance", 
      value: `${globalStats.market_cap_percentage?.btc?.toFixed(1) || "0"}%`, 
      change: "+2.1%" 
    }
  ] : [
    { label: "24h Volume", value: "$2.4B", change: "+12.5%" },
    { label: "Active Traders", value: "500K+", change: "+8.2%" },
    { label: "Markets", value: "350+", change: "+15" },
    { label: "Avg. Speed", value: "8ms", change: "-2ms" }
  ];

  const features = [
    { title: "Advanced Order Types", desc: "Market, limit, stop-loss, trailing stop, and iceberg orders with millisecond execution", icon: "⚙️", tag: "TRADING" },
    { title: "Margin Trading", desc: "Up to 100x leverage on selected pairs with isolated and cross margin modes", icon: "📈", tag: "LEVERAGE" },
    { title: "Algorithmic Trading", desc: "RESTful & WebSocket APIs, FIX protocol, and co-location services for HFT", icon: "🤖", tag: "API" },
    { title: "Institutional Grade", desc: "Cold storage, multi-sig wallets, insurance fund, and SOC 2 Type II certified", icon: "🔒", tag: "SECURITY" },
    { title: "Advanced Analytics", desc: "TradingView charts, order flow analysis, market depth visualization, heatmaps", icon: "📊", tag: "ANALYSIS" },
    { title: "Global Liquidity", desc: "Aggregated order books from 50+ exchanges for best execution prices", icon: "🌐", tag: "LIQUIDITY" }
  ];

  const platforms = [
    { name: "Web Terminal", desc: "Full-featured browser-based platform", icon: "💻" },
    { name: "Desktop Pro", desc: "Windows, macOS, Linux applications", icon: "🖥️" },
    { name: "Mobile Apps", desc: "iOS & Android with biometric auth", icon: "📱" },
    { name: "API Suite", desc: "REST, WebSocket, FIX protocols", icon: "⚡" }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-price">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  const IntradayTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="intraday-tooltip">
          <p className="tooltip-time">{payload[0].payload.time}</p>
          <p className="tooltip-price">${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      );
    }
    return null;
  };

  const GlobalMarketTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="global-tooltip">
          <p className="tooltip-time">{payload[0].payload.hour}</p>
          <p className="tooltip-crypto">Crypto: ${payload[0].value.toFixed(2)}T</p>
          <p className="tooltip-stocks">Stocks: ${payload[1].value.toFixed(2)}T</p>
          <p className="tooltip-forex">Forex: ${payload[2].value.toFixed(2)}T</p>
        </div>
      );
    }
    return null;
  };

  const currentPrice = intradayChart.length > 0 ? intradayChart[intradayChart.length - 1].price : 25232.50;
  const openPrice = intradayChart.length > 0 ? intradayChart[0].price : 25550.00;
  const priceChange = currentPrice - openPrice;
  const priceChangePercent = ((priceChange / openPrice) * 100).toFixed(2);

  return (
    <div className="home-container">
      {/* Animated Background Grid */}
      <div className="grid-background"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="hero-section" ref={heroRef} style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="hero-content">
          <div className="hero-badge animate-in">
            <span className="badge-pulse"></span>
            INSTITUTIONAL GRADE TRADING
          </div>
          <h1 className="hero-title animate-in delay-1">
            Trade With <span className="gradient-text">Precision</span>.<br />
            Execute With <span className="gradient-text-alt">Speed</span>.
          </h1>
          <p className="hero-subtitle animate-in delay-2">
            Professional trading infrastructure trusted by institutions and retail traders worldwide. 
            Sub-10ms execution, 350+ markets, and institutional-grade security.
          </p>
          <div className="hero-buttons animate-in delay-3">
            <button className="btn-primary glow-effect">
              <span>Open Account</span>
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-secondary glass-effect">
              <span>Explore Platform</span>
            </button>
          </div>
          <div className="hero-stats animate-in delay-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="hero-stat-item" style={{ animationDelay: `${0.8 + idx * 0.1}s` }}>
                <div className="stat-glow"></div>
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
                <div className={`hero-stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrolling Ticker */}
      <div className="market-ticker">
        <div className="ticker-content">
          {[...marketData, ...marketData].map((coin, idx) => (
            <div key={idx} className="ticker-item">
              <span className="ticker-symbol">{coin.symbol?.toUpperCase()}</span>
              <span className="ticker-price">{formatPrice(coin.current_price)}</span>
              <span className={`ticker-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Intraday Chart Section */}
      <div className="intraday-chart-section">
        <div className="section-header-center">
          <span className="section-label pulse-label">LIVE TRADING</span>
          <h2 className="section-title-large">Real-Time Market Data</h2>
          <p className="section-subtitle">
            Intraday price movements with professional charting tools
          </p>
        </div>
        <div className="intraday-chart-container glass-morphism">
          <div className="chart-header">
            <div className="chart-info">
              <h3 className="chart-title">S&P 500 Index</h3>
              <div className="price-info">
                <span className="current-price">{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent}%)
                </span>
              </div>
            </div>
            <div className="time-range-selector">
              {['1D', '1M', '3M', '1Y', '5Y', 'All'].map(range => (
                <button 
                  key={range}
                  className={`range-btn ${timeRange === range ? 'active' : ''}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          {!loading && intradayChart.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={intradayChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="intradayGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={priceChange >= 0 ? "#00ff88" : "#ff3366"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={priceChange >= 0 ? "#00ff88" : "#ff3366"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  stroke="#484f58"
                  style={{ fontSize: '0.85rem', fontFamily: 'Space Mono, monospace' }}
                  interval="preserveStartEnd"
                  tickFormatter={(value, index) => {
                    if (index % 24 === 0) return value;
                    return '';
                  }}
                />
                <YAxis 
                  stroke="#484f58"
                  style={{ fontSize: '0.85rem', fontFamily: 'Space Mono, monospace' }}
                  domain={['dataMin - 50', 'dataMax + 50']}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip content={<IntradayTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={priceChange >= 0 ? "#00ff88" : "#ff3366"}
                  strokeWidth={2}
                  fill="url(#intradayGradient)"
                  dot={false}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          <div className="chart-controls">
            <button className="chart-control-btn"><span>〈〉</span></button>
            <button className="chart-control-btn"><span>✉</span></button>
            <button className="chart-control-btn"><span>⚙</span></button>
            <button className="chart-control-btn"><span>⛶</span></button>
          </div>
        </div>
      </div>

      {/* Global Market Overview Chart */}
      <div className="global-chart-section">
        <div className="section-header-center">
          <span className="section-label pulse-label">GLOBAL MARKETS</span>
          <h2 className="section-title-large">Worldwide Market Overview</h2>
          <p className="section-subtitle">
            Real-time data from cryptocurrency, stock markets, and foreign exchange across the globe
          </p>
        </div>
        <div className="global-chart-container glass-morphism">
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot crypto pulse"></div>
              <span>Cryptocurrency Market Cap (Trillions)</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot stocks pulse"></div>
              <span>Global Stock Markets (Trillions)</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot forex pulse"></div>
              <span>Forex Trading Volume (Trillions)</span>
            </div>
          </div>
          {!loading && globalChart.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={globalChart}>
                <defs>
                  <linearGradient id="cryptoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="stocksGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="forexGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffa500" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffa500" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" stroke="#484f58" style={{ fontSize: '0.85rem' }} />
                <YAxis stroke="#484f58" style={{ fontSize: '0.85rem' }} />
                <Tooltip content={<GlobalMarketTooltip />} />
                <Line type="monotone" dataKey="crypto" stroke="#00ff88" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="stocks" stroke="#00d4ff" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="forex" stroke="#ffa500" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Cryptocurrency Markets */}
      <div className="markets-section">
        <div className="section-header">
          <h2 className="section-title">Cryptocurrency Markets</h2>
          <button className="view-all-btn glow-on-hover">
            {loading ? "Loading..." : "View All Crypto →"}
          </button>
        </div>
        <div className="markets-grid">
          {loading ? (
            <div className="loading-message">
              <div className="loader"></div>
              Loading real-time cryptocurrency data...
            </div>
          ) : (
            marketData.map((coin, idx) => (
              <div 
                key={idx} 
                className={`market-card hover-lift ${activeCard === `crypto-${idx}` ? 'active' : ''}`}
                onMouseEnter={() => setActiveCard(`crypto-${idx}`)}
                onMouseLeave={() => setActiveCard(null)}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="card-shine"></div>
                <div className="market-header">
                  <div className="market-pair-container">
                    {coin.image && <img src={coin.image} alt={coin.name} className="coin-icon spin-on-hover" />}
                    <span className="market-pair">{coin.symbol.toUpperCase()}/USDT</span>
                  </div>
                  <span className={`market-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>
                <div className="market-price">{formatPrice(coin.current_price)}</div>
                <div className="market-volume">Vol: {formatVolume(coin.total_volume)}</div>
                <div className="market-chart">
                  {chartData[coin.id] && chartData[coin.id].length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData[coin.id]}>
                        <defs>
                          <linearGradient id={`gradient-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={coin.price_change_percentage_24h >= 0 ? "#00ff88" : "#ff3366"} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={coin.price_change_percentage_24h >= 0 ? "#00ff88" : "#ff3366"} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="price" stroke={coin.price_change_percentage_24h >= 0 ? "#00ff88" : "#ff3366"} strokeWidth={2} fill={`url(#gradient-${coin.id})`} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stock Indices */}
      <div className="stocks-section">
        <div className="section-header">
          <h2 className="section-title">Global Stock Indices</h2>
          <button className="view-all-btn glow-on-hover">View All Indices →</button>
        </div>
        <div className="markets-grid">
          {stockIndices.map((stock, idx) => (
            <div 
              key={idx} 
              className="market-card hover-lift"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="card-shine"></div>
              <div className="market-header">
                <div className="market-pair-container">
                  <span className="stock-symbol">{stock.symbol}</span>
                  <span className="market-pair">{stock.name}</span>
                </div>
                <span className={`market-change ${stock.up ? 'positive' : 'negative'}`}>
                  {stock.change}%
                </span>
              </div>
              <div className="market-price">{stock.price}</div>
              <div className="market-volume">Market Cap: {stock.volume}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Forex Section */}
      <div className="forex-section">
        <div className="section-header">
          <h2 className="section-title">Foreign Exchange (Forex)</h2>
          <button className="view-all-btn glow-on-hover">View All Pairs →</button>
        </div>
        <div className="markets-grid">
          {forexData.map((forex, idx) => (
            <div 
              key={idx} 
              className="market-card hover-lift"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="card-shine"></div>
              <div className="market-header">
                <span className="market-pair">{forex.pair}</span>
                <span className={`market-change ${parseFloat(forex.change) >= 0 ? 'positive' : 'negative'}`}>
                  {parseFloat(forex.change) >= 0 ? '+' : ''}{forex.change}%
                </span>
              </div>
              <div className="market-price">{forex.rate.toFixed(4)}</div>
              <div className="market-volume">Daily Vol: {forex.volume}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Features */}
      <div className="features-section">
        <div className="section-header-center">
          <span className="section-label pulse-label">POWERFUL FEATURES</span>
          <h2 className="section-title-large">Built For Professional Traders</h2>
          <p className="section-subtitle">Industry-leading tools and technology designed for serious trading</p>
        </div>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="feature-card hover-lift"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="feature-glow"></div>
              <div className="feature-tag">{feature.tag}</div>
              <div className="feature-icon bounce-on-hover">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Platforms */}
      <div className="platforms-section">
        <div className="section-header-center">
          <span className="section-label pulse-label">MULTI-PLATFORM</span>
          <h2 className="section-title-large">Trade Anywhere, Anytime</h2>
        </div>
        <div className="platforms-grid">
          {platforms.map((platform, idx) => (
            <div 
              key={idx} 
              className="platform-card hover-lift"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="platform-icon-large bounce-on-hover">{platform.icon}</div>
              <h3 className="platform-name">{platform.name}</h3>
              <p className="platform-desc">{platform.desc}</p>
              <button className="platform-btn glow-effect">Download</button>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="cta-section">
        <div className="cta-glow"></div>
        <div className="cta-content">
          <h2 className="cta-title">Start Trading Today</h2>
          <p className="cta-subtitle">
            Join 500,000+ traders who choose us for professional-grade trading infrastructure
          </p>
          <div className="cta-buttons">
            <button className="btn-cta-primary glow-effect">
              Create Account
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-cta-secondary glass-effect">Schedule Demo</button>
          </div>
          <div className="cta-features">
            <div className="cta-feature-item">
              <span className="cta-check">✓</span> No hidden fees
            </div>
            <div className="cta-feature-item">
              <span className="cta-check">✓</span> 24/7 support
            </div>
            <div className="cta-feature-item">
              <span className="cta-check">✓</span> Instant deposits
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;