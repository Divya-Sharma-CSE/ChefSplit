import React from "react";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";
import ActionButtons from "../components/actionButtons.jsx";

function Home() {
  return (
    <div className="container">

      <Header />

      <Sidebar />

      <main className="main">
        <ActionButtons />

        <img
          src="images\lemons.png"
          className="lemon lemon-left"
        />
      </main>

    </div>
  );
}

export default Home;