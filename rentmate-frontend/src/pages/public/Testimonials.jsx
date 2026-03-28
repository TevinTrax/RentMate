import { useRef } from "react";

function Testimonials() {
  const comments = [
    {
      id: 1,
      name: "John Doe",
      role: "Landlord",
      comment:
        "RentMate has revolutionized the way I manage my properties. The platform is user-friendly and has significantly reduced my administrative workload.",
      rating: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Tenant",
      comment:
        "As a tenant, I love the convenience of paying rent online and submitting maintenance requests through RentMate. It makes renting so much easier!",
      rating: 4,
    },
    {
      id: 3,
      name: "Michael Johnson",
      role: "Property Manager",
      comment:
        "RentMate's features have streamlined our operations and improved communication with both landlords and tenants. Highly recommend!",
      rating: 5,
    },
  ];

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-gradient-to-b from-green-50 via-white to-green-50 py-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl text-gray-900 text-center font-bold leading-tight">
          Trusted by Property Owners Worldwide
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center mt-2">
          See what our customers have to say about their experience
        </p>

        {/* Carousel Controls */}
        <div className="flex justify-end gap-2 mt-6 md:hidden">
          <button
            onClick={scrollLeft}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
          >
            ◀
          </button>
          <button
            onClick={scrollRight}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
          >
            ▶
          </button>
        </div>

        {/* Testimonials Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory mt-10 py-4 px-2 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible"
        >
          {comments.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-72 md:w-auto relative bg-white/80 backdrop-blur-lg border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 snap-start"
            >
              {/* Rating */}
              <div className="flex items-center mb-3">
                <p className="text-yellow-400 mr-2">{"⭐".repeat(item.rating)}</p>
                <span className="text-gray-400 text-sm">{item.rating}/5</span>
              </div>

              {/* Comment */}
              <p className="text-gray-700 italic mb-4 leading-relaxed">"{item.comment}"</p>

              {/* User Info */}
              <div className="flex items-center gap-3 mt-4">
                {/* Placeholder Avatar */}
                <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{item.name}</p>
                  <p className="text-gray-500 text-sm">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;