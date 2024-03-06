require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("./controller/authController");
const applicationController = require("./controller/applicationController");
const authenticateToken = require('./middlewareProtection'); 
const app = express();
const cors = require("cors");

const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

/**
 * Initializes the i18next middleware with a filesystem backend and a language detector.
 */
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: '../client/src/locales/translation{{lng}}.json',
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie'],
    },
  });

app.use(express.json());
app.use(cookieParser());
app.use(middleware.handle(i18next));

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/**
 * Defines routes for login, registration, and application handling with authentication.
 */
app.post("/login", authController.login);
app.post("/register", authController.register);
app.post("/apply",authenticateToken, applicationController.submitApplication);
app.get("/apply",authenticateToken, applicationController.handleCompetences);
app.get("/applications",authenticateToken, applicationController.listAllApplications);
app.post("/applications",authenticateToken, applicationController.setApplicationStatus);

const port = process.env.PORT || 5001;

/**
 * Starts the server on the specified port.
 */
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { server };
