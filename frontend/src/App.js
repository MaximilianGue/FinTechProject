// Old (React Router v5)
// import { Switch, Route } from 'react-router-dom';

// New (React Router v6+)
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css'; // if you have any styles

import Home from './pages/Home';  // Correct the path if components are in a different directory
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<Dashboard />} />
  {/* Add more routes as needed */}
</Routes>



function App() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      {/* Add other components here */}
    </div>
  );
}

export default App;  // This is the default export