import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.token) {
        login(data.token);
        const decoded = jwtDecode(data.token);
        const isAdmin = decoded.role === "admin";
        navigate(isAdmin ? "/admin" : "/");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch {
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 border border-cyan-800 rounded-2xl rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-3 mb-4 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-3 mb-4 border rounded"
        />
        <button className="w-full bg-cyan-800 text-white p-3 rounded hover:bg-cyan-700">
          Login
        </button>
        {message && <p className="text-red-500 mt-2 text-center">{message}</p>}

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-cyan-800 font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
