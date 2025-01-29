# # from flask import Flask, request, jsonify
# # from flask_cors import CORS
# # import joblib
# # import pandas as pd
# # from routes.market_prices import market_prices_bp

# # app = Flask(__name__)
# # CORS(app)  

# # app.register_blueprint(market_prices_bp)


# # model = joblib.load('models/crop_model.pkl')

# # @app.route('/predict', methods=['POST'])
# # def predict_crop():
# #     try:
        
# #         data = request.json

        
# #         input_data = pd.DataFrame([data])

        
# #         features = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']
# #         input_data = input_data[features]

        
# #         prediction = model.predict(input_data)
# #         predicted_crop = prediction[0]

       
# #         return jsonify({'predicted_crop': predicted_crop})

# #     except Exception as e:
# #         return jsonify({'error': str(e)}), 400

# # if __name__ == '__main__':
# #     app.run(debug=True)

# # from flask import Flask, request, jsonify
# # from flask_cors import CORS
# # import joblib
# # import pandas as pd

# # # Import route modules
# # from routes.market_prices import market_prices_bp

# # # Initialize Flask app
# # app = Flask(__name__)
# # CORS(app)  # Enable CORS for frontend communication

# # # Register Blueprints
# # app.register_blueprint(market_prices_bp)

# # # Load AI Model
# # try:
# #     model = joblib.load('models/crop_model.pkl')
# # except Exception as e:
# #     model = None
# #     print(f"Error loading model: {e}")

# # @app.route('/predict', methods=['POST'])
# # def predict_crop():
# #     """Predicts the best crop based on input features."""
# #     if model is None:
# #         return jsonify({'error': 'Model not loaded properly'}), 500

# #     try:
# #         # Parse input data
# #         data = request.json
# #         required_features = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']

# #         # Validate input data
# #         if not all(feature in data for feature in required_features):
# #             return jsonify({'error': 'Missing required input fields'}), 400

# #         # Convert input to DataFrame
# #         input_data = pd.DataFrame([data])[required_features]

# #         # Make prediction
# #         prediction = model.predict(input_data)
# #         predicted_crop = prediction[0]

# #         return jsonify({'predicted_crop': predicted_crop})

# #     except Exception as e:
# #         return jsonify({'error': str(e)}), 400

# # if __name__ == '__main__':
# #     app.run(debug=True)

# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import joblib
# import pandas as pd
# import os

# # Import route modules
# from routes.market_prices import market_prices_bp

# # Initialize Flask app
# app = Flask(__name__, static_folder="dist", static_url_path="/")
# CORS(app)  # Enable CORS for frontend communication

# # Register Blueprints
# app.register_blueprint(market_prices_bp)

# # Load AI Model
# try:
#     model = joblib.load('models/crop_model.pkl')
# except Exception as e:
#     model = None
#     print(f"Error loading model: {e}")

# @app.route('/predict', methods=['POST'])
# def predict_crop():
#     """Predicts the best crop based on input features."""
#     if model is None:
#         return jsonify({'error': 'Model not loaded properly'}), 500

#     try:
#         # Parse input data
#         data = request.json
#         required_features = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']

#         # Validate input data
#         if not all(feature in data for feature in required_features):
#             return jsonify({'error': 'Missing required input fields'}), 400

#         # Convert input to DataFrame
#         input_data = pd.DataFrame([data])[required_features]

#         # Make prediction
#         prediction = model.predict(input_data)
#         predicted_crop = prediction[0]

#         return jsonify({'predicted_crop': predicted_crop})

#     except Exception as e:
#         return jsonify({'error': str(e)}), 400

# # Serve React Frontend
# @app.route('/')
# def serve_frontend():
#     return send_from_directory("dist", "index.html")

# @app.route('/<path:path>')
# def serve_static(path):
#     return send_from_directory("dist", path)

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Enable Cross-Origin Resource Sharing (CORS) for frontend

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
