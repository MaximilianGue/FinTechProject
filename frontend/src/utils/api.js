// api.js

const BASE_URL = 'http://127.0.0.1:5000';  // The backend Flask API URL

// Fetch stock data from the Flask API
export const fetchStockData = async (searchTerm) => {
  try {
    const response = await fetch(`${BASE_URL}/stock?search_term=${searchTerm}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);  // Propagate the error to be handled in the component
    }

    return data;  // Return the fetched data

  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error('An error occurred while fetching the stock data.');
  }
};
