import {
  PlusCircle,
  DownloadCloud,
  Search,
  Clock,
  Verified,
  Building2,
  MoreHorizontal,
  Eye,
  BookDown,
  RefreshCw,
  Flag,
} from "lucide-react";
import CountUp from "react-countup";
import { useEffect, useRef, useState } from "react";

function AdminProperties() {
  // stores the ID of the open dropdown (null = none open)
  const [openMenuId, setOpenMenuId] = useState(null);
  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // toggle dropdown for a specific row
  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // Sample data for the table — you can replace this with real data
  const properties = [
    {
      id: 1,
      name: "Oxygen House",
      owner: "Echakara Tevin",
      type: "Apartment",
      address: "Zimmerman",
      plan: "Basic",
      status: "Approved",
    },
    // Add more properties here if needed
  ];

  return (
    <section className="w-full p-4">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mt-14">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Property Management</h1>
            <p className="py-1 text-gray-600">
              Manage all property listings on the platform
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium hover:bg-gray-200">
              <DownloadCloud className="h-4 w-4" />
              Export
            </button>

            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
              <PlusCircle className="h-4 w-4" />
              Add Property
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Properties */}
          <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-200">
              <Building2 className="text-blue-500" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Total Properties</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={550} duration={2} separator="," />
              </h2>
            </div>
          </div>

          {/* Approved */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-300">
              <Verified className="text-gray-800" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Approved</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={200} duration={2} separator="," />
              </h2>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-green-200">
              <Verified className="text-green-500" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Pending Approval</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={50} duration={2} />
              </h2>
            </div>
          </div>

          {/* Cancelled */}
          <div className="flex items-center justify-between rounded-lg bg-red-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-red-200">
              <Clock className="text-red-500" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Cancelled</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={300} duration={2} />
              </h2>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-10 p-4">
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
                {properties.map((property) => (
                  <tr key={property.id} className="transition hover:bg-gray-50">
                    <td className="p-3">{property.name}</td>
                    <td className="p-3">{property.owner}</td>
                    <td className="p-3">{property.type}</td>
                    <td className="p-3">{property.address}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                        {property.plan}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                        {property.status}
                      </span>
                    </td>
                    <td className="p-3 relative">
                      <button
                        onClick={() => toggleMenu(property.id)}
                        className="rounded p-1 hover:bg-gray-100"
                      >
                        <MoreHorizontal />
                      </button>

                      {openMenuId === property.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 top-10 z-50 w-44 rounded-lg border bg-white shadow-lg origin-top-right animate-dropdown"
                        >
                          <button className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100">
                            <Eye size={16} /> View details
                          </button>
                          <button className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100">
                            <BookDown size={16} /> Approve
                          </button>
                          <button className="flex w-full items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50">
                            <RefreshCw size={16} /> Edit
                          </button>
                          <button className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50">
                            <Flag size={16} /> Decline
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminProperties;