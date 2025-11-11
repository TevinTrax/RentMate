import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import Home from "./pages/home.jsx";
import Features from "./pages/features.jsx";
import Properties from "./pages/properties.jsx";
import Extras from "./pages/extras.jsx";
import Getstarted from "./pages/getstarted.jsx";
import Contact  from "./pages/contact.jsx";
import AdminRegistration from "./components/adminregistration.jsx";
import LandlordRegistration from "./components/landlordRegistration.jsx";
import TenantRegistration from "./components/tenantregistration.jsx";
import SignIn from "./components/signin.jsx";
import Pricing from "./pages/pricing.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/get-started" element={<Getstarted/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>

          {/* menu navigation */}
          <Route path="/" element={<> <Home /><Features/><Properties/><Contact/><Extras/></>}/>
          <Route path="/features" element={<><Home /><Features/><Properties/><Contact/><Extras/></>}/>
          <Route path="/pricing" element={<Pricing/>}/>

          {/* Routes to registration pages */}
          <Route path="/adminregistration" element={<AdminRegistration/>}/>
          <Route path="/landlordregistration" element={<LandlordRegistration/>}/>
          <Route path="/tenantregistration" element={<TenantRegistration/>}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
