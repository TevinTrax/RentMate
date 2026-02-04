import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
  });

  // Handle input changes (email & password)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    const { role, email, password } = formData;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // Save token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Redirect based on role (BACKEND role, not frontend)
      switch (data.user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "landlord":
          navigate("/landlord/dashboard");
          break;

        case "tenant":
          navigate("/tenant/dashboard");
          break;

        default:
          navigate("/");
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

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
        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Sign In As */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <label htmlFor="role" className="text-md text-gray-800 mb-1">
              Sign In As
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="text-sm md:text-md text-black border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="landlord">Landlord</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-md text-gray-800 pb-2"
            >
              <FaUser className="text-blue-500" /> Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 sm:p-3 text-sm md:text-md border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-md text-gray-800 pb-2"
            >
              <FaLock className="text-blue-500" /> Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 md:p-3 text-sm md:text-md border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm md:text-md text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full rounded-lg text-md md:text-lg font-semibold text-white bg-blue-500 py-2 sm:py-3 hover:bg-blue-600 transition-colors duration-200"
          >
            Sign In
          </button>

          {/* Register Link */}
          <p className="text-sm md:text-md text-gray-800 text-center">
            Don’t have an account? <br />
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