from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from routes.market_prices import market_prices_bp

app = Flask(__name__)
CORS(app)  

app.register_blueprint(market_prices_bp)


model = joblib.load('models/crop_model.pkl')

@app.route('/predict', methods=['POST'])
def predict_crop():
    try:
        
        data = request.json

        
        input_data = pd.DataFrame([data])

        
        features = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']
        input_data = input_data[features]

        
        prediction = model.predict(input_data)
        predicted_crop = prediction[0]

       
        return jsonify({'predicted_crop': predicted_crop})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)


