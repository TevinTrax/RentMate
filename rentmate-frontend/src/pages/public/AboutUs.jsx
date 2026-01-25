import {
  FaShield,
  FaPhone,
  FaClock,
  FaChartColumn,
  FaMessage,
  FaCheck,
  FaBuilding,
  FaUserCheck,
  FaSuitcase,
  FaCircleCheck
} from "react-icons/fa6";

function Aboutus() {
  // ✅ Variables must be declared BEFORE return
  const advantages = [
    {
      icon: FaShield,
      title: "Bank-Level Security",
      description:
        "Your data and transactions are protected with enterprise-grade encryption and security protocols.",
    },
    {
      icon: FaPhone,
      title: "Easy to Use",
      description:
        "Intuitive design that works seamlessly across all devices. Get started in minutes, not hours.",
    },
    {
      icon: FaClock,
      title: "Save Time",
      description:
        "Automate repetitive tasks and focus on what matters most. Reduce admin work by up to 80%.",
    },
    {
      icon: FaChartColumn,
      title: "Smart Analytics",
      description:
        "Gain insights into your rental performance with detailed reports and financial dashboards.",
    },
    {
      icon: FaMessage,
      title: "24/7 Support",
      description:
        "Our dedicated support team is always available to help you with any issues or questions.",
    },
    {
      icon: FaCheck,
      title: "Compliance Ready",
      description:
        "Stay compliant with local regulations through automatic updates and built-in checks.",
    },
  ];

  return (
    <section className="w-full pt-24 space-y-20">
      {/* HERO SECTION */}
      <div className="container mx-auto text-center">
        <h2 className="w-fit text-sm md:text-md text-blue-500 bg-blue-50 font-bold mb-4 mx-auto rounded-2xl px-3 py-1">
          Modern Property Management
        </h2>
        <h3 className="text-3xl md:text-4xl px-4 font-bold text-gray-600 mb-4">
          Simplifying Property Rentals for Everyone
        </h3>
        <p className="max-w-2xl text-md px-4 md:text-lg mx-auto text-gray-700">
          RentMate connects landlords and tenants with an all-in-one platform
          for seamless property management, secure payments, and transparent
          communication.
        </p>
      </div>

      {/* WHO WE ARE */}
      <div className="container mx-auto">
        <h2 className="w-fit text-sm md:text-md text-purple-500 bg-purple-100 font-bold mb-4 mx-auto rounded-2xl px-3 py-1">
          Who We Are
        </h2>
        <p className="max-w-3xl mx-auto text-md px-4 md:text-lg text-center text-gray-700 mb-10">
          RentMate was born from a simple idea: property rental should be simple, transparent, and stress-free. We're a team of property enthusiasts, tech innovators, and design thinkers committed to revolutionizing how landlords and tenants interact. Our platform bridges the gap between traditional property management and modern digital convenience.
        </p>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-3xl md:text-4xl text-blue-500 mb-2 font-bold">10K+</h3>
            <p className="text-gray-600 text-sm md:text-md">Properties Managed</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl text-blue-500 mb-2 font-bold">$50M+</h3>
            <p className="text-gray-600 text-sm md:text-md">Rent Processed</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl text-blue-500 mb-2 font-bold">98%</h3>
            <p className="text-gray-600 text-sm md:text-md">Satisfaction Rate</p>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="container mx-auto">
        <h2 className="w-fit text-sm md:text-md text-purple-500 bg-purple-100 font-bold mb-4 mx-auto rounded-2xl px-3 py-1">
          Why Choose Us
        </h2>
        <h3 className="text-center text-gray-800 text-3xl md:text-4xl font-bold mb-2">
          The RentMate advantage.
        </h3>

        <p className="text-center text-gray-600 text-md md:text-lg px-4">We've thought of everything so you don't have to worry about a thing.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-10 w-10 md:h-12 md:w-12 mb-4 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Icon size={20} />
                </div>

                <h4 className="text-md md:text-lg font-semibold mb-2">
                  {advantage.title}
                </h4>
                <p className="text-gray-600 text-sm md:text-md">
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 py-20">
        {/* Badge */}
        <div className="w-fit mx-auto text-center rounded-2xl bg-blue-100 mb-4">
          <h1 className="text-blue-600 text-sm md:text-md py-1 px-4 font-bold">
            Built For You
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-center text-gray-800 text-3xl md:text-4xl font-bold mb-4">
          Who Benefits from RentMate?
        </h2>

        <p className="max-w-2xl mx-auto text-center text-gray-600 text-md md:text-lg px-4">
          Whether you own one property or manage hundreds, RentMate scales with your needs.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto p-8">
          
          {/* Landlords */}
          <div className="p-8 rounded-2xl shadow-lg bg-white space-y-4 hover:shadow-xl transition">
            <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-blue-50">
              <FaBuilding size={28} className="text-blue-500" />
            </div>

            <h3 className="text-lg md:text-xl text-gray-800 font-bold">Landlords</h3>

            <p className="text-gray-700 text-md md:text-lg">
              Manage your properties effortlessly. Track rent, handle maintenance, and communicate with tenants in one place.
            </p>

            <ul className="text-gray-800 space-y-2 text-sm md:text-md">
              <li><FaCircleCheck size={16} className="inline mr-2 text-blue-500" />Multi-property dashboard</li>
              <li><FaCircleCheck size={16} className="inline mr-2 text-blue-500" />Automated rent reminders</li>
              <li><FaCircleCheck size={16} className="inline mr-2 text-blue-500" />Financial reports</li>
            </ul>
          </div>

          {/* Tenants – Most Popular */}
          <div className="relative p-8 rounded-2xl shadow-xl bg-white space-y-4 border-2 border-blue-500 hover:shadow-2xl transition">
            
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">
              Most Popular
            </span>

            <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-blue-50">
              <FaUserCheck size={28} className="text-blue-500" />
            </div>

            <h3 className="text-lg md:text-xl text-gray-800 font-bold">Tenants</h3>

            <p className="text-gray-700 text-md md:text-lg">
              Pay rent online, submit maintenance requests, and access your lease documents anytime.
            </p>

            <ul className="text-gray-800 space-y-2 text-sm md:text-md">
              <li><FaCircleCheck size={16} className="inline mr-2 text-blue-500" />Easy online payments</li>
              <li><FaCircleCheck size={16} className="inline mr-2 text-blue-500" />Maintenance tracking</li>
              <li><FaCircleCheck size={16} className="inline mr-2 text-blue-500" />Document access</li>
            </ul>
          </div>

          {/* Property Managers */}
          <div className="p-8 rounded-2xl shadow-lg bg-white space-y-4 hover:shadow-xl transition">
            <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-blue-50">
              <FaSuitcase size={28} className="text-blue-500" />
            </div>

            <h3 className="text-lg md:text-xl text-gray-800 font-bold">Property Managers</h3>

            <p className="text-gray-700 text-md md:text-lg">
              Scale your operations with powerful tools built for professional management teams.
            </p>

            <ul className="text-gray-800 space-y-2 text-sm md:text-md">
              <li><FaCircleCheck size={16} className="inline mr-2 text-blue-500" />Team collaboration</li>
              <li><FaCircleCheck size={16} className="inline mr-2 text-blue-500" />Portfolio overview</li>
              <li><FaCircleCheck size={16} className="inline mr-2 text-blue-500" />Bulk operations</li>
            </ul>
          </div>

        </div>
      </div>

    </section>
  );
}

export default Aboutus;
