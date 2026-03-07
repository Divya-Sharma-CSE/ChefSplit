import React, { useState, useEffect } from "react";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";
import ActionButtons from "../components/actionButtons.jsx";
import ExpensePieChart from "../components/ExpensePieChart.jsx";

function Home() {
  const initialExpenses = [
    { category: "Food", amount: 250 },
    { category: "Travel", amount: 100 },
    { category: "Entertainment", amount: 150 },
  ];

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    const category = prompt("Enter category:");
    const amount = parseFloat(prompt("Enter amount:"));
    if (!category || isNaN(amount)) return alert("Invalid input!");
    setExpenses([...expenses, { category, amount }]);
  };

  return (
    <div className="container">
      <Header />
      <Sidebar />

      <main className="main">
        <ActionButtons />

        <img src="/images/lemons.png" className="lemon lemon-left" />
        <img src="/images/peach.png" className="peach" />
      </main>

      {/* Favourites + Wallet */}
      <div className="homeContent">
        <div className="favouritesContainer">
          <p className="favText">Favourite Groups:</p>
          <div className="favourites">
            <div className="fav">Room</div>
            <div className="fav">PRP209</div>
          </div>

          <p className="favText">Pinned Contacts:</p>
          <div className="favourites">
            <div className="fav">Dora</div>
            <div className="fav">Shinchan</div>
            <div className="fav">Nobita</div>
            <div className="fav">Minnie M</div>
          </div>
        </div>

        {/* Wallet box */}
        <div className="walletBox">
          <p className="walletTitle">Wallet</p>
          <p className="walletAmount">₹3489</p>
          <hr className="walletDivider" />
            <div className="expenseTracker">
            <ExpensePieChart expenses={expenses} />
            <ul>
                {expenses.map((e, idx) => (
                <li key={idx}>
                    {e.category}: ₹{e.amount}
                </li>
                ))}
            </ul>
            </div>
        </div>

      </div>
    </div>
  );
}

export default Home;