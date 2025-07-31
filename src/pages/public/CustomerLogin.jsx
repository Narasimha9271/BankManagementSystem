import { useState } from "react";
import { useNavigate } from "react-router-dom";
import customerApi from "../../store/api/customerApi";
import useAuthStore from "../../store/authStore";

export default function CustomerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const loginStore = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await customerApi.post("/auth/login", { username, password });

      loginStore.login(res.data.token, { username, role: "CUSTOMER" });
      navigate("/customer/dashboard");
    } catch (err) {
      console.error(err);
      alert("Customer login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        className="bg-white p-6 rounded shadow-md w-96"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-4">Customer Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-3 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}
