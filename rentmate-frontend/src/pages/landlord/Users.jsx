import { useState, useEffect } from "react";
import {
  UserPlus2,
  DownloadCloud,
  Shield,
  Users,
  Building2,
  Clock,
  Search,
  MoreHorizontal,
  X,
  Mail,
  Phone,
  Home,
  CreditCard,
  Trash2,
  AlertTriangle,
} from "lucide-react";

function LandlordUsers() {
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTenants: 0,
    unitsOccupied: 0,
    pendingApproval: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const token = sessionStorage.getItem("token");

  // -------------------------
  // Helper: recalculate stats
  // -------------------------
  const recalculateStats = (tenantList) => {
    const totalTenants = tenantList.filter((u) => u.role === "Tenant").length;
    const unitsOccupied = tenantList.filter(
      (u) => u.tenant_approval_status === "approved"
    ).length;
    const pendingApproval = tenantList.filter(
      (u) => u.tenant_approval_status === "pending"
    ).length;

    setStats({
      totalUsers: tenantList.length,
      totalTenants,
      unitsOccupied,
      pendingApproval,
    });
  };

  // ---------------------------------------
  // Fetch tenants belonging to this landlord
  // ---------------------------------------
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/users/landlord/landlord-tenants",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch tenants");
      }

      const tenantList = data.tenants || [];
      setTenants(tenantList);
      recalculateStats(tenantList);
    } catch (err) {
      console.error("Fetch tenants error:", err);
      setTenants([]);
      setStats({
        totalUsers: 0,
        totalTenants: 0,
        unitsOccupied: 0,
        pendingApproval: 0,
      });
      alert(err.message || "Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // -------------------------
  // Approve / Reject Tenant
  // -------------------------
  const handleTenantStatus = async (tenantId, status) => {
    try {
      setActionLoading(tenantId);

      const res = await fetch(
        `http://localhost:5000/api/users/tenant/${tenantId}/Tenant-Status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tenant_approval_status: status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update tenant status");
      }

      const updatedTenant = data.tenant;

      const updatedList = tenants.map((t) =>
        t.id === tenantId ? { ...t, ...updatedTenant } : t
      );

      setTenants(updatedList);
      recalculateStats(updatedList);

      // Update modal data too if open
      if (selectedTenant && selectedTenant.id === tenantId) {
        setSelectedTenant({ ...selectedTenant, ...updatedTenant });
      }

      alert(`Tenant ${status} successfully`);
    } catch (err) {
      console.error("Update tenant status error:", err);
      alert(err.message || "Failed to update tenant status");
    } finally {
      setActionLoading(null);
    }
  };

  // -------------------------
  // Delete Tenant
  // -------------------------
  const handleDeleteTenant = async () => {
    if (!selectedTenant?.id) return;

    try {
      setDeleteLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/users/tenant/${selectedTenant.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete tenant");
      }

      const updatedList = tenants.filter((t) => t.id !== selectedTenant.id);
      setTenants(updatedList);
      recalculateStats(updatedList);

      setDeleteModalOpen(false);
      setSelectedTenant(null);

      alert(data.message || "Tenant deleted successfully");
    } catch (err) {
      console.error("Delete tenant error:", err);
      alert(err.message || "Failed to delete tenant");
    } finally {
      setDeleteLoading(false);
    }
  };

  // -------------------------
  // Filter tenants
  // -------------------------
  const filteredTenants = tenants.filter((t) =>
    `${t.first_name || ""} ${t.last_name || ""} ${t.email || ""} ${t.apartment_name || ""} ${t.unit_house_number || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // -------------------------
  // Badge styles
  // -------------------------
  const getStatusBadge = (status) => {
    if (status === "approved") {
      return "text-green-700 bg-green-100";
    }
    if (status === "rejected") {
      return "text-red-700 bg-red-100";
    }
    return "text-yellow-700 bg-yellow-100";
  };

  const getVerifiedBadge = (verified) => {
    return verified
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
  };

  if (loading)
    return (
      <div className="w-full p-6 text-center text-gray-700">
        Loading tenants...
      </div>
    );

  return (
    <section className="w-full">
      <div className="pt-20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 py-1">Manage Your Tenants</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-200 transition">
              <DownloadCloud size={18} /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition">
              <UserPlus2 size={18} /> Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
          <StatCard
            icon={<Shield size={28} className="text-blue-900" />}
            title="Total Users"
            value={stats.totalUsers}
          />
          <StatCard
            icon={<Users size={28} className="text-blue-500" />}
            title="Total Tenants"
            value={stats.totalTenants}
          />
          <StatCard
            icon={<Building2 size={28} className="text-green-500" />}
            title="Units Occupied"
            value={stats.unitsOccupied}
          />
          <StatCard
            icon={<Clock size={28} className="text-yellow-500" />}
            title="Pending Approval"
            value={stats.pendingApproval}
          />
        </div>

        {/* Table */}
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <div className="relative w-full mb-4">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search tenants by name, email, apartment, or house"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Tenant Name</th>
                  <th className="p-3 text-left">Apartment</th>
                  <th className="p-3 text-left">House No</th>
                  <th className="p-3 text-left">Verified</th>
                  <th className="p-3 text-left">Approval Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No tenants found.
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map((t, i) => (
                    <tr
                      key={t.id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3 font-medium text-gray-800">
                        {t.first_name} {t.last_name}
                      </td>
                      <td className="p-3">{t.apartment_name || "N/A"}</td>
                      <td className="p-3">{t.unit_house_number || "N/A"}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getVerifiedBadge(
                            t.is_verified
                          )}`}
                        >
                          {t.is_verified ? "Verified" : "Not Verified"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                            t.tenant_approval_status
                          )}`}
                        >
                          {t.tenant_approval_status || "pending"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedTenant(t)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tenant Details Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-y-auto animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Tenant Details
                </h2>
                <p className="text-sm text-gray-600">
                  Review and manage tenant request
                </p>
              </div>
              <button
                onClick={() => setSelectedTenant(null)}
                className="p-2 rounded-lg hover:bg-gray-200 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <DetailCard
                icon={<Users size={18} />}
                label="Full Name"
                value={`${selectedTenant.first_name || ""} ${selectedTenant.last_name || ""}`}
              />
              <DetailCard
                icon={<Mail size={18} />}
                label="Email"
                value={selectedTenant.email || "N/A"}
              />
              <DetailCard
                icon={<Phone size={18} />}
                label="Phone Number"
                value={selectedTenant.phone_number || "N/A"}
              />
              <DetailCard
                icon={<Phone size={18} />}
                label="Alternative Phone"
                value={selectedTenant.alt_phone_number || "N/A"}
              />
              <DetailCard
                icon={<CreditCard size={18} />}
                label="ID Number"
                value={selectedTenant.id_number || "N/A"}
              />
              <DetailCard
                icon={<Home size={18} />}
                label="Apartment"
                value={selectedTenant.apartment_name || "N/A"}
              />
              <DetailCard
                icon={<Building2 size={18} />}
                label="House Number"
                value={selectedTenant.unit_house_number || "N/A"}
              />

              <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getVerifiedBadge(
                    selectedTenant.is_verified
                  )}`}
                >
                  {selectedTenant.is_verified ? "Verified User" : "Not Verified"}
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusBadge(
                    selectedTenant.tenant_approval_status
                  )}`}
                >
                  {selectedTenant.tenant_approval_status || "pending"}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                <Trash2 size={18} />
                Delete User
              </button>

              <button
                onClick={() => setSelectedTenant(null)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
              >
                Close
              </button>

              {selectedTenant.tenant_approval_status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      handleTenantStatus(selectedTenant.id, "rejected")
                    }
                    disabled={actionLoading === selectedTenant.id}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition"
                  >
                    {actionLoading === selectedTenant.id
                      ? "Processing..."
                      : "Reject"}
                  </button>

                  <button
                    onClick={() =>
                      handleTenantStatus(selectedTenant.id, "approved")
                    }
                    disabled={actionLoading === selectedTenant.id}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition"
                  >
                    {actionLoading === selectedTenant.id
                      ? "Processing..."
                      : "Approve"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedTenant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={30} className="text-red-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Delete Tenant?
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                  {selectedTenant.first_name} {selectedTenant.last_name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteTenant}
                disabled={deleteLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition"
              >
                <Trash2 size={18} />
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Stat Card Component
const StatCard = ({ icon, title, value }) => (
  <div className="flex gap-4 p-4 border rounded-lg bg-gray-100 shadow hover:scale-105 transition">
    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
      {icon}
    </div>
    <div>
      <h2 className="text-gray-800 font-semibold">{title}</h2>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Tenant Detail Card
const DetailCard = ({ icon, label, value }) => (
  <div className="p-4 border rounded-xl bg-gray-50">
    <div className="flex items-center gap-2 text-gray-500 mb-1">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <p className="text-gray-800 font-semibold break-words">{value}</p>
  </div>
);

export default LandlordUsers;