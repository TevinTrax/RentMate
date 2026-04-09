import { useEffect, useState } from "react";
import { FaHeart, FaLocationDot, FaBed, FaBath, FaSquare, FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Cards() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPostedProperties = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/properties/postedproperties");
      const data = await res.json();
      if (res.ok) setProperties(data.properties || []);
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
    <section className="w-full py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {loading && (
          <p className="col-span-full text-center text-gray-500 text-lg">Loading properties...</p>
        )}

        {!loading && properties.length === 0 && (
          <p className="col-span-full text-center text-red-500 text-lg font-bold">No Posted Properties</p>
        )}

        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 border border-green-100"
          >
            {/* Property Image */}
            <div className="relative w-full h-60">
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
                <p className={`px-3 py-1 text-sm font-semibold rounded-full backdrop-blur-sm ${
                  property.property_status === "Vacant"
                    ? "bg-green-500 text-white"
                    : property.property_status === "Occupied"
                    ? "bg-red-500 text-white"
                    : property.property_status === "On Sale"
                    ? "bg-amber-500 text-white"
                    : "bg-gray-500 text-white"
                }`}>
                  {property.property_status || "Unknown"}
                </p>
                <FaHeart className="text-white bg-black/40 p-2 rounded-full cursor-pointer hover:text-red-500 text-3xl" />
              </div>

              {property.image_url ? (
                <img
                  src={`http://localhost:5000/uploads/Images/${property.image_url}`}
                  alt={property.apartment_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-lg">No Image</div>
              )}
            </div>

            {/* Price */}
            <div className="p-4 border-b border-green-100">
              <h2 className="text-xl font-bold text-gray-800">
                Ksh {property.monthly_rent?.toLocaleString() || "0"}{" "}
                <span className="text-gray-500 text-sm">/month</span>
              </h2>
            </div>

            {/* Details */}
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">{property.apartment_name}</h3>
              <p className="text-gray-600 flex items-center gap-2">
                <FaLocationDot className="text-green-600" /> {property.city}, {property.area}
              </p>

              <div className="flex justify-between text-gray-700 text-sm mt-3">
                <p className="flex items-center gap-1"><FaBed /> {property.bedrooms || 0} Bed</p>
                <p className="flex items-center gap-1"><FaBath /> {property.bathrooms || 0} Bath</p>
                <p className="flex items-center gap-1"><FaSquare /> {property.size_sqft || "N/A"} ft</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                <button
                  className="border border-green-600 text-green-600 px-4 py-2 rounded-xl hover:bg-green-600 hover:text-white transition"
                  onClick={() => navigate("/property-details", { state: { property } })}
                >
                  View Details
                </button>

                <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition">
                  Contact
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All */}
      <div className="text-center mt-10">
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mx-auto bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition"
        >
          View All Properties <FaArrowRight />
        </motion.button>
      </div>
    </section>
  );
}

export default Cards;