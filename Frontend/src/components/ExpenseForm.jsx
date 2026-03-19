import React, { useState } from "react";
import { normalize } from "../utils/helpers";

export default function ExpenseForm({ addExpense }) {
  const [amount,setAmount]=useState("");
  const [category,setCategory]=useState("");
  const [date,setDate]=useState(new Date().toISOString().split("T")[0]);

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!amount||!category) return;

    addExpense({ amount:+amount, category:normalize(category), date });

    setAmount("");
    setCategory("");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-[#111827]/80 backdrop-blur-lg border border-white/10 p-5 md:p-6 rounded-2xl shadow-xl"
    >

      <h2 className="text-lg md:text-xl font-semibold mb-4 text-slate-200">
        Add Expense
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

        {/* AMOUNT */}
        <input 
          type="number" 
          placeholder="Amount ₹" 
          value={amount} 
          onChange={e=>setAmount(e.target.value)} 
          className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        {/* CATEGORY */}
        <input 
          placeholder="Category (e.g. food, travel)" 
          value={category} 
          onChange={e=>setCategory(e.target.value)} 
          className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        {/* DATE */}
        <input 
          type="date" 
          value={date} 
          onChange={e=>setDate(e.target.value)} 
          className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        {/* BUTTON */}
        <button 
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg 
                     shadow-lg shadow-emerald-500/30 transition-all duration-300"
        >
          Add
        </button>

      </div>
    </form>
  );
}