import CountUp from "react-countup";
import { Banknote, Clock, Verified, CreditCard, Download } from "lucide-react";

function TenantPayments() {
    return(
        <section className="w-full bg-gray-50 p-6">
            <div className="pt-16">
                <h1 className="text-3xl text-gray-800 font-bold py-2">Rent & Payments</h1>
                <p className="text-md text-gray-600">Manage your rent payments and view history</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-4">
                <div className="border border-gray-200 bg-white transition hover:scale-105 hover:border-green-500 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Banknote size={20} className="text-green-500"/>
                        </div>
                        <h2 className="text-md text-gray-600 font-semibold">Monthly Rent</h2>
                    </div>
                    <h3 className="text-xl text-gray-800 font-bold pt-4">KES <CountUp end={45000}/></h3>
                </div>

                <div className="border border-gray-200 bg-white transition hover:scale-105 hover:border-yellow-300 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Clock size={20} className="text-yellow-500"/>
                        </div>
                        <h2 className="text-md text-gray-600 font-semibold">Due Date</h2>
                    </div>
                    <h3 className="text-xl text-gray-800 font-bold pt-4">Feb 1, 2026</h3>
                </div>

                <div className="border border-gray-200 hover:border-blue-300 transition hover:scale-105 bg-white rounded-lg p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Verified size={20} className="text-blue-500"/>
                        </div>
                        <h2 className="text-md text-gray-600 font-semibold">Payment Status</h2>
                    </div>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-2xl text-gray-100 mt-4 text-md font-semibold">Due in 5 Days</button>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg bg-white mt-6 p-4 flex items-center justify-between hover:shadow-md transition">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Make a Payment</h3>
                    <p className="text-sm text-gray-600 py-1">Pay your rent securely using your preferred method</p>
                </div>
                <div>
                    <button className="flex gap-2 px-4 py-2 rounded-lg bg-green-600 text-gray-100 text-sm font-bold"><CreditCard size={20}/>Pay KES 45,000</button>
                </div>
            </div>

            <div className="border border-gray-300 bg-white rounded-lg mt-6 p-4">
                <h4 className="text-lg font-bold text-gray-800">Payment History</h4>
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white mt-4">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-800">
                            <tr>
                                <th className="p-4 text-left font-semibold">No</th>
                                <th className="p-4 text-left font-semibold">Date</th>
                                <th className="p-4 text-left font-semibold">Reference</th>
                                <th className="p-4 text-left font-semibold">Amount</th>
                                <th className="p-4 text-left font-semibold">Method</th>
                                <th className="p-4 text-left font-semibold">Status</th>
                                <th className="p-4 text-left font-semibold">Receipt</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-b border-gray-100 text-gray-600 hover:bg-gray-50 transition">
                                <td className="p-3">1</td>
                                <td className="p-3">01 Jan 2026</td>
                                <td className="p-3 font-medium text-gray-800">RNT-2026-001</td>
                                <td className="p-3 font-semibold text-gray-900">KES 45,000</td>
                                <td className="p-3">M-Pesa</td>

                                <td className="p-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                    <Verified size={14} />
                                    Completed
                                </span>
                                </td>

                                <td className="p-3">
                                <button className="rounded-md p-2 hover:bg-gray-100 transition">
                                    <Download size={18} />
                                </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default TenantPayments;