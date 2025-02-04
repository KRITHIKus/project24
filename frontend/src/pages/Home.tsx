// import { Link } from "react-router-dom";
// import Slider from "react-slick"; // Import the react-slick component

// export default function Home() {
//     // Carousel settings
//     const carouselSettings = {
//         dots: true, // Show dots for navigation
//         infinite: true, // Infinite loop of slides
//         speed: 500, // Slide transition speed
//         slidesToShow: 1, // Show one slide at a time
//         slidesToScroll: 1, // Scroll one slide at a time
//         responsive: [
//             {
//                 breakpoint: 768, // Apply settings for mobile screens
//                 settings: {
//                     arrows: false, // Remove arrows for mobile
//                     swipeToSlide: true, // Enable swiping
//                 },
//             },
//         ],
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 py-12">
//             <h1 className="text-5xl font-bold text-green-600 text-center mt-16 mb-6">Welcome to Farming AI</h1>
//             <p className="mt-4 text-lg text-gray-700 text-center max-w-xl mb-6">
//                 Empowering farmers with AI-driven insights for smarter farming decisions.
//             </p>
            
//             {/* Action buttons */}
//             <div className="mt-6 flex flex-col sm:flex-row gap-4">
//                 <Link to="/predict" className="bg-green-600 text-white py-3 px-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:bg-green-700">
//                     🌱 Crop Recommendation
//                 </Link>
//                 <Link to="/market-price" className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:bg-blue-700">
//                     📈 Market Trends
//                 </Link>
//                 <a href="https://weather-api-es7c.onrender.com/" target="_blank" rel="noopener noreferrer" className="bg-yellow-600 text-white py-3 px-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:bg-yellow-700">
//                     🌤️ Weather Forecast
//                 </a>
//             </div>

//             {/* Carousel for modern agriculture facts */}
//             <div className="mt-12 w-full">
//                 <Slider {...carouselSettings}>
//                     <div className="flex justify-center items-center p-6 bg-white shadow-lg rounded-lg mb-6">
//                         <div className="text-center">
//                             <p className="text-xl font-semibold text-green-600">Smart Irrigation</p>
//                             <p className="mt-4 text-gray-700">Modern irrigation systems use sensors and data analytics to reduce water consumption and improve crop yield.</p>
//                         </div>
//                     </div>
//                     <div className="flex justify-center items-center p-6 bg-white shadow-lg rounded-lg mb-6">
//                         <div className="text-center">
//                             <p className="text-xl font-semibold text-green-600">AI Crop Disease Detection</p>
//                             <p className="mt-4 text-gray-700">AI-based systems can detect diseases early, allowing farmers to take action and prevent crop losses.</p>
//                         </div>
//                     </div>
//                     <div className="flex justify-center items-center p-6 bg-white shadow-lg rounded-lg mb-6">
//                         <div className="text-center">
//                             <p className="text-xl font-semibold text-green-600">Precision Farming</p>
//                             <p className="mt-4 text-gray-700">By using drones and sensors, farmers can monitor soil health, optimize resource use, and increase efficiency.</p>
//                         </div>
//                     </div>
//                     {/* Add more slides as needed */}
//                 </Slider>
//             </div>
//         </div>
//     );
// }
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";

export default function Home() {
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    swipeToSlide: true,
                },
            },
        ],
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center px-6 py-12 mt-10"
            style={{ backgroundImage: "url('/assets/background1.jpeg')" }}>
            
            <div className="absolute inset-0  bg-opacity-50 backdrop-blur-sm"></div>



            {/* Hero Section */}
            <motion.div
                className="relative z-10 flex flex-col items-center text-center bg-white/30 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-full max-w-3xl"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1 className="text-5xl font-extrabold text-green-600 drop-shadow-none">
                    Welcome to <span className="text-green-600">Farming AI</span>
                </h1>
                <p className="mt-4 text-lg text-gray-100 max-w-xl">
                    Empowering farmers with AI-driven insights for smarter farming decisions.
                </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div className="relative z-10 mt-8 flex flex-wrap justify-center gap-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}>
                <Link to="/predict" className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 hover:scale-105 transition-transform">
                    🌱 Crop Recommendation
                </Link>
                <Link to="/market-price" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-transform">
                    📈 Market Trends
                </Link>
                <a href="https://weather-api-es7c.onrender.com/" target="_blank" rel="noopener noreferrer"
                    className="bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-yellow-600 hover:scale-105 transition-transform">
                    🌤️ Weather Forecast
                </a>
            </motion.div>

            {/* Carousel Section */}
            <motion.div className="relative z-10 mt-12 w-full max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}>
                <Slider {...carouselSettings}>
                    {[
                        { title: "Smart Irrigation", desc: "Modern irrigation systems use sensors and data analytics to reduce water consumption and improve crop yield." },
                        { title: "AI Crop Disease Detection", desc: "AI-based systems can detect diseases early, allowing farmers to take action and prevent crop losses." },
                        { title: "Precision Farming", desc: "By using drones and sensors, farmers can monitor soil health, optimize resource use, and increase efficiency." }
                    ].map((item, index) => (
                        <div key={index} className="flex justify-center items-center p-6 bg-white/40 backdrop-blur-xl shadow-lg rounded-xl text-center">
                            <div>
                                <p className="text-2xl font-bold text-green-600">{item.title}</p>
                                <p className="mt-4 text-gray-900">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </motion.div>
        </div>
    );
}
