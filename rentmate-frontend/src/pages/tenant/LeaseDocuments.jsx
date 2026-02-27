import CountUp from "react-countup";
import { Calendar, FileText, Shield, Clock, Download, RefreshCcw} from "lucide-react";

function LeaseDocuments() {
    return(
        <section className="w-full bg-gray-50 p-6">
            <div className="pt-16">
                <h1 className="text-3xl text-gray-800 font-bold py-2">Lease & Documents</h1>
                <p className="text-md text-gray-600">View your lease details and download documents</p>
            </div>

            <div className="mt-6">
                <div className="flex p-4 gap-4">
                    <div className="flex-1">
                        <div className="border border-gray-200 bg-white rounded-lg">
                            <div className="flex items-center justify-between p-4">
                                <div>
                                    <h2 className="text-md font-bold text-gray-800">Active Lease</h2>
                                    <p className="text-sm text-gray-600">Sunrise Apartments - Hs No. B19</p>
                                </div>
                                <div>
                                    <p className="px-4 py-1 rounded-full text-xs text-white bg-green-500">Active</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                                <div className="rounded-xl flex items-center justify-center p-2 bg-gray-50">
                                    <div>
                                        <p className="text-sm text-gray-600 flex gap-2 font-semibold"><Calendar size={20}/>Start Date</p>
                                        <h3 className="text-md text-gray-800 py-1 font-bold">Jan 1, 2026</h3>
                                    </div>
                                </div>
                                <div className="rounded-xl flex items-center justify-center p-2 bg-gray-50">
                                    <div>
                                        <p className="text-sm text-gray-600 flex gap-2 font-semibold"><Calendar size={20}/>End Date</p>
                                        <h3 className="text-md text-gray-800 py-1 font-bold">Dec 31, 2026</h3>
                                    </div>
                                </div>
                                <div className="rounded-xl flex items-center justify-center p-2 bg-gray-50">
                                    <div>
                                        <p className="text-sm text-gray-600 flex gap-2 font-semibold"><Clock size={20}/>Terms</p>
                                        <h3 className="text-md text-gray-800 py-1 font-bold"> 12 Months</h3>
                                    </div>
                                </div>
                                <div className="rounded-xl flex items-center justify-center p-2 bg-gray-50">
                                    <div>
                                        <p className="text-sm text-gray-600 flex gap-2 font-semibold"><FileText size={20}/>Monthly Rent</p>
                                        <h3 className="text-md text-gray-800 py-1 font-bold">KES <CountUp end={45000}/></h3>
                                    </div>
                                </div>
                                <div className="rounded-xl flex items-center justify-center p-2 bg-gray-50">
                                    <div>
                                        <p className="text-sm text-gray-600 flex gap-2 font-semibold"><Shield size={20}/>Security Deposit</p>
                                        <h3 className="text-md text-gray-800 py-1 font-bold">KES <CountUp end={45000}/></h3>
                                    </div>
                                </div>
                                <div className="rounded-xl flex items-center justify-center p-2 bg-gray-50">
                                    <div>
                                        <p className="text-sm text-gray-600 flex gap-2 font-semibold"><Clock size={20}/>Due Day</p>
                                        <h3 className="text-md text-gray-800 py-1 font-bold"> 1st of each month</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
                                <div>
                                    <button className="w-full border border-gray-200 text-md font-bold p-2 rounded-xl flex gap-2 items-center justify-center hover:bg-gray-100"><Download size={20}/>Download Lease</button>
                                </div>
                                <div>
                                    <button className="w-full text-md font-bold p-2 rounded-xl bg-green-600 text-gray-100 flex gap-2 items-center justify-center hover:bg-green-700"><RefreshCcw size={20}/>Request Renewal</button>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded-lg mt-6 p-4 bg-white">
                            <div>
                                <h4 className="flex items-center text-lg font-bold text-green-800 gap-2"><FileText size={20}/>House Rules</h4>
                            </div>
                            <div className="mt-2">
                                <ol className="text-md text-gray-600 space-y-2 list-decimal p-2 ml-4">
                                    <li>Quiet hours are from 10 PM to 7 AM</li>
                                    <li>No smoking in the unit or common areas</li>
                                    <li>Pets require prior written approval and additional deposit</li>
                                    <li>No alterations to the unit without landlord consent</li>
                                    <li>Garbage must be disposed of in designated areas only</li>
                                    <li>Visitors must register at security if staying overnight</li>
                                    <li>Vehicles must be parked in assigned spots only</li>
                                    <li>Report any maintenance issues within 24 hours</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div className="w-80">
                        <div className="border border-gray-200 rounded-lg bg-white p-4">
                            <div>
                                <h5 className="text-lg font-bold text-gray-800">Documents</h5>
                            </div>
                            <div className="mt-3 space-y-4">
                                <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <FileText size={16} className="text-green-800"/>
                                        </div>
                                        <div>
                                            <h6 className="text-sm font-bold text-gray-800">Lease Agreement</h6>
                                            <p className="text-xs text-gray-600">PDF • 2.4 MB</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="p-2 hover:bg-gray-200 rounded-lg"><Download size={20}/></button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <FileText size={16} className="text-green-800"/>
                                        </div>
                                        <div>
                                            <h6 className="text-sm font-bold text-gray-800">House Rules</h6>
                                            <p className="text-xs text-gray-600">PDF • 456 KB</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="p-2 hover:bg-gray-200 rounded-lg"><Download size={20}/></button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <FileText size={16} className="text-green-800"/>
                                        </div>
                                        <div>
                                            <h6 className="text-sm font-bold text-gray-800">Deposit Receipt</h6>
                                            <p className="text-xs text-gray-600">PDF • 128 KB</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="p-2 hover:bg-gray-200 rounded-lg"><Download size={20}/></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-red-500 rounded-lg bg-white p-4 mt-6">
                            <div>
                                <h5 className="text-lg font-bold text-gray-800">FAQs</h5>
                            </div>
                            <div className="mt-3 space-y-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LeaseDocuments;