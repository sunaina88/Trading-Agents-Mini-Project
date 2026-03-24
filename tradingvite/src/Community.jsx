import React, { useState } from "react";
import { Search, TrendingUp, Users } from "lucide-react";
import "./Community.css";

function Community() {
  const [activeTab, setActiveTab] = useState("Popular");
  
  const ideas = [
    {
      id: 1,
      title: "Gold Trapped in Liquidity Range - Expansion Pending",
      author: "TradingView_User1",
      description: "Gold's currently trading in a tight liquidity distribution zone incorporating a demand and supply consolidation phase. The price action has consolidated into a controlled consolidation driver by...",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
      comments: 4,
      likes: 9,
      category: "Analysis"
    },
    {
      id: 2,
      title: "NASDAQ (Indian Banks)",
      author: "TradingView_User2",
      description: "Indian Bank is showing concentrated gains. The stock rebounds off a previous volume point of control, following its stability podcast, which is a positive sign and what helps in building a stronger...",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop",
      comments: 1,
      likes: 2,
      category: "Analysis"
    },
    {
      id: 3,
      title: "Buy Doom, Yel of Primary degree completion",
      author: "TradingView_User3",
      description: "The chart illustrates a Buy of DOMUSDT on a 7 Day 12 candle chart line has been an upward trend since early December. The analytic suggests we are forming Elliott...",
      image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=250&fit=crop",
      comments: 1,
      likes: 3,
      category: "Idea"
    },
    {
      id: 4,
      title: "Bank of India",
      author: "TradingView_User4",
      description: "I have analyzed this Bank of India and it seems like is in bullish trend. has completed the flag and pole pattern where where bears have lost the battle. My take is...",
      image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=400&h=250&fit=crop",
      comments: 1,
      likes: 2,
      category: "Analysis"
    },
    {
      id: 5,
      title: "NASDAQ in bubble territory blowing in the short, buy signals in technical...",
      author: "TradingView_User5",
      description: "NASDAQ in bubble territory blowing in the short, buy signals in technical indicators still prevailing. Overall chart pattern - double Wedel. AND-AND breakouts with consolidation and...",
      image: "https://images.unsplash.com/photo-1638913971251-744c0370f265?w=400&h=250&fit=crop",
      comments: 0,
      likes: 2,
      category: "Analysis"
    },
    {
      id: 6,
      title: "GREENPANEL - A classic Technical Setup",
      author: "TradingView_User6",
      description: "The price reached the 786% zone in the opening and fell towards 2550s in the afternoon. Above 2650 again. This movement has occurred within a specific MA corridor. The unwise has also not give...",
      image: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?w=400&h=250&fit=crop",
      comments: 3,
      likes: 5,
      category: "Technical"
    },
    {
      id: 7,
      title: "Potential Action: Update Clean Breakout, with Clear Target",
      author: "TradingView_User7",
      description: "The NASDAQ broken resistance zone by breaking a parallel controlling a down-pattern correction zone. The breakout is clean with no overlaps after...",
      image: "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=400&h=250&fit=crop",
      comments: 1,
      likes: 4,
      category: "Breakout"
    },
    {
      id: 8,
      title: "Another Action",
      author: "TradingView_User8",
      description: "NASDAQ rally is Analysis — Just highlighted position. It saw this is East direction it followed above breakout line then, we can enter for targets chalk 16040 and then 16250 for more details to study as...",
      image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&h=250&fit=crop",
      comments: 0,
      likes: 14,
      category: "Analysis"
    },
    {
      id: 9,
      title: "#ELLIANCE: may Read for 1111",
      author: "TradingView_User9",
      description: "#ELLIANCE is forming a brief 3-5-3-3-5 and should head for 1111. Analysis in 15m and daily and done years. In simple mode if you can see from last wave already 5 wave is generated so ELLIANCE is done...",
      image: "https://images.unsplash.com/photo-1640826514546-7d2b63ab00b7?w=400&h=250&fit=crop",
      comments: 3,
      likes: 5,
      category: "Wave"
    },
    {
      id: 10,
      title: "Understanding Long-Term Breakouts in 'No Strength' in Stock Trends",
      author: "TradingView_User10",
      description: "Understanding Long-Term Breakout and No Strength in 'Stock Trends' Blue Donut Blank Of 'Stock AnalysisStyle'. At Long-Term Smoothed bracket...",
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400&h=250&fit=crop",
      comments: 0,
      likes: 4,
      category: "Technical"
    },
    {
      id: 11,
      title: "BTCUSD Bullish Structure: New Demand, Resistance & Signals",
      author: "TradingView_User11",
      description: "BTCUSD shows a continuation of the broader bullish trend after a strong breakout above resistance. Key points feedback and consolidated...",
      image: "https://images.unsplash.com/photo-1622630993619-cec4f0a8b473?w=400&h=250&fit=crop",
      comments: 0,
      likes: 6,
      category: "Crypto"
    },
    {
      id: 12,
      title: "NIFTY: Trading levels and Plan for 20 Jan",
      author: "TradingView_User12",
      description: "NIFTY Trading Plan - As on 20th TradingView. 19 minute Sell- Criteria Explained - 20th Jan'25 Market Structure: Short term extremely phase continues...",
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=250&fit=crop",
      comments: 0,
      likes: 4,
      category: "Plan"
    }
  ];

  return (
    <div className="community-container">
      {/* Header */}
      <div className="community-header">
        <div className="community-header-content">
          <h1 className="community-title">Community ideas</h1>
          
          {/* Tabs */}
          <div className="community-tabs">
            {["Popular", "Editors' picks"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <div className="community-filters">
            <button className="filter-button">
              All ideas
            </button>
            <button className="filter-button">
              <Users size={16} />
              Follow List
            </button>
            <button className="filter-button icon-only">
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="community-content">
        <div className="ideas-grid">
          {ideas.map(idea => (
            <div key={idea.id} className="idea-card">
              {/* Image */}
              <div className="idea-image">
                <img src={idea.image} alt={idea.title} />
                <div className="idea-category">{idea.category}</div>
              </div>

              {/* Content */}
              <div className="idea-content">
                <h3 className="idea-title">{idea.title}</h3>
                
                <p className="idea-description">{idea.description}</p>

                <div className="idea-author">by {idea.author}</div>

                {/* Footer */}
                <div className="idea-footer">
                  <div className="idea-stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {idea.comments}
                  </div>
                  <div className="idea-stat">
                    <TrendingUp size={16} />
                    {idea.likes}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Community;