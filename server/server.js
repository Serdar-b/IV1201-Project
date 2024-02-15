require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("./controller/authController");
const applicationController = require('./controller/applicationController');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.post("/login", authController.login);
app.post("/apply", applicationController.submitApplication);

const port = process.env.PORT;
const host = process.env.HOST;

const server = app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});

module.exports = { server };