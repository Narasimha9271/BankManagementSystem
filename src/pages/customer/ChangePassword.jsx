import { useState } from "react";
import customerApi from "../../store/api/customerApi";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("⚠️ Please fill both password fields");
      return;
    }
    try {
      await customerApi.put("/api/customers/me/change-password", {
        oldPassword,
        newPassword,
      });
      alert("✅ Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("❌ Error changing password", err);
      alert("❌ Failed to change password");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">🔐 Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button
          onClick={handleChangePassword}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
