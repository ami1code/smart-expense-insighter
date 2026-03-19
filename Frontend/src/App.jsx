import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import Auth from "./components/Auth";

export default function App() {

  // ✅ current user (only for session)
  const [user, setUser] = useState(null);

  // ✅ user data from DB
  const [expenses, setExpenses] = useState([]);
  const [limits, setLimits] = useState({});

  // 🔄 Load user data after login
  useEffect(() => {
    if (user) {
      setExpenses(user.expenses || []);
      setLimits(user.limits || {});
    }
  }, [user]);

  // 🔄 Sync data to MongoDB
  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:5000/api/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email,
        expenses,
        limits
      })
    });
  }, [expenses, limits, user]);

  // 🚪 Logout
  const logout = () => {
    setUser(null);
  };

  return (
    <Router>

      {!user ? (
        <Auth setUser={setUser} />
      ) : (

        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-slate-200 p-4 md:p-8">

          {/* HEADER */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

            {/* LEFT */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-wide">
                Personal Expense Insight Dashboard
              </h1>

              <p className="text-slate-400 mt-2 text-base md:text-lg">
                Hi,{" "}
                <span className="font-semibold text-cyan-400 capitalize">
                  {user?.name || "User"}
                </span>{" "}
                👋
              </p>
            </div>

            {/* RIGHT */}
            <button
              onClick={logout}
              className="bg-rose-500 hover:bg-rose-600 px-5 py-2 rounded-xl shadow-lg shadow-rose-500/30 transition-all duration-300"
            >
              Logout
            </button>

          </div>

          {/* ROUTES */}
          <Routes>

            <Route
              path="/"
              element={
                <Dashboard
                  expenses={expenses}
                  setExpenses={setExpenses}
                  limits={limits}
                  setLimits={setLimits}
                />
              }
            />

            <Route
              path="/history"
              element={
                <History
                  expenses={expenses}
                  setExpenses={setExpenses}
                />
              }
            />

          </Routes>

        </div>
      )}

    </Router>
  );
}