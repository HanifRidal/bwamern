// src/components/Logout.js
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom'; // Change this line
import api from '../Config/axiosconfig';
import AuthContext from '../context/AuthContext';

const Logout = () => {
  const { setAuth } = useContext(AuthContext);
  const history = useHistory(); // Change this line

  const handleLogout = async () => {
    try {
      await api.post('/user/logout');
      setAuth({ isLoggedIn: false, user: null });
      window.location.href = "/login" // Change this line
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button className="btn btn-light border" onClick={handleLogout}>Logout</button>
  );
};

export default Logout;