import { useState } from "react";
import { getMarketPrice } from "../services/marketPrice";
import { Line } from "react-chartjs-2";
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
      setWarning("Please enter the crop name in ALL CAPITAL LETTERS.");
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

 
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Crop Price Trends Over Time",
        font: { size: 16 },
      },
    },
    scales: {
      x: { grid: { display: false }, title: { display: true, text: "Date" } },
      y: { grid: { color: "#e0e0e0" }, title: { display: true, text: "Price (₹)" } },
    },
  };

  const chartData = {
    labels: priceTrends?.map((entry: any) => entry.Date) || [],
    datasets: [
      {
        label: "Max Price",
        data: priceTrends?.map((entry: any) => entry.MaxPrice) || [],
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
      {
        label: "Min Price",
        data: priceTrends?.map((entry: any) => entry.MinPrice) || [],
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto mt-25 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        📊 Market Price Analysis
      </h2>

      {/* Warning Message */}
      {warning && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4 text-center font-semibold">
          {warning}
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter state name"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">District (Optional)</label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter district name"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Crop Name (ALL CAPS)</label>
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="E.g., WHEAT"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
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

      {/* Market Prices Display */}
      {priceData && !loading && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">
            💰 Market Prices
          </h3>
          <div className="overflow-y-auto max-h-60 border border-gray-200 rounded-lg p-3 bg-gray-50">
            {priceData.map((price: any, index: number) => (
              <div key={index} className="border-b pb-2 mb-2">
                <p className="text-gray-800 font-semibold">🌿 Commodity: {price.Commodity}</p>
                <p className="text-gray-600">📍 State: {price.State}</p>
                <p className="text-gray-600">🏙️ District: {price.District || "N/A"}</p>
                <p className="text-green-600 font-semibold">
                  📈 Max Price: ₹{price.MaxPrice}
                </p>
                <p className="text-red-600 font-semibold">
                  📉 Min Price: ₹{price.MinPrice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Trends Chart */}
      {priceTrends && !loading && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-center text-gray-700 mb-3">
            📊 Price Trends Over Time
          </h3>
          <div className="w-full h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <p className="mt-6 text-center text-red-600 font-medium bg-red-100 p-3 rounded-lg">
          ❌ {error}
        </p>
      )}
    </div>
  );
};

export default MarketPriceComponent;
