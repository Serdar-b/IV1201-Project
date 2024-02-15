require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("./controller/authController");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));

app.post("/login", authController.login);
app.post("/register", authController.register);

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});
