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
      description: "Easy onboarding, digital leases, and automated reminders for seamless tenant relationships.",
      color: "bg-blue-500",
      icon: <FaUsers size={24} color="white" />,
    },
    {
      title: "Secure Payments",
      description: "Integrated payment processing with auto-generated receipts and payment history tracking.",
      color: "bg-green-500",
      icon: <FaCreditCard size={24} color="white" />,
    },
    {
      title: "Maintenance Requests",
      description: "Streamlined maintenance workflow with task assignment and progress tracking.",
      color: "bg-orange-500",
      icon: <FaWrench size={24} color="white" />,
    },
    {
      title: "Analytics & Reports",
      description: "Generate comprehensive reports with insights into income, occupancy, and tenant activity.",
      color: "bg-purple-500",
      icon: <FaChartBar size={24} color="white" />,
    },
    {
      title: "Smart Notifications",
      description: "Real-time alerts for payments, lease expirations, and maintenance updates.",
      color: "bg-blue-500",
      icon: <FaBell size={24} color="white" />,
    },
    {
      title: "Role-Based Access",
      description: "Secure user roles for admin, landlord, and tenant with appropriate permissions.",
      color: "bg-green-500",
      icon: <FaShieldAlt size={24} color="white" />,
    },
    {
      title: "Mobile Responsive",
      description: "Perfect experience across desktop, tablet, and mobile devices.",
      color: "bg-blue-600",
      icon: <FaMobileAlt size={24} color="white" />,
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you manage your properties efficiently.",
      color: "bg-pink-500",
      icon: <FaClock size={24} color="white" />,
    },
  ];

  return (
    <section className="w-full">
      <div className="container mx-auto p-6">
        <h1 className="max-w-2xl mx-auto text-center text-4xl md:text-5xl p-2 leading-tight tracking-wide font-semibold">
          Everything You Need to{" "}
          <br />
          <span className="text-blue-500">Manage Properties</span>
        </h1>

        <p className="max-w-4xl mx-auto text-center text-md md:text-2xl text-gray-500 leading-relaxed mt-4">
          From tenant onboarding to rent collection, our comprehensive platform handles every aspect of property management with ease and efficiency.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white p-4 flex flex-col"
            >
              <div
                className={`h-12 w-12 rounded-xl mb-4 flex items-center justify-center ${service.color}`}
              >
                {service.icon}
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                {service.title}
              </h2>

              <p className="text-gray-600 text-md mt-2">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
