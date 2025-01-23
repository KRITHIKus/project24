# routes/market_prices.py
from flask import Blueprint, jsonify, request
import requests

market_prices_bp = Blueprint('market_prices', __name__)

# Actual Agmarknet API URL
AGMARKNET_API_URL = ''
API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'

@market_prices_bp.route('/market-prices', methods=['GET'])
def get_market_prices():
    try:
        # Optional: Accept a crop name or state as a query parameter
        crop_name = request.args.get('crop', '')
        state_name = request.args.get('state', '')

        # Fetch market price data from the external API
        response = requests.get(
            AGMARKNET_API_URL,
            headers={"Authorization": f"Bearer {API_KEY}"},
            params={"crop": crop_name, "state": state_name}
        )
        response.raise_for_status()  # Raise exception for HTTP errors

        # Process the API response
        data = response.json()  # Assuming API returns JSON

        # Return processed data
        return jsonify({
            "status": "success",
            "data": data
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500