import React, { useEffect, useState } from "react";
import { getBalance, getExpenses, addExpense, deleteExpense } from "../api.js";
import { useToast } from "../components/toast.jsx";
import AddExpenseModal from "../components/AddExpenseModal.jsx";
import ExpenseItem from "../components/ExpenseItem.jsx";

const CATEGORY_ICONS = {
  Food: "🍜", Grocery: "🛒", Transport: "🚗", Health: "💊",
  Entertainment: "🎬", Shopping: "🛍️", Utilities: "💡", Other: "📌",
};

const CAT_COLORS = {
  Food: "#e8a87c", Grocery: "#7dc87d", Transport: "#7db8e8",
  Health: "#e87db8", Entertainment: "#b87de8", Shopping: "#e8d87d", Utilities: "#7de8d8", Other: "#b0b8b0",
};

function Home() {
  const [balance, setBalance] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = async () => {
    try {
      const [b, ex] = await Promise.all([getBalance(), getExpenses()]);
      setBalance(b);
      setExpenses(ex.slice(0, 5)); // Only last 5 on dashboard
    } catch {
      toast("Could not connect to backend. Is the server running?", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (data) => {
    try {
      const result = await addExpense(data);
      toast(`Added ₹${data.amount} for ${data.name}`, "success");
      setShowModal(false);
      load();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      toast("Expense deleted", "info");
      load();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const spent = balance?.monthlyExpenses ?? 0;
  const income = balance?.income ?? 0;
  const current = balance?.current ?? 0;
  const spentPct = income > 0 ? Math.min((spent / income) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <div style={{ textAlign: "center", opacity: 0.5 }}>
          <div className="progress-ring" style={{ margin: "0 auto 16px" }} />
          <p className="ocr-status-text">Connecting to server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your financial overview at a glance</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} id="add-expense-btn">
          + Add Expense
        </button>
      </div>

      {/* Balance Card */}
      <div className="balance-card" style={{ marginBottom: 20 }}>
        <div className="balance-label">Current Balance</div>
        <div className="balance-amount">
          ₹ {current.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>

        {/* Progress bar */}
        <div style={{ margin: "8px 0 16px" }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, height: 6 }}>
            <div style={{
              width: `${spentPct}%`,
              height: "100%",
              borderRadius: 10,
              background: spentPct > 80 ? "#ffb3b3" : "rgba(255,255,255,0.7)",
              transition: "width 0.5s ease",
            }} />
          </div>
          <span style={{ fontSize: 11, opacity: 0.7, fontFamily: "Cormorant SC", letterSpacing: 1 }}>
            {spentPct.toFixed(0)}% of monthly income spent
          </span>
        </div>

        <div className="balance-stats">
          <div className="balance-stat">
            <span className="balance-stat-label">Monthly Income</span>
            <span className="balance-stat-value income">
              ₹ {income.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="balance-stat">
            <span className="balance-stat-label">Spent This Month</span>
            <span className="balance-stat-value spent">
              ₹ {spent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="balance-stat">
            <span className="balance-stat-label">Total Transactions</span>
            <span className="balance-stat-value" style={{ color: "rgba(255,255,255,0.85)" }}>
              {expenses.length}+
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Recent Transactions */}
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-title">Recent Transactions</div>
          {expenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🌿</div>
              <p className="empty-state-text">No expenses yet</p>
              <p className="empty-state-sub">Click "Add Expense" or scan a receipt to get started</p>
            </div>
          ) : (
            <div className="expense-list">
              {expenses.map((exp) => (
                <ExpenseItem
                  key={exp.id}
                  expense={exp}
                  onDelete={handleDelete}
                  categoryIcons={CATEGORY_ICONS}
                  catColors={CAT_COLORS}
                />
              ))}
            </div>
          )}
          {expenses.length >= 5 && (
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <a href="/expenses" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>
                View All Transactions →
              </a>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-title">Quick Stats</div>
          {expenses.length === 0 ? (
            <p style={{ color: "var(--text-soft)", fontFamily: "Cormorant SC", fontSize: 15 }}>Add expenses to see stats</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Highest Expense", value: `₹${Math.max(...expenses.map(e => e.amount)).toLocaleString("en-IN")}`, color: "#e87070" },
                { label: "Average Expense", value: `₹${(expenses.reduce((s, e) => s + e.amount, 0) / expenses.length).toFixed(2)}`, color: "var(--sage)" },
                { label: "Recent Expenses Shown", value: expenses.length, color: "var(--amber)" },
              ].map((stat) => (
                <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "Cormorant SC", fontSize: 15, color: "var(--text-mid)" }}>{stat.label}</span>
                  <span style={{ fontFamily: "Cormorant SC", fontSize: 19, fontWeight: 700, color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ justifyContent: "center" }}>
              ✏️ Add Expense Manually
            </button>
            <a href="/scan" className="btn btn-secondary" style={{ justifyContent: "center", textDecoration: "none" }}>
              📷 Scan a Receipt
            </a>
            <a href="/analytics" className="btn btn-secondary" style={{ justifyContent: "center", textDecoration: "none" }}>
              📊 View Analytics
            </a>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => setShowModal(true)} title="Add Expense" id="fab-add">
        +
      </button>

      {/* Modal */}
      {showModal && (
        <AddExpenseModal onClose={() => setShowModal(false)} onSubmit={handleAdd} />
      )}
    </div>
  );
}

export default Home;