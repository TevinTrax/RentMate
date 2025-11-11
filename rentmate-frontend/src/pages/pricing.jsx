import { FaBolt, FaBuildingColumns } from "react-icons/fa6";

function Pricing() {
    return(
        <section className="w-full">
            <div className="container mx-auto p-4 border-2 border-red-500 pt-20 bg-gradient-to-br from-blue-600 to-blue-100 text-center items-center justify-center">
                <div className="h-fit w-fit mx-auto bg-blue-100 mt-24 p-1 rounded-xl">
                    <p className="flex text-sm px-4"><FaBolt size={16} className="pr-2"/>Flexible Pricing</p>
                </div>
                <h1 className="max-w-5xl mx-auto flex text-center text-4xl md:text-5xl font-bold p-4">Flexible Plans for Every Property Owner</h1>
                <p className="max-w-xl mx-auto mt-2 mb-10 text-lg text-gray-600">Choose a plan that fits your property needs and start managing smarter today.</p>
            </div>
            <div className="container mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-2 border-red-500">
                <div className="block border rounded-lg shadow-md p-6">
                    <div className="w-fit h-fit bg-blue-200 p-4 rounded-lg">
                        <FaBuildingColumns size={20} className="text-blue-500"/>
                    </div>
                    <h1 className="text-2xl text-gray-800 font-semibold pt-4">Basic</h1>
                    <p className="text-md text-gray-400 pt-2">Ideal for small landlords or single property owners</p>
                    <h2 className="text-4xl text-black font-bold pt-4">Ksh 3500 <span className="text-md font-medium text-gray-400">/month</span></h2>
                </div>
            </div>
        </section>
    );
}

export default Pricing;