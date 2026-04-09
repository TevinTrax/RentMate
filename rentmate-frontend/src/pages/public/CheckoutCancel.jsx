import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

function CheckoutCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("paymentId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center border border-gray-200">
        <FaTimesCircle className="mx-auto text-5xl text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-700 mb-4">
          Your payment was not completed.
        </p>

        {paymentId && (
          <p className="text-sm text-gray-500 mb-6">
            Reference: {paymentId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/pricing")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Choose Plan Again
          </button>

          <button
            onClick={() => navigate("/landlord-dashboard")}
            className="w-full bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCancel;