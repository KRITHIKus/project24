import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-green-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Farming AI</h1>
                <ul className="flex space-x-4">
                    <li><Link to="/" className="hover:underline">Home</Link></li>
                    <li><Link to="/predict" className="hover:underline">Crop Recommendation</Link></li>
                    <li><Link to="/market-trends" className="hover:underline">Market Trends</Link></li>
                </ul>
            </div>
        </nav>
    );
}
