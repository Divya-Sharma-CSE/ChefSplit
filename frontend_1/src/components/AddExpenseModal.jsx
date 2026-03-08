import React, { useState } from "react";

const CATEGORIES = ["Food", "Grocery", "Transport", "Health", "Entertainment", "Shopping", "Utilities", "Other"];

function AddExpenseModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "Other",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || parseFloat(form.amount) <= 0) return;
    setLoading(true);
    await onSubmit({ ...form, amount: parseFloat(form.amount) });
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">Add Expense</h2>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Expense Name *</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handle}
              placeholder="e.g. Coffee, Uber, Groceries..."
              required
              id="expense-name-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                className="form-input"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handle}
                placeholder="0.00"
                required
                id="expense-amount-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                name="date"
                type="date"
                value={form.date}
                onChange={handle}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={form.category}
              onChange={handle}
              id="expense-category-select"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Note (Optional)</label>
            <input
              className="form-input"
              name="note"
              value={form.note}
              onChange={handle}
              placeholder="Any additional note..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} id="submit-expense-btn">
              {loading ? "Saving..." : "Save Expense"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpenseModal;
