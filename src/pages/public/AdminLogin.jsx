import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../store/api/adminApi";
import useAuthStore from "../../store/authStore";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loginStore = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.post("/api/admin/login", {
        username,
        password,
      });
      loginStore.login(res.data.token, { username, role: "ADMIN" });
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Admin login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient">
      <form
        className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-500 animate-scale-in"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Admin Login
        </h2>

        {/* ✅ Username Input */}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* ✅ Password Input with Eye Button */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        </div>

        {/* ✅ Login Button */}
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full py-3 rounded-lg font-semibold shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:from-pink-500 hover:to-purple-500">
          Login
        </button>
      </form>
    </div>
  );
}
