import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-cyan-100 to-green-100">
      {/* 🌟 NAVBAR */}
      <nav className="bg-gradient-to-r from-blue-700 to-cyan-600 shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">
        {/* 🏦 Brand Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🏦</span>
          <h1 className="font-extrabold text-white text-2xl tracking-wide hover:text-yellow-300 transition">
            BankSphere
          </h1>
        </Link>
      </nav>

      {/* 🌈 MAIN CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ⚓ FOOTER */}
      <footer className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white text-center p-4 mt-auto shadow-inner">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} BankSphere. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
