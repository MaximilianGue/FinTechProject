import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './Explore.css';

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
  const [searchTerm, setSearchTerm] = useState(''); // Default symbol (e.g., Apple)
  const [timeframe, setTimeframe] = useState('1d'); // Default timeframe is '1d'
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false); // State for the "Add Stock" button visibility

  // Fetch stock data from the backend
  const handleSearch = async (currentTimeframe) => {
    const activeTimeframe = currentTimeframe || timeframe; // Use passed timeframe or the current one
    if (searchTerm.trim() === '') return; // Do nothing if search term is empty
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/stock?search_term=${searchTerm}&period=${activeTimeframe}`);
      setStockData(response.data);
      setError('');
      setShowAddButton(true); // Show the "Add Stock" button once data is fetched
    } catch (err) {
      console.error(err);
      setError('Error fetching data');
      setStockData(null);
      setShowAddButton(false); // Hide the button if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle timeframe change and trigger search
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe); // Update the timeframe immediately
    handleSearch(newTimeframe); // Trigger search immediately with the new timeframe
  };

  // Handle Enter key press to show 1y chart
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setTimeframe('1y'); // Set the timeframe to '1y'
      handleSearch('1y'); // Trigger search for the 1-year chart
    }
  };

  const chartData =
    stockData &&
    stockData.dates &&
    stockData.dates.length > 0 &&
    stockData.prices &&
    stockData.prices.length > 0 && {
      labels: stockData.dates, // Array of dates/timestamps
      datasets: [
        {
          label: `${stockData.symbol} Stock Price`,
          data: stockData.prices, // Array of prices
          fill: true, // If you want the area under the line to be filled
          backgroundColor: 'rgba(88, 129, 87, 0.2)', // Light green fill
          borderColor: '#588157', // Medium green line color
          borderWidth: 2, // Line thickness
          tension: 0.1,
          pointRadius: 0, // Set the point radius to 0 to remove the circles
          pointHoverRadius: 0, // Ensure no circle on hover as well
        },
      ],
    };

  // Handle the "Add Stock" button click
  const handleAddStock = () => {
    console.log(`Adding stock: ${searchTerm}`);
    // Implement action here when adding the stock (e.g., save to a list)
  };

  return (
    <div className="container">
      <h1 className="heading">Stock Search</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by company name or ticker symbol"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} // Listen for Enter key
        />
      </div>

      {isLoading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {stockData && (
        <div className="content">
          {/* Chart Container */}
          <div className="chart-container">
            {chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      grid: {
                        display: false, // Hide grid lines on the x-axis
                      },
                      ticks: {
                        display: false, // Hide labels on the x-axis
                      },
                    },
                    y: {
                      grid: {
                        display: true, // Show grid lines on the y-axis
                      },
                      ticks: {
                        display: true, // Show labels on the y-axis
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true, // Keep the legend visible
                    },
                    tooltip: {
                      enabled: true, // Enable tooltips for interactivity
                    },
                  },
                }}
              />
            ) : (
              <p>No data available for chart</p>
            )}
            {/* Timeframe Buttons Inside Chart Container */}
            <div className="button-container">
              <button className="timeframe-button" onClick={() => handleTimeframeChange('1d')}>
                1 Day
              </button>
              <button className="timeframe-button" onClick={() => handleTimeframeChange('1wk')}>
                1 Week
              </button>
              <button className="timeframe-button" onClick={() => handleTimeframeChange('1mo')}>
                1 Month
              </button>
              <button className="timeframe-button" onClick={() => handleTimeframeChange('1y')}>
                1 Year
              </button>
            </div>
          </div>

          {/* Market Data */}
          <div className="market-data">
            <h2>{stockData.symbol}</h2>
            <p className="price">
              Price: ${stockData.prices ? stockData.prices[stockData.prices.length - 1] : 'N/A'}
            </p>
            <p>
              Volume:{' '}
              {stockData.volume && stockData.volume.length
                ? stockData.volume[stockData.volume.length - 1]
                : 'N/A'}
            </p>

            <h3>Market Data</h3>
            <div className="data-row">
              <span>Open:</span>
              <span>${stockData.market_data.open || 'N/A'}</span>
            </div>
            <div className="data-row">
              <span>High:</span>
              <span>${stockData.market_data.high || 'N/A'}</span>
            </div>
            <div className="data-row">
              <span>Low:</span>
              <span>${stockData.market_data.low || 'N/A'}</span>
            </div>
            <div className="data-row">
              <span>Previous Close:</span>
              <span>${stockData.market_data.previous_close || 'N/A'}</span>
            </div>
            <div className="data-row">
              <span>Market Cap:</span>
              <span>${stockData.market_data.market_cap || 'N/A'}</span>
            </div>
            <div className="data-row">
              <span>P/E Ratio:</span>
              <span>{stockData.market_data.pe_ratio || 'N/A'}</span>
            </div>
            <div className="data-row">
              <span>Dividend Yield:</span>
              <span>
                {stockData.market_data.dividend_yield
                  ? stockData.market_data.dividend_yield * 100
                  : 'N/A'}
                %
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Button */}
      {showAddButton && (
        <div className="add-stock-container">
          <button className="add-stock-button" onClick={handleAddStock}>
            Add Stock
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
