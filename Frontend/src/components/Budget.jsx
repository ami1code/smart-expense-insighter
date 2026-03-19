import React, { useState } from "react";
import { normalize, groupByCategory } from "../utils/helpers";

export default function Budget({ limits, setLimits, allExpenses, selectedDate }) {
  const [cat,setCat]=useState("");
  const [amt,setAmt]=useState("");

  const save=()=>{
    if(!cat||!amt) return;
    const c=normalize(cat);
    setLimits({...limits,[c]:+amt});
    setCat(""); 
    setAmt("");
  };

  const del=(c)=>{
    const updated={...limits};
    delete updated[c];
    setLimits(updated);
  };

  const todays = allExpenses.filter(e=>e.date===selectedDate);
  const spent = groupByCategory(todays);

  const warnings = Object.entries(limits).map(([c,v])=>{
    const used = spent.find(s=>s.name===c)?.value || 0;
    const percent = v ? (used/v)*100 : 0;
    return { c, v, used, percent };
  });

  return (
    <div className="bg-[#111827]/80 backdrop-blur-lg border border-white/10 p-5 md:p-6 rounded-2xl shadow-xl">

      {/* TITLE */}
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-slate-200">
        Budget Limits (Per Day)
      </h2>

      {/* WARNINGS */}
      {warnings.some(w => w.percent >= 80) && (
        <div className="mb-4 space-y-2">
          {warnings.map((w,i)=>{
            if(w.percent >= 100){
              return (
                <div key={i} className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-2 rounded-lg text-sm">
                  ⚠️ {w.c} exceeded → ₹{w.used} / ₹{w.v}
                </div>
              );
            }
            if(w.percent >= 80){
              return (
                <div key={i} className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-3 py-2 rounded-lg text-sm">
                  ⚡ {w.c} at {Math.round(w.percent)}%
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* INPUT SECTION */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">

        <input 
          value={cat} 
          onChange={e=>setCat(e.target.value)} 
          placeholder="Category"
          className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg w-full
                     focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input 
          value={amt} 
          onChange={e=>setAmt(e.target.value)} 
          placeholder="Limit" 
          type="number"
          className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg w-full
                     focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <button 
          onClick={save} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg 
                     shadow-lg shadow-emerald-500/30 transition-all duration-300 w-full md:w-auto"
        >
          Save
        </button>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(limits).map(([c,v])=>{
          const used = spent.find(s=>s.name===c)?.value || 0;
          const percent = v ? Math.min((used/v)*100,100) : 0;

          return (
            <div key={c} className="bg-[#0f172a] border border-white/10 rounded-xl p-4 shadow-md">

              {/* CATEGORY */}
              <div className="flex justify-between items-center mb-2">
                <span className="capitalize font-semibold text-slate-200">
                  {c}
                </span>

                <button 
                  onClick={()=>del(c)} 
                  className="bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </div>

              {/* AMOUNT */}
              <div className="text-sm text-slate-400 mb-2">
                ₹{used} / ₹{v}
              </div>

              {/* PROGRESS BAR */}
              <div className="w-full bg-slate-700 h-2 rounded">
                <div 
                  className={`h-2 rounded transition-all duration-300 ${
                    percent > 80 ? "bg-rose-500" : "bg-cyan-400"
                  }`}
                  style={{width:`${percent}%`}} 
                />
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}