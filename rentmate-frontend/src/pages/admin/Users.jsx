import {
  Home,
  UserPlus2,
  DownloadCloud,
  Search,
  Users,
  Clock,
  Verified,
  MoreHorizontal,
  Eye,
  BookDown,
  RefreshCw,
  Flag,
  UserPlus,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Hash,
  UserCog2
} from "lucide-react";
import { FaLock } from "react-icons/fa6";
import StatusBadge from "../../components/StatusBadge";

import CountUp from "react-countup";
import { useState, useEffect, useRef } from "react";

function AdminUsers() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const dropdownRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalUsers = users.length;

  // state for modal and selected user
  const [selectedUser, setSelectedUser]=useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const [showAddUser, setShowAddUser]= useState(false);

  const [showVerifyModal, setShowVerifyModal]= useState(false);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // calculate which users to show
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);



  /* ✅ EDIT FORM STATE (CRITICAL FIX) */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  /*FETCH USERS*/
  const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /*  CLOSE DROPDOWN OUTSIDE CLICK */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* TOGGLE MENU  */
  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };


  /*  OPEN EDIT MODAL WITH PREFILLED DATA */
  const openEditModal = (user) => {
    setSelectedUser(user);

    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setPhone(user.phone_number || "");
    setAltPhone(user.alt_phone_number || "");
    setRole(user.role || "");
    setStatus(user.status || "");

    setShowEditModal(true);
    setOpenMenuId(null);
  };


  // info item component for details modal
  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 flex items-center justify-center 
                      rounded-lg bg-blue-100 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wide">
          {label}
        </p>
        <p className="font-medium text-gray-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );

  // section wrapper/ balanced spacing for details modal
  const Section = ({ title, children }) => (
    <div className="bg-gray-50 rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-blue-600 mb-6">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {children}
      </div>
    </div>
  );

  // date formatter
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB");
  };

  // subscription badge for details modal
  const SubscriptionBadge = ({ status }) => {
    if (!status) return "—";

    const styles =
      status === "active"
        ? "bg-green-100 text-green-600"
        : status === "trial"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-600";

    return (
      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${styles}`}>
        {status}
      </span>
    );
  };

  // post user to db
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    id_number: "",
    phone_number: "",
    alt_phone_number: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password.trim() !== formData.confirmPassword.trim()) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const token = sessionStorage.getItem("token");
      const {
        first_name,
        last_name,
        email,
        id_number,
        phone_number,
        alt_phone_number,
        role,
        password
      } = formData;

      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          id_number,
          phone_number,
          alt_phone_number,
          role,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to add user");
        return;
      }

      alert("User added successfully!");

      // reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        id_number: "",
        phone_number: "",
        alt_phone_number: "",
        role: "",
        password: "",
        confirmPassword: ""
      });

      setShowAddUser(false);

      // refresh table
      fetchUsers();

    } catch (error) {
      console.error("Error adding user:", error);
      alert("Something went wrong");
    }
  };

  const handleApprove = async () => {
    console.log("Approve clicked", selectedUser);
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/auth/approve-landlord/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Approval failed");
        return;
      }

      alert("Landlord approved successfully");

      setShowApproveModal(false);

      fetchUsers(); // refresh table

    } catch (error) {
      console.error("Approve error:", error);
    }
  };


  // handle save changes in edit modal
  const handleSaveChanges = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
          alt_phone_number: altPhone,
          role: role,
          account_status: status
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("User updated successfully");
        setShowEditModal(false);

        // reload users
        window.location.reload();
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <section className="w-full p-4">
      <div className="p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mt-14">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              User Management
            </h1>
            <p className="py-1 text-gray-600">
              Manage tenants, landlords, and administrators
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium hover:bg-gray-200">
              <DownloadCloud className="h-4 w-4" />
              Export
            </button>

            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
              onClick={()=>{
                setShowAddUser(true);
              }}
            >
              <UserPlus2 className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-between rounded-lg bg-blue-50 hover:border hover:border-blue-300 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <Users className="text-white" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Total Users</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={totalUsers} duration={2} separator="," />
              </h2>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 hover:border hover:border-gray-300 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-300">
              <Verified className="text-gray-800" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Tenants</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={users.filter((u)=> u.role === "Tenant").length} duration={2} separator="," />
              </h2>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-green-50 hover:border hover:border-green-300 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-700">
              <Verified className="text-white" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Landlords</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={users.filter((u)=> u.role==="Landlord").length} duration={2} />
              </h2>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-yellow-50 hover:border hover:border-yellow-300 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700">
              <Clock className="text-white" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Pending Approval</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={users.filter((u)=> u.approval_status==="pending").length} duration={2} />
              </h2>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-10 rounded-lg bg-gray-50 p-4">
          <form className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full rounded-lg px-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* TABLE */}
          <div className="mt-6 overflow-visible rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-gray-100 text-left">
                <tr className="text-sm">
                  <th className="p-3">No</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Verified</th>
                  <th className="p-3">Approval Status</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody className="">
                {currentUsers.map((user, index) =>  (
                  <tr key={user.id} className="hover:bg-gray-50 py-1 text-sm border-b border-gray-200">
                    <td className="p-3">{indexOfFirstUser + index + 1}</td>
                    <td className="p-3">{user.first_name} {user.last_name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone_number}</td>
                    <td className="p-3">{user.role}</td>

                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          user.is_verified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_verified ? "Verified" : "Not Verified"}
                      </span>
                    </td>

                    {/* <td className="p-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                        {user.account_status}
                      </span>
                    </td> */}

                    <td className="p-3">
                      <StatusBadge status={user.approval_status}/>
                    </td>

                    <td className="p-3">
                      {new Date(user.created_at).toLocaleDateString("en-GB")}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(user.email);
                        }}
                        className="rounded p-1 hover:bg-gray-200"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenuId === user.email && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 top-10 z-50 w-44 rounded-lg border bg-white shadow-lg"
                        >
                          <button className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            onClick={()=>{
                              // store clicked user
                              setSelectedUser(user);
                              // open modal
                              setShowDetailsModal(true);
                              // close menu
                              setOpenMenuId(null);
                            }}
                          >
                            <Eye size={16} /> View details
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowApproveModal(true);
                              setOpenMenuId(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100"
                          >
                            <BookDown size={16} /> Approve
                          </button>

                          <button className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 text-green-500"
                            onClick={()=>{
                              setSelectedUser(user);
                              setShowVerifyModal(true);
                              setOpenMenuId(null);
                            }}
                          >
                            <Verified size={16}/>
                            Verify
                            </button>

                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                              openEditModal(user);
                              setOpenMenuId(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50"
                          >
                            <RefreshCw size={16} /> Edit
                          </button>

                          <button className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50">
                            <Flag size={16} /> Block
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* pagination UI */}
            <div className="flex justify-center items-center gap-2 p-4 border-t">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
              >
                Next
              </button>
            </div>


            {/* view details modal */}
            {showDetailsModal && selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center 
                              bg-black/50 backdrop-blur-sm p-4">

                <div className="bg-white w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl 
                                overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                  {/* HEADER */}
                  <div className="flex items-center justify-between px-8 py-4 border-b bg-gray-50">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        User Profile Overview
                      </p>
                    </div>

                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-gray-400 hover:text-red-500 text-xl font-bold transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* BODY */}
                  <div className="px-8 py-8 space-y-8 max-h-[60vh] overflow-y-auto">

                    {/* PERSONAL INFORMATION */}
                    <Section title="Personal Information">
                      <InfoItem icon={<Mail size={18} />} label="Email" value={selectedUser.email} />
                      <InfoItem icon={<Phone size={18} />} label="Phone" value={selectedUser.phone_number} />
                      <InfoItem icon={<Phone size={18} />} label="Alternative Phone" value={selectedUser.alt_phone_number} />
                      <InfoItem icon={<Hash size={18} />} label="ID Number" value={selectedUser.id_number} />
                      <InfoItem icon={<UserPlus size={18} />} label="Role" value={selectedUser.role} />

                      <InfoItem
                        icon={<CheckCircle2 size={18} />}
                        label="Account Status"
                        value={
                          <StatusBadge status={selectedUser.account_status} />
                        }
                      />

                      <InfoItem
                        icon={<CheckCircle2 size={18} />}
                        label="Approval Status"
                        value={
                          <StatusBadge status={selectedUser.approval_status} />
                        }
                      />

                      <InfoItem
                        icon={<Verified size={18} />}
                        label="Verification"
                        value={
                          selectedUser.is_verified ? (
                            <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                              Verified
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600 font-medium">
                              Not Verified
                            </span>
                          )
                        }
                      />
                    </Section>

                    {/* PROPERTY INFORMATION */}
                    <Section title="Property Information">
                      <InfoItem icon={<Home size={18} />} label="Apartment" value={selectedUser.apartment_name} />
                      <InfoItem icon={<Hash size={18} />} label="Unit Number" value={selectedUser.house_number} />
                      <InfoItem icon={<UserCog2 size={18} />} label="Landlord" value="—" />
                    </Section>

                    {/* ACCOUNT INFORMATION */}
                    <Section title="Account Information">
                      <InfoItem icon={<Hash size={18} />} label="Reference" value={selectedUser.reference} />
                      <InfoItem
                        icon={<Clock size={18} />}
                        label="Joined"
                        value={formatDate(selectedUser.created_at)}
                      />
                      <InfoItem
                        icon={<Clock size={18} />}
                        label="Last Login"
                        value={selectedUser.last_login ? formatDate(selectedUser.last_login) : "Never"}
                      />
                    </Section>

                    {/* SUBSCRIPTION INFORMATION */}
                    <div className="rounded-xl p-6 bg-gradient-to-r 
                                    from-blue-50 via-indigo-50 to-purple-50 
                                    border border-indigo-100 shadow-sm">

                      <h3 className="text-lg font-semibold text-indigo-700 mb-6">
                        Subscription Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        <InfoItem
                          icon={<CheckCircle2 size={18} />}
                          label="Subscription Status"
                          value={<SubscriptionBadge status={selectedUser.subscription_status} />}
                        />

                        <InfoItem
                          icon={<Clock size={18} />}
                          label="Trial Start Date"
                          value={formatDate(selectedUser.trial_start_date)}
                        />

                        <InfoItem
                          icon={<Clock size={18} />}
                          label="Trial End Date"
                          value={formatDate(selectedUser.trial_end_date)}
                        />

                        <InfoItem
                          icon={<Clock size={18} />}
                          label="Subscription Start"
                          value={formatDate(selectedUser.subscription_start_date)}
                        />

                        <InfoItem
                          icon={<Clock size={18} />}
                          label="Subscription End"
                          value={formatDate(selectedUser.subscription_end_date)}
                        />

                      </div>
                    </div>

                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-end px-8 py-4 border-t bg-gray-50">
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium"
                    >
                      Close
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* edit modal */}
            {showEditModal && selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-lg p-6">

                  <h2 className="text-xl font-bold mb-4 text-blue-600">
                    Edit User
                  </h2>

                  <div className="grid grid-cols-2 gap-3">

                    <div>
                      <label>First Name</label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label>Last Name</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div className="col-span-2">
                      <label>Email</label>
                      <input
                        value={selectedUser.email}
                        disabled
                        className="w-full border rounded p-2 bg-gray-100"
                      />
                    </div>

                    <div>
                      <label>Phone</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label>Alt Phone</label>
                      <input
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value)}
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label>Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border rounded p-2"
                      >
                        <option value="Tenant">Tenant</option>
                        <option value="Landlord">Landlord</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label>Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border rounded p-2"
                      >
                        <option>Active</option>
                        <option>Pending</option>
                        <option>Suspended</option>
                        <option>Verified</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={handleSaveChanges}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* approve confirmation modal */}
            {showApproveModal && selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6
                                transform transition-all duration-300">

                  <h2 className="text-lg font-bold mb-2">Approve User</h2>

                  <p className="text-sm text-gray-600">
                    Are you sure you want to approve <strong>{selectedUser.first_name} {selectedUser.last_name}</strong>?
                  </p>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowApproveModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" onClick={handleApprove}>
                      Approve
                    </button>
                  </div>

                </div>
              </div>
            )}

           {showVerifyModal && selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8">

                  {/* Header */}
                  <div className="flex justify-between items-center border-b pb-3 mb-6">
                    <div>
                      <h1 className="text-xl font-bold text-blue-600">{selectedUser.first_name} {selectedUser.last_name}</h1>
                      <p className="text-md font-semibold">User Verification</p>
                    </div>
                    <button
                      onClick={() => setShowVerifyModal(false)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* LEFT SIDE */}
                    <div className="space-y-6">

                      {/* Identity Info */}
                      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                        <h2 className="font-semibold text-green-600 mb-3">
                          1. User Identity Information
                        </h2>

                        <div className="space-y-2 text-sm">
                          <p><span className="font-semibold">Full Name:</span> {selectedUser.first_name} {selectedUser.last_name}</p>
                          <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                          <p><span className="font-semibold">Phone:</span> {selectedUser.phone_number}</p>
                          <p><span className="font-semibold">Alt Phone:</span> {selectedUser.alt_phone_number}</p>
                          <p>
                            <span className="font-semibold">Role:</span> 
                            <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                              {selectedUser.role}
                            </span>
                          </p>
                          <p><span className="font-semibold">ID Number:</span> {selectedUser.id_number}</p>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold text-green-600 mb-3">
                          2. Verification Status
                        </h3>

                        <div className="text-sm">
                          <p>
                            <span className="font-semibold">Email Verified:</span>{" "}
                            <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                              Yes
                            </span>
                          </p>
                        </div>
                      </div>

                    </div>


                    {/* RIGHT SIDE */}
                    <div className="space-y-6">

                      {/* Supporting Evidence */}
                      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                        <h2 className="font-semibold text-green-600 mb-3">
                          3. Supporting Evidence
                        </h2>

                        <div className="space-y-2 text-sm">
                          <p><span className="font-semibold">Uploaded ID:</span> Document preview</p>
                          <p><span className="font-semibold">Ownership Proof:</span> (Landlord only)</p>
                          <p><span className="font-semibold">Profile Photo:</span></p>
                        </div>
                      </div>

                      {/* Risk Info */}
                      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold text-green-600 mb-3">
                          4. Risk / Validation Clues
                        </h3>

                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-semibold">Registration Date:</span>{" "}
                            {new Date(selectedUser.created_at).toLocaleDateString("en-GB")}
                          </p>

                          <p>
                            <span className="font-semibold">Last Login:</span>{" "}
                            {new Date(selectedUser.created_at).toLocaleDateString("en-GB")}
                          </p>

                          <p>
                            <span className="font-semibold">Properties Owned:</span> —
                          </p>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 mt-8 border-t pt-4">

                    <button className="px-6 py-2 font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                      Reject
                    </button>

                    <button className="px-6 py-2 font-semibold text-green-600 bg-green-100 rounded-lg hover:bg-green-200">
                      Confirm
                    </button>

                    <button
                      onClick={() => setShowVerifyModal(false)}
                      className="px-6 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              </div>
            )}

            {/* open add user */}
            {showAddUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="max-w-2xl bg-gray-100 rounded-lg shadow-xl p-6">
                  <h1 className="text-xl font-bold text-gray-800 py-2">Add User</h1>
                  <form action="" className="space-y-3" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="">
                        <label htmlFor="" className="text-md text-gray-800">First Name</label>
                        <input type="text" placeholder="Enter Your First Name" className="w-full p-2 mt-1 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" value={formData.first_name} onChange={handleChange} id="first_name"/>
                      </div>
                      <div className="">
                        <label htmlFor="" className="text-md text-gray-800">Last Name</label>
                        <input type="text" placeholder="Enter Your Last Name" className="w-full p-2 mt-1 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" value={formData.last_name} onChange={handleChange} id="last_name"/>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="" className="text-md text-gray-800">Email</label>
                      <input type="email" placeholder="Enter Your Email" className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" value={formData.email} onChange={handleChange} id="email"/>
                    </div>
                    <div>
                      <label htmlFor="role" className="text-md text-gray-800">Role</label>
                      <select className="w-full p-2 mt-1 border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500 rounded-lg text-sm" value={formData.role} onChange={handleChange} id="role">
                        <option value="">Choose Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Tenant">Tenant</option>
                        <option value="Landlord">Landlord</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="" className="text-md text-gray-800">ID Number</label>
                      <input type="number" placeholder="Enter Your ID Number" className="w-full p-2 mt-1 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" value={formData.id_number} onChange={handleChange} id="id_number"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="">
                        <label htmlFor="" className="text-md text-gray-800">Phone Number</label>
                        <input type="tel" placeholder="e.g 0700000000" className="w-full p-2 mt-1 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" value={formData.phone_number} onChange={handleChange} id="phone_number"/>
                      </div>
                      <div className="">
                        <label htmlFor="" className="text-md text-gray-800">Alternative Phone Number</label>
                        <input type="tel" placeholder="e.g 0700000000" className="w-full p-2 mt-1 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" value={formData.alt_phone_number} onChange={handleChange} id="alt_phone_number"/>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="" className="text-md text-gray-800 mb-2">Create Password</label>
                        <div className="relative">
                          <FaLock size={18} className="absolute left-3 top-3 text-gray-400"/>
                          <input type="password" placeholder="Create Password" className="w-full p-2 text-sm mt-1 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" value={formData.password} onChange={handleChange} id="password"/>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="" className="text-md text-gray-800 mb-2">Confirm Password</label>
                        <div className="relative">
                          <FaLock size={18} className="absolute left-3 top-3 text-gray-400"/>
                          <input type="password" placeholder="Confirm Password" className="w-full p-2 text-sm mt-1 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" value={formData.confirmPassword} onChange={handleChange} id="confirmPassword"/>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button className="py-2 px-8 text-md font-bold text-gray-800 border border-gray-300 hover:bg-gray-300 rounded-lg" onClick={()=>setShowAddUser(false)}>Cancel</button>
                      <button type="submit" className="py-2 px-8 text-md font-bold text-gray-800 bg-green-400 hover:bg-green-600 rounded-lg">Confirm</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading && (
              <div className="p-4 text-center text-gray-500">
                Loading users...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminUsers;
