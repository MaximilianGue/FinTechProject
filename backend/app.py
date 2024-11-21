import yfinance as yf
from flask import Flask, jsonify, request
import logging
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

logging.basicConfig(level=logging.DEBUG)

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

if __name__ == '__main__':
    app.run(debug=True)
