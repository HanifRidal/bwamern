import React, { useState, useEffect, useContext } from "react";
import api from "../Config/axiosconfig"; // Adjust this path to your axios config
import AuthContext from '../context/AuthContext';

export default function UserManage() {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
    console.log("Current user:", auth.user);
    console.log("Is admin?", auth.user?.role_user === "admin");
    
  }, [auth]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/list");
      setUsers(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
        if (err.response) {
        console.error("Response error:", err.response.data);
        setError(`Failed: ${err.response.data.message || err.response.statusText}`);
      } else {
        setError("Failed to load users. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError("Username, email and password are required");
      return;
    }

    try {
      await api.post("/user/register", {
        username: form.username,
        email: form.email,
        password: form.password
      });

      // Refresh user list
      fetchUsers();
      
      // Reset form
      setForm({ username: "", email: "", password: "" });
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Username already exists");
      } else {
        setError("Failed to add user");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ 
      username: user.username, 
      email: user.email,
      password: "" // Don't set password when editing
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email) {
      setError("Username and email are required");
      return;
    }

    try {
      await api.put(`/user/edit`, {
        id: editingId,
        username: form.username,
        email: form.email
      });

      // Refresh user list
      fetchUsers();
      
      // Reset form and editing state
      setEditingId(null);
      setForm({ username: "", email: "", password: "" });
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Username already exists");
      } else {
        setError("Failed to update user");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/user/${id}`);
        
        // Update local state
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}
      
      <form onSubmit={editingId ? handleUpdate : handleAdd} className="mb-4">
        <div className="row g-3">
          <div className="col-md">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="col-md">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          {!editingId && (
            <div className="col-md">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password (for new users)"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update User" : "Add User"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingId(null);
                  setForm({ username: "", email: "", password: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
      
      <table className="table table-bordered">
        <thead>
          <tr>
            <th style={{ width: 40 }}>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user, idx) => (
              <tr key={user.id}>
                <td>{idx + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role_user}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role_user === "admin"} // Prevent deleting admin users
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}