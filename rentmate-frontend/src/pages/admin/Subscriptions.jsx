import { useState, useMemo, useEffect, useCallback } from "react";
import {
  PlusCircle, Users, DollarSign, Zap, XCircle, Trash2,
  MinusCircle, Search, Download, TrendingUp, TrendingDown,
  Edit2, CheckCircle, PauseCircle, RefreshCw, ChevronLeft,
  ChevronRight, AlertTriangle, Loader2, UserPlus,
} from "lucide-react";

// ─── BASE URL ─────────────────────────────────────────────────────────────────
// All subscription routes live under /api/subscriptions on the backend
const BASE_URL = (import.meta.env?.VITE_API_URL ?? "http://localhost:5000") + "/api/subscriptions";

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active:    { label: "Active",    bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500" },
  expired:   { label: "Expired",   bg: "bg-red-50",      text: "text-red-600",     dot: "bg-red-500"     },
  trial:     { label: "Trial",     bg: "bg-violet-50",   text: "text-violet-700",  dot: "bg-violet-500"  },
  suspended: { label: "Suspended", bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-500"   },
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return { toasts, push };
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold animate-fade-in-up
            ${t.type === "error" ? "bg-red-600 text-white" : "bg-gray-900 text-white"}`}
        >
          {t.type === "error" ? <XCircle size={15} /> : <CheckCircle size={15} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────
function ConfirmModal({ title, message, confirmLabel = "Confirm", danger = false, onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${danger ? "bg-red-50" : "bg-amber-50"}`}>
          <AlertTriangle size={22} className={danger ? "text-red-500" : "text-amber-500"} />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition ${danger ? "bg-red-600 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STATUS PILL ──────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, change, trend, icon: Icon, accent, loading }) {
  const isUp = trend === "up";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accent}`} />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-gray-50">
          <Icon size={22} className="text-gray-500" />
        </div>
      </div>
      {!loading && (
        <div className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}% from last month
        </div>
      )}
    </div>
  );
}

// ─── PLAN CARD ────────────────────────────────────────────────────────────────
function PlanCard({ plan, onEdit, onDelete, onToggle, busy }) {
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
        <span className="text-3xl font-bold text-gray-900 tracking-tight">
          KES {Number(plan.price).toLocaleString()}
        </span>
        <span className="text-sm text-gray-400">/ {plan.duration?.toLowerCase()}</span>
      </div>
      <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
      <ul className="space-y-2 mb-5 flex-1">
        {(plan.features ?? []).filter(Boolean).map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex-shrink-0 w-4 h-4 bg-indigo-50 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 text-xs">✓</span>
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div className="text-xs text-gray-400 mb-4">{plan.subscribers ?? 0} active subscribers</div>
      <div className="flex gap-2 pt-3 border-t border-gray-50">
        <button
          onClick={() => onEdit(plan)}
          disabled={busy}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition disabled:opacity-50"
        >
          <Edit2 size={12} /> Edit
        </button>
        <button
          onClick={() => onToggle(plan)}
          disabled={busy}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition disabled:opacity-50"
        >
          <CheckCircle size={12} /> {plan.status === "active" ? "Deactivate" : "Activate"}
        </button>
        <button
          onClick={() => onDelete(plan)}
          disabled={busy}
          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition disabled:opacity-50"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── PLAN MODAL ───────────────────────────────────────────────────────────────
const EMPTY_PLAN = { name: "", price: "", cycle: "Monthly", maxProperties: "", description: "", features: [""], featured: false };

function PlanModal({ plan, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    plan ? { ...plan, features: plan.features?.length ? plan.features : [""] } : { ...EMPTY_PLAN }
  );
  const [errors, setErrors] = useState({});

  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };
  const addFeature = () => setField("features", [...form.features, ""]);
  const removeFeature = (i) => setField("features", form.features.filter((_, idx) => idx !== i));
  const updateFeature = (i, v) => { const u = [...form.features]; u[i] = v; setField("features", u); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Plan name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = "Valid price is required";
    if (form.maxProperties && isNaN(Number(form.maxProperties))) e.maxProperties = "Must be a number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      price: Number(form.price),
      maxProperties: form.maxProperties ? Number(form.maxProperties) : null,
      features: form.features.filter(Boolean),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">{plan ? "Edit Plan" : "Add New Plan"}</h2>
          <button onClick={onClose} disabled={saving} className="p-1.5 hover:bg-gray-100 rounded-lg transition disabled:opacity-50">
            <XCircle size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Plan Name *</label>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                type="text"
                placeholder="e.g. Premium"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Price (KES) *</label>
              <input
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                type="number"
                min="0"
                placeholder="2000"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.price ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Billing Cycle</label>
              <select
                value={form.cycle}
                onChange={(e) => setField("cycle", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              >
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Max Properties</label>
              <input
                value={form.maxProperties}
                onChange={(e) => setField("maxProperties", e.target.value)}
                type="number"
                min="1"
                placeholder="50"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.maxProperties ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.maxProperties && <p className="text-xs text-red-500 mt-1">{errors.maxProperties}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Short description of this plan…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none h-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="featured"
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => setField("featured", e.target.checked)}
              className="w-4 h-4 accent-indigo-600"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-600 cursor-pointer">Mark as Most Popular</label>
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
                <input
                  value={f}
                  onChange={(e) => updateFeature(i, e.target.value)}
                  type="text"
                  placeholder={`Feature ${i + 1}`}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
                {form.features.length > 1 && (
                  <button onClick={() => removeFeature(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <MinusCircle size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-indigo-100 mt-2 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Saving…" : plan ? "Update Plan" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SUBSCRIPTION MODAL ───────────────────────────────────────────────────────
const EMPTY_SUB = { landlord: "", email: "", planId: "", status: "trial", start: "", end: "" };

function SubscriptionModal({ plans, onClose, onSave, saving }) {
  const [form, setForm] = useState({ ...EMPTY_SUB });
  const [errors, setErrors] = useState({});

  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.landlord.trim()) e.landlord = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.planId) e.planId = "Select a plan";
    if (!form.start) e.start = "Start date is required";
    if (!form.end) e.end = "End date is required";
    if (form.start && form.end && form.end <= form.start) e.end = "End must be after start";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const selectedPlan = plans.find((p) => p.id === Number(form.planId));
    onSave({
      ...form,
      planId: Number(form.planId),
      plan: selectedPlan?.name ?? "",
      amount: form.status === "trial" ? 0 : (selectedPlan?.price ?? 0),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Add Subscription</h2>
          <button onClick={onClose} disabled={saving} className="p-1.5 hover:bg-gray-100 rounded-lg transition disabled:opacity-50">
            <XCircle size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Landlord Name *</label>
              <input
                value={form.landlord}
                onChange={(e) => setField("landlord", e.target.value)}
                type="text"
                placeholder="Full name"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.landlord ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.landlord && <p className="text-xs text-red-500 mt-1">{errors.landlord}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email *</label>
              <input
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                type="email"
                placeholder="email@example.com"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Plan *</label>
              <select
                value={form.planId}
                onChange={(e) => setField("planId", e.target.value)}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.planId ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              >
                <option value="">Select plan…</option>
                {plans.filter((p) => p.status === "active").map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — KES {Number(p.price).toLocaleString()}/{p.cycle?.toLowerCase()}
                  </option>
                ))}
              </select>
              {errors.planId && <p className="text-xs text-red-500 mt-1">{errors.planId}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Status</label>
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              >
                <option value="trial">Trial</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Start Date *</label>
              <input
                value={form.start}
                onChange={(e) => setField("start", e.target.value)}
                type="date"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.start ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.start && <p className="text-xs text-red-500 mt-1">{errors.start}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">End Date *</label>
              <input
                value={form.end}
                onChange={(e) => setField("end", e.target.value)}
                type="date"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.end ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.end && <p className="text-xs text-red-500 mt-1">{errors.end}</p>}
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-indigo-100 mt-2 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Saving…" : "Add Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SKELETON ROWS ────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AdminPackageSubscriptions() {
  // Data state
  const [plans, setPlans]                   = useState([]);
  const [subscriptions, setSubscriptions]   = useState([]);
  const [stats, setStats]                   = useState(null);

  // Loading states
  const [plansLoading, setPlansLoading]     = useState(true);
  const [subsLoading, setSubsLoading]       = useState(true);
  const [statsLoading, setStatsLoading]     = useState(true);
  const [savingPlan, setSavingPlan]         = useState(false);
  const [savingSub, setSavingSub]           = useState(false);
  const [busyPlanId, setBusyPlanId]         = useState(null);
  const [busySubId, setBusySubId]           = useState(null);
  const [exportingCSV, setExportingCSV]     = useState(false);

  // UI state
  const [showPlanModal, setShowPlanModal]   = useState(false);
  const [showSubModal, setShowSubModal]     = useState(false);
  const [editingPlan, setEditingPlan]       = useState(null);
  const [confirm, setConfirm]               = useState(null);
  const [search, setSearch]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState("all");
  const [page, setPage]                     = useState(1);
  const PAGE_SIZE = 5;

  const { toasts, push: toast } = useToast();

  // ── LOAD PLANS → GET /api/subscriptions/plans/all ─────────────────────────
  const loadPlans = useCallback(async () => {
    setPlansLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/plans/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message ?? "Failed to load plans");
      }
      const data = await res.json();
      setPlans(data);
    } catch (e) {
      toast(e.message ?? "Failed to load plans", "error");
    } finally {
      setPlansLoading(false);
    }
  }, []);

  // ── LOAD SUBSCRIPTIONS → GET /api/subscriptions/subscriptions/all ─────────
  const loadSubscriptions = useCallback(async () => {
    setSubsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/subscriptions/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message ?? "Failed to load subscriptions");
      }
      const data = await res.json();
      setSubscriptions(data);
    } catch (e) {
      toast(e.message ?? "Failed to load subscriptions", "error");
    } finally {
      setSubsLoading(false);
    }
  }, []);

  // ── LOAD STATS → GET /api/subscriptions/stats/subscriptions ──────────────
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/stats/subscriptions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message ?? "Failed to load stats");
      }
      const data = await res.json();
      setStats(data);
    } catch (e) {
      toast(e.message ?? "Failed to load stats", "error");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
    loadSubscriptions();
    loadStats();
  }, []);

  // ── Filtered & paginated subscriptions ────────────────────────────────────
  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        s.landlord?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.plan?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── CREATE PLAN → POST /api/subscriptions/plans ───────────────────────────
  // ── UPDATE PLAN → PUT  /api/subscriptions/plans/:id ──────────────────────
  const handleSavePlan = async (data) => {
    setSavingPlan(true);
    try {
      const token = sessionStorage.getItem("token");

      if (editingPlan) {
        // UPDATE existing plan
        const res = await fetch(`${BASE_URL}/plans/${editingPlan.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(err.message ?? "Failed to update plan");
        }
        const updated = await res.json();
        setPlans((ps) => ps.map((p) => p.id === editingPlan.id ? { ...p, ...updated } : p));
        toast("Plan updated successfully");
      } else {
        // CREATE new plan
        const res = await fetch(`${BASE_URL}/plans`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(err.message ?? "Failed to create plan");
        }
        const newPlan = await res.json();
        setPlans((ps) => [...ps, newPlan]);
        toast("Plan created successfully");
      }

      setShowPlanModal(false);
      setEditingPlan(null);
      loadStats();
    } catch (e) {
      toast(e.message ?? "Failed to save plan", "error");
    } finally {
      setSavingPlan(false);
    }
  };

  // ── DELETE PLAN → DELETE /api/subscriptions/plans/:id ────────────────────
  const handleDeletePlan = (plan) => {
    setConfirm({
      title: "Delete Plan",
      message: `Are you sure you want to delete "${plan.name}"? This action cannot be undone.`,
      danger: true,
      confirmLabel: "Delete",
      onConfirm: async () => {
        setBusyPlanId(plan.id);
        try {
          const token = sessionStorage.getItem("token");
          const res = await fetch(`${BASE_URL}/plans/${plan.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: "include",
          });
          // 204 No Content is success — no body to parse
          if (!res.ok && res.status !== 204) {
            const err = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(err.message ?? "Failed to delete plan");
          }
          setPlans((ps) => ps.filter((p) => p.id !== plan.id));
          toast(`Plan "${plan.name}" deleted`);
        } catch (e) {
          toast(e.message ?? "Failed to delete plan", "error");
        } finally {
          setBusyPlanId(null);
        }
      },
    });
  };

  // ── TOGGLE PLAN STATUS → PATCH /api/subscriptions/plans/:id/status ────────
  const handleTogglePlan = (plan) => {
    const next = plan.status === "active" ? "inactive" : "active";
    setConfirm({
      title: next === "inactive" ? "Deactivate Plan" : "Activate Plan",
      message: `${next === "inactive" ? "Deactivate" : "Activate"} the "${plan.name}" plan? Existing subscriptions won't be affected.`,
      danger: next === "inactive",
      confirmLabel: next === "inactive" ? "Deactivate" : "Activate",
      onConfirm: async () => {
        setBusyPlanId(plan.id);
        try {
          const token = sessionStorage.getItem("token");
          const res = await fetch(`${BASE_URL}/plans/${plan.id}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: "include",
            body: JSON.stringify({ status: next }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(err.message ?? "Failed to update plan status");
          }
          setPlans((ps) => ps.map((p) => p.id === plan.id ? { ...p, status: next } : p));
          toast(`Plan "${plan.name}" ${next === "active" ? "activated" : "deactivated"}`);
        } catch (e) {
          toast(e.message ?? "Failed to update plan", "error");
        } finally {
          setBusyPlanId(null);
        }
      },
    });
  };

  // ── CREATE SUBSCRIPTION → POST /api/subscriptions/subscriptions ───────────
  const handleSaveSubscription = async (data) => {
    setSavingSub(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message ?? "Failed to add subscription");
      }
      const newSub = await res.json();
      setSubscriptions((ss) => [newSub, ...ss]);
      toast("Subscription added");
      setShowSubModal(false);
      loadStats();
    } catch (e) {
      toast(e.message ?? "Failed to add subscription", "error");
    } finally {
      setSavingSub(false);
    }
  };

  // ── UPDATE SUBSCRIPTION STATUS → PATCH /api/subscriptions/subscriptions/:id/status
  const handleSubscriptionStatus = async (sub, action) => {
    const statusMap  = { activate: "active", suspend: "suspended", restore: "active" };
    const labelMap   = { activate: "activated", suspend: "suspended", restore: "restored" };
    const nextStatus = statusMap[action];

    setBusySubId(sub.id);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/subscriptions/${sub.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message ?? "Failed to update subscription");
      }
      setSubscriptions((ss) => ss.map((s) => s.id === sub.id ? { ...s, status: nextStatus } : s));
      toast(`${sub.landlord}'s subscription ${labelMap[action]}`);
    } catch (e) {
      toast(e.message ?? "Failed to update subscription", "error");
    } finally {
      setBusySubId(null);
    }
  };

  // ── CSV Export (client-side from current filtered data) ───────────────────
  const handleExportCSV = async () => {
    setExportingCSV(true);
    try {
      const headers = ["Landlord", "Email", "Plan", "Status", "Start", "End", "Amount (KES)"];
      const rows = filtered.map((s) => [s.landlord, s.email, s.plan, s.status, s.start, s.end, s.amount]);
      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "subscriptions.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast("CSV exported");
    } catch {
      toast("Export failed", "error");
    } finally {
      setExportingCSV(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.25s ease both; }
      `}</style>

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
              <button
                key={n}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${n === "Subscriptions" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
              >
                {n}
              </button>
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
              onClick={() => { setEditingPlan(null); setShowPlanModal(true); }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5"
            >
              <PlusCircle size={16} /> New Plan
            </button>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Subscribers"
              value={stats?.totalSubscribers?.value != null ? stats.totalSubscribers.value.toLocaleString() : "—"}
              change={stats?.totalSubscribers?.change ?? 0}
              trend={stats?.totalSubscribers?.trend ?? "up"}
              icon={Users}
              accent="bg-gradient-to-r from-emerald-400 to-teal-400"
              loading={statsLoading}
            />
            <StatCard
              label="Active Subscriptions"
              value={stats?.activeSubscriptions?.value != null ? stats.activeSubscriptions.value.toLocaleString() : "—"}
              change={stats?.activeSubscriptions?.change ?? 0}
              trend={stats?.activeSubscriptions?.trend ?? "up"}
              icon={Zap}
              accent="bg-gradient-to-r from-indigo-400 to-violet-400"
              loading={statsLoading}
            />
            <StatCard
              label="Expired"
              value={stats?.expired?.value != null ? stats.expired.value.toLocaleString() : "—"}
              change={stats?.expired?.change ?? 0}
              trend={stats?.expired?.trend ?? "down"}
              icon={XCircle}
              accent="bg-gradient-to-r from-red-400 to-rose-400"
              loading={statsLoading}
            />
            <StatCard
              label="Monthly Revenue"
              value={stats?.revenue?.value != null ? `KES ${stats.revenue.value.toLocaleString()}` : "—"}
              change={stats?.revenue?.change ?? 0}
              trend={stats?.revenue?.trend ?? "up"}
              icon={DollarSign}
              accent="bg-gradient-to-r from-amber-400 to-orange-400"
              loading={statsLoading}
            />
          </div>

          {/* ── Plans ── */}
          <div className="mb-8">
            <h2 className="text-base font-bold text-gray-800 mb-4">Plans</h2>
            {plansLoading ? (
              <div className="grid md:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm h-64 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-5">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    busy={busyPlanId === plan.id}
                    onEdit={(p) => { setEditingPlan(p); setShowPlanModal(true); }}
                    onDelete={handleDeletePlan}
                    onToggle={handleTogglePlan}
                  />
                ))}
                {plans.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-400 text-sm">
                    No plans yet. Create your first plan.
                  </div>
                )}
              </div>
            )}
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
                {/* Add subscription */}
                <button
                  onClick={() => setShowSubModal(true)}
                  className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-indigo-100 transition"
                >
                  <UserPlus size={14} /> Add
                </button>
                {/* export */}
                <button
                  onClick={handleExportCSV}
                  disabled={exportingCSV}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {exportingCSV ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Export CSV
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
                  {subsLoading && [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
                  {!subsLoading && paginated.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400">
                        No subscriptions match your filters.
                      </td>
                    </tr>
                  )}
                  {!subsLoading && paginated.map((s) => (
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
                        {s.amount > 0
                          ? `KES ${Number(s.amount).toLocaleString()}`
                          : <span className="text-violet-600">Free Trial</span>
                        }
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {busySubId === s.id ? (
                            <Loader2 size={16} className="animate-spin text-gray-400" />
                          ) : (
                            <>
                              {s.status === "active" && (
                                <button
                                  onClick={() => handleSubscriptionStatus(s, "suspend")}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-100 transition"
                                >
                                  <PauseCircle size={12} /> Suspend
                                </button>
                              )}
                              {(s.status === "suspended" || s.status === "expired") && (
                                <button
                                  onClick={() => handleSubscriptionStatus(s, "restore")}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition"
                                >
                                  <RefreshCw size={12} /> Restore
                                </button>
                              )}
                              {s.status === "trial" && (
                                <button
                                  onClick={() => handleSubscriptionStatus(s, "activate")}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition"
                                >
                                  <CheckCircle size={12} /> Activate
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            {!subsLoading && totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-500">
                <span>
                  Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${n === page ? "bg-indigo-600 text-white" : "hover:bg-gray-100 text-gray-600"}`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Modals ── */}
      {showPlanModal && (
        <PlanModal
          plan={editingPlan}
          saving={savingPlan}
          onClose={() => { setShowPlanModal(false); setEditingPlan(null); }}
          onSave={handleSavePlan}
        />
      )}

      {showSubModal && (
        <SubscriptionModal
          plans={plans}
          saving={savingSub}
          onClose={() => setShowSubModal(false)}
          onSave={handleSaveSubscription}
        />
      )}

      {confirm && (
        <ConfirmModal
          {...confirm}
          onClose={() => setConfirm(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
}