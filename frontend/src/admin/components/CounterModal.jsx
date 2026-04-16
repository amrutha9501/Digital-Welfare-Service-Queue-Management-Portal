import React, { useState, useEffect } from "react";
import axios from "axios";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const CounterModal = ({ isOpen, onClose, refresh, editingCounter, services }) => {
    const [form, setForm] = useState({ name: "", is_active: true, service_ids: [] });

    useEffect(() => {
        if (isOpen) {
            setForm(editingCounter ? {
                name: editingCounter.counter_name,
                is_active: !!editingCounter.is_active,
                service_ids: form.service_ids || []
            } : { name: "", is_active: true, service_ids: [] });
        }
    }, [isOpen, editingCounter]);

    const handleSave = async () => {
        if (!form.name.trim()) return alert("Please enter a desk name.");
        try {
            const url = `http://localhost:5000/api/counters${editingCounter ? `/${editingCounter.id}` : ""}`;
            // Correctly mapping 'form.name' to 'name' as expected by the upsertCounter controller
            await axios[editingCounter ? 'put' : 'post'](url, {
                name: form.name,
                is_active: form.is_active,
                service_ids: form.service_ids || []
            });
            refresh();
            onClose();
        } catch (err) { alert("Error saving desk settings"); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
                <h2 className="text-xl font-black text-[#1B365D] uppercase mb-6">Desk Configuration</h2>

                {/* Desk Name */}
                <div className="mb-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Counter Identity</label>
                    <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:border-[#1B365D] transition-all"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Counter 01" />
                </div>

                {/* Status Toggle */}
                <div className="mb-8">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Operational Status</label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setForm({ ...form, is_active: true })}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${form.is_active ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-50 text-slate-400'}`}
                        >
                            {form.is_active ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />}
                            Active
                        </button>
                        <button
                            onClick={() => setForm({ ...form, is_active: false })}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${!form.is_active ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-50 text-slate-400'}`}
                        >
                            {!form.is_active ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />}
                            Inactive
                        </button>
                    </div>
                </div>

                {/* Service Selection */}
                <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Assign Services</p>
                <div className="space-y-2 max-h-48 overflow-y-auto mb-8 pr-2">
                    {services.map(s => (
                        <div key={s.id} onClick={() => setForm(prev => ({
                            ...prev, service_ids: prev.service_ids.includes(s.id) ? prev.service_ids.filter(id => id !== s.id) : [...prev.service_ids, s.id]
                        }))} className={`p-4 rounded-2xl border-2 transition-all flex justify-between items-center cursor-pointer ${form.service_ids.includes(s.id) ? 'border-[#1B365D] bg-[#1B365D]/5' : 'border-slate-50'}`}>
                            <span className="text-xs font-bold uppercase">{s.name}</span>
                            {form.service_ids.includes(s.id) && <div className="w-2 h-2 rounded-full bg-[#1B365D]" />}
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                    <button onClick={handleSave} className="flex-[2] bg-[#1B365D] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Apply Changes</button>
                </div>
            </div>
        </div>
    );
};

export default CounterModal;