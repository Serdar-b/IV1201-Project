require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authController = require("./controller/authController");
const app = express();

app.use(express.json());
app.use(cookieParser());

//here we use our session to generate
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    cookie: { secure: true }, 
  })
);
//here is our router that  routes to controller
app.post("/api/login", authController.login);

const port = process.env.PORT;
const host = process.env.HOST;
//here we listen on which host on post request comes from frontend
app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
});
