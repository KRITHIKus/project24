// import api from "./app"; // Import the configured axios instance

// interface CropData {
//   N: number;
//   P: number;
//   K: number;
//   ph: number;
//   temperature: number;
//   humidity: number;
//   rainfall: number;
// }

// export const predictCrop = async (data: CropData) => {
//   try {
//     const response = await api.post("/predict", data);
//     return response.data; // Expected: { predicted_crop: "Wheat" }
//   } catch (error) {
//     console.error("Error predicting crop:", error);
//     return { error: "Failed to predict crop" };
//   }
// };

import api from "./api";  // Import the configured axios instance

interface CropData {
  N: number;
  P: number;
  K: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall: number;
}

export const predictCrop = async (data: CropData) => {
  try {
    console.log("Sending data to backend:", data); // Log the request data
    const response = await api.post("/predict", data); // API request to the backend
    console.log("Response from backend:", response.data); // Log the response data
    return response.data; // Expected: { predicted_crop: "Wheat" }
  } catch (error) {
    console.error("Error predicting crop:", error);  // Log any error
    return { error: "Failed to predict crop" };
  }
};
