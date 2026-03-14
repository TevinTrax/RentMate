import { Search } from "lucide-react";
import { useState } from "react";

function PropertyFilters({ properties, setFilteredProperties }) {

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const handleFilter = (valueSearch = search, valueStatus = status, valueType = type) => {

    let filtered = properties;

    if (valueSearch) {
      filtered = filtered.filter((property) =>
        property.title?.toLowerCase().includes(valueSearch.toLowerCase()) ||
        property.location?.toLowerCase().includes(valueSearch.toLowerCase())
      );
    }

    if (valueStatus) {
      filtered = filtered.filter((property) => property.status === valueStatus);
    }

    if (valueType) {
      filtered = filtered.filter((property) => property.property_type === valueType);
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="bg-white shadow-sm border rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

      {/* SEARCH */}
      <div className="relative w-full md:w-1/2">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />

        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleFilter(e.target.value, status, type);
          }}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 w-full md:w-auto">

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            handleFilter(search, e.target.value, type);
          }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Status</option>
          <option value="Occupied">Occupied</option>
          <option value="Vacant">Vacant</option>
          <option value="Pending Approval">Pending Approval</option>
        </select>

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            handleFilter(search, status, e.target.value);
          }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Property Type</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Bedsitter">Bedsitter</option>
          <option value="Studio">Studio</option>
        </select>

      </div>
    </div>
  );
}

export default PropertyFilters;