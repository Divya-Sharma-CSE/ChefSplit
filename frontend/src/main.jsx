import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx";
//import Personal from "./pages/personal.jsx";
//import Add from "./pages/add.jsx";         // create this page
//import Settings from "./pages/settings.jsx"; // create this page
import Sidebar from "./components/sidebar.jsx";

import "./site.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <div className="app-container" style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content area */}
        <div className="page-content" style={{ flex: 1, overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<Home />} />
    
          </Routes>
        </div>
      </div>
    </Router>
  </React.StrictMode>
);

/* 
<Route path="/personal" element={<Personal />} />
<Route path="/add" element={<Add />} />
<Route path="/settings" element={<Settings />} />
*/