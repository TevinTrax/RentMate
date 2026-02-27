import {
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
  VerifiedIcon
} from "lucide-react";
import { FaLock } from "react-icons/fa6";

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

  const [showAddUser, setShowAddUsser]= useState(false);

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

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/");
        const data = await res.json();

        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* ---------------- CLOSE DROPDOWN OUTSIDE CLICK ---------------- */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- TOGGLE MENU ---------------- */
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
                setShowAddUsser(true);
              }}
            >
              <UserPlus2 className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4 shadow-md transition hover:scale-105">
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

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-md transition hover:scale-105">
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

          <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 shadow-md transition hover:scale-105">
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

          <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4 shadow-md transition hover:scale-105">
            <div className="mr-3 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700">
              <Clock className="text-white" size={30} />
            </div>

            <div className="flex-1">
              <p className="text-gray-600">Pending Approval</p>
              <h2 className="py-1 text-2xl font-bold text-gray-800">
                <CountUp end={users.filter((u)=> u.status==="Pending").length} duration={2} />
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
                  <th className="p-3">Status</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody className="">
                {currentUsers.map((user, index) =>  (
                  <tr key={user.email} className="hover:bg-gray-50 py-1 text-sm border-b border-gray-200">
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

                    <td className="p-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                        {user.status}
                      </span>
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
                            <VerifiedIcon size={16}/>
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-xl max-w-3xl p-6
                                transform transition-all duration-300 scale-100">

                  <h2 className="text-xl font-bold mb-2 text-blue-500">User Details</h2>

                  <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                      <h1 className="text-md font-bold text-green-500">1. Personal Information</h1>
                      <div className="space-y-2 text-sm p-2">
                        <p><strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Role:</strong> {selectedUser.role}</p>
                        <p><strong>Phone:</strong> {selectedUser.phone_number}</p>
                        <p><strong>Alternative Phone Number:</strong> {selectedUser.alt_phone_number}</p>
                        <p><strong>Status:</strong> {selectedUser.status}</p>
                        <p><strong>Verification:</strong> {selectedUser.is_verified}</p>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-md font-bold text-green-500">2. Address / Property Info</h2>
                      <div className="space-y-2 text-sm p-2">
                        <p><strong>Apartment Name:</strong> {selectedUser.apartment_name}</p>
                        <p><strong>House/Unit Number:</strong> {selectedUser.house_number}</p>
                        <p><strong>Landlord:</strong> {}</p>
                      </div>
                      <h3 className="text-md font-bold text-green-500">3. Account / System Info</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Reference:</strong> {selectedUser.reference}</p>
                        <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString("en-GB")}</p>
                        <p><strong>Last Login:</strong> {new Date(selectedUser.created_at).toLocaleDateString("en-GB")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
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
                        <option value="tenant">Tenant</option>
                        <option value="landlord">Landlord</option>
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

                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
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
                    <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                      Approve
                    </button>
                  </div>

                </div>
              </div>
            )}

            {showVerifyModal && selectedUser &&(
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="max-w-3xl bg-gray-50 rounded-lg shadow-xl p-6">
                  <h1 className="text-lg text-blue-500 font-bold py-2">Verify User</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                      <h2 className="text-md text-green-500 font-bold py-1">1. User Identity Information</h2>
                      <div className="space-y-2 text-sm">
                        <p><strong>Full Name:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Phone Number:</strong> {selectedUser.phone_number}</p>
                        <p><strong>Alternative Phone Number:</strong> {selectedUser.alt_phone_number}</p>
                        <p><strong>Role:</strong> {selectedUser.role}</p>
                        <p><strong>ID Number:</strong> {selectedUser.id_number}</p>
                      </div>
                      <h3 className="text-md text-green-500 font-bold py-1">2. Verification Status Indicator</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Email Verified:</strong> Yes/No</p>
                      </div>
                    </div>
                    <div className="">
                      <h2 className="text-md text-green-500 font-bold py-1">3. Supporting Evidence</h2>
                      <div className="space-y-2 text-sm">
                        <p><strong>Uploaded ID/ Document:</strong></p>
                        <p><strong>Proof of ownership (landlords):</strong></p>
                        <p><strong>Profile photo:</strong></p>
                      </div>
                      <h3 className="text-md text-green-500 font-bold py-1">4. Risk / Validation Clues</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Registration Date:</strong> {new Date(selectedUser.created_at).toLocaleDateString("en-GB")}</p>
                        <p><strong>Last Login:</strong> {new Date(selectedUser.created_at).toLocaleDateString("en-GB")}</p>
                        <p><strong>Number of Properties (landlord):</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-2">
                    <button className="py-2 px-8 text-md font-bold text-red-500 bg-red-100 rounded-lg hover:bg-red-200">Reject</button>
                    <button className="py-2 px-8 text-md font-bold text-green-500 bg-green-100 rounded-lg hover:bg-green-200">Confirm</button>
                    <button className="py-2 px-8 text-md font-bold text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={()=>setShowVerifyModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* open add user */}
            {showAddUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="max-w-2xl bg-gray-100 rounded-lg shadow-xl p-6">
                  <h1 className="text-xl font-bold text-gray-800 py-2">Add User</h1>
                  <form action="" className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="">
                        <label htmlFor="" className="text-md text-gray-800">First Name</label>
                        <input type="text" placeholder="Enter Your First Name" className="w-full p-2 mt-1 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500"/>
                      </div>
                      <div className="">
                        <label htmlFor="" className="text-md text-gray-800">Last Name</label>
                        <input type="text" placeholder="Enter Your Last Name" className="w-full p-2 mt-1 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500"/>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="" className="text-md text-gray-800">Email</label>
                      <input type="email" placeholder="Enter Your Email" className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500"/>
                    </div>
                    <div>
                      <label htmlFor="" className="text-md text-gray-800">Role</label>
                      <select name="" id="" className="w-full p-2 mt-1 border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500 rounded-lg text-sm">
                        <option value="">Choose Role</option>
                        <option value="admin">Admin</option>
                        <option value="tenant">Tenant</option>
                        <option value="landlord">Landlord</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="" className="text-md text-gray-800">ID Number</label>
                      <input type="number" placeholder="Enter Your ID Number" className="w-full p-2 mt-1 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="">
                        <label htmlFor="" className="text-md text-gray-800">Phone Number</label>
                        <input type="tel" placeholder="e.g 0700000000" className="w-full p-2 mt-1 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500"/>
                      </div>
                      <div className="">
                        <label htmlFor="" className="text-md text-gray-800">Alternative Phone Number</label>
                        <input type="tel" placeholder="e.g 0700000000" className="w-full p-2 mt-1 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500"/>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="" className="text-md text-gray-800 mb-2">Create Password</label>
                        <div className="relative">
                          <FaLock size={18} className="absolute left-3 top-3 text-gray-400"/>
                          <input type="password" placeholder="Create Password" className="w-full p-2 text-sm mt-1 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="" className="text-md text-gray-800 mb-2">Confirm Password</label>
                        <div className="relative">
                          <FaLock size={18} className="absolute left-3 top-3 text-gray-400"/>
                          <input type="password" placeholder="Confirm Password" className="w-full p-2 text-sm mt-1 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 ring-blue-500" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button className="py-2 px-8 text-md font-bold text-gray-800 border border-gray-300 hover:bg-gray-300 rounded-lg" onClick={()=>showAddUser(false)}>Cancel</button>
                      <button className="py-2 px-8 text-md font-bold text-gray-800 bg-green-400 hover:bg-green-600 rounded-lg">Confirm</button>
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
