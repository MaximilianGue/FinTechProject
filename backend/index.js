const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();

// Initialize app
const app = express();
app.use(express.json());  // For parsing application/json
app.use(cors());  // Enable CORS

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Authentication middleware to check JWT token
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Portfolio Routes (Protected)
app.get('/api/portfolio', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM portfolios WHERE user_id = $1', [req.user.userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching portfolio', error: err.message });
  }
});

app.post('/api/portfolio', authenticate, async (req, res) => {
  const { symbol, amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO portfolios (user_id, symbol, amount) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, symbol, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error adding portfolio item', error: err.message });
  }
});

app.delete('/api/portfolio/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM portfolios WHERE id = $1 AND user_id = $2', [id, req.user.userId]);
    res.status(200).json({ message: 'Portfolio item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting portfolio item', error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
