import React, { useEffect, useState } from "react";
import { getBalance } from "../api.js";

function Header() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    getBalance()
      .then((b) => setBalance(b.current))
      .catch(() => {});
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="header">
      <div className="logo">
        <span className="l1">Chef</span>
        <span className="l2">Split</span>
      </div>

      <div className="header-right">
        <span className="header-date">{dateStr}</span>
        {balance !== null && (
          <div className="header-balance-pill">
            ₹ {balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;