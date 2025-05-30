import Button from "elements/Button";
import React, { useState } from "react";
// import { withRouter } from "react-router-dom";

export default function LoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError("Username and password are required.");
      return;
    }
    if (username === "admin" && password === "admin") {
      setError("");
      props.history.push("/admin");
    } else {
      setError("Invalid username or password.");
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
