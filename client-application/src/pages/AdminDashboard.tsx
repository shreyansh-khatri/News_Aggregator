import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h2>
      <p className="mb-4 text-gray-700">
        Welcome Admin! Please choose an option:
      </p>

      <ul className="space-y-3">
        <li>
          <button
            onClick={() => navigate("/admin/server-status")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Server Statuses
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/admin/server-details")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Server Details
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/admin/update-server")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Update/Edit Server
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/admin/add-category")}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Category
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/admin/reported-articles")}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Manage Reported Articles
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/admin/manage-categories")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Hide/Unhide News Categories
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/admin/keyword-filters")}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Block/Unblock Keywords
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );




};

export default AdminDashboard;
