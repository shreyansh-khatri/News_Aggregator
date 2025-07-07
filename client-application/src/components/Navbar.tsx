import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC<{ handleLoginStatusChange: () => void }> = ({
  handleLoginStatusChange,
}) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    handleLoginStatusChange();
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow mb-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 mb-2 md:mb-0">
          <Link
            to="/"
            className="hover:bg-gray-700 px-3 py-2 rounded transition"
          >
            Headlines
          </Link>
          <Link
            to="/search"
            className="hover:bg-gray-700 px-3 py-2 rounded transition"
          >
            Search
          </Link>
          <Link
            to="/saved"
            className="hover:bg-gray-700 px-3 py-2 rounded transition"
          >
            Saved Articles
          </Link>
          <Link
            to="/configure"
            className="hover:bg-gray-700 px-3 py-2 rounded transition"
          >
            Configure Notifications
          </Link>
          <Link
            to="/notifications"
            className="hover:bg-gray-700 px-3 py-2 rounded transition"
          >
            Notifications
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
