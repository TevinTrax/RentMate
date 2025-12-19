import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import Home from "./pages/home.jsx";
import Features from "./pages/features.jsx";
import Properties from "./pages/properties.jsx";
import Getstarted from "./pages/getstarted.jsx";
import Contact  from "./pages/contact.jsx";
import AdminRegistration from "./components/adminregistration.jsx";
import LandlordRegistration from "./components/landlordRegistration.jsx";
import TenantRegistration from "./components/tenantregistration.jsx";
import SignIn from "./components/signin.jsx";
import Pricing from "./pages/pricing.jsx";
import Landing from "./pages/landing.jsx";
import FreeTrial from "./pages/freetrial.jsx";
import Testimonials from "./pages/testimonials.jsx";
import Advert from "./pages/advert.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/get-started" element={<Getstarted/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/free-trial" element={<FreeTrial/>}/>

          {/* menu navigation */}
          <Route path="/home" element={<Home/>}/>
          <Route path="/features" element={<Features/>}/>
          <Route path="/properties" element={<Properties/>}/>
          <Route path="/pricing" element={<Pricing/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/testimonials" element={<Testimonials/>}/>
          <Route path="/advert" element={<Advert/>}/>

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
