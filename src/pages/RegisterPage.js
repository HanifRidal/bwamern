import React, { useState } from "react";
import Button from "elements/Button";
import axios from "axios"; // Make sure axios is imported
import { useHistory } from "react-router-dom";

export default function RegisterPage(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    // Form validation
    if (!username || !email || !password || !confirm) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }
    
    if (password !== confirm) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Make API call to register endpoint
      const response = await axios.post('http://localhost:3001/api/user/register', {
        username,
        email,
        password
      });
      
      // Handle successful registration
      setSuccess("Registration successful! You can now login.");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirm("");
      
      // Optionally redirect to login page after a delay
      setTimeout(() => {
        history.push('/login');
      }, 2000);
      
    } catch (error) {
      // Handle registration errors
      if (error.response) {
        // The request was made and the server responded with an error status code
        if (error.response.status === 409) {
          setError("Username already exists. Please choose another.");
        } else {
          setError(error.response.data.message || "Registration failed. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
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
        <h2 className="mb-4 text-center">Sign Up</h2>
        <h4 className="mb-4 text-center">Create your account here !</h4>
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
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          {success && <div className="alert alert-success mb-3">{success}</div>}
          <div className="mb-3 text-gray-500 text-center">
            <Button className="" type="link" href="/login">
              Have account?
            </Button>
          </div>
          <div className="d-flex justify-content-center">
            <Button className="btn px-5" hasShadow isPrimary>
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
