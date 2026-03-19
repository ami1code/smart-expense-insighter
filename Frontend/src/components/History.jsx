import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { normalize } from "../utils/helpers";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function History({ expenses, setExpenses }) {
  const [date,setDate]=useState("");
  const [editIndex,setEditIndex]=useState(null);
  const [editData,setEditData]=useState({amount:"",category:"",date:""});



  const data = date ? expenses.filter(e=>e.date===date) : expenses;

  const startEdit = (index, item) => {
    setEditIndex(index);
    setEditData({...item});
  };

  const saveEdit = () => {
    const updated = [...expenses];
    updated[editIndex] = {
      ...editData,
      amount: +editData.amount,
      category: normalize(editData.category)
    };
    setExpenses(updated);
    setEditIndex(null);
  };

  const deleteExpense = (index) => {
    const updated = [...expenses];
    updated.splice(index,1);
    setExpenses(updated);
  };

  // 🔥 RESET ALL
  const resetAll = () => {
    if(window.confirm("Are you sure you want to delete all expenses?")){
      setExpenses([]);
    }
  };

  // 📤 EXPORT PDF
  const exportPDF = () => {
  const pdf = new jsPDF();

  // Title
  pdf.setFontSize(18);
  pdf.text("Expense Report", 14, 20);

  // Prepare data
  const tableData = data.map((e, i) => [
    i + 1,
    e.category.toUpperCase(),
    `Rs. ${e.amount}`,
    e.date
  ]);

  // Calculate total
  const total = data.reduce((sum, e) => sum + e.amount, 0);

  // Table
  autoTable(pdf, {
    startY: 30,
    head: [["#", "Category", "Amount", "Date"]],
    body: tableData,
    theme: "grid",

    styles: {
      fontSize: 10,
      cellPadding: 3
    },

    headStyles: {
      fillColor: [56, 189, 248], // cyan
      textColor: 0
    },

    alternateRowStyles: {
      fillColor: [240, 249, 255]
    }
  });

  // Total
  pdf.text(`Total Expense: Rs. ${total}`, 14, pdf.lastAutoTable.finalY + 10);

  // Save
  pdf.save("expense-report.pdf");
};
  return (
    <div className="max-w-5xl mx-auto px-4">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

        <h1 className="text-2xl md:text-3xl font-bold text-slate-200">
          Expense History
        </h1>

        <div className="flex gap-3 flex-wrap">

          <Link to="/">
            <button className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-2 rounded-xl shadow">
              Back
            </button>
          </Link>

          {/* EXPORT */}
          <button 
            onClick={exportPDF}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-xl shadow-lg shadow-cyan-500/30 transition"
          >
            Export PDF
          </button>

          {/* RESET */}
          <button 
            onClick={resetAll}
            className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl shadow-lg shadow-rose-500/30 transition"
          >
            Reset All
          </button>

        </div>
      </div>

      {/* FILTER */}
      <div className="mb-5">
        <input 
          type="date" 
          value={date} 
          onChange={e=>setDate(e.target.value)} 
          className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* LIST */}
      <div 
        className="bg-[#111827]/80 backdrop-blur-lg border border-white/10 p-5 md:p-6 rounded-2xl shadow-xl"
      >

        {data.length === 0 ? (
          <p className="text-center text-slate-400">
            No expenses found
          </p>
        ) : (
          data.map((e,i)=>(
            <div 
              key={i} 
              className="border-b border-slate-700 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
            >

              {editIndex===i ? (
                // EDIT MODE
                <div className="flex flex-col md:flex-row gap-2 w-full">

                  <input 
                    value={editData.category} 
                    onChange={ev=>setEditData({...editData,category:ev.target.value})} 
                    className="bg-slate-900 border border-slate-700 text-white p-2 rounded w-full"
                  />

                  <input 
                    type="number" 
                    value={editData.amount} 
                    onChange={ev=>setEditData({...editData,amount:ev.target.value})} 
                    className="bg-slate-900 border border-slate-700 text-white p-2 rounded w-full"
                  />

                  <input 
                    type="date" 
                    value={editData.date} 
                    onChange={ev=>setEditData({...editData,date:ev.target.value})} 
                    className="bg-slate-900 border border-slate-700 text-white p-2 rounded w-full"
                  />

                  <button 
                    onClick={saveEdit} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded"
                  >
                    Save
                  </button>

                </div>
              ) : (
                // NORMAL VIEW
                <>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">

                    <span className="capitalize font-medium text-slate-200">
                      {e.category}
                    </span>

                    <span className="text-slate-300">
                      ₹{e.amount}
                    </span>

                    <span className="text-slate-400 text-sm">
                      {e.date}
                    </span>

                  </div>

                  <div className="flex gap-2">

                    <button 
                      onClick={()=>startEdit(i,e)} 
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button 
                      onClick={()=>deleteExpense(i)} 
                      className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>

                  </div>
                </>
              )}

            </div>
          ))
        )}

      </div>
    </div>
  );
}