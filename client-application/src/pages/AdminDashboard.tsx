import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome Admin! Please choose an option:</p>
      <ul>
        <li>
          <button onClick={() => navigate("/admin/server-status")}>
            View Server Statuses
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/admin/server-details")}>
            View Server Details
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/admin/update-server")}>
            Update/Edit Server
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/admin/add-category")}>
            Add Category
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
