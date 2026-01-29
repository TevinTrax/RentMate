import CountUp from "react-countup";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Building2,
  Wallet2,
  AlertTriangle,
  UserPlus2,
  FileText,
  Bell
} from "lucide-react";

function AdminDashboard() {
  return (
    <section className="w-full p-2">
      <div className="p-4">
        {/* Header */}
        <div className="text-gray-800 pt-16">
          <h1 className="text-3xl font-bold py-2">Welcome back, Tevin</h1>
          <p className="text-md text-gray-700">
            Here's what's happening with RentMate today.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">

          {/* Total Users */}
          <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-blue-50 rounded-lg shadow-md">
            <div className="flex-1">
              <p className="text-gray-700">Total Users</p>
              <h2 className="text-2xl font-bold text-gray-800 py-1">
                <CountUp end={2412} duration={2} separator="," />
              </h2>
              <p className="text-sm text-gray-600">
                <span className="text-green-500 inline-flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +12.5%
                </span>{" "}
                vs last month
              </p>
            </div>
            <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Users size={32} className="text-white" />
            </div>
          </div>

          {/* Total Properties */}
          <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md">
            <div className="flex-1">
              <p className="text-gray-700">Total Properties</p>
              <h2 className="text-2xl font-bold text-gray-800 py-1">
                <CountUp end={1000} duration={2} separator="," />
              </h2>
              <p className="text-sm text-gray-600">
                <span className="text-green-500 inline-flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +8.5%
                </span>{" "}
                vs last month
              </p>
            </div>
            <div className="h-14 w-14 rounded-lg bg-gray-300 flex items-center justify-center">
              <Building2 size={32} className="text-gray-800" />
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-green-50 rounded-lg shadow-md">
            <div className="flex-1">
              <p className="text-gray-700">Monthly Revenue</p>
              <h2 className="text-2xl font-bold text-gray-800 py-1">
                KES{" "}
                <CountUp
                  end={5.8}
                  duration={2}
                  decimals={1}
                  decimal="."
                  suffix="M"
                />
              </h2>
              <p className="text-sm text-gray-600">
                <span className="text-green-500 inline-flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +23.1%
                </span>{" "}
                vs last month
              </p>
            </div>
            <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <Wallet2 size={32} className="text-white" />
            </div>
          </div>

          {/* Pending Payments */}
          <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-yellow-50 rounded-lg shadow-md">
            <div className="flex-1">
              <p className="text-gray-700">Pending Payments</p>
              <h2 className="text-2xl font-bold text-gray-800 py-1">
                KES <CountUp end={819000} duration={2} separator="," />
              </h2>
              <p className="text-sm text-gray-600">
                <span className="text-red-500 inline-flex items-center">
                  <TrendingDown size={16} className="mr-1" /> −12.5%
                </span>{" "}
                vs last month
              </p>
            </div>
            <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
              <AlertTriangle size={32} className="text-white" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 border border-red-500 my-6 gap-4 p-4">
            <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
                <h3 className="text-gray-800 text-lg font-bold">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Building2 size={28} className="text-blue-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Add Property</h4>
                        <p className="text-gray-700 text-sm">List a new rental property</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-300 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><UserPlus2 size={28} className="text-gray-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Register User</h4>
                        <p className="text-gray-700 text-sm">Add Tenant or Landlord</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><FileText size={28} className="text-blue-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Create Report</h4>
                        <p className="text-gray-700 text-sm">Generate analytics report</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Bell size={28} className="text-yellow-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Send Alert</h4>
                        <p className="text-gray-700 text-sm">Broadcast announcement</p>
                    </div>
                </div>                
            </div>
            <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
                <h3 className="text-gray-800 text-lg font-bold">Revenue Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Building2 size={28} className="text-blue-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Add Property</h4>
                        <p className="text-gray-700 text-sm">List a new rental property</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-300 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><UserPlus2 size={28} className="text-gray-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Register User</h4>
                        <p className="text-gray-700 text-sm">Add Tenant or Landlord</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><FileText size={28} className="text-blue-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Create Report</h4>
                        <p className="text-gray-700 text-sm">Generate analytics report</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Bell size={28} className="text-yellow-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Send Alert</h4>
                        <p className="text-gray-700 text-sm">Broadcast announcement</p>
                    </div>
                </div>                
            </div>
            <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
                <h3 className="text-gray-800 text-lg font-bold">Recent Transactions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Building2 size={28} className="text-blue-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Add Property</h4>
                        <p className="text-gray-700 text-sm">List a new rental property</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-300 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><UserPlus2 size={28} className="text-gray-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Register User</h4>
                        <p className="text-gray-700 text-sm">Add Tenant or Landlord</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><FileText size={28} className="text-blue-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Create Report</h4>
                        <p className="text-gray-700 text-sm">Generate analytics report</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Bell size={28} className="text-yellow-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Send Alert</h4>
                        <p className="text-gray-700 text-sm">Broadcast announcement</p>
                    </div>
                </div>                
            </div>
            <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
                <h3 className="text-gray-800 text-lg font-bold">Recent Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Building2 size={28} className="text-blue-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Add Property</h4>
                        <p className="text-gray-700 text-sm">List a new rental property</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-300 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><UserPlus2 size={28} className="text-gray-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Register User</h4>
                        <p className="text-gray-700 text-sm">Add Tenant or Landlord</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><FileText size={28} className="text-blue-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Create Report</h4>
                        <p className="text-gray-700 text-sm">Generate analytics report</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Bell size={28} className="text-yellow-500" /></div>
                        <h4 className="text-gray-800 text-md font-bold py-1">Send Alert</h4>
                        <p className="text-gray-700 text-sm">Broadcast announcement</p>
                    </div>
                </div>                
            </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
