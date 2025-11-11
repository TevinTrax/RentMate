function Extras() {
  return (
    <section className="w-full">
       <div className="container mx-auto p-6">
           <div className="max-w-6xl mx-auto bg-blue-500 rounded-xl shadow-lg p-8 mt-6">
                <h1 className="text-3xl md:text-4xl text-center text-white font-semibold">
                Trusted by Property Owners Worldwide
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                    {/* Box 1 */}
                    <div className="text-center p-6 bg-blue-600 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl">
                        <h2 className="text-4xl text-white font-bold">10K+</h2>
                        <p className="text-sm text-white/80 mt-1">Properties Managed</p>
                    </div>

                    {/* Box 2 */}
                    <div className="text-center p-6 bg-blue-600 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl">
                        <h2 className="text-4xl text-white font-bold">25K+</h2>
                        <p className="text-sm text-white/80 mt-1">Happy Tenants</p>
                    </div>

                    {/* Box 3 */}
                    <div className="text-center p-6 bg-blue-600 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl">
                        <h2 className="text-4xl text-white font-bold">$2.5B+</h2>
                        <p className="text-sm text-white/80 mt-1">Rent Collected</p>
                    </div>

                    {/* Box 4 */}
                    <div className="text-center p-6 bg-blue-600 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl">
                        <h2 className="text-4xl text-white font-bold">99.8%</h2>
                        <p className="text-sm text-white/80 mt-1">Customer Satisfaction</p>
                    </div>
                </div>
            </div>
       </div>
    </section>
  );
}

export default Extras;
