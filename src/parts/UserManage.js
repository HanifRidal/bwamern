import React, { useState } from "react";

export default function UserManage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Admin", email: "admin@example.com" },
    { id: 2, name: "User", email: "user@example.com" },
  ]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setUsers([
      ...users,
      { id: Date.now(), name: form.name, email: form.email },
    ]);
    setForm({ name: "", email: "" });
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setUsers(
      users.map((user) => (user.id === editingId ? { ...user, ...form } : user))
    );
    setEditingId(null);
    setForm({ name: "", email: "" });
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div>
      <form onSubmit={editingId ? handleUpdate : handleAdd} className="mb-4">
        <div className="row g-2">
          <div className="col">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", email: "" });
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
            <th>Name</th>
            <th>Email</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user, idx) => (
              <tr key={user.id}>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
