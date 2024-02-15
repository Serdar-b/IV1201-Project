import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPresenter from './presenter/LoginPresenter';
import ApplicationPresenter from './presenter/ApplicationPresenter';
import Dashboard from './view/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPresenter />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/apply" element={<ProtectedRoute><ApplicationPresenter /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}
 export default App;
