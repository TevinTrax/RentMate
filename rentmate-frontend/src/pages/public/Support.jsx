import {
  FaSearch,
  FaUser,
  FaLock,
  FaMoneyBill,
  FaWrench,
  FaCommentDots,
  FaBox,
  FaEnvelope,
  FaComments,
  FaTicketAlt,
  FaSyncAlt,
  FaMobileAlt,
  FaDesktop,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaShieldAlt,
  FaEye,
  FaLightbulb,
  FaHeadphonesAlt,
  FaArrowRight
} from "react-icons/fa";
import FAQS from "./faqs";
import { useState } from "react";

function Support() {
  const [search, setSearch] = useState("");

  return (
    <section className="w-full">
      {/* HERO */}
      <div className="bg-gradient-to-br from-blue-700 to-purple-700 text-white">
        <div className="container mx-auto text-center py-32 px-4 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">How can we help you?</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl">
            RentMate support is here to help you resolve issues quickly and smoothly.
          </p>

          {/* SEARCH */}
          <div className="max-w-xl mx-auto relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs, guides, and help articles"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      <div><FAQS search={search} /></div>

      {/* CONTACT SUPPORT */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            Contact Support
          </h2>
          <p className="text-md md:text-lg text-gray-600 text-center mt-4 max-w-2xl mx-auto">
            Choose the best way to reach us. Our support team is ready to help you
            resolve issues quickly and efficiently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            
            {/* EMAIL SUPPORT */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transition hover:shadow-xl">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-blue-100 rounded-full mb-4">
                <FaEnvelope size={22} className="text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Email Support
              </h3>
              <p className="text-gray-600 text-md mt-2">
                Send us a detailed message and we’ll respond within 24 hours.
              </p>
              <p className="text-sm text-blue-600 mt-3 font-medium">
                rentmatesupport@gmail.com
              </p>
              <a
                href="mailto:rentmatesupport@gmail.com"
                className="inline-block mt-6 px-14 md:px-20 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Send Email
              </a>
            </div>

            {/* LIVE CHAT */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transition hover:shadow-xl">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-green-100 rounded-full mb-4">
                <FaComments size={22} className="text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Live Chat
              </h3>
              <p className="text-gray-600 text-md mt-2">
                Chat with our support team in real-time during working hours.
              </p>
              <p className="text-sm text-green-600 mt-3 font-medium">
                Mon – Fri, 9:00 AM – 6:00 PM
              </p>
              <a
                href="https://wa.me/254790636213"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-14 md:px-20 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Start Chat
              </a>
            </div>

            {/* SUPPORT TICKET */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transition hover:shadow-xl">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-yellow-100 rounded-full mb-4">
                <FaTicketAlt size={22} className="text-yellow-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Submit a Ticket
              </h3>
              <p className="text-gray-600 text-md mt-2">
                Best for complex issues that need investigation or follow-up.
              </p>
              <p className="text-sm text-yellow-600 mt-3 font-medium">
                Track your ticket anytime
              </p>
              <button
                className="inline-block mt-6 px-14 md:px-20 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
              >
                Create Ticket
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Technical Support Section */}
      <div className="bg-gray-50">
        <h1 className="text-3xl md:text-4xl text-gray-800 text-center font-bold pt-10">Technical Support</h1>
        <p className="text-md text-gray-700 text-center pt-4">Quick solutions for technical issues and platform requirements</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="p-6 rounded-lg bg-white shadow-md">
            <div className="flex mb-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-yellow-100"><FaSyncAlt size={20} className="text-yellow-500"/></div>
              <h2 className="ml-2 text-md md:text-xl font-bold text-gray-800">Troubleshooting Common Issues</h2>
            </div>
            <ul className="text-sm md:text-md text-gray-700 list-disc ml-6 space-y-2">
              <li>Clear your browser cache and cookies.</li>
              <li>Disable browser extensions temporarily.</li>
              <li>Check your internet connection stability.</li>
              <li>Try logging out and back in.</li>
              <li>Update your browser to the latest version.</li>
            </ul>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-md">
            <div className="flex mb-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-yellow-100"><FaDesktop size={20} className="text-yellow-500"/></div>
              <h2 className="ml-2 text-md md:text-xl font-bold text-gray-800">Browser Compatibility</h2>
            </div>
            <ul className="text-sm md:text-md text-gray-700 list-disc ml-6 space-y-2">
              <li>Chrome (recommended) - version 90+</li>
              <li>Firefox (recommended) - version 80+</li>
              <li>Safari (recommended) - version 14+</li>
              <li>Edge (recommended) - version 90+</li>
            </ul>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-md">
            <div className="flex mb-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-yellow-100"><FaMobileAlt size={20} className="text-yellow-500"/></div>
              <h2 className="ml-2 text-md md:text-xl font-bold text-gray-800">Mobile vs Desktop</h2>
            </div>
            <ul className="text-sm md:text-md text-gray-700 list-disc ml-6 space-y-2">
              <li>Full features available on desktop browsers.</li>
              <li>Responsive design works on tablets.</li>
              <li>Some admin features desktop-only.</li>
            </ul>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-md">
            <div className="flex mb-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-yellow-100"><FaExclamationTriangle size={20} className="text-yellow-500"/></div>
              <h2 className="ml-2 text-md md:text-xl font-bold text-gray-800">Reporting Issues</h2>
            </div>
            <ul className="text-sm md:text-md text-gray-700 list-disc ml-6 space-y-2">
              <li>Include screenshots of error messages.</li>
              <li>Note the steps that led to the issue.</li>
              <li>Share your browser and device info.</li>
              <li>Check our status page for outages.</li>
              <li>Submit detailed bug reports via tickets.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security and Privacy Section */}
      <div className="bg-gray-50">
        <h1 className="text-3xl md:text-4xl text-gray-800 text-center font-bold pt-10">Security & Privacy</h1>
        <p className="text-md md:text-lg text-gray-700 text-center pt-4">Your data security is our top priority. Here's how we protect you.</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="p-6 rounded-lg bg-white shadow-md">
            <div className="flex mb-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-100"><FaShieldAlt size={20} className="text-green-500"/></div>
              <h2 className="ml-2 text-lg md:text-xl font-bold text-gray-800">How We Protect Your Data</h2>
            </div>
            <ul className="text-sm md:text-md text-gray-700 list-disc ml-6 space-y-2">
              <li>256-bit SSL encryption for all data transfers.</li>
              <li>SOC 2 Type II certified infrastructure.</li>
              <li>Regular third-party security audits.</li>
              <li>GDPR and CCPA compliant practices.</li>
              <li>Secure data centers with 24/7 monitoring.</li>
              <li>Automatic encrypted backups.</li>
            </ul>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-md">
            <div className="flex mb-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-100"><FaExclamationCircle size={20} className="text-red-500"/></div>
              <h2 className="ml-2 text-lg md:text-xl font-bold text-gray-800">Suspicious Activity Detected?</h2>
            </div>
            <p className="text-base md:text-lg text-gray-700 py-2">If you notice anything unusual with your account, take these steps immediately:</p>
            <ul className="text-sm md:text-md text-gray-700 list-decimal ml-6 space-y-2">
              <li>Change your password immediately</li>
              <li>Enable two-factor authentication</li>
              <li>Review recent account activity</li>
              <li>Check connected devices and sessions</li>
              <li>Contact support if unauthorized access occurred</li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg my-10">
          <div className="flex">
            <div className="h-14 w-14 flex rounded-full bg-yellow-100 items-center justify-center"><FaEye size={20} className="text-yellow-500"/></div>
            <h3 className="ml-3 mt-2 text-lg md:text-xl font-bold text-gray-800">Account Security Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 mt-2 p-6 gap-4">
            <div className="p-3 rounded-lg bg-gray-100">
              <h4 className="text-md text-gray-800 font-bold">Strong Passwords</h4>
              <p className="text-sm text-gray-700">Use 12+ characters with letters, numbers, and symbols</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-100">
              <h4 className="text-md text-gray-800 font-bold">Unique Credentials</h4>
              <p className="text-sm text-gray-700">Never reuse passwords from other services</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-100">
              <h4 className="text-md text-gray-800 font-bold">Enable 2FA</h4>
              <p className="text-sm text-gray-700">Add an extra layer of security to your account</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-100">
              <h4 className="text-md text-gray-800 font-bold">Regular Reviews</h4>
              <p className="text-sm text-gray-700">Check your account activity monthly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
    <div className="bg-blue-50 py-24">
      <form className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl flex flex-col gap-4">
        <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
          <FaLightbulb size={24} className="text-yellow-500" />
        </div>

        <h1 className="text-center text-3xl md:text-4xl font-bold text-gray-800">
          We Value Your Feedback
        </h1>

        <p className="max-w-xl mx-auto text-center text-md md:text-lg text-gray-600">
          Help us improve RentMate! Your ideas and suggestions shape the future of our platform.
        </p>

        <label htmlFor="feedback" className="text-sm font-semibold text-gray-700 mt-4">
          How can we make RentMate better?
        </label>

        <textarea
          id="feedback"
          name="feedback"
          rows={7}
          placeholder="Share your ideas, suggestions, or feedback..."
          className="w-full h-36 text-md border border-gray-300 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />

        <button
          type="submit"
          className="mt-4 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition"
        >
          <FaCommentDots size={20} className="mr-3 inline"/>Submit Feedback
        </button>
      </form>
    </div>

    {/* Contact Section */}
    <div className="text-center text-white bg-gradient-to-br from-blue-600 to-purple-600 py-20 px-4">
      <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-blue-400">
        <FaHeadphonesAlt size={36} />
      </div>

      <h1 className="text-3xl md:text-5xl font-bold mt-6">Still Need Help?</h1>

      <p className="max-w-xl mx-auto mt-4 text-md md:text-lg text-blue-100">
        Our dedicated support team is always ready to assist you.  
        Reach out anytime — we’re here to make your RentMate experience seamless.
      </p>

      <a
        href="tel:+254790636213"
        className="inline-block text-md mt-6 px-10 py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-gray-100 transition"
      >
        Contact Support<FaArrowRight size={14} className="ml-4 inline" />
      </a>
      <div className="flex text-center justify-center mt-6 gap-4">
        <p className="text-sm text-gray-300 mr-4">Average response time: </p>
        <ul className="flex list-disc text-sm text-gray-300 gap-8">
          <li className="text-gray-200 font-bold">Under 4 hours </li>
          <li> Available <span className="text-gray-200 font-bold">24/7</span> for urgent issues</li>
        </ul>
      </div>
    </div>

    </section>
  );
}

export default Support;
