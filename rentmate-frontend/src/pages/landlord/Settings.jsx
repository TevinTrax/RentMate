import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Settings,
  Trash2,
  Save,
  Lock,
  Mail,
  Phone,
  Globe,
  Loader2,
  Camera,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Crown,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function LandlordSettings() {
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageFile, setImageFile] = useState(null);

  const [settings, setSettings] = useState({
    profile: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      profile_image: "",
      bio: "",
    },
    company: {
      company_name: "",
      business_email: "",
      business_phone: "",
      website: "",
      kra_pin: "",
      company_address: "",
    },
    notifications: {
      email_notifications: true,
      sms_notifications: false,
      rent_reminders: true,
      maintenance_alerts: true,
      payment_alerts: true,
      marketing_updates: false,
    },
    security: {
      two_factor_enabled: false,
      login_alerts: true,
      session_timeout: "30",
    },
    preferences: {
      currency: "KES",
      timezone: "Africa/Nairobi",
      theme: "light",
      language: "English",
    },
    subscription: {
      current_plan: "Free",
      billing_cycle: "Monthly",
      next_billing_date: "",
      plan_status: "Active",
    },
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const tabs = useMemo(
    () => [
      { id: "profile", label: "Profile", icon: User },
      { id: "company", label: "Business", icon: Building2 },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "security", label: "Security", icon: Shield },
      { id: "subscription", label: "Billing", icon: CreditCard },
      { id: "preferences", label: "Preferences", icon: Settings },
      { id: "danger", label: "Danger Zone", icon: Trash2 },
    ],
    []
  );

  useEffect(() => {
    fetchSettings();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 4000);
  };

  const apiRequest = async (endpoint, options = {}) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    let data = {};
    try {
      data = await res.json();
    } catch (err) {
      data = {};
    }

    if (!res.ok) {
      throw new Error(data?.message || "Something went wrong");
    }

    return data;
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/landlord/settings", {
        method: "GET",
      });

      setSettings((prev) => ({
        profile: {
          ...prev.profile,
          ...(data.profile || {}),
        },
        company: {
          ...prev.company,
          ...(data.company || {}),
        },
        notifications: {
          ...prev.notifications,
          ...(data.notifications || {}),
        },
        security: {
          ...prev.security,
          ...(data.security || {}),
        },
        preferences: {
          ...prev.preferences,
          ...(data.preferences || {}),
        },
        subscription: {
          ...prev.subscription,
          ...(data.subscription || {}),
        },
      }));
    } catch (error) {
      console.error("Fetch settings error:", error);
      showMessage("error", error.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSection = async (section) => {
    try {
      setSavingSection(section);

      await apiRequest(`/landlord/settings/${section}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings[section]),
      });

      showMessage("success", `${capitalize(section)} settings updated successfully.`);
      await fetchSettings();
    } catch (error) {
      console.error(`Save ${section} error:`, error);
      showMessage("error", error.message || `Failed to update ${section}.`);
    } finally {
      setSavingSection("");
    }
  };

  const uploadProfileImage = async () => {
    if (!imageFile) return;

    try {
      setSavingSection("profile-image");

      const formData = new FormData();
      formData.append("profile_image", imageFile);

      const res = await fetch(`${API_BASE}/landlord/settings/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to upload image");
      }

      setSettings((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          profile_image: data.profile_image,
        },
      }));

      showMessage("success", "Profile image updated successfully.");
      setImageFile(null);
    } catch (error) {
      console.error("Upload avatar error:", error);
      showMessage("error", error.message || "Failed to upload profile image.");
    } finally {
      setSavingSection("");
    }
  };

  const updatePassword = async () => {
    try {
      if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
        return showMessage("error", "All password fields are required.");
      }

      if (passwordData.new_password !== passwordData.confirm_password) {
        return showMessage("error", "New passwords do not match.");
      }

      if (passwordData.new_password.length < 6) {
        return showMessage("error", "Password must be at least 6 characters.");
      }

      setSavingSection("password");

      await apiRequest("/landlord/settings/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      showMessage("success", "Password updated successfully.");

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Password update error:", error);
      showMessage("error", error.message || "Failed to update password.");
    } finally {
      setSavingSection("");
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setSavingSection("danger");

      await apiRequest("/landlord/settings/delete-account", {
        method: "DELETE",
      });

      showMessage("success", "Account deleted successfully.");
      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.error("Delete account error:", error);
      showMessage("error", error.message || "Failed to delete account.");
    } finally {
      setSavingSection("");
    }
  };

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const fullName = `${settings.profile.first_name || ""} ${settings.profile.last_name || ""}`.trim();
  const initials =
    `${settings.profile.first_name?.[0] || ""}${settings.profile.last_name?.[0] || ""}`.toUpperCase() || "L";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-lg">
          <Loader2 className="animate-spin w-6 h-6 text-cyan-600" />
          Loading landlord settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto pt-20">
        {/* Top Header */}
        <div className="mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <p className="text-sm text-slate-500 mb-2 flex items-center gap-2">
              Dashboard <ChevronRight className="w-4 h-4" /> Settings
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Landlord Settings
            </h1>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Manage your landlord account, business profile, preferences, billing,
              notifications, and security from one place.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl px-5 py-4 min-w-[280px] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                {settings.profile.profile_image ? (
                  <img
                    src={settings.profile.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-cyan-700 text-lg">{initials}</span>
                )}
              </div>

              <div>
                <p className="text-slate-900 font-semibold text-lg">
                  {fullName || "Landlord Account"}
                </p>
                <p className="text-slate-500 text-sm">{settings.profile.email || "No email"}</p>
                <div className="mt-2 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Account Active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        {message.text && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-3xl p-3 sticky top-6 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all mb-2 ${
                      activeTab === tab.id
                        ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-9 space-y-6">
            {/* PROFILE */}
            {activeTab === "profile" && (
              <SectionCard
                icon={<User className="w-6 h-6 text-cyan-600" />}
                title="Profile Information"
                subtitle="Update your landlord profile and personal details."
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-100 flex items-center justify-center">
                    {settings.profile.profile_image ? (
                      <img
                        src={settings.profile.profile_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-cyan-700 text-2xl">{initials}</span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer hover:bg-slate-200 transition">
                      <Camera className="w-4 h-4" />
                      Choose Photo
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      />
                    </label>

                    <button
                      onClick={uploadProfileImage}
                      disabled={!imageFile || savingSection === "profile-image"}
                      className="px-4 py-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 transition font-medium"
                    >
                      {savingSection === "profile-image" ? "Uploading..." : "Upload Image"}
                    </button>

                    {imageFile && (
                      <p className="text-xs text-slate-500">Selected: {imageFile.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <InputField
                    label="First Name"
                    value={settings.profile.first_name}
                    onChange={(e) => handleInputChange("profile", "first_name", e.target.value)}
                  />
                  <InputField
                    label="Last Name"
                    value={settings.profile.last_name}
                    onChange={(e) => handleInputChange("profile", "last_name", e.target.value)}
                  />
                  <InputField
                    label="Email Address"
                    icon={<Mail className="w-4 h-4" />}
                    value={settings.profile.email}
                    onChange={(e) => handleInputChange("profile", "email", e.target.value)}
                  />
                  <InputField
                    label="Phone Number"
                    icon={<Phone className="w-4 h-4" />}
                    value={settings.profile.phone}
                    onChange={(e) => handleInputChange("profile", "phone", e.target.value)}
                  />
                </div>

                <div className="mt-5">
                  <TextAreaField
                    label="Bio"
                    value={settings.profile.bio}
                    onChange={(e) => handleInputChange("profile", "bio", e.target.value)}
                    placeholder="Tell tenants or staff a little about yourself..."
                  />
                </div>

                <SaveButton
                  onClick={() => saveSection("profile")}
                  loading={savingSection === "profile"}
                />
              </SectionCard>
            )}

            {/* COMPANY */}
            {activeTab === "company" && (
              <SectionCard
                icon={<Building2 className="w-6 h-6 text-cyan-600" />}
                title="Business Information"
                subtitle="Manage your business profile and official company details."
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <InputField
                    label="Company Name"
                    value={settings.company.company_name}
                    onChange={(e) => handleInputChange("company", "company_name", e.target.value)}
                  />
                  <InputField
                    label="Business Email"
                    icon={<Mail className="w-4 h-4" />}
                    value={settings.company.business_email}
                    onChange={(e) =>
                      handleInputChange("company", "business_email", e.target.value)
                    }
                  />
                  <InputField
                    label="Business Phone"
                    icon={<Phone className="w-4 h-4" />}
                    value={settings.company.business_phone}
                    onChange={(e) =>
                      handleInputChange("company", "business_phone", e.target.value)
                    }
                  />
                  <InputField
                    label="Website"
                    icon={<Globe className="w-4 h-4" />}
                    value={settings.company.website}
                    onChange={(e) => handleInputChange("company", "website", e.target.value)}
                  />
                  <InputField
                    label="KRA PIN"
                    value={settings.company.kra_pin}
                    onChange={(e) => handleInputChange("company", "kra_pin", e.target.value)}
                  />
                  <InputField
                    label="Company Address"
                    value={settings.company.company_address}
                    onChange={(e) =>
                      handleInputChange("company", "company_address", e.target.value)
                    }
                  />
                </div>

                <SaveButton
                  onClick={() => saveSection("company")}
                  loading={savingSection === "company"}
                />
              </SectionCard>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <SectionCard
                icon={<Bell className="w-6 h-6 text-cyan-600" />}
                title="Notification Preferences"
                subtitle="Control how you receive alerts, reminders, and updates."
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <ToggleCard
                    title="Email Notifications"
                    checked={settings.notifications.email_notifications}
                    onChange={(value) =>
                      handleInputChange("notifications", "email_notifications", value)
                    }
                  />
                  <ToggleCard
                    title="SMS Notifications"
                    checked={settings.notifications.sms_notifications}
                    onChange={(value) =>
                      handleInputChange("notifications", "sms_notifications", value)
                    }
                  />
                  <ToggleCard
                    title="Rent Reminders"
                    checked={settings.notifications.rent_reminders}
                    onChange={(value) =>
                      handleInputChange("notifications", "rent_reminders", value)
                    }
                  />
                  <ToggleCard
                    title="Maintenance Alerts"
                    checked={settings.notifications.maintenance_alerts}
                    onChange={(value) =>
                      handleInputChange("notifications", "maintenance_alerts", value)
                    }
                  />
                  <ToggleCard
                    title="Payment Alerts"
                    checked={settings.notifications.payment_alerts}
                    onChange={(value) =>
                      handleInputChange("notifications", "payment_alerts", value)
                    }
                  />
                  <ToggleCard
                    title="Marketing Updates"
                    checked={settings.notifications.marketing_updates}
                    onChange={(value) =>
                      handleInputChange("notifications", "marketing_updates", value)
                    }
                  />
                </div>

                <SaveButton
                  onClick={() => saveSection("notifications")}
                  loading={savingSection === "notifications"}
                />
              </SectionCard>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <SectionCard
                icon={<Shield className="w-6 h-6 text-cyan-600" />}
                title="Security Settings"
                subtitle="Protect your account and manage sign-in security."
              >
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <ToggleCard
                    title="Two-Factor Authentication"
                    checked={settings.security.two_factor_enabled}
                    onChange={(value) =>
                      handleInputChange("security", "two_factor_enabled", value)
                    }
                  />
                  <ToggleCard
                    title="Login Alerts"
                    checked={settings.security.login_alerts}
                    onChange={(value) =>
                      handleInputChange("security", "login_alerts", value)
                    }
                  />
                </div>

                <div className="mb-8">
                  <SelectField
                    label="Session Timeout"
                    value={settings.security.session_timeout}
                    onChange={(e) =>
                      handleInputChange("security", "session_timeout", e.target.value)
                    }
                    options={[
                      { value: "15", label: "15 Minutes" },
                      { value: "30", label: "30 Minutes" },
                      { value: "60", label: "1 Hour" },
                      { value: "120", label: "2 Hours" },
                    ]}
                  />
                </div>

                <SaveButton
                  onClick={() => saveSection("security")}
                  loading={savingSection === "security"}
                />

                <div className="border-t border-slate-200 pt-8 mt-8">
                  <div className="flex items-center gap-3 mb-5">
                    <KeyRound className="w-5 h-5 text-cyan-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-5">
                    <InputField
                      label="Current Password"
                      type="password"
                      icon={<Lock className="w-4 h-4" />}
                      value={passwordData.current_password}
                      onChange={(e) => handlePasswordChange("current_password", e.target.value)}
                    />
                    <InputField
                      label="New Password"
                      type="password"
                      icon={<Lock className="w-4 h-4" />}
                      value={passwordData.new_password}
                      onChange={(e) => handlePasswordChange("new_password", e.target.value)}
                    />
                    <InputField
                      label="Confirm Password"
                      type="password"
                      icon={<Lock className="w-4 h-4" />}
                      value={passwordData.confirm_password}
                      onChange={(e) => handlePasswordChange("confirm_password", e.target.value)}
                    />
                  </div>

                  <button
                    onClick={updatePassword}
                    disabled={savingSection === "password"}
                    className="mt-6 px-5 py-3 rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700 transition font-medium disabled:opacity-50"
                  >
                    {savingSection === "password" ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </SectionCard>
            )}

            {/* SUBSCRIPTION */}
            {activeTab === "subscription" && (
              <SectionCard
                icon={<CreditCard className="w-6 h-6 text-cyan-600" />}
                title="Billing & Subscription"
                subtitle="Monitor your current plan, status, and billing details."
              >
                <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-cyan-50 to-indigo-50 border border-cyan-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <h3 className="text-xl font-semibold text-slate-900">
                      {settings.subscription.current_plan || "No Plan"}
                    </h3>
                  </div>
                  <p className="text-slate-600">
                    You can manage your active subscription and billing cycle here.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <InfoCard title="Current Plan" value={settings.subscription.current_plan || "N/A"} />
                  <InfoCard title="Billing Cycle" value={settings.subscription.billing_cycle || "N/A"} />
                  <InfoCard
                    title="Next Billing Date"
                    value={settings.subscription.next_billing_date || "N/A"}
                  />
                  <InfoCard title="Plan Status" value={settings.subscription.plan_status || "N/A"} />
                </div>

                <div className="mt-6">
                  <button className="px-5 py-3 rounded-2xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition font-medium text-slate-800">
                    Manage Subscription
                  </button>
                </div>
              </SectionCard>
            )}

            {/* PREFERENCES */}
            {activeTab === "preferences" && (
              <SectionCard
                icon={<Sparkles className="w-6 h-6 text-cyan-600" />}
                title="System Preferences"
                subtitle="Customize how your landlord dashboard behaves."
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <SelectField
                    label="Currency"
                    value={settings.preferences.currency}
                    onChange={(e) =>
                      handleInputChange("preferences", "currency", e.target.value)
                    }
                    options={[
                      { value: "KES", label: "KES - Kenyan Shilling" },
                      { value: "USD", label: "USD - US Dollar" },
                      { value: "EUR", label: "EUR - Euro" },
                    ]}
                  />

                  <SelectField
                    label="Timezone"
                    value={settings.preferences.timezone}
                    onChange={(e) =>
                      handleInputChange("preferences", "timezone", e.target.value)
                    }
                    options={[
                      { value: "Africa/Nairobi", label: "Africa/Nairobi" },
                      { value: "UTC", label: "UTC" },
                    ]}
                  />

                  <SelectField
                    label="Theme"
                    value={settings.preferences.theme}
                    onChange={(e) =>
                      handleInputChange("preferences", "theme", e.target.value)
                    }
                    options={[
                      { value: "dark", label: "Dark" },
                      { value: "light", label: "Light" },
                    ]}
                  />

                  <SelectField
                    label="Language"
                    value={settings.preferences.language}
                    onChange={(e) =>
                      handleInputChange("preferences", "language", e.target.value)
                    }
                    options={[
                      { value: "English", label: "English" },
                      { value: "Swahili", label: "Swahili" },
                    ]}
                  />
                </div>

                <SaveButton
                  onClick={() => saveSection("preferences")}
                  loading={savingSection === "preferences"}
                />
              </SectionCard>
            )}

            {/* DANGER */}
            {activeTab === "danger" && (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
                    <p className="text-red-600 text-sm">
                      These actions are permanent and cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-red-200 rounded-2xl p-5">
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">Delete Account</h3>
                  <p className="text-slate-600 mb-5">
                    Permanently delete your landlord account, properties, tenants,
                    and all related data.
                  </p>

                  <button
                    onClick={deleteAccount}
                    disabled={savingSection === "danger"}
                    className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white transition font-medium disabled:opacity-50"
                  >
                    {savingSection === "danger" ? "Deleting..." : "Delete My Account"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-slate-500 text-sm">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function InputField({ label, icon, type = "text", value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-2 font-medium">{label}</label>
      <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-2xl px-4 py-3 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100 transition">
        {icon && <span className="text-slate-400">{icon}</span>}
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-2 font-medium">{label}</label>
      <textarea
        rows={5}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition text-slate-900 placeholder:text-slate-400"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options = [] }) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-2 font-medium">{label}</label>
      <select
        value={value || ""}
        onChange={onChange}
        className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition text-slate-900"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleCard({ title, checked, onChange }) {
  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-4">
      <span className="text-slate-900 font-medium">{title}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-14 h-8 rounded-full p-1 transition ${
          checked ? "bg-cyan-600" : "bg-slate-300"
        }`}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SaveButton({ onClick, loading }) {
  return (
    <div className="mt-6">
      <button
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white transition font-medium disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <p className="text-slate-500 text-sm mb-2">{title}</p>
      <h3 className="text-lg font-semibold text-slate-900">{value}</h3>
    </div>
  );
}