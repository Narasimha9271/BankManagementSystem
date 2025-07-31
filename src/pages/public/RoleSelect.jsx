import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Who are you?</h1>

      {/* ✅ Login Buttons */}
      <div className="flex gap-4">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/login/customer")}
        >
          Customer Login
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => navigate("/login/admin")}
        >
          Admin Login
        </button>
      </div>

      {/* ✅ Register Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate("/register/customer")}
        >
          Customer Register
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => navigate("/register/admin")}
        >
          Admin Register
        </button>
      </div>
    </div>
  );
}
