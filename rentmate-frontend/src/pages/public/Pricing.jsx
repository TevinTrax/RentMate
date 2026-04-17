import { useEffect, useState } from "react";
import {
  FaBolt,
  FaBuildingColumns,
  FaCheck,
  FaXmark,
  FaUsers,
  FaArrowTrendUp,
  FaSpinner,
  FaTriangleExclamation,
} from "react-icons/fa6";

// ---------------------------------------------------------------------------
// API base URL — reads from Vite env var if defined, otherwise falls back to
// the Express backend on port 5000.  This bypasses Vite proxy issues entirely.
//
// In your .env (or .env.local) add:
//   VITE_API_URL=http://localhost:5000
// ---------------------------------------------------------------------------
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

// Map plan names to icons
const PLAN_ICONS = {
  basic: <FaBuildingColumns size={24} className="text-green-500" />,
  standard: <FaUsers size={24} className="text-green-500" />,
  premium: <FaArrowTrendUp size={24} className="text-green-500" />,
};

const PLAN_BUTTONS = {
  basic: "Get Started",
  standard: "Choose Standard",
  premium: "Go Premium",
};

const PLAN_BUTTON_STYLES = {
  basic:
    "w-full p-2 text-md text-gray-800 border rounded-lg font-semibold hover:text-white hover:bg-green-500 transition-colors duration-200",
  standard:
    "w-full p-2 text-white bg-green-500 hover:bg-green-600 border border-green-500 rounded-lg font-semibold transition-colors duration-200",
  premium:
    "w-full p-2 text-gray-800 border rounded-lg font-semibold hover:text-white hover:bg-green-500 transition-colors duration-200",
};

function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = sessionStorage.getItem("token");

        // Full absolute URL — avoids Vite proxy misses entirely
        const url = `${API_BASE}/api/subscriptions/plans/all`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        // Read raw text first — never blindly call .json()
        const rawText = await response.text();

        // Attempt JSON parse with a clear diagnostic error
        let data;
        try {
          data = JSON.parse(rawText);
        } catch {
          console.error(
            `Non-JSON response from ${url}:`,
            rawText.slice(0, 400)
          );
          throw new Error(
            `Server returned an unexpected response (HTTP ${response.status}). ` +
              `Check that ${url} exists and returns JSON.`
          );
        }

        // Handle HTTP error codes now that we have valid JSON
        if (!response.ok) {
          const message =
            data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`;
          throw new Error(message);
        }

        // Support multiple response shapes: plain array, { plans }, { data }
        const rawPlans = Array.isArray(data)
          ? data
          : Array.isArray(data.plans)
          ? data.plans
          : Array.isArray(data.data)
          ? data.data
          : [];

        // Normalize DB rows into UI-friendly shape
        // Note: backend aliases popular→featured and duration→cycle
        const normalized = rawPlans
          .filter((p) => p.is_active !== false && p.status !== "inactive")
          .map((p) => {
            const key = (p.name ?? "basic").toLowerCase().trim();

            // features is JSONB — handle string[] or { name, included }[]
            let features = [];
            if (Array.isArray(p.features)) {
              features = p.features.map((f) =>
                typeof f === "string"
                  ? { name: f, included: true }
                  : {
                      name: f.name ?? f.feature ?? String(f),
                      included: f.included ?? true,
                    }
              );
            }

            return {
              id: p.id,
              code: key,
              name: p.name,
              price: parseFloat(p.price) || 0,
              description: p.description ?? "",
              // backend returns `featured` (aliased from popular)
              popular: p.featured ?? p.popular ?? false,
              // backend returns `cycle` (aliased from duration)
              duration: p.cycle ?? p.duration ?? "monthly",
              features,
              icon: PLAN_ICONS[key] ?? PLAN_ICONS.basic,
              button: PLAN_BUTTONS[key] ?? "Get Started",
              buttonStyle:
                PLAN_BUTTON_STYLES[key] ?? PLAN_BUTTON_STYLES.basic,
            };
          })
          .sort((a, b) => a.price - b.price); // cheapest → most expensive

        setPlans(normalized);
      } catch (err) {
        console.error("Pricing fetch error:", err);
        setError(err.message ?? "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    try {
      const cleanPlan = {
        id: plan.id,
        code: plan.code,
        name: plan.name,
        price: plan.price,
        description: plan.description,
        features: plan.features,
        popular: plan.popular,
        duration: plan.duration,
      };

      sessionStorage.setItem("selectedPlan", JSON.stringify(cleanPlan));

      const token = sessionStorage.getItem("token");

      if (!token) {
        sessionStorage.setItem("redirectAfterLogin", "/checkout");
        window.location.href = "/sign-in";
        return;
      }

      window.location.href = "/checkout";
    } catch (err) {
      console.error("Error selecting plan:", err);
      alert("Unable to select plan. Please try again.");
    }
  };

  return (
    <section className="w-full bg-green-50 py-18">
      {/* HEADER */}
      <div className="container mx-auto text-center py-20 bg-gradient-to-br from-green-600 to-green-400 rounded-b-3xl shadow-sm">
        <div className="inline-flex items-center bg-blue-100 px-4 py-1 mt-20 rounded-2xl mb-4">
          <FaBolt className="text-green-600 mr-2" />
          <span className="font-semibold text-sm">Flexible Pricing</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Flexible Plans for Every Property Owner
        </h1>

        <p className="max-w-xl mx-auto mt-4 text-lg text-gray-700">
          Choose a plan that fits your property needs and start managing
          smarter today.
        </p>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <FaSpinner className="text-green-500 text-4xl animate-spin" />
          <p className="text-gray-500 text-md">Loading plans...</p>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 px-6">
          <FaTriangleExclamation className="text-red-400 text-4xl" />
          <p className="text-gray-700 font-semibold text-lg">
            Failed to load pricing plans
          </p>
          <p className="text-gray-500 text-sm text-center max-w-md">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && plans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 px-6">
          <p className="text-gray-600 font-semibold text-lg">
            No plans available at the moment.
          </p>
          <p className="text-gray-400 text-sm">Please check back later.</p>
        </div>
      )}

      {/* PLAN CARDS */}
      {!loading && !error && plans.length > 0 && (
        <div className="container mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 mb-10">
          {plans.map((plan) => (
            <div
              key={plan.id ?? plan.code}
              className={`relative border rounded-2xl shadow-md p-6 transition-transform duration-300 ease-in-out
                ${
                  plan.popular
                    ? "scale-105 shadow-xl bg-gradient-to-br from-green-50 to-green-100 border-green-500 hover:shadow-2xl hover:scale-110"
                    : "bg-white border-gray-200 hover:shadow-lg"
                }`}
            >
              {/* Popular ribbon badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 w-36 h-36 overflow-hidden rounded-tl-2xl">
                  <div
                    className="absolute bg-green-600 text-white text-xs font-bold text-center shadow-lg"
                    style={{
                      width: "160px",
                      top: "28px",
                      left: "-38px",
                      transform: "rotate(-45deg)",
                      padding: "4px 0",
                    }}
                  >
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="w-fit bg-green-100 p-4 rounded-lg mb-2">
                {plan.icon}
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                {plan.name}
              </h2>

              <p className="text-sm text-gray-500 mt-2">{plan.description}</p>

              <h3 className="text-2xl font-bold text-gray-900 mt-4">
                Ksh {plan.price.toLocaleString()}
                <span className="text-sm font-medium text-gray-500">
                  {" "}
                  /{plan.duration === "monthly" ? "month" : plan.duration}
                </span>
              </h3>

              <ul className="space-y-3 mt-6 text-sm text-left">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-2 ${
                      f.included ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {f.included ? (
                      <FaCheck className="text-green-500 flex-shrink-0" />
                    ) : (
                      <FaXmark className="text-gray-400 flex-shrink-0" />
                    )}
                    <span>{f.name}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <button
                  type="button"
                  className={plan.buttonStyle}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.button}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Pricing;