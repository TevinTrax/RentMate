import { FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminRegistration() {
  const navigate = useNavigate();

  return (
    <section className="w-full p-5 pt-24 bg-blue-50">
      {/* Back button */}
      <div className="container mx-auto flex items-center mb-4">
        <button
          onClick={() => navigate("/get-started")}
          className="flex items-center text-blue-500 hover:underline"
        >
          <FaArrowLeft className="mr-2" size={16} />
          Back
        </button>
      </div>

      {/* Registration Form */}
      <div className="max-w-3xl mx-auto p-6 border rounded-xl shadow-md bg-gray-100">
        <h1 className="text-xl md:text-2xl font-semibold text-blue-600 text-center mb-4">
          Admin Registration
        </h1>

        <form className="space-y-4">
          <div>
            <label htmlFor="fullname" className="block text-md text-gray-800 pb-1">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-md text-gray-800 pb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
            />
          </div>

          <div>
            <label htmlFor="idNumber" className="block text-md text-gray-800 pb-1">
              ID Number
            </label>
            <input
              id="idNumber"
              type="number"
              placeholder="Enter your ID number"
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
            />
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="phone" className="block text-md text-gray-800 pb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g. 0700000000"
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
              />
            </div>
            <div>
              <label htmlFor="altPhone" className="block text-md text-gray-800 pb-1">
                Alternative Phone Number
              </label>
              <input
                id="altPhone"
                type="tel"
                placeholder="e.g. 0700000000"
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div>
            <label htmlFor="" className="text-md text-gray-800">Create Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Create Password"
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 pl-10 text-sm md:text-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="" className="text-md text-gray-800">Confirm Password</label>
              <div className="relative mt-1">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Re-enter Password"
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 pl-10 text-sm md:text-md"
              />
            </div>
          </div>

          {/* Terms */}
          <p className="text-md text-black">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>.
          </p>

          <button className="w-full text-md md:text-lg font-semibold text-white bg-blue-500 rounded-lg p-2 hover:bg-blue-600">
            Create Account
          </button>

          <p className="text-md text-center text-black">
            Already have an account?{" "} <br />
            <span className="text-blue-500 hover:underline cursor-pointer" onClick={()=>navigate("/sign-in")}>
              Sign In
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default AdminRegistration;