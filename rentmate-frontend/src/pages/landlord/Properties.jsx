import { PlusSquare, Building2, Clock, Search, MoreHorizontal, PlusCircle, Verified, DoorOpen } from "lucide-react";

function LandlordProperties() {
    return(
        <section className="w-full">
            <div className="border border-red-500 pt-20">
                <div className="border border-blue-500 flex items-center justify-between p-4">
                    <div>
                        <h1 className="text-gray-800 text-3xl font-bold">Property Management</h1>
                        <p className="text-md text-gray-600 py-1">Manage all property listings and maintenance</p>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <button className="px-4 py-2 flex gap-2 rounded-lg font-semibold text-sm  bg-blue-800 hover:bg-blue-900 text-gray-50"><PlusSquare size={18}/>Post Property</button>
                        <button className="px-4 py-2 flex gap-2 rounded-lg bg-green-500 hover:bg-green-600 text-gray-50 text-sm font-semibold"><PlusCircle size={18}/>Add Property</button>
                    </div>
                </div>

                {/* cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border border-green-500 p-6">
                    {/* total users */}
                    <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Building2 size={28} className="text-blue-900"/></div>
                        <div className="">
                            <h2 className="text-md font-semibold text-gray-800">Total Properties</h2>
                            <p className="text-2xl font-bold text-gray-800">25</p>
                        </div>
                    </div>

                    {/* total tenants */}
                    <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Verified size={28} className="text-blue-500"/></div>
                        <div className="">
                            <h2 className="text-md font-semibold text-gray-800">Occupied Units</h2>
                            <p className="text-2xl font-bold text-gray-800">200</p>
                        </div>
                    </div>

                    {/* total Units occupied */}
                    <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><DoorOpen size={28} className="text-green-500"/></div>
                        <div className="">
                            <h2 className="text-md font-semibold text-gray-800">Vacant Units</h2>
                            <p className="text-2xl font-bold text-gray-800">25</p>
                        </div>
                    </div>

                    {/* pending approval */}
                    <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow">
                        <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center"><Clock size={28} className="text-yellow-500"/></div>
                        <div className="">
                            <h2 className="text-md font-semibold text-gray-800">Pending Approval</h2>
                            <p className="text-2xl font-bold text-gray-800">25</p>
                        </div>
                    </div>
                </div>

                {/* Tenant table */}
                <div className="p-6 border border-red-500">
                    {/* search */}
                    <div>
                        <form action="" className="flex items-center justify-center gap-4">
                            <div className="relative w-full">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                
                                <input
                                    type="text"
                                    placeholder="Search Properties..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                                            focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="flex gap-4">
                                <select name="" id="" className="px-4 py-2 border border-gray-300 rounded-lg text-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="">All Status</option>
                                    <option value="">Occupied</option>
                                    <option value="">Vacant</option>
                                    <option value="">Pending</option>
                                    <option value="">Maintenance</option>
                                </select>
                                <select name="" id="" className="px-4 py-2 border border-gray-300 rounded-lg text-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="">All Types</option>
                                    <option value="">Apartment</option>
                                    <option value="">House</option>
                                    <option value="">Villa</option>
                                    <option value="">Studio</option>
                                    <option value="">Bedsitter</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="border border-gray-300 rounded-lg mt-4">
                        Property cards Loading...
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LandlordProperties;