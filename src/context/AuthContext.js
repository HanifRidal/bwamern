// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../Config/axiosconfig'; // Adjust the import path as necessary

const AuthContext = createContext({
    auth: { isLoggedIn: false, user: null },
  setAuth: () => {},  // Default empty function
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: false, user: null });
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Call an endpoint that requires authentication
        const response = await api.get('/user/me');
        setAuth({
          isLoggedIn: true,
          user: response.data.data
        });
      } catch (error) {
        setAuth({
          isLoggedIn: false,
          user: null
        });
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
    
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;