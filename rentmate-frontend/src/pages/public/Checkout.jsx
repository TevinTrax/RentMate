import { FaArrowLeft } from "react-icons/fa6";

function Payment() {
    return(
        <section className="w-full pt-24 bg-gray-100">
            <div>
                <button><FaArrowLeft className="mr-2" />Back to plans</button>
            </div>
            <div className="p-8 border border-red-500 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-500"></div>
            </div>
        </section>
    );
}

export default Payment;