import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      {/* Each icon links to a page */}
      <Link to="/personal">
        <img src="public/profileIcon.png" className="icon" alt="Home" />
      </Link>
      <Link to="/personal">
        <img src="public/peopleIcon.png" className="icon" alt="Personal" />
      </Link>
      <Link to="/add">
        <img src="public/addIcon.png" className="icon" alt="Add" />
      </Link>
      <Link to="/settings">
        <img src="public/settingIcon.png" className="icon" alt="Settings" />
      </Link>
    </div>
  );
}

export default Sidebar;