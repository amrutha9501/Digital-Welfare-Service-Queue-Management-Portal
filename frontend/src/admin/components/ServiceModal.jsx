import React, { useState, useEffect } from "react";
import axios from "axios";

const ServiceModal = ({ isOpen, onClose, refreshData, editingService }) => {
    const initialState = {
        name: "",
        code: "",
        description: "",
        icon: "🏛️",
        avg_time: 15,
        documents: []
    };

    const [formData, setFormData] = useState(initialState);
    const [newDoc, setNewDoc] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (editingService) {
                setFormData({
                    name: editingService.name || "",
                    code: editingService.code || "",
                    description: editingService.description || "",
                    icon: editingService.icon || "🏛️",
                    // Map the DB column name 'avg_time_per_token' to the state name 'avg_time'
                    avg_time: editingService.avg_time_per_token || 15,
                    documents: editingService.documents || []
                });
            } else {
                setFormData(initialState);
            }
        }
    }, [isOpen, editingService]);

    const handleSave = async () => {
        try {
            // Log here instead of in the render body
            console.log("Sending Data:", formData);

            if (editingService?.id) {
                await axios.put(`http://localhost:5000/api/services/${editingService.id}`, formData);
            } else {
                await axios.post("http://localhost:5000/api/services", formData);
            }
            refreshData();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error saving service: " + (err.response?.data?.message || "Internal Server Error"));
        }
    };

    const addDocument = () => {
        if (!newDoc.trim()) return;
        setFormData(prev => ({ ...prev, documents: [...prev.documents, newDoc.trim()] }));
        setNewDoc("");
    };

    const removeDocument = (index) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="p-8 flex justify-between items-center border-b border-slate-50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                        {editingService ? "Edit Department" : "Add Department"}
                    </h2>
                    <button onClick={onClose} className="text-2xl text-slate-300 hover:text-slate-600">&times;</button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Name</label>
                            <input
                                className="w-full bg-slate-50 rounded-xl p-4 text-sm font-bold outline-none ring-1 ring-slate-100 focus:ring-slate-300"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Code</label>
                            <input
                                className="w-full bg-slate-50 rounded-xl p-4 text-sm font-bold outline-none ring-1 ring-slate-100 focus:ring-slate-300"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Icon (Emoji)</label>
                            <input
                                className="w-full bg-slate-50 rounded-xl p-4 text-sm font-bold outline-none ring-1 ring-slate-100 focus:ring-slate-300"
                                value={formData.icon}
                                placeholder="e.g. 🏛️"
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            />
                        </div>

                        {/* NEW: Time Input */}
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Processing Time (Min)</label>
                            <input
                                type="number"
                                className="w-full bg-slate-50 rounded-xl p-4 text-sm font-bold outline-none ring-1 ring-slate-100 focus:ring-slate-300"
                                value={formData.avg_time}
                                onChange={(e) => setFormData({ ...formData, avg_time: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Description</label>
                            <textarea
                                className="w-full bg-slate-50 rounded-xl p-4 text-sm outline-none ring-1 ring-slate-100 h-24 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">Required Documents</label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    className="flex-1 bg-slate-50 rounded-xl p-3 text-xs outline-none ring-1 ring-slate-100"
                                    placeholder="Enter document name..."
                                    value={newDoc}
                                    onChange={(e) => setNewDoc(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                                />
                                <button type="button" onClick={addDocument} className="bg-slate-800 text-white px-4 rounded-xl">+</button>
                            </div>
                            <div className="space-y-2">
                                {formData.documents?.map((doc, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 px-4 rounded-xl">
                                        <span className="text-xs font-bold text-slate-600">{doc}</span>
                                        <button onClick={() => removeDocument(idx)} className="text-red-400 hover:text-red-600">&times;</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 flex gap-4 bg-slate-50/50">
                    <button onClick={onClose} className="flex-1 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                    <button onClick={handleSave} className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase">
                        {editingService ? "Update Department" : "Save Department"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceModal;