import { Building2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Home, CreditCard, FileText, Wrench, Bell, MessageSquare, LifeBuoy } from "lucide-react";
import { Outlet } from "react-router-dom";
import TenantNavbar from "./TenantNavbar";
import { useNavigate } from "react-router-dom";

function TenantLayout() {
    const NavLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 text-sm font-semibold rounded-lg transition
   ${
     isActive
       ? "bg-violet-700 text-gray-100 shadow-sm"
       : "text-gray-300 hover:bg-gray-700 hover:text-gray-200"
   }`;

   const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        navigate("/sign-in");
    };

    return(
        <section className="w-full">
            <div className="flex min-h-screen">
                <aside className="w-72 bg-gray-800 h-screen border-r border-gray-700 flex flex-col fixed top-0">
  
                    {/* Header / Branding */}
                    <div className="p-6 border-b border-gray-700 mx-4">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-violet-700">
                            <Building2 size={20} className="text-gray-100" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-100">RentMate</h1>
                        </div>
                        <p className="text-sm py-1 font-semibold text-gray-400">
                        Tenant Dashboard
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col mx-4 mt-6 space-y-2">
                        <NavLink className={NavLinkClass} to="/tenant/dashboard">
                        <Home size={20} />
                        Dashboard
                        </NavLink>

                        <NavLink className={NavLinkClass} to="/tenant/payments">
                        <CreditCard size={20} />
                        Rent & Payments
                        </NavLink>

                        <NavLink className={NavLinkClass} to="/tenant/lease-documents">
                        <FileText size={20} />
                        Lease & Documents
                        </NavLink>

                        <NavLink className={NavLinkClass} to="/tenant/maintenance">
                        <Wrench size={20} />
                        Maintenance
                        </NavLink>

                        <NavLink className={NavLinkClass} to="/tenant/notifications">
                        <Bell size={20} />
                        Notifications
                        </NavLink>

                        <NavLink className={NavLinkClass} to="/tenant/messages">
                        <MessageSquare size={20} />
                        Messages
                        </NavLink>
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-auto p-4 mx-4 border-t border-gray-700 space-y-2">
                        <button className="w-full px-6 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-2">
                            <LifeBuoy size={20}/>
                        Help & Support
                        </button>

                        <button className="w-full px-6 py-2 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition" onClick={handleLogout}>
                        Logout
                        </button>
                    </div>
                </aside>
                <div className="flex-1 border-6 ml-72 border-green-500">
                    <TenantNavbar/>
                    <main className="flex flex-col h-screen overflow-y-scroll">
                        <Outlet/>
                    </main>
                </div>
            </div>
        </section>
    );
}

export default TenantLayout;