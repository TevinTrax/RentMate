import { Outlet, NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Building2,
  CreditCard,
  FileText,
  Settings,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-semibold transition
   ${
     isActive
       ? "bg-blue-500 text-white shadow-md"
       : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
   }`;

function AdminLayout() {
  const navigate= useNavigate();

  const handleLogout= ()=>{
    // remove the token and role from localstorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // redirect user to sign in page
    navigate("/sign-in")
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed flex h-screen w-64 flex-col border-r border-gray-200 bg-gray-50">
        {/* Brand */}
        <div className="border-b border-gray-200 p-8">
          <h2 className="flex items-center text-2xl font-bold text-blue-500">
            <Building2 className="mr-2" size={24} />
            RentMate
          </h2>
          <p className="text-sm text-gray-600">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          <NavLink to="/admin/dashboard" className={navLinkClass}>
            <Home size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className={navLinkClass}>
            <Users size={18} />
            Users
          </NavLink>

          <NavLink to="/admin/properties" className={navLinkClass}>
            <Building2 size={18} />
            Properties
          </NavLink>

          <NavLink to="/admin/payments" className={navLinkClass}>
            <CreditCard size={18} />
            Payments
          </NavLink>

          <NavLink to="/admin/reports" className={navLinkClass}>
            <FileText size={18} />
            Reports
          </NavLink>

          <NavLink to="/admin/notifications" className={navLinkClass}>
            <Bell size={18} />
            Notifications
          </NavLink>

          <NavLink to="/admin/settings" className={navLinkClass}>
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
              <User size={22} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-gray-600 truncate">
                adminuser@gmail.com
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg
                       px-4 py-2 text-sm font-semibold text-red-600 transition
                       hover:bg-red-100 hover:text-red-700"
                       onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex flex-1 flex-col">
        <AdminNavbar />
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;