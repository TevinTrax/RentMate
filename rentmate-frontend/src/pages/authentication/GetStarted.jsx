import { FaUserTie, FaUser, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RegistrationNotice from "../public/RegistrationNotice";

function GetStarted() {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-screen pt-24 mb-3 bg-gradient-to-b from-gray-100 to-white flex flex-col">
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Get Started with <span className="text-blue-600">RentMate</span>
        </h1>

        <p className="max-w-2xl mx-auto text-gray-600 text-md md:text-lg leading-relaxed mb-10">
          Choose your role to begin — whether you’re a landlord listing properties,
          a tenant managing your lease, or an admin overseeing operations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform cursor-pointer border border-gray-200"
            onClick={() => navigate("/register/landlord")}
          >
            <FaUserTie className="text-4xl md:text-5xl text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              Landlord
            </h2>
            <p className="text-gray-600 text-md">
              List and manage your rental properties with ease.
            </p>
          </div>

          <div
            className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform cursor-pointer border border-gray-200"
            onClick={() => navigate("/register/tenant")}
          >
            <FaUser className="text-4xl md:text-5xl text-green-600 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              Tenant
            </h2>
            <p className="text-gray-600 text-md">
              Manage your lease, view rent details, and communicate easily.
            </p>
          </div>

          <div
            className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform cursor-pointer border border-gray-200"
            onClick={() => navigate("/register/admin")}
          >
            <FaUserShield className="text-4xl md:text-5xl text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              Admin
            </h2>
            <p className="text-gray-600 text-md">
              Oversee users, properties, and ensure smooth system operation.
            </p>
          </div>
        </div>
      </div>

      <div className="p-3">
        <RegistrationNotice />
      </div>
    </section>
  );
}

export default GetStarted;