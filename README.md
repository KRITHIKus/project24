# FarmingAI — Agricultural Intelligence Platform

> A full-stack web application that combines machine learning, real-time weather data, and historical market intelligence to help Indian farmers make data-driven decisions about what to grow and when to sell.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46b556?style=flat-square)](https://farmer-ai-x2hw.onrender.com/)
[![Backend](https://img.shields.io/badge/Backend-Flask-white?style=flat-square&logo=flask&logoColor=black)](https://flask.palletsprojects.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![ML](https://img.shields.io/badge/Model-Random%20Forest-3a6b47?style=flat-square)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Machine Learning Model](#machine-learning-model)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Installation & Local Setup](#installation--local-setup)
- [Deployment](#deployment)
- [Dataset Sources](#dataset-sources)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## Overview

FarmingAI is a web-based advisory platform built to bridge the gap between traditional farming practices and modern data science. It provides three core services through a single, accessible interface:

1. **Crop Recommendation** — An ML model analyzes soil nutrient levels and climate conditions to suggest the most suitable crop for a given field.
2. **Weather Forecast** — Real-time 7-day forecasts fetched via the OpenWeatherMap API, filtered by the farmer's location.
3. **Market Price Trends** — Historical mandi (agricultural market) prices sourced from data.gov.in, visualized with interactive charts to help farmers time their selling decisions.

The platform is designed to be fast, mobile-responsive, and usable without technical knowledge — the primary audience is smallholder farmers across India.

---

## Problem Statement

Indian agriculture employs approximately 42% of the workforce yet faces persistent information gaps:

- **Crop selection** is often based on tradition rather than soil data, leading to suboptimal yields.
- **Weather-dependent decisions** (irrigation, harvesting, sowing) are made without reliable forecasts.
- **Market price opacity** means farmers frequently sell at the wrong time, unable to anticipate demand cycles.

Existing tools are either too expensive, require connectivity that rural zones lack, or are designed for agribusiness rather than smallholder farmers. FarmingAI addresses all three problems through a single, free, browser-based interface.

---

## Features

### Crop Recommendation System
- Input: Soil nitrogen (N), phosphorus (P), potassium (K), pH, temperature, humidity, and rainfall.
- Model: Random Forest classifier trained on the Kaggle crop prediction dataset (2,200 labeled samples across 22 crop types).
- Output: Recommended crop name with associated crop image.
- Validation: Input ranges are validated before submission to prevent out-of-distribution predictions.

### Weather Forecast
- Powered by the [OpenWeatherMap API](https://openweathermap.org/api).
- Displays a 7-day forecast: temperature (°C), humidity (%), wind speed (m/s), and precipitation (mm).
- Location-aware: users input their city or use geolocation.
- Hosted as a separate microservice on Render, linked from the main platform.

### Market Price Trends
- Data source: Crop price dataset downloaded from [data.gov.in](https://data.gov.in).
- Filters: State, district (optional), and commodity name.
- Visualisation: Grouped bar chart (Max vs. Min price) with horizontal scroll on mobile.
- Summary stats: Average Max, Average Min, All-time Peak, All-time Floor displayed below the chart.
- Volatility indicator: Each price card is tagged as `stable`, `moderate`, or `high` based on price spread.

### Agri Revolution Page
- Educational content on the history of agricultural technology — from the Green Revolution to AI.
- Six AI use cases grounded in peer-reviewed research (citations included).
- Balanced pros/cons of AI adoption in agriculture.
- Editorial section on responsible AI deployment for smallholder contexts.
- Blog integration (link configurable).

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
│                 React + TypeScript + Vite SPA                   │
│          Framer Motion · Chart.js · Tailwind CSS                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP (Axios)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Flask REST API (Python)                      │
│                                                                 │
│   POST /predict           POST /get_crop_price                  │
│   ┌─────────────────┐     ┌─────────────────────────────────┐   │
│   │ Input Validator │     │ Dataset Query Engine            │   │
│   │ → Random Forest │     │ (Pandas — data.gov.in CSV)      │   │
│   │   ML Model      │     └─────────────────────────────────┘   │
│   └─────────────────┘                                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          ▼                                 ▼
  ┌───────────────┐               ┌──────────────────┐
  │ Trained Model │               │ OpenWeatherMap   │
  │ (scikit-learn │               │ API (Weather     │
  │  .pkl file)   │               │  microservice)   │
  └───────────────┘               └──────────────────┘
```

**Data flow for crop recommendation:**
1. User submits form → React calls `POST /predict` via Axios.
2. Flask validates inputs (range checks for N, P, K, pH, etc.).
3. Validated data is passed to the loaded `RandomForestClassifier` model.
4. Predicted crop label is returned as JSON → React renders result + crop image.

**Data flow for market prices:**
1. User submits state + district + commodity → React calls `POST /get_crop_price`.
2. Flask filters the loaded CSV DataFrame using Pandas.
3. Returns matching price records and time-series trend data as JSON.
4. React renders price cards + Chart.js bar chart.

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.x | UI component framework |
| TypeScript | 5.6.x | Type safety |
| Vite | 6.0.x | Build tool and dev server |
| Tailwind CSS | 4.0.x | Utility-first CSS |
| Framer Motion | 12.x | Animations and transitions |
| Chart.js + react-chartjs-2 | 4.4.x | Data visualisation |
| React Router DOM | 7.x | Client-side routing |
| Axios | 1.7.x | HTTP client |
| React Icons | 5.4.x | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Runtime |
| Flask | 3.x | REST API framework |
| scikit-learn | 1.x | ML model (Random Forest) |
| Pandas | 2.x | Dataset querying |
| NumPy | 1.x | Numerical operations |
| joblib | 1.x | Model serialization |
| flask-cors | 4.x | Cross-origin resource sharing |

### Infrastructure
| Service | Purpose |
|---|---|
| Render | Backend + Weather microservice hosting |
| GitHub | Version control |

---

## Project Structure

```
farming-ai/
│
├── frontend/                        # React + TypeScript SPA
│   ├── public/
│   │   └── assets/
│   │       ├── crop_images/         # Crop image assets (22 crops)
│   │       └── background*.jpg      # Page backgrounds
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Responsive navbar with scroll-aware behaviour
│   │   │   └── Footer.tsx           # Site footer with navigation links
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing page with canvas animation
│   │   │   ├── CropRecommendation.tsx  # ML prediction form + result panel
│   │   │   ├── marketPrice.tsx      # Market price query + bar chart
│   │   │   ├── About.tsx            # Tab-based about page
│   │   │   └── AgriRevolution.tsx   # Agricultural technology editorial
│   │   ├── services/
│   │   │   ├── api.ts               # Axios base instance
│   │   │   ├── cropPrediction.ts    # /predict API call + validation
│   │   │   └── marketPrice.ts       # /get_crop_price API call
│   │   ├── App.tsx                  # Router configuration
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Design system (CSS variables, animations)
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                         # Flask REST API
│   ├── app.py                       # Main Flask application
│   ├── model/
│   │   ├── crop_model.pkl           # Trained Random Forest classifier
│   │   └── label_encoder.pkl        # Label encoder for crop names
│   ├── data/
│   │   └── market_prices.csv        # data.gov.in mandi price dataset
│   ├── requirements.txt
│   └── Procfile                     # Render deployment config
│
└── README.md
```

---

## Machine Learning Model

### Dataset
- **Source:** [Kaggle — Crop Recommendation Dataset](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset)
- **Size:** 2,200 samples
- **Classes:** 22 crop types (rice, maize, chickpea, kidneybeans, pigeonpeas, mothbeans, mungbean, blackgram, lentil, pomegranate, banana, mango, grapes, watermelon, muskmelon, apple, orange, papaya, coconut, cotton, jute, coffee)

### Features
| Feature | Description | Unit | Valid Range |
|---|---|---|---|
| N | Nitrogen content in soil | kg/ha | 0 – 200 |
| P | Phosphorus content in soil | kg/ha | 0 – 200 |
| K | Potassium content in soil | kg/ha | 0 – 200 |
| temperature | Ambient temperature | °C | -50 – 60 |
| humidity | Relative humidity | % | 0 – 100 |
| ph | Soil pH | 0 – 14 | 0 – 14 |
| rainfall | Annual rainfall | mm | 0 – 5000 |

### Model Training
```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib, pandas as pd

df = pd.read_csv('Crop_recommendation.csv')
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

le = LabelEncoder()
y_encoded = le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print(f"Accuracy: {accuracy_score(y_test, model.predict(X_test)) * 100:.2f}%")
# Accuracy: ~98.18%

joblib.dump(model, 'crop_model.pkl')
joblib.dump(le, 'label_encoder.pkl')
```

### Performance
| Metric | Value |
|---|---|
| Training accuracy | ~99.5% |
| Test accuracy | ~98.2% |
| Algorithm | Random Forest (100 trees) |
| Cross-validation | 5-fold |

---

## API Reference

### Base URL
```
http://localhost:5000          # Local development
https://your-api.onrender.com  # Production
```

---

### `POST /predict`

Predicts the most suitable crop based on soil and climate parameters.

**Request Body**
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 25.5,
  "humidity": 80.0,
  "ph": 6.5,
  "rainfall": 200.0
}
```

**Success Response** `200 OK`
```json
{
  "predicted_crop": "rice"
}
```

**Error Response** `400 Bad Request`
```json
{
  "error": "Invalid input values. Ensure all values are within valid ranges."
}
```

**Validation rules applied server-side:**
- `N`, `P`, `K` must be ≥ 0
- `ph` must be between 0 and 14 (exclusive)
- `temperature` must be between -50 and 60
- `humidity` must be between 0 and 100
- `rainfall` must be ≥ 0

---

### `POST /get_crop_price`

Returns historical mandi prices for a given crop and location.

**Request Body**
```json
{
  "state": "Karnataka",
  "district": "Mysuru",
  "crop_name": "WHEAT"
}
```

> `district` is optional. `crop_name` must be in **ALL CAPS**.

**Success Response** `200 OK`
```json
{
  "crop_prices": [
    {
      "State": "Karnataka",
      "District": "Mysuru",
      "Commodity": "WHEAT",
      "MaxPrice": 2800,
      "MinPrice": 2400
    }
  ],
  "price_trends": [
    { "Date": "01/01/2024", "MaxPrice": 2750, "MinPrice": 2350 },
    { "Date": "15/01/2024", "MaxPrice": 2800, "MinPrice": 2400 }
  ]
}
```

**Error Response** `200 OK` (no matching records)
```json
{
  "error": "No price data found for the given filters."
}
```

---

## Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://127.0.0.1:5000
```
On production, set `VITE_API_URL` to your deployed Flask API URL.

### Backend
No `.env` file required by default. If you add API keys (e.g., OpenWeatherMap), store them as:
```env
OPENWEATHER_API_KEY=your_api_key_here
```
And access via `os.environ.get('OPENWEATHER_API_KEY')` in Flask.

---

## Installation & Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- pip

### 1. Clone the repository
```bash
git clone https://github.com/KRITHIKus/project24.git
cd project24
```

### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt
python app.py
# Flask runs on http://127.0.0.1:5000
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
# Vite dev server runs on http://localhost:5173
```

### 4. Configure the API URL
Create `frontend/.env`:
```env
VITE_API_URL=http://127.0.0.1:5000
```

### 5. Open in browser
```
http://localhost:5173
```

---

## Deployment

The application is deployed using [Render](https://render.com) via GitHub integration.

### Backend (Flask)
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set the **Build Command:**
   ```bash
   pip install -r requirements.txt
   ```
4. Set the **Start Command:**
   ```bash
   gunicorn app:app
   ```
5. Add environment variable: `PYTHON_VERSION = 3.10.0`

### Frontend (React)
1. Create a new **Static Site** on Render.
2. Set **Build Command:**
   ```bash
   npm install && npm run build
   ```
3. Set **Publish Directory:** `dist`
4. Add environment variable: `VITE_API_URL = https://your-flask-api.onrender.com`

### Weather Service
The weather microservice is deployed separately as a standalone Flask app at `https://weather-api-es7c.onrender.com/`.

---

## Dataset Sources

| Dataset | Source | Usage |
|---|---|---|
| Crop Recommendation Dataset | [Kaggle](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset) | Training the Random Forest crop prediction model |
| Agricultural Market Prices | [data.gov.in](https://data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi) | Historical mandi price queries and trend charts |
| Weather Data | [OpenWeatherMap API](https://openweathermap.org/api) | Real-time 7-day weather forecasts |

---


| Page | Description |
|---|---|
| **Home** | Animated hero with canvas-rendered nature + AI visualization, module cards, workflow steps |
| **Crop Recommendation** | Two-column form with real-time result panel and crop image |
| **Market Trends** | Filter sidebar + grouped bar chart with mobile horizontal scroll |
| **Agri Revolution** | Historical timeline, AI use cases with research citations, editorial section |
| **About** | Tab-based layout — system overview, workflow timeline, developer profile |

---

## Roadmap

| Feature | Status |
|---|---|
| Crop recommendation (RF model) | ✅ Complete |
| Weather forecast integration | ✅ Complete |
| Market price trends + charts | ✅ Complete |
| Mobile responsive design | ✅ Complete |
| Agri Revolution editorial page | ✅ Complete |
| Multi-language support (Hindi, Kannada, Tamil) | 🔲 Planned |
| Offline mode (PWA) | 🔲 Planned |
| SMS weather alerts | 🔲 Planned |
| Satellite imagery field health scoring | 🔲 Planned |
| Community mandi price reporting | 🔲 Planned |
| Crop disease detection (CNN model) | 🔲 Planned |

---

## Contributing

Contributions are welcome. To propose a change:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: describe your change'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request with a clear description of what was changed and why.

**Commit message convention:**
```
feat:     new feature
fix:      bug fix
docs:     documentation only
style:    formatting, no logic change
refactor: code restructure without feature change
```

---

## Author

**Krithik U S**  
Full-Stack Developer · AI Engineer

Designed, developed, and deployed this platform end-to-end — from training the crop prediction model and building the Flask API to designing the React frontend and writing the educational content on agricultural AI.

- Portfolio: [Portfolio](https://krithik01.onrender.com)
- GitHub: [@KRITHIKus](https://github.com/KRITHIKus)
- Blog: [AI + Agriculture post](https://a2d-blog.onrender.com/dashboard/post/ai-in-agriculture-from-data-to-decisions)

---

## License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 Krithik U S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

> Built with the goal that a farmer holding 2 hectares in Vidarbha should make a better decision this season than last — using nothing more than a phone and a browser.