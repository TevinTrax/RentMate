import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLocationDot,
  FaBed,
  FaBath,
  FaSquare,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

// Fix Leaflet default marker icons in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function PostedViewDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const property = state?.property;

  if (!property) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        No property data found.
      </div>
    );
  }

  // Parse coordinates safely
  const latitude = parseFloat(property.latitude ?? property.lat);
  const longitude = parseFloat(
    property.longitude ?? property.lng ?? property.lon
  );
  const hasValidCoordinates =
    latitude !== null &&
    longitude !== null &&
    !isNaN(latitude) &&
    !isNaN(longitude);

  return (
    <section className="w-full bg-green-50 min-h-screen py-12">
      <div className="container mx-auto px-6">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-green-700 hover:underline font-medium"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Image Section */}
          <div className="w-full h-[450px] bg-gray-200 relative group overflow-hidden">
            {property.image_url ? (
              <img
                src={`http://localhost:5000/uploads/Images/${property.image_url}`}
                alt={property.apartment_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-lg font-medium">
                No Image Available
              </div>
            )}

            {/* Status Badge */}
            <span
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white font-semibold text-sm ${
                property.property_status === "Vacant"
                  ? "bg-green-600"
                  : property.property_status === "Occupied"
                  ? "bg-red-600"
                  : "bg-gray-500"
              }`}
            >
              {property.property_status || "Unknown"}
            </span>
          </div>

          {/* Details Grid */}
          <div className="p-8 grid md:grid-cols-2 gap-10">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-green-800">
                {property.apartment_name}
              </h1>

              <p className="flex items-center gap-2 text-gray-700 font-medium">
                <FaLocationDot className="text-green-600" />
                {property.city}, {property.area}
              </p>

              <h2 className="text-2xl font-semibold text-green-700">
                Ksh {property.monthly_rent?.toLocaleString() || "N/A"}
                <span className="text-gray-500 text-sm"> /month</span>
              </h2>

              {/* Amenities */}
              <div className="flex flex-wrap gap-6 mt-4 text-gray-700">
                <p className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg font-medium">
                  <FaBed className="text-green-600" /> {property.bedrooms || 0} Beds
                </p>
                <p className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg font-medium">
                  <FaBath className="text-green-600" /> {property.bathrooms || 0} Baths
                </p>
                <p className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg font-medium">
                  <FaSquare className="text-green-600" /> {property.size_sqft || "N/A"} sqft
                </p>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {property.description || "No description available."}
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN - Caretaker */}
            <div className="bg-green-50 p-6 rounded-2xl shadow-inner border border-green-100">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Caretaker Details
              </h3>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-green-700 text-white flex items-center justify-center rounded-full text-2xl font-bold">
                  <FaUser />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {property.caretaker_first_name} {property.caretaker_last_name}
                  </p>
                  <p className="text-sm text-gray-600">Caretaker</p>
                </div>
              </div>

              <div className="space-y-3 text-gray-700 text-sm">
                {/* Phone Number */}
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-semibold text-gray-800">
                    <FaPhone className="text-green-600" /> Phone Number
                  </span>
                  <span className="ml-6">{property.caretaker_phone_number || "N/A"}</span>
                </div>

                {/* Alternative Phone Number */}
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-semibold text-gray-800">
                    <FaPhone className="text-green-600" /> Alternative Phone
                  </span>
                  <span className="ml-6">{property.caretaker_alt_phone_number || "N/A"}</span>
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-semibold text-gray-800">
                    <FaEnvelope className="text-green-600" /> Email
                  </span>
                  <span className="ml-6">{property.caretaker_email || "N/A"}</span>
                </div>
              </div>

              <button className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium">
                Contact Caretaker
              </button>
            </div>
          </div>

          {/* Map Section */}
          <div className="px-8 pb-10">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                  <FaLocationDot className="text-green-600" />
                  Property Location
                </h3>
                {hasValidCoordinates && (
                  <a
                    href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>

              {hasValidCoordinates ? (
                <div className="w-full h-[400px]">
                  <MapContainer
                    center={[latitude, longitude]}
                    zoom={16}
                    scrollWheelZoom={true}
                    className="w-full h-full z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[latitude, longitude]}>
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold">{property.apartment_name}</p>
                          <p>{property.city}, {property.area}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">Coordinates:</span> {latitude}, {longitude}
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500">
                  Property location coordinates are not available.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PostedViewDetails;