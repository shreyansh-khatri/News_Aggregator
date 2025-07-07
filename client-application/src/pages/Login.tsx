import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

interface Props {
  onLoginSuccess?: () => void;
}

const Login: React.FC<Props> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLogin = async () => {
   try {
     const res = await axiosInstance.post("/auth/login", { email, password });

     const token = res.data.token;
     const role = res.data.user?.role;

     if (token && role) {
       localStorage.setItem("token", token);
       localStorage.setItem("role", role);
       onLoginSuccess?.();
       navigate(role === "admin" ? "/admin" : "/");
     } else {
       throw new Error("Invalid login response");
     }
   } catch (err: any) {
     const errorMsg = err.response?.data?.message || "Login failed";
     alert(errorMsg);
     console.error("Login error:", err);
   }
 };


  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Login
      </h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-4"
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-4"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>
    </div>
  );

};

export default Login;
