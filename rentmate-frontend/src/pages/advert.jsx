import { useNavigate } from "react-router-dom";

function Advert() {
    const navigate = useNavigate();

    return(
        <section className="w-full bg-gradient-to-br from-blue-600 to-purple-600">
            <div className="container mx-auto p-6">
                <h1 className="max-w-xl mx-auto text-4xl text-center font-bold text-white pt-12">Ready to Simplify Your Property Management?</h1>
                <p className="max-w-2xl mx-auto text-center text-white text-lg pt-4">Join thousands of property managers who have already transformed their rental business. Start your free trial today, no credit card required.</p>
                <div className="flex justify-center mt-6">
                    <button className="text-md text-gray-800 font-semibold px-10 py-3 rounded-lg bg-white hover:bg-gray-100" onClick={() => navigate("/free-trial")}>Start Your Free 14-Day Trial</button>
                </div>
                <ul className="flex text-sm text-gray-100 list-disc space-x-8 justify-center pt-4 pb-14">
                    <li>Setup in 5 minutes</li>
                    <li>No credit card needed </li>
                    <li>Cancel anytime</li>
                </ul>
            </div>
        </section>
    );
}

export default Advert;