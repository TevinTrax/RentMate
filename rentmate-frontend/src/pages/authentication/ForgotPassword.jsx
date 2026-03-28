import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage(data.error || "Failed to send reset link");
      } else {
        setMessage(data.message);
        setEmail("");
      }
    } catch (err) {
      setLoading(false);
      setMessage("Network error: " + err.message);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-8 mt-20">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-green-100">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Forgot Password</h2>
        <p className="text-gray-600 mb-6">
          Enter your email to receive a password reset link.
        </p>

        {message && (
          <div
            className={`mb-4 text-sm text-center p-3 rounded ${
              message.toLowerCase().includes("sent")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 pb-2">
              <FaEnvelope className="text-green-600" /> Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl text-lg font-semibold text-white py-3.5 transition shadow-lg hover:shadow-xl ${
              loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p
            className="text-sm text-gray-500 text-center pt-2 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </p>
        </form>
      </div>
    </section>
  );
}