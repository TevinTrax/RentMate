import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/scrolltotop.jsx";


/* Layouts */
import PublicLayout from "./pages/public/PublicLayout";
import AdminLayout from "./pages/admin/AdminLayout";

/* =======================
   PUBLIC PAGES
======================= */
import Home from "./pages/public/Home.jsx";
import Landing from "./pages/public/Landing.jsx";
import AboutUs from "./pages/public/AboutUs.jsx";
import Features from "./pages/public/Features.jsx";
import Pricing from "./pages/public/Pricing.jsx";
import Properties from "./pages/public/Properties.jsx";
import Contact from "./pages/public/Contact.jsx";
import Testimonials from "./pages/public/Testimonials.jsx";
import Advert from "./pages/public/Advert.jsx";
import Support from "./pages/public/Support.jsx";
import Faqs from "./pages/public/Faqs.jsx";
import Checkout from "./pages/public/Checkout.jsx";
import FreeTrial from "./pages/public/FreeTrial.jsx";

/* =======================
   AUTHENTICATION PAGES
======================= */
import SignIn from "./pages/authentication/SignIn.jsx";
import ForgotPassword from "./pages/authentication/ForgotPassword.jsx";
import GetStarted from "./pages/authentication/GetStarted.jsx";
import AdminRegistration from "./pages/authentication/AdminRegistration.jsx";
import LandlordRegistration from "./pages/authentication/LandlordRegistration.jsx";
import TenantRegistration from "./pages/authentication/TenantRegistration.jsx";

/* =======================
   ADMIN PAGES
======================= */
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminProperties from "./pages/admin/Properties.jsx";
import AdminPayments from "./pages/admin/Payments.jsx";
import AdminPaymentsReports from "./pages/admin/PaymentReports.jsx";
import AdminPaymentsTransactions from "./pages/admin/Transactions.jsx";
import AdminPackageSubscriptions from "./pages/admin/Subscriptions.jsx";
import AdminPaymentsFeesDiscounts from "./pages/admin/FeesDiscounts.jsx";
// import AdminReports from "./pages/admin/Reports.jsx";
// import AdminSettings from "./pages/admin/Settings.jsx";

// /* =======================
//    LANDLORD PAGES
// ======================= */
// import LandlordDashboard from "./pages/landlord/Dashboard.jsx";
// import LandlordProperties from "./pages/landlord/Properties.jsx";
// import LandlordTenants from "./pages/landlord/Tenants.jsx";
// import LandlordMaintenance from "./pages/landlord/Maintenance.jsx";
// import LandlordPayments from "./pages/landlord/Payments.jsx";
// import LandlordReports from "./pages/landlord/Reports.jsx";
// import LandlordSettings from "./pages/landlord/Settings.jsx";   

// /* =======================
//    TENANT PAGES
// ======================= */
// import TenantDashboard from "./pages/tenant/Dashboard.jsx";
// import TenantApartment from "./pages/tenant/Apartment.jsx";
// import TenantMaintenance from "./pages/tenant/Maintenance.jsx";
// import TenantPayments from "./pages/tenant/Payments.jsx";
// import TenantSettings from "./pages/tenant/Settings.jsx";

function App() {
  return (
    <>
      <ScrollToTop />

          <Routes>
            {/* ========= PUBLIC ROUTES ========= */}
            <Route path="/" element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/advert" element={<Advert />} />
              <Route path="/support" element={<Support />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/free-trial" element={<FreeTrial />} />

              {/* ========= AUTH ROUTES ========= */}
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/register/:role" element={<AdminRegistration />} />
              <Route path="/register/landlord" element={<LandlordRegistration />} />
              <Route path="/register/tenant" element={<TenantRegistration />} />
            </Route>

            {/* ========= ADMIN ROUTES ========= */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/payments" element={<AdminPayments />}>
                <Route path="/admin/payments/transactions" element={<AdminPaymentsTransactions />} />
                <Route path="/admin/payments/package-subscriptions" element={<AdminPackageSubscriptions />} /> 
                <Route path="/admin/payments/payment-reports" element={<AdminPaymentsReports />} />
                <Route path="/admin/payments/fees-discounts" element={<AdminPaymentsFeesDiscounts />} />
                {/* <Route path="/admin/payments/audit-logs" element={<AdminPaymentsAuditLogs />} /> */}
              </Route>
            </Route>

            {/* ========= LANDLORD ROUTES ========= */}
            {/* <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/properties" element={<LandlordProperties />} />
            <Route path="/landlord/tenants" element={<LandlordTenants />} />
            <Route path="/landlord/maintenance" element={<LandlordMaintenance />} />
            <Route path="/landlord/payments" element={<LandlordPayments />} />
            <Route path="/landlord/reports" element={<LandlordReports />} />
            <Route path="/landlord/settings" element={<LandlordSettings />} /> */}

            {/* ========= TENANT ROUTES ========= */}
            {/* <Route path="/tenant/dashboard" element={<TenantDashboard />} />
            <Route path="/tenant/apartment" element={<TenantApartment />} />
            <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
            <Route path="/tenant/payments" element={<TenantPayments />} />
            <Route path="/tenant/settings" element={<TenantSettings />} /> */}
          </Routes>
    </>
  );
}

export default App;
