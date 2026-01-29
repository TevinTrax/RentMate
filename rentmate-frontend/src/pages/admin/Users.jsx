import {
  UserPlus2,
  DownloadCloud,
  Search,
  TrendingUp,
  Users,
  Clock,
  Verified,
} from "lucide-react";
import CountUp from "react-countup";

function AdminUsers() {
  return (
    <section className="w-full p-4">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mt-14">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              User Management
            </h1>
            <p className="py-1 text-gray-600">
              Manage tenants, landlords, and administrators
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium hover:bg-gray-200">
              <DownloadCloud className="h-4 w-4" />
              Export
            </button>

            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
              <UserPlus2 className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <Users className="text-white" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Total Users</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={2412} duration={2} separator="," />
              </h2>
            </div>
          </div>

          {/* Tenants */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-300">
              <Verified className="text-gray-800" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Tenants</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={2000} duration={2} separator="," />
              </h2>
            </div>
          </div>

          {/* Landlords */}
          <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-700">
              <Verified className="text-white" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Landlords</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={412} duration={2} />
              </h2>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700">
              <Clock className="text-white" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Pending Approval</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={50} duration={2} />
              </h2>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-10 rounded-lg bg-gray-50 p-4">
          <form className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full rounded-lg px-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select className="rounded-lg px-4 py-2 text-gray-800 border border-gray-300">
              <option>Filter by Role</option>
              <option>Tenant</option>
              <option>Landlord</option>
              <option>Admin</option>
            </select>

            <select className="rounded-lg px-4 py-2 text-gray-800 border border-gray-300">
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </form>

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr className="transition hover:bg-gray-50">
                  <td className="p-3">John Doe</td>
                  <td className="p-3">john.doe@example.com</td>
                  <td className="p-3">+1234567890</td>
                  <td className="p-3">Tenant</td>
                  <td className="p-3">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="p-3">2023-01-15</td>
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

export default AdminUsers;
