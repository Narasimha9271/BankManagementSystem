import { Outlet, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuthStore();

  const navigate = useNavigate();

  // 🎨 Color palette based on role
  const colors =
    role === "ADMIN"
      ? { bg: "bg-blue-700", title: "Bank App - Admin" }
      : { bg: "bg-green-600", title: "Bank App - Customer" };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔵 Navbar */}
      <nav
        className={`${colors.bg} p-4 text-white flex justify-between items-center`}
      >
        <h1 className="font-bold text-xl">🏦 {colors.title}</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">
            👋 Welcome, <span className="text-yellow-200">{user.username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🔵 Main content */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
