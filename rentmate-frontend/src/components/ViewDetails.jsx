import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLocationDot,
  FaBed,
  FaBath,
  FaSquare,
  FaUser,
} from "react-icons/fa6";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
      <div className="text-center py-20 text-gray-500">
        No property data found.
      </div>
    );
  }

  // Safely parse coordinates from DB (numeric fields)
  const latitude = parseFloat(property.latitude ?? property.lat);
  const longitude = parseFloat(property.longitude ?? property.lng ?? property.lon);

  const hasValidCoordinates =
    latitude !== null &&
    longitude !== null &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  // Optional: debug block (remove in production)
  console.log("PROPERTY DATA:", property);
  console.log("LATITUDE:", latitude, "LONGITUDE:", longitude);

  return (
    <section className="w-full bg-green-50 min-h-screen py-10">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
        >
          <FaArrowLeft /> Back
        </button>

        {/* MAIN CARD */}
        <div className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden">
          {/* IMAGE SECTION */}
          <div className="w-full h-[400px] bg-gray-200">
            {property.image_url ? (
              <img
                src={`http://localhost:5000/uploads/Images/${property.image_url}`}
                alt={property.apartment_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* DETAILS SECTION */}
          <div className="p-8 grid md:grid-cols-2 gap-8">
            {/* LEFT SIDE */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {property.apartment_name}
              </h1>

              <p className="text-gray-600 flex items-center gap-2">
                <FaLocationDot className="text-blue-500" />
                {property.city}, {property.area}
              </p>

              <h2 className="text-2xl font-semibold text-blue-600">
                Ksh {property.monthly_rent?.toLocaleString()}
                <span className="text-sm text-gray-500"> /month</span>
              </h2>

              {/* Amenities */}
              <div className="flex gap-6 text-gray-700 mt-4 flex-wrap">
                <p className="flex items-center gap-2">
                  <FaBed /> {property.bedrooms || 0} Bedrooms
                </p>

                <p className="flex items-center gap-2">
                  <FaBath /> {property.bathrooms || 0} Bathrooms
                </p>

                <p className="flex items-center gap-2">
                  <FaSquare /> {property.size_sqft || "N/A"} sqft
                </p>
              </div>

              {/* Status */}
              <p className="mt-4">
                <span className="font-semibold">Status:</span>{" "}
                <span className="text-blue-600 font-medium">
                  {property.property_status}
                </span>
              </p>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {property.description || "No description available."}
                </p>
              </div>

              {/* Debug block (optional, remove in prod) */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700">
                <p>
                  <strong>Latitude:</strong> {String(property.latitude)}
                </p>
                <p>
                  <strong>Longitude:</strong> {String(property.longitude)}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - CARETAKER */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-inner">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Caretaker Details
              </h3>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl">
                  <FaUser />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    {property.caretaker_first_name} {property.caretaker_last_name}
                  </p>
                  <p className="text-sm text-gray-500">Caretaker</p>
                </div>
              </div>

              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {property.caretaker_phone_number || "N/A"}
                </p>

                <p>
                  <span className="font-medium">Alt Phone No:</span>{" "}
                  {property.caretaker_alt_phone_number || "N/A"}
                </p>
              </div>

              {/* CONTACT BUTTON */}
              <button className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                Contact Caretaker
              </button>
            </div>
          </div>

          {/* MAP SECTION */}
          <div className="px-8 pb-8">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaLocationDot className="text-green-600" />
                  Property Location
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Click and explore where this property is located.
                </p>
              </div>

              {hasValidCoordinates ? (
                <div className="p-5">
                  <div className="w-full h-[400px] rounded-xl overflow-hidden">
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
                            <p>
                              {property.city}, {property.area}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>

                  {/* Coordinates + External Map Button */}
                  <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Coordinates:</span>{" "}
                      {latitude}, {longitude}
                    </div>

                    <a
                      href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Property location coordinates are not available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PostedViewDetails;