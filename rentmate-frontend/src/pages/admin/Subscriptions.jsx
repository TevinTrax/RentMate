import { useState } from "react";
import {
  Building2,
  Users2,
  TrendingUp,
  DollarSign,
  DollarSignIcon
} from "lucide-react";
import CountUp from "react-countup";

const plansInitial = {
  basic: {
    name: "Basic Plan",
    enabled: true,
    price: 3500,
    maxProperties: 5,
    subscribers: 450,
    features: [
      "Up to 5 properties",
      "Tenant Management",
      "Rent Tracking",
      "Maintenance Requests",
      "Email Support",
    ],
    excludedFeatures: [
      "Financial Reports",
      "Team Access",
      "Priority Support",
      "Analytics Dashboard",
    ],
  },
  standard: {
    name: "Standard Plan",
    enabled: true,
    price: 6500,
    maxProperties: 20,
    subscribers: 50,
    features: [
      "Up to 20 properties",
      "Tenant Management",
      "Rent Tracking & Reminders",
      "Maintenance Requests",
      "Financial Reports",
      "Tenant Messaging",
      "Document Storage",
      "Email Support",
    ],
    excludedFeatures: [
      "Team Access",
      "Priority Support",
      "Analytics Dashboard",
    ],
  },
  premium: {
    name: "Premium Plan",
    enabled: true,
    price: 9500,
    maxProperties: Infinity,
    subscribers: 10,
    features: [
      "Unlimited Properties",
      "Tenant Management",
      "Rent Tracking & Reminders",
      "Maintenance Requests",
      "Advanced Financial Reports",
      "Tenant Messaging",
      "Document Storage",
      "Email Support",
      "Analytics Dashboard",
      "Team Access (up to 5 users)",
      "Priority Support",
      "Custom Branding",
    ],
    excludedFeatures: [],
  },
};

function AdminPackageSubscriptions() {
  const [plans, setPlans] = useState(plansInitial);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editPlanKey, setEditPlanKey] = useState(null);

  const openEditModal = (planKey) => {
    setEditPlanKey(planKey);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    if (!isSaving) {
      setIsEditOpen(false);
      setEditPlanKey(null);
    }
  };

  const toggleEnabled = (planKey) => {
    setPlans((prev) => ({
      ...prev,
      [planKey]: {
        ...prev[planKey],
        enabled: !prev[planKey].enabled,
      },
    }));
  };

  const updateEditField = (field, value) => {
    setPlans((prev) => ({
      ...prev,
      [editPlanKey]: {
        ...prev[editPlanKey],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    if (isSaving) return; // prevent if already saving

    setIsSaving(true);

    // simulate API call with 1.5s delay
    setTimeout(() => {
      setIsSaving(false);
      setIsEditOpen(false);
      setEditPlanKey(null);
    }, 1500);
  };

  const editingPlan = editPlanKey ? plans[editPlanKey] : null;

  // Helper to get icon component by plan key
  const getPlanIcon = (key) => {
    switch (key) {
      case "basic":
        return <Building2 size={24} className="text-blue-600" />;
      case "standard":
        return <Users2 size={24} className="text-blue-600" />;
      case "premium":
        return <TrendingUp size={24} className="text-blue-600" />;
      default:
        return <Building2 size={24} className="text-blue-600" />;
    }
  };

  return (
    <section className="w-full">
      <div className="p-2 grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
        {Object.entries(plans).map(([key, plan]) => (
          <div
            key={key}
            className="p-6 rounded-lg bg-gray-100 border border-gray-300 shadow-sm max-w-md transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-blue-100">
                {getPlanIcon(key)}
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={plan.enabled}
                    onChange={() => toggleEnabled(key)}
                  />
                  <div
                    className="relative w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600
                      after:content-[''] after:absolute after:top-0.5 after:left-0.5
                      after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all
                      peer-checked:after:translate-x-5"
                  />
                </label>

                <span className="text-sm font-medium text-gray-700">
                  {plan.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>

              <p className="mt-3 text-gray-600 flex items-center">
                <Users2 size={16} className="mr-2" />
                <span className="text-blue-500 font-bold mr-1">{plan.subscribers}</span>
                active subscribers
              </p>

              <h3 className="text-xl text-gray-800 mt-2 font-bold">
                KES {plan.price}
                <span className="text-md text-gray-400"> / month</span>
              </h3>

              <ul className="mt-4 space-y-2 text-gray-700 text-sm">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center">
                    <span className="mr-2 text-green-500 font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
                {plan.excludedFeatures.map((feat) => (
                  <li key={feat} className="flex items-center text-gray-400">
                    <span className="mr-2">❌</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => openEditModal(key)}
              className="w-full mt-6 px-4 py-2 rounded-lg border border-gray-300 font-bold transition hover:bg-gray-800 hover:text-white active:scale-95"
              disabled={isSaving} // disable while saving
            >
              Edit Pricing
            </button>
          </div>
        ))}

        {isEditOpen && editingPlan && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={closeEditModal}
          >
            <div
              className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()} // prevent modal close on clicking inside modal
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Edit {editingPlan.name}
                </h2>
                <button
                  onClick={closeEditModal}
                  className="text-xl text-gray-500 hover:text-red-500"
                  disabled={isSaving}
                >
                  ❌
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price (KES)
                  </label>
                  <input
                    type="number"
                    value={editingPlan.price}
                    onChange={(e) => updateEditField("price", Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Properties
                  </label>
                  <input
                    type="number"
                    value={editingPlan.maxProperties === Infinity ? "" : editingPlan.maxProperties}
                    placeholder={editingPlan.maxProperties === Infinity ? "Unlimited" : ""}
                    onChange={(e) =>
                      updateEditField(
                        "maxProperties",
                        e.target.value === "" ? Infinity : Number(e.target.value)
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeEditModal}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving && (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <Users2 className="text-white" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Total Subscribers</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={820} duration={2} separator="," />
              </h2>
            </div>
          </div>

          {/* Tenants */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-300">
              <DollarSign className="text-gray-800" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Monthly Revenue</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                KES <CountUp end={6.75} duration={2} decimal="." suffix="M" separator="," />
              </h2>
            </div>
          </div>

          {/* Landlords */}
          <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-700">
              <TrendingUp className="text-white" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Yearly Revenue</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                KES <CountUp end={18.2} duration={2} decimal="." suffix="M"/>
              </h2>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700">
              <DollarSignIcon className="text-white" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Avg.Revenue/user</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                KES <CountUp end={7941} duration={2} separator=","/>
              </h2>
            </div>
          </div>
        </div>
    </section>
  );
}

export default AdminPackageSubscriptions;