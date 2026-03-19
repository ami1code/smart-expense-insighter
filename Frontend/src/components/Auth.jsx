import React, { useState } from "react";

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill all fields");
      return;
    }

    try {
      // 🔐 LOGIN
      if (isLogin) {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.msg) {
          alert(data.msg);
        } else {
          setUser(data);
        }
      }

      // 🆕 SIGNUP
      else {
        const res = await fetch("http://localhost:5000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (data.msg) {
          alert(data.msg);
        } else {
          setUser(data);
        }
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">

      <div className="bg-[#111827]/80 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl w-80">

        <h2 className="text-xl font-bold mb-4 text-center text-cyan-400">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* NAME (only signup) */}
        {!isLogin && (
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white p-2 w-full mb-3 rounded focus:ring-2 focus:ring-cyan-400"
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white p-2 w-full mb-3 rounded focus:ring-2 focus:ring-cyan-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white p-2 w-full mb-3 rounded focus:ring-2 focus:ring-cyan-400"
        />

        <button
          onClick={handleSubmit}
          className="bg-cyan-500 hover:bg-cyan-600 text-black w-full py-2 rounded-lg font-semibold shadow-lg shadow-cyan-500/30 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="text-sm mt-3 text-center cursor-pointer text-cyan-400"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create account" : "Already have account?"}
        </p>

      </div>
    </div>
  );
}