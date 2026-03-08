// API utility - connects frontend to backend on port 3001
const BASE = "http://localhost:3001/api";

export async function getBalance() {
  const r = await fetch(`${BASE}/balance`);
  if (!r.ok) throw new Error("Failed to fetch balance");
  return r.json();
}

export async function updateBalance(data) {
  const r = await fetch(`${BASE}/balance`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to update balance");
  return r.json();
}

export async function getExpenses() {
  const r = await fetch(`${BASE}/expenses`);
  if (!r.ok) throw new Error("Failed to fetch expenses");
  return r.json();
}

export async function addExpense(data) {
  const r = await fetch(`${BASE}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const err = await r.json();
    throw new Error(err.error || "Failed to add expense");
  }
  return r.json();
}

export async function deleteExpense(id) {
  const r = await fetch(`${BASE}/expenses/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete expense");
  return r.json();
}

export async function getCategories() {
  const r = await fetch(`${BASE}/categories`);
  if (!r.ok) throw new Error("Failed to fetch categories");
  return r.json();
}

export async function scanReceipt(file) {
  const form = new FormData();
  form.append("receipt", file);
  const r = await fetch(`${BASE}/ocr`, { method: "POST", body: form });
  if (!r.ok) {
    const err = await r.json();
    throw new Error(err.error || "OCR failed");
  }
  return r.json();
}

export async function confirmReceiptExpense(data) {
  const r = await fetch(`${BASE}/expenses/confirm-receipt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const err = await r.json();
    throw new Error(err.error || "Failed to confirm receipt");
  }
  return r.json();
}

// ── Recurring ──────────────────────────────────────────────────────────────

export async function getRecurring() {
  const r = await fetch(`${BASE}/recurring`);
  if (!r.ok) throw new Error("Failed to fetch recurring");
  return r.json();
}

export async function addRecurring(data) {
  const r = await fetch(`${BASE}/recurring`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const err = await r.json();
    throw new Error(err.error || "Failed to add recurring");
  }
  return r.json();
}

export async function updateRecurring(id, data) {
  const r = await fetch(`${BASE}/recurring/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to update recurring");
  return r.json();
}

export async function deleteRecurring(id) {
  const r = await fetch(`${BASE}/recurring/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete recurring");
  return r.json();
}

export async function processRecurring() {
  const r = await fetch(`${BASE}/recurring/process`, { method: "POST" });
  if (!r.ok) throw new Error("Failed to process recurring");
  return r.json();
}
