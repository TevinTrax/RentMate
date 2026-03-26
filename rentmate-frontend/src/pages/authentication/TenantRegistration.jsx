import { FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function TenantRegistration() {
  const navigate = useNavigate();
  const { role } = useParams();

  const [apartments, setApartments] = useState([]); // list of properties
  const [units, setUnits] = useState([]); // list of units for selected apartment
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

  // Fetch available properties on load
  useEffect(() => {
    fetch("http://localhost:5000/api/properties/available")
      .then((res) => res.json())
      .then((data) => setApartments(data.properties || [])) // <- corrected key
      .catch((err) => console.error("Error fetching apartments:", err));
  }, []);

  // Fetch units when apartment changes
  useEffect(() => {
    if (!formData.apartment_id) {
      setUnits([]); // clear units if no apartment selected
      return;
    }

    fetch(`http://localhost:5000/api/properties/${formData.apartment_id}/units`)
      .then((res) => res.json())
      .then((data) => {
        // Only vacant units
        const availableUnits = (data.units || []).filter((unit) => !unit.is_occupied);
        setUnits(availableUnits);
      })
      .catch((err) => console.error("Error fetching units:", err));
  }, [formData.apartment_id]);

  // Update role if URL param changes
  useEffect(() => {
    if (role) {
      setFormData((prev) => ({ ...prev, role }));
    }
  }, [role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Tenant account created successfully! Waiting for landlord approval.");
        navigate("/sign-in");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  return (
    <section className="w-full p-5 pt-24 bg-blue-50">
      <div className="container mx-auto flex items-center mb-4">
        <button
          onClick={() => navigate("/get-started")}
          className="flex items-center text-blue-500 hover:underline"
        >
          <FaArrowLeft className="mr-2" size={16} />
          Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-6 border rounded-xl shadow-md bg-gray-100">
        <h1 className="text-xl md:text-2xl font-semibold text-blue-600 text-center mb-4">
          Tenant Registration
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="role" className="block text-md text-gray-800 pb-1">
              Role
            </label>
            <input
              id="role"
              type="text"
              value={formData.role}
              className="w-full rounded-lg border bg-gray-200 cursor-not-allowed p-2 text-sm md:text-md"
              readOnly
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label htmlFor="first_name" className="block text-md text-gray-800 pb-1">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
                required
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-md text-gray-800 pb-1">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-md text-gray-800 pb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
              required
            />
          </div>

          <div>
            <label htmlFor="id_number" className="block text-md text-gray-800 pb-1">
              ID Number
            </label>
            <input
              id="id_number"
              type="number"
              placeholder="Enter your ID number"
              value={formData.id_number}
              onChange={handleChange}
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="phone_number" className="block text-md text-gray-800 pb-1">
                Phone Number
              </label>
              <input
                id="phone_number"
                type="tel"
                placeholder="e.g. 0700000000"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
                required
              />
            </div>
            <div>
              <label htmlFor="alt_phone_number" className="block text-md text-gray-800 pb-1">
                Alternative Phone Number
              </label>
              <input
                id="alt_phone_number"
                type="tel"
                placeholder="e.g. 0700000000"
                value={formData.alt_phone_number}
                onChange={handleChange}
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
              />
            </div>
          </div>

          {/* Apartment & Unit dropdowns */}
          <div>
            <label htmlFor="apartment_id" className="block text-md text-gray-800 pb-1">
              Select Apartment
            </label>
            <select
              id="apartment_id"
              value={formData.apartment_id}
              onChange={handleChange}
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
              required
            >
              <option value="">-- Select Apartment --</option>
              {apartments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.apartment_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="unit_id" className="block text-md text-gray-800 pb-1">
              Select House/Unit
            </label>
            <select
              id="unit_id"
              value={formData.unit_id}
              onChange={handleChange}
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-md"
              required
              disabled={!formData.apartment_id || units.length === 0}
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

          {/* Password Fields */}
          <div>
            <label htmlFor="password" className="text-md text-gray-800">Create Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
               id="password"
               type="password"
               placeholder="Create Password"
               value={formData.password}
               onChange={handleChange}
               className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 pl-10 text-sm md:text-md"
               required
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-md text-gray-800">Confirm Password</label>
            <div className="relative mt-1">
               <FaLock className="absolute left-3 top-3 text-gray-400" />
               <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 pl-10 text-sm md:text-md"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="reference" className="block text-md text-gray-800 pb-1">
              How did you hear about us?
            </label>
            <input
              id="reference"
              type="text"
              placeholder="How did you hear about us?"
              value={formData.reference}
              onChange={handleChange}
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
            />
          </div>

          {/* Terms */}
          <p className="text-md text-gray-800">
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

          <p className="text-md text-center text-gray-800">
            Already have an account? <br />
            <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => navigate("/sign-in")}>
              Sign In
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default TenantRegistration;