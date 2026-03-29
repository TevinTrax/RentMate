import CountUp from "react-countup";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Building2,
  Wallet2,
  AlertTriangle,
  Home,
  Activity,
  ShieldCheck,
  Clock3,
  BarChart3,
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

  // FETCH USERS
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

  // FETCH PROPERTIES
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

  // FETCH PAYMENTS
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

  // HELPERS
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

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

  // USER ANALYTICS
  const totalUsers = users.length;

  const tenantsCount = users.filter(
    (u) => u.role?.toLowerCase() === "tenant"
  ).length;
  const landlordsCount = users.filter(
    (u) => u.role?.toLowerCase() === "landlord"
  ).length;
  const adminsCount = users.filter(
    (u) => u.role?.toLowerCase() === "admin"
  ).length;

  const approvedCount = users.filter(
    (u) => u.approval_status?.toLowerCase() === "approved"
  ).length;
  const pendingCount = users.filter(
    (u) => u.approval_status?.toLowerCase() === "pending"
  ).length;
  const rejectedCount = users.filter(
    (u) => u.approval_status?.toLowerCase() === "rejected"
  ).length;

  const activeCount = users.filter(
    (u) => u.account_status?.toLowerCase() === "active"
  ).length;
  const inactiveCount = users.filter(
    (u) => u.account_status?.toLowerCase() === "inactive"
  ).length;

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

  // PROPERTY ANALYTICS
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

  // PAYMENT / REVENUE ANALYTICS
  const totalRevenue = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || payment.total_amount || 0),
    0
  );

  const pendingPaymentsAmount = payments
    .filter((p) => p.status?.toLowerCase() === "pending")
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || payment.total_amount || 0),
      0
    );

  const paidPaymentsAmount = payments
    .filter(
      (p) =>
        p.status?.toLowerCase() === "paid" ||
        p.status?.toLowerCase() === "completed"
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || payment.total_amount || 0),
      0
    );

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

  // RECENT ACTIVITY
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

  // live INSIGHTS
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
    <section className="w-full min-h-screen bg-slate-50 px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8 pt-16">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 mt-2 text-base md:text-lg">
              Here’s what’s happening with RentMate today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {["weekly", "monthly", "yearly"].map((range) => (
              <button
                key={range}
                onClick={() => setFilterRange(range)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  filterRange === range
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 shadow-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 shadow-sm">
            Loading dashboard analytics...
          </div>
        )}

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <SummaryCard
            title="Total Users"
            value={<CountUp end={totalUsers} duration={2} separator="," />}
            subtitle="Live system count"
            icon={<Users size={28} className="text-white" />}
            iconBg="from-blue-500 to-blue-700"
            trend="up"
            bg="bg-white"
          />

          <SummaryCard
            title="Total Properties"
            value={<CountUp end={totalProperties} duration={2} separator="," />}
            subtitle="Live property count"
            icon={<Building2 size={28} className="text-white" />}
            iconBg="from-slate-500 to-slate-700"
            trend="up"
            bg="bg-white"
          />

          <SummaryCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle="Paid collections"
            icon={<Wallet2 size={28} className="text-white" />}
            iconBg="from-green-500 to-green-700"
            trend="up"
            bg="bg-white"
          />

          <SummaryCard
            title="Pending Payments"
            value={formatCurrency(pendingPaymentsAmount)}
            subtitle="Awaiting settlement"
            icon={<AlertTriangle size={28} className="text-white" />}
            iconBg="from-yellow-500 to-yellow-700"
            trend="down"
            bg="bg-white"
          />
        </div>

        {/* Main Spacious Analytics Layout */}
        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
          {/* LEFT SIDE */}
          <div className="2xl:col-span-8 space-y-6">
            {/* User Analytics */}
            <DashboardSection
              title="User Analytics Overview"
              subtitle="Live dashboard insights into user activity, approval status and growth"
              icon={<Users size={18} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <MiniStatCard label="Tenants" value={tenantsCount} color="blue" />
                <MiniStatCard label="Landlords" value={landlordsCount} color="green" />
                <MiniStatCard label="Admins" value={adminsCount} color="purple" />
                <MiniStatCard label="Approved Users" value={approvedCount} color="yellow" />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard title="User Role Distribution">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleData}
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        dataKey="value"
                        label
                      >
                        {roleData.map((entry, index) => (
                          <Cell
                            key={`role-cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Approval Status Breakdown">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={approvalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {approvalData.map((entry, index) => (
                          <Cell
                            key={`approval-cell-${index}`}
                            fill={APPROVAL_COLORS[index % APPROVAL_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Monthly User Registrations" className="xl:col-span-2">
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
                </ChartCard>

                <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-5">
                      Account Status
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <MiniStatusCard
                        title="Active Accounts"
                        value={activeCount}
                        color="green"
                      />
                      <MiniStatusCard
                        title="Inactive Accounts"
                        value={inactiveCount}
                        color="red"
                      />
                    </div>
                  </div>

                  <ChartCard title="Verification Summary">
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
                            <Cell
                              key={`verify-cell-${index}`}
                              fill={VERIFY_COLORS[index % VERIFY_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
              </div>
            </DashboardSection>

            {/* Property Analytics */}
            <DashboardSection
              title="Property Analytics"
              subtitle="Track occupancy, vacancies, maintenance and listing growth"
              icon={<Home size={18} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <MiniStatusCard title="Occupied" value={occupiedProperties} color="green" />
                <MiniStatusCard title="Vacant" value={vacantProperties} color="yellow" />
                <MiniStatusCard
                  title="Maintenance"
                  value={maintenanceProperties}
                  color="red"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard title="Occupancy Status">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyStatusData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
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
                </ChartCard>

                <ChartCard title="Properties Added by Month">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyPropertiesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="properties"
                        fill="#2563EB"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </DashboardSection>

            {/* Revenue */}
            <DashboardSection
              title="Revenue & Transactions"
              subtitle="Monitor collections, pending payments and financial performance"
              icon={<Wallet2 size={18} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <MiniStatusCard
                  title="Total Revenue"
                  value={formatCurrency(totalRevenue)}
                  color="green"
                />
                <MiniStatusCard
                  title="Paid"
                  value={formatCurrency(paidPaymentsAmount)}
                  color="blue"
                />
                <MiniStatusCard
                  title="Pending"
                  value={formatCurrency(pendingPaymentsAmount)}
                  color="yellow"
                />
              </div>

              <ChartCard title="Revenue Trend" className="mb-6">
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
              </ChartCard>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">
                  Recent Transactions
                </h4>
                <div className="space-y-3">
                  {recentPayments.length > 0 ? (
                    recentPayments.map((payment, index) => (
                      <div
                        key={payment.id || index}
                        className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            {payment.reference ||
                              payment.transaction_id ||
                              `Payment #${index + 1}`}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatDate(
                              payment.created_at ||
                                payment.payment_date ||
                                payment.paid_at
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800">
                            {formatCurrency(
                              payment.amount || payment.total_amount || 0
                            )}
                          </p>
                          <p
                            className={`text-xs font-semibold ${
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
                    <p className="text-sm text-slate-500">
                      No recent transactions found.
                    </p>
                  )}
                </div>
              </div>
            </DashboardSection>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="2xl:col-span-4 space-y-6">
            <DashboardSection
              title="Live Insights"
              subtitle="Quick intelligent summaries from platform data"
              icon={<BarChart3 size={18} />}
            >
              <div className="space-y-4">
                <InsightCard
                  icon={<TrendingUp size={18} className="text-blue-600" />}
                  title="User Growth Insight"
                  text={
                    <>
                      {approvedCount} of {totalUsers} users are approved.
                      Approval rate is{" "}
                      <span className="font-semibold text-blue-700">
                        {approvalRate}%
                      </span>
                      .
                    </>
                  }
                  color="blue"
                />

                <InsightCard
                  icon={<Building2 size={18} className="text-green-600" />}
                  title="Occupancy Insight"
                  text={
                    <>
                      Property occupancy is currently{" "}
                      <span className="font-semibold text-green-700">
                        {occupancyRate}%
                      </span>
                      .
                    </>
                  }
                  color="green"
                />

                <InsightCard
                  icon={<ShieldCheck size={18} className="text-purple-600" />}
                  title="Verification Insight"
                  text={
                    <>
                      {verifiedCount} users are verified. Verification rate is{" "}
                      <span className="font-semibold text-purple-700">
                        {verificationRate}%
                      </span>
                      .
                    </>
                  }
                  color="purple"
                />

                <InsightCard
                  icon={<Wallet2 size={18} className="text-yellow-600" />}
                  title="Revenue Insight"
                  text={
                    <>
                      Collected revenue is{" "}
                      <span className="font-semibold text-yellow-700">
                        {formatCurrency(paidPaymentsAmount)}
                      </span>{" "}
                      so far.
                    </>
                  }
                  color="yellow"
                />
              </div>
            </DashboardSection>

            <DashboardSection
              title="Recent Activity"
              subtitle="Latest platform actions and registrations"
              icon={<Activity size={18} />}
            >
              <div className="space-y-4">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user, index) => (
                    <div
                      key={user.id || index}
                      className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.first_name || "User"} {user.last_name || ""}
                          </p>
                          <p className="text-sm text-slate-500">
                            Registered as {user.role || "User"}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock3 size={14} />
                        {formatDate(user.created_at)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No recent user activity found.
                  </p>
                )}

                {recentProperties.length > 0 && (
                  <div className="pt-2">
                    <h5 className="text-sm font-semibold text-slate-700 mb-3">
                      Latest Properties
                    </h5>
                    <div className="space-y-3">
                      {recentProperties.slice(0, 3).map((property, index) => (
                        <div
                          key={property.id || index}
                          className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-green-100 flex items-center justify-center">
                              <Home size={18} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {property.apartment_name ||
                                  property.property_name ||
                                  property.title ||
                                  `Property #${index + 1}`}
                              </p>
                              <p className="text-sm text-slate-500">
                                {property.location ||
                                  property.address ||
                                  "Location unavailable"}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatDate(
                              property.created_at ||
                                property.date_created ||
                                property.posted_at
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DashboardSection>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;

// =========================
// REUSABLE COMPONENTS
// =========================

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  trend = "up",
  bg = "bg-white",
}) {
  return (
    <div
      className={`${bg} border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex items-center justify-between`}
    >
      <div className="flex-1">
        <p className="text-slate-500 font-medium">{title}</p>
        <h2 className="text-3xl font-bold text-slate-800 mt-2">{value}</h2>
        <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
          {trend === "up" ? (
            <TrendingUp size={16} className="text-green-500" />
          ) : (
            <TrendingDown size={16} className="text-red-500" />
          )}
          {subtitle}
        </p>
      </div>

      <div
        className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-md`}
      >
        {icon}
      </div>
    </div>
  );
}

function DashboardSection({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-2xl w-fit">
          {icon}
          Live Overview
        </div>
      </div>
      {children}
    </div>
  );
}

function ChartCard({ title, children, className = "" }) {
  return (
    <div
      className={`bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm ${className}`}
    >
      <h4 className="text-lg font-semibold text-slate-800 mb-4">{title}</h4>
      <div className="w-full h-[340px]">{children}</div>
    </div>
  );
}

function MiniStatCard({ label, value, color = "blue" }) {
  const styles = {
    blue: "from-blue-100 to-blue-50 border-blue-200 text-blue-700",
    green: "from-green-100 to-green-50 border-green-200 text-green-700",
    purple: "from-purple-100 to-purple-50 border-purple-200 text-purple-700",
    yellow: "from-yellow-100 to-yellow-50 border-yellow-200 text-yellow-700",
  };

  return (
    <div
      className={`p-5 rounded-3xl bg-gradient-to-br ${styles[color]} border shadow-sm`}
    >
      <p className="text-sm text-slate-600">{label}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function MiniStatusCard({ title, value, color = "blue" }) {
  const styles = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
  };

  return (
    <div className={`p-5 rounded-3xl border ${styles[color]}`}>
      <p className="text-sm text-slate-600">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function InsightCard({ icon, title, text, color = "blue" }) {
  const styles = {
    blue: "from-blue-50 to-white border-blue-200",
    green: "from-green-50 to-white border-green-200",
    purple: "from-purple-50 to-white border-purple-200",
    yellow: "from-yellow-50 to-white border-yellow-200",
  };

  return (
    <div
      className={`p-5 rounded-3xl bg-gradient-to-br ${styles[color]} border shadow-sm`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-bold text-slate-800">{title}</h4>
      </div>
      <p className="text-sm text-slate-600 leading-7">{text}</p>
    </div>
  );
}