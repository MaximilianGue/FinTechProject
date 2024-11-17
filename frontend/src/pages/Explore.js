import React, { useState } from 'react';
import axios from 'axios';
<<<<<<< HEAD

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/stock?search_term=${searchTerm}`);
      setStockData(response.data);
      setError('');
    } catch (err) {
=======
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState('1d'); // Default timeframe is '1d'
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/stock?search_term=${searchTerm}&period=${timeframe}`);
      console.log("Response data:", response.data); // Debugging: log the response data
      setStockData(response.data);
      setError('');
    } catch (err) {
      console.error(err); // Debugging: log the error
>>>>>>> max
      setError('Error fetching data');
      setStockData(null);
    }
  };

<<<<<<< HEAD
=======
  // Prepare chart data
  const chartData = stockData && stockData.dates && stockData.dates.length > 0 && stockData.prices && stockData.prices.length > 0 && {
    labels: stockData.dates.map(date => new Date(date).toLocaleDateString()), // Format date for x-axis
    datasets: [
      {
        label: `${stockData.symbol} Stock Price`,
        data: stockData.prices, // Array of prices
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };

>>>>>>> max
  return (
    <div>
      <h1>Stock Search</h1>
      <input
        type="text"
        placeholder="Search by company name or ticker symbol"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

<<<<<<< HEAD
      {error && <p>{error}</p>}

      {stockData && (
        <div>
          <h2>{stockData.name}</h2>
          <p>Price: {stockData.price}</p>
          <p>Market Cap: {stockData.market_cap}</p>
          <p>Volume: {stockData.volume}</p>
=======
      {/* Timeframe Buttons */}
      <div>
        <button onClick={() => handleTimeframeChange('1d')}>1 Day</button>
        <button onClick={() => handleTimeframeChange('1wk')}>1 Week</button>
        <button onClick={() => handleTimeframeChange('1mo')}>1 Month</button>
        <button onClick={() => handleTimeframeChange('1y')}>1 Year</button>
      </div>

      {error && <p>{error}</p>}
      {!stockData && !error && <p>Loading data...</p>} {/* Loading message */}
      
      {stockData && (
        <div>
          <h2>{stockData.symbol}</h2>
          <p>Price: ${stockData.prices ? stockData.prices[stockData.prices.length - 1] : "N/A"}</p>
          <p>Volume: {stockData.volume && stockData.volume.length ? stockData.volume[stockData.volume.length - 1] : "N/A"}</p>
          
          {/* Render the Line Chart */}
          {chartData && chartData.labels && chartData.labels.length > 0 && chartData.datasets && chartData.datasets.length > 0 ? (
            <Line data={chartData} />
          ) : (
            <p>No data available for chart</p>
          )}
>>>>>>> max
        </div>
      )}
    </div>
  );
};

export default Explore;
