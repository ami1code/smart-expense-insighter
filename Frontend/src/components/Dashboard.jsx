import React, { useState } from "react";
import ExpenseForm from "./ExpenseForm";
import Budget from "./Budget";
import { groupByCategory, groupByDate, filterData, COLORS } from "../utils/helpers";
import { Link } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis,
  ResponsiveContainer, CartesianGrid
} from "recharts";

export default function Dashboard({ expenses, setExpenses, limits, setLimits }) {
  const [mode,setMode]=useState("day");
  const [date,setDate]=useState(new Date().toISOString().split("T")[0]);

  const filtered = filterData(expenses,mode,date);

  const categoryData = groupByCategory(filtered);
  const dateData = groupByDate(filtered);

  return (
    <div className="max-w-6xl mx-auto px-4">

      {/* TOP ACTION BAR */}
      <div className="flex justify-end mb-6">
        <Link to="/history">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300">
            History
          </button>
        </Link>
      </div>

      {/* EXPENSE FORM */}
      <div className="mb-6">
        <ExpenseForm addExpense={(e)=>setExpenses(p=>[...p,e])} />
      </div>

      {/* BUDGET */}
      <div className="mb-6">
        <Budget 
          limits={limits} 
          setLimits={setLimits} 
          allExpenses={expenses} 
          selectedDate={date} 
        />
      </div>

      {/* GRAPH SECTION */}
      <div className="bg-[#111827]/80 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl">

        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center text-slate-200">
          Expense Analytics
        </h2>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 justify-center items-center">

          <select 
            value={mode} 
            onChange={e=>setMode(e.target.value)} 
            className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="day">Day</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>

          <input 
            type="date" 
            value={date} 
            onChange={e=>setDate(e.target.value)} 
            className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* PIE CHART */}
        <div className="mb-10">
          {categoryData.length === 0 ? (
            <p className="text-center text-slate-400">No category data</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} dataKey="value">
                  {categoryData.map((_,i)=>(
                    <Cell key={i} fill={COLORS[i%COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "10px",
                    color: "#fff"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* LINE CHART */}
        <div>
          {dateData.length === 0 ? (
            <p className="text-center text-slate-400">No trend data</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dateData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "10px",
                    color: "#fff"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#38bdf8" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
}