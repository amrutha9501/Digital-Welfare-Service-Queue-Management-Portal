import React from 'react';
import BlockIcon from '@mui/icons-material/Block';
import VerifiedIcon from '@mui/icons-material/Verified';

const ManageUsers = () => {
  const users = [
    { id: 1, name: "Amrutha Acharya", phone: "+91 98765 43210", status: "Active" },
    { id: 2, name: "Test User", phone: "+91 00000 00000", status: "Blocked" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Citizen</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-slate-50/50 transition">
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-[#1B365D] uppercase">{u.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{u.phone}</p>
              </td>
              <td className="px-6 py-4">
                <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {u.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button className="text-slate-300 hover:text-red-500 transition"><BlockIcon fontSize="small" /></button>
                <button className="text-slate-300 hover:text-emerald-500 transition"><VerifiedIcon fontSize="small" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;