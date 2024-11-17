import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; // Ensure you have chart.js installed for the chart component
import Chart from 'chart.js/auto';

const StockChart = ({ searchTerm }) => {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');

  // Fetch stock data from the Flask API
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/stock?search_term=${searchTerm}`);
        const data = await response.json();

        console.log(data); // Log the fetched data for debugging

        if (data.error) {
          setError(data.error); // Set the error state to display a message to the user
          return;
        }

        if (!data.price || !data.symbol) {
          setError("No stock data found for this symbol.");
          return;
        }

        // Set the stock data for rendering the chart
        setStockData({
          labels: ['1 Day'],  // Just one data point (today)
          datasets: [
            {
              label: `${data.symbol} Stock Price`,
              data: [data.price],
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('An error occurred while fetching the stock data.');
      }
    };

    if (searchTerm) {
      setError(''); // Clear previous errors when a new search term is entered
      fetchStockData();
    }
  }, [searchTerm]);

  // Return error message or loading message if no data is available yet
  if (error) {
    return <div>{error}</div>;
  }

  if (!stockData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{`Stock Chart for ${searchTerm}`}</h2>
      <Line data={stockData} />
    </div>
  );
};

export default StockChart;
