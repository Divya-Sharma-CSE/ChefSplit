import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/sidebar.jsx";
import Header from "./components/header.jsx";
import { ToastProvider } from "./components/toast.jsx";

import Home from "./pages/home.jsx";
<<<<<<< HEAD
import Expenses from "./pages/expenses.jsx";
import Scan from "./pages/scan.jsx";
import Analytics from "./pages/analytics.jsx";
import Settings from "./pages/settings.jsx";
=======
//import Personal from "./pages/personal.jsx";
//import Add from "./pages/add.jsx";         // create this page
import Settings from "./pages/settings.jsx";
import Sidebar from "./components/sidebar.jsx";
>>>>>>> f62ed4479e4baa7fd35466adb180536ff39d7645

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
<<<<<<< HEAD
    <App />
=======
    <Router>
      <div className="app-container" style={{ display: "flex", height: "100vh" }}>
        

        {/* Main content area */}
        <div className="page-content" style={{ flex: 1, overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
>>>>>>> f62ed4479e4baa7fd35466adb180536ff39d7645
  </React.StrictMode>
);