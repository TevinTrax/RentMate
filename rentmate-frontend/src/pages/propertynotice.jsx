import { FaInfoCircle } from "react-icons/fa";

function PropertyNotice() {
  return (
    <div className="container mx-auto my-8 p-6 bg-blue-50 border border-blue-300 rounded-2xl shadow-md">
      <div className="flex items-start space-x-3">
        <FaInfoCircle className="text-blue-600 text-3xl flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">
            Important Notice to Landlords and Property Owners
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Only <span className="font-semibold text-blue-700">verified landlords and property owners</span> with an 
            <span className="font-semibold text-blue-700"> active paid subscription</span> will have their available
            rental units displayed on this properties page.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Verification helps ensure that all listings are <span className="font-semibold">authentic</span>, 
            <span className="font-semibold"> accurate</span>, and <span className="font-semibold">safe</span> for tenants to browse.
            Please complete your <span className="font-semibold text-blue-700">subscription and verification</span> through your account dashboard 
            to make your properties visible to potential tenants.
          </p>
          <p className="text-gray-700 mt-3">
            Your subscription helps us maintain a <span className="font-semibold">secure, trusted, and professional rental environment</span> for everyone.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PropertyNotice;
