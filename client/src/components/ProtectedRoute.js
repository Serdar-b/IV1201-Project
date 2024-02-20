import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';


/**
 * A protected route component that ensures a user is authenticated before rendering children components.
 * @param {React.ReactNode} props.children - The children elements to be rendered if the user is authenticated.
 * @returns {React.ReactElement} The protected route component.
 */

const ProtectedRoute = ({ children }) => {
  // State to hold the current user data, initialized from local storage
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

  // Effect hook to update currentUser state if the user data in local storage changes
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(userData);
  }, []);

  // Redirect to login page if no currentUser is found
  if (!currentUser) {
    console.log('No user found, redirecting to login...');
    return <Navigate to="/login" replace />;
  }

  // If there's a user, render the "children" components
  console.log('User found:', currentUser.name);
  return children;
};

export default ProtectedRoute;
