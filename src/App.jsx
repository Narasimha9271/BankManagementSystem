import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";

// Public pages

// Customer pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Transactions from "./pages/customer/Transactions";
import Transfer from "./pages/customer/Transfer";
import Profile from "./pages/customer/Profile";
// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Banks from "./pages/admin/Banks";
import Branches from "./pages/admin/Branches";
import Customers from "./pages/admin/Customers";
import Accounts from "./pages/admin/Accounts";
import AdminTransactions from "./pages/admin/Transactions";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleSelect from "./pages/public/RoleSelect";
import CustomerLogin from "./pages/public/CustomerLogin";
import AdminLogin from "./pages/public/AdminLogin";
import CustomerRegister from "./pages/public/CustomerRegister";
import AdminRegister from "./pages/public/AdminRegister";
import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/login/customer" element={<CustomerLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register/customer" element={<CustomerRegister />} />
          <Route path="/register/admin" element={<AdminRegister />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="CUSTOMER">
              <DashboardLayout role="CUSTOMER" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <DashboardLayout role="ADMIN" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="banks" element={<Banks />} />
          <Route path="branches" element={<Branches />} />
          <Route path="customers" element={<Customers />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
