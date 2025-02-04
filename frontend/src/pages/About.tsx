
export default function About() {
  return (
    <div className="flex flex-col items-center text-center px-6 py-12 bg-gray-50">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-16 md:py-20 shadow-lg rounded-b-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide"> Farming AI</h1>
        <p className="text-lg md:text-xl mt-4 max-w-3xl mx-auto font-light">
          Leveraging AI and web technologies to empower farmers with **data-driven insights**.
        </p>
      </div>

      {/* Key Features */}
      <div className="mt-12 md:mt-16 w-full max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">🌟 Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "🌱 Crop Recommendation",
              desc: "AI suggests the best crops based on soil, weather, and regional data.",
              color: "bg-green-100 text-green-700",
            },
            {
              title: "☀️ Weather Forecasts",
              desc: "Provides 7-day forecasts using OpenWeatherMap API for farming decisions.",
              color: "bg-blue-100 text-blue-700",
            },
            {
              title: "📉 Market Price Trends",
              desc: "Historical crop prices from data.gov.in for informed market decisions.",
              color: "bg-yellow-100 text-yellow-700",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 ${feature.color}`}
            >
              <h3 className="text-2xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-700 text-lg">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-12 md:mt-16 w-full max-w-5xl text-left">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center mb-6">🔹 How It Works</h2>
        <ul className="text-lg text-gray-700 space-y-4 bg-white p-6 rounded-lg shadow-lg">
          <li>✅ Farmers input **location, and climate conditions**.</li>
          <li>✅ Model analyzes **soil nutrients, weather forecasts, and historical data**.</li>
          <li>✅ The system recommends the **best crops** for maximum yield.</li>
          <li>✅ Farmers can also check **weather updates and market prices**.</li>
          <li>✅ Helps **maximize profits and reduce risks** in farming.</li>
        </ul>
      </div>

      

      {/* Project Contributors */}
      <div className="mt-12 md:mt-16 w-full max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">👨‍💻 Project Contributors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg text-gray-700">
          {[
            { name: "Krithik U S",  color: "bg-green-100 text-green-700" },
            { name: "Prashanth R",  color: "bg-blue-100 text-blue-700" },
            { name: "C Avino Theja", color: "bg-yellow-100 text-yellow-700" },
          ].map((contributor, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 ${contributor.color}`}
            >
              <h3 className="text-2xl font-semibold">{contributor.name}</h3>
              
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Repository Link */}
      <div className="mt-12 md:mt-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">🔗 GitHub Repository</h2>
        <p className="mt-2 text-gray-600">Check out our code on GitHub:</p>
        <a
          href="https://github.com/YOUR_GITHUB_LINK"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          View on GitHub 🚀
        </a>
      </div>
    </div>
  );
}
