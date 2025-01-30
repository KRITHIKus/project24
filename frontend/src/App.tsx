import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CropRecommendation from "./pages/CropRecommendation";
import MarketPrice from "./pages/marketPrice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/predict" element={<CropRecommendation />} />
                        <Route path="/market-price" element={<MarketPrice />} />
                        {/* <Route path="*" element={<NotFound />} /> */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}
