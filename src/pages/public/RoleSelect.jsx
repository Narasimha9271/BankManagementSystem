import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-6">
      <h1 className="text-3xl font-bold mb-8">
        Are you a Customer or an Admin?
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="bg-white shadow-md rounded-lg p-6 text-center border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">👤 Customer</h2>
          <p className="text-gray-600 mb-4">
            Access your account, make transactions, and manage your profile.
          </p>

          <div className="flex flex-col gap-3">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate("/login/customer")}
            >
              Customer Login
            </button>
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={() => navigate("/register/customer")}
            >
              Customer Register
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">🛠️ Admin</h2>
          <p className="text-gray-600 mb-4">
            Manage customer accounts and transactions.
          </p>

          <button
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition w-full"
            onClick={() => navigate("/login/admin")}
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}
