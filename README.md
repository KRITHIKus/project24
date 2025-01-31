# 🌾 Farming Web Service Using AI

## 📌 Introduction  
Agriculture is the backbone of many economies, yet farmers face challenges such as **unpredictable weather, fluctuating market prices, and lack of technology-driven insights**.  

This project leverages **Artificial Intelligence (AI)** and **web technologies** to provide farmers with **data-driven recommendations** to enhance productivity, profitability, and sustainability. 🚀  

---

## 🎯 Objectives  
✅ Provide **crop recommendations** based on soil and weather data.  
✅ Display **real-time weather forecasts** using OpenWeatherMap API.  
✅ Offer **market price trends and updates** using **a dataset from data.gov.in**.  

---

## 🌟 Key Features  

### 🌱 1. Crop Recommendation System  
**🔹 Description**: Suggests the most suitable crops based on soil properties, weather conditions, and location.  

**📥 Inputs Required**:  
- **Soil properties**: pH, NPK levels, moisture content.  
- **Weather data**: Temperature, rainfall, humidity.  
- **Regional Information**: Climatic zone and location.  

**🛠️ Technology Stack**:  
- **Dataset**: Crop prediction dataset from **Kaggle**.  
- **AI Model**: Random Forest trained on crop suitability data.  
- **User Interaction**: Input fields for soil and weather data.  
- **Output**: Crop recommendations with estimated yield and required resources.  

**🎯 Benefits**:  
✅ Optimizes land use.  
✅ Increases yield and resource efficiency.  

---

### ☁️ 2. Weather Forecasts  
**🔹 Description**: Displays real-time weather data for farmers based on their location.  

**📌 Features**:  
- **7-day weather forecasts** fetched from OpenWeatherMap API.  
- **Temperature, humidity, wind speed, and rainfall data** for better planning.  
- **User input for location** to fetch area-specific weather data.  

**🛠️ Technology Stack**:  
- **API**: OpenWeatherMap API for fetching weather data.  
- **Backend**: Flask processes API requests and formats weather data.  
- **Frontend**: React.js displays weather details in an intuitive interface.  

**🎯 Benefits**:  
✅ Helps farmers plan irrigation, harvesting, and other farm activities.  
✅ Provides essential climate insights for better decision-making.  

---

### 📊 3. Market Price Trends and Updates  
**🔹 Description**: Displays crop price trends based on **a dataset downloaded from data.gov.in** instead of real-time API updates.  

**📌 Features**:  
- **Historical and up-to-date crop prices** from the dataset.  
- **Visualization of price trends** over time using interactive charts.  
- **Filters for state and district** to refine market price data.  

**🛠️ Technology Stack**:  
- **Dataset Source**: Data downloaded from **data.gov.in**.  
- **Backend**: Flask processes and fetches data from the dataset.  
- **Frontend**: React.js displays structured crop price information.  
- **Chart.js**: Provides interactive price trend visualization.  

**🎯 Benefits**:  
✅ Allows farmers to analyze past market trends.  
✅ Empowers them to make informed selling decisions based on **historical price data**.  

---

## ⚙️ Technologies Used  

### 🎨 Frontend  
- **React.js** – For a dynamic and responsive UI.  
- **Tailwind CSS** – For modern, flexible, and fast UI styling.  
- **Chart.js** – For visualizing market trends and weather data.  
- **Vite** – As the frontend build tool for fast development.  

### 🖥️ Backend  
- **Flask** – Lightweight framework for API development.  
- **TensorFlow** – AI models for crop recommendation.  
- **No Database** – The system operates based on datasets without using a dedicated database.  

### 📊 Datasets Used  
- **Crop Prediction Dataset** – Downloaded from **Kaggle**.  
- **Market Prices Dataset** – Downloaded from **data.gov.in**.  

### 🔗 APIs  
- **OpenWeatherMap API** – Fetches weather forecasts.  

### 🛠️ Version Control & Hosting  
- **GitHub** – Used for version control and project management.  
- **Render** – Used for hosting via GitHub repository.  

---

## 🚀 How It Works  

### 1️⃣ Crop Recommendation System  
📥 **Inputs**: Soil pH, temperature, rainfall, location.  
⚙️ **Process**: AI models analyze data and recommend suitable crops.  
📤 **Output**: A list of crops with estimated yield and growth period.  

### 2️⃣ Weather Forecasts  
📥 **Inputs**: Farmer’s location.  
⚙️ **Process**: Fetches real-time weather data from OpenWeatherMap API.  
📤 **Output**: Displays a **7-day weather forecast** with temperature, humidity, and precipitation data.  

### 3️⃣ Market Price Trends  
📥 **Inputs**: Crop name or farmer’s location.  
⚙️ **Process**: Fetches historical price data fro
