from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from routes.market_prices import market_prices_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

app.register_blueprint(market_prices_bp)

# Load the trained model
model = joblib.load('models/crop_model.pkl')

@app.route('/predict', methods=['POST'])
def predict_crop():
    try:
        # Get the input data from the request
        data = request.json

        # Convert the input data to a DataFrame
        input_data = pd.DataFrame([data])

        # Ensure the input columns match the model's features
        features = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']
        input_data = input_data[features]

        # Make predictions
        prediction = model.predict(input_data)
        predicted_crop = prediction[0]

        # Return the predicted crop
        return jsonify({'predicted_crop': predicted_crop})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)


