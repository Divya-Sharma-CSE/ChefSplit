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

      <img src="images\lemons.png" className="lemon lemon-right"/>
    </header>
  );
}

export default Header;