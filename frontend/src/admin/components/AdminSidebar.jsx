import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
// import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
// import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const menu = [
    { name: 'Overview', path: '/admin/dashboard', icon: <DashboardIcon fontSize="small"/> },
    { name: 'Citizens', path: '/admin/users', icon: <PeopleIcon fontSize="small"/> },
    { name: 'Services', path: '/admin/services', icon: <AssignmentIcon fontSize="small"/> },
    { name: 'Counters', path: '/admin/counters', icon: <ViewModuleIcon fontSize="small"/> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#1B365D] text-white flex flex-col h-screen sticky top-0 shadow-xl">
      <div className="p-8 border-b border-white/5">
        <h1 className="text-xl font-black uppercase tracking-tighter">Krama Admin</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-emerald-500 text-white shadow-lg' : 'hover:bg-white/5 opacity-60'
              }`
            }
          >
            {item.icon}
            <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
          <LogoutIcon fontSize="small" />
          <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;