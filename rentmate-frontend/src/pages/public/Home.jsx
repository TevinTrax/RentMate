import {ArrowRight} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import bgImage from '@/assets/images/img2.jpg';

function Home() {

  // Scroll to section if URL contains hash
  const location = useLocation();
  useEffect(()=>{
    if (location.hash) {
      // Scroll to the element with the ID that matches the hash
      const element= document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({behavior: 'smooth' });
      }
    }
  }, [location]);
  const navigate= useNavigate();
  return (
    <section className="w-full pt-24 bg-cover bg-center"  style={{
        backgroundImage: `
          linear-gradient(to right,
            rgba(255,255,255,0.87),
            rgba(255,255,255,0.13)
          ),
          url(${bgImage})
        `,
      }}>
      <div className="container mx-auto p-6">
        {/* Trusted Badge */}
        <div className="max-w-sm bg-blue-300 rounded-2xl shadow-md text-center p-2 mt-5 md:mt-10 mb-3">
          <h2 className="text-sm md:text-base text-blue-600 font-bold">Trusted by 10,000+ Property Owners</h2>
        </div>

        {/* Heading */}
        <div className="max-w-2xl text-left mb-3">
          <h3 className="text-5xl md:text-6xl font-bold text-gray-800 p-3">
            Simplify Your <br />
            <span className="text-blue-500">Rental Business</span>
          </h3>
        </div>

        {/* Subheading */}
        <div className="max-w-2xl mb-6">
          <p className="text-md md:text-xl text-gray-600">
            Streamline property management, automate rent collection, and provide exceptional tenant experiences with our all-in-one platform.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-6">
          <button className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-purple-500 text-white px-10 py-3 rounded-lg font-medium hover:bg-blue-700 transition min-w-[250px] w-full sm:w-auto" onClick={()=> navigate("/free-trial")}>
            Start Free Trial
            <ArrowRight size={20} className="font-semibold" />
          </button>
        </div>


        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mt-8 mb-4 md:mb-6">
          <div className="text-center">
            <h4 className="text-3xl font-bold text-blue-500">99.9%</h4>
            <p className="text-gray-700 text-sm">Uptime</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-bold text-blue-500">24/7</h4>
            <p className="text-gray-700 text-sm">Support</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-bold text-blue-500">15 min</h4>
            <p className="text-gray-700 text-sm">Setup Time</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
