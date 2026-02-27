import { DownloadCloud, LineChart, DollarSign, TrendingUp, TrendingDown, Verified, Wallet2, Search, MoreHorizontal, AlertTriangle } from "lucide-react";
import CountUp from "react-countup";

function LandlordPayments() {
    return(
        <section className="w-full">
            <div className="p-6 border border-red-500">
                <div className="flex items-center justify-between mt-20 border border-green-500">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                        Payments & Finance Management
                        </h1>
                        <p className="py-2 text-gray-600">
                        Overview of all financial activity across the RentMate platform
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium hover:bg-gray-200">
                        <DownloadCloud className="h-4 w-4" />
                        Export
                        </button>

                        <button className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-700">
                        <LineChart className="h-4 w-4" />
                        View Analytics
                        </button>
                    </div>
                </div>

                <div className="mt-3 text-gray-800 text-lg font-bold">
                    <h2>Finance Overview</h2>
                </div>

                {/* Stats Cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Users */}
                    <div className="rounded-xl bg-blue-50 border border-blue-200 p-5 shadow-sm transition-transform duration-300 hover:scale-[1.03]">
        
                        {/* Top Section */}
                        <div className="flex items-center justify-between">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-200">
                            <DollarSign className="text-blue-600" size={28} />
                            </div>

                            <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                            <TrendingUp size={16} />
                            <span>12.5%</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Collected This Month</p>

                            <h2 className="mt-1 text-2xl font-bold text-gray-800">
                            KES <CountUp end={28.5} duration={2} decimals={1} suffix="M" />
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">vs last month</p>
                        </div>
                    </div>


                    {/* Tenants */}
                    <div className="rounded-lg bg-gray-50 border border-gray-300 p-4 shadow-md transition hover:scale-105">
                    {/* Top Section */}
                        <div className="flex items-center justify-between">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200">
                            <Verified className="text-gray-800" size={28} />
                            </div>

                            <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                            <TrendingUp size={16} />
                            <span>12.5%</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Completed Payouts</p>

                            <h2 className="mt-1 text-2xl font-bold text-gray-800">
                            KES <CountUp end={14.8} duration={2} decimals={1} suffix="M" />
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">vs last month</p>
                        </div>
                    </div>

                    {/* Landlords */}
                    <div className="rounded-lg bg-yellow-50 border border-yellow-300 p-4 shadow-md transition hover:scale-105">
                        {/* Top Section */}
                        <div className="flex items-center justify-between">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-yellow-200">
                            <Wallet2 className="text-yellow-600" size={28} />
                            </div>

                            <div className="flex items-center gap-1 text-sm font-semibold text-red-600">
                            <TrendingDown size={16} />
                            <span>12.5%</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Pending Payments</p>

                            <h2 className="mt-1 text-2xl font-bold text-gray-800">
                            KES<CountUp end={1.2} duration={2} decimals={1} suffix="M" />
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">vs last month</p>
                        </div>
                    </div>

                    {/* Pending Approval */}
                    <div className="rounded-lg bg-red-50 border border-red-300 p-4 shadow-md transition hover:scale-105">
                        {/* Top Section */}
                        <div className="flex items-center justify-between">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-red-200">
                            <AlertTriangle className="text-red-600" size={28} />
                            </div>

                            <div className="flex items-center gap-1 text-sm font-semibold text-red-600">
                            <TrendingUp size={16} />
                            <span>12.5%</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Overdue Rent</p>

                            <h2 className="mt-1 text-2xl font-bold text-gray-800">
                            <CountUp end={820} duration={2}/>
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">vs last month</p>
                        </div>
                    </div>
                </div>

                {/* graphs */}
                <div className="flex mt-6 border border-red-500 p-6 gap-4">
                    <div className="flex-1 border border-blue-500">
                        <h3>Payment Trends</h3>
                        <div>
                            {/* graph 1 */}
                        </div>
                    </div>
                    <div className="w-64 border border-blue-500">
                        <h4>Payment Methods</h4>
                        <div>
                            {/* graph 2 */}
                        </div>
                    </div>
                </div>

                {/* transactions */}
                <div className="mt-4">
                    {/* Filters */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <form className="flex items-center justify-between gap-4">
                        
                        {/* Search */}
                        <div className="relative w-full max-w-md">
                            <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                            <input
                            type="text"
                            placeholder="Search by tenant or property..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                                        focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-3">
                            <select className="px-4 py-2 rounded-lg border border-gray-300 text-sm 
                                            focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option>All Status</option>
                            <option>Completed</option>
                            <option>Pending</option>
                            <option>Failed</option>
                            <option>Overdue</option>
                            </select>

                            <select className="px-4 py-2 rounded-lg border border-gray-300 text-sm 
                                            focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option>All Methods</option>
                            <option>M-Pesa</option>
                            <option>Bank Transfer</option>
                            <option>Card</option>
                            <option>Cash</option>
                            </select>
                        </div>
                        </form>
                    </div>

                    {/* Table */}
                    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-gray-700">
                                <th className="p-3 text-left">No</th>
                                <th className="p-3 text-left">Transaction</th>
                                <th className="p-3 text-left">Property</th>
                                <th className="p-3 text-left">Amount</th>
                                <th className="p-3 text-left">Commission</th>
                                <th className="p-3 text-left">Method</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <td className="p-3">1</td>

                                <td className="p-3">
                                    <div className="font-semibold">Echakara Tevin</div>
                                    <div className="text-xs text-gray-500">
                                    TXN001 · 2026-02-15 19:00
                                    </div>
                                </td>

                                <td className="p-3">Oxygen House B19</td>
                                <td className="p-3 font-semibold">KES 45,000</td>
                                <td className="p-3 text-gray-600">KES 1,000</td>
                                <td className="p-3">M-Pesa</td>

                                <td className="p-3">
                                    <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-semibold">
                                    Completed
                                    </span>
                                </td>

                                <td className="p-3">
                                    <button className="p-2 rounded-md hover:bg-gray-100">
                                    <MoreHorizontal size={18} />
                                    </button>
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

export default LandlordPayments;