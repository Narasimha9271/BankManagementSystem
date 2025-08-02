import { useState, useEffect } from "react";
import customerApi from "../../store/api/customerApi";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("balance");
  const [menuOpen, setMenuOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transferData, setTransferData] = useState({
    toUsername: "",
    amount: "",
  });
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [filter, setFilter] = useState("ALL");

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

  const filteredTransactions = transactions.filter((txn) => {
    if (filter === "ALL") return true;
    if (filter === "TRANSFER") return txn.type.includes("TRANSFER");
    if (filter === "DEPOSIT") return txn.type === "CREDIT";
    if (filter === "WITHDRAW") return txn.type === "DEBIT";
    return txn.type === filter;
  });

  const downloadMiniStatement = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Mini Statement (Last 10 Transactions)", 14, 20);

    const last10 = transactions.slice(-10);
    const tableData = last10.map((txn) => [
      txn.type === "CREDIT"
        ? "Deposit"
        : txn.type === "DEBIT"
        ? "Withdraw"
        : txn.type.replace("_", " "),
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

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await customerApi.post("/api/transactions/credit", {
        amount: depositAmount,
      });
      alert("✅ Money Deposited!");
      fetchBalance();
      fetchTransactions();
      setDepositAmount("");
    } catch (err) {
      const msg = err.response?.data?.message || "Deposit Failed";
      alert(`❌ ${msg}`);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      await customerApi.post("/api/transactions/debit", {
        amount: withdrawAmount,
      });
      alert("✅ Money Withdrawn!");
      fetchBalance();
      fetchTransactions();
      setWithdrawAmount("");
    } catch (err) {
      const msg = err.response?.data?.message || "Withdraw Failed";
      alert(`❌ ${msg}`);
    }
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
      const msg = err.response?.data?.message || "Transfer Failed";
      alert(`❌ ${msg}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-green-100">
      <div className="sm:w-64 w-full bg-gradient-to-b from-teal-700 to-cyan-500 text-white p-4 shadow-2xl">
        <div className="flex justify-between items-center sm:block">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-center tracking-wide">
            🏦 Customer Panel
          </h2>
          <button
            className="sm:hidden bg-blue-700 px-3 py-2 rounded-md"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        <div className={`${menuOpen ? "block" : "hidden"} sm:block`}>
          {["balance", "deposit", "withdraw", "transfer", "transactions"].map(
            (tab) => (
              <button
                key={tab}
                className={`w-full text-left p-3 mb-3 rounded-lg text-lg transition-all ${
                  activeTab === tab
                    ? "bg-blue-900 shadow-lg scale-105"
                    : "hover:bg-blue-700 hover:shadow-md hover:scale-105"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setMenuOpen(false);
                }}
              >
                {tab === "balance" && "🏦 Balance Overview"}
                {tab === "deposit" && "💰 Deposit Money"}
                {tab === "withdraw" && "💵 Withdraw Money"}
                {tab === "transfer" && "💸 Transfer Money"}
                {tab === "transactions" && "📜 Transactions"}
              </button>
            )
          )}
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-8 animate-fadeIn">
        {activeTab === "balance" && (
          <div className="animate-slideIn">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              🏦 Balance Overview
            </h2>
            <div className="bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/40">
              <p className="text-lg sm:text-xl text-gray-700">
                💰 Current Balance:
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-green-600 mt-3 drop-shadow-md">
                ₹ {balance !== null ? balance.toFixed(2) : "Loading..."}
              </h1>
            </div>
          </div>
        )}

        {activeTab === "deposit" && (
          <div className="flex flex-col justify-center items-center w-full h-[80vh] animate-slideIn">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              💰 Deposit Money
            </h2>
            <form
              onSubmit={handleDeposit}
              className="bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md"
            >
              <input
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />
              <button className="bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 transition transform hover:scale-105">
                ✅ Deposit Money
              </button>
            </form>
          </div>
        )}

        {activeTab === "withdraw" && (
          <div className="flex flex-col justify-center items-center w-full h-[80vh] animate-slideIn">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              💵 Withdraw Money
            </h2>
            <form
              onSubmit={handleWithdraw}
              className="bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md"
            >
              <input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              />
              <button className="bg-red-600 text-white w-full py-3 rounded-lg hover:bg-red-700 transition transform hover:scale-105">
                ❌ Withdraw Money
              </button>
            </form>
          </div>
        )}

        {activeTab === "transfer" && (
          <div className="flex flex-col justify-center items-center w-full h-[80vh] animate-slideIn">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              💸 Transfer Money
            </h2>
            <form
              onSubmit={handleTransfer}
              className="bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md"
            >
              <input
                type="text"
                placeholder="Recipient Username"
                value={transferData.toUsername}
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    toUsername: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={transferData.amount}
                onChange={(e) =>
                  setTransferData({ ...transferData, amount: e.target.value })
                }
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <button className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105">
                🚀 Send Money
              </button>
            </form>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="animate-slideIn">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold">
                📜 Transactions History
              </h2>
              <button
                onClick={downloadMiniStatement}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
              >
                📥 Download Mini Statement
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {["ALL", "DEPOSIT", "WITHDRAW", "TRANSFER"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => setFilter(btn)}
                  className={`px-3 py-2 rounded-lg font-medium transition ${
                    filter === btn
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-xl overflow-x-auto">
              {transactions.length === 0 ? (
                <p>No transactions found.</p>
              ) : (
                <table className="w-full border rounded-lg overflow-hidden min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 border">Type</th>
                      <th className="p-3 border">Amount</th>
                      <th className="p-3 border">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((txn, i) => {
                      let amount =
                        txn.type === "CREDIT" ? txn.credit : txn.debit;
                      let displayType =
                        txn.type === "CREDIT"
                          ? "Deposit"
                          : txn.type === "DEBIT"
                          ? "Withdraw"
                          : txn.type.replace("_", " ");
                      let color =
                        txn.type === "CREDIT"
                          ? "text-green-600"
                          : txn.type === "DEBIT"
                          ? "text-red-600"
                          : "text-orange-600";

                      return (
                        <tr
                          key={txn.id}
                          className={`text-center ${
                            i % 2 === 0 ? "bg-white/70" : "bg-gray-50/60"
                          } hover:bg-gray-100 transition`}
                        >
                          <td className="p-3 border">{displayType}</td>
                          <td className={`p-3 border font-semibold ${color}`}>
                            ₹ {amount}
                          </td>
                          <td className="p-3 border">
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
