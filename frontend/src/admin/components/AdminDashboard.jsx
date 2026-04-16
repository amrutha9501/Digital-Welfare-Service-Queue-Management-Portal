import React from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const AdminDashboard = () => {
  return (
    <div className="max-w-5xl animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-[#1B365D] uppercase tracking-tight">System Status</h2>
        <p className="text-slate-500 font-medium">Monitoring live department operations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <PeopleAltIcon className="text-blue-500 mb-4" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Citizens</p>
          <p className="text-4xl font-black text-slate-800">1,402</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <TrendingUpIcon className="text-emerald-500 mb-4" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tokens Issued Today</p>
          <p className="text-4xl font-black text-slate-800">156</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;