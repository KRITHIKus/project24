from flask import Blueprint, request, jsonify
from models.crop_model import load_model

crop_bp = Blueprint('crop', __name__)

@crop_bp.route('/recommend', methods=['POST'])
def recommend_crop():
    try:
        data = request.json
        soil = data['soil_type']
        temp = data['temperature']
        humidity = data['humidity']
        rainfall = data['rainfall']
        
        model = load_model()
        prediction = model.predict([[soil, temp, humidity, rainfall]])
        return jsonify({'recommended_crop': prediction[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
