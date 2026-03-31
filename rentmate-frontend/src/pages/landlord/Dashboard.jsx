import CountUp from "react-countup";
import {
  TrendingDown,
  TrendingUp,
  Wallet2,
  Users,
  AlertTriangle,
  Building2,
  Clock,
  Home,
  FileText,
  UserPlus2,
  Bell,
  Activity,
  CheckCircle2,
  XCircle,
  CalendarDays,
  ArrowRight,
  RefreshCw,
  BadgeDollarSign,
  ShieldCheck,
  CircleDollarSign,
  HousePlus,
  ClipboardList,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const API_BASE = "http://localhost:5000";
const SOCKET_URL = "http://localhost:5000";

function LandlordDashboard() {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  const [approvalStatus, setApprovalStatus] = useState(null);

  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertyError, setPropertyError] = useState(null);

  const [tenantStats, setTenantStats] = useState({
    count: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  });

  const [paymentOverview, setPaymentOverview] = useState({
    monthlyRevenue: 0,
    pendingPayments: 0,
    overdueRent: 0,
    collectionRate: 0,
    revenueTrend: 0,
    pendingTrend: 0,
    overdueTrend: 0,
    paymentMethodBreakdown: [],
    monthlyRevenueSeries: [],
    recentTransactions: [],
  });

  const [leaseOverview, setLeaseOverview] = useState({
    occupancyRate: 0,
    activeLeases: 0,
    vacantUnits: 0,
    expiringSoon: 0,
    leaseTrend: 0,
    occupancyTrend: 0,
    propertyOccupancyBreakdown: [],
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // -------------------------------
  // Helpers
  // -------------------------------
  const authHeaders = useMemo(() => {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [token]);

  const formatKES = (value) =>
    `KES ${Number(value || 0).toLocaleString("en-KE")}`;

  const formatDateTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

  // -------------------------------
  // Fetch Functions
  // -------------------------------
  const fetchProperties = useCallback(async () => {
    try {
      setLoadingProperties(true);
      setPropertyError(null);

      const res = await fetch(`${API_BASE}/api/properties/myproperties`, {
        headers: authHeaders,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch properties");
      }

      setProperties(data.properties || []);
    } catch (err) {
      setPropertyError(err.message);
    } finally {
      setLoadingProperties(false);
    }
  }, [authHeaders]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        headers: authHeaders,
      });

      const data = await res.json();
      if (res.ok) {
        setApprovalStatus(data.approval_status || null);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  }, [authHeaders]);

  const fetchLandlordTenants = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/users/landlord/landlord-tenants`,
        {
          method: "GET",
          headers: authHeaders,
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setTenantStats({
          count: Number(data.count) || 0,
          approvedCount: Number(data.approvedCount) || 0,
          pendingCount: Number(data.pendingCount) || 0,
          rejectedCount: Number(data.rejectedCount) || 0,
        });
      } else {
        setTenantStats({
          count: 0,
          approvedCount: 0,
          pendingCount: 0,
          rejectedCount: 0,
        });
      }
    } catch (error) {
      console.error("Tenant stats fetch error:", error);
      setTenantStats({
        count: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
      });
    }
  }, [authHeaders]);

  const fetchPaymentOverview = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/payments/landlord/overview`, {
        headers: authHeaders,
      });

      const data = await res.json();

      if (res.ok) {
        setPaymentOverview({
          monthlyRevenue: Number(data.monthlyRevenue) || 0,
          pendingPayments: Number(data.pendingPayments) || 0,
          overdueRent: Number(data.overdueRent) || 0,
          collectionRate: Number(data.collectionRate) || 0,
          revenueTrend: Number(data.revenueTrend) || 0,
          pendingTrend: Number(data.pendingTrend) || 0,
          overdueTrend: Number(data.overdueTrend) || 0,
          paymentMethodBreakdown: safeArray(data.paymentMethodBreakdown),
          monthlyRevenueSeries: safeArray(data.monthlyRevenueSeries),
          recentTransactions: safeArray(data.recentTransactions),
        });
      }
    } catch (error) {
      console.error("Payment overview fetch error:", error);
    }
  }, [authHeaders]);

  const fetchLeaseOverview = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/leases/landlord/overview`, {
        headers: authHeaders,
      });

      const data = await res.json();

      if (res.ok) {
        setLeaseOverview({
          occupancyRate: Number(data.occupancyRate) || 0,
          activeLeases: Number(data.activeLeases) || 0,
          vacantUnits: Number(data.vacantUnits) || 0,
          expiringSoon: Number(data.expiringSoon) || 0,
          leaseTrend: Number(data.leaseTrend) || 0,
          occupancyTrend: Number(data.occupancyTrend) || 0,
          propertyOccupancyBreakdown: safeArray(
            data.propertyOccupancyBreakdown
          ),
        });
      }
    } catch (error) {
      console.error("Lease overview fetch error:", error);
    }
  }, [authHeaders]);

  const fetchRecentActivity = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/activity/landlord/recent`, {
        headers: authHeaders,
      });

      const data = await res.json();

      if (res.ok) {
        setRecentActivity(safeArray(data.activities));
      }
    } catch (error) {
      console.error("Recent activity fetch error:", error);
    }
  }, [authHeaders]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/notifications/landlord/recent`,
        {
          headers: authHeaders,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setNotifications(safeArray(data.notifications));
      }
    } catch (error) {
      console.error("Notifications fetch error:", error);
    }
  }, [authHeaders]);

  const refreshDashboard = useCallback(
    async (showSpinner = false) => {
      try {
        if (showSpinner) setRefreshing(true);
        setLoadingDashboard(true);

        await Promise.all([
          fetchUserProfile(),
          fetchProperties(),
          fetchLandlordTenants(),
          fetchPaymentOverview(),
          fetchLeaseOverview(),
          fetchRecentActivity(),
          fetchNotifications(),
        ]);

        setLastUpdated(new Date());
      } catch (error) {
        console.error("Dashboard refresh error:", error);
      } finally {
        setLoadingDashboard(false);
        setRefreshing(false);
      }
    },
    [
      fetchUserProfile,
      fetchProperties,
      fetchLandlordTenants,
      fetchPaymentOverview,
      fetchLeaseOverview,
      fetchRecentActivity,
      fetchNotifications,
    ]
  );

  // -------------------------------
  // Initial Load
  // -------------------------------
  useEffect(() => {
    if (!token) return;
    refreshDashboard();
  }, [token, refreshDashboard]);

  // -------------------------------
  // WebSocket Live Updates
  // -------------------------------
  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to dashboard socket:", socket.id);
      socket.emit("join_landlord_dashboard");
    });

    socket.on("property_created", (payload) => {
      console.log("property_created", payload);
      fetchProperties();
      fetchRecentActivity();
    });

    socket.on("property_updated", (updatedProperty) => {
      console.log("property_updated", updatedProperty);

      setProperties((prev) =>
        prev.map((property) =>
          property.id === updatedProperty.id ? updatedProperty : property
        )
      );

      fetchLeaseOverview();
      fetchRecentActivity();
    });

    socket.on("property_deleted", ({ propertyId }) => {
      console.log("property_deleted", propertyId);

      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      fetchLeaseOverview();
      fetchRecentActivity();
    });

    socket.on("tenant_updated", () => {
      fetchLandlordTenants();
      fetchRecentActivity();
    });

    socket.on("payment_received", () => {
      fetchPaymentOverview();
      fetchRecentActivity();
      fetchNotifications();
    });

    socket.on("lease_updated", () => {
      fetchLeaseOverview();
      fetchRecentActivity();
    });

    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 8));
    });

    socket.on("dashboard_refresh", () => {
      refreshDashboard();
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [
    token,
    fetchProperties,
    fetchLandlordTenants,
    fetchPaymentOverview,
    fetchLeaseOverview,
    fetchRecentActivity,
    fetchNotifications,
    refreshDashboard,
  ]);

  // -------------------------------
  // Derived Stats
  // -------------------------------
  const totalProperties = properties.length;

  const approvedProperties = properties.filter(
    (p) => p.approval_status === "approved" || p.status === "approved"
  ).length;

  const pendingProperties = properties.filter(
    (p) => p.approval_status === "pending" || p.status === "pending"
  ).length;

  const cancelledProperties = properties.filter(
    (p) => p.status === "cancelled" || p.status === "rejected"
  ).length;

  const statsCards = [
    {
      title: "Total Tenants",
      value: tenantStats.count,
      sub: `${tenantStats.approvedCount} Approved • ${tenantStats.pendingCount} Pending`,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      bg: "bg-white",
      trend: tenantStats.approvedCount > 0 ? "up" : "neutral",
      trendText: `${tenantStats.rejectedCount} Rejected`,
    },
    {
      title: "Total Properties",
      value: totalProperties,
      sub: `${approvedProperties} Approved`,
      icon: Building2,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      bg: "bg-white",
      trend: "up",
      trendText: `${pendingProperties} Pending review`,
    },
    {
      title: "Monthly Revenue",
      value: paymentOverview.monthlyRevenue,
      prefix: "KES ",
      isCurrency: true,
      sub: `Collection rate ${paymentOverview.collectionRate}%`,
      icon: Wallet2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      bg: "bg-white",
      trend: paymentOverview.revenueTrend >= 0 ? "up" : "down",
      trendText: `${Math.abs(paymentOverview.revenueTrend)}% vs last month`,
    },
    {
      title: "Pending Payments",
      value: paymentOverview.pendingPayments,
      prefix: "KES ",
      isCurrency: true,
      sub: `Outstanding tenant balances`,
      icon: Clock,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      bg: "bg-white",
      trend: paymentOverview.pendingTrend <= 0 ? "up" : "down",
      trendText: `${Math.abs(paymentOverview.pendingTrend)}% vs last month`,
    },
    {
      title: "Overdue Rent",
      value: paymentOverview.overdueRent,
      prefix: "KES ",
      isCurrency: true,
      sub: `Requires immediate follow-up`,
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      bg: "bg-white",
      trend: paymentOverview.overdueTrend <= 0 ? "up" : "down",
      trendText: `${Math.abs(paymentOverview.overdueTrend)}% vs last month`,
    },
    {
      title: "Occupancy Rate",
      value: leaseOverview.occupancyRate,
      suffix: "%",
      sub: `${leaseOverview.vacantUnits} Vacant units`,
      icon: Home,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      bg: "bg-white",
      trend: leaseOverview.occupancyTrend >= 0 ? "up" : "down",
      trendText: `${Math.abs(leaseOverview.occupancyTrend)}% vs last month`,
    },
    {
      title: "Active Leases",
      value: leaseOverview.activeLeases,
      sub: `${leaseOverview.expiringSoon} expiring soon`,
      icon: FileText,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      bg: "bg-white",
      trend: leaseOverview.leaseTrend >= 0 ? "up" : "down",
      trendText: `${Math.abs(leaseOverview.leaseTrend)}% vs last month`,
    },
    {
      title: "Live Alerts",
      value: notifications.length,
      sub: `Recent notifications`,
      icon: Bell,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      bg: "bg-white",
      trend: "up",
      trendText: `Realtime enabled`,
    },
  ];

  const propertyStatusData = [
    { name: "Approved", value: approvedProperties },
    { name: "Pending", value: pendingProperties },
    { name: "Cancelled", value: cancelledProperties },
  ];

  // -------------------------------
  // Components
  // -------------------------------
  const StatCard = ({
    title,
    value,
    prefix = "",
    suffix = "",
    sub,
    icon: Icon,
    iconBg,
    iconColor,
    trend,
    trendText,
  }) => (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {prefix}
            <CountUp end={Number(value || 0)} duration={1.8} separator="," />
            {suffix}
          </h2>
          <p className="mt-2 text-sm text-gray-500">{sub}</p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <Icon className={`${iconColor}`} size={28} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        {trend === "up" ? (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-green-600">
            <TrendingUp size={15} className="mr-1" />
            {trendText}
          </span>
        ) : trend === "down" ? (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-red-600">
            <TrendingDown size={15} className="mr-1" />
            {trendText}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
            {trendText}
          </span>
        )}
      </div>
    </div>
  );

  const QuickActionCard = ({ title, desc, icon: Icon, color }) => (
    <button className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
      >
        <Icon size={24} className="text-white" />
      </div>
      <h4 className="mt-4 text-base font-bold text-gray-800">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
      <div className="mt-4 inline-flex items-center text-sm font-semibold text-gray-700 group-hover:text-blue-600">
        Open <ArrowRight size={16} className="ml-1" />
      </div>
    </button>
  );

  const ActivityBadge = ({ type }) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";

    if (type === "payment") {
      return <span className={`${base} bg-green-100 text-green-700`}>Payment</span>;
    }
    if (type === "property") {
      return <span className={`${base} bg-blue-100 text-blue-700`}>Property</span>;
    }
    if (type === "tenant") {
      return <span className={`${base} bg-purple-100 text-purple-700`}>Tenant</span>;
    }
    if (type === "lease") {
      return <span className={`${base} bg-orange-100 text-orange-700`}>Lease</span>;
    }
    return <span className={`${base} bg-gray-100 text-gray-700`}>General</span>;
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="px-4 pb-8 pt-20 md:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Activity size={16} />
              Live Dashboard
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Monitor properties, tenants, revenue, occupancy and
              recent activity in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-gray-500">Last Updated</p>
              <p className="text-sm font-semibold text-gray-800">
                {lastUpdated ? formatDateTime(lastUpdated) : "Loading..."}
              </p>
            </div>

            <button
              onClick={() => refreshDashboard(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Approval Status */}
        {approvalStatus !== "approved" && (
          <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 text-yellow-600" size={22} />
              <div>
                <h3 className="font-bold text-yellow-800">
                  Account Awaiting Approval
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Your account is pending admin approval. Some features may be
                  temporarily restricted until verification is completed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Summary Strip */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
            <p className="text-sm text-blue-100">Portfolio Health</p>
            <h3 className="mt-2 text-2xl font-bold">
              {leaseOverview.occupancyRate}% Occupied
            </h3>
            <p className="mt-2 text-sm text-blue-100">
              {totalProperties} properties actively tracked
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 p-5 text-white shadow-lg">
            <p className="text-sm text-emerald-100">Revenue Pulse</p>
            <h3 className="mt-2 text-2xl font-bold">
              {formatKES(paymentOverview.monthlyRevenue)}
            </h3>
            <p className="mt-2 text-sm text-emerald-100">
              Current month collections
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white shadow-lg">
            <p className="text-sm text-amber-100">Attention Needed</p>
            <h3 className="mt-2 text-2xl font-bold">
              {notifications.length + leaseOverview.expiringSoon}
            </h3>
            <p className="mt-2 text-sm text-amber-100">
              Alerts + expiring leases
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statsCards.map((card, idx) => (
            <StatCard key={idx} {...card} />
          ))}
        </div>

        {/* Charts + Panels */}
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Revenue Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Revenue Overview
                </h3>
                <p className="text-sm text-gray-500">
                  Monthly rent collection performance
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                <CircleDollarSign size={16} className="mr-1 inline" />
                Live Financials
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={paymentOverview.monthlyRevenueSeries}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatKES(value)} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#16a34a"
                    fill="url(#revFill)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Property Status Pie */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-gray-900">
                Property Status
              </h3>
              <p className="text-sm text-gray-500">
                Approval & listing health snapshot
              </p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    dataKey="value"
                    label
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#facc15" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Middle Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Occupancy Breakdown */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Occupancy Breakdown
                </h3>
                <p className="text-sm text-gray-500">
                  Units occupied across your properties
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
                <Home size={16} className="mr-1 inline" />
                Live Occupancy
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaseOverview.propertyOccupancyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="property" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="occupied" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="vacant" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">
                Shortcuts for common landlord tasks
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <QuickActionCard
                title="Add Property"
                desc="Create and publish a new rental listing"
                icon={HousePlus}
                color="bg-blue-600"
              />
              <QuickActionCard
                title="Register Tenant"
                desc="Onboard a new tenant to your property"
                icon={UserPlus2}
                color="bg-emerald-600"
              />
              <QuickActionCard
                title="Generate Report"
                desc="Download portfolio or rent analytics"
                icon={ClipboardList}
                color="bg-indigo-600"
              />
              <QuickActionCard
                title="Send Announcement"
                desc="Broadcast notices to all tenants"
                icon={Bell}
                color="bg-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Recent Transactions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-1">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Transactions
                </h3>
                <p className="text-sm text-gray-500">
                  Latest payment activity
                </p>
              </div>
              <BadgeDollarSign className="text-green-600" size={22} />
            </div>

            <div className="space-y-4">
              {paymentOverview.recentTransactions.length > 0 ? (
                paymentOverview.recentTransactions.slice(0, 6).map((txn, index) => (
                  <div
                    key={txn.id || index}
                    className="flex items-start justify-between rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {txn.tenant_name || "Tenant Payment"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {txn.property_name || "Property"} •{" "}
                        {txn.payment_method || "Method"}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDateTime(txn.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatKES(txn.amount)}
                      </p>
                      <span className="mt-1 inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        Paid
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                  No recent transactions yet
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-1">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h3>
                <p className="text-sm text-gray-500">
                  Live actions across your account
                </p>
              </div>
              <Activity className="text-blue-600" size={22} />
            </div>

            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 7).map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <ActivityBadge type={activity.type} />
                      <span className="text-xs text-gray-400">
                        {formatDateTime(activity.created_at)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {activity.title || "Activity"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {activity.description || "No description available"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                  No recent activity available
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-1">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Important alerts and reminders
                </p>
              </div>
              <Bell className="text-pink-600" size={22} />
            </div>

            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.slice(0, 7).map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {notification.type === "success" ? (
                          <CheckCircle2 className="text-green-500" size={18} />
                        ) : notification.type === "danger" ? (
                          <XCircle className="text-red-500" size={18} />
                        ) : (
                          <Bell className="text-blue-500" size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {notification.title || "Notification"}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message || "No message"}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          {formatDateTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                  No notifications yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Portfolio Snapshot
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                A quick operational summary of your rental business.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-blue-50 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">Properties</p>
                <p className="text-lg font-bold text-blue-700">{totalProperties}</p>
              </div>
              <div className="rounded-xl bg-green-50 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">Tenants</p>
                <p className="text-lg font-bold text-green-700">{tenantStats.count}</p>
              </div>
              <div className="rounded-xl bg-orange-50 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">Vacant Units</p>
                <p className="text-lg font-bold text-orange-700">
                  {leaseOverview.vacantUnits}
                </p>
              </div>
              <div className="rounded-xl bg-purple-50 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">Expiring Soon</p>
                <p className="text-lg font-bold text-purple-700">
                  {leaseOverview.expiringSoon}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error / Loading Hints */}
        {propertyError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {propertyError}
          </div>
        )}

        {(loadingDashboard || loadingProperties) && (
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-700">
            Loading live landlord dashboard data...
          </div>
        )}
      </div>
    </section>
  );
}

export default LandlordDashboard;