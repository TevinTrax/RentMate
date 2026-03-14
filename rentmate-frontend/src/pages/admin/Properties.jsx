import {
  PlusCircle,
  PlusSquare,
  Search,
  Clock,
  Verified,
  Building2,
  MapPin,
  Calendar,
  Save,
  ImagePlus,
  Banknote,
  X,
  FileText,
  Download
} from "lucide-react";
import CountUp from "react-countup";
import { useEffect, useRef, useState } from "react";

function AdminProperties() {

  const [openViewDetails, setOpenViewDetails] = useState(false);
  const [openEditProperty, setOpenEditProperty] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const dropdownRef = useRef(null);

  // properties state
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProperty, setShowAddProperty] = useState(false);
  
  const [formData, setFormData] = useState({
    apartment_name: "",
    property_type: "",
    first_name: "",
    last_name: "",
    country: "",
    city: "",
    area: "",
    street_address: "",
    postal_code: "",
    latitude: "",
    longitude: "",
    monthly_rent: "",
    security_deposit: "",
    rent_due_day: "",
    rent_due_type: "ON",
    image_url: null,
    documents: null,
  });

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      const token = sessionStorage.getItem("token"); 
      if (!token) return alert("You must be logged in to add a property.");

      const response = await fetch("http://localhost:5000/api/properties/add", {
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await response.json();

      if (response.ok) {
        alert("Property added successfully!");
        setShowAddProperty(false);
        setFormData({
          apartment_name: "",
          property_type: "",
          first_name: "",
          last_name: "",
          country: "",
          city: "",
          area: "",
          street_address: "",
          postal_code: "",
          latitude: "",
          longitude: "",
          monthly_rent: "",
          security_deposit: "",
          rent_due_day: "",
          rent_due_type: "ON",
          image_url: null,
          documents: null,
        });
        fetchProperties();
      } else {
        alert(result.error || "Failed to add property");
      }
    } catch (err) {
      alert("Network Error: " + err.message);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setFormData(prev => ({ ...prev, latitude, longitude }));
        setLocationLoading(false);
      },
      () => {
        setLocationError("Permission denied or unable to fetch location.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // // close dropdown when clicking outside
  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setOpenMenuId(null);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

   // fetch properties from backend
  const fetchProperties = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/properties/allproperties",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setProperties(data.properties || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProperties(false);
    }
  };

  // fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // handle input changes for both text and file inputs
  const handleChange = (e) => {
    const { id, value, files, type, name } = e.target;
    const key = id || name;

    if (type === "file") {
      setFormData(prev => ({ ...prev, [key]: files[0] }));
    } else if (key === "rent_due_day" || type === "number") {
      setFormData(prev => ({ ...prev, [key]: parseInt(value, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };


  const handleDownload = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/properties/${selectedProperty.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "ownership_document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }
    try {
      const token = sessionStorage.getItem("token"); // assuming JWT stored here
      const response = await fetch(`http://localhost:5000/api/properties/${selectedProperty.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Property deleted successfully!");
        // Optionally refresh the properties list
        fetchProperties();
      } else {
        alert(data.error || "Failed to delete property.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the property.");
    }
  };


  // Edit property form state
const [editFormData, setEditFormData] = useState({
  apartment_name: "",
  property_type: "",
  city: "",
  area: "",
  street_address: "",
  monthly_rent: "",
  security_deposit: "",
  rent_due_day: "",
  rent_due_type: "ON",
  image_url: null,
  documents: null
});

// loading state
const [updatingProperty, setUpdatingProperty] = useState(false);

// handle input changes for edit form
const handleEditChange = (e) => {
  const { name, value, files } = e.target;

  setEditFormData((prev) => ({
    ...prev,
    [name]: files ? files[0] : value
  }));
};

  const handleUpdateProperty = async (e) => {
    e.preventDefault();

    try {
      setUpdatingProperty(true);

      const token = sessionStorage.getItem("token");

      const formData = new FormData();

      Object.entries(editFormData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      const response = await fetch(
        `http://localhost:5000/api/properties/${selectedProperty.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update property");
      }

      alert("Property updated successfully");

      setOpenEditProperty(false);
      fetchProperties();

    } catch (error) {
      alert(error.message);
    } finally {
      setUpdatingProperty(false);
    }
  };

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
              <PlusSquare className="h-4 w-4" />
              Post Property
            </button>

            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
              onClick={() => setShowAddProperty(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Add Property
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

          <div className="flex items-center rounded-lg bg-blue-50 hover:border border-blue-200 p-4 shadow-md hover:scale-105">
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

          <div className="flex items-center rounded-lg bg-gray-50 hover:border border-gray-200 p-4 shadow-md hover:scale-105">
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

          <div className="flex items-center rounded-lg bg-green-50 hover:border border-green-200 p-4 shadow-md hover:scale-105">
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

          <div className="flex items-center rounded-lg bg-red-50 hover:border border-red-200 p-4 shadow-md hover:scale-105">
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
                          src={`http://localhost:5000/uploads/Images/${property.image_url}`}
                          alt={property.apartment_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <p className="text-gray-500 text-sm">No Image</p>
                      )}

                    </div>

                    <h3 className="text-lg font-semibold text-gray-800">
                      {property.apartment_name.charAt(0).toUpperCase() + property.apartment_name.slice(1)}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {property.city.charAt(0).toUpperCase() + property.city.slice(1)}, {property.area.charAt(0).toUpperCase() + property.area.slice(1)}
                    </p>

                    <p className="text-sm text-gray-800 mt-2 font-semibold">
                      KES {property.monthly_rent?.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-100 hover:scale-105" onClick={()=>{setOpenViewDetails(true); setSelectedProperty(property);}}>View Details</button> 
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-bold text-gray-50 bg-green-500 hover:bg-green-600 hover:scale-105"
                        onClick={() => {
                          setSelectedProperty(property);

                          setEditFormData({
                            apartment_name: property.apartment_name || "",
                            property_type: property.property_type || "",
                            city: property.city || "",
                            area: property.area || "",
                            street_address: property.street_address || "",
                            monthly_rent: property.monthly_rent || "",
                            security_deposit: property.security_deposit || "",
                            description: property.description || "",
                            image_url: null,
                            documents: null
                          });

                          setOpenEditProperty(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>

                  </div>
                ))
              )}

            </div>
          </div>

          {openViewDetails && selectedProperty && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative">
                <div className="flex items-center justify-between border-b border-gray-200 py-2">
                  <div>
                    <h1 className="text-xl font-bold text-blue-600">{selectedProperty.apartment_name.charAt(0).toUpperCase() + selectedProperty.apartment_name.slice(1)}</h1>
                    <p className="text-sm text-gray-600">{selectedProperty.manager_first_name.charAt(0).toUpperCase() + selectedProperty.manager_first_name.slice(1)} {selectedProperty.manager_last_name.charAt(0).toUpperCase() + selectedProperty.manager_last_name.slice(1)}</p>
                  </div>
                  <div className="">
                    <button
                      onClick={() => setOpenViewDetails(false)}
                      className="absolute text-gray-500 hover:text-gray-800 p-2 rounded-lg top-6 right-6 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="w-full h-64 mt-4 rounded-lg flex items-center justify-center bg-gray-200">
                  {selectedProperty.image_url ? (
                    <img
                      src={`http://localhost:5000/uploads/Images/${selectedProperty.image_url}`}
                      alt={selectedProperty.apartment_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">No Image</p>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{selectedProperty.apartment_name.charAt(0).toUpperCase() + selectedProperty.apartment_name.slice(1)}</h2>
                    <p className="flex py-1 items-center text-sm text-gray-700"><MapPin size={18} className="mr-2"/>{selectedProperty.city.charAt(0).toUpperCase() + selectedProperty.city.slice(1)}, {selectedProperty.area.charAt(0).toUpperCase() + selectedProperty.area.slice(1)}, {selectedProperty.street_address.charAt(0).toUpperCase() + selectedProperty.street_address.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 ">{selectedProperty.property_type.charAt(0).toUpperCase() + selectedProperty.property_type.slice(1)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-lg font-bold">KES {selectedProperty.monthly_rent?.toLocaleString()}<span className="text-gray-600 text-sm ml-1">/month</span></p>
                    <p className="text-gray-600 text-xs">Security Deposit: KES {selectedProperty.security_deposit?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Rent Due Day: {selectedProperty.rent_due_type},{selectedProperty.rent_due_day}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div></div>
                  <div></div>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm flex items-center">Added:<Calendar size={16} className="ml-2 mr-1"/> {new Date(selectedProperty?.created_at).toLocaleString("en-GB")}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                    >
                      Download Ownership Document
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-red-500 text-sm text-white font-semibold hover:bg-red-600" onClick={handleDelete}>Delete Property</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {openEditProperty && selectedProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">

              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">Edit Property</h1>
                  <p className="text-sm text-gray-500">Update property information</p>
                </div>
                <button
                  onClick={() => setOpenEditProperty(false)}
                  className="text-gray-500 hover:text-gray-800 text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateProperty} className="space-y-4">

                {/* Apartment & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Apartment Name</label>
                    <input
                      type="text"
                      name="apartment_name"
                      value={editFormData.apartment_name}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Property Type</label>
                    <select
                      name="property_type"
                      value={editFormData.property_type}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ring-blue-500"
                    >
                      <option value="">Select type</option>
                      <option value="apartment">Apartment</option>
                      <option value="bedsitter">Bedsitter</option>
                      <option value="studio">Studio</option>
                      <option value="house">House</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={editFormData.city}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Area</label>
                    <input
                      type="text"
                      name="area"
                      value={editFormData.area}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Street Address</label>
                  <input
                    type="text"
                    name="street_address"
                    value={editFormData.street_address}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ring-blue-500"
                  />
                </div>

                {/* Rent & Deposit */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Monthly Rent (KES)</label>
                    <input
                      type="number"
                      name="monthly_rent"
                      value={editFormData.monthly_rent}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Security Deposit</label>
                    <input
                      type="number"
                      name="security_deposit"
                      value={editFormData.security_deposit}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rent Due Day
                    </label>
                    <select
                        name="rent_due_day"
                        value={editFormData.rent_due_day}
                        onChange={handleEditChange}
                        required
                        className="w-full py-2 pr-3 text-sm text-gray-700 bg-transparent border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition"
                    >
                        <option value="" disabled>Select day</option>
                        {[...Array(31)].map((_, i) => (
                            <option key={i+1} value={i+1}>
                                {i+1}
                            </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Rent Due Type */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Rent Due Type</label>
                  <select
                    name="rent_due_type"
                    value={editFormData.rent_due_type}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ring-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="ON">On this day</option>
                    <option value="ON_OR_BEFORE">On or before this day</option>
                    <option value="BEFORE">Before this day</option>
                  </select>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Update Property Image</label>
                    <input
                      type="file"
                      name="image_url"
                      accept="image/*"
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Update Ownership Document (PDF)</label>
                    <input
                      type="file"
                      name="documents"
                      accept="application/pdf"
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpenEditProperty(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingProperty}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {updatingProperty ? "Updating..." : "Update Property"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddProperty &&(
          <div className="w-full inset-0 fixed z-50 flex items-center justify-center bg-black/40">
              <div className="container mx-auto bg-gray-50 rounded-lg shadow-md p-4 max-h-[95vh]">
                  <div className="flex items-center justify-between">
                      <div>
                          <h1 className="text-xl text-gray-800 font-bold">Add Property</h1>
                      </div>
                      <div>
                          <button onClick={() => setShowAddProperty(false)}><X size={24} className="text-red-500 font-bold"/></button>
                      </div>
                  </div>

                  <div className="mt-4">
                      <form className="w-full" onSubmit={handleSubmit}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 overflow-y-scroll max-h-[70vh]">
                              <div className="">
                                  <div className="border border-gray-200 rounded-xl bg-white p-6 space-y-8 shadow-sm">
                                      {/* Header */}
                                      <div className="flex items-center gap-3">
                                          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                              <Building2 size={22} className="text-green-600" />
                                          </div>
                                          <div>
                                              <h2 className="text-lg font-semibold text-gray-800">
                                                  Property Basic Information
                                              </h2>
                                              <p className="text-sm text-gray-500">
                                                  Tell us about your property
                                              </p>
                                          </div>
                                      </div>

                                      {/* Property Info Grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {/* Apartment Name */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Apartment Name
                                              </label>
                                              <input
                                                  id="apartment_name"
                                                  type="text"
                                                  placeholder="Enter your apartment name"
                                                  required
                                                  onChange={handleChange}
                                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                              />
                                          </div>

                                          {/* Property Type */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Property Type
                                              </label>
                                              <select
                                                  id="property_type"
                                                  onChange={handleChange}
                                                  required
                                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                              >
                                                  <option value="">Select property type</option>
                                                  <option value="apartment">Apartment</option>
                                                  <option value="bedsitter">Bedsitter</option>
                                                  <option value="studio">Studio</option>
                                                  <option value="house">House</option>
                                              </select>
                                          </div>
                                      </div>

                                      {/* Divider */}
                                      <div className="border-t border-gray-100 pt-6">
                                          <h3 className="text-sm font-semibold text-gray-800 mb-4">
                                              Property Manager/ Owner Information
                                          </h3>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                              {/* First Name */}
                                              <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                      First Name
                                                  </label>
                                                  <input
                                                      type="text"
                                                      placeholder="Enter first name"
                                                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                                      id="first_name"
                                                      onChange={handleChange}
                                                      required
                                                  />
                                              </div>

                                              {/* Last Name */}
                                              <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                                      Last Name
                                                  </label>
                                                  <input
                                                      type="text"
                                                      placeholder="Enter last name"
                                                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                                      id="last_name"
                                                      onChange={handleChange}
                                                      required
                                                  />
                                              </div>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="border border-gray-200 rounded-xl bg-white p-6 space-y-8 shadow-sm mt-6">
                                      {/* Header */}
                                      <div className="flex items-center gap-3">
                                          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                              <MapPin size={22} className="text-green-600" />
                                          </div>
                                          <div>
                                              <h2 className="text-lg font-semibold text-gray-800">
                                                  Location Details
                                              </h2>
                                              <p className="text-sm text-gray-500">
                                                  Provide the property’s full address and area information
                                              </p>
                                          </div>
                                      </div>

                                      {/* Location Grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                          {/* Country */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Country
                                              </label>
                                              <input
                                                  type="text"
                                                  placeholder="e.g Kenya"
                                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                                  id="country"
                                                  onChange={handleChange}
                                                  required
                                              />
                                          </div>

                                          {/* City */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  City
                                              </label>
                                              <input
                                                  id="city"
                                                  onChange={handleChange}
                                                  type="text"
                                                  placeholder="e.g Nairobi"
                                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                              />
                                          </div>

                                          {/* Area */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Area / Estate
                                              </label>
                                              <input
                                                  id="area"
                                                  onChange={handleChange}
                                                  type="text"
                                                  placeholder="e.g Westlands"
                                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                              />
                                          </div>

                                          {/* Street */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Street Address
                                              </label>
                                              <input
                                                  id="street_address"
                                                  onChange={handleChange}
                                                  type="text"
                                                  placeholder="e.g 45 Ngong Road"
                                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                              />
                                          </div>

                                          {/* Postal Code */}
                                          <div className="md:col-span-1">
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Postal Code
                                              </label>
                                              <input
                                                  id="postal_code"
                                                  onChange={handleChange}
                                                  type="text"
                                                  placeholder="e.g 00100"
                                                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                              />
                                          </div>

                                      </div>

                                      {/* Map Section */}
                                      <div
                                      onClick={handleGetLocation}
                                      className="border border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50 transition cursor-pointer"
                                      >
                                          <MapPin size={28} className="mx-auto text-gray-400 mb-2" />

                                          {locationLoading ? (
                                              <p className="text-sm font-medium text-green-600">
                                                Fetching your live location...
                                              </p>
                                          ) : location ? (
                                              <>
                                                  <p className="text-sm font-semibold text-green-600">
                                                      Location Captured Successfully
                                                  </p>
                                                  <p className="text-xs text-gray-600 mt-1">
                                                      Lat: {location.latitude.toFixed(5)}
                                                  </p>
                                                  <p className="text-xs text-gray-600">
                                                      Lng: {location.longitude.toFixed(5)}
                                                  </p>
                                              </>
                                          ) : (
                                              <>
                                                  <p className="text-sm font-medium text-gray-700">
                                                      Click to get your live location
                                                  </p>
                                                  <p className="text-xs text-gray-500 mt-1">
                                                      Helps tenants find your property faster
                                                  </p>
                                              </>
                                          )}

                                          {locationError && (
                                              <p className="text-xs text-red-500 mt-2">
                                                  {locationError}
                                              </p>
                                          )}
                                      </div>
                                  </div>
                              </div>


                              <div className="">
                                  <div className="border border-gray-200 rounded-xl bg-white p-6 space-y-6 shadow-sm mt-6">
                                      {/* Header */}
                                      <div className="flex items-center gap-3">
                                          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                              <Banknote size={22} className="text-green-600" />
                                          </div>
                                          <div>
                                              <h2 className="text-lg font-semibold text-gray-800">
                                                  Rental Details
                                              </h2>
                                              <p className="text-sm text-gray-500">
                                                  Configure rent, deposit and payment schedule
                                              </p>
                                          </div>
                                      </div>

                                      {/* Pricing Grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                          {/* Monthly Rent */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Monthly Rent
                                              </label>

                                              <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition">
                                                  <span className="px-3 text-gray-500 text-sm font-medium">
                                                  KES
                                                  </span>
                                                  <input
                                                  id="monthly_rent"
                                                  type="number"
                                                  placeholder="0.00"
                                                  className="w-full py-2 pr-3 text-sm text-gray-700 bg-transparent focus:outline-none"
                                                  onChange={handleChange}
                                                  />
                                              </div>
                                          </div>

                                          {/* Security Deposit */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Security Deposit
                                              </label>

                                              <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition">
                                                  <span className="px-3 text-gray-500 text-sm font-medium">
                                                  KES
                                                  </span>
                                                  <input
                                                  id="security_deposit"
                                                  type="number"
                                                  placeholder="0.00"
                                                  className="w-full py-2 pr-3 text-sm text-gray-700 bg-transparent focus:outline-none"
                                                  onChange={handleChange}
                                                  />
                                              </div>
                                          </div>

                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                          {/* Due Day */}
                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Rent Due Day
                                              </label>
                                              <select
                                                  name="rent_due_day"
                                                  value={formData.rent_due_day || ""}
                                                  onChange={handleChange}
                                                  required
                                                  className="w-full py-2 pr-3 text-sm text-gray-700 bg-transparent border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition"
                                              >
                                                  <option value="" disabled>Select day</option>
                                                  {[...Array(31)].map((_, i) => (
                                                      <option key={i+1} value={i+1}>
                                                          {i+1}
                                                      </option>
                                                  ))}
                                              </select>
                                          </div>

                                          <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Rent Due Type
                                              </label>
                                              <select
                                                  name="rent_due_type"
                                                  value={formData.rent_due_type}
                                                  onChange={handleChange}
                                                  className="w-full py-2 pr-3 text-sm text-gray-700 bg-transparent border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition"
                                                  >
                                                  <option value="ON">On this day</option>
                                                  <option value="ON_OR_BEFORE">On or before this day</option>
                                                  <option value="BEFORE">Before this day</option>
                                              </select>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="border border-gray-200 rounded-xl bg-white p-6 space-y-6 shadow-sm mt-6">  
                                      {/* Header */}
                                      <div className="flex items-center gap-3">
                                          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                              <ImagePlus size={22} className="text-green-600" />
                                          </div>
                                          <div>
                                              <h2 className="text-lg font-semibold text-gray-800">
                                                  Property Image
                                              </h2>
                                              <p className="text-sm text-gray-500">
                                                  Upload a clear image of your apartment
                                              </p>
                                          </div>
                                      </div>

                                      {/* Upload Area */}
                                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition duration-200">
                                          <div className="flex flex-col items-center justify-center text-center px-4">
                                              {formData.image_url ? (
                                              <>
                                                  <ImagePlus size={28} className="text-green-500 mb-2" />
                                                  <p className="text-sm font-semibold text-green-600">
                                                      {formData.image_url.name}
                                                  </p>
                                                  <p className="text-xs text-gray-500 mt-1">
                                                      File selected successfully
                                                  </p>
                                              </>
                                              ) : (
                                              <>
                                                  <ImagePlus size={28} className="text-gray-400 mb-2" />
                                                  <p className="text-sm font-medium text-gray-700">
                                                      Click to upload or drag and drop
                                                  </p>
                                                  <p className="text-xs text-gray-500 mt-1">
                                                      PNG, JPG up to 5MB
                                                  </p>
                                              </>
                                              )}
                                          </div>

                                          <input 
                                              id="image_url"
                                              accept="image/png, image/jpeg"
                                              onChange={handleChange}
                                              type="file" 
                                              className="hidden"
                                          />
                                      </label>
                                  </div>

                                  <div className="border border-gray-200 rounded-xl bg-white p-6 space-y-6 shadow-sm mt-6">  
                                      {/* Header */}
                                      <div className="flex items-center gap-3">
                                          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                              <FileText size={22} className="text-green-600" />
                                          </div>
                                          <div>
                                              <h2 className="text-lg font-semibold text-gray-800">
                                                  Documents
                                              </h2>
                                              <p className="text-sm text-gray-500">
                                                  Ownership Docs
                                              </p>
                                          </div>
                                      </div>

                                      {/* Upload Area */}
                                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition duration-200">
                                          <div className="flex flex-col items-center justify-center text-center px-4">
                                              {formData.documents ? (
                                              <>
                                                  <FileText size={28} className="text-green-500 mb-2" />
                                                  <p className="text-sm font-semibold text-green-600">
                                                      {formData.documents.name}
                                                  </p>
                                                  <p className="text-xs text-gray-500 mt-1">
                                                      Document selected successfully
                                                  </p>
                                              </>
                                              ) : (
                                              <>
                                                  <Download size={28} className="text-gray-400 mb-2" />
                                                  <p className="text-sm font-medium text-gray-700">
                                                      Drop PDF here or click to upload
                                                  </p>
                                                  <p className="text-xs text-gray-500 mt-1">
                                                      PDF up to 10MB
                                                  </p>
                                              </>
                                              )}
                                          </div>

                                          <input 
                                              id="documents"
                                              onChange={handleChange}
                                              type="file" 
                                              accept="application/pdf"
                                              className="hidden"
                                          />
                                      </label>
                                  </div>
                              </div>
                          </div>

                          <div className="flex justify-end mt-4 gap-4 border-t border-gray-200 pt-4">
                              <div>
                                  <button type="submit" className="bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200 border border-gray-300">
                                      <Save size={18} className="inline mr-2"/>
                                      Save Draft
                                  </button>
                              </div>
                              <div>
                                  <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                                      Publish Apartment
                                  </button>
                              </div>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      )}
    </section>
  );
}

export default AdminProperties;