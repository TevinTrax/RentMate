import React, { useEffect, useState } from "react";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Lock,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Globe,
  BadgeCheck,
  Home,
  HeartHandshake,
  ChevronRight,
  Upload,
  Moon,
  Smartphone,
  FileText,
  Eye,
} from "lucide-react";

export default function TenantSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [tenantMeta, setTenantMeta] = useState({
    unit_name: "—",
    property_name: "—",
    lease_status: "—",
    rent_due_day: "—",
  });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    national_id: "",
    occupation: "",
    bio: "",
    address: "",
    language: "English",
    timezone: "Africa/Nairobi",

    current_password: "",
    new_password: "",
    confirm_password: "",

    email_notifications: false,
    sms_notifications: false,
    push_notifications: false,
    payment_reminders: false,
    maintenance_updates: false,
    lease_updates: false,
    marketing_emails: false,

    auto_pay: false,
    preferred_payment_method: "M-Pesa",
    payment_day_reminder: "3 days before due date",

    emergency_name: "",
    emergency_phone: "",
    emergency_relationship: "",

    profile_visibility: "Landlord Only",
    share_activity_status: false,
    two_factor_auth: false,
    dark_mode: false,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "emergency", label: "Emergency", icon: HeartHandshake },
    { id: "privacy", label: "Privacy", icon: Lock },
  ];

  useEffect(() => {
    fetchTenantSettings();
  }, []);

  const fetchTenantSettings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/tenant/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      const user = data.user || {};
      const tenantSettings = data.tenantSettings || {};
      const leaseInfo = data.leaseInfo || {};

      setFormData((prev) => ({
        ...prev,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        national_id: user.national_id || "",
        occupation: user.occupation || "",
        bio: user.bio || "",
        address: user.address || "",
        language: user.language || "English",
        timezone: user.timezone || "Africa/Nairobi",

        email_notifications: tenantSettings.email_notifications ?? false,
        sms_notifications: tenantSettings.sms_notifications ?? false,
        push_notifications: tenantSettings.push_notifications ?? false,
        payment_reminders: tenantSettings.payment_reminders ?? false,
        maintenance_updates: tenantSettings.maintenance_updates ?? false,
        lease_updates: tenantSettings.lease_updates ?? false,
        marketing_emails: tenantSettings.marketing_emails ?? false,

        auto_pay: tenantSettings.auto_pay ?? false,
        preferred_payment_method:
          tenantSettings.preferred_payment_method || "M-Pesa",
        payment_day_reminder:
          tenantSettings.payment_day_reminder || "3 days before due date",

        emergency_name: tenantSettings.emergency_name || "",
        emergency_phone: tenantSettings.emergency_phone || "",
        emergency_relationship: tenantSettings.emergency_relationship || "",

        profile_visibility:
          tenantSettings.profile_visibility || "Landlord Only",
        share_activity_status:
          tenantSettings.share_activity_status ?? false,
        two_factor_auth: tenantSettings.two_factor_auth ?? false,
        dark_mode: tenantSettings.dark_mode ?? false,
      }));

      setTenantMeta({
        unit_name: leaseInfo.unit_name || "N/A",
        property_name: leaseInfo.property_name || "N/A",
        lease_status: leaseInfo.lease_status || "N/A",
        rent_due_day: leaseInfo.rent_due_day || "N/A",
      });

      setAvatarPreview(
        user.profile_picture ||
          "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(`${user.first_name || ""} ${user.last_name || ""}`) +
            "&background=6366f1&color=fff"
      );
    } catch (error) {
      console.error("Failed to fetch tenant settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);

      const token = localStorage.getItem("token");

      const payload = new FormData();

      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      if (avatarFile) {
        payload.append("profile_picture", avatarFile);
      }

      await axios.put("http://localhost:5000/api/tenant/settings", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert(error?.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-md border border-slate-200">
          <Loader2 className="animate-spin text-indigo-600" size={22} />
          <span className="text-slate-700 font-medium">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl mt-16">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">Tenant Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Account Settings
            </h1>
            <p className="mt-1 text-slate-500">
              Manage your profile, notifications, security, and payment preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={18} />
                Settings saved successfully
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <div className="sticky top-6 h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Profile Card */}
            <div className="mb-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-5 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Tenant Avatar"
                    className="h-20 w-20 rounded-2xl border-2 border-white/30 object-cover"
                  />
                  <label className="absolute -bottom-2 -right-2 cursor-pointer rounded-xl bg-white p-2 text-slate-700 shadow hover:bg-slate-100">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    {formData.first_name} {formData.last_name}
                  </h3>
                  <p className="text-sm text-indigo-100">Tenant Account</p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                    <BadgeCheck size={14} />
                    Verified Tenant
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white/10 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Current Unit</span>
                  <span className="font-semibold">{tenantMeta.unit_name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>Property</span>
                  <span className="font-semibold">{tenantMeta.property_name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>Lease Status</span>
                  <span className="font-semibold">{tenantMeta.lease_status}</span>
                </div>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {activeTab === "profile" && (
              <SectionCard
                icon={User}
                title="Profile Information"
                subtitle="Update your personal details and account profile."
              >
                <div className="mb-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h4 className="font-semibold text-slate-800">Profile Photo</h4>
                      <p className="text-sm text-slate-500">
                        Upload a clear profile photo for identification.
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 hover:bg-slate-100">
                      <Upload size={18} />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
                  <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
                  <Input label="Email Address" name="email" value={formData.email} onChange={handleChange} icon={Mail} />
                  <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} icon={Phone} />
                  <Input label="National ID / Passport" name="national_id" value={formData.national_id} onChange={handleChange} />
                  <Input label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
                  <Input label="Address" name="address" value={formData.address} onChange={handleChange} icon={MapPin} />
                  <Select
                    label="Language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    options={["English", "Swahili", "French"]}
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
                  <textarea
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </SectionCard>
            )}

            {activeTab === "notifications" && (
              <SectionCard
                icon={Bell}
                title="Notification Preferences"
                subtitle="Control how you receive updates and reminders."
              >
                <div className="space-y-4">
                  <Toggle name="email_notifications" checked={formData.email_notifications} onChange={handleChange} label="Email Notifications" description="Receive rent invoices, reminders, and updates via email." icon={Mail} />
                  <Toggle name="sms_notifications" checked={formData.sms_notifications} onChange={handleChange} label="SMS Notifications" description="Receive urgent updates and reminders via SMS." icon={Smartphone} />
                  <Toggle name="push_notifications" checked={formData.push_notifications} onChange={handleChange} label="Push Notifications" description="Receive instant app or browser alerts." icon={Bell} />
                  <Toggle name="payment_reminders" checked={formData.payment_reminders} onChange={handleChange} label="Payment Reminders" description="Get notified before your rent due date." icon={CreditCard} />
                  <Toggle name="maintenance_updates" checked={formData.maintenance_updates} onChange={handleChange} label="Maintenance Updates" description="Get updates on repairs and maintenance requests." icon={Home} />
                  <Toggle name="lease_updates" checked={formData.lease_updates} onChange={handleChange} label="Lease Updates" description="Receive notifications for lease renewals and changes." icon={FileText} />
                  <Toggle name="marketing_emails" checked={formData.marketing_emails} onChange={handleChange} label="Promotional Emails" description="Receive optional updates and offers from the platform." icon={Mail} />
                </div>
              </SectionCard>
            )}

            {activeTab === "security" && (
              <SectionCard
                icon={Shield}
                title="Security Settings"
                subtitle="Protect your account with secure login options."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Current Password" name="current_password" type="password" value={formData.current_password} onChange={handleChange} icon={Lock} />
                  <div />
                  <Input label="New Password" name="new_password" type="password" value={formData.new_password} onChange={handleChange} icon={KeyRound} />
                  <Input label="Confirm Password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} icon={KeyRound} />
                </div>

                <div className="mt-6 space-y-4">
                  <Toggle
                    name="two_factor_auth"
                    checked={formData.two_factor_auth}
                    onChange={handleChange}
                    label="Enable Two-Factor Authentication (2FA)"
                    description="Add an extra layer of security when signing in."
                    icon={Shield}
                  />
                </div>
              </SectionCard>
            )}

            {activeTab === "payments" && (
              <SectionCard
                icon={CreditCard}
                title="Payment Preferences"
                subtitle="Manage rent payment settings and billing reminders."
              >
                <div className="space-y-4">
                  <Toggle
                    name="auto_pay"
                    checked={formData.auto_pay}
                    onChange={handleChange}
                    label="Enable Auto Pay"
                    description="Automatically pay rent on the due date."
                    icon={CreditCard}
                  />
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Select
                    label="Preferred Payment Method"
                    name="preferred_payment_method"
                    value={formData.preferred_payment_method}
                    onChange={handleChange}
                    options={["M-Pesa", "Bank Transfer", "Card Payment", "Cash"]}
                  />
                  <Select
                    label="Reminder Timing"
                    name="payment_day_reminder"
                    value={formData.payment_day_reminder}
                    onChange={handleChange}
                    options={[
                      "1 day before due date",
                      "2 days before due date",
                      "3 days before due date",
                      "1 week before due date",
                    ]}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start gap-3">
                    <Home className="mt-1 text-indigo-600" size={20} />
                    <div>
                      <h4 className="font-semibold text-slate-800">Current Billing Info</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        Rent is billed monthly and due on the {tenantMeta.rent_due_day}th of every month.
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

            {activeTab === "emergency" && (
              <SectionCard
                icon={HeartHandshake}
                title="Emergency Contact"
                subtitle="Add someone we can contact in case of emergency."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Full Name" name="emergency_name" value={formData.emergency_name} onChange={handleChange} />
                  <Input label="Phone Number" name="emergency_phone" value={formData.emergency_phone} onChange={handleChange} icon={Phone} />
                  <Input label="Relationship" name="emergency_relationship" value={formData.emergency_relationship} onChange={handleChange} />
                </div>
              </SectionCard>
            )}

            {activeTab === "privacy" && (
              <>
                <SectionCard
                  icon={Lock}
                  title="Privacy & Preferences"
                  subtitle="Manage your visibility and dashboard preferences."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Select
                      label="Profile Visibility"
                      name="profile_visibility"
                      value={formData.profile_visibility}
                      onChange={handleChange}
                      options={["Landlord Only", "Property Manager Only", "Private"]}
                    />
                    <Select
                      label="Timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      options={["Africa/Nairobi", "UTC", "Europe/London", "America/New_York"]}
                    />
                  </div>

                  <div className="mt-6 space-y-4">
                    <Toggle
                      name="share_activity_status"
                      checked={formData.share_activity_status}
                      onChange={handleChange}
                      label="Share Activity Status"
                      description="Allow management to see your online activity status."
                      icon={Eye}
                    />
                    <Toggle
                      name="dark_mode"
                      checked={formData.dark_mode}
                      onChange={handleChange}
                      label="Dark Mode"
                      description="Switch your dashboard appearance."
                      icon={Moon}
                    />
                  </div>
                </SectionCard>

                <SectionCard
                  icon={AlertTriangle}
                  title="Danger Zone"
                  subtitle="These actions are permanent and should be used carefully."
                >
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="font-semibold text-red-700">Delete Tenant Account</h4>
                        <p className="text-sm text-red-600">
                          Permanently remove your account and personal data.
                        </p>
                      </div>
                      <button className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700">
                        <Trash2 size={18} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

function SectionCard({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={22} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Input({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          {...props}
          className={`w-full rounded-2xl border border-slate-300 bg-white py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
            Icon ? "pl-11 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

function Select({ label, options = [], ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <select
        {...props}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ name, checked, onChange, label, description, icon: Icon }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
            <Icon size={18} />
          </div>
        )}
        <div>
          <p className="font-medium text-slate-800">{label}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
      </label>
    </div>
  );
}