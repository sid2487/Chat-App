import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {

  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.post("http://localhost:5000/api/auth/login/", form);
    console.log(data);
    login(data);
    navigate("/chat");
  };

  
  return (
    <div className="min-h-screen flex  items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col bg-white p-10 rounded shadow-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2 border rounded "
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3 py-2 border rounded "
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700  text-white px-4 py-2 rounded transition-colors duration-500 cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Login