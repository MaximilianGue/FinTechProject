import yfinance as yf
from flask import Flask, jsonify, request
import logging
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/stock', methods=['GET'])
def get_stock_data():
    search_term = request.args.get('search_term')
    period = request.args.get('period', '1d')  # Default to 1d if no period is provided

    if not search_term:
        return jsonify({'error': 'No search term provided'}), 400

    try:
        # Try to get stock data for the symbol
        stock = yf.Ticker(search_term)
        data = stock.history(period=period)
        
        logging.debug(f"Stock data fetched: {data}")  # Log the fetched data

        if data.empty:
            return jsonify({'error': f'No data found for {search_term}. The symbol may be delisted or incorrect.'}), 404

        # Extract relevant stock data for the chart
        stock_data = {
            'symbol': search_term,
            'dates': data.index.map(str).to_list(),  # Convert datetime index to string for chart
            'prices': data['Close'].tolist(),  # Closing prices for the chart
            'volume': data['Volume'].tolist()  # Volume data
        }

        return jsonify(stock_data)

    except Exception as e:
        logging.error(f"Error fetching stock data for {search_term}: {e}")
        return jsonify({'error': f'Error fetching stock data: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
