import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Added useParams
import axios from "axios";
import VerifiedIcon from '@mui/icons-material/Verified';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // This grabs the '7' from /profile/7
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        // Use the ID from the URL (params) to fetch the data
        axios.get(`http://localhost:5000/api/profile/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setUser(res.data))
            .catch(err => {
                console.error("Error fetching profile:", err);
                // If the user tries to access a profile they aren't authorized for
                if (err.response?.status === 401) navigate("/login");
            });
    }, [id, navigate]); // Re-run if the ID in the URL changes

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Profile...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-24 h-24 bg-[#1B365D] rounded-full flex items-center justify-center border-4 border-slate-50 shadow-lg text-white text-3xl font-bold uppercase">
                                {user.name?.charAt(0)}
                            </div>
                            <VerifiedIcon className="absolute bottom-1 right-1 bg-white rounded-full text-emerald-500" sx={{ fontSize: 30 }} />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-black text-[#1B365D] tracking-tight uppercase">
                                Welcome, {user.name}!
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-slate-500 font-bold text-[10px] tracking-widest uppercase">
                                <span className="flex items-center gap-1.5">
                                    <BadgeIcon sx={{ fontSize: 14, opacity: 0.6 }} />
                                    Aadhaar: {user.aadhaar ? `XXXX-XXXX-${user.aadhaar.slice(-4)}` : "Redacted"}
                                </span>
                                <span className="hidden md:inline opacity-30">|</span>
                                <span className="flex items-center gap-1.5">
                                    <PhoneIphoneIcon sx={{ fontSize: 14, opacity: 0.6 }} />
                                    {user.phone}
                                </span>
                            </div>
                        </div>

                        <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="px-8 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">
                            Logout System
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-slate-100 text-center">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Tokens</p>
                            <p className="text-2xl font-black text-[#1B365D]">{user.token_display ? "01" : "00"}</p>
                        </div>
                        <div className="border-y sm:border-y-0 sm:border-x border-slate-100 py-4 sm:py-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority Class</p>
                            <p className="text-2xl font-black text-[#1B365D] uppercase">{user.priority || 'None'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MEMBER SINCE</p>
                            <p className="text-xl md:text-2xl font-black text-[#1B365D]">
                                {user.created_at ? new Date(user.created_at).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TOKEN STATUS SECTION --- */}
            <div className="max-w-2xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Current Krama Status</h2>
                    {!user.token_display && <button onClick={() => navigate("/services")} className="text-[10px] font-black text-[#1B365D] hover:underline uppercase tracking-widest">+ New Token</button>}
                </div>

                {user.token_display ? (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
                        <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#1B365D]"></div>
                        <div className="p-10">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                                <div>
                                    <p className="text-[10px] font-black text-[#1B365D]/60 uppercase tracking-widest">{user.service_name}</p>
                                    <h3 className="text-5xl font-black text-[#1B365D] tracking-tighter mt-1">{user.token_display}</h3>
                                </div>
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
                                    ● {user.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-slate-50 text-center sm:text-left">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Queue Position</p>
                                    <p className="text-xl font-black text-slate-800">{user.ahead} People Ahead</p>
                                </div>
                                <div className="border-t sm:border-t-0 pt-6 sm:pt-0">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Wait Time</p>
                                    <p className="text-xl font-black text-emerald-600">{user.estimated_wait}</p>
                                </div>
                            </div>

                            <button onClick={() => navigate("/services/live-status")} className="w-full mt-8 bg-[#10B981] hover:bg-[#0da371] text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs">View Live Dashboard</button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-4">No active tokens found for today</p>
                        <button onClick={() => navigate("/services")} className="bg-[#1B365D] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Book Service Now</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;