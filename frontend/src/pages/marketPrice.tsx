
import { useState } from "react";
import { getMarketPrice } from "../services/marketPrice";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const MarketPriceComponent = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [cropName, setCropName] = useState("");
  const [priceData, setPriceData] = useState<any>(null);
  const [priceTrends, setPriceTrends] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPriceData(null);
    setPriceTrends(null);
    setError(null);
    setWarning(null);
    setLoading(true);

    const formattedState = state.trim();
    const formattedDistrict = district.trim();
    const formattedCropName = cropName.trim().toUpperCase();

    if (cropName !== formattedCropName) {
      setWarning("⚠️ Please enter the crop name in ALL CAPITAL LETTERS.");
    }

    const data = { state: formattedState, district: formattedDistrict, crop_name: formattedCropName };

    try {
      const result = await getMarketPrice(data);
      if (result.crop_prices) {
        setPriceData(result.crop_prices);
      } else {
        setError(result.error || "Unexpected error occurred.");
      }
      if (result.price_trends) {
        setPriceTrends(result.price_trends);
      }
    } catch (err) {
      console.error("Error fetching market prices:", err);
      setError("Failed to fetch market prices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/background8.jpeg')" }} // Background image
    >
      <div className="absolute inset-0  bg-opacity-50 backdrop-blur-sm "></div>

      <div className="relative z-10 max-w-3xl w-full p-8 bg-white/20 backdrop-blur-sm rounded-xl shadow-sm mt-19">
        {/* Title */}
        <motion.h2
          className="text-3xl font-bold text-black text-2xlnter mb-6"
       initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          📊 Market Price Analysis
        </motion.h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-black text-2xl font-mono">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-3 border border-white/40 bg-transparent text-balck rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-black"
              placeholder="Enter state name"
              required
            />
          </div>

          <div>
            <label className="block text-black text-2xl font-mono">District (Optional)</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-3 border border-white/40 bg-transparent text-black rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-black"
              placeholder="Enter district name"
            />
          </div>

          <div>
            <label className="block text-black text-2xl font-mono">Crop Name (ALL CAPS)</label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full p-3 border border-white/30 bg-transparent text-balck rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-black"
              placeholder="E.g., WHEAT"
              required
            />
          </div>

          {/* Warning Message */}
          {warning && (
            <p className="text-yellow-400 text-center font-semibold bg-yellow-100 p-3 rounded-lg">
              {warning}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 text-lg rounded-lg font-semibold hover:scale-105 transition duration-300 shadow-lg"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Market Price"}
          </button>
        </form>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <p className="mt-6 text-center text-red-600 font-medium bg-red-100 p-3 rounded-lg">
            ❌ {error}
          </p>
        )}

        {/* Market Prices Display */}
        {priceData && !loading && (
          <div className="mt-6 text-white">
            <h3 className="text-lg font-semibold text-center mb-3">💰 Market Prices</h3>
            <div className="overflow-y-auto max-h-60 border border-gray-200 rounded-lg p-3 bg-white/10 backdrop-blur-md">
              {priceData.map((price: any, index: number) => (
                <div key={index} className="border-b border-gray-500 pb-2 mb-2">
                  <p className="font-semibold">🌿 Commodity: {price.Commodity}</p>
                  <p>📍 State: {price.State}</p>
                  <p>🏙️ District: {price.District || "N/A"}</p>
                  <p className="text-green-400 font-semibold">📈 Max Price: ₹{price.MaxPrice}</p>
                  <p className="text-red-400 font-semibold">📉 Min Price: ₹{price.MinPrice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Trends Chart */}
        {priceTrends && !loading && (
          <div className="mt-8 p-4 bg-white/10 backdrop-blur-md rounded-lg shadow">
            <h3 className="text-lg font-semibold text-center text-white mb-3">📊 Price Trends Over Time</h3>
            <div className="w-full h-72">
              <Line
                data={{
                  labels: priceTrends?.map((entry: any) => entry.Date) || [],
                  datasets: [
                    { label: "Max Price", data: priceTrends?.map((entry: any) => entry.MaxPrice) || [], borderColor: "rgb(75, 192, 192)", borderWidth: 2, tension: 0.3, fill: false },
                    { label: "Min Price", data: priceTrends?.map((entry: any) => entry.MinPrice) || [], borderColor: "rgb(255, 99, 132)", borderWidth: 2, tension: 0.3, fill: false },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPriceComponent;
