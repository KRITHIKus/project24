import axios from "axios";

interface CropData {
  N: number;
  P: number;
  K: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall: number;
}

// Set backend URL directly here
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "http://127.0.0.1:5000"; // Backend API URL

export const predictCrop = async (data: CropData) => {
  try {
    console.log("Sending data to backend:", data); // Log the request data
    
    // Sending the POST request to the backend
    const response = await axios.post(`${API_BASE_URL}/predict`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log("Response from backend:", response.data); // Log the response data
    return response.data; // Expected: { predicted_crop: "Wheat" }
  } catch (error: any) {
    console.error("Error predicting crop:", error); // Log any error
    return { error: "Failed to predict crop. Please check the backend connection." };
  }
};
