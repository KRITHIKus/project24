# import requests
# from flask import Blueprint, request, jsonify
# from utils.config import OPENWEATHERMAP_API_KEY

# weather_bp = Blueprint('weather', __name__)

# @weather_bp.route('/forecast', methods=['GET'])
# def get_weather():
#     try:
#         location = request.args.get('location')
#         url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={OPENWEATHERMAP_API_KEY}"
#         response = requests.get(url)
#         response.raise_for_status()
#         return jsonify(response.json())
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400
