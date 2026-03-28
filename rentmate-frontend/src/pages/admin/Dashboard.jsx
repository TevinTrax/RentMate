import CountUp from "react-countup";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Building2,
  Wallet2,
  AlertTriangle,
  UserPlus2,
  FileText,
  Bell,
  Home,
  Activity,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const [error, setError] = useState(null);
  const [filterRange, setFilterRange] = useState("monthly");

  const token = sessionStorage.getItem("token");

  // =========================
  // FETCH USERS
  // =========================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);

        const res = await fetch("http://localhost:5000/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("Users JSON parse error:", text);
          throw new Error("Users API returned invalid JSON");
        }

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch users");
        }

        // Safe response handling
        const usersArray = Array.isArray(data)
          ? data
          : Array.isArray(data.users)
          ? data.users
          : [];

        setUsers(usersArray);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [token]);

  // =========================
  // FETCH PROPERTIES
  // =========================
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoadingProperties(true);

        const res = await fetch(
          "http://localhost:5000/api/properties/allproperties",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await res.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("Properties JSON parse error:", text);
          throw new Error("Properties API returned invalid JSON");
        }

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch properties");
        }

        const propertiesArray = Array.isArray(data)
          ? data
          : Array.isArray(data.properties)
          ? data.properties
          : [];

        setProperties(propertiesArray);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err.message);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, [token]);

  // =========================
  // FETCH PAYMENTS (OPTIONAL)
  // =========================
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoadingPayments(true);

        const res = await fetch("http://localhost:5000/api/payments/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.warn("Payments endpoint invalid JSON or missing:", text);
          setPayments([]);
          return;
        }

        if (!res.ok) {
          console.warn("Payments fetch failed:", data.error || "No payments");
          setPayments([]);
          return;
        }

        const paymentsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.payments)
          ? data.payments
          : [];

        setPayments(paymentsArray);
      } catch (err) {
        console.warn("Payments endpoint not available:", err.message);
        setPayments([]);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [token]);

  // =========================
  // HELPERS
  // =========================
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString();
  };

  const getSafeDate = (dateValue) => {
    const d = new Date(dateValue);
    return isNaN(d.getTime()) ? null : d;
  };

  // =========================
  // USER ANALYTICS
  // =========================
  const totalUsers = users.length;

  const tenantsCount = users.filter((u) => u.role?.toLowerCase() === "tenant").length;
  const landlordsCount = users.filter((u) => u.role?.toLowerCase() === "landlord").length;
  const adminsCount = users.filter((u) => u.role?.toLowerCase() === "admin").length;

  const approvedCount = users.filter((u) => u.approval_status?.toLowerCase() === "approved").length;
  const pendingCount = users.filter((u) => u.approval_status?.toLowerCase() === "pending").length;
  const rejectedCount = users.filter((u) => u.approval_status?.toLowerCase() === "rejected").length;

  const activeCount = users.filter((u) => u.account_status?.toLowerCase() === "active").length;
  const inactiveCount = users.filter((u) => u.account_status?.toLowerCase() === "inactive").length;

  const verifiedCount = users.filter((u) => u.is_verified === true).length;
  const unverifiedCount = users.filter((u) => !u.is_verified).length;

  const roleData = [
    { name: "Tenants", value: tenantsCount },
    { name: "Landlords", value: landlordsCount },
    { name: "Admins", value: adminsCount },
  ];

  const approvalData = [
    { name: "Approved", value: approvedCount },
    { name: "Pending", value: pendingCount },
    { name: "Rejected", value: rejectedCount },
  ];

  const accountStatusData = [
    { name: "Active", value: activeCount },
    { name: "Inactive", value: inactiveCount },
  ];

  const verificationData = [
    { name: "Verified", value: verifiedCount },
    { name: "Unverified", value: unverifiedCount },
  ];

  const monthlyUsersData = useMemo(() => {
    const monthlyUsersMap = {};

    users.forEach((user) => {
      if (!user.created_at) return;

      const date = getSafeDate(user.created_at);
      if (!date) return;

      const month = date.toLocaleString("default", { month: "short" });
      monthlyUsersMap[month] = (monthlyUsersMap[month] || 0) + 1;
    });

    return monthOrder.map((month) => ({
      month,
      users: monthlyUsersMap[month] || 0,
    }));
  }, [users]);

  // =========================
  // PROPERTY ANALYTICS
  // =========================
  const totalProperties = properties.length;

  const occupiedProperties = properties.filter(
    (p) =>
      p.status?.toLowerCase() === "occupied" ||
      p.occupancy_status?.toLowerCase() === "occupied"
  ).length;

  const vacantProperties = properties.filter(
    (p) =>
      p.status?.toLowerCase() === "vacant" ||
      p.occupancy_status?.toLowerCase() === "vacant"
  ).length;

  const maintenanceProperties = properties.filter(
    (p) =>
      p.status?.toLowerCase() === "maintenance" ||
      p.occupancy_status?.toLowerCase() === "maintenance"
  ).length;

  const propertyStatusData = [
    { name: "Occupied", value: occupiedProperties },
    { name: "Vacant", value: vacantProperties },
    { name: "Maintenance", value: maintenanceProperties },
  ];

  const monthlyPropertiesData = useMemo(() => {
    const monthlyMap = {};

    properties.forEach((property) => {
      const rawDate =
        property.created_at || property.date_created || property.posted_at;
      if (!rawDate) return;

      const date = getSafeDate(rawDate);
      if (!date) return;

      const month = date.toLocaleString("default", { month: "short" });
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });

    return monthOrder.map((month) => ({
      month,
      properties: monthlyMap[month] || 0,
    }));
  }, [properties]);

  // =========================
  // PAYMENT / REVENUE ANALYTICS
  // =========================
  const totalRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || payment.total_amount || 0),
    0
  );

  const pendingPaymentsAmount = payments
    .filter((p) => p.status?.toLowerCase() === "pending")
    .reduce((sum, payment) => sum + Number(payment.amount || payment.total_amount || 0), 0);

  const paidPaymentsAmount = payments
    .filter((p) => p.status?.toLowerCase() === "paid" || p.status?.toLowerCase() === "completed")
    .reduce((sum, payment) => sum + Number(payment.amount || payment.total_amount || 0), 0);

  const revenueMonthlyData = useMemo(() => {
    const revenueMap = {};

    payments.forEach((payment) => {
      const rawDate =
        payment.created_at || payment.payment_date || payment.paid_at;
      if (!rawDate) return;

      const date = getSafeDate(rawDate);
      if (!date) return;

      const month = date.toLocaleString("default", { month: "short" });
      const amount = Number(payment.amount || payment.total_amount || 0);

      revenueMap[month] = (revenueMap[month] || 0) + amount;
    });

    return monthOrder.map((month) => ({
      month,
      revenue: revenueMap[month] || 0,
    }));
  }, [payments]);

  // =========================
  // RECENT ACTIVITY
  // =========================
  const recentUsers = [...users]
    .filter((u) => u.created_at)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const recentProperties = [...properties]
    .filter((p) => p.created_at || p.date_created || p.posted_at)
    .sort(
      (a, b) =>
        new Date(b.created_at || b.date_created || b.posted_at) -
        new Date(a.created_at || a.date_created || a.posted_at)
    )
    .slice(0, 5);

  const recentPayments = [...payments]
    .filter((p) => p.created_at || p.payment_date || p.paid_at)
    .sort(
      (a, b) =>
        new Date(b.created_at || b.payment_date || b.paid_at) -
        new Date(a.created_at || a.payment_date || a.paid_at)
    )
    .slice(0, 5);

  // =========================
  // AI INSIGHTS
  // =========================
  const occupancyRate =
    totalProperties > 0
      ? ((occupiedProperties / totalProperties) * 100).toFixed(1)
      : 0;

  const approvalRate =
    totalUsers > 0 ? ((approvedCount / totalUsers) * 100).toFixed(1) : 0;

  const verificationRate =
    totalUsers > 0 ? ((verifiedCount / totalUsers) * 100).toFixed(1) : 0;

  const PIE_COLORS = ["#3B82F6", "#10B981", "#8B5CF6"];
  const APPROVAL_COLORS = ["#22C55E", "#FACC15", "#EF4444"];
  const PROPERTY_COLORS = ["#16A34A", "#F59E0B", "#EF4444"];
  const VERIFY_COLORS = ["#2563EB", "#9CA3AF"];

  const isLoading = loadingUsers || loadingProperties || loadingPayments;

  return (
    <section className="w-full p-2">
      <div className="p-4">
        {/* Header */}
        <div className="text-gray-800 pt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold py-2">Dashboard Overview</h1>
            <p className="text-md text-gray-700">
              Here's what's happening with RentMate today.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {["weekly", "monthly", "yearly"].map((range) => (
              <button
                key={range}
                onClick={() => setFilterRange(range)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filterRange === range
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            Loading dashboard analytics...
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
          {/* Total Users */}
          <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-md">
            <div className="flex-1">
              <p className="text-gray-700 font-semibold">Total Users</p>
              <h2 className="text-xl font-bold text-gray-800 py-1">
                <CountUp end={totalUsers} duration={2} separator="," />
              </h2>
              <p className="text-sm text-gray-600">
                <span className="text-green-500 inline-flex items-center">
                  <TrendingUp size={16} className="mr-1" /> Live system count
                </span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Users size={28} className="text-white" />
            </div>
          </div>

          {/* Total Properties */}
          <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
            <div className="flex-1">
              <p className="text-gray-700 font-semibold">Total Properties</p>
              <h2 className="text-xl font-bold text-gray-800 py-1">
                <CountUp end={totalProperties} duration={2} separator="," />
              </h2>
              <p className="text-sm text-gray-600">
                <span className="text-green-500 inline-flex items-center">
                  <TrendingUp size={16} className="mr-1" /> Live property count
                </span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center">
              <Building2 size={28} className="text-gray-800" />
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg shadow-md">
            <div className="flex-1">
              <p className="text-gray-700 font-semibold">Total Revenue</p>
              <h2 className="text-xl font-bold text-gray-800 py-1">
                {formatCurrency(totalRevenue)}
              </h2>
              <p className="text-sm text-gray-600">
                <span className="text-green-500 inline-flex items-center">
                  <TrendingUp size={16} className="mr-1" /> Paid collections
                </span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <Wallet2 size={28} className="text-white" />
            </div>
          </div>

          {/* Pending Payments */}
          <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md">
            <div className="flex-1">
              <p className="text-gray-700 font-semibold">Pending Payments</p>
              <h2 className="text-xl font-bold text-gray-800 py-1">
                {formatCurrency(pendingPaymentsAmount)}
              </h2>
              <p className="text-sm text-gray-600">
                <span className="text-red-500 inline-flex items-center">
                  <TrendingDown size={16} className="mr-1" /> Awaiting settlement
                </span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
              <AlertTriangle size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-red-500 my-6 gap-4 p-4">
          {/* 1. PROPERTY ANALYTICS */}
          <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 text-lg font-bold">Property Analytics</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Home size={16} /> Live Overview
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <p className="text-sm text-gray-500">Occupied</p>
                <h4 className="text-2xl font-bold text-green-600">{occupiedProperties}</h4>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <p className="text-sm text-gray-500">Vacant</p>
                <h4 className="text-2xl font-bold text-yellow-600">{vacantProperties}</h4>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <p className="text-sm text-gray-500">Maintenance</p>
                <h4 className="text-2xl font-bold text-red-600">{maintenanceProperties}</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Occupancy Status</h4>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyStatusData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        label
                      >
                        {propertyStatusData.map((entry, index) => (
                          <Cell
                            key={`property-cell-${index}`}
                            fill={PROPERTY_COLORS[index % PROPERTY_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Properties Added by Month</h4>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyPropertiesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="properties" fill="#2563EB" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 2. USER ANALYTICS */}
          <div className="border border-gray-300 p-6 rounded-2xl shadow-md bg-white">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h3 className="text-gray-800 text-2xl font-bold">User Analytics Overview</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Live dashboard insights into user activity, approval status, and growth
                </p>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
                <p className="text-sm text-gray-500">Total Registered Users</p>
                <h2 className="text-2xl font-bold text-blue-700">{totalUsers}</h2>
              </div>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 shadow-sm">
                <p className="text-sm text-gray-600">Tenants</p>
                <h2 className="text-3xl font-bold text-blue-700 mt-2">{tenantsCount}</h2>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 border border-green-200 shadow-sm">
                <p className="text-sm text-gray-600">Landlords</p>
                <h2 className="text-3xl font-bold text-green-700 mt-2">{landlordsCount}</h2>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 shadow-sm">
                <p className="text-sm text-gray-600">Admins</p>
                <h2 className="text-3xl font-bold text-purple-700 mt-2">{adminsCount}</h2>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-200 shadow-sm">
                <p className="text-sm text-gray-600">Approved Users</p>
                <h2 className="text-3xl font-bold text-yellow-700 mt-2">{approvedCount}</h2>
              </div>
            </div>

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* PIE CHART - ROLE DISTRIBUTION */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">User Role Distribution</h4>
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        {roleData.map((entry, index) => (
                          <Cell key={`role-cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* BAR CHART - APPROVAL STATUS */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Approval Status Breakdown</h4>
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={approvalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {approvalData.map((entry, index) => (
                          <Cell key={`approval-cell-${index}`} fill={APPROVAL_COLORS[index % APPROVAL_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* LINE CHART - MONTHLY USERS */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm xl:col-span-2">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly User Registrations</h4>
                <div className="w-full h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyUsersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ACCOUNT STATUS + VERIFICATION */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm xl:col-span-2">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Account & Verification Summary</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="p-5 rounded-2xl bg-green-50 border border-green-200">
                    <p className="text-sm text-gray-600">Active Accounts</p>
                    <h2 className="text-3xl font-bold text-green-700 mt-2">{activeCount}</h2>
                  </div>

                  <div className="p-5 rounded-2xl bg-red-50 border border-red-200">
                    <p className="text-sm text-gray-600">Inactive Accounts</p>
                    <h2 className="text-3xl font-bold text-red-700 mt-2">{inactiveCount}</h2>
                  </div>
                </div>

                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={verificationData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {verificationData.map((entry, index) => (
                          <Cell key={`verify-cell-${index}`} fill={VERIFY_COLORS[index % VERIFY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 3. REVENUE / TRANSACTIONS */}
          <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 text-lg font-bold">Revenue & Transactions</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Wallet2 size={16} /> Financial Analytics
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h4 className="text-xl font-bold text-green-600">{formatCurrency(totalRevenue)}</h4>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <p className="text-sm text-gray-500">Paid</p>
                <h4 className="text-xl font-bold text-blue-600">{formatCurrency(paidPaymentsAmount)}</h4>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <p className="text-sm text-gray-500">Pending</p>
                <h4 className="text-xl font-bold text-yellow-600">{formatCurrency(pendingPaymentsAmount)}</h4>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Revenue Trend</h4>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#16A34A"
                      fill="#BBF7D0"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Recent Transactions</h4>
              <div className="space-y-3">
                {recentPayments.length > 0 ? (
                  recentPayments.map((payment, index) => (
                    <div
                      key={payment.id || index}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {payment.reference || payment.transaction_id || `Payment #${index + 1}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(payment.created_at || payment.payment_date || payment.paid_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          {formatCurrency(payment.amount || payment.total_amount || 0)}
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            payment.status?.toLowerCase() === "paid" ||
                            payment.status?.toLowerCase() === "completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {payment.status || "Pending"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent transactions found.</p>
                )}
              </div>
            </div>
          </div>

          {/* 4. AI INSIGHTS / RECENT ACTIVITY */}
          <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 text-lg font-bold">Activity & Insights</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Activity size={16} /> Smart Summary
              </div>
            </div>

            {/* AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-blue-600" />
                  <h4 className="font-bold text-gray-800">User Growth Insight</h4>
                </div>
                <p className="text-sm text-gray-600">
                  {approvedCount} of {totalUsers} users are approved. Approval rate is{" "}
                  <span className="font-semibold text-blue-700">{approvalRate}%</span>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={18} className="text-green-600" />
                  <h4 className="font-bold text-gray-800">Occupancy Insight</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Property occupancy is currently{" "}
                  <span className="font-semibold text-green-700">{occupancyRate}%</span>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={18} className="text-purple-600" />
                  <h4 className="font-bold text-gray-800">Verification Insight</h4>
                </div>
                <p className="text-sm text-gray-600">
                  {verifiedCount} users are verified. Verification rate is{" "}
                  <span className="font-semibold text-purple-700">{verificationRate}%</span>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet2 size={18} className="text-yellow-600" />
                  <h4 className="font-bold text-gray-800">Revenue Insight</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Collected revenue is{" "}
                  <span className="font-semibold text-yellow-700">
                    {formatCurrency(paidPaymentsAmount)}
                  </span>{" "}
                  so far.
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <h4 className="text-md font-semibold text-gray-800 mb-4">Recent Activity</h4>

              <div className="space-y-3">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user, index) => (
                    <div
                      key={user.id || index}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {user.first_name || "User"} {user.last_name || ""}
                          </p>
                          <p className="text-sm text-gray-500">
                            Registered as {user.role || "User"}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock3 size={14} />
                        {formatDate(user.created_at)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent user activity found.</p>
                )}

                {recentProperties.length > 0 && (
                  <div className="pt-2">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Latest Properties</h5>
                    <div className="space-y-2">
                      {recentProperties.slice(0, 3).map((property, index) => (
                        <div
                          key={property.id || index}
                          className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Home size={18} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {property.apartment_name ||
                                  property.property_name ||
                                  property.title ||
                                  `Property #${index + 1}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {property.location || property.address || "Location unavailable"}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(
                              property.created_at || property.date_created || property.posted_at
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;