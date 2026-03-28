import { useNavigate } from "react-router-dom";

function Advert() {
  const navigate = useNavigate();

  return (
    <section className="w-full relative bg-gradient-to-br from-green-600 to-green-500 py-20 overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-24 translate-y-24"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1 className="max-w-xl mx-auto text-3xl md:text-4xl font-bold text-white leading-tight pt-12">
          Ready to Simplify Your Property Management?
        </h1>

        <p className="max-w-2xl mx-auto text-white text-md md:text-lg pt-4 leading-relaxed">
          Join thousands of property managers who have already transformed their rental business. 
          Start your free trial today, no credit card required.
        </p>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/free-trial")}
            className="bg-white text-green-700 font-semibold px-10 py-3 md:px-12 md:py-4 rounded-full text-md md:text-lg hover:bg-green-50 transition-transform transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            Start Your Free 14-Day Trial
          </button>
        </div>

        <ul className="flex flex-col sm:flex-row justify-center items-center text-sm text-white/90 list-disc gap-4 sm:gap-8 pt-4 pb-14">
          <li>Setup in 5 minutes</li>
          <li>No credit card needed</li>
          <li>Cancel anytime</li>
        </ul>
      </div>
    </section>
  );
}

export default Advert;