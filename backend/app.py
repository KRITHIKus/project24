from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})

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

if __name__ == '__main__':
    app.run(debug=True)
