import { FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function LandlordRegistration() {
  const navigate = useNavigate();
  const { role } = useParams();

  // Initialize form data with role from URL param
  const [ formData, setFormData]= useState({
    full_name:"",
    role: role || "Landlord",           // role from URL param
    email:"",
    id_number:"",
    phone_number:"",
    alt_phone_number:"",
    password:"",
    confirmPassword:"",
    ref:"",
  });

  // update role in formData if URL param changes (unlikely but safe)
  useEffect(()=>{
    if (role) {
      setFormData((prev)=>({...prev, role}));
    }
  }, [role]);

  // handle input changes
  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  // form submit handler
  const handleSubmit = async(e)=>{
    e.preventDefault();

    // confirm password
    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const {
        full_name,
        role,   
        email,
        id_number,
        phone_number,
        alt_phone_number,
        password,
        ref,
      }= formData;

      const response= await fetch ("http://localhost:5000/api/users/landlord",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({
          full_name,
          role,
          email,
          id_number,
          phone_number,
          alt_phone_number,
          password,
          ref
        })
      });

      if (response.ok) {
        alert("Account created successfully");
        navigate("/sign-in");
      }else{
        const data= await response.json();
        alert("Error:"+ data.error)
      }
    } catch (error) {
      alert("Network Error:" + error.message)
    }
  };

  return (
    <section className="w-full p-5 pt-24 bg-blue-50">
      {/* Back button */}
      <div className="container mx-auto flex items-center mb-4">
        <button
          onClick={() => navigate("/get-started")}
          className="flex items-center text-blue-500 hover:underline"
        >
          <FaArrowLeft className="mr-2" size={16} />
          Back
        </button>
      </div>

      {/* Registration Form */}
      <div className="max-w-3xl mx-auto p-6 border rounded-xl shadow-md bg-gray-100">
        <h1 className="text-xl md:text-2xl font-semibold text-blue-600 text-center mb-4">
          Landlord Registration
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
              readOnly
              className="w-full rounded-lg border bg-gray-200 p-2 text-sm md:text-md cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="fullname" className="block text-md text-gray-800 pb-1">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              value={formData.full_name}
              placeholder="Enter your full name"
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
              onChange={ handleChange}
            />
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
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="idNumber" className="block text-md text-gray-800 pb-1">
              ID Number
            </label>
            <input
              id="id_number"
              type="number"
              placeholder="Enter your ID number"
              value={formData.id_number}
              onChange={handleChange}
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
            />
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="phone" className="block text-md text-gray-800">
                Phone Number
              </label>
              <input
                id="phone_number"
                type="tel"
                placeholder="e.g. 0700000000"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
              />
            </div>
            <div>
              <label htmlFor="altPhone" className="block text-md text-gray-800">
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

          {/* Password Fields */}
          <div>
            <label htmlFor="" className="text-md text-gray-800">Create Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 pl-10 text-sm md:text-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="" className="text-md text-gray-800">Confirm Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 pl-10 text-sm md:text-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ref" className="block text-md text-gray-800 pb-1">
              How did you hear about us?
            </label>
            <input
              id="ref"
              type="text"
              placeholder="How did you hear about us?"
              value={formData.ref}
              onChange={handleChange}
              className="w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 text-sm md:text-md"
            />
          </div>

          {/* Terms */}
          <p className="text-md text-black">
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

          <p className="text-md text-center text-black">
            Already have an account?{" "} <br />
            <span className="text-blue-500 hover:underline cursor-pointer" onClick={()=>navigate("/sign-in")}>
              Sign In
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LandlordRegistration;
