import { Phone, Mail, MapPin, ArrowUp, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Building2 } from "lucide-react";
import { Link } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200 p-8">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-10 mb-10">
        
        {/* About */}
        <div>
          <h1 className="flex items-center text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4"><Building2 className="text-white mr-2" size={28} />RentMate</h1>
          <p className="text-white/80 text-md leading-relaxed">
            Simplifying property management with innovative solutions 
            for landlords, tenants, and property managers worldwide.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4 md:mt-6">
            <a href="#" aria-label="Facebook" className="hover:text-blue-500 mr-2"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-sky-400 mr-2"><Twitter size={20} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-400 mr-2"><Linkedin size={20} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500 mr-2"><Instagram size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-4">Quick Links</h1>
          <ul className="space-y-1 md:space-y-3">
            <li>
              <button className="text-left text-md text-white/80 hover:text-white" onClick={()=>navigate("/#features")}>
                Features
              </button>
            </li>
            <li>
              <button className="text-left text-md text-white/80 hover:text-white" onClick={()=>navigate("/pricing")}>
                Pricing
              </button>
            </li>
            <li>
              <button className="text-left text-md text-white/80 hover:text-white" onClick={()=>navigate("/#faqs")}>
                FAQS
              </button>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-4">Company</h1>
          <ul className="space-y-1 md:space-y-3">
            <li>
              <button className="text-left text-md text-white/80 hover:text-white" onClick={()=>navigate("/aboutus")}>
                About
              </button>
            </li>
            <li>
              <button className="text-left text-md text-white/80 hover:text-white" onClick={()=>navigate("/#contact")}>
                Contact
              </button>
            </li>
            <li>
              <button className="text-left text-md text-white/80 hover:text-white" onClick={()=>navigate("/support")}>
                Support
              </button>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-white mb-4">Contact Us</h1>
          <div className="flex items-center gap-2 text-white/80 text-md mt-2">
            <MapPin size={16} /> Nairobi, Zimmerman
          </div>
          <a href="tel:+254790636213" className="flex items-center gap-2 text-white/80 hover:text-white text-md mt-2">
            <Phone size={16} /> 0790 636 213
          </a>
          <a href="mailto:tevintrax@gmail.com" className="flex items-center gap-2 text-white/80 hover:text-white text-md mt-2">
            <Mail size={16} /> tevintrax@gmail.com
          </a>
        </div>       
      </div>

      <hr className="border-white/20 my-6" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-white/70">
        
        {/* Copyright */}
        <p>© {new Date().getFullYear()} RentMate. All rights reserved.</p>

        {/* Links + Social */}
        <div className="flex flex-col md:flex-row items-center gap-6 mt-4 md:mt-0">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>

          {/* Back to Top */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1 hover:text-white mt-4 md:mt-0"
          >
            <ArrowUp size={16} /> Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
