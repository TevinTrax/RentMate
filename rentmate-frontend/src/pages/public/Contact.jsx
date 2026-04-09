import {
  FaPaperPlane,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaHeadset,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (feedback.message) {
      setFeedback({ type: "", message: "" });
    }
  };

  const validateForm = () => {
    const { first_name, last_name, email, subject, message } = formData;

    if (!first_name.trim()) return "First name is required.";
    if (!last_name.trim()) return "Last name is required.";
    if (!email.trim()) return "Email address is required.";
    if (!subject.trim()) return "Subject is required.";
    if (!message.trim()) return "Message is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFeedback({
        type: "error",
        message: validationError,
      });
      return;
    }

    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          source_page: "contact_page",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send message.");
      }

      setFeedback({
        type: "success",
        message:
          "Your message has been sent successfully. Our team will get back to you soon.",
      });

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setFeedback({
        type: "error",
        message:
          error.message ||
          "Something went wrong while sending your message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-20 bg-gradient-to-b from-white via-green-50 to-emerald-50 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm border border-green-200">
            We’re Here to Help
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 leading-tight">
          Let’s Talk About Your
          <br />
          <span className="text-green-600">Property Management Needs</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-3xl mx-auto text-center text-base md:text-lg text-gray-600 mt-5 leading-relaxed mb-12">
          Have a question, need support, or want to learn more about RentMate?
          Reach out and our team will get back to you as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: CONTACT FORM */}
          <div className="bg-white/85 backdrop-blur-xl border border-green-100 rounded-3xl shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
              <p className="text-sm md:text-base text-gray-500 mt-2">
                Fill in the form and we’ll respond shortly.
              </p>
            </div>

            {/* Feedback */}
            {feedback.message && (
              <div
                className={`mb-6 flex items-start gap-3 rounded-2xl px-4 py-3 border ${
                  feedback.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <div className="mt-0.5">
                  {feedback.type === "success" ? (
                    <FaCheckCircle size={18} />
                  ) : (
                    <FaExclamationCircle size={18} />
                  )}
                </div>
                <p className="text-sm md:text-base font-medium">
                  {feedback.message}
                </p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* First + Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base font-medium text-gray-800 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full text-sm rounded-2xl px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base font-medium text-gray-800 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full text-sm rounded-2xl px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-800 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full text-sm rounded-2xl px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-800 mb-2">
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full text-sm rounded-2xl px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-800 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full text-sm rounded-2xl px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-800 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  className="w-full text-sm rounded-2xl px-4 py-3 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-none"
                  required
                ></textarea>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl text-sm md:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <FaPaperPlane size={15} />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* RIGHT: CONTACT INFO */}
          <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-3xl shadow-sm text-white p-8 md:p-10 flex flex-col justify-between overflow-hidden">
            {/* Glow accents */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-lime-300/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Top */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-4">
                  <FaHeadset size={14} />
                  Customer Support
                </div>

                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  Get In Touch With RentMate
                </h2>

                <p className="text-sm md:text-base text-white/85 mt-3 leading-relaxed">
                  Whether you're a landlord, tenant, or admin, we’re here to help
                  you get the most out of your property management experience.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-sm flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Office Address</h3>
                    <p className="text-sm text-white/85 mt-1">Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-sm flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                    <FaEnvelope size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Email Us</h3>
                    <a
                      href="mailto:rentmatesupport@gmail.com"
                      className="text-sm text-white/85 hover:text-white hover:underline mt-1 inline-block"
                    >
                      rentmatesupport@gmail.com
                    </a>
                  </div>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-sm flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                    <FaPhone size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Call Us</h3>
                    <a
                      href="tel:+254790636213"
                      className="text-sm text-white/85 hover:text-white hover:underline mt-1 inline-block"
                    >
                      +254 790 636 213
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Support Note */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/20 flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center">
                <FaClock size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base">Fast Response Time</p>
                <p className="text-sm text-white/80">
                  We usually respond within 24 hours on business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;