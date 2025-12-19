import { FaUser, FaPhone, FaEnvelope, FaLock } from "react-icons/fa6";

function FreeTrial() {
  return (
    <section className="w-full bg-gray-50">
      <div className="container mx-auto py-20 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Content */}
        <div className="p-6">
          <h1 className="text-5xl font-bold text-gray-800 leading-tight pt-16">
            Take Control of Your Rentals Today
          </h1>

          <p className="text-xl text-gray-500 pt-4 leading-relaxed">
            Streamline property management with our all-in-one platform. Automate rent collection,
            manage tenants, and track maintenance from one powerful dashboard.
          </p>

          <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700">
            <li>14-day free trial, no credit card required</li>
            <li>Cancel anytime, no questions asked</li>
            <li>Trusted by 10,000+ property managers</li>
          </ul>
        </div>

        {/* Form */}
        <div className="p-6">
          <form className="space-y-4 p-8 mt-6 bg-white rounded-xl shadow-lg border">

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="font-semibold text-gray-800">
                Full Name
              </label>
              <div className="relative mt-1">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="font-semibold text-gray-800">
                Email Address
              </label>
              <div className="relative mt-1">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@gmail.com"
                  className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="font-semibold text-gray-800">
                Phone Number
              </label>
              <div className="relative mt-1">
                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+254700000000"
                  className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="font-semibold text-gray-800">
                Password
              </label>
              <div className="relative mt-1">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="font-semibold text-gray-800">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
            </div>

            <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition">
              Start 14-Day Free Trial
            </button>

            <ul className="flex justify-center gap-6 list-disc text-sm text-gray-600">
              <li>No credit card required</li>
              <li>Cancel anytime</li>
            </ul>
          </form>
        </div>
      </div>
    </section>
  );
}

export default FreeTrial;
