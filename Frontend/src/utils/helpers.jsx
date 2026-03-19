export const COLORS = ["#4f46e5","#22c55e","#f59e0b","#ef4444","#06b6d4"];

export const normalize = (s) => s.trim().toLowerCase();

export const groupByCategory = (data) => {
  const map = {};
  data.forEach(e => {
    const key = normalize(e.category);
    map[key] = (map[key] || 0) + e.amount;
  });
  return Object.entries(map).map(([name,value])=>({name,value}));
};

export const groupByDate = (data) => {
  const map = {};
  data.forEach(e => {
    map[e.date] = (map[e.date] || 0) + e.amount;
  });
  return Object.entries(map).sort().map(([date,amount])=>({date,amount}));
};

export const filterData = (expenses, mode, selectedDate) => {
  if(mode==="day") return expenses.filter(e=>e.date===selectedDate);

  if(mode==="week"){
    const selected = new Date(selectedDate);
    const start = new Date(selected);
    start.setDate(selected.getDate()-6);

    return expenses.filter(e=>{
      const d = new Date(e.date);
      return d >= start && d <= selected;
    });
  }

  if(mode==="month") return expenses.filter(e=>e.date.slice(0,7)===selectedDate.slice(0,7));
  if(mode==="year") return expenses.filter(e=>e.date.slice(0,4)===selectedDate.slice(0,4));

  return expenses;
};