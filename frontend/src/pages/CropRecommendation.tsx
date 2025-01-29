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

  // Map of crops to their images
  const cropImages: Record<string, string> = {
    rice: "/assets/crop_images/rice.jpg",
    corn: "/assets/crop_images/corn.jpg",
    orange: "/assets/crop_images/orange.jpg",
    banana: "/assets/crop_images/banana.jpg",
    mungbean : "/assets/crop_images/mung bean.jpg",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrediction(null);
    setError(null);
    setImageSrc(null);

    const result = await predictCrop(formData);
    if (result.predicted_crop) {
      setPrediction(result.predicted_crop);
      setImageSrc(cropImages[result.predicted_crop.toLowerCase()] || null);
    } else {
      setError(result.error || "Unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Crop Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block font-semibold capitalize">{key}</label>
            <input
              type="number"
              name={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
          Predict Crop
        </button>
      </form>

      {prediction && (
        <div className="mt-4">
          <p className="text-green-600 font-bold">Recommended Crop: {prediction}</p>
          {imageSrc && <img src={imageSrc} alt={prediction} className="w-48 h-48 object-cover mt-2" />}
        </div>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default CropRecommendation;
