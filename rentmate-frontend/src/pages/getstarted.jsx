import { FaUserTie, FaUser, FaUserShield, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RegistrationNotice from "./registrationnotice.jsx";

function Getstarted() {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-screen pt-24 mb-3 bg-gradient-to-b from-gray-100 to-white flex flex-col">
      {/* Main Section */}
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Get Started with <span className="text-blue-600">RentMate</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed mb-10">
          Choose your role to begin — whether you’re a landlord listing properties,
          a tenant managing your lease, or an admin overseeing operations.
        </p>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Landlord */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform cursor-pointer border border-gray-200" onClick={()=> navigate("/landlordregistration")}>
            <FaUserTie className="text-5xl text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Landlord
            </h2>
            <p className="text-gray-600">
              List and manage your rental properties with ease.
            </p>
          </div>

          {/* Tenant */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform cursor-pointer border border-gray-200" onClick={()=> navigate("/tenantregistration")}>
            <FaUser className="text-5xl text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tenant</h2>
            <p className="text-gray-600">
              Manage your lease, view rent details, and communicate easily.
            </p>
          </div>

          {/* Admin */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform cursor-pointer border border-gray-200" onClick={()=> navigate("/adminregistration")}>
            <FaUserShield className="text-5xl text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Admin</h2>
            <p className="text-gray-600">
              Oversee users, properties, and ensure smooth system operation.
            </p>
          </div>
        </div>
      </div>
      <RegistrationNotice/>
    </section>
  );
}

export default Getstarted;
