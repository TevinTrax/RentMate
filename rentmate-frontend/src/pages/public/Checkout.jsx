import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaMobileAlt,
  FaUniversity,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const TOKEN_EXPIRY_HOURS = 2;
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

function Checkout() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phone, setPhone] = useState("");
  const [landlordInfo, setLandlordInfo] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // ── Load saved plan ─────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const savedPlan = sessionStorage.getItem("selectedPlan");
      if (savedPlan) setPlan(JSON.parse(savedPlan));
    } catch (err) {
      console.error("Error parsing plan:", err);
    }
  }, []);

  // ── Auth guard + fetch landlord profile ─────────────────────────────────────
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const tokenTime = sessionStorage.getItem("tokenTime");

    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/sign-in");
      return;
    }

    if (
      tokenTime &&
      new Date().getTime() - parseInt(tokenTime) >
        TOKEN_EXPIRY_HOURS * 3600 * 1000
    ) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("tokenTime");
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      alert("Your session has expired. Please log in again.");
      navigate("/sign-in");
      return;
    }

    const fetchLandlordInfo = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || "Failed to fetch user info");

        setLandlordInfo(data);
      } catch (err) {
        console.error("Profile fetch error:", err.message);
        // Don't kick them out — just show limited info
        setLandlordInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlordInfo();
  }, [navigate]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const validateMpesaPhone = (p) => {
    const clean = p.replace(/\s+/g, "");
    return /^(07\d{8}|01\d{8}|\+2547\d{8}|2547\d{8}|\+2541\d{8}|2541\d{8})$/.test(
      clean
    );
  };

  const clearMessages = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  // ── Payment handler ──────────────────────────────────────────────────────────
  const handlePayment = async () => {
    clearMessages();

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    if (!plan?.name) {
      setErrorMsg("Plan information is missing. Please re-select your plan.");
      navigate("/pricing");
      return;
    }

    if (paymentMethod === "mpesa" && !validateMpesaPhone(phone)) {
      setErrorMsg("Please enter a valid Safaricom number (e.g. 0712345678).");
      return;
    }

    try {
      setProcessing(true);

      const res = await fetch(`${API_BASE}/api/payments/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          // Send plan NAME (not code) — backend does LOWER(name) = LOWER($1)
          planCode: plan.name,
          paymentMethod,
          phone: paymentMethod === "mpesa" ? phone.trim() : undefined,
        }),
      });

      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Unexpected server response (HTTP ${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
      }

      // ── Handle per-method responses ────────────────────────────────────────
      if (paymentMethod === "mpesa") {
        setSuccessMsg(
          "✅ STK Push sent! Check your phone and enter your M-Pesa PIN to complete payment."
        );
        // Poll or wait for callback — for now show success message
      } else if (paymentMethod === "card" && data.url) {
        window.location.href = data.url;
      } else if (paymentMethod === "paypal" && data.url) {
        window.location.href = data.url;
      } else if (paymentMethod === "bank") {
        setBankDetails(data.bankDetails || null);
        setSuccessMsg(
          "✅ Bank transfer initiated. Use the details below to complete your payment."
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMsg(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // ── Render guards ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-600">Loading checkout…</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <h1 className="text-2xl font-bold text-red-500 mb-2">No Plan Selected</h1>
        <p className="text-gray-600 mb-6">Please go back and select a plan first.</p>
        <button
          onClick={() => navigate("/pricing")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
        >
          View Plans
        </button>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────────
  return (
    <section className="w-full pt-24 bg-green-50 min-h-screen px-6 pb-12">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-gray-700 hover:text-black font-medium transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back to plans
      </button>

      {/* Progress bar */}
      <div className="mb-8 max-w-2xl">
        <div className="flex justify-between mb-2">
          <span className={`font-semibold text-sm ${step >= 1 ? "text-green-600" : "text-gray-400"}`}>
            1. Summary
          </span>
          <span className={`font-semibold text-sm ${step >= 2 ? "text-green-600" : "text-gray-400"}`}>
            2. Payment
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div
            className="h-2 bg-green-500 rounded-full transition-all duration-500"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      {/* Alert messages */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
          <FaTimes className="mt-0.5 flex-shrink-0 text-red-500" />
          <span>{errorMsg}</span>
          <button onClick={clearMessages} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-2">
          <FaCheck className="mt-0.5 flex-shrink-0 text-green-500" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ── LEFT: Order Summary ─────────────────────────────────────────────── */}
        <div className="relative bg-white border border-gray-100 p-8 rounded-2xl shadow-md">
          {plan.popular && (
            <div className="absolute -top-3 -right-3 bg-yellow-400 text-white px-4 py-1 rounded-full text-xs font-bold shadow">
              MOST POPULAR
            </div>
          )}

          <h2 className="text-lg font-semibold mb-4 border-b pb-3 text-gray-800">
            Order Summary
          </h2>

          <h3 className="text-2xl font-bold text-gray-900">{plan.name} Plan</h3>
          <p className="text-gray-500 mt-1 text-sm">{plan.description}</p>

          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p>
              <strong>Price:</strong>{" "}
              <span className="text-green-600 font-semibold text-base">
                KES {plan.price?.toLocaleString()}
              </span>
              <span className="text-gray-400"> / month</span>
            </p>
            <p>
              <strong>Billing:</strong> Monthly
            </p>
          </div>

          {plan.features?.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-sm text-gray-700 mb-2">What's included:</p>
              <ul className="space-y-2">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-2 text-sm ${
                      f.included ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {f.included ? (
                      <FaCheck className="text-green-500 flex-shrink-0" />
                    ) : (
                      <FaTimes className="text-red-400 flex-shrink-0" />
                    )}
                    <span className={f.included ? "" : "line-through"}>{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 1 && (
            <div className="mt-6 border-t pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all shadow"
              >
                Proceed to Payment →
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Payment Methods ──────────────────────────────────────────── */}
        <div
          className={`bg-white p-8 rounded-2xl shadow-md transition-all duration-500 ${
            step === 2
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-8 pointer-events-none"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Payment Method
          </h2>

          {/* Landlord info */}
          {landlordInfo && (
            <div className="mb-5 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {landlordInfo.first_name} {landlordInfo.last_name}
              </p>
              <p>
                <strong>Email:</strong> {landlordInfo.email}
              </p>
              <p>
                <strong>Subscription:</strong>{" "}
                {landlordInfo.subscription_status === "active" ? (
                  <span className="text-green-600 font-semibold">Active ✅</span>
                ) : (
                  <span className="text-orange-500 font-semibold capitalize">
                    {landlordInfo.subscription_status || "None"}
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {/* M-PESA */}
            <div
              onClick={() => setPaymentMethod("mpesa")}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                paymentMethod === "mpesa"
                  ? "border-green-500 bg-green-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "mpesa"}
                  onChange={() => setPaymentMethod("mpesa")}
                  className="accent-green-500"
                />
                <FaMobileAlt className="text-green-500 text-lg" />
                <span className="font-medium text-sm">M-Pesa (STK Push)</span>
              </label>

              {paymentMethod === "mpesa" && (
                <input
                  type="tel"
                  placeholder="Phone number e.g. 0712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-3 w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              )}
            </div>

            {/* CARD */}
            <div
              onClick={() => setPaymentMethod("card")}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                paymentMethod === "card"
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="accent-blue-500"
                />
                <FaCcVisa className="text-blue-700 text-xl" />
                <FaCcMastercard className="text-red-600 text-xl" />
                <span className="font-medium text-sm">Card (Stripe)</span>
              </label>
              {paymentMethod === "card" && (
                <p className="mt-2 text-xs text-gray-500 ml-7">
                  You'll be redirected to Stripe's secure checkout.
                </p>
              )}
            </div>

            {/* PAYPAL */}
            <div
              onClick={() => setPaymentMethod("paypal")}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                paymentMethod === "paypal"
                  ? "border-yellow-500 bg-yellow-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="accent-yellow-500"
                />
                <FaCcPaypal className="text-blue-600 text-xl" />
                <span className="font-medium text-sm">PayPal</span>
              </label>
              {paymentMethod === "paypal" && (
                <p className="mt-2 text-xs text-gray-500 ml-7">
                  You'll be redirected to PayPal after clicking Pay Now.
                </p>
              )}
            </div>

            {/* BANK TRANSFER */}
            <div
              onClick={() => setPaymentMethod("bank")}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                paymentMethod === "bank"
                  ? "border-purple-500 bg-purple-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="accent-purple-500"
                />
                <FaUniversity className="text-purple-600 text-lg" />
                <span className="font-medium text-sm">Bank Transfer</span>
              </label>
              {paymentMethod === "bank" && (
                <p className="mt-2 text-xs text-gray-500 ml-7">
                  Bank details will be shown after confirming.
                </p>
              )}
            </div>
          </div>

          {/* Bank details (after bank payment initiated) */}
          {bankDetails && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl text-sm text-gray-700">
              <h3 className="font-semibold text-purple-700 mb-2">Bank Transfer Details</h3>
              <p><strong>Bank:</strong> {bankDetails.bankName}</p>
              <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
              <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
              <p><strong>Branch:</strong> {bankDetails.branch}</p>
              {bankDetails.reference && (
                <p><strong>Reference:</strong> <span className="font-mono text-purple-700">{bankDetails.reference}</span></p>
              )}
            </div>
          )}

          {/* Pay button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all shadow-md flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              `Pay KES ${plan.price?.toLocaleString()} Now`
            )}
          </button>

          <p className="mt-3 text-xs text-center text-gray-400">
            🔒 Your payment is secure and encrypted
          </p>
        </div>
      </div>
    </section>
  );
}

export default Checkout;