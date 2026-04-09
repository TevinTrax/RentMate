import { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Home,
  CreditCard,
  Wrench,
  MessageSquare,
  Wifi,
  Shield,
  Sofa,
  Activity,
  Users,
  Hash,
  MapPin
} from "lucide-react";
import CountUp from "react-countup";

function TenantDashboard() {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const fetchTenant = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      if (!token) {
        setNotice("No token found. Please log in again.");
        setTenant(null);
        return;
      }

      const res = await fetch("http://localhost:5000/api/users/tenant/approved", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.tenant) {
        setNotice(data.message || "Unable to load tenant data.");
        setTenant(null);
      } else {
        setTenant(data.tenant);
        setNotice("");
      }
    } catch (error) {
      console.error("Error fetching tenant:", error);
      setNotice("Unable to load tenant data.");
      setTenant(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, []);

  if (loading) {
    return (
      <section className="w-full p-6 bg-gray-50">
        <p className="text-gray-600 text-center mt-24">Loading your dashboard...</p>
      </section>
    );
  }

  if (!tenant) {
    return (
      <section className="w-full p-6 bg-gray-50">
        <p className="text-gray-600 text-center mt-24">{notice || "Unable to load tenant data."}</p>
      </section>
    );
  }

  const isApproved = tenant.tenant_approval_status === "approved";

  // Map amenities dynamically from tenant data
  const amenities = [
    { label: "Wifi", available: tenant.wifi, icon: <Wifi size={16} /> },
    { label: "Security", available: tenant.security, icon: <Shield size={16} /> },
    { label: "Furnished", available: tenant.furnished, icon: <Sofa size={16} /> },
    { label: "Gym", available: tenant.has_gym, icon: <Activity size={16} /> },
    { label: "Parking", available: tenant.has_parking, icon: <Users size={16} /> },
    { label: "Pool", available: tenant.has_pool, icon: <Activity size={16} /> },
  ];

  return (
    <section className="w-full p-6 bg-gray-50">
      {/* Greeting */}
      <div className="pt-16">
        <h1 className="text-3xl font-bold text-gray-800 py-2">
          Good afternoon, {tenant.first_name}!
        </h1>
        <p className="text-md text-gray-600">
          Here's what's happening with your rental today.
        </p>
      </div>

      {/* Alert Banner */}
      {tenant.tenant_approval_status !== "approved" && (
        <div
          className={`p-3 rounded my-4 ${
            tenant.tenant_approval_status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {tenant.tenant_approval_status === "pending"
            ? "Your account is awaiting landlord approval. Main features are disabled."
            : "Your account was rejected. Contact support."}
        </div>
      )}

      {/* Top Cards */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {/* Next Rent Due */}
        <div className="border border-gray-200 bg-white p-4 rounded-lg">
          <div className="flex gap-2 items-center">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Calendar size={20} className="text-green-600" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">Next Rent Due</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 pt-2">
            {tenant.next_rent_due}
          </h2>
          <p className="text-xs font-semibold text-gray-700 py-1">
            {tenant.days_remaining} days remaining
          </p>
        </div>

        {/* Outstanding Balance */}
        <div className="border border-gray-200 bg-white p-4 rounded-lg">
          <div className="flex gap-2 items-center">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <DollarSign size={20} className="text-yellow-600" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">Outstanding Balance</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 pt-2">
            KES <CountUp end={Number(tenant.outstanding_balance)} separator="," />
          </h2>
          <p className="text-xs font-semibold text-gray-700 py-1">Current amount due</p>
        </div>

        {/* Lease Ends */}
        <div className="border border-gray-200 bg-white p-4 rounded-lg">
          <div className="flex gap-2 items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">Lease Ends</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 pt-2">{tenant.lease_end_date}</h2>
          <p className="text-xs font-semibold text-gray-700 py-1">Active lease</p>
        </div>

        {/* Last Payment */}
        <div className="border border-gray-200 bg-white p-4 rounded-lg">
          <div className="flex gap-2 items-center">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Clock size={20} className="text-green-800" />
            </div>
            <p className="text-gray-600 text-sm font-semibold">Last Payment</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 pt-2">{tenant.last_payment_date}</h2>
          <p className="text-xs font-semibold text-gray-700 py-1">Paid on time</p>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex gap-4 p-4 mt-4">
        {/* Left Column */}
        <div className="flex-1 space-y-4">
          {/* Rent Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rent Status Card */}
            <div className="border border-gray-200 p-4 space-y-4 rounded-lg bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold text-gray-700">Rent Status</h3>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-100">
                  <Clock size={20} className="text-yellow-600" />
                </div>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-gray-900">
                  KES <CountUp end={Number(tenant.monthly_rent)} separator="," />
                </h4>
                <p className="text-sm text-gray-500 py-1">Monthly Rent</p>
              </div>
              {/* Payment Period */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-500">Payment Period</p>
                  <p className="text-sm text-yellow-500">
                    {tenant.days_remaining} {tenant.days_remaining === 1 ? "day" : "days"} Left
                  </p>
                </div>
                {/* Progress Line */}
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-yellow-500 rounded-full"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, ((tenant.rent_due_day - tenant.days_remaining) / tenant.rent_due_day) * 100)
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-yellow-500">Payment due on {tenant.next_rent_due}</p>
              <button
                disabled={!isApproved}
                className={`w-full py-2 text-sm font-semibold rounded-lg text-white transition ${
                  !isApproved ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-black"
                }`}
              >
                Pay Now
              </button>
            </div>

            {/* Property Info */}
            <div className="border border-gray-200 p-4 space-y-4 rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold text-gray-700">Your Property</h3>
                <span className="text-xs px-4 py-1 rounded-full bg-green-500 text-white">Active</span>
              </div>               
              <div className="space-y-2">
                {/* Property Details with Icons */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Home size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 font-semibold">Apartment Name</h4>
                    <p className="text-gray-700 font-semibold">{tenant.apartment_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Hash size={16} className="text-green-600" />
                  </div>    
                  <div>
                    <h4 className="text-sm text-gray-500 font-semibold">House No</h4>                
                    <p className="text-gray-700 font-semibold">{tenant.house_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <MapPin size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 font-semibold">Address</h4>                    
                    <p className="text-gray-700 font-semibold">{tenant.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CreditCard size={16} className="text-green-600" />
                  </div>  
                  <div>
                    <h4 className="text-sm text-gray-500 font-semibold">Landlord Name</h4>                  
                    <p className="text-gray-700 font-semibold">{tenant.manager_first_name} {tenant.manager_last_name}</p>
                  </div>
                </div>
                {/* Amenities Section */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                        item.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Requests */}
          <div className="border border-gray-300 bg-white rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-md font-semibold text-gray-800">Maintenance Requests</h1>
              <button
                disabled={!isApproved}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  !isApproved
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "text-green-600 hover:bg-green-600 hover:text-gray-200"
                }`}
              >
                View All
              </button>
            </div>
            <button
              disabled={!isApproved}
              className={`w-full rounded-lg border border-gray-200 flex items-center justify-center py-2 text-sm font-bold gap-2 ${
                !isApproved ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "text-gray-800 bg-gray-100 hover:bg-violet-600 hover:text-white"
              }`}
            >
              <Wrench size={20} />
              Submit New Request
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-80 space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <h5 className="text-md font-bold text-gray-800">Quick Actions</h5>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div
                disabled={!isApproved}
                className={`border border-gray-200 rounded-lg p-4 shadow-md ${
                  !isApproved ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer"
                }`}
              >
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CreditCard size={20} className="text-green-800" />
                </div>
                <p className="text-sm text-gray-800 py-1 font-semibold">Pay Rent</p>
              </div>

              <div
                disabled={!isApproved}
                className={`border border-gray-200 rounded-lg p-4 shadow-md ${
                  !isApproved ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer"
                }`}
              >
                <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Wrench size={20} className="text-yellow-500" />
                </div>
                <p className="text-sm text-gray-800 py-1 font-semibold">Request Repair</p>
              </div>

              <div
                disabled={!isApproved}
                className={`border border-gray-200 rounded-lg p-4 shadow-md ${
                  !isApproved ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer"
                }`}
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText size={20} className="text-blue-500" />
                </div>
                <p className="text-sm text-gray-800 py-1 font-semibold">View Lease</p>
              </div>

              <div
                disabled={!isApproved}
                className={`border border-gray-200 rounded-lg p-4 shadow-md ${
                  !isApproved ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer"
                }`}
              >
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <MessageSquare size={20} className="text-violet-500" />
                </div>
                <p className="text-sm text-gray-800 py-1 font-semibold">Contact Manager</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="border border-blue-500 rounded-lg bg-white p-4">
            <h2 className="text-md font-semibold text-gray-800">Recent Notifications</h2>
            <div className="h-72 border border-red-500 mt-4 overflow-y-scroll">
              {/* Notifications go here */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TenantDashboard;