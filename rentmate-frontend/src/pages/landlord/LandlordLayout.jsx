import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  Home,
  Users,
  Wallet2,
  Bell,
  Files,
  Settings,
  LogOut,
  LifeBuoy,
} from "lucide-react";
import LandlordNavbar from "./LandlordNavbar";
import { useEffect, useState } from "react";

function LandlordLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");

    navigate("/sign-in");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 gap-2 text-sm font-semibold rounded-lg transition
     ${
       isActive
         ? "bg-green-600 text-white shadow-md"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

  return (
    <section className="w-full">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 p-4 bg-gray-800 fixed h-screen flex flex-col">
            {/* Logo */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-500">
                        <Building2 size={22} className="text-white" />
                    </div>
                    <h1 className="ml-2 text-2xl font-bold text-white">RentMate</h1>
                </div>
                <p className="text-gray-300 text-sm font-semibold mt-1">
                Landlord Dashboard
                </p>
            </div>

          {/* Navigation */}
            <nav className="mt-4 space-y-2 flex-1 overflow-y-auto">
                <NavLink to="/landlord/dashboard" className={navLinkClass}>
                <Home size={18} />
                Dashboard
                </NavLink>

                <NavLink to="/landlord/users" className={navLinkClass}>
                <Users size={18} />
                Users
                </NavLink>

                <NavLink to="/landlord/properties" className={navLinkClass}>
                <Building2 size={18} />
                Properties
                </NavLink>

                <NavLink to="/landlord/payments" className={navLinkClass}>
                <Wallet2 size={18} />
                Payments & Subscription
                </NavLink>

                <NavLink to="/landlord/notification" className={navLinkClass}>
                <Bell size={18} />
                Notifications
                </NavLink>

                <NavLink to="/landlord/reports" className={navLinkClass}>
                <Files size={18} />
                Reports
                </NavLink>

                <NavLink to="/landlord/settings" className={navLinkClass}>
                <Settings size={18} />
                Settings
                </NavLink>
            </nav>

          {/* Bottom Section */}
            <div className="space-y-2 pt-4 border-t border-gray-700">
                <NavLink to="/landlord/support" className={navLinkClass}>
                <LifeBuoy size={18} />
                Help & Support
                </NavLink>

                <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg font-semibold gap-2 flex items-center transition"
                >
                <LogOut size={18} />
                Logout
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 min-h-screen bg-gray-50">
          <LandlordNavbar />
          <div className="">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
}

export default LandlordLayout;
