import { useNavigate } from "react-router-dom";

function BackHome() {
    const navigate= useNavigate();

    return(
        // back to home button
        <div className="container mx-auto px-4 mt-4">
            <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mx-auto"
            >
            <FaArrowLeft className="text-xl" />
            <span className="text-lg font-medium">Back to Home</span>
            </button>
        </div>
    );
}

export default BackHome;