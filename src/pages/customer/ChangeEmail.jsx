import { useState } from "react";
import customerApi from "../../store/api/customerApi";

export default function ChangeEmail() {
  const [newEmail, setNewEmail] = useState("");

  const handleChangeEmail = async () => {
    if (!newEmail) {
      alert("⚠️ Please enter a valid email");
      return;
    }
    try {
      await customerApi.put("/api/customers/me/change-email", {
        email: newEmail,
      });
      alert("✅ Email updated successfully");
      setNewEmail("");
    } catch (err) {
      console.error("❌ Error updating email", err);
      alert("❌ Failed to update email");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-96 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          📧 Change Email
        </h2>
        <input
          type="email"
          placeholder="Enter new email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
        <button
          onClick={handleChangeEmail}
          className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
        >
          Update Email
        </button>
      </div>
    </div>
  );
}
