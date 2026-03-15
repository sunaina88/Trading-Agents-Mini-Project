import { useState } from "react";
import "./Markets.css";

function Markets() {
  const [selectedCountry, setSelectedCountry] = useState("india");

  return (
    <div className="markets-container">
      <div className="markets-header">
        <h1 className="markets-title">Markets</h1>

        <div className="dropdown-wrapper">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="country-dropdown"
          >
            <option value="INDIA">India</option>
            <option value="USA">USA</option>
            <option value="CHINA">China</option>
            <option value="RUSSIA">Russia</option>
            <option value="UAE">UAE</option>
          </select>
        </div>
      </div>

      <div className="selected-country">
        Selected: {selectedCountry.toUpperCase()}
      </div>
    </div>
  );
}

export default Markets;
