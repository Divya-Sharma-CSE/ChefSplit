import React from "react";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <p className="l1">Chef</p>
        <p className="l2">Split</p>
      </div>

      <img src="images\lemons.png" className="lemon lemon-right"/>
    </header>
  );
}

export default Header;