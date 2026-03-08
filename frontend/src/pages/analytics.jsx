import React, { useEffect, useState } from "react";
import { getExpenses, getCategories } from "../api.js";
import { useToast } from "../components/toast.jsx";

const CAT_COLORS = [
  "#7D9E80", "#C0D3C4", "#d4a853", "#e87070", "#b87de8",
  "#7db8e8", "#e8a87c", "#7dc87d",
];

const CATEGORY_ICONS = {
  Food: "🍜", Grocery: "🛒", Transport: "🚗", Health: "💊",
  Entertainment: "🎬", Shopping: "🛍️", Utilities: "💡", Other: "📌",
};

function DonutChart({ categories }) {
  const total = categories.reduce((s, c) => s + c.total, 0);
  if (total === 0) return (
    <div className="empty-state" style={{ padding: 24 }}>
      <div className="empty-state-icon">📊</div>
      <p className="empty-state-text">No data yet</p>
    </div>
  );

  let offset = 0;
  const R = 80;
  const circumference = 2 * Math.PI * R;

  const slices = categories.map((cat, i) => {
    const pct = cat.total / total;
    const dashLen = pct * circumference;
    const slice = {
      cat,
      color: CAT_COLORS[i % CAT_COLORS.length],
      dashLen,
      offset,
    };
    offset += dashLen;
    return slice;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={R} fill="none" stroke="#f0f0ea" strokeWidth="28" />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx="100" cy="100" r={R}
            fill="none"
            stroke={s.color}
            strokeWidth="28"
            strokeDasharray={`${s.dashLen} ${circumference - s.dashLen}`}
            strokeDashoffset={circumference / 4 - s.offset}
            style={{ transition: "stroke-dasharray 0.4s ease" }}
          />
        ))}
        <text x="100" y="95" textAnchor="middle" fontFamily="Cormorant SC" fontSize="11" fill="#7a9480" letterSpacing="1">TOTAL</text>
        <text x="100" y="115" textAnchor="middle" fontFamily="Cormorant SC" fontSize="18" fontWeight="700" fill="#2d3e2e">
          ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </text>
      </svg>

      <div className="category-legend">
        {slices.map((s, i) => (
          <div key={i} className="legend-item">
            <div className="legend-dot" style={{ background: s.color }} />
            <span className="legend-label">
              {CATEGORY_ICONS[s.cat.category] ?? ""} {s.cat.category}
            </span>
            <span className="legend-value">
              ₹{s.cat.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-soft)", fontFamily: "Cormorant SC" }}>
              ({((s.cat.total / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    Promise.all([getCategories(), getExpenses()])
      .then(([cats, exps]) => {
        setCategories(cats.sort((a, b) => b.total - a.total));
        setExpenses(exps);
      })
      .catch(() => toast("Failed to load analytics", "error"))
      .finally(() => setLoading(false));
  }, []);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = expenses.filter((e) => e.date?.startsWith(thisMonth));
  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);

  // Group by day for the past 7 days
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().slice(0, 10);
    const dayTotal = expenses
      .filter((e) => e.date === dayStr)
      .reduce((s, e) => s + e.amount, 0);
    last7.push({ day: d.toLocaleDateString("en-IN", { weekday: "short" }), total: dayTotal, date: dayStr });
  }

  const maxDay = Math.max(...last7.map((d) => d.total), 1);

  if (loading) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <div style={{ textAlign: "center", opacity: 0.5 }}>
          <div className="progress-ring" style={{ margin: "0 auto 16px" }} />
          <p className="ocr-status-text">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Analytics</h1>
      <p className="page-subtitle">
        This month's spending — {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
      </p>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, color: "var(--red-soft)" },
          { label: "Transactions", value: monthExpenses.length, color: "var(--sage)" },
          { label: "Categories", value: categories.length, color: "var(--amber)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Cormorant SC", fontSize: 13, letterSpacing: 1, color: "var(--text-soft)", marginBottom: 6 }}>
              {s.label.toUpperCase()}
            </div>
            <div style={{ fontFamily: "Cormorant SC", fontSize: 32, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        {/* Donut Chart */}
        <div className="card">
          <div className="card-title">Spending by Category</div>
          {categories.length === 0 ? (
            <div className="empty-state" style={{ padding: 24 }}>
              <div className="empty-state-icon">🌿</div>
              <p className="empty-state-text">No expenses this month</p>
            </div>
          ) : (
            <DonutChart categories={categories} />
          )}
        </div>

        {/* Daily Bar Chart */}
        <div className="card">
          <div className="card-title">Daily Spending (Last 7 Days)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 200, padding: "8px 0" }}>
            {last7.map((day) => (
              <div key={day.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 10, fontFamily: "Cormorant SC", color: "var(--text-soft)", height: 28, textAlign: "center" }}>
                  {day.total > 0 ? `₹${day.total.toFixed(0)}` : ""}
                </div>
                <div style={{
                  width: "100%",
                  height: `${(day.total / maxDay) * 130 + (day.total > 0 ? 8 : 0)}px`,
                  minHeight: day.total > 0 ? 8 : 2,
                  background: day.total > 0
                    ? "linear-gradient(180deg, var(--sage-light), var(--sage))"
                    : "rgba(125,158,128,0.15)",
                  borderRadius: "6px 6px 0 0",
                  transition: "height 0.4s ease",
                }} />
                <div style={{ fontSize: 11, fontFamily: "Cormorant SC", color: "var(--text-mid)" }}>
                  {day.day}
                </div>
              </div>
            ))}
          </div>

          {/* Top category highlight */}
          {categories.length > 0 && (
            <div style={{
              marginTop: 16, padding: "12px 16px",
              background: "rgba(125,158,128,0.08)", borderRadius: "var(--radius-sm)",
              display: "flex", alignItems: "center", gap: 12
            }}>
              <span style={{ fontSize: 28 }}>{CATEGORY_ICONS[categories[0].category] ?? "📌"}</span>
              <div>
                <div style={{ fontFamily: "Cormorant SC", fontSize: 13, color: "var(--text-soft)", letterSpacing: 1 }}>TOP CATEGORY</div>
                <div style={{ fontFamily: "Cormorant SC", fontSize: 20, fontWeight: 700, color: "var(--text-dark)" }}>
                  {categories[0].category} — ₹{categories[0].total.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category breakdown table */}
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-title">Category Breakdown</div>
          {categories.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍃</div>
              <p className="empty-state-text">No data to show</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {categories.map((cat, i) => {
                const pct = totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0;
                return (
                  <div key={cat.category} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 32, textAlign: "center", fontSize: 20 }}>
                      {CATEGORY_ICONS[cat.category] ?? "📌"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontFamily: "Cormorant SC", fontSize: 16, color: "var(--text-dark)" }}>
                          {cat.category}
                        </span>
                        <span style={{ fontFamily: "Cormorant SC", fontSize: 16, fontWeight: 600 }}>
                          ₹{cat.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div style={{ height: 8, background: "#e8ede8", borderRadius: 10 }}>
                        <div style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: CAT_COLORS[i % CAT_COLORS.length],
                          borderRadius: 10,
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: "var(--text-soft)" }}>{pct.toFixed(1)}% of total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
