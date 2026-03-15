import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

import logo_light  from "../../assets/tradex_dark.png";
import logo_dark   from "../../assets/tradex_white.png";
import search_light from "../../assets/search-b.png";
import search_dark  from "../../assets/search-w.png";
import toggle_light from "../../assets/day.png";
import toggle_dark  from "../../assets/night.png";

function NavBar({ theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img
          src={theme === "light" ? logo_light : logo_dark}
          alt="Logo"
          className="logo"
        />
      </Link>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={menuOpen ? "nav-menu active" : "nav-menu"}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/community">Community</Link></li>
        <li><Link to="/markets">Markets</Link></li>
        <li><Link to="/brokers">Brokers</Link></li>
        <li><Link to="/country">Country</Link></li>   {/* ← NEW */}
        <li><Link to="/more">More</Link></li>
      </ul>

      <div className="search-box">
        <input type="text" placeholder="Search" />
        <img
          src={theme === "light" ? search_light : search_dark}
          alt="search"
        />
      </div>

      <img
        onClick={toggleMode}
        src={theme === "light" ? toggle_dark : toggle_light}
        alt="toggle"
        className="toggle-icon"
      />
    </div>
  );
}

export default NavBar;