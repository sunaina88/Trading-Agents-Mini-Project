import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./COMPONENTS/NAVBR/NavBar";

import Home from "./Home";
import Products from "./Products";
import Community from "./Community";
import Markets from "./Markets";
import Brokers from "./Brokers";
import More from "./More";
import Country from "./Country";   // ← NEW

const App = () => {
  const current_theme = localStorage.getItem("current_theme");
  const [theme, setTheme] = useState(current_theme || "light");

  useEffect(() => {
    localStorage.setItem("current_theme", theme);
  }, [theme]);

  return (
    <Router>
      <div className={`container ${theme}`}>
        <NavBar theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/products"  element={<Products />} />
          <Route path="/community" element={<Community />} />
          <Route path="/markets"   element={<Markets />} />
          <Route path="/brokers"   element={<Brokers />} />
          <Route path="/more"      element={<More />} />
          <Route path="/country"   element={<Country />} />  {/* ← NEW */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;