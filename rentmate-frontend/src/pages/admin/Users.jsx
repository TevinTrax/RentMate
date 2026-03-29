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
  Mail,
  Phone,
  CheckCircle2,
  Hash,
  UserCog2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import StatusBadge from "../../components/StatusBadge";
import CountUp from "react-countup";
import { useState, useEffect, useRef, useMemo } from "react";

function AdminUsers() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const dropdownRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Edit form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // Add user form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    id_number: "",
    phone_number: "",
    alt_phone_number: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // -------------------------------
  // Helpers
  // -------------------------------
  const normalizeKenyanPhone = (phone) => {
    if (!phone) return "";
    let cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");

    if (cleaned.startsWith("+254")) {
      cleaned = "254" + cleaned.slice(4);
    }

    if (cleaned.startsWith("07") || cleaned.startsWith("01")) {
      cleaned = "254" + cleaned.slice(1);
    }

    return cleaned;
  };

  const isValidKenyanPhone = (phone) => {
    const cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");

    const patterns = [
      /^07\d{8}$/,
      /^01\d{8}$/,
      /^2547\d{8}$/,
      /^2541\d{8}$/,
      /^\+2547\d{8}$/,
      /^\+2541\d{8}$/,
    ];

    return patterns.some((pattern) => pattern.test(cleaned));
  };

  const isValidKenyanID = (id) => {
    const cleaned = String(id).trim();
    return /^\d{7,8}$/.test(cleaned);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const totalUsers = users.length;

  // -------------------------------
  // Fetch Users
  // -------------------------------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -------------------------------
  // Outside Click Close
  // -------------------------------
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------------
  // Search Filter
  // -------------------------------
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) return users;

    return users.filter((user) => {
      const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
      const email = (user.email || "").toLowerCase();
      const phone = (user.phone_number || "").toLowerCase();
      const role = (user.role || "").toLowerCase();

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        phone.includes(term) ||
        role.includes(term)
      );
    });
  }, [users, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const indexOfLastUser = safeCurrentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // -------------------------------
  // Toggle Menu
  // -------------------------------
  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // -------------------------------
  // Open Edit Modal
  // -------------------------------
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setPhone(user.phone_number || "");
    setAltPhone(user.alt_phone_number || "");
    setRole(user.role || "");
    setStatus(user.account_status || "");
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  // -------------------------------
  // Password Rules
  // -------------------------------
  const passwordChecks = useMemo(() => {
    const password = formData.password || "";
    const confirmPassword = formData.confirmPassword || "";
    const firstName = (formData.first_name || "").toLowerCase().trim();
    const lastName = (formData.last_name || "").toLowerCase().trim();
    const email = (formData.email || "").split("@")[0]?.toLowerCase().trim() || "";

    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      noSpaces: !/\s/.test(password),
      noFirstName: firstName ? !password.toLowerCase().includes(firstName) : true,
      noLastName: lastName ? !password.toLowerCase().includes(lastName) : true,
      noEmailName: email ? !password.toLowerCase().includes(email) : true,
      passwordsMatch:
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword,
    };
  }, [formData]);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (passwordChecks.minLength) score++;
    if (passwordChecks.hasUpper) score++;
    if (passwordChecks.hasLower) score++;
    if (passwordChecks.hasNumber) score++;
    if (passwordChecks.hasSpecial) score++;
    if (passwordChecks.noSpaces) score++;
    if (passwordChecks.noFirstName) score++;
    if (passwordChecks.noLastName) score++;
    if (passwordChecks.noEmailName) score++;
    return score;
  }, [passwordChecks]);

  const getStrength = () => {
    if (!formData.password) {
      return {
        label: "No Password",
        width: "0%",
        color: "bg-gray-300",
        text: "text-gray-500",
      };
    }

    if (passwordScore <= 3) {
      return {
        label: "Weak",
        width: "25%",
        color: "bg-red-500",
        text: "text-red-600",
      };
    }

    if (passwordScore <= 5) {
      return {
        label: "Fair",
        width: "50%",
        color: "bg-yellow-500",
        text: "text-yellow-600",
      };
    }

    if (passwordScore <= 7) {
      return {
        label: "Good",
        width: "75%",
        color: "bg-blue-500",
        text: "text-blue-600",
      };
    }

    return {
      label: "Strong",
      width: "100%",
      color: "bg-green-500",
      text: "text-green-600",
    };
  };

  const strength = getStrength();

  const isPasswordValid =
    passwordChecks.minLength &&
    passwordChecks.hasUpper &&
    passwordChecks.hasLower &&
    passwordChecks.hasNumber &&
    passwordChecks.hasSpecial &&
    passwordChecks.noSpaces &&
    passwordChecks.noFirstName &&
    passwordChecks.noLastName &&
    passwordChecks.noEmailName &&
    passwordChecks.passwordsMatch;

  // -------------------------------
  // Validation
  // -------------------------------
  const validateField = (id, value) => {
    let error = "";

    switch (id) {
      case "first_name":
        if (!value.trim()) error = "First name is required";
        break;

      case "last_name":
        if (!value.trim()) error = "Last name is required";
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!isValidEmail(value)) {
          error = "Enter a valid email address";
        }
        break;

      case "role":
        if (!value.trim()) error = "Please choose a role";
        break;

      case "phone_number":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!isValidKenyanPhone(value)) {
          error = "Enter a valid Kenyan phone number";
        }
        break;

      case "alt_phone_number":
        if (value.trim() && !isValidKenyanPhone(value)) {
          error = "Enter a valid alternative Kenyan phone number";
        } else if (
          value.trim() &&
          normalizeKenyanPhone(value) === normalizeKenyanPhone(formData.phone_number)
        ) {
          error = "Alternative phone number must be different";
        }
        break;

      case "id_number":
        if (!String(value).trim()) {
          error = "ID number is required";
        } else if (!isValidKenyanID(value)) {
          error = "Kenyan ID must be 7 or 8 digits";
        }
        break;

      case "password":
        if (!value.trim()) error = "Password is required";
        break;

      case "confirmPassword":
        if (!value.trim()) {
          error = "Please confirm password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [id]: error,
    }));

    return error === "";
  };

  const validateAllFields = () => {
    const validations = [
      validateField("first_name", formData.first_name),
      validateField("last_name", formData.last_name),
      validateField("email", formData.email),
      validateField("role", formData.role),
      validateField("id_number", formData.id_number),
      validateField("phone_number", formData.phone_number),
      validateField("alt_phone_number", formData.alt_phone_number || ""),
      validateField("password", formData.password),
      validateField("confirmPassword", formData.confirmPassword),
    ];

    return validations.every(Boolean) && isPasswordValid;
  };

  // -------------------------------
  // Handle Change
  // -------------------------------
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    validateField(id, value);
  };

  // -------------------------------
  // Submit Add User
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const valid = validateAllFields();

    if (!valid) {
      alert("Please fix all validation errors before submitting.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        id_number: String(formData.id_number).trim(),
        phone_number: normalizeKenyanPhone(formData.phone_number),
        alt_phone_number: formData.alt_phone_number
          ? normalizeKenyanPhone(formData.alt_phone_number)
          : "",
        role: formData.role,
        password: formData.password,
      };

      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to add user");
        return;
      }

      alert("User added successfully!");

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        id_number: "",
        phone_number: "",
        alt_phone_number: "",
        role: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({});
      setShowAddUser(false);
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Something went wrong");
    }
  };

  // -------------------------------
  // Approve Landlord
  // -------------------------------
  const handleApprove = async () => {
    if (!selectedUser) return;

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
      fetchUsers();
    } catch (error) {
      console.error("Approve error:", error);
      alert("Something went wrong");
    }
  };

  // -------------------------------
  // Save Edit Changes
  // -------------------------------
  const handleSaveChanges = async () => {
    if (!selectedUser) return;

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_number: normalizeKenyanPhone(phone),
          alt_phone_number: altPhone ? normalizeKenyanPhone(altPhone) : "",
          role: role,
          account_status: status,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("User updated successfully");
        setShowEditModal(false);
        fetchUsers();
      } else {
        alert(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // -------------------------------
  // Delete User
  // -------------------------------
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/users/delete-users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || "Failed to delete user");
      }

      alert(data.message || "User deleted successfully");

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setShowDetailsModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Network error: " + error.message);
    }
  };

  // -------------------------------
  // Components
  // -------------------------------
  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
        <p className="font-medium text-gray-800">{value || "—"}</p>
      </div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="bg-gray-50 rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-blue-600 mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">{children}</div>
    </div>
  );

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

  const RuleItem = ({ passed, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {passed ? (
        <FaCheckCircle className="text-green-500 text-xs" />
      ) : (
        <FaTimesCircle className="text-red-400 text-xs" />
      )}
      <span className={passed ? "text-green-700" : "text-gray-600"}>{text}</span>
    </div>
  );

  const addUserFormValid =
    formData.first_name.trim() &&
    formData.last_name.trim() &&
    formData.email.trim() &&
    formData.role.trim() &&
    formData.id_number.trim() &&
    formData.phone_number.trim() &&
    isPasswordValid &&
    !Object.values(errors).some((err) => err);

  return (
    <section className="w-full p-4">
      <div className="p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mt-14">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="py-1 text-gray-600">
              Manage tenants, landlords, and administrators
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium hover:bg-gray-200">
              <DownloadCloud className="h-4 w-4" />
              Export
            </button>

            <button
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
              onClick={() => setShowAddUser(true)}
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
                <CountUp
                  end={users.filter((u) => u.role === "Tenant").length}
                  duration={2}
                  separator=","
                />
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
                <CountUp
                  end={users.filter((u) => u.role === "Landlord").length}
                  duration={2}
                />
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
                <CountUp
                  end={users.filter((u) => u.approval_status === "pending").length}
                  duration={2}
                />
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
                placeholder="Search users by name, email, phone or role..."
                className="w-full rounded-lg px-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

              <tbody>
                {!loading && currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 py-1 text-sm border-b border-gray-200"
                    >
                      <td className="p-3">{indexOfFirstUser + index + 1}</td>
                      <td className="p-3">
                        {user.first_name} {user.last_name}
                      </td>
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
                        <StatusBadge status={user.approval_status} />
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
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDetailsModal(true);
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

                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 text-green-500"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowVerifyModal(true);
                                setOpenMenuId(null);
                              }}
                            >
                              <Verified size={16} />
                              Verify
                            </button>

                            <button
                              onClick={() => {
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
                  ))
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-2 p-4 border-t">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                disabled={safeCurrentPage === 1}
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
                      safeCurrentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                disabled={safeCurrentPage === totalPages}
              >
                Next
              </button>
            </div>

            {/* VIEW DETAILS MODAL */}
            {showDetailsModal && selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between px-8 py-4 border-b bg-gray-50">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">User Profile Overview</p>
                    </div>

                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-gray-400 hover:text-red-500 text-xl font-bold transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="px-8 py-8 space-y-8 max-h-[60vh] overflow-y-auto">
                    <Section title="Personal Information">
                      <InfoItem icon={<Mail size={18} />} label="Email" value={selectedUser.email || "—"} />
                      <InfoItem icon={<Phone size={18} />} label="Phone" value={selectedUser.phone_number || "—"} />
                      <InfoItem icon={<Phone size={18} />} label="Alternative Phone" value={selectedUser.alt_phone_number || "—"} />
                      <InfoItem icon={<Hash size={18} />} label="ID Number" value={selectedUser.id_number || "—"} />
                      <InfoItem icon={<UserPlus size={18} />} label="Role" value={selectedUser.role || "—"} />

                      <InfoItem
                        icon={<CheckCircle2 size={18} />}
                        label="Account Status"
                        value={<StatusBadge status={selectedUser.account_status} />}
                      />

                      <InfoItem
                        icon={<CheckCircle2 size={18} />}
                        label="Approval Status"
                        value={<StatusBadge status={selectedUser.approval_status} />}
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

                    <Section title="Property Information">
                      <InfoItem icon={<Home size={18} />} label="Apartment" value={selectedUser.apartment_name || "—"} />
                      <InfoItem icon={<Hash size={18} />} label="Unit Number" value={selectedUser.house_number || "—"} />
                      <InfoItem icon={<UserCog2 size={18} />} label="Landlord" value="—" />
                    </Section>

                    <Section title="Account Information">
                      <InfoItem icon={<Hash size={18} />} label="Reference" value={selectedUser.reference || "—"} />
                      <InfoItem
                        icon={<Clock size={18} />}
                        label="Joined"
                        value={selectedUser.created_at ? formatDate(selectedUser.created_at) : "—"}
                      />
                      <InfoItem
                        icon={<Clock size={18} />}
                        label="Last Login"
                        value={selectedUser.last_login ? formatDate(selectedUser.last_login) : "Never"}
                      />
                    </Section>

                    <div className="rounded-xl p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-100 shadow-sm">
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
                          value={selectedUser.trial_start_date ? formatDate(selectedUser.trial_start_date) : "—"}
                        />

                        <InfoItem
                          icon={<Clock size={18} />}
                          label="Trial End Date"
                          value={selectedUser.trial_end_date ? formatDate(selectedUser.trial_end_date) : "—"}
                        />

                        <InfoItem
                          icon={<Clock size={18} />}
                          label="Subscription Start"
                          value={selectedUser.subscription_start_date ? formatDate(selectedUser.subscription_start_date) : "—"}
                        />

                        <InfoItem
                          icon={<Clock size={18} />}
                          label="Subscription End"
                          value={selectedUser.subscription_end_date ? formatDate(selectedUser.subscription_end_date) : "—"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end items-center gap-3 px-8 py-4 border-t bg-gray-50">
                    <button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition font-medium shadow-sm"
                    >
                      Delete User
                    </button>

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

            {/* EDIT MODAL */}
            {showEditModal && selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-lg p-6">
                  <h2 className="text-xl font-bold mb-4 text-blue-600">Edit User</h2>

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
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label>Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border rounded p-2"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Verified">Verified</option>
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

                    <button
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* APPROVE MODAL */}
            {showApproveModal && selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 transform transition-all duration-300">
                  <h2 className="text-lg font-bold mb-2">Approve User</h2>

                  <p className="text-sm text-gray-600">
                    Are you sure you want to approve{" "}
                    <strong>
                      {selectedUser.first_name} {selectedUser.last_name}
                    </strong>
                    ?
                  </p>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowApproveModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                      onClick={handleApprove}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VERIFY MODAL */}
            {showVerifyModal && selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8">
                  <div className="flex justify-between items-center border-b pb-3 mb-6">
                    <div>
                      <h1 className="text-xl font-bold text-blue-600">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </h1>
                      <p className="text-md font-semibold">User Verification</p>
                    </div>
                    <button
                      onClick={() => setShowVerifyModal(false)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                        <h2 className="font-semibold text-green-600 mb-3">
                          1. User Identity Information
                        </h2>

                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-semibold">Full Name:</span>{" "}
                            {selectedUser.first_name} {selectedUser.last_name}
                          </p>
                          <p>
                            <span className="font-semibold">Email:</span>{" "}
                            {selectedUser.email}
                          </p>
                          <p>
                            <span className="font-semibold">Phone:</span>{" "}
                            {selectedUser.phone_number}
                          </p>
                          <p>
                            <span className="font-semibold">Alt Phone:</span>{" "}
                            {selectedUser.alt_phone_number || "—"}
                          </p>
                          <p>
                            <span className="font-semibold">Role:</span>
                            <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                              {selectedUser.role}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold">ID Number:</span>{" "}
                            {selectedUser.id_number}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold text-green-600 mb-3">
                          2. Verification Status
                        </h3>

                        <div className="text-sm space-y-2">
                          <p>
                            <span className="font-semibold">Email Verified:</span>{" "}
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                selectedUser.is_verified
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {selectedUser.is_verified ? "Yes" : "No"}
                            </span>
                          </p>

                          <p className="text-xs text-gray-500">
                            Users should become verified automatically after successful OTP verification during login.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                        <h2 className="font-semibold text-green-600 mb-3">
                          3. Supporting Evidence
                        </h2>

                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-semibold">Uploaded ID:</span>{" "}
                            Document preview
                          </p>
                          <p>
                            <span className="font-semibold">Ownership Proof:</span>{" "}
                            (Landlord only)
                          </p>
                          <p>
                            <span className="font-semibold">Profile Photo:</span> —
                          </p>
                        </div>
                      </div>

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
                            {selectedUser.last_login
                              ? new Date(selectedUser.last_login).toLocaleDateString("en-GB")
                              : "Never"}
                          </p>

                          <p>
                            <span className="font-semibold">Properties Owned:</span> —
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

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

            {/* ADD USER MODAL */}
            {showAddUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="max-w-2xl w-full bg-gray-100 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
                  <h1 className="text-xl font-bold text-gray-800 py-2">Add User</h1>

                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="text-md text-gray-800">First Name</label>
                        <input
                          type="text"
                          placeholder="Enter Your First Name"
                          className={`w-full p-2 mt-1 rounded-lg text-sm border focus:outline-none focus:ring-2 ${
                            errors.first_name
                              ? "border-red-400 ring-red-300"
                              : "border-gray-300 ring-blue-500"
                          }`}
                          value={formData.first_name}
                          onChange={handleChange}
                          id="first_name"
                        />
                        {errors.first_name && (
                          <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-md text-gray-800">Last Name</label>
                        <input
                          type="text"
                          placeholder="Enter Your Last Name"
                          className={`w-full p-2 mt-1 rounded-lg text-sm border focus:outline-none focus:ring-2 ${
                            errors.last_name
                              ? "border-red-400 ring-red-300"
                              : "border-gray-300 ring-blue-500"
                          }`}
                          value={formData.last_name}
                          onChange={handleChange}
                          id="last_name"
                        />
                        {errors.last_name && (
                          <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-md text-gray-800">Email</label>
                      <input
                        type="email"
                        placeholder="Enter Your Email"
                        className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 ${
                          errors.email
                            ? "border-red-400 ring-red-300"
                            : "border-gray-300 ring-blue-500"
                        }`}
                        value={formData.email}
                        onChange={handleChange}
                        id="email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="role" className="text-md text-gray-800">
                        Role
                      </label>
                      <select
                        className={`w-full p-2 mt-1 border focus:outline-none focus:ring-2 rounded-lg text-sm ${
                          errors.role
                            ? "border-red-400 ring-red-300"
                            : "border-gray-300 ring-blue-500"
                        }`}
                        value={formData.role}
                        onChange={handleChange}
                        id="role"
                      >
                        <option value="">Choose Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Tenant">Tenant</option>
                        <option value="Landlord">Landlord</option>
                      </select>
                      {errors.role && (
                        <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-md text-gray-800">ID Number</label>
                      <input
                        type="text"
                        placeholder="Enter Your ID Number"
                        className={`w-full p-2 mt-1 text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                          errors.id_number
                            ? "border-red-400 ring-red-300"
                            : "border-gray-300 ring-blue-500"
                        }`}
                        value={formData.id_number}
                        onChange={handleChange}
                        id="id_number"
                        maxLength={8}
                      />
                      {errors.id_number && (
                        <p className="text-red-500 text-xs mt-1">{errors.id_number}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-md text-gray-800">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="e.g 0712345678 or +254712345678"
                          className={`w-full p-2 mt-1 rounded-lg text-sm border focus:outline-none focus:ring-2 ${
                            errors.phone_number
                              ? "border-red-400 ring-red-300"
                              : "border-gray-300 ring-blue-500"
                          }`}
                          value={formData.phone_number}
                          onChange={handleChange}
                          id="phone_number"
                        />
                        {errors.phone_number && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-md text-gray-800">
                          Alternative Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g 0712345678 or +254712345678"
                          className={`w-full p-2 mt-1 rounded-lg text-sm border focus:outline-none focus:ring-2 ${
                            errors.alt_phone_number
                              ? "border-red-400 ring-red-300"
                              : "border-gray-300 ring-blue-500"
                          }`}
                          value={formData.alt_phone_number}
                          onChange={handleChange}
                          id="alt_phone_number"
                        />
                        {errors.alt_phone_number && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.alt_phone_number}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PASSWORD SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-md text-gray-800 mb-2">Create Password</label>
                        <div className="relative">
                          <FaLock size={18} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create Password"
                            className={`w-full p-2 text-sm mt-1 pl-10 pr-10 rounded-lg border focus:outline-none focus:ring-2 ${
                              errors.password
                                ? "border-red-400 ring-red-300"
                                : "border-gray-300 ring-blue-500"
                            }`}
                            value={formData.password}
                            onChange={handleChange}
                            id="password"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-md text-gray-800 mb-2">Confirm Password</label>
                        <div className="relative">
                          <FaLock size={18} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className={`w-full p-2 text-sm mt-1 pl-10 pr-10 rounded-lg border focus:outline-none focus:ring-2 ${
                              formData.confirmPassword
                                ? passwordChecks.passwordsMatch
                                  ? "border-green-400 ring-green-300"
                                  : "border-red-400 ring-red-300"
                                : "border-gray-300 ring-blue-500"
                            }`}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            id="confirmPassword"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash size={18} />
                            ) : (
                              <FaEye size={18} />
                            )}
                          </button>
                        </div>

                        {formData.confirmPassword && (
                          <p
                            className={`text-xs mt-1 ${
                              passwordChecks.passwordsMatch
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {passwordChecks.passwordsMatch
                              ? "Passwords match"
                              : "Passwords do not match"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PASSWORD STRENGTH */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-700">
                          Password Strength
                        </p>
                        <p className={`text-sm font-bold ${strength.text}`}>
                          {strength.label}
                        </p>
                      </div>

                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: strength.width }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                        <RuleItem passed={passwordChecks.minLength} text="At least 8 characters" />
                        <RuleItem passed={passwordChecks.hasUpper} text="Contains uppercase letter" />
                        <RuleItem passed={passwordChecks.hasLower} text="Contains lowercase letter" />
                        <RuleItem passed={passwordChecks.hasNumber} text="Contains a number" />
                        <RuleItem passed={passwordChecks.hasSpecial} text="Contains special character" />
                        <RuleItem passed={passwordChecks.noSpaces} text="Does not contain spaces" />
                        <RuleItem passed={passwordChecks.noFirstName} text="Does not include first name" />
                        <RuleItem passed={passwordChecks.noLastName} text="Does not include last name" />
                        <RuleItem passed={passwordChecks.noEmailName} text="Does not include email username" />
                        <RuleItem passed={passwordChecks.passwordsMatch} text="Passwords match" />
                      </div>
                    </div>

                    {/* OTP NOTICE */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="text-blue-600 mt-0.5" size={18} />
                        <div>
                          <p className="font-semibold text-blue-700 text-sm">
                            Verification Policy
                          </p>
                          <p className="text-sm text-blue-600 mt-1">
                            Newly created users will remain <strong>Not Verified</strong> until
                            they successfully log in and verify their OTP sent to email.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        className="py-2 px-8 text-md font-bold text-gray-800 border border-gray-300 hover:bg-gray-300 rounded-lg"
                        onClick={() => setShowAddUser(false)}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={!addUserFormValid}
                        className={`py-2 px-8 text-md font-bold rounded-lg ${
                          addUserFormValid
                            ? "text-gray-800 bg-green-400 hover:bg-green-600"
                            : "text-gray-500 bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading && (
              <div className="p-4 text-center text-gray-500">Loading users...</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminUsers;