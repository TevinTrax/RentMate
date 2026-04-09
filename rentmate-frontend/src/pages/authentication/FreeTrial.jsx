import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaCircleCheck,
  FaBuilding,
  FaKey,
  FaChartLine,
  FaEye,
  FaEyeSlash,
  FaXmark,
} from "react-icons/fa6";
import bgImage from "@/assets/images/img5.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FreeTrial() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    phone_number: "",
    alt_phone_number: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password rules
  const passwordRules = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.hasUppercase &&
    passwordRules.hasLowercase &&
    passwordRules.hasNumber;

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number."
      );
      return;
    }

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setIsSubmitting(true);

      const {
        first_name,
        last_name,
        role,
        email,
        phone_number,
        alt_phone_number,
        password,
      } = formData;

      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          role,
          phone_number,
          alt_phone_number,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        navigate("/sign-in");
      } else {
        alert("Error creating account: " + (result.message || result.error || "Something went wrong"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordRule = ({ passed, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {passed ? (
        <FaCircleCheck className="text-green-600 text-sm" />
      ) : (
        <FaXmark className="text-red-500 text-sm" />
      )}
      <span className={passed ? "text-green-700" : "text-gray-500"}>{text}</span>
    </div>
  );

  return (
    <section className="w-full bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        {/* Left Content */}
        <div className="p-2 md:p-6">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <FaCircleCheck />
            Start Your Free Trial Today
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight pt-2 md:pt-6">
            Take Control of <span className="text-green-600">Your Rentals</span> Today
          </h1>

          <p className="text-lg md:text-xl text-gray-600 pt-5 leading-relaxed max-w-xl">
            Streamline property management with our all-in-one platform. Automate rent collection,
            manage tenants, track maintenance, and grow your rental business with confidence.
          </p>

          <ul className="mt-8 space-y-4 text-sm md:text-base text-gray-700">
            <li className="flex items-start gap-3">
              <FaCircleCheck className="text-green-500 mt-1" />
              <span>14-day free trial, no credit card required</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCircleCheck className="text-green-500 mt-1" />
              <span>Cancel anytime, no hidden commitments</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCircleCheck className="text-green-500 mt-1" />
              <span>Trusted by 10,000+ property managers and landlords</span>
            </li>
          </ul>

          {/* Small Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="bg-white rounded-2xl shadow-md border border-green-100 p-5 hover:shadow-lg transition">
              <FaBuilding className="text-green-600 text-2xl mb-3" />
              <h3 className="font-bold text-gray-800">Property Tracking</h3>
              <p className="text-sm text-gray-500 mt-1">Manage listings and occupancy easily.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-green-100 p-5 hover:shadow-lg transition">
              <FaKey className="text-green-600 text-2xl mb-3" />
              <h3 className="font-bold text-gray-800">Tenant Management</h3>
              <p className="text-sm text-gray-500 mt-1">Stay organized with tenant records.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-green-100 p-5 hover:shadow-lg transition">
              <FaChartLine className="text-green-600 text-2xl mb-3" />
              <h3 className="font-bold text-gray-800">Rent Insights</h3>
              <p className="text-sm text-gray-500 mt-1">Track payments and rental performance.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-2 md:p-4">
          <form
            className="space-y-5 p-6 md:p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100"
            onSubmit={handleSubmit}
          >
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
              <p className="text-sm text-gray-500 mt-1">
                Start managing your rentals in minutes.
              </p>
            </div>

            {/* Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="text-sm font-semibold text-gray-800">
                  First Name
                </label>
                <div className="relative mt-2">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="first_name"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    className="w-full pl-11 pr-4 py-3 text-sm md:text-base border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className="text-sm font-semibold text-gray-800">
                  Last Name
                </label>
                <div className="relative mt-2">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="last_name"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    className="w-full pl-11 pr-4 py-3 text-sm md:text-base border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-gray-800">
                Email Address
              </label>
              <div className="relative mt-2">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="you@gmail.com"
                  className="w-full pl-11 pr-4 py-3 text-sm md:text-base border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="text-sm font-semibold text-gray-800">
                Select Your Role
              </label>
              <select
                id="role"
                className="w-full mt-2 px-4 py-3 text-sm md:text-base border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                onChange={handleChange}
                value={formData.role}
              >
                <option value="">Select Role</option>
                <option value="Landlord">Landlord</option>
                <option value="Tenant">Tenant</option>
              </select>
            </div>

            {/* Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone_number" className="text-sm font-semibold text-gray-800">
                  Phone Number
                </label>
                <div className="relative mt-2">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone_number"
                    type="tel"
                    placeholder="+254700000000"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 text-sm md:text-base border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="alt_phone_number" className="text-sm font-semibold text-gray-800">
                  Alt Phone Number
                </label>
                <div className="relative mt-2">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="alt_phone_number"
                    type="tel"
                    placeholder="+254700000000"
                    value={formData.alt_phone_number}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 text-sm md:text-base border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm font-semibold text-gray-800">
                Password
              </label>
              <div className="relative mt-2">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-12 py-3 text-sm md:text-base border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Rules */}
              <div className="mt-3 bg-green-50 border border-green-100 rounded-2xl p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-800">Password must have:</p>
                <PasswordRule passed={passwordRules.minLength} text="At least 8 characters" />
                <PasswordRule passed={passwordRules.hasUppercase} text="One uppercase letter" />
                <PasswordRule passed={passwordRules.hasLowercase} text="One lowercase letter" />
                <PasswordRule passed={passwordRules.hasNumber} text="One number" />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">
                Confirm Password
              </label>
              <div className="relative mt-2">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-11 pr-12 py-3 text-sm md:text-base border rounded-2xl focus:outline-none focus:ring-2 transition ${
                    formData.confirmPassword.length > 0
                      ? passwordsMatch
                        ? "border-green-400 focus:ring-green-500"
                        : "border-red-400 focus:ring-red-400"
                      : "border-gray-200 focus:ring-green-500"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {formData.confirmPassword.length > 0 && (
                <p
                  className={`mt-2 text-sm font-medium ${
                    passwordsMatch ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                </p>
              )}
            </div>

            <button
              className="w-full py-3.5 text-base bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting || !isPasswordValid || !passwordsMatch}
            >
              {isSubmitting ? "Creating Account..." : "Start 14-Day Free Trial"}
            </button>

            <ul className="flex justify-center gap-6 text-sm text-gray-500 flex-wrap pt-2">
              <li>• No credit card required</li>
              <li>• Cancel anytime</li>
            </ul>
          </form>
        </div>
      </div>

      {/* PREMIUM IMAGE / PROMO SECTION */}
      <div className="container mx-auto px-4 md:px-6 pb-16">
        <div
          className="relative min-h-[500px] md:min-h-[560px] rounded-[2rem] overflow-hidden shadow-2xl border border-green-100"
          style={{
            backgroundImage: `
              linear-gradient(to top right, rgba(6, 95, 70, 0.82), rgba(34, 197, 94, 0.42)),
              url(${bgImage})
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-green-500/10"></div>

          <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12 text-white">
            <div className="inline-flex w-fit items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
              <FaCircleCheck />
              Trusted by Modern Property Managers
            </div>

            <div className="max-w-2xl mt-10">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
                Built to Help You <br />
                <span className="text-green-200">Grow and Manage Smarter</span>
              </h2>

              <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-xl">
                From listing vacant units to collecting rent and tracking tenant activity,
                RentMate helps you stay organized, efficient, and in control.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
              <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-3xl p-5 shadow-lg">
                <p className="text-3xl font-bold">10,000+</p>
                <p className="text-sm text-white/80 mt-1">Property Owners</p>
              </div>

              <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-3xl p-5 shadow-lg">
                <p className="text-3xl font-bold">99.9%</p>
                <p className="text-sm text-white/80 mt-1">Platform Uptime</p>
              </div>

              <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-3xl p-5 shadow-lg">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-white/80 mt-1">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FreeTrial;