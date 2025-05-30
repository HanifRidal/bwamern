import React, { useState } from "react";
import UserManagement from "../parts/UserManage";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("user");

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Dashboard</h2>
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
            {/* <VacationManagement /> */}
          </>
        )}
      </div>
    </div>
  );
}
