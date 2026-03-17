import { useEffect, useState } from "react";
import { FaHeart, FaLocationDot, FaBed, FaBath, FaSquare, FaArrowRight } from "react-icons/fa6";

function Cards() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPostedProperties = async () => {
    try {

      const res = await fetch(
        "http://localhost:5000/api/properties/postedproperties"
      );

      const data = await res.json();

      if (res.ok) {
        setProperties(data.properties || []);
      }

    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostedProperties();
  }, []);

  return (
    <section className="w-full py-10 bg-gray-50">

      <div className="container mx-auto px-6">

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 text-lg">
            Loading properties...
          </p>
        )}

        {/* No properties */}
        {!loading && properties.length === 0 && (
          <p className="text-center text-gray-500 text-lg font-medium">
            No Posted Properties
          </p>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {properties.map((property) => (

            <div
              key={property.id}
              className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-lg transition duration-300"
            >

              {/* Property Image */}
              <div className="w-full h-56 bg-gray-200 overflow-hidden relative">
                {/* Overlay (Status + Heart) */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">

                  <p
                    className={`px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm ${
                      property.approval_status === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {property.approval_status || "Unknown"}
                  </p>

                  <FaHeart className="text-white bg-black/40 p-2 rounded-full cursor-pointer hover:text-red-500 text-3xl" />

                </div>
                {/* Property Image */}
                {property.image_url ? (
                  <img
                    src={`http://localhost:5000/uploads/Images/${property.image_url}`}
                    alt={property.apartment_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Top Section */}
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold mt-2 text-gray-800">
                  Ksh {property.monthly_rent?.toLocaleString() || "0"}
                  <span className="text-gray-500 text-sm"> /month</span>
                </h2>
              </div>

              {/* Bottom Section */}
              <div className="p-4 space-y-3">

                <h3 className="text-lg font-semibold text-gray-900">
                  {property.apartment_name}
                </h3>

                <p className="text-gray-600 text-md flex items-center gap-2">
                  <FaLocationDot className="text-blue-500" />
                  {property.city}, {property.area}
                </p>

                {/* Amenities */}
                <div className="flex justify-between text-gray-700 text-sm mt-3">

                  <p className="flex items-center gap-1">
                    <FaBed /> {property.bedrooms || 0} Bed
                  </p>

                  <p className="flex items-center gap-1">
                    <FaBath /> {property.bathrooms || 0} Bath
                  </p>

                  <p className="flex items-center gap-1">
                    <FaSquare /> {property.size_sqft || "N/A"} ft
                  </p>

                </div>

                {/* Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">

                  <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition">
                    View Details
                  </button>

                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Contact
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* View All Button */}
        <div className="text-center mt-10">

          <button className="flex items-center mx-auto gap-2 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white px-6 py-3 rounded-lg hover:opacity-90 transition">

            View All Properties <FaArrowRight />

          </button>

        </div>

      </div>

    </section>
  );
}

export default Cards;