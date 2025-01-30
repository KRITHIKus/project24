import axios from "axios";

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "http://127.0.0.1:5000"; // Update with your backend URL

interface MarketPriceRequest {
  state: string;
  crop_name: string;
  district?: string; // Optional district filter
}

export const getMarketPrice = async (data: MarketPriceRequest) => {
  try {
    console.log("Fetching market price for:", data);
    const response = await axios.post(`${API_BASE_URL}/get_crop_price`, data);
    console.log("Market price response:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Error fetching market price:", error);
    return { error: "Failed to fetch market prices" };
  }
};
