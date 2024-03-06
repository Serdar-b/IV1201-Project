import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./components/i18n.js";

/**
 * The entry point for the React application. It renders the `App` component inside the root div of `index.html`.
 * Additionally, it imports global CSS and i18n configurations for internationalization support.
 * The `reportWebVitals` function is available to measure and log the performance of the app, which can be utilized for optimization.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

reportWebVitals();
