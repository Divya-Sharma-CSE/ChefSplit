import React, { useState, useEffect } from "react";

const CATEGORIES = ["Food", "Grocery", "Transport", "Health", "Entertainment", "Shopping", "Utilities", "Other"];
const INTERVALS = [
  { value: "daily",   label: "Daily" },
  { value: "weekly",  label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly",  label: "Yearly" },
  { value: "custom",  label: "Custom (days)" },
];

const ICONS = {
  Food: "🍽️", Grocery: "🛒", Transport: "🚗", Health: "💊",
  Entertainment: "🎬", Shopping: "🛍️", Utilities: "⚡", Other: "📦",
};

function AddRecurringModal({ onClose, onSubmit, initial }) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "Entertainment",
    interval: "monthly",
    intervalDays: 30,
    startDate: new Date().toISOString().slice(0, 10),
    note: "",
    active: true,
    ...initial,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) setForm((f) => ({ ...f, ...initial }));
  }, [initial]);

  const handle = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || parseFloat(form.amount) <= 0) return;
    setLoading(true);
    await onSubmit({ ...form, amount: parseFloat(form.amount), intervalDays: parseInt(form.intervalDays) || 30 });
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">{initial ? "Edit Recurring" : "Add Recurring"}</h2>
        <form onSubmit={submit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Subscription Name *</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handle}
              placeholder="e.g. Netflix, Spotify, Rent…"
              required
              id="recurring-name-input"
            />
          </div>

          {/* Amount + Interval */}
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
                id="recurring-amount-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Billing Interval</label>
              <select
                className="form-select"
                name="interval"
                value={form.interval}
                onChange={handle}
                id="recurring-interval-select"
              >
                {INTERVALS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom days */}
          {form.interval === "custom" && (
            <div className="form-group">
              <label className="form-label">Every N Days *</label>
              <input
                className="form-input"
                name="intervalDays"
                type="number"
                min="1"
                value={form.intervalDays}
                onChange={handle}
                placeholder="e.g. 14 for every 2 weeks"
                id="recurring-intervaldays-input"
              />
            </div>
          )}

          {/* Category + Start Date */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={form.category}
                onChange={handle}
                id="recurring-category-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{ICONS[c]} {c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                className="form-input"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handle}
                id="recurring-startdate-input"
              />
            </div>
          </div>

          {/* Note */}
          <div className="form-group">
            <label className="form-label">Note (Optional)</label>
            <input
              className="form-input"
              name="note"
              value={form.note}
              onChange={handle}
              placeholder="Any additional info…"
              id="recurring-note-input"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} id="submit-recurring-btn">
              {loading ? "Saving…" : initial ? "Save Changes" : "Add Subscription"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRecurringModal;
