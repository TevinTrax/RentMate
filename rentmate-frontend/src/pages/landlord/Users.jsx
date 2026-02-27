import { UserPlus2, DownloadCloud, Shield, Users, Building2, Clock, Search, MoreHorizontal } from "lucide-react";

function LandlordUsers() {
    return(
        <section className="w-full">
            <div className="border border-red-500 pt-20">
                <div className="border border-blue-500 flex items-center justify-between p-4">
                    <div>
                        <h1 className="text-gray-800 text-3xl font-bold">User Management</h1>
                        <p className="text-md text-gray-600 py-1">Manage Your Tenants</p>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <button className="px-4 py-2 flex gap-2 rounded-lg font-semibold text-sm hover:bg-gray-200"><DownloadCloud size={18}/>Export</button>
                        <button className="px-4 py-2 flex gap-2 rounded-lg bg-green-500 hover:bg-green-600 text-gray-50 text-sm font-semibold"><UserPlus2 size={18}/>Add User</button>
                    </div>
                </div>

                {/* cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border border-green-500 p-6">
                    {/* total users */}
                    <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow-md">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Shield size={28} className="text-blue-900"/></div>
                        <div className="">
                            <h2 className="text-md font-semibold text-gray-800">Total Users</h2>
                            <p className="text-2xl font-bold text-gray-800">25</p>
                        </div>
                    </div>

                    {/* total tenants */}
                    <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow-md">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Users size={28} className="text-blue-500"/></div>
                        <div className="">
                            <h2 className="text-md font-semibold text-gray-800">Total Tenants</h2>
                            <p className="text-2xl font-bold text-gray-800">200</p>
                        </div>
                    </div>

                    {/* total Units occupied */}
                    <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow-md">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><Building2 size={28} className="text-green-500"/></div>
                        <div className="">
                            <h2 className="text-md font-semibold text-gray-800">Units Occupied</h2>
                            <p className="text-2xl font-bold text-gray-800">25</p>
                        </div>
                    </div>

                    {/* pending approval */}
                    <div className="flex p-4 gap-4 rounded-lg border border-gray-300 bg-gray-100 transition hover:scale-105 shadow-md">
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
                        <form action="">
                            <div className="relative w-full">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                
                                <input
                                    type="text"
                                    placeholder="Search tenants by name, email or Apartment Name"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="border border-gray-300 rounded-lg mt-4">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr className="text-sm">
                                    <th className="p-3">No</th>
                                    <th className="p-3">Full Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Contact</th>
                                    <th className="p-3">Apartment Name</th>
                                    <th className="p-3">House No</th>
                                    <th className="p-3">Verified</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-sm">
                                    <td className="p-3">1</td>
                                    <td className="p-3">Echakara Tevin</td>
                                    <td className="p-3">tevinokemer50@gmail.com</td>
                                    <td className="p-3">0792201245</td>
                                    <td className="p-3">Oxygen House</td>
                                    <td className="p-3">B19</td>
                                    <td className="p-3">
                                        <span className="px-3 py-1 rounded-full text-xs text-red-500 bg-red-100">Not Verified</span>
                                    </td>
                                    <td className="p-3">
                                        <span className="px-3 py-1 rounded-full text-xs text-yellow-700 bg-yellow-100">pending</span>
                                    </td>
                                    <td className="p-3">
                                        <button className="rounded p-1 hover:bg-gray-100"><MoreHorizontal/></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LandlordUsers;