import React, { useState, useRef } from "react";
import { scanReceipt, confirmReceiptExpense } from "../api.js";
import { useToast } from "../components/toast.jsx";

const CATEGORIES = ["Food", "Grocery", "Transport", "Health", "Entertainment", "Shopping", "Utilities", "Other"];

function Scan() {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [editedResult, setEditedResult] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const fileRef = useRef(null);
  const toast = useToast();

  const processFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast("Please upload an image file", "error");
      return;
    }
    setPreview(URL.createObjectURL(file));
    setOcrResult(null);
    setConfirmed(false);
    setProcessing(true);
    try {
      const result = await scanReceipt(file);
      setOcrResult(result);
      setEditedResult({
        merchant: result.merchant || "",
        amount: result.amount ?? "",
        category: result.category || "Other",
        date: new Date().toISOString().slice(0, 10),
        note: "Scanned from receipt",
      });
      if (result.amount) {
        toast(`Found ₹${result.amount} from receipt!`, "success");
      } else {
        toast("Could not detect amount — please enter manually", "info");
      }
    } catch (e) {
      toast(`OCR Error: ${e.message}`, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleConfirm = async () => {
    if (!editedResult.merchant || !editedResult.amount || parseFloat(editedResult.amount) <= 0) {
      toast("Please fill merchant and amount", "error");
      return;
    }
    try {
      await confirmReceiptExpense({
        ...editedResult,
        amount: parseFloat(editedResult.amount),
      });
      setConfirmed(true);
      toast(`✅ ₹${editedResult.amount} deducted from balance!`, "success");
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleReset = () => {
    setPreview(null);
    setOcrResult(null);
    setEditedResult(null);
    setConfirmed(false);
    setProcessing(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const edit = (field, val) => setEditedResult((r) => ({ ...r, [field]: val }));

  return (
    <div className="page">
      <h1 className="page-title">Scan Receipt</h1>
      <p className="page-subtitle">Upload a receipt photo — our OCR will extract the amount and deduct it from your balance</p>

      <div className="scan-grid">
        {/* Drop Zone / Preview */}
        <div>
          {!preview ? (
            <div
              className={`drop-zone ${dragOver ? "drag-over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              id="receipt-drop-zone"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileRef}
                id="receipt-file-input"
              />
              <div className="drop-zone-icon">🧾</div>
              <p className="drop-zone-text">Drop receipt here</p>
              <p className="drop-zone-hint">or click to browse · JPG, PNG, WEBP</p>
              <button className="btn btn-primary btn-sm" style={{ pointerEvents: "none", marginTop: 8 }}>
                📷 Choose Photo
              </button>
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center" }}>
              <p className="card-title">Receipt Preview</p>
              <img src={preview} alt="Receipt Preview" className="receipt-preview" style={{ maxHeight: 280, width: "100%", objectFit: "contain" }} />
              <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn btn-secondary btn-sm" onClick={handleReset}>
                  🔄 Scan Another
                </button>
              </div>
            </div>
          )}

          {/* OCR Processing Spinner */}
          {processing && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="ocr-progress">
                <div className="progress-ring" />
                <p className="ocr-status-text">Reading receipt with OCR...</p>
                <p style={{ fontSize: 13, color: "var(--text-soft)", fontFamily: "Inter" }}>This may take a few seconds</p>
              </div>
            </div>
          )}
        </div>

        {/* OCR Result Panel */}
        <div>
          {!ocrResult && !processing && (
            <div className="scan-empty-state">
              <div className="scan-empty-icon">👁️</div>
              <p className="scan-empty-text">OCR results will<br />appear here</p>
            </div>
          )}

          {confirmed && (
            <div className="ocr-result-card" style={{ borderLeftColor: "#7dc87d" }}>
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 60, marginBottom: 8 }}>✅</div>
                <p style={{ fontFamily: "Cormorant SC", fontSize: 24, color: "var(--sage-dark)", fontWeight: 700 }}>
                  ₹{parseFloat(editedResult.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })} Deducted
                </p>
                <p style={{ color: "var(--text-soft)", fontSize: 14, marginTop: 4 }}>
                  from {editedResult.merchant}
                </p>
                <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
                  <a href="/" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>View Dashboard</a>
                  <button className="btn btn-primary btn-sm" onClick={handleReset}>Scan Another</button>
                </div>
              </div>
            </div>
          )}

          {ocrResult && !confirmed && editedResult && (
            <div className="ocr-result-card">
              <p style={{ fontFamily: "Cormorant SC", fontSize: 13, letterSpacing: 2, color: "var(--text-soft)", marginBottom: 8 }}>
                OCR EXTRACTED
              </p>

              <div className="ocr-field-group">
                <div>
                  <span className="ocr-edit-label">Merchant / Store</span>
                  <input
                    className="form-input"
                    value={editedResult.merchant}
                    onChange={(e) => edit("merchant", e.target.value)}
                    placeholder="Merchant name"
                    id="ocr-merchant-input"
                  />
                </div>

                <div>
                  <span className="ocr-edit-label">Amount (₹)</span>
                  <input
                    className="form-input"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={editedResult.amount}
                    onChange={(e) => edit("amount", e.target.value)}
                    placeholder="0.00"
                    id="ocr-amount-input"
                    style={{
                      fontSize: 28,
                      fontFamily: "Cormorant SC",
                      fontWeight: 700,
                      color: "var(--sage-dark)",
                      textAlign: "center",
                    }}
                  />
                </div>

                <div>
                  <span className="ocr-edit-label">Category</span>
                  <select
                    className="form-select"
                    value={editedResult.category}
                    onChange={(e) => edit("category", e.target.value)}
                    id="ocr-category-select"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <span className="ocr-edit-label">Date</span>
                  <input
                    className="form-input"
                    type="date"
                    value={editedResult.date}
                    onChange={(e) => edit("date", e.target.value)}
                  />
                </div>

                <div>
                  <span className="ocr-edit-label">Note</span>
                  <input
                    className="form-input"
                    value={editedResult.note}
                    onChange={(e) => edit("note", e.target.value)}
                    placeholder="Optional note"
                  />
                </div>
              </div>

              {/* Raw OCR Text toggle */}
              <div style={{ marginBottom: 16 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowRaw(!showRaw)}
                  style={{ marginBottom: 8 }}
                >
                  {showRaw ? "Hide" : "Show"} Raw OCR Text
                </button>
                {showRaw && (
                  <div className="ocr-raw-text">{ocrResult.rawText || "No text extracted"}</div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirm}
                  id="confirm-receipt-btn"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  ✅ Confirm & Deduct Balance
                </button>
                <button className="btn btn-secondary" onClick={handleReset}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How it works section */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-title">How Receipt Scanning Works</div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { step: "1", icon: "📷", text: "Upload a clear photo of your receipt" },
            { step: "2", icon: "🔍", text: "Tesseract OCR reads the text from the image" },
            { step: "3", icon: "🧠", text: "We parse merchant name, total amount & category" },
            { step: "4", icon: "✅", text: "You confirm or edit, then we deduct from your balance" },
          ].map(({ step, icon, text }) => (
            <div key={step} style={{ flex: "1 1 180px", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: "var(--sage)", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Cormorant SC", fontSize: 16, flexShrink: 0
              }}>{step}</div>
              <div>
                <div style={{ fontSize: 22 }}>{icon}</div>
                <p style={{ fontSize: 14, color: "var(--text-mid)", fontFamily: "Inter", lineHeight: 1.5 }}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Scan;
