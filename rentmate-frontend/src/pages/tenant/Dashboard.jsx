import { Calendar, DollarSign, FileText, Clock, Home, MapPinHouse, MapPin, CreditCard, Wrench, MessageSquare } from "lucide-react";
import CountUp from "react-countup";

function TenantDashboard() {
    return(
        <section className="w-full p-6 bg-gray-50">
            <div className="pt-16">
                <h1 className="text-3xl font-bold text-gray-800 py-2">Good afternoon, Tevin!</h1>
                <p className="text-md text-gray-600">Here's what's happening with your rental today.</p>
            </div>
            {/* cards */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="border border-gray-200 bg-white p-4 rounded-lg transition hover:border-green-300 hover:scale-105">
                    <div className="flex gap-2 items-center">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Calendar size={20} className="text-green-600"/>
                        </div>
                        <p className="text-gray-600 text-sm font-semibold">Next Rent Due</p>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 pt-2">Feb 1, 2026</h2>
                    <p className="text-xs font-semibold text-gray-700 py-1">5 days remaining</p>
                </div>
                <div className="border border-gray-200 bg-white p-4 rounded-lg transition hover:border-yellow-300 hover:scale-105">
                    <div className="flex gap-2 items-center">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <DollarSign size={20} className="text-yellow-600"/>
                        </div>
                        <p className="text-gray-600 text-sm font-semibold">Outstanding Balance</p>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 pt-2">KES <CountUp end={45000}/></h2>
                    <p className="text-xs font-semibold text-gray-700 py-1">Current amount due</p>
                </div>
                <div className="border border-gray-200 bg-white p-4 rounded-lg transition hover:border-blue-300 hover:scale-105">
                    <div className="flex gap-2 items-center">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText size={20} className="text-blue-600"/>
                        </div>
                        <p className="text-gray-600 text-sm font-semibold">Lease Ends</p>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 pt-2">Dec 31, 2026</h2>
                    <p className="text-xs font-semibold text-gray-700 py-1">Active lease</p>
                </div>
                <div className="border border-gray-200 bg-white p-4 rounded-lg transition hover:border-green-300 hover:scale-105">
                    <div className="flex gap-2 items-center">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Clock size={20} className="text-green-800"/>
                        </div>
                        <p className="text-gray-600 text-sm font-semibold">Last Payment</p>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 pt-2">Jan 1, 2026</h2>
                    <p className="text-xs font-semibold text-gray-700 py-1">Paid on time</p>
                </div>
            </div>

            <div className="flex gap-4 p-4 mt-4">
                <div className="flex-1">
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div className="border border-gray-200 hover:border-yellow-400 transition transform hover:scale-[1.03] p-4 space-y-4 rounded-lg bg-white shadow-sm hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <h3 className="text-md font-semibold text-gray-700">
                                    Rent Status
                                </h3>

                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-100">
                                    <Clock size={20} className="text-yellow-600"/>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-3xl font-bold tracking-tight text-gray-900">
                                    KES <CountUp end={45000}/>
                                </h4>
                                <p className="text-sm text-gray-500 py-1">
                                    Monthly Rent
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <p className="text-gray-600">Payment Period</p>
                                <p className="text-yellow-600 font-medium">5 days left</p>
                            </div>

                            <p className="text-sm text-yellow-600">
                                Payment due on Feb 1, 2026
                            </p>

                            <button className="w-full py-2 text-sm font-semibold bg-gray-900 hover:bg-black rounded-lg text-white transition">
                                Pay Now
                            </button>
                        </div>

                        <div className="border border-gray-200 p-4 space-y-4 rounded-lg bg-white">    
                            <div className="flex items-center justify-between">
                                <h3 className="text-md font-semibold text-gray-700">
                                    Your Property
                                </h3>

                                <span className="text-xs px-4 py-1 rounded-full bg-green-500 text-white">
                                    Active
                                </span>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Home size={20} className="text-green-600"/>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Property</p>
                                    <h4 className="text-gray-800 text-md font-semibold">
                                        Sunrise Apartment
                                    </h4>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <MapPinHouse size={20} className="text-green-600"/>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">House Number</p>
                                    <h4 className="text-gray-800 text-md font-semibold">B19</h4>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <MapPin size={20} className="text-green-600"/>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <h4 className="text-gray-800 text-md font-semibold">
                                        Zimmerman, Nairobi
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-300 bg-white rounded-lg p-4 mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-md font-semibold text-gray-800">Maintenance Requests</h1>
                            <button className="px-4 py-2 rounded-lg text-sm text-green-600 font-semibold hover:bg-green-600 hover:text-gray-200">View All</button>
                        </div>
                        <div>
                            {/* maintenance notification will go here */}
                        </div>
                        <button className="w-full rounded-lg border border-gray-200 flex items-center justify-center py-2 text-sm font-bold gap-2 hover:bg-violet-500 hover:text-gray-200 hover:border-none"><Wrench size={20}/>Submit New Request</button>
                    </div>                    
                </div>
                <div className="w-80">
                    <div className="bg-white rounded-lg border border-gray-300 p-4">
                        <h5 className="text-md font-bold text-gray-800">Quick Actions</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="border border-gray-200 rounded-lg p-4 space-y-1 shadow-md transition hover:scale-95 hover:border-green-300">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
                                    <CreditCard size={20}className="text-green-800"/>
                                </div>
                                <h6 className="text-sm font-semibold text-gray-800">Pay Rent</h6>
                                <p className="text-gray-600 text-xs">Make a payment</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4 space-y-1 shadow-md transition hover:scale-95 hover:border-yellow-300">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-100">
                                    <Wrench size={20}className="text-yellow-500"/>
                                </div>
                                <h6 className="text-sm font-semibold text-gray-800">Request Repair</h6>
                                <p className="text-gray-600 text-xs">Submit a Request</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4 space-y-1 shadow-md transition hover:scale-95 hover:border-blue-300">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                                    <FileText size={20}className="text-blue-500"/>
                                </div>
                                <h6 className="text-sm font-semibold text-gray-800">View Lease</h6>
                                <p className="text-gray-600 text-xs">See Agreement</p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-4 space-y-1 shadow-md transition hover:scale-95 hover:border-violet-300">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-violet-100">
                                    <MessageSquare size={20}className="text-violet-500"/>
                                </div>
                                <h6 className="text-sm font-semibold text-gray-800">Contact Manager</h6>
                                <p className="text-gray-600 text-xs">Send a Message</p>
                            </div>
                        </div>
                    </div>

                    <div className="border border-blue-500 rounded-lg bg-white p-4 mt-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-md font-semibold text-gray-800">Recent Notifications</h2>
                            <p className="text-xs px-4 py-1 rounded-full bg-green-600 text-gray-200 font-semibold">2 New</p>
                        </div>
                        <div className="h-72 border border-red-500 mt-4 overflow-y-scroll">
                            {/* notifications will go here */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TenantDashboard;