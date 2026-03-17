import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";

function AdminPendingProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingProperties = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login as Admin.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/properties/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setProperties(data.properties || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-4">Loading properties...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-4">{error}</p>;
  if (properties.length === 0)
    return <p className="text-center text-gray-500 mt-4">No pending properties</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      {properties.map((property) => (
        <div
          key={property.id}
          className="border rounded-lg p-3 shadow bg-white relative"
        >
            {/* Image Section */}
            <div className="relative w-full h-40 mb-3 bg-gray-200 overflow-hidden rounded-lg">

                {property.image_url ? (
                    <img
                    src={`http://localhost:5000/uploads/Images/${property.image_url}`}
                    alt={property.apartment_name}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    No Image Available
                    </div>
                )}

                {/* Approval Status Badge */}
                <span
                    className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full capitalize shadow
                    ${
                        property.approval_status === "approved"
                        ? "bg-green-100 text-green-700"
                        : property.approval_status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : property.approval_status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }
                    `}
                >
                    {property.approval_status}
                </span>

            </div>

          {/* Property Info */}
          <h3 className="font-semibold text-lg">{property.apartment_name}</h3>
          <p className="text-gray-500">{property.city}, {property.area}</p>
          <p className="text-gray-800 font-bold mt-1">
            KES {property.monthly_rent?.toLocaleString() || 0}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-3">
            <button className="bg-green-600 text-white px-4 py-1 text-sm rounded-lg hover:bg-green-700">
              View Details
            </button>
            <button className="bg-red-600 text-white px-4 py-1 text-sm rounded-lg hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminPendingProperties;