import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ children, role }) {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/" />;

  if (role && user?.role !== role) {
    return (
      <Navigate
        to={user?.role === "ADMIN" ? "/admin/dashboard" : "/customer/dashboard"}
      />
    );
  }

  return children;
}
