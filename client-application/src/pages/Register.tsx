import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", form);
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/"); 
      } else {
        setMessage("Registered, but no token received.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };


  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Register
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          Register
        </button>
      </form>

      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );

};

export default Register;
