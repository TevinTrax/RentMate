import {
  FaBolt,
  FaBuildingColumns,
  FaCheck,
  FaXmark,
  FaUsers,
  FaArrowTrendUp,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Pricing() {
  const navigate= useNavigate();
  const plans = [
    {
      name: "Basic",
      icon: <FaBuildingColumns size={24} className="text-blue-500" />,
      price: "Ksh 3,500",
      desc: "Ideal for small landlords or single property owners",
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
      name: "Standard",
      popular: true,
      icon: <FaUsers size={24} className="text-blue-500" />,
      price: "Ksh 6,500",
      desc: "For medium-scale landlords",
      button: "Choose Standard",
      buttonStyle:
        "w-full p-2 text-md text-white bg-blue-500 hover:bg-blue-400 border rounded-lg font-semibold",
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
      name: "Premium",
      icon: <FaArrowTrendUp size={24} className="text-blue-500" />,
      price: "Ksh 9,500",
      desc: "For large property managers or agencies",
      button: "Go Premium",
      buttonStyle:
        "w-full p-2 text-md text-gray-800 border rounded-lg font-semibold hover:text-white hover:bg-green-500",
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

  const featuresTable = [
    { feature: "Properties Limit", basic: "10", standard: "20", premium: "Unlimited" },
    { feature: "Tenant Management", basic: true, standard: true, premium: true },
    { feature: "Rent Tracking", basic: true, standard: true, premium: true },
    { feature: "Maintenance Requests", basic: true, standard: true, premium: true },
    { feature: "Financial Reports", basic: false, standard: true, premium: true },
    { feature: "Team Access", basic: false, standard: false, premium: true },
    { feature: "Priority Support", basic: false, standard: false, premium: true },
    { feature: "Analytics Dashboard", basic: false, standard: false, premium: true },
  ];

  return (
    <section className="w-full bg-gray-50 py-18">
      {/* Header */}
      <div className="container mx-auto text-center py-16 bg-gradient-to-br from-blue-600 to-blue-100 rounded-b-3xl shadow-sm">
        <div className="inline-flex bg-blue-100 px-4 py-1 mt-20 rounded-2xl mb-4">
          <FaBolt className="text-blue-600 mr-2" /> <span className="font-semibold text-sm">Flexible Pricing</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Flexible Plans for Every Property Owner
        </h1>
        <p className="max-w-xl mx-auto mt-4 text-lg text-gray-700">
          Choose a plan that fits your property needs and start managing smarter
          today.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative border rounded-2xl shadow-md p-6 transition-transform duration-300 ease-in-out
      ${
        plan.popular
          ? "scale-105 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 hover:shadow-2xl hover:scale-110"
          : "border-gray-200 hover:shadow-lg"
      }`}
          >
            {/* Ribbon badge */}
            {plan.popular && (
              <div className="absolute top-0 left-0 w-36 overflow-hidden">
                <div className="rotate-45 bg-blue-600 text-white text-xs font-bold px-6 py-1 shadow-lg drop-shadow-lg">
                  MOST POPULAR
                </div>
              </div>
            )}

            <div className="w-fit mx-auto bg-blue-100 p-4 rounded-lg mb-2 ml-1">
              {plan.icon}
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">{plan.name}</h2>
            <p className="text-md text-gray-500 mt-2">{plan.desc}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-4">
              {plan.price}{" "}
              <span className="text-md font-medium text-gray-500">/month</span>
            </h3>

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

            <div className="mt-6">
              <button className={plan.buttonStyle} onClick={()=>navigate("/checkout")}>{plan.button}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Section */}
      <div className="container mx-auto mt-16 bg-blue-50 p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800">Enterprise</h2>
        <p className="text-gray-500 mt-2">
          Custom pricing for real estate companies with bulk property portfolios
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <ul className="space-y-2">
            <li className="flex">
              <FaCheck className="text-green-500 mr-2" />
              Unlimited everything
            </li>
            <li className="flex">
              <FaCheck className="text-green-500 mr-2" />
              Custom integrations
            </li>
            <li className="flex">
              <FaCheck className="text-green-500 mr-2" />
              SLA guarantees
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex">
              <FaCheck className="text-green-500 mr-2" />
              Dedicated account manager
            </li>
            <li className="flex">
              <FaCheck className="text-green-500 mr-2" />
              Advanced security features
            </li>
            <li className="flex">
              <FaCheck className="text-green-500 mr-2" />
              On-premise deployment
            </li>
          </ul>
        </div>
        <button className="mt-6 px-4 py-2 border rounded-lg bg-white hover:bg-green-500 hover:text-white transition font-semibold">
          Contact Sales
        </button>
      </div>

      {/* Comparison Table */}
      <div className="container mx-auto mt-16 p-8">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          Compare Features
        </h3>
        <p className="text-center text-gray-500 mt-2">
          See what’s included in each plan at a glance
        </p>

        <div className="overflow-x-auto mt-8">
          <table className="min-w-full bg-white rounded-2xl shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Feature</th>
                <th className="p-4 text-center">Basic</th>
                <th className="p-4 text-center">Standard</th>
                <th className="p-4 text-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              {featuresTable.map((item, i) => (
                <tr key={i} className="border-t text-center">
                  <td className="text-left p-4 text-gray-800 font-medium">{item.feature}</td>
                  <td className="p-4">
                    {typeof item.basic === "boolean" ? (
                      item.basic ? <FaCheck className="text-green-500 mx-auto" /> : <FaXmark className="text-gray-400 mx-auto" />
                    ) : (
                      item.basic
                    )}
                  </td>
                  <td className="p-4">
                    {typeof item.standard === "boolean" ? (
                      item.standard ? <FaCheck className="text-green-500 mx-auto" /> : <FaXmark className="text-gray-400 mx-auto" />
                    ) : (
                      item.standard
                    )}
                  </td>
                  <td className="p-4">
                    {typeof item.premium === "boolean" ? (
                      item.premium ? <FaCheck className="text-green-500 mx-auto" /> : <FaXmark className="text-gray-400 mx-auto" />
                    ) : (
                      item.premium
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="max-w-3xl mx-auto my-10 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-50 shadow-md">
        <h4 className="text-3xl text-gray-800 text-center font-bold pt-4">
          Ready to simplify property management?
        </h4>

        <p className="text-md text-gray-700 text-center pt-3">
          Join hundreds of property owners who trust our platform to manage their rentals efficiently.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6 mb-4">
          <div className="flex justify-center">
            <button className="px-6 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-all duration-200" onClick={()=>navigate("/free-trial")}>
              Start Free Trial
            </button>
          </div>
          <div className="flex justify-center">
            <a
              href="https://wa.me/+254790636213"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-lg font-semibold bg-white text-gray-800 border hover:bg-gray-100 transition-all duration-200"
            >
              Talk to an Expert
            </a>
          </div>
        </div>

        <ul className="flex flex-wrap gap-4 justify-center mb-4">
          <li className="text-sm text-gray-600">No credit card required</li>
          <li className="text-sm text-gray-600">14-day free trial</li>
          <li className="text-sm text-gray-600">Cancel anytime</li>
        </ul>
      </div>

    </section>
  );
}

export default Pricing;
