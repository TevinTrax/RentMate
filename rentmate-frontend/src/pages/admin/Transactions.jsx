import {
  Search,
  DownloadCloud,
  MoreHorizontal,
  Eye,
  BookDown,
  RefreshCw,
  Flag,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AdminPaymentsTransactions() {
  // stores the ID of the open dropdown (null = none open)
  const [openMenuId, setOpenMenuId] = useState(null);
  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // toggle dropdown for a specific row
  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-2 mt-4">
      {/* Header */}
      <h1 className="text-lg font-bold text-gray-800">
        Recent Payments & Transactions
      </h1>

      {/* Filters */}
      <form className="mt-4 flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID, Name, Property..."
            className="w-full rounded-lg px-10 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select className="rounded-lg px-4 py-2 text-sm border">
          <option>All Status</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>

        <select className="rounded-lg px-4 py-2 text-sm border">
          <option>All Methods</option>
          <option>M-Pesa</option>
          <option>Bank</option>
          <option>Card</option>
        </select>

        <button className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm">
          <DownloadCloud size={16} />
          Export
        </button>
      </form>

      {/* Table */}
      <div className="mt-4 rounded-lg border bg-white p-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Transaction ID</th>
              <th className="p-3">Payer</th>
              <th className="p-3">Property</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* ROW 1 */}
            <tr className="border-t">
              <td className="p-3">TXN123456</td>
              <td className="p-3">Jane Smith</td>
              <td className="p-3">Oxygen House</td>
              <td className="p-3">KES 15,000</td>
              <td className="p-3">M-Pesa</td>
              <td className="p-3">
                <span className="rounded-full bg-yellow-200 px-3 py-1 text-yellow-800">
                  Pending
                </span>
              </td>
              <td className="p-3">27/01/2026</td>
              <td className="p-3 relative">
                <button
                  onClick={() => toggleMenu("TXN123456")}
                  className="rounded p-1 hover:bg-gray-100"
                >
                  <MoreHorizontal />
                </button>

                {openMenuId === "TXN123456" && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-10 z-50 w-44
                      rounded-lg border bg-white shadow-lg
                      origin-top-right animate-dropdown"
                  >
                    <button className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <Eye size={16} /> View details
                    </button>
                    <button className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <BookDown size={16} /> Receipt
                    </button>
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50">
                      <RefreshCw size={16} /> Refund
                    </button>
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50">
                      <Flag size={16} /> Flag
                    </button>
                  </div>
                )}
              </td>
            </tr>

            {/* ADD MORE ROWS HERE — just change the ID */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPaymentsTransactions;
