import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 py-12">
            <h1 className="text-4xl font-bold text-green-600 text-center">Welcome to Farming AI</h1>
            <p className="mt-4 text-lg text-gray-700 text-center max-w-xl">
                Empowering farmers with AI-driven insights for smarter farming decisions.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link to="/predict" className="bg-green-600 text-white py-3 px-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:bg-green-700">
                    🌱 Crop Recommendation
                </Link>
                <Link to="/market-price" className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:bg-blue-700">
                    📈 Market Trends
                </Link>
                <a href="https://weather-api-es7c.onrender.com/" target="_blank" rel="noopener noreferrer" className="bg-yellow-600 text-white py-3 px-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:bg-yellow-700">
                    🌤️ Weather Forecast
                </a>
            </div>
        </div>
    );
}
