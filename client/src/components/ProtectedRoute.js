  import React, { useState, useEffect } from 'react';
  import { Navigate } from 'react-router-dom';


/**
 * `ProtectedRoute` is a higher-order component that wraps around other components to create protected routes. 
 * It ensures that only authenticated users, and optionally users with specific roles, can access certain parts of the application.
 * If a user is not authenticated, they are redirected to the login page. 
 * If a user does not have the required role, they are redirected to a "not authorized" page.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if the user is authenticated and authorized.
 * @param {Array.<string>} [props.allowedRoles] - An optional array of roles that are allowed to access the route.
 * @returns {React.ReactElement} A React element that either renders the child components (if the user is authenticated and authorized), 
 * or redirects to the login or "not authorized" page.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  // Redirect to login page if no currentUser is found
  if (!currentUser) {
    console.log('No user found, redirecting to login...');
    return <Navigate to="/login" replace />;
  }

  // Check if the currentUser's role is allowed to access this route
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to a "not authorized"
    console.log('User role not authorized for this route');
    return <Navigate to="/not-authorized" replace />;
  }

  // If authorized, clone the children and pass the currentUser as a prop
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { user: currentUser });
    }
    return child;
  });

  console.log('User found:', currentUser.name);
  return <>{childrenWithProps}</>;
};

export default ProtectedRoute;
