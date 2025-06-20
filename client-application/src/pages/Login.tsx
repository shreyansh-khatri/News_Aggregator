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
    <div>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
