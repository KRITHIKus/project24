import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="text-center py-10">
            <h1 className="text-4xl font-bold text-green-600">Welcome to Farming AI</h1>
            <p className="mt-4 text-lg text-gray-700">
                Empowering farmers with AI-driven insights for smarter farming decisions.
            </p>
            <div className="mt-6 space-x-4">
                <Link to="/predict" className="bg-green-600 text-white py-2 px-4 rounded-lg">
                    Crop Recommendation
                </Link>
                <Link to="/market-trends" className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                    Market Trends
                </Link>
                <a href="http://your-weather-forecast-url.com" target="_blank" rel="noopener noreferrer" className="bg-yellow-600 text-white py-2 px-4 rounded-lg">
                    Weather Forecast
                </a>
            </div>
        </div>
    );
}
