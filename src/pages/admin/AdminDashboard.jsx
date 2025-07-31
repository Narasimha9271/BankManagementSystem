import { useState, useEffect } from "react";
import adminApi from "../../store/api/adminApi";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("customers");

  // 🔹 States
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // 🔹 Filters for Transactions
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (activeTab === "customers") fetchCustomers();
    if (activeTab === "transactions") fetchTransactions();
  }, [activeTab]);

  // ✅ API Calls
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
      await adminApi.delete(`/api/admin/view/customers/${id}`);
      alert("✅ Customer Deleted");
      fetchCustomers();
    } catch (err) {
      console.error("❌ Error deleting customer", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await adminApi.get("/api/admin/view/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Error fetching transactions", err);
    }
  };

  // ✅ Filter transactions client-side
  const filteredTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.timestamp);
    const afterStart = startDate ? txnDate >= new Date(startDate) : true;
    const beforeEnd = endDate ? txnDate <= new Date(endDate) : true;
    const typeMatch =
      typeFilter === "ALL"
        ? true
        : txn.type === typeFilter ||
          (typeFilter === "DEPOSIT" && txn.type === "CREDIT") ||
          (typeFilter === "WITHDRAW" && txn.type === "DEBIT");
    return afterStart && beforeEnd && typeMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 p-4 sm:p-6">
      {/* 🌟 Responsive Navbar */}
      <div className="flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-3 sm:space-y-0 bg-white/80 backdrop-blur-lg shadow-lg rounded-xl p-3 sm:p-4 mb-6 sticky top-0 z-5">
        {["customers", "transactions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-5 py-2 rounded-lg font-semibold transition-all duration-300 w-full sm:w-auto text-center
              ${
                activeTab === tab
                  ? "bg-purple-600 text-white shadow-md scale-105"
                  : "text-gray-700 hover:bg-purple-100"
              }`}
          >
            {tab === "customers" && "👥 Customers"}
            {tab === "transactions" && "📜 Transactions"}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* 👥 CUSTOMERS TAB */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-700">
              👥 Customers
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-purple-50 text-purple-800">
                    <th className="p-3 border-b">Name</th>
                    <th className="p-3 border-b">Email</th>
                    <th className="p-3 border-b">Account #</th>
                    <th className="p-3 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr
                      key={c.id}
                      className="text-center hover:bg-purple-50 transition-colors"
                    >
                      <td className="p-3 border-b">{c.username}</td>
                      <td className="p-3 border-b">{c.email}</td>
                      <td className="p-3 border-b">{c.accountNumber}</td>
                      <td className="p-3 border-b">
                        <button
                          onClick={() => deleteCustomer(c.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
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

        {/* 📜 TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-700">
              📜 Transactions
            </h2>

            {/* ✅ FILTERS */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
              {/* Type Filter */}
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Transaction Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border p-2 rounded-lg w-full"
                >
                  <option value="ALL">All</option>
                  <option value="DEPOSIT">Deposit</option>
                  <option value="WITHDRAW">Withdraw</option>
                  <option value="TRANSFER_DEBIT">Transfer Debit</option>
                  <option value="TRANSFER_CREDIT">Transfer Credit</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border p-2 rounded-lg w-full"
                />
              </div>

              {/* End Date */}
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border p-2 rounded-lg w-full"
                />
              </div>

              {/* Reset Button */}
              {(startDate || endDate || typeFilter !== "ALL") && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setTypeFilter("ALL");
                  }}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 w-full sm:w-auto"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* ✅ Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-purple-50 text-purple-800">
                    <th className="p-3 border-b">Txn ID</th>
                    <th className="p-3 border-b">Customer ID</th>
                    <th className="p-3 border-b">Type</th>
                    <th className="p-3 border-b">Amount</th>
                    <th className="p-3 border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((txn) => {
                      let displayType =
                        txn.type === "CREDIT"
                          ? "Deposit"
                          : txn.type === "DEBIT"
                          ? "Withdraw"
                          : txn.type.replace("_", " ");

                      return (
                        <tr
                          key={txn.id}
                          className="text-center hover:bg-purple-50 transition-colors"
                        >
                          <td className="p-3 border-b">{txn.id}</td>
                          <td className="p-3 border-b">{txn.customerId}</td>
                          <td className="p-3 border-b">{displayType}</td>
                          <td className="p-3 border-b">
                            ₹{txn.type === "CREDIT" ? txn.credit : txn.debit}
                          </td>
                          <td className="p-3 border-b">
                            {new Date(txn.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-500">
                        No transactions found for selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
