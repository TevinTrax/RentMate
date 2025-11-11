
import { useState } from "react";
import { FaUser, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate= useNavigate();

  return (
    <nav className="w-full z-50 bg-white shadow-md fixed top-0">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <h1 className="flex items-center text-black text-2xl md:text-3xl font-bold">
        <FaHome className="text-blue-600 mr-2" />
        RentMate
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <a href="#" className="text-gray-800 text-base hover:text-blue-500" onClick={()=>navigate("/")}>
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-800 text-base hover:text-blue-500" onClick={()=>navigate("/features")}>
              Features
            </a>
          </li>
          <li>
            <Link className="text-gray-800 text-base hover:text-blue-500" to={"/pricing"}>
              Pricing
            </Link>
          </li>
          <li>
            <a href="#" className="text-gray-800 text-base hover:text-blue-500">
              FAQS
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-800 text-base hover:text-blue-500">
              Contact
            </a>
          </li>
        </ul>

        {/* Actions (desktop only) */}
        <div className="hidden md:flex items-center space-x-4">
           {/* Buttons */}
            <div className="flex space-x-3">
                <button className="flex items-center px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition" onClick={()=>navigate("/sign-in")}>
                    <span className="font-medium text-gray-800">Sign In</span>
                </button>

                <Link
                  to="/get-started"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                >
                  Get Started
                </Link>

            </div>
        </div>


        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border rounded-lg hover:bg-gray-100"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <a
                href="#"
                className="block text-gray-800 text-base hover:text-blue-500"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-gray-800 text-base hover:text-blue-500"
              >
                Properties
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-gray-800 text-base hover:text-blue-500"
              >
                Tenants
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block text-gray-800 text-base hover:text-blue-500"
              >
                Payments
              </a>
            </li>


            {/* Actions for mobile */}
            <div className="flex items-center justify-around mt-4 space-x-2">
              <div className="h-10 w-10 border hover:bg-orange-400 rounded-xl"></div>
              <div className="h-10 w-10 border hover:bg-orange-400 rounded-xl"></div>
              <div className="h-10 w-24 border flex items-center justify-center rounded-xl">
                Button
              </div>
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
