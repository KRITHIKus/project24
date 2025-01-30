// Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-green-600 text-white p-4 fixed top-0 w-full shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">
          <Link to="/" className="hover:text-yellow-300 transition">
            Farming AI
          </Link>
        </h1>

        {/* Hamburger Icon (Mobile) */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
          {isMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>

        {/* Navigation Links */}
        <ul className={`lg:flex gap-6 absolute lg:static top-0 left-0 w-full h-screen lg:h-auto flex-col lg:flex-row items-center justify-center bg-green-700 transition-transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
          <li className="text-lg py-2">
            <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          </li>
          <li className="text-lg py-2">
            <Link to="/predict" className="hover:text-yellow-300 transition">Crop Recommendation</Link>
          </li>
          <li className="text-lg py-2">
            <Link to="/market-price" className="hover:text-yellow-300 transition">Market Trends</Link>
          </li>
          <li className="text-lg py-2">
            <a href="https://weather-api-es7c.onrender.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition">
              Weather Forecast
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
