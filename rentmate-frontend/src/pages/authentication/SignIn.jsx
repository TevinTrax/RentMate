import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import bgImage from "../../assets/images/sign.jpg";

function SignIn() {
  const navigate = useNavigate();
  const cooldownRef = useRef(null);

  // =========================
  // CONFIG
  // =========================
  const API_BASE = "http://localhost:5000/api/auth";

  // =========================
  // FORM STATE
  // =========================
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  // =========================
  // LOGIN / OTP STATE
  // =========================
  const [isOTPStep, setIsOTPStep] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otp, setOTP] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loginInProgress, setLoginInProgress] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [resendingOTP, setResendingOTP] = useState(false);

  // =========================
  // HELPERS
  // =========================
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // only digits, max 6
    setOTP(value);
  };

  const togglePassword = () => setPasswordVisible((prev) => !prev);

  /**
   * Redirect logic:
   * If user came from checkout flow -> go there
   * Else go to role dashboard
   */
  const navigateDashboard = (role) => {
    const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");

    if (redirectAfterLogin) {
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectAfterLogin);
      return;
    }

    const normalizedRole = role?.toLowerCase();

    switch (normalizedRole) {
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
  };

  const startCooldown = (seconds = 60) => {
    setResendCooldown(seconds);

    if (cooldownRef.current) {
      clearInterval(cooldownRef.current);
    }

    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetOTPState = () => {
    setIsOTPStep(false);
    setUserId(null);
    setOTP("");
    setOtpAttempts(0);
    setResendCooldown(0);

    if (cooldownRef.current) {
      clearInterval(cooldownRef.current);
      cooldownRef.current = null;
    }
  };

  const saveUserSession = (data) => {
    if (data?.token) sessionStorage.setItem("token", data.token);
    if (data?.user?.role) sessionStorage.setItem("role", data.user.role);
    if (data?.user?.approval_status)
      sessionStorage.setItem("approval_status", data.user.approval_status);
    if (data?.user?.id) sessionStorage.setItem("user_id", data.user.id);
    if (typeof data?.user?.is_verified !== "undefined") {
      sessionStorage.setItem(
        "is_verified",
        data.user.is_verified ? "true" : "false"
      );
    }
    if (data?.user?.email) sessionStorage.setItem("email", data.user.email);
    if (data?.user?.name) sessionStorage.setItem("name", data.user.name);
  };

  useEffect(() => {
    return () => {
      if (cooldownRef.current) {
        clearInterval(cooldownRef.current);
      }
    };
  }, []);

  // =========================
  // LOGIN / SEND OTP
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.role || !formData.email || !formData.password) {
      return alert("Please fill in all fields.");
    }

    setLoginInProgress(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: formData.role,
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || data.message || "Login failed");
      }

      /**
       * OTP REQUIRED FLOW
       */
      if (data.requiresOTP === true || data.step === "otp" || data.userId) {
        setIsOTPStep(true);
        setUserId(data.userId);
        setOTP("");
        setOtpAttempts(0);
        startCooldown(60);
        return;
      }

      /**
       * DIRECT LOGIN FLOW
       */
      if (data.token && data.user) {
        saveUserSession(data);
        navigateDashboard(data.user.role);
        return;
      }

      alert("Unexpected server response. Please try again.");
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoginInProgress(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      return alert("Please enter the OTP.");
    }

    if (otp.length !== 6) {
      return alert("OTP must be 6 digits.");
    }

    if (otpAttempts >= 3) {
      return alert("Maximum OTP attempts reached. Please request a new OTP.");
    }

    setOtpVerifying(true);

    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpAttempts((prev) => prev + 1);
        return alert(data.error || data.message || "OTP verification failed");
      }

      // Success
      setOtpAttempts(0);
      saveUserSession(data);
      navigateDashboard(data.user.role);
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setOtpVerifying(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const handleResendOTP = async () => {
    if (resendCooldown > 0 || !userId) return;

    setResendingOTP(true);

    try {
      const res = await fetch(`${API_BASE}/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          return alert(data.error || "Please wait before resending OTP.");
        }

        return alert(data.error || data.message || "Failed to resend OTP");
      }

      alert(data.message || "OTP resent successfully");
      startCooldown(60);
      setOTP("");
      setOtpAttempts(0);
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setResendingOTP(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4 py-8 mt-20">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 min-h-[700px] border border-green-100">
        {/* LEFT SIDE IMAGE */}
        <div className="hidden lg:block relative">
          <img
            src={bgImage}
            alt="Rental property"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/65 via-green-700/45 to-green-500/25"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Manage Rentals <br /> The Smart Way
              </h2>
              <p className="text-white/90 text-base leading-relaxed">
                Track tenants, manage properties, automate payments, and
                simplify your rental business.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="relative flex flex-col justify-center px-6 sm:px-10 md:px-14 py-10">
          <div className="mb-8 mt-8 lg:mt-0">
            <h2 className="text-2xl font-bold text-green-700 tracking-tight">
              RentMate
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Smart rental management made simple
            </p>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {isOTPStep ? "OTP Verification 🔐" : "Welcome Back 👋"}
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              {isOTPStep
                ? "Enter the OTP sent to your email to complete sign in."
                : "Sign in to manage your properties, tenants, and payments easily."}
            </p>
          </div>

          {/* Back button for OTP screen */}
          {isOTPStep && (
            <button
              type="button"
              onClick={resetOTPState}
              className="mb-4 inline-flex items-center gap-2 text-sm text-green-700 hover:underline"
            >
              <FaArrowLeft />
              Back to Sign In
            </button>
          )}

          <form
            className="space-y-5"
            onSubmit={isOTPStep ? handleVerifyOTP : handleLogin}
          >
            {!isOTPStep && (
              <>
                {/* ROLE */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sign In As
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
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
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 pb-2">
                    <FaUser className="text-green-600" /> Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* PASSWORD */}
                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 pb-2">
                    <FaLock className="text-green-600" /> Password
                  </label>
                  <input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full p-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition pr-12"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-4 top-[46px] text-gray-500 hover:text-green-600"
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {/* OTP STEP */}
            {isOTPStep && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Enter OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={handleOTPChange}
                  maxLength={6}
                  className="w-full p-3.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-center tracking-[0.35em] text-lg font-semibold"
                  required
                />

                <div className="flex justify-between mt-3 items-center text-sm">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendCooldown > 0 || resendingOTP}
                    className={`text-green-600 font-semibold ${
                      resendCooldown > 0 || resendingOTP
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:underline"
                    }`}
                  >
                    {resendingOTP
                      ? "Resending..."
                      : resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : "Resend OTP"}
                  </button>

                  <span className="text-red-500">
                    {otpAttempts > 0 ? `${otpAttempts}/3 attempts used` : ""}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loginInProgress || otpVerifying}
              className={`w-full rounded-xl text-lg font-semibold text-white bg-green-600 py-3.5 hover:bg-green-700 transition shadow-lg hover:shadow-xl ${
                loginInProgress || otpVerifying
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isOTPStep
                ? otpVerifying
                  ? "Verifying..."
                  : "Verify OTP"
                : loginInProgress
                ? "Signing In..."
                : "Sign In"}
            </button>

            {!isOTPStep && (
              <p className="text-sm text-gray-700 text-center pt-2">
                Don’t have an account?{" "}
                <span
                  className="text-green-600 cursor-pointer hover:underline font-semibold"
                  onClick={() => navigate("/get-started")}
                >
                  Register here
                </span>
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignIn;