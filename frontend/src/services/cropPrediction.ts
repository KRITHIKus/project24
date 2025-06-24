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
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"; // Backend API URL

// Function to validate input data
const validateCropData = (data: CropData): string | null => {
  if (
    data.N < 0 || data.P < 0 || data.K < 0 || 
    data.ph <= 0 || data.ph > 14 ||
    data.temperature < -10 || data.temperature > 60 ||
    data.humidity < 0 || data.humidity > 100 ||
    data.rainfall < 0
  ) {
    return "Invalid input values. Ensure all values are within valid ranges.";
  }
  return null;
};

export const predictCrop = async (data: CropData) => {
  try {
    // Validate the input data before sending the request
    const validationError = validateCropData(data);
    if (validationError) {
      console.error("Validation Error:", validationError);
      return { error: validationError };
    }

    console.log("📤 Sending crop data to backend:", data); // Log the request data

    // Sending the POST request to the backend
    const response = await axios.post(`${API_BASE_URL}/predict`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Response from backend:", response.data); // Log the response data
    return response.data; // Expected: { predicted_crop: "Wheat" }

  } catch (error: any) {
    console.error("❌ Error predicting crop:", error?.response?.data || error.message);
    
    return { 
      error: error?.response?.data?.error || 
             "Failed to predict crop. Please check the backend connection." 
    };
  }
};
