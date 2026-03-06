import {
  PlusCircle,
  DownloadCloud,
  Search,
  Clock,
  Verified,
  Building2,
} from "lucide-react";
import CountUp from "react-countup";
import { useEffect, useRef, useState } from "react";

function AdminProperties() {

  const dropdownRef = useRef(null);

  // properties state
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [error, setError] = useState(null);

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

   // fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/properties/allproperties",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch properties");
        }

        setProperties(data.properties || []);
        setLoadingProperties(false);

      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoadingProperties(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <section className="w-full p-4">
      <div className="p-4">

        {/* Header */}
        <div className="flex items-center justify-between mt-14">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Property Management
            </h1>
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

          <div className="flex items-center rounded-lg bg-blue-50 p-4 shadow-md hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-200">
              <Building2 className="text-blue-500" size={30} />
            </div>

            <div>
              <p className="text-gray-600">Total Properties</p>
              <h2 className="text-2xl font-bold">
                <CountUp end={properties.length} duration={2} />
              </h2>
            </div>
          </div>

          <div className="flex items-center rounded-lg bg-gray-50 p-4 shadow-md hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-300">
              <Verified className="text-gray-800" size={30} />
            </div>

            <div>
              <p className="text-gray-600">Approved</p>
              <h2 className="text-2xl font-bold">
                <CountUp end={200} duration={2} />
              </h2>
            </div>
          </div>

          <div className="flex items-center rounded-lg bg-green-50 p-4 shadow-md hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-green-200">
              <Verified className="text-green-500" size={30} />
            </div>

            <div>
              <p className="text-gray-600">Pending Approval</p>
              <h2 className="text-2xl font-bold">
                <CountUp end={50} duration={2} />
              </h2>
            </div>
          </div>

          <div className="flex items-center rounded-lg bg-red-50 p-4 shadow-md hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-red-200">
              <Clock className="text-red-500" size={30} />
            </div>

            <div>
              <p className="text-gray-600">Cancelled</p>
              <h2 className="text-2xl font-bold">
                <CountUp end={300} duration={2} />
              </h2>
            </div>
          </div>

        </div>

        {/* Search */}
        <div className="mt-10">
          <form className="flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 p-4">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full rounded-lg px-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select className="rounded-lg px-4 py-2 border border-gray-300">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>

            <select className="rounded-lg px-4 py-2 border border-gray-300">
              <option>All Types</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Studio</option>
              <option>Bedsitter</option>
            </select>

          </form>

          {/* Properties Grid */}
          <div className="">
            <div className="border border-gray-300 rounded-lg mt-4 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50">

              {loadingProperties ? (
                <p className="text-gray-500">Loading properties...</p>

              ) : error ? (
                <p className="text-red-500">{error}</p>

              ) : properties.length === 0 ? (
                <p className="text-gray-500">No properties found</p>

              ) : (
                properties.map((property) => (

                  <div
                    key={property.id}
                    className="border rounded-xl p-4 shadow transition bg-white"
                  >

                    <div className="w-full h-40 rounded-lg mb-3 bg-gray-200 flex items-center justify-center overflow-hidden">

                      {property.image_url ? (
                        <img
                          src={`http://localhost:5000/uploads/${property.image_url}`}
                          alt={property.apartment_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <p className="text-gray-500 text-sm">No Image</p>
                      )}

                    </div>

                    <h3 className="text-lg font-semibold text-gray-800">
                      {property.apartment_name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {property.property_type}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {property.city}, {property.area}
                    </p>

                    <p className="text-sm text-gray-800 mt-2 font-semibold">
                      KES {property.monthly_rent?.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-100 hover:scale-105">View Details</button>
                      <button className="px-4 py-2 rounded-lg text-sm font-bold text-gray-50 bg-green-500 hover:bg-green-600 hover:scale-105">Edit</button>
                    </div>

                  </div>
                ))
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default AdminProperties;