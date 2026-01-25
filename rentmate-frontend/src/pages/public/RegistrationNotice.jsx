import { FaUserShield, FaHome, FaUserFriends } from "react-icons/fa";

function RegistrationNote() {
  return (
    <div className="container mx-auto my-8 p-6 bg-green-50 border border-green-300 rounded-2xl shadow-md">
      <h2 className="text-xl md:text-2xl font-semibold text-green-800 mb-4 text-center">
        Registration Information
      </h2>
      <p className="text-gray-700 text-md mb-6 text-center">
        Our rental management system provides secure registration for landlords, tenants, and administrators.  
        Each role has specific access and features designed for efficient property management.
      </p>

      <div className="space-y-6">
        {/* Landlords Section */}
        <div className="flex items-start space-x-3">
          <FaHome className="text-green-700 text-3xl flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">Landlords / Property Owners</h3>
            <p className="text-gray-700 text-md leading-relaxed">
              Register to access your personal <span className="font-semibold">dashboard</span>, where you can 
              <span className="font-semibold"> add and manage properties</span>, <span className="font-semibold">register tenants</span>,
              and track rental activity. Verified and subscribed landlords will have their properties displayed 
              on the <span className="font-semibold text-green-700">Properties</span> page.
            </p>
          </div>
        </div>

        {/* Tenants Section */}
        <div className="flex items-start space-x-3">
          <FaUserFriends className="text-green-700 text-3xl flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">Tenants</h3>
            <p className="text-gray-700 text-md leading-relaxed">
              Create an account to access your <span className="font-semibold">tenant dashboard</span>, where you can
              make rent payments, submit maintenance requests, and view your rental details.  
              Tenants are usually added by landlords but can also register independently to link to their rental 
              unit using a <span className="font-semibold text-green-700">unique code or verification</span> from their landlord.
            </p>
          </div>
        </div>

        {/* Admin Section */}
        <div className="flex items-start space-x-3">
          <FaUserShield className="text-green-700 text-3xl flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">Admin</h3>
            <p className="text-gray-700 text-md leading-relaxed">
              Administrators manage the overall system, overseeing users, subscriptions, and property data 
              to ensure smooth operations and secure management.
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mt-6 text-center">
        Registration ensures that every user role operates within a 
        <span className="font-semibold"> secure, organized, and transparent rental environment</span>.
      </p>
    </div>
  );
}

export default RegistrationNote;
