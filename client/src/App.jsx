import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-700 text-white">
        {/* 🌟 Navbar */}
        <nav className="bg-slate-800/60 backdrop-blur-md border-b border-slate-700 shadow-lg fixed w-full z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-400 tracking-wide">
              AI Resume Builder
            </h1>
            <div className="flex gap-6">
              <Link
                to="/login"
                className="text-gray-200 hover:text-green-400 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-200 hover:text-green-400 transition"
              >
                Signup
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-200 hover:text-green-400 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </nav>

        {/* 🌈 Page Content */}
        <div className="pt-24 px-6 flex justify-center">
          <div className="w-full max-w-4xl bg-slate-800/60 rounded-2xl p-8 shadow-xl border border-slate-700">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/"
                element={
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-green-400 mb-4">
                      Welcome to AI Resume Builder ✨
                    </h2>
                    <p className="text-gray-300 text-lg">
                      Create a professional, AI-powered resume in seconds.
                      <br />
                      Login or Signup to get started.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                      <Link
                        to="/signup"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition"
                      >
                        Get Started
                      </Link>
                      <Link
                        to="/login"
                        className="border border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900 px-6 py-3 rounded-lg transition"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        </div>

        {/* 🦶 Footer */}
        <footer className="text-center mt-16 py-6 text-gray-400 text-sm">
          © {new Date().getFullYear()} AI Resume Builder. 
        </footer>
      </div>
    </Router>
  );
}



