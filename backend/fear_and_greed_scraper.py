from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup
import logging

# Initialize Flask
app = Flask(__name__)

# Logging setup
logging.basicConfig(level=logging.DEBUG)

# Web scraping function
def get_fear_and_greed():
    try:
        url = 'https://feargreedmeter.com/'
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        index_value = soup.find('div', class_='text-center text-4xl font-semibold mb-1 text-white')

        if index_value:
            return index_value.text.strip()
        else:
            return None
    except Exception as e:
        logging.error(f"Error fetching Fear & Greed: {e}")
        return None

# Route to fetch Fear & Greed index
@app.route('/api/fear-and-greed', methods=['GET'])
def get_fear_and_greed_data():
    fear_and_greed = get_fear_and_greed()  # Fetch data from the scraping function

    if fear_and_greed:
        return jsonify({'fear_and_greed': fear_and_greed})
    else:
        return jsonify({'error': 'Unable to fetch Fear & Greed index'}), 500


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
# Call the function and print the result
fear_and_greed_index = get_fear_and_greed()
if fear_and_greed_index:
    print(f"Fear & Greed Index: {fear_and_greed_index}")
else:
    print("Could not fetch Fear & Greed Index.")
