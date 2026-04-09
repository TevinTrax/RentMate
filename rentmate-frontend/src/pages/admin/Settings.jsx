import React, { useEffect, useMemo, useState } from "react";
import {
  Save,
  Settings,
  Building2,
  Shield,
  Bell,
  CreditCard,
  Wrench,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ImageIcon,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  UserCircle2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Trash2,
  BadgeCheck,
  CalendarClock,
  Eye,
  EyeOff,
  Crown,
  Database,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api/admin";

/* ---------------------------- UI HELPERS ---------------------------- */

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={classNames(
        "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300",
        checked ? "bg-indigo-600" : "bg-slate-300",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      )}
    >
      <span
        className={classNames(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children, rightContent }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-indigo-50 p-3">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>
        {rightContent}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
  icon: Icon,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={classNames(
            "w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100",
            Icon ? "pl-11 pr-4" : "px-4",
            disabled && "cursor-not-allowed bg-slate-50 text-slate-500"
          )}
        />
      </div>
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options = [] }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleRow({ title, subtitle, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="pr-4">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

function StatPill({ icon: Icon, label, value, tone = "default" }) {
  const toneStyles = {
    default: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    indigo: "bg-indigo-100 text-indigo-700",
    rose: "bg-rose-100 text-rose-700",
  };

  return (
    <div
      className={classNames(
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold",
        toneStyles[tone]
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

/* -------------------------- DEFAULT STATE --------------------------- */

const defaultFormData = {
  // Admin Profile
  admin_full_name: "",
  admin_email: "",
  admin_phone: "",
  admin_role: "Super Admin",
  admin_avatar_url: "",
  admin_bio: "",

  // Platform Info
  platform_name: "",
  support_email: "",
  support_phone: "",
  company_address: "",
  website_url: "",
  currency: "KES",
  timezone: "Africa/Nairobi",

  // Branding
  logo_url: "",
  favicon_url: "",

  // Monetization
  platform_fee_percentage: 0,
  trial_days: 14,
  max_property_images: 10,
  vat_percentage: 0,

  // Registration / Compliance
  allow_landlord_registration: true,
  allow_tenant_registration: true,
  require_property_approval: true,
  require_kyc_verification: false,
  require_email_verification: true,
  maintenance_mode: false,

  // Notifications
  email_notifications: true,
  sms_notifications: false,
  push_notifications: true,
  admin_login_alerts: true,

  // Features
  enable_online_payments: true,
  enable_maintenance_requests: true,
  enable_chat_system: true,
  enable_reviews: false,
  enable_support_tickets: true,
  enable_property_reports: true,

  // Security
  session_timeout_minutes: 60,
  password_min_length: 8,
  two_factor_required: false,
  max_login_attempts: 5,

  // Meta
  updated_at: "",
  created_at: "",
};

export default function AdminSettings() {
  const [formData, setFormData] = useState(defaultFormData);
  const [initialData, setInitialData] = useState(defaultFormData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showSensitive, setShowSensitive] = useState(false);

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  const fetchSettings = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await fetch(`${API_BASE}/settings`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch settings");
      }

      const mergedData = {
        ...defaultFormData,
        ...data.settings,
      };

      setFormData(mergedData);
      setInitialData(mergedData);
      setErrorMessage("");
    } catch (error) {
      console.error("Fetch settings error:", error);
      setErrorMessage(error.message || "Could not load settings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetChanges = () => {
    setFormData(initialData);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update settings");
      }

      const mergedData = {
        ...defaultFormData,
        ...data.settings,
      };

      setFormData(mergedData);
      setInitialData(mergedData);
      setSuccessMessage("Admin settings updated successfully.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Save settings error:", error);
      setErrorMessage(error.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString();
  };

  const platformStatus = formData.maintenance_mode ? "Maintenance" : "Live";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          <span className="text-sm font-medium text-slate-700">
            Loading admin settings...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6 pt-16">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-3xl bg-indigo-50 p-4">
                <Settings className="h-8 w-8 text-indigo-600" />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  <Sparkles className="h-4 w-4" />
                  Platform Control Center
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Admin Settings
                </h1>

                <p className="mt-2 max-w-3xl text-sm text-slate-500">
                  Configure platform identity, admin account preferences,
                  security, onboarding, monetization, communication, and
                  feature access for your RentMate SaaS system.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <StatPill
                    icon={BadgeCheck}
                    label="Platform"
                    value={platformStatus}
                    tone={formData.maintenance_mode ? "amber" : "green"}
                  />
                  <StatPill
                    icon={Crown}
                    label="Admin Role"
                    value={formData.admin_role || "Super Admin"}
                    tone="indigo"
                  />
                  <StatPill
                    icon={Database}
                    label="Data Source"
                    value="Live DB"
                    tone="default"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fetchSettings(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              {hasUnsavedChanges && (
                <button
                  type="button"
                  onClick={handleResetChanges}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Discard Changes
                </button>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="mt-5 space-y-3">
            {successMessage && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertTriangle className="h-5 w-5" />
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Unsaved Changes Bar */}
        {hasUnsavedChanges && (
          <div className="sticky top-4 z-20 rounded-3xl border border-indigo-200 bg-indigo-50 px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-indigo-900">
                  You have unsaved changes
                </h3>
                <p className="text-xs text-indigo-700">
                  Save now to apply updates across your RentMate platform.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetChanges}
                  className="rounded-2xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  Discard
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
                >
                  Save All Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* LEFT */}
            <div className="space-y-6 xl:col-span-2">
              {/* Admin Profile */}
              <SectionCard
                icon={UserCircle2}
                title="Admin Profile"
                subtitle="Manage the primary administrator account information."
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    label="Full Name"
                    name="admin_full_name"
                    value={formData.admin_full_name}
                    onChange={handleChange}
                    icon={UserCircle2}
                    placeholder="e.g. Tevin Trax"
                  />
                  <InputField
                    label="Admin Role"
                    name="admin_role"
                    value={formData.admin_role}
                    onChange={handleChange}
                    icon={Crown}
                    placeholder="e.g. Super Admin"
                  />
                  <InputField
                    label="Admin Email"
                    name="admin_email"
                    value={formData.admin_email}
                    onChange={handleChange}
                    type="email"
                    icon={Mail}
                    placeholder="admin@rentmate.com"
                  />
                  <InputField
                    label="Admin Phone"
                    name="admin_phone"
                    value={formData.admin_phone}
                    onChange={handleChange}
                    icon={Phone}
                    placeholder="+2547..."
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Profile Avatar URL"
                      name="admin_avatar_url"
                      value={formData.admin_avatar_url}
                      onChange={handleChange}
                      icon={ImageIcon}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextAreaField
                      label="Admin Bio"
                      name="admin_bio"
                      value={formData.admin_bio}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Short admin profile description..."
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Platform Information */}
              <SectionCard
                icon={Building2}
                title="Platform Information"
                subtitle="Core company and platform identity settings."
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    label="Platform Name"
                    name="platform_name"
                    value={formData.platform_name}
                    onChange={handleChange}
                    icon={Building2}
                  />
                  <InputField
                    label="Website URL"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    icon={Globe}
                  />
                  <InputField
                    label="Support Email"
                    name="support_email"
                    value={formData.support_email}
                    onChange={handleChange}
                    type="email"
                    icon={Mail}
                  />
                  <InputField
                    label="Support Phone"
                    name="support_phone"
                    value={formData.support_phone}
                    onChange={handleChange}
                    icon={Phone}
                  />
                  <SelectField
                    label="Currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    options={[
                      { value: "KES", label: "KES - Kenyan Shilling" },
                      { value: "USD", label: "USD - US Dollar" },
                      { value: "UGX", label: "UGX - Ugandan Shilling" },
                      { value: "TZS", label: "TZS - Tanzanian Shilling" },
                    ]}
                  />
                  <SelectField
                    label="Timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    options={[
                      "Africa/Nairobi",
                      "Africa/Kampala",
                      "Africa/Dar_es_Salaam",
                      "UTC",
                    ]}
                  />
                  <div className="md:col-span-2">
                    <TextAreaField
                      label="Company Address"
                      name="company_address"
                      value={formData.company_address}
                      onChange={handleChange}
                      placeholder="Company HQ / official business address"
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Branding */}
              <SectionCard
                icon={ImageIcon}
                title="Branding Assets"
                subtitle="Update branding resources shown across the platform."
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    label="Logo URL"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    icon={ImageIcon}
                  />
                  <InputField
                    label="Favicon URL"
                    name="favicon_url"
                    value={formData.favicon_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    icon={ImageIcon}
                  />
                </div>

                {(formData.logo_url || formData.admin_avatar_url) && (
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Logo Preview
                      </p>
                      {formData.logo_url ? (
                        <img
                          src={formData.logo_url}
                          alt="Platform Logo"
                          className="h-16 rounded-xl object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <p className="text-sm text-slate-400">No logo provided</p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Admin Avatar Preview
                      </p>
                      {formData.admin_avatar_url ? (
                        <img
                          src={formData.admin_avatar_url}
                          alt="Admin Avatar"
                          className="h-16 w-16 rounded-2xl object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <p className="text-sm text-slate-400">
                          No avatar provided
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </SectionCard>

              {/* Monetization */}
              <SectionCard
                icon={CreditCard}
                title="Monetization & Platform Rules"
                subtitle="Configure commercial settings and default platform limits."
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                  <InputField
                    label="Platform Fee (%)"
                    name="platform_fee_percentage"
                    type="number"
                    value={formData.platform_fee_percentage}
                    onChange={handleChange}
                  />
                  <InputField
                    label="VAT / Tax (%)"
                    name="vat_percentage"
                    type="number"
                    value={formData.vat_percentage}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Trial Days"
                    name="trial_days"
                    type="number"
                    value={formData.trial_days}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Max Property Images"
                    name="max_property_images"
                    type="number"
                    value={formData.max_property_images}
                    onChange={handleChange}
                  />
                </div>
              </SectionCard>

              {/* Security */}
              <SectionCard
                icon={Shield}
                title="Security & Access Control"
                subtitle="Protect platform users and enforce secure defaults."
                rightContent={
                  <button
                    type="button"
                    onClick={() => setShowSensitive((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {showSensitive ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Show Details
                      </>
                    )}
                  </button>
                }
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <InputField
                    label="Session Timeout (Minutes)"
                    name="session_timeout_minutes"
                    type="number"
                    value={formData.session_timeout_minutes}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Minimum Password Length"
                    name="password_min_length"
                    type="number"
                    value={formData.password_min_length}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Max Login Attempts"
                    name="max_login_attempts"
                    type="number"
                    value={formData.max_login_attempts}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ToggleRow
                    title="Require Two-Factor Authentication"
                    subtitle="Enforce 2FA for higher platform security."
                    checked={formData.two_factor_required}
                    onChange={(val) =>
                      handleToggle("two_factor_required", val)
                    }
                  />
                  <ToggleRow
                    title="Require KYC Verification"
                    subtitle="Require landlords or users to verify identity."
                    checked={formData.require_kyc_verification}
                    onChange={(val) =>
                      handleToggle("require_kyc_verification", val)
                    }
                  />
                  <ToggleRow
                    title="Require Email Verification"
                    subtitle="Users must verify their email before access."
                    checked={formData.require_email_verification}
                    onChange={(val) =>
                      handleToggle("require_email_verification", val)
                    }
                  />
                  <ToggleRow
                    title="Admin Login Alerts"
                    subtitle="Send alerts when admin logins are detected."
                    checked={formData.admin_login_alerts}
                    onChange={(val) =>
                      handleToggle("admin_login_alerts", val)
                    }
                  />
                </div>

                {showSensitive && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">
                      Security Recommendation
                    </p>
                    <p className="mt-1 text-xs leading-6 text-slate-600">
                      For production, keep password minimum length at least{" "}
                      <span className="font-semibold">8–12</span>, enable{" "}
                      <span className="font-semibold">2FA</span>, and require{" "}
                      <span className="font-semibold">email verification</span>{" "}
                      for all admin-access accounts.
                    </p>
                  </div>
                )}
              </SectionCard>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* Admin Summary */}
              <SectionCard
                icon={Crown}
                title="Account Summary"
                subtitle="Quick view of the current admin account."
              >
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {formData.admin_avatar_url ? (
                    <img
                      src={formData.admin_avatar_url}
                      alt="Admin Avatar"
                      className="h-16 w-16 rounded-2xl object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                      <UserCircle2 className="h-10 w-10 text-indigo-600" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {formData.admin_full_name || "Administrator"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {formData.admin_role || "Super Admin"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formData.admin_email || "No admin email configured"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                    <CalendarClock className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Last Updated</p>
                      <p className="text-sm font-medium text-slate-800">
                        {formatDate(formData.updated_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                    <Database className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Record Created</p>
                      <p className="text-sm font-medium text-slate-800">
                        {formatDate(formData.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Registration */}
              <SectionCard
                icon={SlidersHorizontal}
                title="Registration Controls"
                subtitle="Control who can join and how onboarding is managed."
              >
                <div className="space-y-4">
                  <ToggleRow
                    title="Allow Landlord Registration"
                    subtitle="Enable self-registration for landlords."
                    checked={formData.allow_landlord_registration}
                    onChange={(val) =>
                      handleToggle("allow_landlord_registration", val)
                    }
                  />
                  <ToggleRow
                    title="Allow Tenant Registration"
                    subtitle="Enable self-registration for tenants."
                    checked={formData.allow_tenant_registration}
                    onChange={(val) =>
                      handleToggle("allow_tenant_registration", val)
                    }
                  />
                  <ToggleRow
                    title="Require Property Approval"
                    subtitle="Admin must approve properties before they go live."
                    checked={formData.require_property_approval}
                    onChange={(val) =>
                      handleToggle("require_property_approval", val)
                    }
                  />
                </div>
              </SectionCard>

              {/* Notifications */}
              <SectionCard
                icon={Bell}
                title="Notification Preferences"
                subtitle="Set default communication channels for the platform."
              >
                <div className="space-y-4">
                  <ToggleRow
                    title="Email Notifications"
                    subtitle="Enable email alerts and updates."
                    checked={formData.email_notifications}
                    onChange={(val) =>
                      handleToggle("email_notifications", val)
                    }
                  />
                  <ToggleRow
                    title="SMS Notifications"
                    subtitle="Enable SMS-based communication."
                    checked={formData.sms_notifications}
                    onChange={(val) => handleToggle("sms_notifications", val)}
                  />
                  <ToggleRow
                    title="Push Notifications"
                    subtitle="Enable in-app push notifications."
                    checked={formData.push_notifications}
                    onChange={(val) => handleToggle("push_notifications", val)}
                  />
                </div>
              </SectionCard>

              {/* Features */}
              <SectionCard
                icon={Wrench}
                title="Feature Toggles"
                subtitle="Turn major platform modules on or off."
              >
                <div className="space-y-4">
                  <ToggleRow
                    title="Enable Online Payments"
                    subtitle="Allow digital rent and fee collection."
                    checked={formData.enable_online_payments}
                    onChange={(val) =>
                      handleToggle("enable_online_payments", val)
                    }
                  />
                  <ToggleRow
                    title="Enable Maintenance Requests"
                    subtitle="Allow tenants to submit maintenance issues."
                    checked={formData.enable_maintenance_requests}
                    onChange={(val) =>
                      handleToggle("enable_maintenance_requests", val)
                    }
                  />
                  <ToggleRow
                    title="Enable Chat System"
                    subtitle="Enable landlord-tenant communication."
                    checked={formData.enable_chat_system}
                    onChange={(val) => handleToggle("enable_chat_system", val)}
                  />
                  <ToggleRow
                    title="Enable Reviews"
                    subtitle="Allow property or service reviews."
                    checked={formData.enable_reviews}
                    onChange={(val) => handleToggle("enable_reviews", val)}
                  />
                  <ToggleRow
                    title="Enable Support Tickets"
                    subtitle="Allow users to submit support requests."
                    checked={formData.enable_support_tickets}
                    onChange={(val) =>
                      handleToggle("enable_support_tickets", val)
                    }
                  />
                  <ToggleRow
                    title="Enable Property Reports"
                    subtitle="Allow issue reporting on listed properties."
                    checked={formData.enable_property_reports}
                    onChange={(val) =>
                      handleToggle("enable_property_reports", val)
                    }
                  />
                </div>
              </SectionCard>

              {/* System Status */}
              <SectionCard
                icon={Lock}
                title="System Status"
                subtitle="Control emergency or platform-wide operational states."
              >
                <div className="space-y-4">
                  <ToggleRow
                    title="Maintenance Mode"
                    subtitle="Temporarily restrict access for maintenance or upgrades."
                    checked={formData.maintenance_mode}
                    onChange={(val) => handleToggle("maintenance_mode", val)}
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-800">
                    Warning
                  </p>
                  <p className="mt-1 text-xs leading-6 text-amber-700">
                    Turning on maintenance mode can block user activity
                    depending on how your frontend guards, middleware, and route
                    protection are configured.
                  </p>
                </div>
              </SectionCard>

              {/* Danger Zone */}
              <SectionCard
                icon={AlertTriangle}
                title="Danger Zone"
                subtitle="Critical actions that should be handled carefully."
              >
                <div className="space-y-4">
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <h4 className="text-sm font-semibold text-rose-800">
                      High-risk settings
                    </h4>
                    <p className="mt-1 text-xs leading-6 text-rose-700">
                      Changes to onboarding, payments, security, or maintenance
                      mode can affect all landlords, tenants, and platform
                      operations immediately after save.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetChanges}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Reset Unsaved Changes
                  </button>
                </div>
              </SectionCard>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}