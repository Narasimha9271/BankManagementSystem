import { useState } from "react";
import { useNavigate } from "react-router-dom";
import customerApi from "../../store/api/customerApi";
import useAuthStore from "../../store/authStore";

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

      // optional auto-login after register
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
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        className="bg-white p-6 rounded shadow-md w-[500px]"
        onSubmit={handleRegister}
      >
        <h2 className="text-2xl font-bold mb-4">Customer Register</h2>

        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-2 mb-3 border rounded"
          value={form.name}
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
          name="aadhaar"
          placeholder="Aadhaar"
          className="w-full p-2 mb-3 border rounded"
          value={form.aadhaar}
          onChange={handleChange}
        />
        <input
          name="dob"
          type="date"
          className="w-full p-2 mb-3 border rounded"
          value={form.dob}
          onChange={handleChange}
        />
        <input
          name="pan"
          placeholder="PAN"
          className="w-full p-2 mb-3 border rounded"
          value={form.pan}
          onChange={handleChange}
        />
        <select
          name="gender"
          className="w-full p-2 mb-3 border rounded"
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
          className="w-full p-2 mb-3 border rounded"
          value={form.username}
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

        <select
          name="accountType"
          className="w-full p-2 mb-3 border rounded"
          value={form.accountType}
          onChange={handleChange}
        >
          <option>Saving</option>
          <option>Current</option>
        </select>
        <input
          name="accountNumber"
          placeholder="Account Number"
          className="w-full p-2 mb-3 border rounded"
          value={form.accountNumber}
          onChange={handleChange}
          required
        />
        <input
          name="balance"
          placeholder="Opening Balance"
          className="w-full p-2 mb-3 border rounded"
          value={form.balance}
          onChange={handleChange}
        />
        <input
          name="branchId"
          placeholder="Branch ID"
          className="w-full p-2 mb-3 border rounded"
          value={form.branchId}
          onChange={handleChange}
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
}
