import React, { useState, useEffect } from "react";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import CounterModal from "./CounterModal";

const AdminCounters = () => {
    const [counters, setCounters] = useState([]);
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCounter, setSelectedCounter] = useState(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [cRes, sRes] = await Promise.all([
                axios.get("http://localhost:5000/api/counters"),
                axios.get("http://localhost:5000/api/services")
            ]);
            setCounters(cRes.data || []);
            setServices(sRes.data || []);
        } catch (err) { console.error("Fetch error", err); }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete ${name}? Allotments will be cleared.`)) return;
        try {
            await axios.delete(`http://localhost:5000/api/counters/${id}`);
            fetchData();
        } catch (err) { alert("Delete failed"); }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black text-[#1B365D] uppercase tracking-tight">Counter Management</h1>
                <button onClick={() => { setSelectedCounter(null); setIsModalOpen(true); }} className="bg-[#10B981] text-white px-6 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2">
                    <AddIcon sx={{ fontSize: 18 }} /> Add Desk
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(counters) && counters.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <DesktopWindowsIcon className="text-slate-300" />
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${c.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {c.is_active ? '● ONLINE' : '● OFFLINE'}
                            </span>
                        </div>
                        <h3 className="font-black text-[#1B365D] uppercase text-lg mb-4">{c.counter_name}</h3>
                        <div className="flex flex-wrap gap-2 mb-6 min-h-[50px]">
                            {c.services?.map(s => (
                                <span key={s.id} className="bg-slate-50 text-slate-500 text-[9px] font-bold px-2 py-1 rounded-lg border border-slate-100">{s.name}</span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setSelectedCounter(c); setIsModalOpen(true); }} className="flex-[3] bg-slate-900 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                <EditIcon sx={{ fontSize: 14 }} /> Edit
                            </button>
                            <button onClick={() => handleDelete(c.id, c.counter_name)} className="flex-1 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors">
                                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CounterModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refresh={fetchData} 
                editingCounter={selectedCounter} 
                services={services}
            />
        </div>
    );
};

export default AdminCounters;