// import { useState } from "react";
// import { predictCrop } from "../services/cropPrediction";
// import { motion } from "framer-motion";

// const CropRecommendation = () => {
//   const [formData, setFormData] = useState({
//     N: "",
//     P: "",
//     K: "",
//     ph: "",
//     temperature: "",
//     humidity: "",
//     rainfall: "",
//   });

//   const [prediction, setPrediction] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [imageSrc, setImageSrc] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [warnings, setWarnings] = useState<{ [key: string]: boolean }>({});

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setWarnings((prev) => ({ ...prev, [name]: false })); // Remove warning on change
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Check for empty fields
//     const emptyFields = Object.keys(formData).filter((key) => formData[key as keyof typeof formData] === "");
//     if (emptyFields.length > 0) {
//       setWarnings(emptyFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}));
//       return;
//     }

//     setLoading(true);
//     setPrediction(null);
//     setError(null);
//     setImageSrc(null);

//     try {
//       const numericData = Object.fromEntries(
//         Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
//       );

//       const result = await predictCrop(numericData);
//       if (result.predicted_crop) {
//         setPrediction(result.predicted_crop);
//         setImageSrc(`/assets/crop_images/${result.predicted_crop.toLowerCase().replace(/\s+/g, "")}.jpg`);
//       } else {
//         setError(result.error || "Unexpected error occurred.");
//       }
//     } catch (err) {
//       setError("Failed to fetch prediction. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex justify-center items-center px-4">
//       {/* Background with blur effect */}
//       <div
//         className="absolute inset-0 bg-cover bg-center blur-md brightness-75"
//         style={{ backgroundImage: "url('/assets/background4.jpeg')" }}
//       ></div>

//       {/* Modern Glassmorphism Form */}
//       <div className="relative w-full max-w-lg mt-25 mb-20 bg-opacity-20 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border-opacity-30">
//         {/* Title with animation */}
//         <motion.h2
//           className="text-4xl   font-extrabold text-center text-black drop-shadow-lg"
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//         >
//           Crop Recommendation
//         </motion.h2>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="mt-6 space-y-5">
//           {Object.keys(formData).map((key) => (
//             <div key={key} className="relative">
//               <label className="absolute -top-3 mt-1 left-4 bg-opacity-20 px-2 text-sm font-medium text-black backdrop-blur-md rounded-md">
//                 {key.toUpperCase()}
//               </label>
//               <input
//                 type="number"
//                 name={key}
//                 value={formData[key as keyof typeof formData]}
//                 onChange={handleChange}
//                 step="any"
//                 className={`w-full mt-5 p-2 text-lg border-none rounded-lg bg-white bg-opacity-30 text-black placeholder-gray-200 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-md ${
//                   warnings[key] ? "border-2 border-red-500" : ""
//                 }`}
//                 required
//               />
//               {warnings[key] && <p className="text-red-500 text-sm mt-1">This field is required</p>}
//             </div>
//           ))}

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-900 to-green-500 text-white py-3 text-lg rounded-lg font-semibold hover:scale-105 transition duration-300 shadow-lg"
//             disabled={loading}
//           >
//             {loading ? "Predicting..." : "Predict Crop"}
//           </button>
//         </form>

//         {/* Prediction result */}
//         {prediction && !loading && (
//           <div className="mt-6 text-center">
//             <p className="text-green-300 font-bold text-xl">Recommended Crop: {prediction}</p>
//             {imageSrc && <img src={imageSrc} alt={prediction} className="w-40 h-40 object-cover mt-4 mx-auto rounded-lg shadow-lg" />}
//           </div>
//         )}

//         {/* Error message */}
//         {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default CropRecommendation;



import { useState } from "react";
import { predictCrop } from "../services/cropPrediction";
import { motion } from "framer-motion";

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    ph: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [warnings, setWarnings] = useState<{ [key: string]: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Remove warning when the user starts typing
    setWarnings({ ...warnings, [name]: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);
    setImageSrc(null);

    // **Validation Check**
    let newWarnings: { [key: string]: boolean } = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        newWarnings[key] = true;
        isValid = false;
      }
    });

    if (!isValid) {
      setWarnings(newWarnings);
      setLoading(false);
      return;
    }

    try {
      const numericData = {
        N: parseFloat(formData.N),
        P: parseFloat(formData.P),
        K: parseFloat(formData.K),
        ph: parseFloat(formData.ph),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        rainfall: parseFloat(formData.rainfall),
      };

      const result = await predictCrop(numericData);
      if (result.predicted_crop) {
        setPrediction(result.predicted_crop);
        setImageSrc(`/assets/crop_images/${result.predicted_crop.toLowerCase().replace(/\s+/g, "")}.jpg`);
      } else {
        setError(result.error || "Unexpected error occurred.");
      }
    } catch (err) {
      setError("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="relative min-h-screen flex justify-center  items-center px-4">
    {/* Background with improved quality */}
    <div
      className="absolute inset-0 bg-cover bg-center blur-sm brightness-90"
      style={{ backgroundImage: "url('/assets/background6.jpg')" }}
    ></div>

      {/* Modern Glassmorphism Form */}
      <div className="relative w-full max-w-lg mt-25 mb-20 bg-opacity-20 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border-opacity-30">
        {/* Title with animation */}
        <motion.h2
          className="text-4xl font-extrabold text-center text-black drop-shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Crop Recommendation 
        </motion.h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {Object.keys(formData).map((key) => (
            <div key={key} className="relative">
              {/* Updated Label (Always Visible) */}
              <label className="block text-white font-mono mb-1">{key.toUpperCase()}</label>
              <input
                type="number"
                name={key}
                value={formData[key as keyof typeof formData]}
                onChange={handleChange}
                className={`w-full p-3 h-12 text-lg border border-gray-300 rounded-lg bg-white bg-opacity-40 text-black placeholder-gray-400 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none backdrop-blur-md ${
                  warnings[key] ? "border-red-500 border-2" : ""
                }`}
                step="0.01"
                required
              />
              {warnings[key] && <p className="text-red-500 text-sm mt-1">This field is required.</p>}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 text-lg rounded-lg font-semibold hover:scale-105 transition duration-300 shadow-lg"
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict Crop"}
          </button>
        </form>

        {/* Prediction result */}
        {prediction && !loading && (
          <div className="mt-6 text-center">
            <p className="text-green-300 font-bold text-xl">Recommended Crop: {prediction}</p>
            {imageSrc && <img src={imageSrc} alt={prediction} className="w-40 h-40 object-cover mt-4 mx-auto rounded-lg shadow-lg" />}
          </div>
        )}

        {/* Error message */}
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default CropRecommendation;
