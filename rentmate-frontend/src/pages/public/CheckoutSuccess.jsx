import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaArrowRight,
  FaRedoAlt,
} from "react-icons/fa";

function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTimerRef = useRef(null);

  const [status, setStatus] = useState("loading");
  // loading | success | failed | error

  const [message, setMessage] = useState("Verifying payment...");
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get("paymentId");
        const sessionId = searchParams.get("session_id");
        const token = sessionStorage.getItem("token");

        // ---------------------------
        // VALIDATIONS
        // ---------------------------
        if (!paymentId) {
          setStatus("failed");
          setMessage("Missing payment ID.");
          return;
        }

        if (!sessionId) {
          setStatus("failed");
          setMessage("Missing Stripe session ID.");
          return;
        }

        if (!token) {
          setStatus("failed");
          setMessage("You are not logged in. Please sign in again.");
          return;
        }

        // ---------------------------
        // VERIFY STRIPE PAYMENT
        // ---------------------------
        const res = await fetch(
          `http://localhost:5000/api/payments/stripe/verify?paymentId=${encodeURIComponent(
            paymentId
          )}&session_id=${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error || "Payment verification failed");
        }

        setPaymentData(data);
        setStatus("success");
        setMessage(
          data.message || "Payment successful! Subscription activated 🎉"
        );

        // Save useful session flags
        sessionStorage.setItem("subscriptionPaid", "true");

        if (data.subscriptionStatus) {
          sessionStorage.setItem(
            "subscriptionStatus",
            data.subscriptionStatus
          );
        }

        if (data.planName) {
          sessionStorage.setItem("currentPlan", data.planName);
        }

        if (data.subscriptionEndDate) {
          sessionStorage.setItem(
            "subscriptionEndDate",
            data.subscriptionEndDate
          );
        }

        // Redirect after a few seconds
        redirectTimerRef.current = setTimeout(() => {
          navigate("/landlord-dashboard", { replace: true });
        }, 3000);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("VERIFY PAYMENT ERROR:", error);
        setStatus("error");
        setMessage(
          error.message || "Something went wrong while verifying payment."
        );
      }
    };

    verifyPayment();

    return () => {
      controller.abort();
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-6 py-10">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-w-xl w-full text-center border border-gray-200">
        {/* ---------------- LOADING ---------------- */}
        {status === "loading" && (
          <>
            <FaSpinner className="mx-auto text-5xl text-blue-500 animate-spin mb-5" />
            <h1 className="text-3xl font-bold text-blue-600 mb-3">
              Verifying Payment
            </h1>
            <p className="text-gray-700 text-base">{message}</p>

            <div className="mt-6 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse w-3/4 rounded-full"></div>
            </div>
          </>
        )}

        {/* ---------------- SUCCESS ---------------- */}
        {status === "success" && (
          <>
            <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-5" />
            <h1 className="text-3xl font-bold text-green-600 mb-3">
              Payment Successful
            </h1>
            <p className="text-gray-700 mb-6">{message}</p>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-left text-sm text-gray-700 mt-4 shadow-sm space-y-2">
              <p>
                <strong>Plan:</strong> {paymentData?.planName || "N/A"}
              </p>
              <p>
                <strong>Amount:</strong> KES{" "}
                {Number(paymentData?.amount || 0).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600 font-semibold">Paid</span>
              </p>
              <p>
                <strong>Subscription:</strong>{" "}
                <span className="text-green-600 font-semibold">
                  {paymentData?.subscriptionStatus || "Active"}
                </span>
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {paymentData?.method || "Card"}
              </p>

              {paymentData?.transactionId && (
                <p>
                  <strong>Transaction ID:</strong> {paymentData.transactionId}
                </p>
              )}

              {paymentData?.subscriptionStartDate && (
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(
                    paymentData.subscriptionStartDate
                  ).toLocaleDateString()}
                </p>
              )}

              {paymentData?.subscriptionEndDate && (
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(
                    paymentData.subscriptionEndDate
                  ).toLocaleDateString()}
                </p>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-5">
              Redirecting to dashboard...
            </p>

            <button
              onClick={() => navigate("/landlord-dashboard", { replace: true })}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              Go to Dashboard <FaArrowRight />
            </button>
          </>
        )}

        {/* ---------------- FAILED ---------------- */}
        {status === "failed" && (
          <>
            <FaTimesCircle className="mx-auto text-6xl text-yellow-500 mb-5" />
            <h1 className="text-3xl font-bold text-yellow-600 mb-3">
              Payment Not Verified
            </h1>
            <p className="text-gray-700 mb-6">{message}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/pricing")}
                className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition"
              >
                Back to Pricing
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Return to Checkout
              </button>
            </div>
          </>
        )}

        {/* ---------------- ERROR ---------------- */}
        {status === "error" && (
          <>
            <FaTimesCircle className="mx-auto text-6xl text-red-500 mb-5" />
            <h1 className="text-3xl font-bold text-red-600 mb-3">
              Verification Failed
            </h1>
            <p className="text-gray-700 mb-6">{message}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FaRedoAlt />
                Retry
              </button>

              <button
                onClick={() => navigate("/pricing")}
                className="w-full bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Back to Pricing
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckoutSuccess;