import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(userData);
  }, []);

  if (!currentUser) {
    // If there's no user, redirect to login page
    console.log('No user found, redirecting to login...');
    return <Navigate to="/login" replace />;
  }

  console.log('User found:', currentUser.name);
  return children; // If there's a user, render the "children" components
};

export default ProtectedRoute;
