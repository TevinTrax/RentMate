import { Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TenantNavbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchUser = async()=>{
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
            navigate("/sign-in");
            }

            const res = await fetch("http://localhost:5000/api/users/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            const data = await res.json();
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
        };
        fetchUser();
    }, []);

    return(
        <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200 fixed z-50 top-0 left-72 right-0">
            {/* Search */}
            <form>
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                    />
                </div>
            </form>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                
                {/* Notification */}
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                    <Bell size={18} />
                </button>

                {/* User */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-800">
                        {user?.first_name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-gray-800 text-sm font-semibold">
                            {user?.first_name} {user?.last_name}
                        </h1>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                </div>

            </div>
        </nav>

    );
}

export default TenantNavbar;