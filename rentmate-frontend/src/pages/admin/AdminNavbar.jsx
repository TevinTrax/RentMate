import { Search, Calendar, Bell } from "lucide-react";
import { FaCommentDots } from "react-icons/fa";

function AdminNavbar() {
    const date = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <nav className="fixed top-0 left-64 right-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="pl-10 pr-4 py-2 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                    <Calendar size={18} />
                    <span>{date}</span>
                </div>

                <div className="flex gap-3">
                        {/* Messages */}
                    <div className="relative cursor-pointer mr-2">
                        <FaCommentDots size={20} className="text-gray-700" />
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </div>

                    {/* Notifications */}
                    <div className="relative cursor-pointer">
                        <Bell size={20} className="text-gray-700" />
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </div>
                </div>

                {/* Quick Actions */}
                <select
                    name="quickActions"
                    className="px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-700 focus:outline-none"
                >
                    <option>Quick Actions</option>
                    <option>Add New Property</option>
                    <option>Register User</option>
                    <option>Create Announcement</option>
                    <option>Generate Report</option>
                </select>
            </div>
        </nav>
    );
}

export default AdminNavbar;