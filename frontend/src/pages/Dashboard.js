import React from 'react';
import './Dashboard.css';
import { Line } from 'react-chartjs-2'; // Import Line chart from react-chartjs-2
import { Pie } from 'react-chartjs-2'; // Import Pie chart from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  // Example stock data
  const stocks = [
    { name: 'Apple', shares: 50, price: 175, totalValue: 8750 },
    { name: 'Tesla', shares: 30, price: 250, totalValue: 7500 },
    { name: 'Amazon', shares: 10, price: 3000, totalValue: 30000 },
    { name: 'Google', shares: 20, price: 2800, totalValue: 56000 },
  ];

  // Example performance chart data
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [10000, 12000, 13000, 15000, 16000, 17000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Example portfolio allocation data
  const allocationData = {
    labels: ['Apple', 'Tesla', 'Amazon', 'Google'],
    datasets: [
      {
        label: 'Portfolio Allocation',
        data: [20, 10, 30, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="personal-info-container">
        <h2>Personal Information</h2>
        <div className="dashboard-content-top">
          {/* Performance chart */}
          <div className="chart-container">
            <h3>Performance Chart</h3>
            <div className="line-chart">
              <Line data={performanceData} />
            </div>
          </div>

          {/* Stock List */}
          <div className="table-container">
            <h3 className="stock-list-title">Your Stocks</h3>
            <table>
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Shares</th>
                  <th>Price</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock, index) => (
                  <tr key={index}>
                    <td>{stock.name}</td>
                    <td>{stock.shares}</td>
                    <td>${stock.price}</td>
                    <td>${stock.totalValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Allocation Chart */}
        <div className="dashboard-content-bottom">
          <div className="chart-container">
            <h3>Portfolio Allocation</h3>
            <div className="pie-chart">
              <Pie data={allocationData} />
            </div>
          </div>
        </div>
      </div>

      {/* General Information Section */}
      <div className="general-info-container">
        <h2>General Information</h2>
        <div className="general-info-content">
          {/* Left: Index or Placeholder */}
          <div className="info-box">
            <h3>Fear & Greed Index</h3>
            <p>Placeholder for Fear & Greed Index.</p>
          </div>

          {/* Right: News Section */}
          <div className="info-box">
            <h3>Latest News</h3>
            <ul>
              <li>
                <strong>Market Update:</strong> Stocks rally as tech continues to lead gains.
              </li>
              <li>
                <strong>Economic News:</strong> Federal Reserve announces new interest rate policy.
              </li>
              <li>
                <strong>Crypto Trends:</strong> Bitcoin surges past $60,000 amid renewed interest.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
