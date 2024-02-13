import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPresenter from './presenter/LoginPresenter';
import Dashboard from './view/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPresenter />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}
 export default App;
