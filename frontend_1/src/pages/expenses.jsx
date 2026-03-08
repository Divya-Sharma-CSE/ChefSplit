import React, { useEffect, useState } from "react";
import {
  getExpenses, addExpense, deleteExpense,
  getRecurring, addRecurring, updateRecurring, deleteRecurring, processRecurring,
} from "../api.js";
import { useToast } from "../components/toast.jsx";
import AddExpenseModal from "../components/AddExpenseModal.jsx";
import AddRecurringModal from "../components/AddRecurringModal.jsx";
import ExpenseItem from "../components/ExpenseItem.jsx";

const ALL_CATEGORIES = ["All", "Food", "Grocery", "Transport", "Health", "Entertainment", "Shopping", "Utilities", "Other"];

const INTERVAL_LABELS = {
  daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly", custom: "Custom",
};

const ICONS = {
  Food: "🍽️", Grocery: "🛒", Transport: "🚗", Health: "💊",
  Entertainment: "🎬", Shopping: "🛍️", Utilities: "⚡", Other: "📦",
};

function intervalLabel(item) {
  if (item.interval === "custom") return `Every ${item.intervalDays} days`;
  return INTERVAL_LABELS[item.interval] || item.interval;
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

// ─── Recurring Card ───────────────────────────────────────────────────────────
function RecurringCard({ item, onEdit, onDelete, onToggle }) {
  const days = daysUntil(item.nextDue);
  const isDue = days <= 0;
  const isSoon = days > 0 && days <= 3;

  return (
    <div className="recurring-card" style={{ opacity: item.active ? 1 : 0.55 }}>
      <div className="recurring-card-left">
        <div className="recurring-icon">{ICONS[item.category] || "📦"}</div>
        <div>
          <div className="recurring-name">{item.name}</div>
          <div className="recurring-meta">
            <span className="badge badge-interval">{intervalLabel(item)}</span>
            <span className="badge badge-category">{item.category}</span>
          </div>
          {item.note && <div className="recurring-note">{item.note}</div>}
        </div>
      </div>

      <div className="recurring-card-right">
        <div className="recurring-amount">₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
        <div
          className="recurring-due"
          style={{ color: isDue ? "#e74c3c" : isSoon ? "#f39c12" : "var(--text-muted)" }}
        >
          {isDue
            ? "⚠️ Due today"
            : isSoon
            ? `⏰ Due in ${days}d`
            : `Next: ${new Date(item.nextDue).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
        </div>
        <div className="recurring-actions">
          <button
            className={`btn ${item.active ? "btn-secondary" : "btn-primary"}`}
            style={{ fontSize: 12, padding: "4px 10px" }}
            onClick={() => onToggle(item)}
            title={item.active ? "Pause subscription" : "Resume subscription"}
          >
            {item.active ? "⏸ Pause" : "▶ Resume"}
          </button>
          <button className="btn btn-secondary" style={{ fontSize: 12, padding: "4px 10px" }} onClick={() => onEdit(item)}>✏️ Edit</button>
          <button className="icon-btn delete-btn" onClick={() => onDelete(item.id)} title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function Expenses() {
  const [tab, setTab] = useState("all"); // "all" | "recurring"

  // All expenses state
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  // Recurring state
  const [recurring, setRecurring] = useState([]);
  const [loadingRecurring, setLoadingRecurring] = useState(true);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState(null);

  const toast = useToast();

  // ── Load everything on mount ─────────────────────────────────────────────
  useEffect(() => {
    loadExpenses();
    loadRecurring();
    // Auto-process due recurring charges on page load
    processRecurring()
      .then(({ charged }) => {
        if (charged.length > 0) {
          toast(`🔁 Auto-charged ${charged.length} subscription${charged.length > 1 ? "s" : ""}`, "info");
          loadExpenses();
        }
      })
      .catch(() => {});
  }, []);

  const loadExpenses = async () => {
    try {
      const exs = await getExpenses();
      setExpenses(exs);
    } catch {
      toast("Failed to load expenses", "error");
    } finally {
      setLoadingExpenses(false);
    }
  };

  const loadRecurring = async () => {
    try {
      const items = await getRecurring();
      setRecurring(items);
    } catch {
      toast("Failed to load recurring", "error");
    } finally {
      setLoadingRecurring(false);
    }
  };

  // Filter expenses
  useEffect(() => {
    let result = expenses;
    if (category !== "All") result = result.filter((e) => e.category === category);
    if (search) result = result.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.note?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [expenses, category, search]);

  // ── Expense handlers ─────────────────────────────────────────────────────
  const handleAddExpense = async (data) => {
    try {
      await addExpense(data);
      toast(`✅ Added: ${data.name}`, "success");
      setShowExpenseModal(false);
      loadExpenses();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Delete this expense? The amount will be restored to your balance.")) return;
    try {
      await deleteExpense(id);
      toast("Expense deleted & balance restored", "info");
      loadExpenses();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  // ── Recurring handlers ───────────────────────────────────────────────────
  const handleAddRecurring = async (data) => {
    try {
      await addRecurring(data);
      toast(`✅ Subscription added: ${data.name}`, "success");
      setShowRecurringModal(false);
      loadRecurring();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleUpdateRecurring = async (data) => {
    try {
      await updateRecurring(editingRecurring.id, data);
      toast("✅ Subscription updated", "success");
      setEditingRecurring(null);
      loadRecurring();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleDeleteRecurring = async (id) => {
    if (!window.confirm("Remove this recurring subscription?")) return;
    try {
      await deleteRecurring(id);
      toast("Subscription removed", "info");
      loadRecurring();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleToggleRecurring = async (item) => {
    try {
      await updateRecurring(item.id, { active: !item.active });
      toast(item.active ? "⏸ Subscription paused" : "▶ Subscription resumed", "info");
      loadRecurring();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const totalFiltered = filtered.reduce((sum, e) => sum + e.amount, 0);
  const totalMonthly = recurring
    .filter((r) => r.active)
    .reduce((sum, r) => {
      // Normalise all to monthly equivalent
      const m = { daily: 30, weekly: 4.33, monthly: 1, yearly: 1 / 12, custom: 30 / (r.intervalDays || 30) };
      return sum + r.amount * (m[r.interval] || 1);
    }, 0);

  return (
    <div className="page">
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">
            {tab === "all"
              ? `${filtered.length} transactions · Total: ₹${totalFiltered.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
              : `${recurring.length} subscription${recurring.length !== 1 ? "s" : ""} · ~₹${Math.round(totalMonthly).toLocaleString("en-IN")}/mo`}
          </p>
        </div>
        {tab === "all" ? (
          <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)} id="add-expense-btn-expenses">
            + Add Expense
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => { setEditingRecurring(null); setShowRecurringModal(true); }} id="add-recurring-btn">
            + Add Subscription
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div className="tab-bar" style={{ marginBottom: 16 }}>
        <button
          className={`tab-btn ${tab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
          id="tab-all"
        >
          All Expenses
        </button>
        <button
          className={`tab-btn ${tab === "recurring" ? "active" : ""}`}
          onClick={() => setTab("recurring")}
          id="tab-recurring"
        >
          🔁 Recurring
          {recurring.filter((r) => r.active).length > 0 && (
            <span className="tab-badge">{recurring.filter((r) => r.active).length}</span>
          )}
        </button>
      </div>

      {/* ── ALL EXPENSES TAB ── */}
      {tab === "all" && (
        <>
          <div className="filter-bar">
            <input
              className="search-input"
              placeholder="🔍 Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-input"
            />
          </div>
          <div className="filter-bar" style={{ marginTop: -8 }}>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loadingExpenses ? (
            <div style={{ textAlign: "center", padding: 48, opacity: 0.5 }}>
              <div className="progress-ring" style={{ margin: "0 auto 16px" }} />
              <p className="ocr-status-text">Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍃</div>
              <p className="empty-state-text">No expenses found</p>
              <p className="empty-state-sub">
                {search || category !== "All" ? "Try adjusting your filters" : "Add your first expense to get started"}
              </p>
            </div>
          ) : (
            <div className="card">
              <div className="expense-list">
                {filtered.map((exp) => (
                  <ExpenseItem key={exp.id} expense={exp} onDelete={handleDeleteExpense} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── RECURRING TAB ── */}
      {tab === "recurring" && (
        <>
          {loadingRecurring ? (
            <div style={{ textAlign: "center", padding: 48, opacity: 0.5 }}>
              <div className="progress-ring" style={{ margin: "0 auto 16px" }} />
              <p className="ocr-status-text">Loading...</p>
            </div>
          ) : recurring.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔁</div>
              <p className="empty-state-text">No recurring subscriptions</p>
              <p className="empty-state-sub">Add Netflix, Spotify, rent or any recurring charge</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowRecurringModal(true)}>
                + Add Subscription
              </button>
            </div>
          ) : (
            <div className="recurring-list">
              {recurring.map((item) => (
                <RecurringCard
                  key={item.id}
                  item={item}
                  onEdit={(it) => { setEditingRecurring(it); setShowRecurringModal(true); }}
                  onDelete={handleDeleteRecurring}
                  onToggle={handleToggleRecurring}
                />
              ))}
            </div>
          )}
        </>
      )}

      <button className="fab" onClick={() => tab === "all" ? setShowExpenseModal(true) : setShowRecurringModal(true)} title="Add">+</button>

      {showExpenseModal && (
        <AddExpenseModal onClose={() => setShowExpenseModal(false)} onSubmit={handleAddExpense} />
      )}

      {showRecurringModal && (
        <AddRecurringModal
          initial={editingRecurring}
          onClose={() => { setShowRecurringModal(false); setEditingRecurring(null); }}
          onSubmit={editingRecurring ? handleUpdateRecurring : handleAddRecurring}
        />
      )}
    </div>
  );
}

export default Expenses;
