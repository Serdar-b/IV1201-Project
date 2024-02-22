  import React, { useState, useEffect } from 'react';
  import { Navigate } from 'react-router-dom';


  /**
   * A protected route component that ensures a user is authenticated before rendering children components.
   * @param {React.ReactNode} props.children - The children elements to be rendered if the user is authenticated.
   * @returns {React.ReactElement} The protected route component.
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
