import { Search, Bell } from "lucide-react";
import { useState, useEffect } from "react";

function LandlordNavbar() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();

        setUser(data);

      } catch (error) {
        console.error("Error fetching landlord profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

  }, []);

  return (
    <nav className="fixed top-0 left-72 right-0 z-50 bg-gray-100 border-b border-gray-300 px-6 py-3 flex items-center justify-between">

      {/* Search */}
      <form>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition">
          <Bell size={20} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">

          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
            {user?.first_name?.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="leading-tight">
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <>
                <h1 className="text-sm font-bold">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
}

export default LandlordNavbar;