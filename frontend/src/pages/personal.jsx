import React, { useState, useEffect } from "react";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";

function Personal() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch backend data
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard") // replace with your backend URL
      .then((res) => res.json())
      .then((data) => {
        setWalletBalance(data.walletBalance);
        setTotalBudget(data.totalBudget);
        setCategories(data.categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
        setLoading(false);
      });
  }, []);

  // Calculate totals
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudget - totalSpent;
  const percent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="personal-page">
      <Sidebar />
      <Header />

      <div className="personalContainer">
        {/* Page Header */}
        <div className="personal-header">
          <h1>Personal</h1>
          <img src="/images/bear.png" alt="bear chef" className="bear" />
        </div>

        {/* Top Cards */}
        <div className="top-cards">
          {/* Wallet Balance */}
          <div className="balance-card">
            <div className="badge">March 2026</div>
            <p>Total Balance</p>
            <h1>Rs. {walletBalance.toFixed(2)}</h1>
          </div>

          {/* Monthly Budget */}
          <div className="budget-overview">
            <div className="badge">March 2026</div>

            <div className="budget-numbers">
              <h1>Monthly Budget</h1>
              <p>
                <strong>Rs. {totalSpent}</strong> / Rs. {totalBudget}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            <p className="remaining">
              You have Rs. {remaining} remaining for this month.
            </p>
          </div>
        </div>

        {/* Category Budgets */}
        <div className="category-card">
          <h2>Category Budgets</h2>

          {categories.map((cat, index) => {
            const progress = cat.limit > 0 ? (cat.spent / cat.limit) * 100 : 0;

            return (
              <div key={index} className="category-row">
                <div className="category-info">
                  <span className="icon">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>

                <div className="numbers">
                  Rs. {cat.spent} / Rs. {cat.limit}
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Personal;