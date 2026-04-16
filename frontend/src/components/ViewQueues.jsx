import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewQueues = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLiveStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/services/services/live-status");
      // Sort by wait time so the fastest service is always at the top
      const sorted = [...response.data].sort((a, b) => {
        return parseInt(a.time) - parseInt(b.time);
      });
      setQueues(sorted);
      setLoading(false);
    } catch (err) {
      console.error("Board Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchLiveStatus();
    
    // Auto-refresh the board every 30 seconds
    const interval = setInterval(fetchLiveStatus, 30000);
    return () => clearInterval(interval); 
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse font-black text-[#1B365D]">LOADING LIVE BOARD...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-slate-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1B365D] tracking-tight uppercase">Live Status Board</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Real-time Krama (Order) Monitoring
            </p>
          </div>
          <button onClick={() => navigate('/services')} className="bg-white border border-slate-200 px-6 py-2 rounded-lg font-bold hover:bg-slate-50 transition shadow-sm">
            ← Back to Selection
          </button>
        </div>

        {/* Recommended Service (Dynamic) */}
        {queues.length > 0 && (
          <div className="mb-6 p-4 sm:p-5 bg-green-50 border border-green-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-green-600 font-bold">Recommended Service (Lowest Wait)</p>
                <p className="text-lg font-bold text-green-800">{queues[0].name}</p>
              </div>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg border border-green-200">
              <span className="text-sm font-bold text-green-700">Only {queues[0].time} wait</span>
            </div>
          </div>
        )}

        {/* Live Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {queues.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              
              <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-[#1B365D] uppercase tracking-wide text-sm">{q.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${q.bg} ${q.color}`}>
                  ● {q.status}
                </span>
              </div>

              <div className="p-8 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Serving</span>
                  <span className="text-3xl font-black text-[#1B365D] tracking-tighter">
                    {q.current === "None" ? "---" : q.current}
                  </span>
                </div>

                <div className="h-10 w-px bg-slate-100"></div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Waiting</span>
                  <span className="text-3xl font-black text-slate-800">{q.waiting}</span>
                </div>

                <div className="h-10 w-px bg-slate-100"></div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Est. Time</span>
                  <span className={`text-3xl font-black ${q.color}`}>{q.time}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/service/${q.id}`)}
                className="w-full bg-slate-50 py-3 text-xs font-bold text-[#1B365D] uppercase tracking-widest hover:bg-[#1B365D] hover:text-white transition-colors border-t border-slate-100"
              >
                Join This Department →
              </button>
            </div>
          ))}
        </div>

        {/* Informational Footer */}
        <div className="mt-12 bg-[#1B365D] text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white/10 p-4 rounded-xl text-3xl">ℹ️</div>
          <div>
            <h4 className="font-bold text-lg tracking-tight">How is this calculated?</h4>
            <p className="text-blue-100 text-sm leading-relaxed">
              Waiting times are based on the number of active tokens multiplied by the average processing time per department. 
              The <strong>"Serving"</strong> number indicates the last token called to a counter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewQueues;