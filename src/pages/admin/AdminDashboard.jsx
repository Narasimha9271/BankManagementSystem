import { useState, useEffect } from "react";
import adminApi from "../../store/api/adminApi";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("banks");

  // 🔹 States for each section
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]); // ✅ NEW

  const [newBank, setNewBank] = useState({ name: "", code: "" });
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    bankId: "",
  });

  // 🔹 Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "banks") fetchBanks();
    if (activeTab === "branches") fetchBranches();
    if (activeTab === "customers") fetchCustomers();
    if (activeTab === "accounts") fetchAccounts();
    if (activeTab === "transactions") fetchTransactions(); // ✅ NEW
  }, [activeTab]);

  // ✅ BANK API CALLS
  const fetchBanks = async () => {
    try {
      const res = await adminApi.get("/api/banks");
      setBanks(res.data);
    } catch (err) {
      console.error("❌ Error fetching banks", err);
    }
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post("/api/banks", newBank);
      alert("✅ Bank Added");
      fetchBanks();
      setNewBank({ name: "", code: "" });
    } catch (err) {
      console.error("❌ Error adding bank", err);
    }
  };

  // ✅ BRANCH API CALLS
  const fetchBranches = async () => {
    try {
      const res = await adminApi.get("/api/branches");
      setBranches(res.data);
    } catch (err) {
      console.error("❌ Error fetching branches", err);
    }
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post("/api/branches", newBranch);
      alert("✅ Branch Added");
      fetchBranches();
      setNewBranch({ name: "", address: "", bankId: "" });
    } catch (err) {
      console.error("❌ Error adding branch", err);
    }
  };

  // ✅ CUSTOMER API CALLS (admin-only)
  const fetchCustomers = async () => {
    try {
      const res = await adminApi.get("/api/admin/view/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("❌ Error fetching customers", err);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      await adminApi.delete(`/api/admin/customers/${id}`);
      alert("✅ Customer Deleted");
      fetchCustomers();
    } catch (err) {
      console.error("❌ Error deleting customer", err);
    }
  };

  // ✅ ACCOUNT API CALLS (admin-only)
  const fetchAccounts = async () => {
    try {
      const res = await adminApi.get("/api/admin/accounts");
      setAccounts(res.data);
    } catch (err) {
      console.error("❌ Error fetching accounts", err);
    }
  };

  const closeAccount = async (id) => {
    if (!window.confirm("Close this account?")) return;
    try {
      await adminApi.put(`/api/admin/accounts/${id}/close`);
      alert("✅ Account Closed");
      fetchAccounts();
    } catch (err) {
      console.error("❌ Error closing account", err);
    }
  };

  // ✅ TRANSACTIONS API CALLS (admin-only)
  const fetchTransactions = async () => {
    try {
      const res = await adminApi.get("/api/admin/view/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Error fetching transactions", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 📌 Sidebar */}
      <div className="w-64 bg-purple-700 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        {["banks", "branches", "customers", "accounts", "transactions"].map(
          (tab) => (
            <button
              key={tab}
              className={`p-2 mb-2 rounded ${
                activeTab === tab ? "bg-purple-900" : "hover:bg-purple-800"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "banks" && "🏦 Banks"}
              {tab === "branches" && "🏢 Branches"}
              {tab === "customers" && "👥 Customers"}
              {tab === "accounts" && "💳 Accounts"}
              {tab === "transactions" && "📜 Transactions"}
            </button>
          )
        )}
      </div>

      {/* 📌 Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* 🏦 BANKS TAB */}
        {activeTab === "banks" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🏦 Bank Management</h2>
            <form
              onSubmit={handleAddBank}
              className="bg-white p-4 rounded shadow w-[400px] mb-6"
            >
              <input
                type="text"
                placeholder="Bank Name"
                value={newBank.name}
                onChange={(e) =>
                  setNewBank({ ...newBank, name: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                placeholder="Bank Code"
                value={newBank.code}
                onChange={(e) =>
                  setNewBank({ ...newBank, code: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                required
              />
              <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
                Add Bank
              </button>
            </form>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">All Banks</h3>
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map((b) => (
                    <tr key={b.id} className="text-center">
                      <td className="p-2 border">{b.name}</td>
                      <td className="p-2 border">{b.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🏢 BRANCHES TAB */}
        {activeTab === "branches" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🏢 Branch Management</h2>
            <form
              onSubmit={handleAddBranch}
              className="bg-white p-4 rounded shadow w-[400px] mb-6"
            >
              <input
                type="text"
                placeholder="Branch Name"
                value={newBranch.name}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, name: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                placeholder="Branch Address"
                value={newBranch.address}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, address: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                required
              />
              <select
                value={newBranch.bankId}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, bankId: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                required
              >
                <option value="">Select Bank</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
                Add Branch
              </button>
            </form>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">All Branches</h3>
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Address</th>
                    <th className="p-2 border">Bank</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((br) => (
                    <tr key={br.id} className="text-center">
                      <td className="p-2 border">{br.name}</td>
                      <td className="p-2 border">{br.address}</td>
                      <td className="p-2 border">{br.bankName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 👥 CUSTOMERS TAB */}
        {activeTab === "customers" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">👥 Customers</h2>
            <div className="bg-white p-4 rounded shadow">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Account</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="text-center">
                      <td className="p-2 border">{c.username}</td>
                      <td className="p-2 border">{c.email}</td>
                      <td className="p-2 border">{c.accountNumber}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => deleteCustomer(c.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 💳 ACCOUNTS TAB */}
        {activeTab === "accounts" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💳 Accounts</h2>
            <div className="bg-white p-4 rounded shadow">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Account #</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.id} className="text-center">
                      <td className="p-2 border">{acc.accountNumber}</td>
                      <td className="p-2 border">{acc.type}</td>
                      <td className="p-2 border">{acc.status}</td>
                      <td className="p-2 border">
                        {acc.status !== "CLOSED" && (
                          <button
                            onClick={() => closeAccount(acc.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Close Account
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 📜 TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📜 Transactions</h2>
            <div className="bg-white p-4 rounded shadow">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Txn ID</th>
                    <th className="p-2 border">Customer ID</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="text-center">
                      <td className="p-2 border">{txn.id}</td>
                      <td className="p-2 border">{txn.customerId}</td>
                      <td className="p-2 border">{txn.type}</td>
                      <td className="p-2 border">
                        ₹{txn.type === "CREDIT" ? txn.credit : txn.debit}
                      </td>
                      <td className="p-2 border">
                        {new Date(txn.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
