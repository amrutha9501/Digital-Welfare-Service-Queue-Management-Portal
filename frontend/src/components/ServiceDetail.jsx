import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PriorityModal from "./PriorityModal";

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasActiveToken, setHasActiveToken] = useState(false);

    useEffect(() => {
        const load = async () => {
            const uid = localStorage.getItem("userId");
            const [sRes, tRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/services/${id}`),
                uid ? axios.get(`http://localhost:5000/api/tokens/user/${uid}`) : { data: [] }
            ]);

            setService(sRes.data);

            // GLOBAL CHECK: If user has ANY token that is 'waiting' or 'serving', disable button
            const isBlocked = tRes.data.some(t => ['waiting', 'serving'].includes(t.status));
            setHasActiveToken(isBlocked);

            setLoading(false);
        };
        load();
    }, [id]);

    // Minimal Button Logic
    const canGenerate = service?.is_active && !hasActiveToken;

    const handleConfirmToken = async (priority) => {
        const actualUserId = localStorage.getItem("userId");
        if (!actualUserId) {
            alert("Please login again.");
            return navigate("/login");
        }

        try {
            const res = await axios.post("http://localhost:5000/api/tokens/generate", {
                service_id: id,
                user_id: actualUserId,
                priority: priority
            });

            alert(`Token ${res.data.tokenDisplay} successfully booked!`);
            setHasActiveToken(true); // Disable button immediately
            navigate("/services/live-status");
        } catch (err) {
            alert(err.response?.data?.message || "Generation failed");
        } finally {
            setIsModalOpen(false);
        }
    };

    if (loading || !service) return <div className="p-20 text-center font-bold">Loading...</div>;

    const isActive = service.is_active === 1;


    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">

                {/* Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-xs font-bold text-slate-400 hover:text-[#1B365D] transition-colors uppercase tracking-widest"
                >
                    ← Back to Catalog
                </button>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* Top Branding Section */}
                    <div className="bg-[#1B365D] p-10 text-center text-white">
                        <span className="text-5xl mb-4 block">{service.icon}</span>
                        <h1 className="text-3xl font-black tracking-tight uppercase">
                            {service.name}
                        </h1>
                        <p className="text-blue-200 text-[10px] mt-2 font-bold opacity-80 uppercase tracking-[0.2em]">
                            Official Departmental Service
                        </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 border-b border-slate-100">
                        <div className="p-6 text-center border-r border-slate-100 bg-slate-50/30">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Wait</p>
                            <p className="text-2xl font-black text-[#1B365D]">{service.avg_time_per_token || '10m'}</p>
                        </div>
                        <div className="p-6 text-center bg-slate-50/30">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <p
                                className={`text-2xl font-black uppercase ${isActive ? "text-emerald-500" : "text-red-500"
                                    }`}
                            >
                                {isActive ? "Active" : "Inactive"}
                            </p>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Document Checklist */}
                        <div className="mb-8">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                                📂 Required Documents
                            </h3>
                            <ul className="space-y-4">
                                {/* ✅ SAFETY CHECK: If documents is a string, split it; if array, map it */}
                                {(Array.isArray(service.documents) ? service.documents : service.documents?.split(',') || []).map((doc, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                                        <span className="shrink-0 w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-emerald-100">
                                            ✓
                                        </span>
                                        {doc.trim()}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Warning Notice */}
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-xl">
                            <p className="text-[11px] text-amber-800 leading-relaxed font-bold uppercase tracking-tight">
                                Notice: Original documents required. Missing items will lead to token cancellation.
                            </p>
                        </div>

                        <button
                            disabled={!canGenerate}
                            onClick={() => setIsModalOpen(true)}
                            className={`w-full p-5 rounded-2xl font-bold uppercase transition-all ${canGenerate ? 'bg-emerald-500 hover:bg-[#05895d] text-white' : 'bg-slate-200 text-slate-400'}`}
                        >
                            {!service?.is_active ? "Offline" : hasActiveToken ? "You have an active token" : "Generate Token"}
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    Digital Krama • Government of India
                </p>
            </div>
            <PriorityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmToken}
            />
        </div>
    );
};

export default ServiceDetail;