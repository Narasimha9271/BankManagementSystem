import { useState } from "react";
import { useNavigate } from "react-router-dom";
import customerApi from "../../store/api/customerApi";
import useAuthStore from "../../store/authStore";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function CustomerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-green-100 animate-gradient">
      <form
        className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-500 animate-scale-in"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Customer Login
        </h2>

        {/* ✅ Username input */}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* ✅ Password input with eye button */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
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

        {/* ✅ Login button */}
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white w-full py-3 rounded-lg font-semibold shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:from-cyan-500 hover:to-blue-500">
          Login
        </button>

        {/* ✅ Register link */}
        <p className="text-center mt-4 text-gray-700">
          New here?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/register/customer")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
