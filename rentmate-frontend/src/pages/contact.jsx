import { FaPaperPlane, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  return (
    <section id="contact" className="w-full py-5 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-semibold text-center text-gray-800 mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 text-center mb-10">
          We'd love to hear from you! Send us your questions or feedback.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Contact Form */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <form className="space-y-5">
              <div>
                <label className="block text-md text-gray-800 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-md text-gray-800 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-md text-gray-800 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help you?"
                  className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-md text-gray-800 mb-2">Message</label>
                <textarea
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                <FaPaperPlane size={16} />
                Send Message
              </button>
            </form>
          </div>

          {/* Right: Contact Info */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-md text-white p-10 flex flex-col space-y-4 justify-center">
            <h2 className="text-2xl font-semibold">Get In Touch</h2>

            <div className="flex items-start gap-4">
              <FaMapMarkerAlt size={24} className="mt-1" />
              <div>
                <h3 className="text-lg font-medium">Office Address</h3>
                <p>Nairobi, Kenya</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaEnvelope size={22} className="mt-1" />
              <div>
                <h3 className="text-lg font-medium">Email Us</h3>
                <a href="mailto:rentmatesupport@gmail.com" className="hover:underline">
                  rentmatesupport@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaPhone size={22} className="mt-1" />
              <div>
                <h3 className="text-lg font-medium">Call Us</h3>
                <a href="tel:+254790636213" className="hover:underline">
                  +254 790 636 213
                </a>
              </div>
            </div>

            <hr className="border-white/30" />

            <p className="text-sm">
              Our support team typically responds within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
