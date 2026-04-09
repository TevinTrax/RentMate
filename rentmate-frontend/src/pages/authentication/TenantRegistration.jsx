import { FaLock, FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import bgImage from "@/assets/images/tenant.jpg";

function TenantRegistration() {
  const navigate = useNavigate();
  const { role } = useParams();

  const [apartments, setApartments] = useState([]);
  const [units, setUnits] = useState([]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: role || "Tenant",
    email: "",
    id_number: "",
    phone_number: "",
    alt_phone_number: "",
    apartment_id: "",
    unit_id: "",
    password: "",
    confirmPassword: "",
    reference: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [idError, setIdError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [altPhoneError, setAltPhoneError] = useState("");

  // =========================
  // FETCH APARTMENTS
  // =========================
  useEffect(() => {
    fetch("http://localhost:5000/api/properties/available")
      .then((res) => res.json())
      .then((data) => setApartments(data.properties || []))
      .catch((err) => console.error("Error fetching apartments:", err));
  }, []);

  // =========================
  // FETCH UNITS WHEN APARTMENT CHANGES
  // =========================
  useEffect(() => {
    if (!formData.apartment_id) {
      setUnits([]);
      return;
    }

    fetch(`http://localhost:5000/api/properties/${formData.apartment_id}/units`)
      .then((res) => res.json())
      .then((data) => {
        const availableUnits = (data.units || []).filter((u) => !u.is_occupied);
        setUnits(availableUnits);
      })
      .catch((err) => console.error("Error fetching units:", err));
  }, [formData.apartment_id]);

  // =========================
  // UPDATE ROLE FROM URL
  // =========================
  useEffect(() => {
    if (role) {
      setFormData((prev) => ({ ...prev, role }));
    }
  }, [role]);

  // =========================
  // PASSWORD RULES
  // =========================
  const passwordRules = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[\W_]/.test(formData.password),
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter";
    if (!/\d/.test(password)) return "Password must include at least one number";
    if (!/[\W_]/.test(password)) return "Password must include at least one special character";
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

  // =========================
  // KENYAN VALIDATION HELPERS
  // =========================

  // Kenyan National ID: usually 7–8 digits
  const validateKenyanID = (id) => {
    return /^\d{7,8}$/.test(id);
  };

  // Convert phone to 2547XXXXXXXX or 2541XXXXXXXX
  const normalizeKenyanPhone = (phone) => {
    if (!phone) return "";

    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0") && cleaned.length === 10) {
      cleaned = "254" + cleaned.substring(1);
    } else if (cleaned.startsWith("7") && cleaned.length === 9) {
      cleaned = "254" + cleaned;
    } else if (cleaned.startsWith("1") && cleaned.length === 9) {
      cleaned = "254" + cleaned;
    }

    return cleaned;
  };

  const validateKenyanPhone = (phone) => {
    return /^(254)(7\d{8}|1\d{8})$/.test(phone);
  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { id, value } = e.target;

    let processedValue = value;

    // Kenyan ID: numbers only, max 8 digits
    if (id === "id_number") {
      processedValue = value.replace(/\D/g, "").slice(0, 8);
      setIdError("");
    }

    // Kenyan phone numbers: allow digits only during typing
    if (id === "phone_number" || id === "alt_phone_number") {
      processedValue = value.replace(/[^\d+]/g, "");
      if (id === "phone_number") setPhoneError("");
      if (id === "alt_phone_number") setAltPhoneError("");
    }

    setFormData((prev) => ({
      ...prev,
      [id]: processedValue,
      ...(id === "apartment_id" ? { unit_id: "" } : {}),
    }));

    if (id === "password") {
      setPasswordStrength(checkPasswordStrength(processedValue));
      setPasswordError("");
    }

    if (id === "confirmPassword") {
      setPasswordError("");
    }
  };

  // =========================
  // HANDLE BLUR VALIDATION
  // =========================
  const handleBlur = (e) => {
    const { id, value } = e.target;

    if (id === "id_number") {
      if (value && !validateKenyanID(value)) {
        setIdError("Kenyan ID number must be 7 or 8 digits");
      } else {
        setIdError("");
      }
    }

    if (id === "phone_number") {
      const normalized = normalizeKenyanPhone(value);

      setFormData((prev) => ({
        ...prev,
        phone_number: normalized,
      }));

      if (normalized && !validateKenyanPhone(normalized)) {
        setPhoneError("Enter a valid Kenyan phone number (e.g. 0712345678 or 254712345678)");
      } else {
        setPhoneError("");
      }
    }

    if (id === "alt_phone_number") {
      if (!value.trim()) {
        setAltPhoneError("");
        return;
      }

      const normalized = normalizeKenyanPhone(value);

      setFormData((prev) => ({
        ...prev,
        alt_phone_number: normalized,
      }));

      if (normalized && !validateKenyanPhone(normalized)) {
        setAltPhoneError("Enter a valid Kenyan alternative phone number");
      } else {
        setAltPhoneError("");
      }
    }
  };

  // =========================
  // HANDLE SUBMIT
  // =========================
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

    const normalizedPhone = normalizeKenyanPhone(formData.phone_number);
    const normalizedAltPhone = formData.alt_phone_number
      ? normalizeKenyanPhone(formData.alt_phone_number)
      : "";

    if (!validateKenyanID(formData.id_number)) {
      setIdError("Kenyan ID number must be 7 or 8 digits");
      return;
    }

    if (!validateKenyanPhone(normalizedPhone)) {
      setPhoneError("Enter a valid Kenyan phone number");
      return;
    }

    if (normalizedAltPhone && !validateKenyanPhone(normalizedAltPhone)) {
      setAltPhoneError("Enter a valid Kenyan alternative phone number");
      return;
    }

    setPasswordError("");
    setIdError("");
    setPhoneError("");
    setAltPhoneError("");

    const payload = {
      ...formData,
      email: formData.email.trim().toLowerCase(),
      id_number: formData.id_number.trim(),
      phone_number: normalizedPhone,
      alt_phone_number: normalizedAltPhone || "",
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      reference: formData.reference.trim(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/users/tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Tenant account created successfully! Waiting for landlord approval.");
        navigate("/sign-in");
      } else {
        alert("Error: " + (data.error || data.message || "Something went wrong"));
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  // =========================
  // PASSWORD RULE ITEM
  // =========================
  const PasswordRule = ({ valid, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {valid ? (
        <FaCheckCircle className="text-green-600" />
      ) : (
        <FaTimesCircle className="text-red-400" />
      )}
      <span className={valid ? "text-green-700" : "text-gray-600"}>{text}</span>
    </div>
  );

  return (
    <section className="w-full min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 min-h-[700px] border border-green-100 mt-16">

        {/* LEFT IMAGE */}
        <div className="hidden lg:block relative">
          <img
            src={bgImage}
            alt="Tenant Registration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-green-700/40 to-green-500/20"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
            <h2 className="text-4xl font-bold mb-3">Join RentMate</h2>
            <p className="text-white/90 text-base leading-relaxed">
              Find your ideal home, pay rent online, and communicate with landlords easily.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="relative flex flex-col justify-center px-6 sm:px-10 md:px-14 py-10">

          <button
            onClick={() => navigate("/get-started")}
            className="flex items-center text-green-600 text-sm sm:text-base hover:underline mb-6"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Tenant Registration
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Fill in your details to create an account and access available units.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Role */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Role</label>
              <input
                id="role"
                type="text"
                value={formData.role}
                readOnly
                className="w-full p-3 rounded-xl border bg-gray-100 cursor-not-allowed text-sm"
              />
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="first_name" className="block text-sm text-gray-700 mb-1">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm text-gray-700 mb-1">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* ID */}
            <div>
              <label htmlFor="id_number" className="block text-sm text-gray-700 mb-1">ID Number</label>
              <input
                id="id_number"
                type="text"
                inputMode="numeric"
                placeholder="Enter your Kenyan ID number"
                value={formData.id_number}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={8}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {idError && (
                <p className="text-red-500 text-sm mt-1">{idError}</p>
              )}
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="phone_number" className="block text-sm text-gray-700 mb-1">Phone Number</label>
                <input
                  id="phone_number"
                  type="tel"
                  placeholder="e.g. 0712345678"
                  value={formData.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>
              <div>
                <label htmlFor="alt_phone_number" className="block text-sm text-gray-700 mb-1">Alternative Phone</label>
                <input
                  id="alt_phone_number"
                  type="tel"
                  placeholder="Optional"
                  value={formData.alt_phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {altPhoneError && (
                  <p className="text-red-500 text-sm mt-1">{altPhoneError}</p>
                )}
              </div>
            </div>

            {/* Apartment */}
            <div>
              <label htmlFor="apartment_id" className="block text-sm text-gray-700 mb-1">Select Apartment</label>
              <select
                id="apartment_id"
                value={formData.apartment_id}
                onChange={handleChange}
                required
                className="w-full p-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select Apartment --</option>
                {apartments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.apartment_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div>
              <label htmlFor="unit_id" className="block text-sm text-gray-700 mb-1">Select Unit</label>
              <select
                id="unit_id"
                value={formData.unit_id}
                onChange={handleChange}
                required
                disabled={!formData.apartment_id || units.length === 0}
                className="w-full p-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              >
                <option value="">-- Select Unit --</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.house_number}
                  </option>
                ))}
              </select>

              {units.length === 0 && formData.apartment_id && (
                <p className="text-sm text-red-500 mt-1">No units available for this apartment.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-green-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-3">
                  <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
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
                  <p className="text-sm mt-1 text-gray-700">
                    Strength: <span className="font-semibold">{passwordStrength}</span>
                  </p>
                </div>
              )}

              {/* PASSWORD RULES */}
              {formData.password && (
                <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Password must contain:
                  </p>

                  <PasswordRule valid={passwordRules.minLength} text="At least 8 characters" />
                  <PasswordRule valid={passwordRules.hasUppercase} text="At least 1 uppercase letter" />
                  <PasswordRule valid={passwordRules.hasLowercase} text="At least 1 lowercase letter" />
                  <PasswordRule valid={passwordRules.hasNumber} text="At least 1 number" />
                  <PasswordRule valid={passwordRules.hasSpecialChar} text="At least 1 special character" />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-4 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-green-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {formData.confirmPassword && (
                <p
                  className={`text-sm mt-2 font-medium ${
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

            {/* Error */}
            {passwordError && (
              <p className="text-red-600 text-sm font-medium">{passwordError}</p>
            )}

            {/* Reference */}
            <div>
              <label htmlFor="reference" className="block text-sm text-gray-700 mb-1">
                How did you hear about us?
              </label>
              <input
                id="reference"
                type="text"
                placeholder="Optional"
                value={formData.reference}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl mt-2 shadow-lg hover:shadow-xl transition"
            >
              Create Account
            </button>

            <p className="text-center text-gray-700 mt-2">
              Already have an account?{" "}
              <span
                className="text-green-600 hover:underline cursor-pointer"
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

export default TenantRegistration;