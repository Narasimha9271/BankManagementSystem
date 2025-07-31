import { useState } from "react";
import { useNavigate } from "react-router-dom";
import customerApi from "../../store/api/customerApi";
import useAuthStore from "../../store/authStore";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function CustomerRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    aadhaar: "",
    dob: "",
    pan: "",
    gender: "",
    username: "",
    password: "",
    accountType: "SAVINGS",
    accountNumber: "",
    balance: "",
    branchId: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const loginStore = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await customerApi.post("/auth/register", form);
      alert("✅ Customer registered successfully!");

      // ✅ Auto-login after register
      loginStore.login(res.data.token, {
        username: form.username,
        role: "CUSTOMER",
      });

      navigate("/customer/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-green-100 animate-gradient pt-20">
      <form
        className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[500px] md:w-[550px] sm:w-[90%] transform transition-all duration-500 animate-scale-in"
        onSubmit={handleRegister}
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Customer Register
        </h2>

        {/* All other inputs stay the same */}
        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="aadhaar"
          placeholder="Aadhaar"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.aadhaar}
          onChange={handleChange}
        />
        <input
          name="dob"
          type="date"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.dob}
          onChange={handleChange}
        />
        <input
          name="pan"
          placeholder="PAN"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.pan}
          onChange={handleChange}
        />

        <select
          name="gender"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          name="username"
          placeholder="Username"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.username}
          onChange={handleChange}
          required
        />

        {/* ✅ Password field with eye toggle */}
        <div className="relative mb-4">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        </div>

        <select
          name="accountType"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.accountType}
          onChange={handleChange}
        >
          <option>Savings</option>
          <option>Current</option>
        </select>

        <input
          name="accountNumber"
          placeholder="Account Number"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.accountNumber}
          onChange={handleChange}
          required
        />
        <input
          name="balance"
          placeholder="Opening Balance"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.balance}
          onChange={handleChange}
        />
        <input
          name="branchId"
          placeholder="Branch ID"
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300"
          value={form.branchId}
          onChange={handleChange}
        />

        {/* ✅ Register Button */}
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white w-full py-3 rounded-lg font-semibold shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:from-cyan-500 hover:to-blue-500">
          Register
        </button>

        {/* ✅ Already Registered Link */}
        <p className="text-center mt-4 text-gray-700">
          Already registered?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login/customer")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
