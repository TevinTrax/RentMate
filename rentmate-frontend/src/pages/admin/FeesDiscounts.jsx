import { useState } from "react";

function AdminPaymentsFeesDiscounts(params) {

    const [ toggleEnabled, setToggleEnabled ] = useState();

    return(
        <section className="w-full">
            <div className="mt-4 p-2">
                <h1 className="text-lg font-bold text-gray-800">Fees, Penalties & Discounts</h1>
            </div>
            <div className="mt-3 bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-green-500 p-4 rounded-lg bg-gray-100">
                    <div className="flex items-center justify-between border border-red-500">
                        <div className="border border-blue-500">
                            <h2 className="text-lg font-bold text-gray-800">Service Fees</h2>
                            <p className="text-gray-700 py-1 text-sm">Platform transaction fees applied to payments</p>
                        </div>
                        <div className="border border-blue-500">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={toggleEnabled}
                                    onChange={() => setToggleEnabled(!toggleEnabled)}
                                />
                                <div
                                    className="relative w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                    after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all
                                    peer-checked:after:translate-x-5"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="border border-red-500 mt-2">
                        <form action="" className="space-y-2">
                            <label htmlFor="" className="text-md text-gray-800 font-bold">Service Fee Percentage (%)</label>
                            <input type="number" className="w-full border border-gray-300 rounded-lg px-2 py-1"/>
                            <button className="rounded-lg bg-blue-500 text-white px-4 py-1">Update</button>
                        </form>
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
        </section>
    );
}

export default AdminPaymentsFeesDiscounts;