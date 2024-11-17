// New (React Router v6+)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'; // Import styles if available

import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore'
import Friends from './pages/Friends';

import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import Navbar from './components/Navbar'; // Make sure Navbar exists and is properly imported


function App() {
  return (
    <Router>
      <Navbar /> {/* Renders the navigation bar at the top */}
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Home route */}
        <Route path="/explore" element={<Explore />} /> {/* Explore route */}
        <Route path="/friends" element={<Friends />} /> {/* Explore route */}

        <Route path="/login" element={<Login />} /> {/* Login route */}
        <Route path="/signup" element={<SignUp />} /> {/* Signup route */}
        <Route path="/profile" element={<Profile />} /> {/* Profile route */}

      </Routes>
    </Router>
  );
}

export default App; // This is the default export for the App component