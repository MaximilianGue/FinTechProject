// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Create this file for styling

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MarketCircle</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/explore">Explore</Link>
        </li>
        <li>
          <Link to="/friends">Friends</Link>
        </li>
        <li> {/* has to change based on if loged in */}
          <Link to="/profile">Profile</Link> 
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
