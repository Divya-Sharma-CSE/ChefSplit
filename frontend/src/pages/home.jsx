import Header from "../components/header";
import Sidebar from "../components/sidebar";
import ActionButtons from "../components/actionButtons";

function Home() {
  return (
    <div className="container">

      <Header />

      <Sidebar />

      <main className="main">
        <ActionButtons />

        <img
          src="/lemon-left.png"
          className="lemon lemon-left"
        />
      </main>

    </div>
  );
}

export default Home;