import {
  FaLock,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import bgImage from "@/assets/images/admin.jpg"; // make sure this exists

function AdminRegistration() {
  const navigate = useNavigate();
  const { role } = useParams();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: role || "Admin",
    email: "",
    id_number: "",
    phone_number: "",
    alt_phone_number: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData((prev) => ({ ...prev, role }));
    }
  }, [role]);

  const passwordRules = {
    minLength: formData.password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasSpecial: /[\W_]/.test(formData.password),
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return "Password must include both letters and numbers";
    }
    return "";
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;

    if (strength <= 1) return "Weak";
    if (strength === 2 || strength === 3) return "Medium";
    if (strength >= 4) return "Strong";
    return "";
  };

  const getStrengthColor = () => {
    if (passwordStrength === "Weak") return "bg-red-500";
    if (passwordStrength === "Medium") return "bg-yellow-400";
    if (passwordStrength === "Strong") return "bg-green-600";
    return "bg-gray-300";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "password") {
      setPasswordStrength(checkPasswordStrength(value));
      setPasswordError(validatePassword(value));
    }

    if (id === "confirmPassword") {
      if (formData.password && value !== formData.password) {
        setPasswordError("Passwords do not match!");
      } else {
        setPasswordError(validatePassword(formData.password));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validatePassword(formData.password);
    if (error) {
      setPasswordError(error);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    setPasswordError("");

    try {
      const {
        first_name,
        last_name,
        role,
        email,
        id_number,
        phone_number,
        alt_phone_number,
        password,
      } = formData;

      const response = await fetch("http://localhost:5000/api/users/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          role,
          email,
          phone_number,
          alt_phone_number,
          id_number,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Admin account created successfully!");
        navigate("/sign-in");
      } else {
        alert("Error: " + (data.error || data.message || "Something went wrong"));
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  return (
    <section className="w-full min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 min-h-[720px] border border-green-100 mt-16">
        {/* LEFT SIDE */}
        <div className="hidden lg:block relative">
          <img
            src={bgImage}
            alt="Admin Registration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-green-700/50 to-green-500/20"></div>

          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm font-medium w-fit mb-4">
              <FaUserShield />
              Secure Admin Access
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-3">
              Join RentMate Administration
            </h2>
            <p className="text-white/90 text-base leading-relaxed max-w-md">
              Manage users, oversee property operations, monitor activity, and keep your platform secure and organized.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex flex-col justify-center px-6 sm:px-10 md:px-14 py-10">
          <button
            onClick={() => navigate("/get-started")}
            className="flex items-center text-green-600 text-sm sm:text-base hover:underline mb-6"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h2 className="text-2xl font-extrabold text-green-700 mb-2">
            {formData.role} Registration
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Fill in your details to create a secure administrator account.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm text-gray-700 mb-1">
                Role
              </label>
              <div className="relative">
                <FaUserShield className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="role"
                  type="text"
                  value={formData.role}
                  readOnly
                  className="w-full pl-10 p-3 rounded-xl border bg-gray-100 cursor-not-allowed text-sm text-gray-600"
                />
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="first_name" className="block text-sm text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    id="first_name"
                    type="text"
                    placeholder="Enter first name"
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    id="last_name"
                    type="text"
                    placeholder="Enter last name"
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* ID Number */}
            <div>
              <label htmlFor="id_number" className="block text-sm text-gray-700 mb-1">
                ID Number
              </label>
              <div className="relative">
                <FaIdCard className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="id_number"
                  type="text"
                  placeholder="Enter your ID number"
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.id_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="phone_number" className="block text-sm text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    id="phone_number"
                    type="tel"
                    placeholder="0700000000"
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="alt_phone_number" className="block text-sm text-gray-700 mb-1">
                  Alternative Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    id="alt_phone_number"
                    type="tel"
                    placeholder="0700000000"
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.alt_phone_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  className="w-full pl-10 pr-12 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-green-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Strength Meter */}
              {formData.password && (
                <div className="mt-3">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{
                        width:
                          passwordStrength === "Weak"
                            ? "33%"
                            : passwordStrength === "Medium"
                            ? "66%"
                            : passwordStrength === "Strong"
                            ? "100%"
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <p className="text-sm mt-2 text-gray-700">
                    Strength:{" "}
                    <span className="font-semibold">{passwordStrength || "Too Short"}</span>
                  </p>
                </div>
              )}

              {/* Password Rules */}
              <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-3 space-y-2">
                <p className="text-sm font-semibold text-green-700">Password must have:</p>

                <div className="space-y-1 text-sm">
                  <p className={`flex items-center gap-2 ${passwordRules.minLength ? "text-green-600" : "text-gray-500"}`}>
                    {passwordRules.minLength ? <FaCheckCircle /> : <FaTimesCircle />}
                    At least 8 characters
                  </p>
                  <p className={`flex items-center gap-2 ${passwordRules.hasLetter ? "text-green-600" : "text-gray-500"}`}>
                    {passwordRules.hasLetter ? <FaCheckCircle /> : <FaTimesCircle />}
                    At least one letter
                  </p>
                  <p className={`flex items-center gap-2 ${passwordRules.hasNumber ? "text-green-600" : "text-gray-500"}`}>
                    {passwordRules.hasNumber ? <FaCheckCircle /> : <FaTimesCircle />}
                    At least one number
                  </p>
                  <p className={`flex items-center gap-2 ${passwordRules.hasUpper ? "text-green-600" : "text-gray-500"}`}>
                    {passwordRules.hasUpper ? <FaCheckCircle /> : <FaTimesCircle />}
                    One uppercase letter (recommended)
                  </p>
                  <p className={`flex items-center gap-2 ${passwordRules.hasLower ? "text-green-600" : "text-gray-500"}`}>
                    {passwordRules.hasLower ? <FaCheckCircle /> : <FaTimesCircle />}
                    One lowercase letter (recommended)
                  </p>
                  <p className={`flex items-center gap-2 ${passwordRules.hasSpecial ? "text-green-600" : "text-gray-500"}`}>
                    {passwordRules.hasSpecial ? <FaCheckCircle /> : <FaTimesCircle />}
                    One special character (recommended)
                  </p>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-1">
                Confirm Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter Password"
                  className="w-full pl-10 pr-12 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-green-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {formData.confirmPassword && (
                <p
                  className={`text-sm mt-2 ${
                    formData.password === formData.confirmPassword
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {formData.password === formData.confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            {passwordError && (
              <p className="text-red-600 text-sm font-medium">{passwordError}</p>
            )}

            {/* Terms */}
            <p className="text-sm text-gray-700">
              By continuing, you agree to our{" "}
              <span className="text-green-600 hover:underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-green-600 hover:underline cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl mt-2 transition shadow-lg hover:shadow-xl"
            >
              Create Admin Account
            </button>

            <p className="text-center text-gray-700 text-sm mt-2">
              Already have an account?{" "}
              <span
                className="text-green-600 hover:underline cursor-pointer font-semibold"
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AdminRegistration;