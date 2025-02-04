
// import { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import { FaBars, FaTimes } from "react-icons/fa";

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [isNavVisible, setIsNavVisible] = useState(true);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const closeMenu = () => setIsMenuOpen(false);

//   const handleScroll = () => {
//     if (typeof window !== "undefined") {
//       if (window.scrollY > lastScrollY) {
//         // Scrolling down
//         setIsNavVisible(false);
//       } else {
//         // Scrolling up
//         setIsNavVisible(true);
//       }
//       setLastScrollY(window.scrollY);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [lastScrollY]);

//   return (
//     <nav
//       className={`bg-green-600 text-white p-4 fixed top-0 w-full shadow-lg z-50 rounded-b-lg transition-all duration-300 ${
//         isNavVisible ? "translate-y-0" : "-translate-y-full"
//       }`}
//     >
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <h1 className="text-xl font-bold text-center flex-grow">
//           <NavLink
//             to="/"
//             className="hover:text-yellow-300 transition"
//             onClick={closeMenu}
//           >
//             Farming AI
//           </NavLink>
//         </h1>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={toggleMenu}
//           className="lg:hidden z-50 flex items-center justify-center"
//         >
//           {isMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
//         </button>

//         {/* Navigation Links */}
//         <ul
//           className={`lg:flex gap-6 absolute lg:static top-0 left-0 w-full h-screen lg:h-auto flex-col lg:flex-row items-center justify-center 
//           bg-green-700 lg:bg-transparent transition-transform duration-300 ease-in-out ${
//             isMenuOpen ? "translate-x-0" : "-translate-x-full"
//           } lg:translate-x-0`}
//         >
//           <li className="text-lg py-2">
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 `hover:text-yellow-300 transition ${isActive ? "text-yellow-300 font-bold" : ""}`
//               }
//               onClick={closeMenu}
//             >
//               Home
//             </NavLink>
//           </li>
//           <li className="text-lg py-2">
//             <NavLink
//               to="/predict"
//               className={({ isActive }) =>
//                 `hover:text-yellow-300 transition ${isActive ? "text-yellow-300 font-bold" : ""}`
//               }
//               onClick={closeMenu}
//             >
//               Crop Recommendation
//             </NavLink>
//           </li>
//           <li className="text-lg py-2">
//             <NavLink
//               to="/market-price"
//               className={({ isActive }) =>
//                 `hover:text-yellow-300 transition ${isActive ? "text-yellow-300 font-bold" : ""}`
//               }
//               onClick={closeMenu}
//             >
//               Market Trends
//             </NavLink>
//           </li>
//           <li className="text-lg py-2">
//             <a
//               href="https://weather-api-es7c.onrender.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="hover:text-yellow-300 transition"
//               onClick={closeMenu}
//             >
//               Weather Forecast
//             </a>
//           </li>
//           <li className="text-lg py-2">
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 `hover:text-yellow-300 transition ${isActive ? "text-yellow-300 font-bold" : ""}`
//               }
//               onClick={closeMenu}
//             >
//               About
//             </NavLink>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// }

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setIsNavVisible(false); // Hide navbar on scroll down
      } else {
        setIsNavVisible(true); // Show navbar on scroll up
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 w-full bg-green-600 bg-opacity-90 backdrop-blur-md shadow-lg z-50 transition-transform duration-300 ${
        isNavVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-5 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-white tracking-wide">
          <NavLink to="/" className="hover:text-yellow-400 transition">
            Farming AI
          </NavLink>
        </h1>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-white text-2xl z-50"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <ul
          className={`absolute top-0 left-0 w-full h-screen lg:h-auto lg:static flex flex-col lg:flex-row items-center justify-center gap-6 bg-green-700 lg:bg-transparent transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 lg:opacity-100 lg:translate-x-0"
          }`}
        >
          {[
            { name: "Home", path: "/" },
            { name: "Crop Recommendation", path: "/predict" },
            { name: "Market Trends", path: "/market-price" },
            { name: "Weather Forecast", path: "https://weather-api-es7c.onrender.com/", external: true },
            { name: "About", path: "/about" },
          ].map((item, index) => (
            <li key={index} className="relative group">
              {item.external ? (
                <a
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-white transition hover:text-yellow-400 px-4 py-2"
                  onClick={closeMenu}
                >
                  {item.name}
                </a>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `text-lg font-medium transition px-4 py-2 ${
                      isActive ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"
                    }`
                  }
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              )}
              {/* Underline Animation */}
              <span className="absolute left-0 bottom-0 w-0 h-1 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
