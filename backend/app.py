import requests
from flask import Flask, jsonify, request
import logging
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

logging.basicConfig(level=logging.DEBUG)

# Finnhub API key (replace with your actual key)
FINNHUB_API_KEY = 'csvq1bpr01qo5uueium0csvq1bpr01qo5uueiumg'

# Route to get stock data by ticker symbol
@app.route('/stock', methods=['GET'])
def get_stock_data():
    search_term = request.args.get('search_term')
    period = request.args.get('period', '1d')  # Default to 1 day

    if not search_term:
        return jsonify({'error': 'No search term provided'}), 400

    try:
        stock = yf.Ticker(search_term)
        data = stock.history(period=period, interval='1h' if period in ['1d', '1wk'] else '1d')

        if data.empty:
            return jsonify({'error': f'No data found for {search_term}. The symbol may be delisted or incorrect.'}), 404

        # Prepare stock data for the chart
        if period in ['1d', '1wk']:
            labels = data.index.strftime('%Y-%m-%d %H:%M:%S').tolist()  # Include time for day/week
        else:
            labels = data.index.strftime('%Y-%m-%d').tolist()  # Only dates for month/year

        stock_data = {
            'symbol': search_term,
            'prices': data['Close'].tolist(),  # Convert prices to a list
            'dates': labels,  # Use the formatted labels
            'volume': data['Volume'].tolist()
        }

        logging.debug(f"Stock data: {stock_data}")  # Debugging log

        return jsonify(stock_data)

    except Exception as e:
        logging.error(f"Error fetching stock data for {search_term}: {e}")
        return jsonify({'error': f'Error fetching stock data: {str(e)}'}), 500


# Route to get stock suggestions (autocomplete) using Finnhub
@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    search_term = request.args.get('search_term')
    if not search_term:
        return jsonify({'error': 'No search term provided for autocomplete'}), 400

    try:
        # Call Finnhub's symbol search API
        url = f'https://finnhub.io/api/v1/search'
        params = {
            'q': search_term,
            'token': FINNHUB_API_KEY
        }
        response = requests.get(url, params=params)
        data = response.json()

        if 'result' not in data:
            return jsonify({'error': 'No matches found'}), 404

        suggestions = [
            {
                'symbol': match['symbol'],
                'name': match['description']
            }
            for match in data['result']
        ]

        return jsonify(suggestions)

    except Exception as e:
        logging.error(f"Error fetching autocomplete suggestions: {e}")
        return jsonify({'error': f'Error fetching suggestions: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)
