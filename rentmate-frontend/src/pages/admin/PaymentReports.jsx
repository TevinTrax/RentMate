import {
  TrendingUp,
  DownloadCloud,
} from "lucide-react";

function AdminPaymentsReports() {
  return (
    <section className="w-full">
        <div className="mt-4 flex justify-between items-center">
            {/* Header */}
                <div className="">
                    <h1 className="text-lg font-bold text-gray-800">
                        Financial Reports & Analytics
                    </h1>
                </div>

            {/* Filters */}
            <div className="">
                    <form className="mt-4 flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4">
                        <select className="rounded-lg px-4 py-2 text-sm border">
                            <option>Packages</option>
                            <option>Basic Plan</option>
                            <option>Standard Plan</option>
                            <option>Premium Plan</option>
                        </select>

                        <select className="rounded-lg px-4 py-2 text-sm border">
                            <option>Period</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                            <option>Yearly</option>
                        </select>

                        <button className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm">
                            <DownloadCloud size={16} />
                            Generate Report
                        </button>

                        <button className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm">
                            <DownloadCloud size={16} />
                            Export
                        </button>
                    </form>
            </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div>
                <h2 className="text-lg font-bold text-gray-800">Revenue Over Time</h2>
                <p className="text-gray-700 py-1 text-sm">Monthly revenue trend for 2026</p>
            </div>


            <div className="border border-red-500 mt-2">
                {/* Chart or graph container */}
            </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-green-500 p-4 rounded-lg bg-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Payment Methods</h2>
                <p className="text-gray-700 py-1 text-sm">Distribution by payment type</p>

                <div className="border border-red-500 mt-2">
                    {/* Chart or graph container */}
                </div>
            </div>

            <div className="border border-green-500 p-4 rounded-lg bg-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Package Performance</h2>
                <p className="text-gray-700 py-1 text-sm">Revenue by subscription tier</p>

                <div className="border border-red-500 mt-2">
                    {/* Chart or graph container */}
                </div>
            </div>
        </div>


        <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div>
                <h2 className="text-lg font-bold text-gray-800">Monthly vs Yearly Subscriptions</h2>
                <p className="text-gray-700 py-1">Earnings comparison by billing cycle</p>
            </div>

            <div className="border border-red-500 mt-2">
                {/* Chart or graph container */}
            </div>
        </div>
    </section>
  );
}

export default AdminPaymentsReports;

