import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// RoleRoute component that checks both authentication and role
const RoleRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { auth } = useContext(AuthContext);
  
  return (
    <Route
      {...rest}
      render={(props) => {
        // Check if user is logged in
        if (!auth.isLoggedIn) {
          return <Redirect to="/login" />;
        }
        
        // Check if user has the required role
        if (allowedRoles.includes(auth.user.role)) {
          return <Component {...props} />;
        } else {
          // Redirect to appropriate dashboard based on role
          if (auth.user.role === 'admin') {
            return <Redirect to="/admin" />;
          } else {
            return <Redirect to="/dashboard" />;
          }
        }
      }}
    />
  );
};

export default RoleRoute;