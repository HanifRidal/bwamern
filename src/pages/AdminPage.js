import React, { useState } from "react";
import UserManagement from "../parts/UserManage";
import VacationManagement from "../parts/VacationManage";
import Logout from "elements/Logout";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("user");
  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-4">Admin Dashboard</h2>
        <Logout onLogout={handleLogout} />
      </div>
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link${activeTab === "user" ? " active" : ""}`}
              onClick={() => setActiveTab("user")}
              style={{ cursor: "pointer" }}
            >
              User Management
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link${activeTab === "vacation" ? " active" : ""}`}
              onClick={() => setActiveTab("vacation")}
              style={{ cursor: "pointer" }}
            >
              Vacation Management
            </button>
          </li>
        </ul>
      </div>

      <div className="card p-4">
        {activeTab === "user" && (
          <>
            <h4>User Management</h4>
            <UserManagement />
          </>
        )}
        {activeTab === "vacation" && (
          <>
            <h4>Vacation Management</h4>
            <VacationManagement />
          </>
        )}
      </div>
    </div>
  );
}
