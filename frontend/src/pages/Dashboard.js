import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import './Dashboard.css';


// Register chart elements
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement);

function Dashboard() {
  // Sample Portfolio Data (you can replace this with dynamic data)
  const portfolioData = {
    AAPL: { shares: 50, price: 150 },  // Apple stock
    GOOGL: { shares: 30, price: 2800 }, // Google stock
    AMZN: { shares: 10, price: 3400 },  // Amazon stock
    MSFT: { shares: 20, price: 299 },   // Microsoft stock
  };

  // Calculate the portfolio allocation data
  const totalValue = Object.values(portfolioData).reduce(
    (acc, stock) => acc + stock.shares * stock.price,
    0
  );

  const allocation = Object.keys(portfolioData).map((stock) => ({
    label: stock,
    value: (portfolioData[stock].shares * portfolioData[stock].price / totalValue) * 100,
  }));

  // Chart.js data for Pie chart
  const pieData = {
    labels: allocation.map((item) => item.label),
    datasets: [
      {
        data: allocation.map((item) => item.value),
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'], // Custom colors for each segment
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  // Sample Portfolio Performance Data (e.g., over 5 days)
  const performanceData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    datasets: [
      {
        label: 'Portfolio Value ($)',
        data: [100, 105, 110, 115, 120], // Example data showing portfolio growth
        fill: false,
        borderColor: '#4caf50',
        tension: 0.1,
      },
    ],
  };

  // Table Data for Stock List
  const stockListData = Object.keys(portfolioData).map((stock) => {
    const { shares, price } = portfolioData[stock];
    return {
      symbol: stock,
      sharesOwned: shares,
      price,
      totalValue: shares * price,
    };
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Portfolio Dashboard</h1>

      {/* Portfolio Allocation (Pie Chart) */}
      <div style={{ width: '40%', marginBottom: '30px' }}>
        <h3>Portfolio Allocation</h3>
        <Pie data={pieData} />
      </div>

      {/* Portfolio Performance (Line Chart) */}
      <div style={{ width: '60%', marginBottom: '30px' }}>
        <h3>Portfolio Performance Over Time</h3>
        <Line data={performanceData} />
      </div>

      {/* List of Stocks in Portfolio */}
      <div>
        <h3>List of Stocks in Portfolio</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Stock Symbol</th>
              <th>Shares Owned</th>
              <th>Price ($)</th>
              <th>Total Value ($)</th>
            </tr>
          </thead>
          <tbody>
            {stockListData.map((stock, index) => (
              <tr key={index}>
                <td>{stock.symbol}</td>
                <td>{stock.sharesOwned}</td>
                <td>{stock.price}</td>
                <td>{stock.totalValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
