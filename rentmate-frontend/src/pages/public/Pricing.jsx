import {
  FaBolt,
  FaBuildingColumns,
  FaCheck,
  FaXmark,
  FaUsers,
  FaArrowTrendUp,
} from "react-icons/fa6";

function Pricing() {
  const plans = [
    {
      id: 1,
      name: "Basic",
      icon: <FaBuildingColumns size={24} className="text-green-500" />,
      price: 3500,
      description: "Ideal for small landlords or single property owners",
      button: "Get Started",
      buttonStyle:
        "w-full p-2 text-md text-gray-800 border rounded-lg font-semibold hover:text-white hover:bg-green-500",
      features: [
        { name: "Up to 10 Properties", included: true },
        { name: "Tenant Management", included: true },
        { name: "Rent Tracking", included: true },
        { name: "Maintenance Requests", included: true },
        { name: "Email Support", included: true },
        { name: "Financial Reports", included: false },
        { name: "Team Access", included: false },
        { name: "Priority Support", included: false },
        { name: "Analytics Dashboard", included: false },
      ],
    },
    {
      id: 2,
      name: "Standard",
      popular: true,
      icon: <FaUsers size={24} className="text-green-500" />,
      price: 6500,
      description: "For medium-scale landlords",
      button: "Choose Standard",
      buttonStyle:
        "w-full p-2 text-white bg-green-500 hover:bg-green-600 border rounded-lg font-semibold",
      features: [
        { name: "Up to 20 Properties", included: true },
        { name: "Tenant Management", included: true },
        { name: "Rent Tracking & Reminders", included: true },
        { name: "Maintenance Requests", included: true },
        { name: "Financial Reports", included: true },
        { name: "Tenant Messaging", included: true },
        { name: "Document Storage", included: true },
        { name: "Email Support", included: true },
        { name: "Team Access", included: false },
        { name: "Priority Support", included: false },
        { name: "Analytics Dashboard", included: false },
      ],
    },
    {
      id: 3,
      name: "Premium",
      icon: <FaArrowTrendUp size={24} className="text-green-500" />,
      price: 9500,
      description: "For large property managers or agencies",
      button: "Go Premium",
      buttonStyle:
        "w-full p-2 text-gray-800 border rounded-lg font-semibold hover:text-white hover:bg-green-500",
      features: [
        { name: "Unlimited Properties", included: true },
        { name: "Tenant Management", included: true },
        { name: "Rent Tracking", included: true },
        { name: "Maintenance Requests", included: true },
        { name: "Advanced Financial Reports", included: true },
        { name: "Tenant Messaging", included: true },
        { name: "Document Storage", included: true },
        { name: "Analytics Dashboard", included: true },
        { name: "Team Access (up to 5 users)", included: true },
        { name: "Priority Support", included: true },
        { name: "Custom Branding", included: true },
      ],
    },
  ];

  const handleSelectPlan = (plan) => {
    try {
      // Save plan cleanly
      const cleanPlan = {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        description: plan.description,
        features: plan.features,
        popular: plan.popular || false,
      };
      sessionStorage.setItem("selectedPlan", JSON.stringify(cleanPlan));

      // Check login token
      const token = sessionStorage.getItem("token");

      if (!token) {
        // Save redirect for after login
        sessionStorage.setItem("redirectAfterLogin", "/checkout");

        // Go to login
        window.location.href = "/sign-in";
        return;
      }

      // Already logged in → go to checkout
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Error selecting plan:", error);
      alert("Unable to select plan. Please try again.");
    }
  };

  return (
    <section className="w-full bg-green-50 py-18">
      {/* HEADER */}
      <div className="container mx-auto text-center py-20 bg-gradient-to-br from-green-600 to-green-400 rounded-b-3xl shadow-sm">
        <div className="inline-flex bg-blue-100 px-4 py-1 mt-20 rounded-2xl mb-4">
          <FaBolt className="text-green-600 mr-2" />
          <span className="font-semibold text-sm">Flexible Pricing</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Flexible Plans for Every Property Owner
        </h1>

        <p className="max-w-xl mx-auto mt-4 text-lg text-gray-700">
          Choose a plan that fits your property needs and start managing smarter today.
        </p>
      </div>

      {/* CARDS */}
      <div className="container mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative border rounded-2xl shadow-md p-6 transition-transform duration-300 ease-in-out
              ${
                plan.popular
                  ? "scale-105 shadow-xl bg-gradient-to-br from-green-50 to-green-100 border-green-500 hover:shadow-2xl hover:scale-110"
                  : "border-gray-200 hover:shadow-lg"
              }`}
          >
            {/* MOST POPULAR BADGE */}
            {plan.popular && (
              <div className="absolute top-0 left-0 w-36 overflow-hidden">
                <div className="rotate-45 bg-green-600 text-white text-xs font-bold px-6 py-1 shadow-lg">
                  MOST POPULAR
                </div>
              </div>
            )}

            {/* ICON */}
            <div className="w-fit bg-green-100 p-4 rounded-lg mb-2">
              {plan.icon}
            </div>

            {/* TITLE */}
            <h2 className="text-2xl font-semibold text-gray-800">
              {plan.name}
            </h2>

            <p className="text-md text-gray-500 mt-2">
              {plan.description}
            </p>

            {/* PRICE */}
            <h3 className="text-3xl font-bold text-gray-900 mt-4">
              Ksh {plan.price.toLocaleString()}
              <span className="text-md font-medium text-gray-500"> /month</span>
            </h3>

            {/* FEATURES */}
            <ul className="space-y-3 mt-6 text-left">
              {plan.features.map((f, i) => (
                <li
                  key={i}
                  className={`flex items-center ${
                    f.included ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {f.included ? (
                    <FaCheck className="text-green-500 mr-2" />
                  ) : (
                    <FaXmark className="text-gray-400 mr-2" />
                  )}
                  {f.name}
                </li>
              ))}
            </ul>

            {/* BUTTON */}
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
    </section>
  );
}

export default Pricing;