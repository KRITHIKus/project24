import { useState } from "react";
import { predictCrop } from "../services/cropPrediction";  // Correct import

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    N: 0,
    P: 0,
    K: 0,
    ph: 7.0,
    temperature: 25,
    humidity: 50,
    rainfall: 100,
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Map of crops to their images (normalized keys)
  const cropImages: Record<string, string> = {
    ricecrop: "/assets/crop_images/rice crop.jpg",
    orange: "/assets/crop_images/orange.jpg",
    banana: "/assets/crop_images/banana.jpg",
    mungbean: "/assets/crop_images/mung bean.jpg", 
    grapes: "/assets/crop_images/grapes.jpg", 
    cotton: "/assets/crop_images/cotton.jpg", 
    jute: "/assets/crop_images/jute.jpg", 
    kidneybeans: "/assets/crop_images/kidney Beans.jpg", 
    lentil: "/assets/crop_images/lentil.jpg", 
    mango: "/assets/crop_images/mango.jpg", 
    pigeonpeas: "/assets/crop_images/pigeon peas.jpg", 
    Pomegranate: "/assets/crop_images/Pomegranate.jpg", 
    watermelon: "/assets/crop_images/watermelon.jpg", 
    papaya: "/assets/crop_images/papaya.jpg", 
    mothbeans: "/assets/crop_images/mothbeans.jpg", 
    blackgram: "/assets/crop_images/blackgram.jpg",    
    chickpea: "/assets/crop_images/chickpea.jpg",    
    coconut: "/assets/crop_images/coconut.jpg",    
    maize: "/assets/crop_images/maize.jpg",    
    apple: "/assets/crop_images/apple.jpg",    
    muskmelon: "/assets/crop_images/muskmelon.jpg",    
    coffee: "/assets/crop_images/coffee.jpg",    

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    
    // Prevent negative values for soil nutrients and rainfall
    setFormData({ ...formData, [name]: numericValue < 0 ? 0 : numericValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrediction(null);
    setError(null);
    setImageSrc(null);

    try {
      const result = await predictCrop(formData);
      console.log("API Response:", result); // Debugging log

      if (result.predicted_crop) {
        const cropKey = result.predicted_crop.toLowerCase().replace(/\s+/g, ""); // Normalize key
        setPrediction(result.predicted_crop);
        setImageSrc(cropImages[cropKey] || null);
      } else {
        setError(result.error || "Unexpected error occurred.");
      }
    } catch (err) {
      setError("Failed to fetch prediction. Please try again.");
      console.error("Error predicting crop:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Crop Prediction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block font-semibold capitalize text-gray-700">
              {key}
            </label>
            <input
              type="number"
              name={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              step={key === "ph" ? "0.01" : "1"} // Allows decimal for pH only
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Predict Crop
        </button>
      </form>

      {prediction && (
        <div className="mt-6 text-center">
          <p className="text-green-600 font-bold text-lg">
            Recommended Crop: {prediction}
          </p>
          {imageSrc && (
            <img
              src={imageSrc}
              alt={prediction}
              className="w-48 h-48 object-cover mt-4 mx-auto rounded-lg shadow-lg"
            />
          )}
        </div>
      )}

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default CropRecommendation;
