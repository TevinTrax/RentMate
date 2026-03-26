import { 
  FaArrowLeft, 
  FaCheck, 
  FaTimes, 
  FaMobileAlt, 
  FaUniversity, 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcPaypal 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Set session expiry duration (in hours)
const TOKEN_EXPIRY_HOURS = 2;

function Checkout() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1=Summary, 2=Payment
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phone, setPhone] = useState("");
  const [landlordInfo, setLandlordInfo] = useState(null);

  // Load plan from session
  useEffect(() => {
    try {
      const savedPlan = sessionStorage.getItem("selectedPlan");
      if (savedPlan) setPlan(JSON.parse(savedPlan));
    } catch (err) {
      console.error("Error parsing plan:", err);
    }
  }, []);

  // SESSION CHECK & LANDLORD INFO FETCH
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const tokenTime = sessionStorage.getItem("tokenTime");

    // If no token, redirect to login
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/sign-in");
      return;
    }

    // Check if token is expired
    if (tokenTime && new Date().getTime() - parseInt(tokenTime) > TOKEN_EXPIRY_HOURS * 3600 * 1000) {
      alert("Your session has expired. Please log in.");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("tokenTime");
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/sign-in");
      return;
    }

    // Fetch landlord info only if token is valid
    const fetchLandlordInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch user info");

        setLandlordInfo(data);
      } catch (err) {
        console.error(err.message);
        alert("Failed to fetch landlord info. Please log in again.");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("tokenTime");
        sessionStorage.setItem("redirectAfterLogin", "/checkout");
        navigate("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchLandlordInfo();
  }, [navigate]);

  const handlePayment = async () => {
    if (!sessionStorage.getItem("token")) {
      alert("You must be logged in to pay!");
      navigate("/sign-in");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/payments/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          planId: plan.id,
          paymentMethod,
          phone: paymentMethod === "mpesa" ? phone : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");

      if (paymentMethod === "mpesa") {
        alert("STK Push sent! Check your phone.");
      } else if (paymentMethod === "card" || paymentMethod === "paypal") {
        window.location.href = data.url; // redirect to Stripe/PayPal checkout
      } else {
        alert("Bank transfer details will be provided after confirmation.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center mt-20">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );

  if (!plan)
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-2xl font-bold text-red-500 mb-2">
          No Plan Selected ❌
        </h1>
        <p className="text-gray-600">Please go back and select a plan.</p>
        <button
          onClick={() => navigate("/pricing")}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
        >
          Go to Pricing
        </button>
      </div>
    );

  return (
    <section className="w-full pt-24 bg-green-50 min-h-screen px-6 pb-12">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-gray-700 hover:text-black font-medium transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back to plans
      </button>

      {/* PROGRESS BAR */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className={`font-semibold ${step >= 1 ? "text-green-600" : "text-gray-400"}`}>Summary</span>
          <span className={`font-semibold ${step >= 2 ? "text-green-600" : "text-gray-400"}`}>Payment</span>
        </div>
        <div className="h-2 w-full bg-gray-300 rounded-full relative">
          <div
            className="h-2 bg-green-600 rounded-full transition-all duration-500"
            style={{ width: `${step === 1 ? 50 : 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* LEFT - ORDER SUMMARY */}
        <div className="relative bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
          {plan.popular && (
            <div className="absolute -top-3 -right-3 bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              MOST POPULAR
            </div>
          )}

          <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-800">
            Order Summary
          </h2>

          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            <p className="text-gray-500 mt-1">{plan.description}</p>
          </div>

          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Price:</strong>{" "}
              <span className="text-green-600 font-semibold">
                KES {plan.price?.toLocaleString()}
              </span>
            </p>
            <p><strong>Duration:</strong> Monthly</p>

            <p className="font-semibold mt-2">Features:</p>
            <ul className="list-disc ml-5 space-y-1">
              {plan.features?.map((f, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-2 ${
                    f.included ? "text-gray-800" : "text-gray-400 line-through"
                  }`}
                >
                  {f.included ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-400" />}
                  {f.name}
                </li>
              ))}
            </ul>
          </div>

          {step === 1 && (
            <div className="mt-6 border-t pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-lg transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>

        {/* RIGHT - PAYMENT WITH SLIDE ANIMATION */}
        <div
          className={`bg-white p-8 rounded-2xl shadow-lg transition-all duration-700 transform ${
            step === 2
              ? "translate-x-0 opacity-100"
              : "translate-x-20 opacity-0 pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Payment Method
          </h2>

          {!sessionStorage.getItem("token") ? (
            <div className="text-center text-gray-700 space-y-4">
              <p className="font-medium">
                You must be logged in to pay for a plan.
              </p>

              <button
                onClick={() => {
                  sessionStorage.setItem("redirectAfterLogin", "/checkout");
                  window.location.href = "/sign-in";
                }}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Sign In
              </button>

              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <span
                  onClick={() => (window.location.href = "/get-started")}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Register
                </span>
              </p>
            </div>
          ) : (
            <>
              {/* LANDLORD INFO ABOVE PAYMENT METHODS */}
              <div className="mb-4 p-3 bg-gray-100 rounded-lg text-gray-700 text-sm">
                {landlordInfo ? (
                  <>
                    <p><strong>Email:</strong> {landlordInfo.email}</p>
                    <p><strong>Name:</strong> {landlordInfo.first_name} {landlordInfo.last_name}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {landlordInfo.subscriptionPaid ? (
                        <span className="text-green-600 font-semibold">Paid ✅</span>
                      ) : (
                        <span className="text-red-500 font-semibold">Pending ❌</span>
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">Fetching landlord info...</p>
                )}
              </div>

              {/* PAYMENT OPTIONS */}
              <div className="space-y-4">
                {/* M-PESA */}
                <div
                  onClick={() => setPaymentMethod("mpesa")}
                  className={`border p-4 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "mpesa"
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "mpesa"}
                      onChange={() => setPaymentMethod("mpesa")}
                      className="accent-green-500"
                    />
                    <FaMobileAlt className="text-green-500 text-lg" />
                    <span className="font-medium">M-Pesa</span>
                  </div>

                  {paymentMethod === "mpesa" && (
                    <input
                      type="text"
                      placeholder="Enter phone number (07XXXXXXXX)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-3 w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                    />
                  )}
                </div>

                {/* CARD */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`border p-4 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="accent-blue-500"
                    />
                    <FaCcVisa className="text-blue-600" />
                    <FaCcMastercard className="text-red-600" />
                    <span className="font-medium">Card Payment</span>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full border p-2 rounded"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-1/2 border p-2 rounded"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="w-1/2 border p-2 rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* PAYPAL */}
                <div
                  onClick={() => setPaymentMethod("paypal")}
                  className={`border p-4 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "paypal"
                      ? "border-yellow-500 bg-yellow-50 shadow-md"
                      : "hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="accent-yellow-500"
                    />
                    <FaCcPaypal className="text-blue-500" />
                    <span className="font-medium">PayPal</span>
                  </div>

                  {paymentMethod === "paypal" && (
                    <p className="mt-2 text-sm text-gray-500">
                      You will be redirected to PayPal after clicking Pay Now.
                    </p>
                  )}
                </div>

                {/* BANK */}
                <div
                  onClick={() => setPaymentMethod("bank")}
                  className={`border p-4 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "bank"
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "bank"}
                      onChange={() => setPaymentMethod("bank")}
                      className="accent-purple-500"
                    />
                    <FaUniversity className="text-purple-600" />
                    <span className="font-medium">Bank Transfer</span>
                  </div>

                  {paymentMethod === "bank" && (
                    <p className="mt-2 text-sm text-gray-500">
                      Bank details will be provided after confirmation.
                    </p>
                  )}
                </div>
              </div>

              {/* PAY BUTTON */}
              <button
                onClick={handlePayment}
                className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-800 shadow-lg transition-all"
              >
                Pay Now
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Checkout;