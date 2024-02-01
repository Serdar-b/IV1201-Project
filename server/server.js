
const express = require('express');
const authController = require('./controller/authController');
const app = express();

app.use(express.json()); // For parsing application/json

app.post('/api/login', authController.login);

app.listen(5001, () => {
  console.log('Server running on port 5001');
});
