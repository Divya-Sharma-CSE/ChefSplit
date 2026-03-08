import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/sidebar.jsx";
import Header from "./components/header.jsx";
import { ToastProvider } from "./components/toast.jsx";

import Home from "./pages/home.jsx";
import Expenses from "./pages/expenses.jsx";
import Scan from "./pages/scan.jsx";
import Analytics from "./pages/analytics.jsx";
import Settings from "./pages/settings.jsx";

import "./site.css";

function App() {
  return (
    <Router>
      <ToastProvider>
        <div className="app-container">
          <Sidebar />
          <div className="page-content">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </ToastProvider>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);