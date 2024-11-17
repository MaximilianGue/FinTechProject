const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());  // for parsing application/json

app.get('/', (req, res) => {
  res.send('Portfolio Tracker API');
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
