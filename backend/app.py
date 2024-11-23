import yfinance as yf
from flask import Flask, jsonify, request
import logging
from flask_cors import CORS
import json  # For loading the JSON file

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Load the company-to-ticker mapping from the JSON file
try:
    with open('company_to_ticker.json', 'r') as file:
        company_to_ticker = json.load(file)
except FileNotFoundError:
    logging.error("The file 'company_to_ticker.json' was not found.")
    company_to_ticker = {}

@app.route('/stock', methods=['GET'])
def get_stock_data():
    search_term = request.args.get('search_term')
    period = request.args.get('period', '1d')  # Default to 1 day

    if not search_term:
        return jsonify({'error': 'No search term provided'}), 400

    try:
        # Normalize the search term for case-insensitive matching
        search_term_lower = search_term.lower()

        # Determine if the search term is a ticker symbol or company name
        ticker = None
        if search_term_upper := search_term.upper():  # Check if it's a ticker symbol
            ticker = search_term_upper if search_term_upper in company_to_ticker.values() else None
        
        if not ticker:  # Check if it's a company name
            ticker = company_to_ticker.get(search_term_lower)

        if not ticker:
            return jsonify({'error': f"Could not resolve {search_term} to a valid ticker symbol or company name."}), 404

        # Fetch stock data using yfinance
        stock = yf.Ticker(ticker)

        # Adjust interval based on period
        if period == '1d':
            interval = '1m'  # 1 minute interval for 1 day
        elif period == '1wk':
            period = "5d"
            interval = '15m'  # Hourly data for the past 7 days
        elif period == '1mo':
            interval = '1h'  # 1 hour interval for 1 month
        elif period == '1y':
            interval = '1d'  # Daily interval for 1 year
        else:
            interval = '1d'  # Default to 1 day if no valid period

        # Fetch stock data for the specified period and interval
        logging.debug(f"Fetching data for {ticker} with period={period} and interval={interval}")
        data = stock.history(period=period, interval=interval)

        if data.empty:
            logging.error(f"No data returned for {ticker} with period {period} and interval {interval}")
            return jsonify({'error': f'No data found for {ticker}. The symbol may be delisted or incorrect.'}), 404

        # Handle '1wk' period by fetching 7 days worth of hourly data (168 data points)
        if period == '1wk' and interval == '1h':
            logging.debug("Fetching 7 days of hourly data for the 1wk period")
            data = data.tail(7 * 24)  # 7 days of hourly data points (168 data points)

        # Prepare stock data for the chart
        if period in ['1d', '7d', '1wk']:  # Handle 7d and 1wk as well
            labels = data.index.strftime('%Y-%m-%d %H:%M:%S').tolist()  # Include time for 1 day / 7 days / 1 week
        else:
            labels = data.index.strftime('%Y-%m-%d').tolist()  # Only dates for month/year

        # Get market data (adjusted based on timeframe)
        market_data = {
            'open': round(data['Open'][0], 3) if not data['Open'].empty else None,  # First open price for the timeframe
            'high': round(data['High'].max(), 3) if not data['High'].empty else None,
            'low': round(data['Low'].min(), 3) if not data['Low'].empty else None,
            'previous_close': round(data['Close'][-2], 3) if len(data) > 1 else None,  # Close from the previous day
            'market_cap': stock.info.get('marketCap', None),
            'pe_ratio': stock.info.get('trailingPE', None),
            'dividend_yield': stock.info.get('dividendYield', None)
        }

        stock_data = {
            'symbol': ticker,
            'prices': [round(price, 3) for price in data['Close'].tolist()],  # Round the close prices
            'dates': labels,  # Use the formatted labels
            'volume': data['Volume'].tolist(),
            'market_data': market_data
        }

        logging.debug(f"Stock data: {stock_data}")  # Debugging log

        return jsonify(stock_data)

    except Exception as e:
        logging.error(f"Error fetching stock data for {search_term}: {e}")
        return jsonify({'error': f'Error fetching stock data: {str(e)}'}), 500

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
