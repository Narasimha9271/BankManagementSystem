import { useState, useEffect } from "react";
import customerApi from "../../store/api/customerApi";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("balance");
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transferData, setTransferData] = useState({
    toUsername: "",
    amount: "",
  });
  const [creditAmount, setCreditAmount] = useState("");
  const [debitAmount, setDebitAmount] = useState("");
  const [filter, setFilter] = useState("ALL");

  // ✅ Fetch balance & transactions when component mounts
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await customerApi.get("/api/customers/me/balance");
      setBalance(res.data.balance);
    } catch (err) {
      console.error("❌ Error fetching balance", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await customerApi.get("/api/transactions/my");
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Error fetching transactions", err);
    }
  };

  // ✅ Filtered transactions
  const filteredTransactions = transactions.filter((txn) => {
    if (filter === "ALL") return true;
    if (filter === "TRANSFER") return txn.type.includes("TRANSFER");
    return txn.type === filter;
  });

  // ✅ Download mini-statement

  const downloadMiniStatement = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Mini Statement (Last 10 Transactions)", 14, 20);

    const last10 = transactions.slice(-10);

    const tableData = last10.map((txn) => [
      txn.type.replace("_", " "),
      `₹ ${txn.type === "CREDIT" ? txn.credit : txn.debit}`,
      new Date(txn.timestamp).toLocaleString(),
    ]);

    doc.autoTable({
      head: [["Type", "Amount", "Date"]],
      body: tableData,
      startY: 30,
    });

    doc.save("mini-statement.pdf");
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await customerApi.post("/api/transactions/transfer", transferData);
      alert("✅ Transfer Successful!");
      fetchBalance();
      fetchTransactions();
      setTransferData({ toUsername: "", amount: "" });
    } catch (err) {
      console.error("❌ Transfer Failed", err);
      alert("❌ Transfer Failed");
    }
  };

  // ✅ Credit money function
  const handleCredit = async (e) => {
    e.preventDefault();
    try {
      await customerApi.post("/api/transactions/credit", {
        amount: creditAmount,
      });
      alert("✅ Money Credited!");
      fetchBalance();
      fetchTransactions();
      setCreditAmount("");
    } catch (err) {
      console.error("❌ Credit Failed", err);
      alert("❌ Credit Failed");
    }
  };

  // ✅ Debit money function
  const handleDebit = async (e) => {
    e.preventDefault();
    try {
      await customerApi.post("/api/transactions/debit", {
        amount: debitAmount,
      });
      alert("✅ Money Debited!");
      fetchBalance();
      fetchTransactions();
      setDebitAmount("");
    } catch (err) {
      console.error("❌ Debit Failed", err);
      alert("❌ Debit Failed");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 📌 Sidebar */}
      <div className="w-64 bg-blue-700 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6">Customer Panel</h2>
        {["balance", "credit", "debit", "transfer", "transactions"].map(
          (tab) => (
            <button
              key={tab}
              className={`p-2 mb-2 rounded ${
                activeTab === tab ? "bg-blue-900" : "hover:bg-blue-800"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "balance" && "🏦 Balance Overview"}
              {tab === "credit" && "💰 Credit Money"}
              {tab === "debit" && "💵 Debit Money"}
              {tab === "transfer" && "💸 Transfer Money"}
              {tab === "transactions" && "📜 Transactions"}
            </button>
          )
        )}
      </div>

      {/* 📌 Main Content */}
      <div className="flex-1 p-6">
        {/* 🏦 Balance */}
        {activeTab === "balance" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🏦 Balance Overview</h2>
            <div className="bg-white p-6 rounded shadow">
              <p className="text-xl">💰 Current Balance:</p>
              <h1 className="text-4xl font-bold text-green-600 mt-2">
                ₹ {balance !== null ? balance.toFixed(2) : "Loading..."}
              </h1>
            </div>
          </div>
        )}

        {/* 💰 Credit Money */}
        {activeTab === "credit" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💰 Credit Money</h2>
            <form
              onSubmit={handleCredit}
              className="bg-white p-6 rounded shadow w-[400px]"
            >
              <input
                type="number"
                placeholder="Enter amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="w-full p-2 border rounded mb-3"
                required
              />
              <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
                Credit Money
              </button>
            </form>
          </div>
        )}

        {/* 💵 Debit Money */}
        {activeTab === "debit" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💵 Debit Money</h2>
            <form
              onSubmit={handleDebit}
              className="bg-white p-6 rounded shadow w-[400px]"
            >
              <input
                type="number"
                placeholder="Enter amount"
                value={debitAmount}
                onChange={(e) => setDebitAmount(e.target.value)}
                className="w-full p-2 border rounded mb-3"
                required
              />
              <button className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700">
                Debit Money
              </button>
            </form>
          </div>
        )}

        {/* 💸 Transfer Money */}
        {activeTab === "transfer" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💸 Transfer Money</h2>
            <form
              onSubmit={handleTransfer}
              className="bg-white p-6 rounded shadow w-[400px]"
            >
              <input
                type="text"
                name="toUsername"
                placeholder="Recipient Username"
                value={transferData.toUsername}
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    toUsername: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mb-3"
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={transferData.amount}
                onChange={(e) =>
                  setTransferData({ ...transferData, amount: e.target.value })
                }
                className="w-full p-2 border rounded mb-3"
                required
              />
              <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
                Send Money
              </button>
            </form>
          </div>
        )}

        {/* 🔹 FILTER + DOWNLOAD */}
        {activeTab === "transactions" && (
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-3 py-1 rounded ${
                  filter === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("CREDIT")}
                className={`px-3 py-1 rounded ${
                  filter === "CREDIT"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Credit
              </button>
              <button
                onClick={() => setFilter("DEBIT")}
                className={`px-3 py-1 rounded ${
                  filter === "DEBIT" ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                Debit
              </button>
              <button
                onClick={() => setFilter("TRANSFER")}
                className={`px-3 py-1 rounded ${
                  filter === "TRANSFER"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Transfer
              </button>
            </div>

            <button
              onClick={downloadMiniStatement}
              className="px-3 py-1 rounded bg-purple-500 text-white"
            >
              📥 Download Mini Statement
            </button>
          </div>
        )}

        {/* 📜 Transactions */}
        {activeTab === "transactions" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📜 Transactions History</h2>
            <div className="bg-white p-6 rounded shadow">
              {transactions.length === 0 ? (
                <p>No transactions found.</p>
              ) : (
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 border">Type</th>
                      <th className="p-2 border">Amount</th>
                      <th className="p-2 border">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((txn) => {
                      let amount =
                        txn.type === "CREDIT" ? txn.credit : txn.debit;
                      let color =
                        txn.type === "CREDIT"
                          ? "text-green-600"
                          : txn.type === "DEBIT"
                          ? "text-red-600"
                          : "text-orange-600"; // for TRANSFER_DEBIT

                      return (
                        <tr key={txn.id} className="text-center">
                          <td className="p-2 border">
                            {txn.type.replace("_", " ")}
                          </td>
                          <td className={`p-2 border font-semibold ${color}`}>
                            ₹ {amount}
                          </td>
                          <td className="p-2 border">
                            {new Date(txn.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
