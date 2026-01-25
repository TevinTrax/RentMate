import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaMoneyBill,
  FaWrench,
  FaCommentDots,
  FaBox,
} from "react-icons/fa";

function FAQS() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { category: "Account & Login", 
      icon: <FaUser />, 
      questions: [ { q: "How do I create a RentMate account?", a: "Click 'Get Started' on the Navbar, choose your role (landlord or tenant), enter your email and create a password. Verify your email to activate your account. You can then complete your profile as a landlord or tenant." }, 
        { q: "I can't log into my account. What should I do?", a: "First, ensure you're using the correct email address. Try resetting your password using the 'Forgot Password' link. If issues persist, clear your browser cache or try a different browser. Contact support if the problem continues." } ] }, { category: "Password & Security", icon: <FaLock />, questions: [ { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page, enter your registered email, and we'll send you a secure reset link. The link expires in 24 hours for security." }, { q: "How do I enable two-factor authentication?", a: "Go to Settings > Security > Two-Factor Authentication. Choose your preferred method (SMS or authenticator app) and follow the setup instructions." } ] }, { category: "Rent Payments & Transactions", icon: <FaMoneyBill />, questions: [ { q: "How do I make a rent payment?", a: "Navigate to 'Payments' in your dashboard, select your property, choose your payment method (bank transfer, card, or saved method), and confirm the amount. You'll receive a confirmation email once processed." }, { q: "Why is my payment pending?", a: "Payments typically process within 1-3 business days. Bank transfers may take longer. Check your payment history for status updates. If pending for over 5 days, contact support with your transaction ID." } ] }, { category: "Maintenance Requests", icon: <FaWrench />, questions: [ { q: "How do I submit a maintenance request?", a: "Go to 'Maintenance' in your dashboard, click 'New Request', describe the issue with photos if possible, select urgency level, and submit. Your landlord will be notified immediately." }, { q: "How can I track my maintenance request?", a: "All requests appear in your Maintenance dashboard with real-time status updates: Submitted, In Review, Scheduled, In Progress, or Completed. You'll receive notifications at each stage." } ] }, { category: "Communication", icon: <FaCommentDots />, questions: [ { q: "How do I message my landlord or tenant?", a: "Use the 'Messages' section in your dashboard. All communications are securely stored and timestamped for your records. You can also attach documents and images." }, { q: "Can I receive notifications?", a: "Yes, enable notifications in your account settings." } ] }, { category: "Subscription & Plans", icon: <FaBox />, questions: [ { q: "What plans does RentMate offer?", a: "RentMate offers Free, Basic, Standard, and Premium plans tailored to different needs." }, { q: "How do I change my subscription?", a: "Go to Settings > Subscription > Change Plan. Select your new plan and confirm. Upgrades take effect immediately; downgrades apply at the end of your billing cycle." } ] }
  ];

  // ✅ FIX: define filteredFaqs
  const filteredFaqs = faqs;

  

  return (
    <section className="w-full pt-20">
      <div className="px-4 py-4 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-3 mt-10">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 text-md md:text-lg mb-12">
          Find quick answers to common questions about using RentMate
        </p>

        {filteredFaqs.length === 0 && (
          <p className="text-center text-gray-500">
            No results found for your search.
          </p>
        )}

        {filteredFaqs.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8 mb-10"
          >
            <div className="flex items-center mb-6">
              <div className="mr-4 p-2 bg-blue-50 rounded-lg text-blue-500">
                {section.icon}
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-800">
                {section.category}
              </h3>
            </div>

            {section.questions.map((item, index) => {
              const currentIndex = `${sectionIndex}-${index}`;
              const isOpen = openIndex === currentIndex;

              return (
                <div key={currentIndex} className="border-b py-4">
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : currentIndex)
                    }
                    className="w-full text-sm md:text-md flex justify-between items-center text-left font-medium text-gray-800 hover:text-blue-500"
                  >
                    {item.q}
                    <span className="text-xl">{isOpen ? "−" : "+"}</span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-gray-600 text-sm overflow-hidden"
                      >
                        {item.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQS;
