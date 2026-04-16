import React, { useState, useEffect } from "react";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; // Added Delete Icon
import ServiceModal from "./ServiceModal";

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/services");
            setServices(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching services", err);
            setLoading(false);
        }
    };

    // --- DELETE LOGIC ---
    const handleDelete = async (id, name) => {
        if (!window.confirm(`CRITICAL: Are you sure you want to permanently delete the "${name}" service? This cannot be undone.`)) return;

        try {
            await axios.delete(`http://localhost:5000/api/services/${id}`);
            // Update state locally to avoid a full re-fetch if preferred, 
            // but fetchServices() is safer to ensure sync.
            fetchServices(); 
        } catch (err) {
            console.error("Delete error:", err);
            alert(err.response?.data?.message || "Failed to delete service. Ensure no active tokens are linked to it.");
        }
    };

    const toggleServiceStatus = async (id, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'Disable' : 'Enable'} this service?`)) return;
        try {
            await axios.put(`http://localhost:5000/api/services/toggle/${id}`, {
                is_active: !currentStatus
            });
            fetchServices();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleEditClick = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/services/${id}`);
            setSelectedService(res.data);
            setIsModalOpen(true);
        } catch (err) {
            alert("Error loading service details");
        }
    };

    const handleAddClick = () => {
        setSelectedService(null);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8 font-bold text-slate-400">Loading Krama Services...</div>;

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-[#1B365D] tracking-tight uppercase">Departmental Services</h1>
                    <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-1">Manage active departments & processing times</p>
                </div>
                <button onClick={handleAddClick} className="flex items-center gap-2 bg-[#10B981] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 hover:scale-105 transition-all">
                    <AddIcon sx={{ fontSize: 18 }} /> Add New Service
                </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className={`bg-white rounded-2xl border-2 transition-all ${service.is_active ? 'border-slate-100' : 'border-red-100 opacity-75'}`}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-3xl">{service.icon || '🏛️'}</span>
                                <div className="flex gap-2">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${service.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {service.is_active ? '● Active' : '● Maintenance'}
                                    </span>
                                    {/* Delete Button (Small/Icon only) */}
                                    <button 
                                        onClick={() => handleDelete(service.id, service.name)}
                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                        title="Delete Service"
                                    >
                                        <DeleteIcon sx={{ fontSize: 20 }} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-[#1B365D] uppercase tracking-tight">{service.name}</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Code: {service.code}</p>

                            <p className="text-slate-600 text-sm line-clamp-2 mb-6 h-10">
                                {service.description}
                            </p>

                            <div className="bg-slate-50 rounded-xl p-4 mb-6 flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Time</span>
                                <span className="text-lg font-black text-[#1B365D]">{service.avg_time_per_token} Min</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button onClick={() => handleEditClick(service.id)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                                    <EditIcon sx={{ fontSize: 16 }} /> Edit
                                </button>
                                <button
                                    onClick={() => toggleServiceStatus(service.id, service.is_active)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${service.is_active ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                >
                                    <PowerSettingsNewIcon sx={{ fontSize: 16 }} /> {service.is_active ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ServiceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                refreshData={fetchServices} 
                editingService={selectedService} 
            />
        </div>
    );
};

export default AdminServices;