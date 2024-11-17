import React, { useState } from 'react';
import axios from 'axios';

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
      setError('Error fetching data');
      setStockData(null);
    }
  };

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

      {error && <p>{error}</p>}

      {stockData && (
        <div>
          <h2>{stockData.name}</h2>
          <p>Price: {stockData.price}</p>
          <p>Market Cap: {stockData.market_cap}</p>
          <p>Volume: {stockData.volume}</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
