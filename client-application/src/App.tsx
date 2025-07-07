import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Headlines from "./pages/Headlines";
import Search from "./pages/Search";
import SavedArticles from "./pages/SavedArticles";
import ConfigureNotifications from "./pages/ConfigureNotifications";
import Notifications from "./pages/Notification";
import AdminDashboard from "./pages/AdminDashboard";
import ServerStatus from "./pages/admin/ServerStatus";
import ServerDetails from "./pages/admin/ServerDetails";
import UpdateServer from "./pages/admin/UpdateServer";
import AddCategory from "./pages/admin/AddCategory";
import ReportedArticles from "./pages/admin/ReportedArticles";
import ManageCategories from "./pages/admin/ManageCategories";
import KeywordFilters from "./pages/admin/KeywordFilters";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
   const [role, setRole] = useState(localStorage.getItem("role"));

   const handleLoginStatusChange = () => {
     setIsLoggedIn(!!localStorage.getItem("token"));
     setRole(localStorage.getItem("role"));
   };

  return (
    <Router>
      {isLoggedIn && role !== "admin" && (
        <Navbar handleLoginStatusChange={handleLoginStatusChange} />
      )}

      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginStatusChange} />}
        />
        <Route
          path="/register"
          element={<Register onRegisterSuccess={handleLoginStatusChange} />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              {role === "admin" ? <Navigate to="/admin" /> : <Headlines />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedArticles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configure"
          element={
            <ProtectedRoute>
              <ConfigureNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/server-status"
          element={
            <ProtectedRoute>
              <ServerStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/server-details"
          element={
            <ProtectedRoute>
              <ServerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/update-server"
          element={
            <ProtectedRoute>
              <UpdateServer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-category"
          element={
            <ProtectedRoute>
              <AddCategory />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/reported-articles" element={<ReportedArticles />} />
        <Route path="/admin/manage-categories" element={<ManageCategories />} />
        <Route path="/admin/keyword-filters" element={<KeywordFilters />} />
      </Routes>
    </Router>
  );
};

export default App;
