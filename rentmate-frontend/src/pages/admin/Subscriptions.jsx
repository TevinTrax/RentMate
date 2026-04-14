import { useState, useMemo } from "react";
import {
  PlusCircle,
  Users,
  DollarSign,
  Zap,
  XCircle,
  Trash2,
  MinusCircle,
  Search,
  Download,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Edit2,
  CheckCircle,
  PauseCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Mock API helpers (replace with real fetch/axios calls) ───────────────────
// Replace these with your actual API endpoints, e.g.:
//   const res = await fetch("/api/admin/plans");
//   const data = await res.json();

const MOCK_PLANS = [
  {
    id: 1,
    name: "Basic",
    price: 500,
    cycle: "Monthly",
    maxProperties: 10,
    description: "For landlords just getting started",
    features: ["10 Properties", "Email Support", "Basic Analytics"],
    status: "active",
    subscribers: 320,
  },
  {
    id: 2,
    name: "Premium",
    price: 2000,
    cycle: "Monthly",
    maxProperties: 50,
    description: "For growing property businesses",
    features: ["50 Properties", "Priority Support", "Full Analytics", "Custom Reports"],
    status: "active",
    subscribers: 780,
    featured: true,
  },
  {
    id: 3,
    name: "Enterprise",
    price: 5000,
    cycle: "Monthly",
    maxProperties: 999,
    description: "For large property management firms",
    features: ["Unlimited Properties", "Dedicated Manager", "API Access", "White-label"],
    status: "active",
    subscribers: 134,
  },
];

const MOCK_SUBSCRIPTIONS = [
  { id: 1, landlord: "John Doe",     email: "john@example.com",   plan: "Premium",    status: "active",    start: "2024-01-01", end: "2024-12-31", amount: 2000 },
  { id: 2, landlord: "Amina Hassan", email: "amina@example.com",  plan: "Enterprise", status: "active",    start: "2024-03-05", end: "2025-03-04", amount: 5000 },
  { id: 3, landlord: "Peter Njoroge",email: "peter@example.com",  plan: "Basic",      status: "expired",   start: "2023-01-15", end: "2024-01-14", amount: 500  },
  { id: 4, landlord: "Grace Wanjiku",email: "grace@example.com",  plan: "Premium",    status: "trial",     start: "2024-04-01", end: "2024-04-14", amount: 0    },
  { id: 5, landlord: "David Kamau",  email: "david@example.com",  plan: "Basic",      status: "suspended", start: "2024-02-10", end: "2025-02-09", amount: 500  },
  { id: 6, landlord: "Mary Odhiambo",email: "mary@example.com",   plan: "Premium",    status: "active",    start: "2024-05-01", end: "2025-04-30", amount: 2000 },
  { id: 7, landlord: "James Mwangi", email: "james@example.com",  plan: "Enterprise", status: "active",    start: "2024-06-01", end: "2025-05-31", amount: 5000 },
];

const MOCK_STATS = {
  totalSubscribers:    { value: 2234, change: 5,  trend: "up"   },
  activeSubscriptions: { value: 1234, change: 12, trend: "up"   },
  expired:             { value: 234,  change: -2, trend: "down" },
  revenue:             { value: 51234,change: 12, trend: "up"   },
};

// ─── Status config ─────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active:    { label: "Active",    bg: "bg-emerald-50",  text: "text-emerald-700",  dot: "bg-emerald-500"  },
  expired:   { label: "Expired",   bg: "bg-red-50",      text: "text-red-600",      dot: "bg-red-500"      },
  trial:     { label: "Trial",     bg: "bg-violet-50",   text: "text-violet-700",   dot: "bg-violet-500"   },
  suspended: { label: "Suspended", bg: "bg-amber-50",    text: "text-amber-700",    dot: "bg-amber-500"    },
};

// ─── Sub-components ────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, change, trend, icon: Icon, accent }) {
  const isUp = trend === "up";
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accent}`} />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl ${accent.replace("bg-gradient-to-r", "").split(" ")[0]}10`}>
          <Icon size={22} className="text-gray-500" />
        </div>
      </div>
      <div className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(change)}% from last month
      </div>
    </div>
  );
}

function PlanCard({ plan, onEdit, onDelete, onToggle }) {
  return (
    <div className={`bg-white rounded-2xl border ${plan.featured ? "border-indigo-300 shadow-indigo-100 shadow-lg" : "border-gray-100 shadow-sm"} p-6 hover:shadow-md transition-all relative flex flex-col`}>
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">★ Most Popular</span>
        </div>
      )}
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase">{plan.name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${plan.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {plan.status === "active" ? "Live" : "Inactive"}
        </span>
      </div>
      <div className="flex items-baseline gap-1 mt-1 mb-1">
        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">KES {plan.price.toLocaleString()}</span>
        <span className="text-sm text-gray-400">/ {plan.cycle.toLowerCase()}</span>
      </div>
      <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
      <ul className="space-y-2 mb-5 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex-shrink-0 w-4 h-4 bg-indigo-50 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 text-xs">✓</span>
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div className="text-xs text-gray-400 mb-4">{plan.subscribers} active subscribers</div>
      <div className="flex gap-2 pt-3 border-t border-gray-50">
        <button onClick={() => onEdit(plan)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition">
          <Edit2 size={12} /> Edit
        </button>
        <button onClick={() => onToggle(plan)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition">
          <CheckCircle size={12} /> {plan.status === "active" ? "Deactivate" : "Activate"}
        </button>
        <button onClick={() => onDelete(plan.id)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

function PlanModal({ plan, onClose, onSave }) {
  const [form, setForm] = useState(
    plan ?? { name: "", price: "", cycle: "Monthly", maxProperties: "", description: "", features: [""] }
  );

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const addFeature = () => setField("features", [...form.features, ""]);
  const removeFeature = (i) => setField("features", form.features.filter((_, idx) => idx !== i));
  const updateFeature = (i, v) => {
    const updated = [...form.features];
    updated[i] = v;
    setField("features", updated);
  };

  const handleSave = () => {
    // Validate required fields before saving
    if (!form.name.trim() || !form.price) return;
    onSave({ ...form, price: Number(form.price), maxProperties: Number(form.maxProperties) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">{plan ? "Edit Plan" : "Add New Plan"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition"><XCircle size={20} className="text-gray-400" /></button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Plan Name *</label>
              <input value={form.name} onChange={(e) => setField("name", e.target.value)} type="text" placeholder="e.g. Premium" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Price (KES) *</label>
              <input value={form.price} onChange={(e) => setField("price", e.target.value)} type="number" placeholder="2000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Billing Cycle</label>
              <select value={form.cycle} onChange={(e) => setField("cycle", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition">
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Max Properties</label>
              <input value={form.maxProperties} onChange={(e) => setField("maxProperties", e.target.value)} type="number" placeholder="50" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Short description of this plan..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none h-20" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Features</label>
              <button onClick={addFeature} className="flex items-center gap-1 text-indigo-600 text-xs font-semibold hover:text-indigo-800 transition">
                <PlusCircle size={13} /> Add feature
              </button>
            </div>
            {form.features.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={f} onChange={(e) => updateFeature(i, e.target.value)} type="text" placeholder={`Feature ${i + 1}`} className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition" />
                <button onClick={() => removeFeature(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><MinusCircle size={16} /></button>
              </div>
            ))}
          </div>

          <button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-indigo-100 mt-2">
            {plan ? "Update Plan" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function AdminPackageSubscriptions() {
  // ── State ──────────────────────────────────────────────────────────────
  const [plans, setPlans]                   = useState(MOCK_PLANS);
  const [subscriptions, setSubscriptions]   = useState(MOCK_SUBSCRIPTIONS);
  const [stats]                             = useState(MOCK_STATS);
  const [showModal, setShowModal]           = useState(false);
  const [editingPlan, setEditingPlan]       = useState(null);
  const [search, setSearch]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState("all");
  const [page, setPage]                     = useState(1);
  const PAGE_SIZE = 5;

  // ── Filtered & paginated subscriptions ───────────────────────────────
  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchSearch =
        s.landlord.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.plan.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Plan handlers ─────────────────────────────────────────────────────
  const handleSavePlan = (data) => {
    if (editingPlan) {
      setPlans((ps) => ps.map((p) => (p.id === editingPlan.id ? { ...p, ...data } : p)));
    } else {
      setPlans((ps) => [...ps, { ...data, id: Date.now(), status: "active", subscribers: 0 }]);
    }
    setEditingPlan(null);
  };

  const handleDeletePlan = (id) => {
    if (window.confirm("Delete this plan? This cannot be undone.")) {
      setPlans((ps) => ps.filter((p) => p.id !== id));
    }
  };

  const handleTogglePlan = (plan) => {
    setPlans((ps) =>
      ps.map((p) => p.id === plan.id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p)
    );
  };

  // ── Subscription handlers ─────────────────────────────────────────────
  const handleSubscriptionAction = (id, action) => {
    const statusMap = { activate: "active", suspend: "suspended", renew: "active", restore: "active" };
    setSubscriptions((ss) =>
      ss.map((s) => s.id === id ? { ...s, status: statusMap[action] ?? s.status } : s)
    );
  };

  // ── CSV export ─────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ["Landlord", "Email", "Plan", "Status", "Start", "End", "Amount (KES)"];
    const rows = filtered.map((s) => [s.landlord, s.email, s.plan, s.status, s.start, s.end, s.amount]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "subscriptions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // ─────────────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-slate-50 font-sans">

      {/* ── Top nav ── */}
      <nav className="bg-white border-b border-gray-100 px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-black">R</span>
          </span>
          <span className="font-extrabold text-gray-900 text-base tracking-tight">rentaflow</span>
        </div>
        <div className="flex gap-1">
          {["Dashboard", "Subscriptions", "Landlords", "Reports"].map((n) => (
            <button key={n} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${n === "Subscriptions" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>{n}</button>
          ))}
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">AD</div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* ── Page header ── */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Subscriptions & Plans</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage landlord subscriptions and payment plans</p>
          </div>
          <button
            onClick={() => { setEditingPlan(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5"
          >
            <PlusCircle size={16} /> New Plan
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Subscribers"    value={stats.totalSubscribers.value.toLocaleString()}    change={stats.totalSubscribers.change}    trend={stats.totalSubscribers.trend}    icon={Users}       accent="bg-gradient-to-r from-emerald-400 to-teal-400" />
          <StatCard label="Active Subscriptions" value={stats.activeSubscriptions.value.toLocaleString()} change={stats.activeSubscriptions.change} trend={stats.activeSubscriptions.trend} icon={Zap}         accent="bg-gradient-to-r from-indigo-400 to-violet-400" />
          <StatCard label="Expired"              value={stats.expired.value.toLocaleString()}             change={stats.expired.change}             trend={stats.expired.trend}             icon={XCircle}     accent="bg-gradient-to-r from-red-400 to-rose-400" />
          <StatCard label="Monthly Revenue"      value={`KES ${stats.revenue.value.toLocaleString()}`}    change={stats.revenue.change}             trend={stats.revenue.trend}             icon={DollarSign}  accent="bg-gradient-to-r from-amber-400 to-orange-400" />
        </div>

        {/* ── Plans ── */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-800 mb-4">Plans</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={(p) => { setEditingPlan(p); setShowModal(true); }}
                onDelete={handleDeletePlan}
                onToggle={handleTogglePlan}
              />
            ))}
          </div>
        </div>

        {/* ── Subscriptions table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* table toolbar */}
          <div className="px-6 py-4 border-b border-gray-50 flex flex-wrap gap-3 justify-between items-center">
            <h2 className="text-base font-bold text-gray-800">Landlord Subscriptions</h2>
            <div className="flex flex-wrap gap-2 items-center">
              {/* search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search landlords…"
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-52 transition"
                />
              </div>
              {/* status filter */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
              </select>
              {/* export */}
              <button onClick={exportCSV} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition">
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  {["Landlord", "Plan", "Status", "Start Date", "End Date", "Amount", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No subscriptions match your filters.</td></tr>
                )}
                {paginated.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{s.landlord}</div>
                      <div className="text-xs text-gray-400">{s.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{s.plan}</td>
                    <td className="px-6 py-4"><StatusPill status={s.status} /></td>
                    <td className="px-6 py-4 text-gray-500">{s.start}</td>
                    <td className="px-6 py-4 text-gray-500">{s.end}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {s.amount > 0 ? `KES ${s.amount.toLocaleString()}` : <span className="text-violet-600">Free Trial</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {s.status === "active" && (
                          <button onClick={() => handleSubscriptionAction(s.id, "suspend")} className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-100 transition">
                            <PauseCircle size={12} /> Suspend
                          </button>
                        )}
                        {(s.status === "suspended" || s.status === "expired") && (
                          <button onClick={() => handleSubscriptionAction(s.id, "restore")} className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition">
                            <RefreshCw size={12} /> Restore
                          </button>
                        )}
                        {s.status === "trial" && (
                          <button onClick={() => handleSubscriptionAction(s.id, "activate")} className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition">
                            <CheckCircle size={12} /> Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
              <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"><ChevronLeft size={16} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${n === page ? "bg-indigo-600 text-white" : "hover:bg-gray-100 text-gray-600"}`}>{n}</button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <PlanModal
          plan={editingPlan}
          onClose={() => { setShowModal(false); setEditingPlan(null); }}
          onSave={handleSavePlan}
        />
      )}
    </section>
  );
}