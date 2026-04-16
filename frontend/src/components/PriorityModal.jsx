import React, { useState } from "react";

const PriorityModal = ({ isOpen, onClose, onConfirm }) => {
    const [priority, setPriority] = useState("normal");

    if (!isOpen) return null;

    const options = [
        { id: "normal", title: "Standard", desc: "Regular processing", icon: "👤" },
        { id: "senior", title: "Senior Citizen", desc: "Age 60 or above", icon: "👴" },
        { id: "disabled", title: "Specially Abled", desc: "Priority assistance", icon: "♿" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-black text-[#1B365D] uppercase tracking-tight">Applicant Profile</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Select priority status for queueing</p>
                </div>

                <div className="space-y-3 mb-8">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setPriority(opt.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                                priority === opt.id 
                                ? "border-[#10B981] bg-emerald-50" 
                                : "border-slate-50 hover:border-slate-200"
                            }`}
                        >
                            <span className="text-2xl">{opt.icon}</span>
                            <div className="text-left">
                                <p className={`text-xs font-black uppercase ${priority === opt.id ? "text-emerald-600" : "text-slate-600"}`}>
                                    {opt.title}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Cancel
                    </button>
                    <button 
                        onClick={() => onConfirm(priority)}
                        className="flex-[2] bg-[#1B365D] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100"
                    >
                        Confirm & Generate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriorityModal;