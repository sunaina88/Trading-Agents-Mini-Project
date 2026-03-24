import React, { useState } from 'react';
import './More.css';

function More() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { id: 'charts', name: 'Charts' },
    { id: 'trading', name: 'Trading' },
    { id: 'data', name: 'Data' },
    { id: 'alerts', name: 'Alerts' },
    { id: 'billing', name: 'Billing' }
  ];

  const mainFeatures = [
    {
      icon: '📚',
      title: 'Knowledge base',
      description: 'Find articles covering everything you need',
      link: '#knowledge'
    },
    {
      icon: '💬',
      title: 'Chat assistant',
      description: 'Get instant help with your questions',
      link: '#chat'
    },
    {
      icon: '📧',
      title: 'Support requests',
      description: 'Manage your queries to our team',
      link: '#support'
    }
  ];

  const exploreLinks = [
    { icon: '🚀', title: 'Getting started', link: '#getting-started' },
    { icon: '⚡', title: "What's new", link: '#whats-new' }
  ];

  const footerSections = {
    products: {
      title: 'MORE THAN A PRODUCT',
      links: [
        'Supercharts',
        'Screeners',
        'Stocks',
        'ETFs',
        'Bonds',
        'Crypto coins',
        'CFX pairs',
        'DEX pairs',
        'Pine'
      ]
    },
    tools: {
      title: 'TOOLS & SUBSCRIPTIONS',
      links: [
        'Features',
        'Pricing',
        'Market data',
        'Gift plans',
        'Overview',
        'Brokers'
      ]
    },
    trading: {
      title: 'TRADING',
      links: [
        'Overview',
        'Brokers'
      ]
    },
    special: {
      title: 'SPECIAL OFFERS',
      links: []
    },
    community: {
      title: 'COMMUNITY',
      links: [
        'Social network',
        'Chat',
        'Refer a friend',
        'House Rules',
        'Moderators',
        'Trading',
        'Education',
        'Editors\' picks'
      ]
    },
    business: {
      title: 'BUSINESS SOLUTIONS',
      links: [
        'Widgets',
        'Charting libraries',
        'Lightweight Charts™',
        'Advanced Charts',
        'Trading Platform',
        'Advertising',
        'Brokerage integration',
        'Partner program'
      ]
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
  };

  return (
    <div className="more-container">
      <div className="help-center-header">
        <h1 className="help-title">Help Center</h1>
        
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Find your answer"
            value={searchQuery}
            onChange={handleSearch}
          />
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="categories-section">
          <p className="categories-title">Popular categories</p>
          <div className="categories-list">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="features-grid">
        {mainFeatures.map((feature, index) => (
          <div key={index} className="feature-card" onClick={() => window.location.href = feature.link}>
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="explore-section">
        <h2 className="explore-title">More to explore</h2>
        <div className="explore-grid">
          {exploreLinks.map((item, index) => (
            <div key={index} className="explore-card" onClick={() => window.location.href = item.link}>
              <div className="explore-content">
                <span className="explore-icon">{item.icon}</span>
                <span className="explore-text">{item.title}</span>
              </div>
              <svg className="arrow-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}
        </div>
      </div>

      <footer className="help-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">
              <span className="logo-icon">📊</span>
              <span className="logo-text">TradingView</span>
            </div>
            <p className="brand-tagline">Look first // Then leap.</p>
            
            <div className="social-links">
              <a href="#" className="social-link">𝕏</a>
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">▶️</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">💼</a>
              <a href="#" className="social-link">📱</a>
              <a href="#" className="social-link">🎵</a>
              <a href="#" className="social-link">💬</a>
            </div>

            <div className="language-selector">
              <button className="language-btn">
                🌐 English (India) ▼
              </button>
            </div>
          </div>

          <div className="footer-links-container">
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key} className="footer-column">
                <h4 className="footer-column-title">{section.title}</h4>
                <ul className="footer-links-list">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <a href="#" className="footer-link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2026 TradingView, Inc.</p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Terms of use</a>
            <a href="#" className="footer-bottom-link">Privacy Policy</a>
            <a href="#" className="footer-bottom-link">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default More;