from flask import Blueprint, request, jsonify
import pandas as pd

market_prices_bp = Blueprint('market_prices', __name__)

@market_prices_bp.route('/get_crop_price', methods=['POST'])
def get_crop_price():
    try:
        # Get data from request
        data = request.json
        state = data.get('state')
        district = data.get('district')  # Optional district filter
        crop_name = data.get('crop_name')

        # Check for required fields
        if not state or not crop_name:
            return jsonify({'error': 'State and crop_name are required fields'}), 400

        # Load dataset
        df = pd.read_csv('datasets/market_prices.csv')

        # Rename "Arrival_Date" to "Date" if it exists for consistency
        if 'Arrival_Date' in df.columns:
            df.rename(columns={'Arrival_Date': 'Date'}, inplace=True)

        # Ensure required columns exist to avoid KeyErrors
        required_columns = {'State', 'District', 'Commodity', 'Date', 'MaxPrice', 'MinPrice'}
        missing_columns = required_columns - set(df.columns)
        if missing_columns:
            return jsonify({'error': f'Missing required columns: {missing_columns}'}), 500

        # Filter data based on state, crop name, and optional district
        filtered_data = df[(df['State'].str.lower() == state.lower()) & (df['Commodity'].str.lower() == crop_name.lower())]
        if district:
            filtered_data = filtered_data[filtered_data['District'].str.lower() == district.lower()]

        # If no data is found after filtering
        if filtered_data.empty:
            return jsonify({'error': 'No data found for the given state, district, and crop_name'}), 404

        # Ensure "Date" is in proper format for sorting
        filtered_data['Date'] = pd.to_datetime(filtered_data['Date'], errors='coerce')
        filtered_data = filtered_data.dropna(subset=['Date'])  # Remove rows with invalid dates
        filtered_data = filtered_data.sort_values(by='Date')  # Sort data by date

        # Convert filtered data to JSON
        response_data = filtered_data.to_dict(orient='records')

        # Extract historical price trends for chart visualization
        price_trends = filtered_data[['Date', 'MaxPrice', 'MinPrice']].to_dict(orient='records')

        return jsonify({'crop_prices': response_data, 'price_trends': price_trends})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
