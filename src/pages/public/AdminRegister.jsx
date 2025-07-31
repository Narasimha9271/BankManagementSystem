import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../store/api/adminApi";
import useAuthStore from "../../store/authStore";

export default function AdminRegister() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const loginStore = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.post("/api/admin/register", form);
      alert("✅ Admin registered successfully!");

      // optional auto-login after register
      loginStore.login(res.data.token, {
        username: form.username,
        role: "ADMIN",
      });

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Admin registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        className="bg-white p-6 rounded shadow-md w-96"
        onSubmit={handleRegister}
      >
        <h2 className="text-2xl font-bold mb-4">Admin Register</h2>

        <input
          name="username"
          placeholder="Username"
          className="w-full p-2 mb-3 border rounded"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
}
