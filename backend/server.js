const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const Tesseract = require("tesseract.js");

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, "data.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Ensure directories exist
fs.ensureDirSync(UPLOADS_DIR);

// Middleware
app.use(cors());
app.use(express.json());

// Multer config for receipt uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// --- Helpers ---
async function readData() {
  const data = await fs.readJson(DATA_FILE);
  return data;
}

async function writeData(data) {
  await fs.writeJson(DATA_FILE, data, { spaces: 2 });
}

function parseReceiptText(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Try to find total amount - look for patterns like TOTAL, AMOUNT, Grand Total etc.
  const totalPatterns = [
    /(?:grand\s*total|total\s*amount|total\s*due|amount\s*due|net\s*total|subtotal|total)[:\s]*[\$₹£€]?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /[\$₹£€]\s*([\d,]+(?:\.\d{1,2})?)\s*$/i,
    /([\d,]+\.\d{2})\s*$/i,
  ];

  let amount = null;
  let amountLine = "";

  for (const line of lines) {
    for (const pattern of totalPatterns) {
      const match = line.match(pattern);
      if (match) {
        const parsed = parseFloat(match[1].replace(/,/g, ""));
        if (!isNaN(parsed) && parsed > 0) {
          // Prefer largest amount (likely grand total)
          if (amount === null || parsed > amount) {
            amount = parsed;
            amountLine = line;
          }
        }
      }
    }
  }

  // If no labeled total found, pick the largest number in text
  if (amount === null) {
    const allNumbers = text.match(/[\d]+(?:\.\d{1,2})?/g) || [];
    const numbers = allNumbers
      .map((n) => parseFloat(n))
      .filter((n) => n > 0.5 && n < 100000);
    if (numbers.length > 0) {
      amount = Math.max(...numbers);
    }
  }

  // Try to extract merchant name from first non-empty lines
  let merchant = "Unknown Merchant";
  const skipPatterns = /^\d|receipt|bill|invoice|tel:|phone:|date:|time:|#|vat|gst|tax/i;
  for (const line of lines.slice(0, 8)) {
    if (line.length > 2 && !skipPatterns.test(line) && !/^\d/.test(line)) {
      merchant = line.replace(/[^a-zA-Z0-9\s&'-]/g, "").trim();
      if (merchant.length > 2) break;
    }
  }

  // Detect category from keywords
  const categoryMap = {
    Food: /restaurant|cafe|coffee|pizza|burger|food|eat|dining|fast/i,
    Grocery: /grocery|supermarket|mart|store|fresh|fruits|vegetables|organic/i,
    Transport: /uber|ola|taxi|cab|fuel|petrol|diesel|transport|metro|bus|train/i,
    Health: /pharmacy|medical|hospital|clinic|doctor|medicine|health/i,
    Entertainment: /cinema|movie|theatre|netflix|spotify|game|entertainment/i,
    Shopping: /amazon|flipkart|mall|shop|cloth|fashion|apparel|retail/i,
    Utilities: /electricity|water|gas|internet|wifi|phone|bill|recharge/i,
  };

  let category = "Other";
  for (const [cat, pattern] of Object.entries(categoryMap)) {
    if (pattern.test(text) || pattern.test(merchant)) {
      category = cat;
      break;
    }
  }

  return {
    merchant: merchant || "Unknown Merchant",
    amount: amount ? parseFloat(amount.toFixed(2)) : null,
    category,
    rawText: text.substring(0, 1000),
  };
}

// ─────────────────────────────────
// ROUTES
// ─────────────────────────────────

// GET /api/balance
app.get("/api/balance", async (req, res) => {
  try {
    const data = await readData();
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = data.expenses
      .filter((e) => e.date && e.date.startsWith(thisMonth))
      .reduce((sum, e) => sum + e.amount, 0);
    res.json({ ...data.balance, monthlyExpenses: parseFloat(monthlyExpenses.toFixed(2)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/balance
app.put("/api/balance", async (req, res) => {
  try {
    const { current, income } = req.body;
    const data = await readData();
    if (current !== undefined) data.balance.current = parseFloat(current);
    if (income !== undefined) data.balance.income = parseFloat(income);
    await writeData(data);
    res.json(data.balance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const data = await readData();
    const sorted = [...data.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/expenses
app.post("/api/expenses", async (req, res) => {
  try {
    const { name, amount, category, date, note } = req.body;
    if (!name || !amount || amount <= 0) {
      return res.status(400).json({ error: "name and amount are required" });
    }
    const data = await readData();
    const expense = {
      id: uuidv4(),
      name,
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      category: category || "Other",
      date: date || new Date().toISOString().slice(0, 10),
      note: note || "",
      source: "manual",
    };
    data.expenses.push(expense);
    data.balance.current = parseFloat((data.balance.current - expense.amount).toFixed(2));
    await writeData(data);
    res.status(201).json({ expense, balance: data.balance.current });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/expenses/:id
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const data = await readData();
    const idx = data.expenses.findIndex((e) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Expense not found" });
    const [removed] = data.expenses.splice(idx, 1);
    data.balance.current = parseFloat((data.balance.current + removed.amount).toFixed(2));
    await writeData(data);
    res.json({ deleted: removed, balance: data.balance.current });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categories
app.get("/api/categories", async (req, res) => {
  try {
    const data = await readData();
    const map = {};
    const thisMonth = new Date().toISOString().slice(0, 7);
    data.expenses
      .filter((e) => e.date && e.date.startsWith(thisMonth))
      .forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
      });
    const result = Object.entries(map).map(([category, total]) => ({
      category,
      total: parseFloat(total.toFixed(2)),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ocr  ← receipt scanning
app.post("/api/ocr", upload.single("receipt"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const filePath = req.file.path;
  try {
    console.log(`[OCR] Processing: ${filePath}`);
    const { data: { text } } = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          process.stdout.write(`\r[OCR] Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });
    console.log("\n[OCR] Done. Parsing...");
    const parsed = parseReceiptText(text);
    // Clean up uploaded file
    fs.remove(filePath).catch(() => {});
    res.json({
      success: true,
      ...parsed,
    });
  } catch (err) {
    fs.remove(filePath).catch(() => {});
    console.error("[OCR] Error:", err.message);
    res.status(500).json({ error: "OCR processing failed: " + err.message });
  }
});

// POST /api/expenses/confirm-receipt  ← save OCR-scanned expense
app.post("/api/expenses/confirm-receipt", async (req, res) => {
  try {
    const { merchant, amount, category, date, note } = req.body;
    if (!merchant || !amount || amount <= 0) {
      return res.status(400).json({ error: "merchant and amount required" });
    }
    const data = await readData();
    const expense = {
      id: uuidv4(),
      name: merchant,
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      category: category || "Other",
      date: date || new Date().toISOString().slice(0, 10),
      note: note || "Scanned from receipt",
      source: "receipt",
    };
    data.expenses.push(expense);
    data.balance.current = parseFloat((data.balance.current - expense.amount).toFixed(2));
    await writeData(data);
    res.status(201).json({ expense, balance: data.balance.current });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── RECURRING ROUTES ────────────────────────────────────────────────────────

// Helper: compute next due date from a given date + interval
function nextDueDate(fromDate, interval, intervalDays) {
  const d = new Date(fromDate);
  switch (interval) {
    case "daily":   d.setDate(d.getDate() + 1); break;
    case "weekly":  d.setDate(d.getDate() + 7); break;
    case "monthly": d.setMonth(d.getMonth() + 1); break;
    case "yearly":  d.setFullYear(d.getFullYear() + 1); break;
    case "custom":  d.setDate(d.getDate() + (parseInt(intervalDays) || 30)); break;
    default:        d.setMonth(d.getMonth() + 1);
  }
  return d.toISOString().slice(0, 10);
}

// GET /api/recurring
app.get("/api/recurring", async (req, res) => {
  try {
    const data = await readData();
    res.json(data.recurring || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recurring
app.post("/api/recurring", async (req, res) => {
  try {
    const { name, amount, category, interval, intervalDays, startDate, note } = req.body;
    if (!name || !amount || amount <= 0) {
      return res.status(400).json({ error: "name and amount are required" });
    }
    const data = await readData();
    if (!data.recurring) data.recurring = [];
    const start = startDate || new Date().toISOString().slice(0, 10);
    const item = {
      id: uuidv4(),
      name,
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      category: category || "Other",
      interval: interval || "monthly",
      intervalDays: parseInt(intervalDays) || 30,
      startDate: start,
      nextDue: start,
      active: true,
      note: note || "",
    };
    data.recurring.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/recurring/:id
app.put("/api/recurring/:id", async (req, res) => {
  try {
    const data = await readData();
    if (!data.recurring) data.recurring = [];
    const idx = data.recurring.findIndex((r) => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Recurring item not found" });
    const updated = { ...data.recurring[idx], ...req.body };
    // Recompute nextDue if interval changed
    if (req.body.interval || req.body.intervalDays) {
      updated.nextDue = nextDueDate(
        data.recurring[idx].nextDue,
        updated.interval,
        updated.intervalDays
      );
      // Don't push next due into the future if it was already due today
      if (updated.nextDue > new Date().toISOString().slice(0, 10)) {
        updated.nextDue = data.recurring[idx].nextDue;
      }
    }
    data.recurring[idx] = updated;
    await writeData(data);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/recurring/:id
app.delete("/api/recurring/:id", async (req, res) => {
  try {
    const data = await readData();
    if (!data.recurring) data.recurring = [];
    const idx = data.recurring.findIndex((r) => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Recurring item not found" });
    const [removed] = data.recurring.splice(idx, 1);
    await writeData(data);
    res.json({ deleted: removed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recurring/process — auto-charge all due subscriptions
app.post("/api/recurring/process", async (req, res) => {
  try {
    const data = await readData();
    if (!data.recurring) data.recurring = [];
    const today = new Date().toISOString().slice(0, 10);
    const charged = [];

    for (const item of data.recurring) {
      if (!item.active) continue;
      // Process all missed cycles
      while (item.nextDue <= today) {
        const expense = {
          id: uuidv4(),
          name: `${item.name} (auto)`,
          amount: item.amount,
          category: item.category,
          date: item.nextDue,
          note: item.note || `Recurring ${item.interval} charge`,
          source: "recurring",
        };
        data.expenses.push(expense);
        data.balance.current = parseFloat((data.balance.current - item.amount).toFixed(2));
        item.nextDue = nextDueDate(item.nextDue, item.interval, item.intervalDays);
        charged.push(expense);
      }
    }

    await writeData(data);
    res.json({ charged, balance: data.balance.current });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🌿 ChefSplit Backend running on http://localhost:${PORT}`);
  console.log(`   Data file: ${DATA_FILE}`);
  console.log(`   OCR endpoint: POST /api/ocr\n`);
});

