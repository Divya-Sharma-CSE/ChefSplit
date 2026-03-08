import React from "react";

const CATEGORY_ICONS = {
  Food: "🍜", Grocery: "🛒", Transport: "🚗", Health: "💊",
  Entertainment: "🎬", Shopping: "🛍️", Utilities: "💡", Other: "📌",
};

const CAT_COLORS = {
  Food: "#e8a87c", Grocery: "#7dc87d", Transport: "#7db8e8",
  Health: "#e87db8", Entertainment: "#b87de8", Shopping: "#e8d87d",
  Utilities: "#7de8d8", Other: "#b0b8b0",
};

function ExpenseItem({ expense, onDelete, categoryIcons = CATEGORY_ICONS, catColors = CAT_COLORS }) {
  const icon = categoryIcons[expense.category] ?? "📌";
  const color = catColors[expense.category] ?? "#b0b8b0";

  const formattedDate = expense.date
    ? new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "";

  return (
    <div className="expense-item">
      <div className="expense-cat-icon" style={{ background: color + "28" }}>
        {icon}
      </div>
      <div className="expense-info">
        <div className="expense-name">{expense.name}</div>
        <div className="expense-meta">
          <span>{expense.category}</span>
          {formattedDate && <><span className="sep">•</span><span>{formattedDate}</span></>}
          {expense.source === "receipt" && (
            <span className="expense-source-badge">Receipt</span>
          )}
          {expense.note && <><span className="sep">•</span><span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{expense.note}</span></>}
        </div>
      </div>
      <div className="expense-amount">
        − ₹{expense.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </div>
      {onDelete && (
        <button
          className="expense-delete"
          onClick={() => onDelete(expense.id)}
          title="Delete expense"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export default ExpenseItem;
