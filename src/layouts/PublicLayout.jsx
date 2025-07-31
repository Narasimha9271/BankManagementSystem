import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div>
      <nav className="bg-blue-600 p-4 text-white flex justify-between">
        <Link to="/">
          <h1 className="font-bold">🏦 Bank App</h1>
        </Link>
        <div>
          <Link to="/login" className="mr-4">
            Login
          </Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
