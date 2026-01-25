import { Outlet } from "react-router-dom";
import { Home, Users, Building, CreditCard, FileText, Settings,User } from "lucide-react";

function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 text-gray-800 border-2 border-gray-200">
        <div className="p-8 border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold text-blue-500">Rentmate</h2>
            <p className="text-md text-gray-700">Admin Dashboard</p>
        </div>

        <nav className="flex-grow space-y-4 p-6 py-8 border-b-2 border-gray-200 text-md font-bold">
          <a href="/admin/dashboard" className="block text-gray-50 bg-blue-500 px-4 py-2 rounded-lg shadow-md">
            <Home className="inline-block mr-2" size={20} />
            Dashboard
          </a>
          <a href="/admin/users" className="block hover:text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-lg">
            <Users className="inline-block mr-2" size={20} />
            Users
          </a>
          <a href="/admin/properties" className="block hover:text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-lg">
            <Building className="inline-block mr-2" size={20} />
            Properties
          </a>
          <a href="/admin/payments" className="block hover:text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-lg">
            <CreditCard className="inline-block mr-2" size={20} />
            Payments
          </a>
            <a href="/admin/reports" className="block hover:text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-lg">
            <FileText className="inline-block mr-2" size={20} />
            Reports
            </a>
            <a href="/admin/settings" className="block hover:text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-lg">
            <Settings className="inline-block mr-2" size={20} />
            Settings
            </a>
        </nav>
        <div className="flex items-center p-4 border-t border-gray-200">
          <div className="h-14 w-14 rounded-full bg-gray-300 flex items-center justify-center">
            <User size={28} className="text-gray-500" />
          </div>
          <div className="flex-1 ml-2">
            <h1 className="text-md font-bold">Admin User</h1>
            <a href="mailto:adminuser@gmail.com" className="text-sm text-gray-700">
              adminuser@gmail.com
            </a>
          </div>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
