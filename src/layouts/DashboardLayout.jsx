import { Outlet, useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useState } from "react";

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ✅ Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ✅ Navigate to dashboard based on role
  const handleTitleClick = () => {
    if (role === "CUSTOMER") {
      navigate("/customer/dashboard");
    } else if (role === "ADMIN") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🔵 Navbar */}
      <nav
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 
                      text-gray-800 flex justify-between items-center 
                      shadow-lg sticky top-0 z-50 animate-fadeIn"
      >
        {/* 🏦 Title (clickable) */}
        <h1
          onClick={handleTitleClick}
          className="font-extrabold text-2xl tracking-wide flex items-center gap-2 text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
        >
          🏦 BankSphere
        </h1>

        {/* 👋 Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="bg-gray-100 px-4 py-2 rounded-lg text-gray-800 font-medium 
                      hover:bg-gray-200 transition-all duration-300 shadow-md"
          >
            👋 Welcome {user.username} ▼
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-[500]">
              <h3 className="font-semibold text-gray-700 mb-2">
                ⚙️ Profile Settings
              </h3>

              {/* ✅ Show only for CUSTOMER */}
              {role === "CUSTOMER" && (
                <>
                  <Link
                    to="/customer/profile/change-email"
                    className="block p-2 rounded hover:bg-gray-100"
                  >
                    📧 Change Email
                  </Link>
                  <Link
                    to="/customer/profile/change-password"
                    className="block p-2 rounded hover:bg-gray-100"
                  >
                    🔐 Change Password
                  </Link>
                  <hr className="my-2" />
                </>
              )}

              {/* ✅ Logout for both CUSTOMER & ADMIN */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 🔵 Main Content */}
      <div className="flex-1 animate-fadeIn">
        <Outlet />
      </div>
    </div>
  );
}
