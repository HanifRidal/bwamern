import React, { useState, useContext } from 'react';
import axios from 'axios';
import Button from "elements/Button";
import AuthContext from '../context/AuthContext';
import { useHistory } from "react-router-dom";

export default function LoginPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuth } = useContext(AuthContext);
  const history = useHistory(); // Initialize useHistory hook
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/user/login', 
        { username, password },
        { withCredentials: true }
      );
      
      // Extract user data and role from response
      const userData = response.data.data;
      const userRole = userData.role;
      
      // Update auth context with user info
      setAuth({
        isLoggedIn: true,
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userRole
        }
      });
      
      // Redirect based on user role
      if (userRole === 'admin') {
        window.location.href = '/admin'; // Redirect to admin page
      } else {
        // Default to dashboard for regular users (konsumen)
        window.location.href = '/'; // Redirect to user dashboard
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      className=""
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
      }}
    >
      <div
        className="card bordered border border-black d-flex align-items-center"
        style={{
          padding: `60px 80px`,
          border: "1px solid black",
          borderRadius: "10px",
          minWidth: 350,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          background: "#fff",
        }}
      >
        <h2 className="mb-4 text-center">SiliwangiTravel</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          <div className="mb-3 text-center text-gray-500">
            Doesn't have account?
            <Button className="" type="link" href="/register">
              SignUp Here
            </Button>
          </div>
          <div className="d-flex justify-content-center">
            <Button className="btn px-5" hasShadow isPrimary>
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
