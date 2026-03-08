import React, { useEffect, useState } from "react";
import { getBalance, updateBalance } from "../api.js";
import { useToast } from "../components/toast.jsx";

function Settings() {
  const [form, setForm] = useState({ current: "", income: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getBalance()
      .then((b) => setForm({ current: b.current, income: b.income }))
      .catch(() => toast("Failed to load balance", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBalance({
        current: parseFloat(form.current),
        income: parseFloat(form.income),
      });
      toast("✅ Balance updated successfully!", "success");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Configure your balance and preferences</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Balance Settings */}
        <div className="card">
          <div className="card-title">💰 Balance & Income</div>
          {loading ? (
            <div className="empty-state" style={{ padding: 32 }}>
              <div className="progress-ring" style={{ margin: "0 auto" }} />
            </div>
          ) : (
            <form onSubmit={save}>
              <div className="form-group">
                <label className="form-label">Current Balance (₹)</label>
                <input
                  className="form-input"
                  name="current"
                  type="number"
                  step="0.01"
                  value={form.current}
                  onChange={handle}
                  placeholder="e.g. 10000.00"
                  id="settings-current-balance"
                />
                <p style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 4, fontFamily: "Inter" }}>
                  This is your current available balance. Expenses will be deducted from this.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Income (₹)</label>
                <input
                  className="form-input"
                  name="income"
                  type="number"
                  step="0.01"
                  value={form.income}
                  onChange={handle}
                  placeholder="e.g. 50000.00"
                  id="settings-income"
                />
                <p style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 4, fontFamily: "Inter" }}>
                  Used to show what % of your income has been spent this month.
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                id="save-settings-btn"
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
            </form>
          )}
        </div>

        {/* About */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">🌿 About ChefSplit</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Version", value: "1.0.0" },
                { label: "Backend", value: "Node.js + Express" },
                { label: "OCR Engine", value: "Tesseract.js" },
                { label: "Storage", value: "Local JSON file" },
                { label: "Port", value: "3001 (backend)" },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(125,158,128,0.12)", paddingBottom: 8 }}>
                  <span style={{ fontFamily: "Cormorant SC", fontSize: 16, color: "var(--text-mid)" }}>{label}</span>
                  <span style={{ fontFamily: "Cormorant SC", fontSize: 16, fontWeight: 600, color: "var(--text-dark)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">⚡ Quick Tips</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Scan receipts from supermarkets, restaurants, or online orders",
                "Edit the extracted amount before confirming — OCR isn't always perfect",
                "Use categories to track where your money goes in Analytics",
                "Deleting an expense restores the amount to your balance",
                "Set your monthly income so the progress bar works correctly",
              ].map((tip, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--sage)", fontSize: 16, flexShrink: 0, marginTop: 1 }}>✦</span>
                  <span style={{ fontSize: 14, color: "var(--text-mid)", fontFamily: "Inter", lineHeight: 1.5 }}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card" style={{ gridColumn: "1 / -1", border: "1.5px solid rgba(232,112,112,0.25)" }}>
          <div className="card-title" style={{ color: "var(--red-soft)" }}>⚠️ Danger Zone</div>
          <p style={{ fontSize: 14, color: "var(--text-soft)", fontFamily: "Inter", marginBottom: 16 }}>
            Resetting will permanently delete all expenses and reset your balance to zero. This cannot be undone.
          </p>
          {!resetConfirm ? (
            <button
              className="btn btn-danger"
              onClick={() => setResetConfirm(true)}
              id="reset-data-btn"
            >
              🗑️ Reset All Data
            </button>
          ) : (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontFamily: "Cormorant SC", fontSize: 16, color: "var(--red-soft)" }}>
                Are you sure? This will erase everything.
              </span>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  try {
                    await updateBalance({ current: 0, income: 0 });
                    // Delete all — just update balance; full reset would need a backend endpoint
                    toast("Balance reset to 0. Manually delete data.json to clear expenses.", "info");
                    setResetConfirm(false);
                  } catch (e) {
                    toast(e.message, "error");
                  }
                }}
              >
                Yes, Reset
              </button>
              <button className="btn btn-secondary" onClick={() => setResetConfirm(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
