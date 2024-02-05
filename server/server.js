require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authController = require("./controller/authController");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: { secure: true }, // Use secure cookies (only transmitted over HTTPS)
  })
);

app.post("/api/login", authController.login);

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});
