import { useEffect, useState } from "react";

function AdminPendingProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProperty, setSelectedProperty] = useState(null);

  // Notification state
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const token = sessionStorage.getItem("token");

  // Fetch pending properties
  const fetchPendingProperties = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/properties/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setProperties(data.properties || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  //Approve Property
  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/properties/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Show success message
      setMessage("Property approved successfully");
      setMessageType("success");

      // Remove from UI
      setProperties(prev => prev.filter(p => p.id !== id));
      setSelectedProperty(null);

      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      setMessage("Failed to approve property");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Reject Property
  const handleReject = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/properties/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Show success message
      setMessage("Property rejected successfully");
      setMessageType("success");

      // Remove from UI
      setProperties(prev => prev.filter(p => p.id !== id));
      setSelectedProperty(null);

      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      setMessage("Failed to reject property");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading)
    return <p className="text-center mt-4">Loading properties...</p>;

  if (error)
    return <p className="text-red-500 text-center">{error}</p>;

  if (properties.length === 0)
    return <p className="text-center mt-4 font-bold text-red-500 text-lg">No pending properties</p>;

  return (
    <>
      {/*NOTIFICATION */}
      {message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white z-50 transition
          ${messageType === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {message}
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 h-[90vh] overflow-y-auto">
        {properties.map((property) => (
          <div key={property.id} className="border rounded-lg p-3 shadow bg-white">

            {/* IMAGE + STATUS */}
            <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden">
              {property.image_url ? (
                <img
                  src={`http://localhost:5000/uploads/Images/${property.image_url}`}
                  className="w-full h-full object-cover"
                  alt={property.apartment_name}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Image
                </div>
              )}

              {/*STATUS BADGE */}
              <span
                className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full capitalize
                ${
                  property.approval_status === "approved"
                    ? "bg-green-100 text-green-700"
                    : property.approval_status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {property.approval_status}
              </span>
            </div>

            {/* INFO */}
            <h3 className="font-semibold mt-2">
              {property.apartment_name}
            </h3>
            <p className="text-gray-500 text-sm">
              {property.city}, {property.area}
            </p>
            <p className="font-bold">
              KES {property.monthly_rent?.toLocaleString()}
            </p>

            {/* BUTTON */}
            <button
              onClick={() => setSelectedProperty(property)}
              className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 relative shadow-lg">

            {/* CLOSE */}
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-3 right-3 text-lg"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-xl font-bold mb-4">
              {selectedProperty.apartment_name}
            </h2>

            {/* IMAGE */}
            <div className="h-60 mb-4 bg-gray-200 rounded">
              {selectedProperty.image_url && (
                <img
                  src={`http://localhost:5000/uploads/Images/${selectedProperty.image_url}`}
                  className="w-full h-full object-cover"
                  alt=""
                />
              )}
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>City:</strong> {selectedProperty.city}</p>
              <p><strong>Area:</strong> {selectedProperty.area}</p>
              <p><strong>Rent:</strong> KES {selectedProperty.monthly_rent}</p>
              <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
              <p><strong>Status:</strong> {selectedProperty.approval_status}</p>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-4">
              <strong>Description:</strong><br />
              {selectedProperty.description || "No description"}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleApprove(selectedProperty.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(selectedProperty.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default AdminPendingProperties;