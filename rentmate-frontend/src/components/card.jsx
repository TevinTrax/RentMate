import { FaHeart, FaLocationDot, FaBed, FaBath, FaSquare, FaArrowRight } from "react-icons/fa6";

const properties = [
  {
    status: "Available",
    price: "10,000",
    name: "Blue House",
    location: "Allsops",
    beds: 2,
    baths: 2,
    size: "1200 sqft",
    features: ["Parking", "Gym", "Pool"],
  },
  {
    status: "Occupied",
    price: "15,000",
    name: "Red Diamonds Apartment",
    location: "Roysambu",
    beds: 2,
    baths: 1,
    size: "850 sqft",
    features: ["Parking", "Gym", "Pool"],
  },
  {
    status: "Available",
    price: "7,500",
    name: "Oxygen House",
    location: "Zimmerman",
    beds: 2,
    baths: 2,
    size: "1800 sqft",
    features: ["Parking", "Gym", "Pool"],
  },
];

function Cards() {
  return (
    <section className="w-full py-10 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-lg transition-shadow duration-300"
            >
              {/* Top Section */}
              <div className="p-4 min-h-64 border-b border-2 border-red-500">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium ${
                      property.status === "Available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {property.status}
                  </p>
                  <FaHeart className="text-gray-400 hover:text-red-500 cursor-pointer" />
                </div>
                <h2 className="text-lg font-bold mt-40 text-gray-800">
                  Ksh {property.price} <span className="text-gray-500 text-sm">/month</span>
                </h2>
              </div>

              {/* Bottom Section */}
              <div className="p-4 space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaLocationDot className="text-blue-500" /> {property.location}
                </p>

                {/* Amenities */}
                <div className="flex justify-between text-gray-700 text-sm mt-3">
                  <p className="flex items-center gap-1">
                    <FaBed /> {property.beds} Bed
                  </p>
                  <p className="flex items-center gap-1">
                    <FaBath /> {property.baths} Bath
                  </p>
                  <p className="flex items-center gap-1">
                    <FaSquare /> {property.size}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {property.features.map((feature, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <button className="border border-blue-600 text-blue-600 px-4 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition">
                    View Details
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="flex items-center mx-auto gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            View All Properties <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Cards;