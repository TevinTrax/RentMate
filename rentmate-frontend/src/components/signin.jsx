import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 py-8 bg-gray-50">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto w-full mb-4 pt-14">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-blue-500 text-base sm:text-lg hover:underline"
        >
          <FaArrowLeft size={16} className="mr-2" /> Back
        </button>
      </div>

      {/* Sign In Card */}
      <div className="max-w-2xl mx-auto w-full bg-white p-6 sm:p-10 border rounded-2xl shadow-lg">
        <form className="space-y-5">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Sign In As */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <label htmlFor="role" className="text-md text-black">
              Sign In As
            </label>
            <select
              id="role"
              className="text-md text-black border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Admin">Admin</option>
              <option value="Landlord">Landlord</option>
              <option value="Tenant">Tenant</option>
            </select>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-md text-black mb-1"
            >
              <FaUser className="text-blue-500" /> Email or Username
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email or username"
              className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-md text-black mb-1"
            >
              <FaLock className="text-blue-500" /> Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm sm:text-md text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full rounded-lg text-lg font-semibold text-white bg-blue-500 py-2 sm:py-3 hover:bg-blue-600 transition-colors duration-200"
          >
            Sign In
          </button>

          {/* Register Link */}
          <p className="text-sm sm:text-md text-black text-center">
            Don’t have an account?
            <span
              className="text-blue-500 px-2 cursor-pointer hover:underline"
              onClick={() => navigate("/get-started")}
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
