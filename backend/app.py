import os  
import joblib
import pandas as pd
import logging  
from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.market_prices import market_prices_bp

# Setup logging
logging.basicConfig(level=logging.INFO)

# Frontend URL setup
frontend_url = os.getenv('FRONT_END_URL', 'http://localhost:5173')

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": frontend_url}})

# Load model
model_path = os.getenv('model_path', 'models/crop_model.pkl')

try:
    model = joblib.load(model_path)
    logging.info(f"Model loaded successfully from {model_path}")
except FileNotFoundError:
    logging.error(f"Model file not found at {model_path}")
    raise Exception("Model file not found. Please check the model path.")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise

# Prediction route
@app.route('/predict', methods=['POST'])
def predict_crop():
    """Predicts the best crop based on input features."""
    if model is None:
        return jsonify({'error': 'Model not loaded properly'}), 500

    try:
        data = request.json
        required_features = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']

        logging.info("Received data: %s", data)

        if not all(feature in data for feature in required_features):
            logging.warning("Missing required input fields")
            return jsonify({'error': 'Missing required input fields'}), 400

        input_data = pd.DataFrame([data])[required_features]

        prediction = model.predict(input_data)
        predicted_crop = prediction[0]

        logging.info("Predicted crop: %s", predicted_crop)

        return jsonify({'predicted_crop': predicted_crop})

    except Exception as e:
        logging.error("Error during prediction: %s", e)
        return jsonify({'error': str(e)}), 400

# Health check route
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

# Register the blueprint for market prices
app.register_blueprint(market_prices_bp)

# Start the app
if __name__ == '__main__':
    debug = os.getenv('FLASK_DEBUG', 'False').lower() in ['true', '1', 't', 'y', 'yes']
    app.run(debug=debug, host="0.0.0.0", port=5000)