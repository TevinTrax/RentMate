import { FaInfoCircle } from "react-icons/fa";

function PropertyNotice() {
  return (
    <div className="container mx-auto my-10 p-6 bg-green-50 border border-green-300 rounded-3xl shadow-lg">
      <div className="flex items-start gap-4">
        <FaInfoCircle className="text-green-600 text-4xl flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Important Notice to Landlords and Property Owners
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Only <span className="font-semibold text-green-700">verified landlords and property owners</span> with an 
            <span className="font-semibold text-green-700"> active paid subscription</span> will have their available
            rental units displayed on this page.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Verification ensures all listings are <span className="font-semibold">authentic</span>, <span className="font-semibold">accurate</span>, and <span className="font-semibold">safe</span> for tenants. Complete your <span className="font-semibold text-green-700">subscription and verification</span> through your account dashboard to display your properties.
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