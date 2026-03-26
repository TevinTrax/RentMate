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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { role, email, password } = formData;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // Save session
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", data.user.role);
      sessionStorage.setItem("approval_status", data.user.approval_status);

      // CHECK REDIRECT FIRST
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
        return; 
      }

      // DEFAULT DASHBOARD FLOW
      switch (data.user.role.toLowerCase()) {
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
      
      {/* BACK BUTTON */}
      <div className="max-w-2xl mx-auto w-full mb-4 pt-14">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-blue-500 text-base sm:text-lg hover:underline"
        >
          <FaArrowLeft size={16} className="mr-2" /> Back
        </button>
      </div>

      {/* SIGN IN CARD */}
      <div className="max-w-2xl mx-auto w-full bg-white p-6 sm:p-10 border rounded-2xl shadow-lg">
        <form className="space-y-5" onSubmit={handleLogin}>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Sign in to access your dashboard
            </p>
          </div>

          {/* ROLE */}
          <div>
            <label className="text-md text-gray-800 mb-1 block">
              Sign In As
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="landlord">Landlord</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>

          {/* EMAIL */}
          <div>
            <label className="flex items-center gap-2 text-md text-gray-800 pb-2">
              <FaUser className="text-blue-500" /> Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="flex items-center gap-2 text-md text-gray-800 pb-2">
              <FaLock className="text-blue-500" /> Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* FORGOT */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full rounded-lg text-lg font-semibold text-white bg-blue-500 py-3 hover:bg-blue-600 transition"
          >
            Sign In
          </button>

          {/* REGISTER */}
          <p className="text-sm text-gray-800 text-center">
            Don’t have an account? <br />
            <span
              className="text-blue-500 cursor-pointer hover:underline"
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