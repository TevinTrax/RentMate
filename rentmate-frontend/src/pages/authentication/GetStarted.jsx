import { FaUserTie, FaUser, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RegistrationNotice from "../public/RegistrationNotice";

function GetStarted() {
  const navigate = useNavigate();

  return (
    <section className="w-full min-h-screen relative bg-gradient-to-b from-green-50 to-green-100 flex flex-col py-24">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-300/20 rounded-full blur-3xl translate-x-32 translate-y-24"></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Get Started with <span className="text-green-600">RentMate</span>
        </h1>

        <p className="max-w-2xl mx-auto text-gray-700 text-md md:text-lg leading-relaxed mb-12">
          Choose your role to begin — whether you’re a landlord listing properties,
          a tenant managing your lease, or an admin overseeing operations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Landlord Card */}
          <div
            className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 hover:scale-105 transition-transform cursor-pointer border border-gray-200"
            onClick={() => navigate("/register/landlord")}
          >
            <FaUserTie className="text-4xl md:text-5xl text-green-600 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              Landlord
            </h2>
            <p className="text-gray-600 text-md">
              List and manage your rental properties with ease.
            </p>
          </div>

          {/* Tenant Card */}
          <div
            className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 hover:scale-105 transition-transform cursor-pointer border border-gray-200"
            onClick={() => navigate("/register/tenant")}
          >
            <FaUser className="text-4xl md:text-5xl text-green-500 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              Tenant
            </h2>
            <p className="text-gray-600 text-md">
              Manage your lease, view rent details, and communicate easily.
            </p>
          </div>

          {/* Admin Card */}
          <div
            className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 hover:scale-105 transition-transform cursor-pointer border border-gray-200"
            onClick={() => navigate("/register/admin")}
          >
            <FaUserShield className="text-4xl md:text-5xl text-green-700 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              Admin
            </h2>
            <p className="text-gray-600 text-md">
              Oversee users, properties, and ensure smooth system operation.
            </p>
          </div>
        </div>
      </div>

      {/* Registration Notice Section */}
      <div className="container mx-auto px-4 mt-12 relative z-10">
        <RegistrationNotice />
      </div>
    </section>
  );
}

export default GetStarted;