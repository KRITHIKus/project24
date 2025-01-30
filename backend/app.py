from flask import Flask
from flask_cors import CORS
from routes.market_prices import market_prices_bp  # Import your market price routes
import joblib
import pandas as pd
from flask import Flask, request, jsonify  #

app = Flask(__name__)
CORS(app)## resources={r"/*": {"origins": "http://localhost:5173"}})  # Enable CORS for all endpoints

# Load the pre-trained crop prediction model
model = joblib.load('models/crop_model.pkl')

@app.route('/predict', methods=['POST'])
def predict_crop():
    """Predicts the best crop based on input features."""
    if model is None:
        return jsonify({'error': 'Model not loaded properly'}), 500

    try:
        # Parse input data from the request
        data = request.json
        required_features = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']

        # Log incoming request data for debugging
        print("Received data:", data)

        # Validate input data
        if not all(feature in data for feature in required_features):
            return jsonify({'error': 'Missing required input fields'}), 400

        # Convert input to DataFrame for prediction
        input_data = pd.DataFrame([data])[required_features]

        # Make prediction using the model
        prediction = model.predict(input_data)
        predicted_crop = prediction[0]

        print("Predicted crop:", predicted_crop)  # Log the prediction result

        return jsonify({'predicted_crop': predicted_crop})

    except Exception as e:
        print("Error during prediction:", e)  # Log the error for debugging
        return jsonify({'error': str(e)}), 400

# Register market price prediction blueprint
app.register_blueprint(market_prices_bp)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)  # Allow access on network
