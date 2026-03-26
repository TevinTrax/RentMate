import CountUp from "react-countup";
import { TrendingDown, TrendingUp, Wallet2, Users, AlertTriangle, Building2, Clock, Home, FileText, UserPlus2, Bell } from "lucide-react";
import { useEffect, useState } from "react";

function LandlordDashboard() {

    // fetch properties from backend
    const [properties, setProperties] = useState([]);
    const [loadingProperties, setLoadingProperties] = useState(true);
    const [error, setError] = useState(null);

    // fetch properties from backend
    useEffect(() => {
        const fetchProperties = async () => {
            try {
            const token = sessionStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/properties/myproperties", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) setProperties(data.properties);
                else setError(data.error || "Failed to fetch properties");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingProperties(false);
            }
        };
        fetchProperties();
    }, []);

    // fetch user profile to get approval status
    const [approvalStatus, setApprovalStatus] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = sessionStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok) {
            setApprovalStatus(data.approval_status);
            }
        };

        fetchUser();

        const interval = setInterval(fetchUser, 5000);

        return () => clearInterval(interval);
    }, []);


    // fetch landlord tenants
    const [tenantStats, setTenantStats] = useState({
        count: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
    });

    const [loading, setLoading] = useState(true);

    const fetchLandlordTenants = async () => {
        try {
            setLoading(true);

            const token =
            sessionStorage.getItem("token") || localStorage.getItem("token");

            if (!token) {
            console.error("No token found");
            setTenantStats({
                count: 0,
                approvedCount: 0,
                pendingCount: 0,
                rejectedCount: 0,
            });
            return;
            }

            const res = await fetch("http://localhost:5000/api/users/landlord/landlord-tenants", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            });

            const data = await res.json();
            console.log("Landlord Tenants Response:", data);

            if (res.ok && data.success) {
            setTenantStats({
                count: Number(data.count) || 0,
                approvedCount: Number(data.approvedCount) || 0,
                pendingCount: Number(data.pendingCount) || 0,
                rejectedCount: Number(data.rejectedCount) || 0,
            });
            } else {
            console.error("Failed to fetch tenants:", data.error || data.message);
            setTenantStats({
                count: 0,
                approvedCount: 0,
                pendingCount: 0,
                rejectedCount: 0,
            });
            }
        } catch (error) {
            console.error("Error fetching landlord tenants:", error);
            setTenantStats({
            count: 0,
            approvedCount: 0,
            pendingCount: 0,
            rejectedCount: 0,
            });
        } finally {
            setLoading(false);
        }
        };

        useEffect(() => {
        fetchLandlordTenants();
    }, []);

    return(
        <section className="w-full bg-gray-50">
            <div className="pt-20">
                <div className="p-4">
                    <h1 className="text-3xl text-gray-800 font-bold">Dashboard Overview</h1>
                    <p className="text-md text-gray-700 py-1">Welcome back! Here's what's happening with RentMate today.</p>
                </div>

                {/* Approval Status */}
                {approvalStatus !== "approved" && (
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6">
                        Your account is awaiting admin approval. Some features are disabled.
                    </div>
                )}

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-2 gap-4 p-6">

                    {/* Total Users */}
                    <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
                        <div className="flex-1">
                            <p className="text-gray-700 font-semibold">Total Tenants</p>

                            <h2 className="text-xl font-bold text-gray-800 py-1">
                            {loading ? (
                                "..."
                            ) : (
                                <CountUp end={tenantStats.count} duration={2} separator="," />
                            )}
                            </h2>

                            <div>
                                <p className="text-sm text-gray-600">
                                    <span className="text-green-500 inline-flex items-center">
                                        <TrendingUp size={16} className="mr-1" />
                                        {tenantStats.approvedCount} Approved
                                    </span>                                    
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{tenantStats.pendingCount} Pending</p>
                            </div>
                        </div>

                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <Users size={28} className="text-green-600" />
                        </div>
                    </div> 

                    {/* Total Properties */}
                    <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
                        <div className="flex-1">
                            <p className="text-gray-700 font-semibold">Total Properties</p>
                            <h2 className="text-xl font-bold text-gray-800 py-1">
                                <CountUp end={properties.length} duration={2} />
                            </h2>
                            <p className="text-sm text-gray-600">
                                <span className="text-green-500 inline-flex items-center">
                                <TrendingUp size={16} className="mr-1" /> +8.5%
                                </span>{" "}
                                vs last month
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Building2 size={28} className="text-blue-500" />
                        </div>
                    </div>

                    {/* Monthly Revenue */}
                    <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
                        <div className="flex-1">
                            <p className="text-gray-700 font-semibold">Monthly Revenue</p>
                            <h2 className="text-xl font-bold text-gray-800 py-1">
                                KES{" "}
                                <CountUp
                                end={5.8}
                                duration={2}
                                decimals={1}
                                decimal="."
                                suffix="M"
                                />
                            </h2>
                            <p className="text-sm text-gray-600">
                                <span className="text-green-500 inline-flex items-center">
                                <TrendingUp size={16} className="mr-1" /> +23.1%
                                </span>{" "}
                                vs last month
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <Wallet2 size={28} className="text-green-500" />
                        </div>
                    </div>

                    {/* Pending Payments */}
                    <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
                        <div className="flex-1">
                            <p className="text-gray-700 font-semibold">Pending Payments</p>
                            <h2 className="text-xl font-bold text-gray-800 py-1">
                                KES <CountUp end={819000} duration={2} separator="," />
                            </h2>
                            <p className="text-sm text-gray-600">
                                <span className="text-red-500 inline-flex items-center">
                                <TrendingDown size={16} className="mr-1" /> −12.5%
                                </span>{" "}
                                vs last month
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Clock size={28} className="text-yellow-500" />
                        </div>
                    </div>

                    {/* Overdue rent */}
                    <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
                        <div className="flex-1">
                            <p className="text-gray-700 font-semibold">Overdue Rent</p>
                            <h2 className="text-xl font-bold text-gray-800 py-1">
                                <CountUp end={2.1} suffix="M" duration={2} decimal="." decimals={1} />
                            </h2>
                            <p className="text-sm text-gray-600">
                                <span className="text-green-500 inline-flex items-center">
                                <TrendingUp size={16} className="mr-1" /> +12.5%
                                </span>{" "}
                                vs last month
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                            <AlertTriangle size={28} className="text-red-500" />
                        </div>
                    </div>

                    {/* occupancy rate */}
                    <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
                        <div className="flex-1">
                            <p className="text-gray-700 font-semibold">Occupancy Rate</p>
                            <h2 className="text-xl font-bold text-gray-800 py-1">
                                87.4%
                            </h2>
                            <p className="text-sm text-gray-600">
                                <span className="text-green-500 inline-flex items-center">
                                <TrendingUp size={16} className="mr-1" /> +8.5%
                                </span>{" "}
                                vs last month
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Home size={28} className="text-orange-500" />
                        </div>
                    </div>

                    {/* Active Leases */}
                    <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
                        <div className="flex-1">
                            <p className="text-gray-700 font-semibold">Active Leases</p>
                            <h2 className="text-xl font-bold text-gray-800 py-1">
                                <CountUp
                                end={124}
                                />
                            </h2>
                            <p className="text-sm text-gray-600">
                                <span className="text-green-500 inline-flex items-center">
                                <TrendingUp size={16} className="mr-1" /> +23.1%
                                </span>{" "}
                                vs last month
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <FileText size={28} className="text-green-500" />
                        </div>
                    </div>

                    {/* growth rate */}
                    <div className="hover:scale-105 transition-transform duration-200 flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
                        <div className="flex-1">
                            <p className="text-gray-700 font-semibold">Growth Rate</p>
                            <h2 className="text-xl font-bold text-gray-800 py-1">
                                KES <CountUp end={819000} duration={2} separator="," />
                            </h2>
                            <p className="text-sm text-gray-600">
                                <span className="text-red-500 inline-flex items-center">
                                <TrendingDown size={16} className="mr-1" /> −12.5%
                                </span>{" "}
                                vs last month
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <TrendingUp size={28} className="text-blue-800" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 border border-red-500 my-6 gap-4 p-4">
                    <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
                        <h3 className="text-gray-800 text-lg font-bold">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Building2 size={28} className="text-blue-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Add Property</h4>
                                <p className="text-gray-700 text-sm">List a new rental property</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-gray-300 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><UserPlus2 size={28} className="text-gray-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Register User</h4>
                                <p className="text-gray-700 text-sm">Add Tenant or Landlord</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><FileText size={28} className="text-blue-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Create Report</h4>
                                <p className="text-gray-700 text-sm">Generate analytics report</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-yellow-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Bell size={28} className="text-yellow-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Send Alert</h4>
                                <p className="text-gray-700 text-sm">Broadcast announcement</p>
                            </div>
                        </div>                
                    </div>
                    <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
                        <h3 className="text-gray-800 text-lg font-bold">Revenue Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Building2 size={28} className="text-blue-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Add Property</h4>
                                <p className="text-gray-700 text-sm">List a new rental property</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-gray-300 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><UserPlus2 size={28} className="text-gray-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Register User</h4>
                                <p className="text-gray-700 text-sm">Add Tenant or Landlord</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><FileText size={28} className="text-blue-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Create Report</h4>
                                <p className="text-gray-700 text-sm">Generate analytics report</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-yellow-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Bell size={28} className="text-yellow-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Send Alert</h4>
                                <p className="text-gray-700 text-sm">Broadcast announcement</p>
                            </div>
                        </div>                
                    </div>
                    <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
                        <h3 className="text-gray-800 text-lg font-bold">Recent Transactions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Building2 size={28} className="text-blue-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Add Property</h4>
                                <p className="text-gray-700 text-sm">List a new rental property</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-gray-300 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><UserPlus2 size={28} className="text-gray-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Register User</h4>
                                <p className="text-gray-700 text-sm">Add Tenant or Landlord</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><FileText size={28} className="text-blue-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Create Report</h4>
                                <p className="text-gray-700 text-sm">Generate analytics report</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-yellow-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Bell size={28} className="text-yellow-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Send Alert</h4>
                                <p className="text-gray-700 text-sm">Broadcast announcement</p>
                            </div>
                        </div>                
                    </div>
                    <div className="border border-gray-400 p-4 rounded-lg shadow-md bg-gray-50">
                        <h3 className="text-gray-800 text-lg font-bold">Recent Activity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Building2 size={28} className="text-blue-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Add Property</h4>
                                <p className="text-gray-700 text-sm">List a new rental property</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-gray-300 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><UserPlus2 size={28} className="text-gray-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Register User</h4>
                                <p className="text-gray-700 text-sm">Add Tenant or Landlord</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><FileText size={28} className="text-blue-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Create Report</h4>
                                <p className="text-gray-700 text-sm">Generate analytics report</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-yellow-200 to-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition">
                                <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center"><Bell size={28} className="text-yellow-500" /></div>
                                <h4 className="text-gray-800 text-md font-bold py-1">Send Alert</h4>
                                <p className="text-gray-700 text-sm">Broadcast announcement</p>
                            </div>
                        </div>                
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LandlordDashboard;