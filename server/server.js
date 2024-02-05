require('dotenv').config(); 

const express = require('express');
const authController = require('./controller/authController');
const app = express();
//This line tells Express to use its built-in middleware to automatically parse JSON content from incoming requests.

app.use(express.json()); 

app.post('/api/login', authController.login);

const port = process.env.PORT; 
const host = process.env.HOST;

app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});
