import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-green-600 text-white p-4 fixed top-0 w-full shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold text-center flex-grow">
          <NavLink
            to="/"
            className="hover:text-yellow-300 transition"
            onClick={closeMenu}
          >
            Farming AI
          </NavLink>
        </h1>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden z-50 flex items-center justify-center"
        >
          {isMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>

        {/* Navigation Links */}
        <ul
          className={`lg:flex gap-6 absolute lg:static top-0 left-0 w-full h-screen lg:h-auto flex-col lg:flex-row items-center justify-center 
          bg-green-700 lg:bg-transparent transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <li className="text-lg py-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-yellow-300 transition ${isActive ? "text-yellow-300 font-bold" : ""}`
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li className="text-lg py-2">
            <NavLink
              to="/predict"
              className={({ isActive }) =>
                `hover:text-yellow-300 transition ${isActive ? "text-yellow-300 font-bold" : ""}`
              }
              onClick={closeMenu}
            >
              Crop Recommendation
            </NavLink>
          </li>
          <li className="text-lg py-2">
            <NavLink
              to="/market-price"
              className={({ isActive }) =>
                `hover:text-yellow-300 transition ${isActive ? "text-yellow-300 font-bold" : ""}`
              }
              onClick={closeMenu}
            >
              Market Trends
            </NavLink>
          </li>
          <li className="text-lg py-2">
            <a
              href="https://weather-api-es7c.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-300 transition"
              onClick={closeMenu}
            >
              Weather Forecast
            </a>
          </li>
          <li className="text-lg py-2">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-yellow-300 transition ${isActive ? "text-yellow-300 font-bold" : ""}`
              }
              onClick={closeMenu}
            >
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
