function Testimonials() {
    const comments=[
        {id:1, name:"John Doe", role:"Landlord", comment:"RentMate has revolutionized the way I manage my properties. The platform is user-friendly and has significantly reduced my administrative workload.", rating:5},
        {id:2, name:"Jane Smith", role:"Tenant", comment:"As a tenant, I love the convenience of paying rent online and submitting maintenance requests through RentMate. It makes renting so much easier!", rating:4},
        {id:3, name:"Michael Johnson", role:"Property Manager", comment:"RentMate's features have streamlined our operations and improved communication with both landlords and tenants. Highly recommend!", rating:5},
    ];
    return(
        <section className="w-full bg-blue-50 py-20">
            <div className="container mx-auto">
                <h1 className="text-4xl text-gray-800 text-center font-bold">Trusted by Property Owners Worldwide</h1>
                <p className="text-lg text-gray-500 text-center pt-2">See what our customers have to say about their experience</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                    {comments.map((item)=>(
                        <div key={item.id} className="bg-white rounded-2xl shadow-md p-6 m-4 border border-gray-200 transform transition duration-300 hover:scale-105">
                            <p className="text-yellow-500"> {"⭐".repeat(item.rating)}</p>
                            <p className="text-gray-600 italic mb-4 pt-2">"{item.comment}"</p>
                            <p className="text-blue-700 font-semibold">{item.name}</p>
                            <p className="text-gray-700">{item.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;