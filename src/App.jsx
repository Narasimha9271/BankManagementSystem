import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Transactions from "./pages/customer/Transactions";
import Transfer from "./pages/customer/Transfer";
import Profile from "./pages/customer/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Customers from "./pages/admin/Customers";
import AdminTransactions from "./pages/admin/Transactions";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleSelect from "./pages/public/RoleSelect";
import CustomerLogin from "./pages/public/CustomerLogin";
import AdminLogin from "./pages/public/AdminLogin";
import CustomerRegister from "./pages/public/CustomerRegister";
import DashboardLayout from "./layouts/DashboardLayout";
import ChangePassword from "./pages/customer/ChangePassword";
import ChangeEmail from "./pages/customer/ChangeEmail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/login/customer" element={<CustomerLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register/customer" element={<CustomerRegister />} />
        </Route>

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

          <Route path="profile/change-password" element={<ChangePassword />} />
          <Route path="profile/change-email" element={<ChangeEmail />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <DashboardLayout role="ADMIN" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
