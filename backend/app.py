import os  # <-- Handling environment variables
import joblib
import pandas as pd
import logging  # <-- For better logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.market_prices import market_prices_bp

# Setup Logging
logging.basicConfig(level=logging.INFO)  # <-- Configured logging to capture info level logs

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load model path from environment variable (defaults to 'models/crop_model.pkl')
model_path = os.getenv('model_path', 'models/crop_model.pkl')  # <-- Path to model file

# Load the pre-trained crop prediction model
try:
    model = joblib.load(model_path)  # <-- Loading model with error handling
    logging.info(f"Model loaded successfully from {model_path}")  # <-- Log successful model loading
except FileNotFoundError:
    logging.error(f"Model file not found at {model_path}")  # <-- Log error if model is not found
    raise Exception("Model file not found. Please check the model path.")
except Exception as e:
    logging.error(f"Error loading model: {e}")  # <-- Catch other exceptions during model loading
    raise

@app.route('/predict', methods=['POST'])
def predict_crop():
    """Predicts the best crop based on input features."""
    if model is None:
        return jsonify({'error': 'Model not loaded properly'}), 500

    try:
        # Parse input data from the request
        data = request.json
        required_features = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']

        # Log the incoming data for debugging
        logging.info("Received data: %s", data)  # <-- Log the incoming request data

        # Validate input data
        if not all(feature in data for feature in required_features):
            logging.warning("Missing required input fields")  # <-- Log warning for missing fields
            return jsonify({'error': 'Missing required input fields'}), 400

        # Convert input data to DataFrame for prediction
        input_data = pd.DataFrame([data])[required_features]

        # Make prediction using the model
        prediction = model.predict(input_data)
        predicted_crop = prediction[0]

        logging.info("Predicted crop: %s", predicted_crop)  # <-- Log prediction result

        return jsonify({'predicted_crop': predicted_crop})

    except Exception as e:
        logging.error("Error during prediction: %s", e)  # <-- Log the error for debugging
        return jsonify({'error': str(e)}), 400

# Health check route for monitoring the server status
@app.route('/health', methods=['GET'])  # <-- Added health check route
def health_check():
    return jsonify({'status': 'ok'}), 200

# Register market price prediction blueprint
app.register_blueprint(market_prices_bp)

if __name__ == '__main__':
    # Control Flask debug mode using an environment variable
    debug = os.getenv('FLASK_DEBUG', 'False').lower() in ['true', '1', 't', 'y', 'yes']
    app.run(debug=debug, host="0.0.0.0", port=5000)  # <-- Run the app
