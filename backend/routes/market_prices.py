from flask import Blueprint, request, jsonify
import pandas as pd

market_prices_bp = Blueprint('market_prices', __name__)


@market_prices_bp.route('/get_crop_price', methods=['POST'])
def get_crop_price():
    try:
        data = request.json
        state = data.get('state')
        crop_name = data.get('crop_name')

        if not state or not crop_name:
            return jsonify({'error': 'State and crop_name are required fields'}), 400

        df = pd.read_csv('datasets/market_prices.csv')

        # Filter data based on state and crop name
        filtered_data = df[(df['State'] == state) & (df['Commodity'] == crop_name)]

        if filtered_data.empty:
            return jsonify({'error': 'No data found for the given state and crop_name'}), 404

        # Convert filtered data to JSON
        response_data = filtered_data.to_dict(orient='records')
        return jsonify({'crop_prices': response_data})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
