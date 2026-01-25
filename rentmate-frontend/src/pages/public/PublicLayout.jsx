import Navbar from "../../components/navbar.jsx";
import Footer from "../../components/footer.jsx";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;
