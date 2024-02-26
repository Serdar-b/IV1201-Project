require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("./controller/authController");
const applicationController = require("./controller/applicationController");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.post("/login", authController.login);
app.post("/register", authController.register);
app.post("/apply", applicationController.submitApplication);
app.get("/apply", applicationController.handleCompetences);
app.get("/applications", applicationController.listAllApplications);
app.post("/applications", applicationController.setApplicationStatus);

const port = process.env.PORT || 5001;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { server };
