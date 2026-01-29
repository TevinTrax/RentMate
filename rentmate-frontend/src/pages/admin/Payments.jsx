import {
  LineChart,
  DownloadCloud,
  Search,
  Clock,
  Verified,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet2,
  Users2
} from "lucide-react";
import CountUp from "react-countup";
import PaymentsNavbar from "./PaymentsNavbar";
import { Outlet } from "react-router-dom";

function AdminPayments() {
  return (
    <section className="w-full p-4">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mt-14">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Payments & Finance Management
            </h1>
            <p className="py-2 text-gray-600">
              Overview of all financial activity across the RentMate platform
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium hover:bg-gray-200">
              <DownloadCloud className="h-4 w-4" />
              Export
            </button>

            <button className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-700">
              <LineChart className="h-4 w-4" />
              View Analytics
            </button>
          </div>
        </div>

        <div className="mt-3 text-gray-800 text-lg font-bold">
            <h2>Finance Overview</h2>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-5 shadow-sm transition-transform duration-300 hover:scale-[1.03]">
  
                {/* Top Section */}
                <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-200">
                    <DollarSign className="text-blue-600" size={28} />
                    </div>

                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <TrendingUp size={16} />
                    <span>12.5%</span>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                    <p className="text-sm text-gray-600">Total Platform Revenue</p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-800">
                     KES <CountUp end={28.5} duration={2} decimals={1} suffix="M" />
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">vs last month</p>
                </div>
            </div>


          {/* Tenants */}
            <div className="rounded-lg bg-gray-50 border border-gray-300 p-4 shadow-md transition hover:scale-105">
              {/* Top Section */}
                <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200">
                    <Verified className="text-gray-800" size={28} />
                    </div>

                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <TrendingUp size={16} />
                    <span>12.5%</span>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                    <p className="text-sm text-gray-600">Completed Payouts</p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-800">
                     KES <CountUp end={14.8} duration={2} decimals={1} suffix="M" />
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">vs last month</p>
                </div>
            </div>

          {/* Landlords */}
            <div className="rounded-lg bg-yellow-50 border border-yellow-300 p-4 shadow-md transition hover:scale-105">
                {/* Top Section */}
                <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-yellow-200">
                    <Wallet2 className="text-yellow-600" size={28} />
                    </div>

                    <div className="flex items-center gap-1 text-sm font-semibold text-red-600">
                    <TrendingDown size={16} />
                    <span>12.5%</span>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                    <p className="text-sm text-gray-600">Pending Payouts</p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-800">
                    KES<CountUp end={1.2} duration={2} decimals={1} suffix="M" />
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">vs last month</p>
                </div>
            </div>

          {/* Pending Approval */}
            <div className="rounded-lg bg-green-50 border border-green-300 p-4 shadow-md transition hover:scale-105">
                {/* Top Section */}
                <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-green-200">
                    <Users2 className="text-green-600" size={28} />
                    </div>

                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <TrendingUp size={16} />
                    <span>12.5%</span>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                    <p className="text-sm text-gray-600">Active Subscriptions</p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-800">
                    <CountUp end={820} duration={2}/>
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">vs last month</p>
                </div>
            </div>
        </div>

        <div className="mt-8 p-4 border border-green-500">
            <PaymentsNavbar />
            <div className="">
                <Outlet />
            </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-5 p-4">
          <form className="flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full rounded-lg px-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select className="rounded-lg px-4 py-2 text-gray-800 border border-gray-300">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>

            <select className="rounded-lg px-4 py-2 text-gray-800 border border-gray-300">
              <option>All Types</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Studio</option>
              <option>Bedsitter</option>
            </select>
          </form>

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Property Name</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr className="transition hover:bg-gray-50">
                  <td className="p-3">Oxygen House</td>
                  <td className="p-3">Echakara Tevin</td>
                  <td className="p-3">Apartment</td>
                  <td className="p-3">Zimmerman</td>
                  <td className="p-3">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      Basic
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      Approved
                    </span>
                  </td>
                  <td className="p-3 space-x-3">
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPayments;
