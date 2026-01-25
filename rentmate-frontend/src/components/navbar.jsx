
import { useState } from "react";
import { FaUser, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate= useNavigate();

  return (
    <nav className="w-full z-50 bg-white fixed top-0">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <h1 className="flex items-center text-black text-2xl md:text-3xl font-bold">
        <FaHome className="text-blue-600 mr-2" />
        RentMate
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <button className="text-gray-800 text-base hover:text-blue-500 font-semibold" onClick={()=>navigate("/")}>
              Home
            </button>
          </li>
          <li>
            <button className="text-gray-800 text-base hover:text-blue-500 font-semibold" onClick={()=>navigate("/#features")}>
              Features
            </button>
          </li>
          <li>
            <button className="text-gray-800 text-base hover:text-blue-500 font-semibold" onClick={()=>navigate("/pricing")}>
              Pricing
            </button>
          </li>
          <li>
            <button className="text-gray-800 text-base hover:text-blue-500 font-semibold" onClick={()=>navigate("/faqs")}>
              FAQS
            </button>
          </li>
          <li>
            <button className="text-gray-800 text-base hover:text-blue-500 font-semibold" onClick={()=>navigate("/#contact")}>
              Contact
            </button>
          </li>
        </ul>

        {/* Actions (desktop only) */}
        <div className="hidden md:flex items-center space-x-4">
           {/* Buttons */}
            <div className="flex space-x-3">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition" onClick={()=>navigate("/sign-in")}>
                    <span className="font-medium text-gray-800">Sign In</span>
                </button>

                <Link
                  to="/get-started"
                  className="px-4 py-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl font-medium"
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
              <Link
                className="block text-gray-800 text-base hover:text-blue-500 font-semibold"
                to={"/"}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="block text-gray-800 text-base hover:text-blue-500 font-semibold"
                to={"/#features"}
              >
                Features
              </Link>
            </li>
            <li>
              <button
                className="block text-gray-800 text-base hover:text-blue-500 font-semibold"
                onClick={()=>navigate("/pricing")}
              >
                Pricing
              </button>
            </li>
            <li>
              <Link
                href="#"
                className="block text-gray-800 text-base hover:text-blue-500 font-semibold"
                to={"/faqs"}
              >
                FAQS
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block text-gray-800 text-base hover:text-blue-500 font-semibold"
                to={"/#contact"}
              >
                Contact
              </Link>
            </li>


            {/* Actions for mobile */}
            <div className="container mx-auto  grid grid-cols-1 md:grid-cols-2 mt-4 space-x-2">
              <div className="p-4 flex items-center justify-center">
                <button className="w-full md:w-fit px-6 py-2 text-sm md:text-md font-semibold rounded-lg bg-white hover:bg-gray-200 text-gray-800 border" onClick={()=>navigate("/sign-in")}>
                  Sign In
                </button>
              </div>
              <div className="p-4 flex items-center justify-center">
                <button className="w-full md:w-fit px-6 py-2 text-sm md:text-md font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 text-white border" onClick={()=>navigate("/get-started")}>
                  Get Started
                </button>
              </div>
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
