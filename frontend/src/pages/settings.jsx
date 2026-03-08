import React, { useState } from "react";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";



function Settings() {
  const [budget, setBudget] = useState("");
  const [limits, setLimits] = useState({
    food: "",
    transport: "",
    groceries: "",
    shopping: "",
    subscriptions: "",
    misc: ""
  });

  const handleChange = (category, value) => {
    setLimits({ ...limits, [category]: value });
  };

  return (
    <div className="settings-page">
      <Header />
      <Sidebar/>
      

        <div className="settings-container">

        {/* Settings Header */}
        <div className="settings-header">
          <h1>Settings</h1>
          <img src="/images/bear.png" alt="bear chef"/>
        </div>
        
        {/* Settings Card */}
        <div className="settings-card">
          <label className="budget-label">Set Budget:</label>
          <input
            type="number"
            className="budget-input"
            value={budget}
            onChange={(e)=>setBudget(e.target.value)}
          />

          <h3>Set Category Limits:</h3>

          {Object.keys(limits).map((cat) => (
            <div className="category" key={cat}>
              <label>
                {cat === "food" && "🍜 Food :"}
                {cat === "transport" && "✈️ Transport :"}
                {cat === "groceries" && "🛒 Groceries :"}
                {cat === "shopping" && "🛍 Shopping :"}
                {cat === "subscriptions" && "🎬 Subscriptions :"}
                {cat === "misc" && "🔄 Miscellaneous :"}
              </label>
              <input
                type="number"
                value={limits[cat]}
                onChange={(e)=>handleChange(cat, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Decorative Fruits */}
    
        </div>
      
        <img src="/images/lemons.png" className="lemon lemon-left" />
        <img src="/images/berries.png" className="berries"/>
        <img src="/images/peach.png" className="peach"></img>
        <img src="/images/fruit.png" className="fruit1"/>
        <img src="/images/fruit.png" className="fruit2"/>
    </div>
    
  );
}

export default Settings;