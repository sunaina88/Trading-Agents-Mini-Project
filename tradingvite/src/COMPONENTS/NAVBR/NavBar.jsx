import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

import logo_light  from "../../assets/tradex_dark.png";
import logo_dark   from "../../assets/tradex_white.png";
import search_light from "../../assets/search-b.png";
import search_dark  from "../../assets/search-w.png";
import toggle_light from "../../assets/day.png";
import toggle_dark  from "../../assets/night.png";

// Nav links defined once — easy to extend
const NAV_LINKS = [
  { to: "/",          label: "Home"      },
  { to: "/products",  label: "Products"  },
  { to: "/community", label: "Community" },
  { to: "/markets",   label: "Markets"   },
  { to: "/brokers",   label: "Brokers"   },
  { to: "/country",   label: "Country"   },
  { to: "/login",     label: "Login"     },
  { to: "/more",      label: "More"      },
];

function NavBar({ theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // FIX: close the mobile menu whenever a link is clicked
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="navbar">
      <Link to="/" onClick={closeMenu}>
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
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            {/* FIX: onClick={closeMenu} closes mobile menu after navigation */}
            <Link to={to} onClick={closeMenu}>{label}</Link>
          </li>
        ))}
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