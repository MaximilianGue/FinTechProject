// New (React Router v6+)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'; // Import styles if available

import Home from './pages/Home';       // Correct the path if components are in a different directory
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar'; // Make sure Navbar exists and is properly imported

function App() {
  return (
    <Router>
      <Navbar /> {/* Renders the navigation bar at the top */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route */}
        <Route path="/login" element={<Login />} /> {/* Login route */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
      </Routes>
    </Router>
  );
}

export default App; // This is the default export for the App component
