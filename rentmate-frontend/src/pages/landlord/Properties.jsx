import { 
  PlusSquare, Building2, X, Clock, Search, MoreHorizontal, ImagePlus, 
  MapPin, FileText, PlusCircle, Verified, DoorOpen, Banknote, Save, Download 
} from "lucide-react";
import { useState, useEffect } from "react";

function LandlordProperties() {
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

  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [error, setError] = useState(null);

  const[openViewDetails, setOpenViewDetails] = useState(null);
  const [openEditProperty, setOpenEditProperty] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      const token = localStorage.getItem("token"); 
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

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/properties/myproperties", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setProperties(data.properties);
      else setError(data.error || "Failed to fetch properties");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProperties(false);
    }
  };

  return (
    <section className="w-full">
      <div className="border border-red-500 pt-20">
        {/* Header */}
        <div className="border border-blue-500 flex items-center justify-between p-4">
          <div>
            <h1 className="text-gray-800 text-3xl font-bold">Property Management</h1>
            <p className="text-md text-gray-600 py-1">Manage all property listings and maintenance</p>
          </div>
          <div className="flex items-center justify-end gap-4">
            <button className="px-4 py-2 flex gap-2 rounded-lg font-semibold text-sm bg-blue-800 hover:bg-blue-900 text-gray-50">
              <PlusSquare size={18}/>Post Property
            </button>
            <button
              className="px-4 py-2 flex gap-2 rounded-lg bg-green-500 hover:bg-green-600 text-gray-50 text-sm font-semibold"
              onClick={() => setShowAddProperty(true)}
            >
              <PlusCircle size={18}/>Add Property
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border border-green-500 p-6">
          <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Building2 size={28} className="text-blue-900"/></div>
            <div>
              <h2 className="text-md font-semibold text-gray-800">Total Properties</h2>
              <p className="text-2xl font-bold text-gray-800">{properties.length}</p>
            </div>
          </div>
          <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Verified size={28} className="text-blue-500"/></div>
            <div>
              <h2 className="text-md font-semibold text-gray-800">Occupied Units</h2>
              <p className="text-2xl font-bold text-gray-800">200</p>
            </div>
          </div>
          <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><DoorOpen size={28} className="text-green-500"/></div>
            <div>
              <h2 className="text-md font-semibold text-gray-800">Vacant Units</h2>
              <p className="text-2xl font-bold text-gray-800">25</p>
            </div>
          </div>
          <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center"><Clock size={28} className="text-yellow-500"/></div>
            <div>
              <h2 className="text-md font-semibold text-gray-800">Pending Approval</h2>
              <p className="text-2xl font-bold text-gray-800">25</p>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="p-4">
            <div className="border border-gray-300 rounded-lg mt-4 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50">
                {loadingProperties ? (
                    <p className="text-gray-500">Loading properties...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : properties.length === 0 ? (
                    <p className="text-gray-500">No properties found</p>
                ) : (
                    properties.map((property) => (
                    <div key={property.id} className="border rounded-xl p-4 shadow transition bg-white">
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
                        <h3 className="text-lg font-semibold text-gray-800">{property.apartment_name}</h3>
                        <p className="text-sm text-gray-500">{property.property_type}</p>
                        <p className="text-sm text-gray-600 mt-1">{property.city}, {property.area}</p>
                        <p className="text-sm text-gray-800 mt-2 font-semibold">
                        KES {property.monthly_rent?.toLocaleString() || 0}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-100 hover:scale-105" onClick={() => setOpenViewDetails(property.id)}>View Details</button>
                            <button className="px-4 py-2 rounded-lg text-sm font-bold text-gray-50 bg-green-500 hover:bg-green-600 hover:scale-105" onClick={() => setOpenEditProperty(property.id)}>Edit Property</button>
                        </div>
                    </div>
                    ))
                )}
            </div>
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
                                                    Property Manager Information
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

export default LandlordProperties;