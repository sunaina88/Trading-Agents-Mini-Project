import React, { useState, useEffect } from 'react';
import './Products.css';

function Products() {
  const [selectedStock, setSelectedStock] = useState('BAJFINANCE');
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock stock data - in production, this would come from a real API
  const stocks = {
    'BAJFINANCE': {
      name: 'Bajaj Finance Limited',
      symbol: 'BAJFINANCE',
      exchange: 'NSE',
      price: 933.20,
      change: -36.25,
      changePercent: -3.74,
      high: 969.35,
      low: 921.50,
      open: 969.35,
      volume: '10.38M',
      marketCap: '6.04T',
      avgVolume: '6.16M',
      sector: 'Finance - Financial/Rental/Leasing'
    },
    'NIFTY': {
      name: 'Nifty 50',
      symbol: 'NIFTY',
      exchange: 'NSE',
      price: 25232.50,
      change: -363.00,
      changePercent: -1.38,
      high: 25595.35,
      low: 25180.00,
      open: 25595.35,
      volume: '845.2M',
      marketCap: 'N/A',
      avgVolume: '892.5M',
      sector: 'Index'
    },
    'BANK': {
      name: 'Bank Nifty',
      symbol: 'BANK',
      exchange: 'NSE',
      price: 59404.20,
      change: -487.15,
      changePercent: -0.81,
      high: 59891.35,
      low: 59250.00,
      open: 59891.35,
      volume: '125.4M',
      marketCap: 'N/A',
      avgVolume: '138.2M',
      sector: 'Index'
    },
    'SEN': {
      name: 'Sensex',
      symbol: 'SEN',
      exchange: 'BSE',
      price: 82180.47,
      change: -1065.71,
      changePercent: -1.28,
      high: 83246.18,
      low: 81990.00,
      open: 83246.18,
      volume: '456.8M',
      marketCap: 'N/A',
      avgVolume: '485.3M',
      sector: 'Index'
    },
    'CNGTI': {
      name: 'CNGTI Limited',
      symbol: 'CNGTI',
      exchange: 'NSE',
      price: 38101.05,
      change: -801.45,
      changePercent: -2.06,
      high: 38902.50,
      low: 37950.00,
      open: 38902.50,
      volume: '2.45M',
      marketCap: '1.82T',
      avgVolume: '2.89M',
      sector: 'Technology'
    },
    'SPX': {
      name: 'S&P 500',
      symbol: 'SPX',
      exchange: 'NYSE',
      price: 6940.01,
      change: -4.46,
      changePercent: -0.06,
      high: 6944.47,
      low: 6935.55,
      open: 6944.47,
      volume: '3.2B',
      marketCap: 'N/A',
      avgVolume: '3.5B',
      sector: 'Index'
    },
    'RELIA': {
      name: 'Reliance Industries',
      symbol: 'RELIA',
      exchange: 'NSE',
      price: 1394.00,
      change: -19.60,
      changePercent: -1.39,
      high: 1413.60,
      low: 1388.50,
      open: 1413.60,
      volume: '18.5M',
      marketCap: '9.42T',
      avgVolume: '21.3M',
      sector: 'Energy - Oil & Gas'
    },
    'AXISB': {
      name: 'Axis Bank',
      symbol: 'AXISB',
      exchange: 'NSE',
      price: 1293.50,
      change: -14.00,
      changePercent: -1.07,
      high: 1307.50,
      low: 1287.25,
      open: 1307.50,
      volume: '12.8M',
      marketCap: '4.12T',
      avgVolume: '14.6M',
      sector: 'Finance - Banking'
    },
    'HDFC': {
      name: 'HDFC Bank',
      symbol: 'HDFC',
      exchange: 'NSE',
      price: 931.20,
      change: 3.30,
      changePercent: 0.36,
      high: 935.50,
      low: 925.80,
      open: 927.90,
      volume: '25.3M',
      marketCap: '7.85T',
      avgVolume: '28.9M',
      sector: 'Finance - Banking'
    },
    'ICICIE': {
      name: 'ICICI Bank',
      symbol: 'ICICIE',
      exchange: 'NSE',
      price: 1375.80,
      change: -4.80,
      changePercent: -0.35,
      high: 1380.60,
      low: 1370.50,
      open: 1380.60,
      volume: '15.7M',
      marketCap: '9.68T',
      avgVolume: '17.2M',
      sector: 'Finance - Banking'
    }
  };

  useEffect(() => {
    setStockData(stocks[selectedStock]);
  }, [selectedStock]);

  const handleStockClick = (symbol) => {
    setLoading(true);
    setSelectedStock(symbol);
    setTimeout(() => setLoading(false), 300);
  };

  const currentData = stockData || stocks['BAJFINANCE'];

  return (
    <div className="products-container">
      <div className="main-content">
        <div className="chart-header">
          <div className="stock-info">
            <h1 className="stock-symbol">{currentData.symbol}</h1>
            <span className="stock-exchange">{currentData.exchange}</span>
          </div>
          <div className="stock-price-info">
            <div className="current-price">{currentData.price?.toFixed(2)}</div>
            <div className={`price-change ${currentData.change >= 0 ? 'positive' : 'negative'}`}>
              {currentData.change >= 0 ? '+' : ''}{currentData.change?.toFixed(2)} ({currentData.changePercent >= 0 ? '+' : ''}{currentData.changePercent?.toFixed(2)}%)
            </div>
          </div>
        </div>

        <div className="chart-placeholder">
          <div className="chart-info">
            <p className="stock-name">{currentData.name}</p>
            <p className="stock-sector">{currentData.sector}</p>
          </div>
          <div className="price-bars">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i} 
                className="price-bar"
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  backgroundColor: Math.random() > 0.5 ? '#26a69a' : '#ef5350'
                }}
              />
            ))}
          </div>
        </div>

        <div className="stock-details">
          <div className="detail-row">
            <span className="detail-label">Open</span>
            <span className="detail-value">{currentData.open?.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">High</span>
            <span className="detail-value">{currentData.high?.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Low</span>
            <span className="detail-value">{currentData.low?.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Volume</span>
            <span className="detail-value">{currentData.volume}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Market Cap</span>
            <span className="detail-value">{currentData.marketCap}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Avg Volume (30D)</span>
            <span className="detail-value">{currentData.avgVolume}</span>
          </div>
        </div>
      </div>

      <div className="watchlist-sidebar">
        <h2 className="watchlist-title">Watchlist</h2>
        <div className="stocks-list">
          <div className="list-section">
            <h3 className="section-title">STOCKS</h3>
            {['NIFTY', 'BANK', 'SEN', 'CNGTI', 'SPX'].map((symbol) => {
              const stock = stocks[symbol];
              return (
                <div 
                  key={symbol}
                  className={`stock-item ${selectedStock === symbol ? 'active' : ''}`}
                  onClick={() => handleStockClick(symbol)}
                >
                  <div className="stock-item-info">
                    <span className="stock-item-symbol">{stock.symbol}</span>
                    <span className="stock-item-price">{stock.price?.toFixed(2)}</span>
                  </div>
                  <div className="stock-item-change">
                    <span className={stock.change >= 0 ? 'positive' : 'negative'}>
                      {stock.change?.toFixed(2)}
                    </span>
                    <span className={stock.change >= 0 ? 'positive' : 'negative'}>
                      {stock.changePercent?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="list-section">
            <h3 className="section-title">FUTURES</h3>
            {['RELIA', 'AXISB', 'HDFC', 'ICICIE', 'BAJFINANCE'].map((symbol) => {
              const stock = stocks[symbol];
              return (
                <div 
                  key={symbol}
                  className={`stock-item ${selectedStock === symbol ? 'active' : ''}`}
                  onClick={() => handleStockClick(symbol)}
                >
                  <div className="stock-item-info">
                    <span className="stock-item-symbol">{stock.symbol}</span>
                    <span className="stock-item-price">{stock.price?.toFixed(2)}</span>
                  </div>
                  <div className="stock-item-change">
                    <span className={stock.change >= 0 ? 'positive' : 'negative'}>
                      {stock.change?.toFixed(2)}
                    </span>
                    <span className={stock.change >= 0 ? 'positive' : 'negative'}>
                      {stock.changePercent?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stock-detail-panel">
          <div className="detail-header">
            <h3>{currentData.symbol}</h3>
            <span className="detail-price">
              {currentData.price?.toFixed(2)} <span className={currentData.change >= 0 ? 'positive' : 'negative'}>
                {currentData.change?.toFixed(2)} {currentData.changePercent?.toFixed(2)}%
              </span>
            </span>
          </div>
          <div className="detail-info">
            <p className="market-status">Market closed</p>
            <div className="key-stats">
              <h4>Key stats</h4>
              <div className="stat-row">
                <span>Next earnings report</span>
                <span>In 14 days</span>
              </div>
              <div className="stat-row">
                <span>Volume</span>
                <span>{currentData.volume}</span>
              </div>
              <div className="stat-row">
                <span>Average Volume (30D)</span>
                <span>{currentData.avgVolume}</span>
              </div>
              <div className="stat-row">
                <span>Market capitalization</span>
                <span>{currentData.marketCap}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;