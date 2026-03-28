import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaLock, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [criteria, setCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Update criteria and strength as user types
  useEffect(() => {
    const newCriteria = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
    setCriteria(newCriteria);
    setStrength(Object.values(newCriteria).filter(Boolean).length);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Soft validation: only require main criteria (length, lowercase, uppercase, number)
    if (!criteria.length || !criteria.lowercase || !criteria.uppercase || !criteria.number) {
      setMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }), // token is in URL, not body
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage(data.error || "Failed to reset password");
      } else {
        setMessage(data.message || "Password reset successful");
        setTimeout(() => navigate("/sign-in"), 2000);
      }
    } catch (err) {
      setLoading(false);
      setMessage("Network error: " + err.message);
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 5:
        return "bg-green-500";
      case 4:
        return "bg-yellow-400";
      case 3:
        return "bg-yellow-300";
      default:
        return "bg-red-400";
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-8 mt-20">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-green-100">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Reset Password</h2>
        <p className="text-gray-600 mb-6">Enter your new password below.</p>

        {message && (
          <div
            className={`mb-4 text-sm text-center p-3 rounded ${
              message.toLowerCase().includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Field */}
          <div className="relative">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 pb-2">
              <FaLock className="text-green-600" /> New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              required
            />
            <span
              className="absolute right-3 top-11 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {/* Password strength bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div
                className={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                style={{ width: `${(strength / 5) * 100}%` }}
              ></div>
            </div>

            {/* Password criteria checklist */}
            <ul className="mt-2 text-xs text-gray-500 space-y-1">
              {[
                { label: "At least 8 characters", key: "length", required: true },
                { label: "Lowercase letter", key: "lowercase", required: true },
                { label: "Uppercase letter", key: "uppercase", required: true },
                { label: "Number", key: "number", required: true },
                { label: "Special character (@$!%*?&)", key: "special", required: false },
              ].map((rule) => (
                <li key={rule.key} className="flex items-center gap-1">
                  {criteria[rule.key] ? (
                    <FaCheckCircle className={`text-green-500 ${!rule.required && "opacity-50"}`} />
                  ) : (
                    <FaTimesCircle className={`text-red-500 ${!rule.required && "opacity-50"}`} />
                  )}
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 pb-2">
              <FaLock className="text-green-600" /> Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              required
            />
            <span
              className="absolute right-3 top-11 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !(criteria.length && criteria.lowercase && criteria.uppercase && criteria.number)}
            className={`w-full rounded-xl text-lg font-semibold text-white py-3.5 transition shadow-lg hover:shadow-xl ${
              loading ||
              !(criteria.length && criteria.lowercase && criteria.uppercase && criteria.number)
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
}