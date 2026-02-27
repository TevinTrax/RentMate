import CountUp from "react-countup";
import { Clock, Verified, Plus, TriangleAlert } from "lucide-react";

function TenantMaintenance() {
    return(
        <section className="w-full bg-gray-50 p-6">
            <div className="mt-16 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl text-gray-800 font-bold py-2">Maintenance Requests</h1>
                    <p className="text-md text-gray-600">Submit and track maintenance requests</p>
                </div>
                <div>
                    <button className="px-4 py-2 rounded-lg bg-green-500 flex items-center text-gray-100 gap-2 text-md font-bold hover:bg-green-700"><Plus size={20}/>New Request</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-4">
                <div className="border border-gray-200 bg-white transition hover:scale-105 hover:border-yellow-300 rounded-lg p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <Clock size={24} className="text-yellow-500"/>
                    </div>
                    <div>
                        <h2 className="text-md text-gray-600 font-semibold">Pending</h2>
                        <h3 className="text-xl text-gray-800 font-bold pt-2">4</h3>
                    </div>
                </div>

                <div className="border border-gray-200 bg-white transition hover:scale-105 hover:border-red-300 rounded-lg p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <TriangleAlert size={24} className="text-red-500"/>
                    </div>
                    <div>
                        <h2 className="text-md text-gray-600 font-semibold">In Progress</h2>
                        <h3 className="text-xl text-gray-800 font-bold pt-2">2</h3>
                    </div>
                </div>

                <div className="border border-gray-200 hover:border-green-300 transition hover:scale-105 bg-white rounded-lg p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <Verified size={24} className="text-green-500"/>
                    </div>
                    <div>
                        <h2 className="text-md text-gray-600 font-semibold">Completed</h2>
                        <h3 className="text-xl text-gray-800 font-bold pt-2">2</h3>
                    </div>
                </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 mt-6">
                <div></div>
            </div>
        </section>
    );
}

export default TenantMaintenance;