import {
  FaUsers,
  FaCreditCard,
  FaWrench,
  FaChartBar,
  FaBell,
  FaShieldAlt,
  FaMobileAlt,
  FaClock,
} from "react-icons/fa";

function Features() {
  const services = [
    {
      title: "Tenant Management",
      description:
        "Easy onboarding, digital leases, and automated reminders for seamless tenant relationships.",
      color: "from-green-500 to-emerald-600",
      icon: <FaUsers size={22} className="text-white" />,
    },
    {
      title: "Secure Payments",
      description:
        "Integrated payment processing with auto-generated receipts and payment history tracking.",
      color: "from-lime-500 to-green-600",
      icon: <FaCreditCard size={22} className="text-white" />,
    },
    {
      title: "Maintenance Requests",
      description:
        "Streamlined maintenance workflow with task assignment and progress tracking.",
      color: "from-emerald-500 to-teal-600",
      icon: <FaWrench size={22} className="text-white" />,
    },
    {
      title: "Analytics & Reports",
      description:
        "Generate comprehensive reports with insights into income, occupancy, and tenant activity.",
      color: "from-green-600 to-emerald-700",
      icon: <FaChartBar size={22} className="text-white" />,
    },
    {
      title: "Smart Notifications",
      description:
        "Real-time alerts for payments, lease expirations, and maintenance updates.",
      color: "from-emerald-500 to-green-600",
      icon: <FaBell size={22} className="text-white" />,
    },
    {
      title: "Role-Based Access",
      description:
        "Secure user roles for admin, landlord, and tenant with appropriate permissions.",
      color: "from-green-500 to-lime-600",
      icon: <FaShieldAlt size={22} className="text-white" />,
    },
    {
      title: "Mobile Responsive",
      description:
        "Perfect experience across desktop, tablet, and mobile devices.",
      color: "from-teal-500 to-emerald-600",
      icon: <FaMobileAlt size={22} className="text-white" />,
    },
    {
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to help you manage your properties efficiently.",
      color: "from-green-500 to-emerald-700",
      icon: <FaClock size={22} className="text-white" />,
    },
  ];

  return (
    <section
      id="features"
      className="relative w-full bg-gradient-to-b from-white via-green-50 to-emerald-50 py-20 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Small Badge */}
        <div className="flex justify-center mb-4">
          <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm border border-green-200">
            Powerful Features for Modern Property Management
          </span>
        </div>

        {/* Heading */}
        <h1 className="max-w-3xl mx-auto text-center text-gray-900 text-4xl md:text-5xl font-bold leading-tight">
          Everything You Need to
          <br />
          <span className="text-green-600">Manage Properties Smarter</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-3xl mx-auto text-center text-gray-600 text-base md:text-lg leading-relaxed mt-5">
          From tenant onboarding to rent collection, RentMate helps landlords,
          property managers, and tenants stay organized with one seamless platform.
        </p>

        {/* Top Mini Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 mb-12">
          <div className="bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl p-4 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-green-600">10k+</h3>
            <p className="text-sm text-gray-600 mt-1">Property Owners</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl p-4 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-green-600">99.9%</h3>
            <p className="text-sm text-gray-600 mt-1">Platform Uptime</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl p-4 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-green-600">24/7</h3>
            <p className="text-sm text-gray-600 mt-1">Customer Support</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl p-4 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-green-600">15 min</h3>
            <p className="text-sm text-gray-600 mt-1">Quick Setup</p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white/85 backdrop-blur-xl border border-green-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden min-h-[250px] flex flex-col"
            >
              {/* Soft top glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400"></div>

              {/* Icon */}
              <div
                className={`h-14 w-14 rounded-2xl mb-5 flex items-center justify-center bg-gradient-to-br ${service.color} shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                {service.icon}
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {service.description}
              </p>

              {/* Bottom accent */}
              <div className="mt-auto pt-5">
                <span className="inline-block text-green-600 text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  Learn more →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;