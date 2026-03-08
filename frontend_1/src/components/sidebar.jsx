import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
    ),
  },
  {
    to: "/expenses",
    label: "Expenses",
    icon: (
      <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M8 15h4"/></svg>
    ),
  },
  {
    to: "/scan",
    label: "Scan",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="4" y="4" width="6" height="6" rx="1"/>
        <rect x="14" y="4" width="6" height="6" rx="1"/>
        <rect x="4" y="14" width="6" height="6" rx="1"/>
        <path d="M14 14h2m4 0v2m0 4h-6m2-2v2m4-6v2"/>
      </svg>
    ),
  },
  {
    to: "/analytics",
    label: "Charts",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
    ),
  },
  {
    to: "/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

function Sidebar() {
  return (
    <div className="sidebar">
<<<<<<< HEAD
      <div className="sidebar-logo">CS</div>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          {item.icon}
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
=======
      {/* Each icon links to a page */}
      <Link to="/personal">
        <img src="images/profileIcon.png" className="icon" alt="Home" />
      </Link>
      <Link to="/personal">
        <img src="images/peopleIcon.png" className="icon" alt="Personal" />
      </Link>
      <Link to="/add">
        <img src="images/addIcon.png" className="icon" alt="Add" />
      </Link>
      <Link to="/settings">
        <img src="images/settingIcon.png" className="icon" alt="Settings" />
      </Link>
      
>>>>>>> f62ed4479e4baa7fd35466adb180536ff39d7645
    </div>
  );
}

export default Sidebar;