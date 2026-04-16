import React, {useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    // 1. Get the real ID from localStorage
    const userId = localStorage.getItem("userId"); 
    const isProfileActive = location.pathname.includes("/profile");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !userId) return; 

        axios.get(`http://localhost:5000/api/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUser(res.data))
        .catch(err => console.error("Header Profile Error:", err));
    }, [userId]); // Add userId to dependency array

    return (
        <header className="bg-[#1B365D] text-white shadow-md sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

                <div
                    className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
                    onClick={() => navigate("/services")}
                >
                    <div className="bg-white text-[#1B365D] w-8 h-8 rounded flex items-center justify-center font-black">
                        K
                    </div>
                    <span className="font-bold tracking-tight text-lg uppercase hidden sm:block">
                        Digital Krama
                    </span>
                </div>

                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate("/services/live-status")}
                        className="text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition"
                    >
                        Live Board
                    </button>

                    {/* 4. FIX: Use template literal for navigation too */}
                    <button
                        onClick={() => navigate(`/profile/${userId}`)}
                        className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all border-2 ${
                            isProfileActive ? "border-emerald-400 bg-emerald-500/20" : "border-transparent bg-white/10 hover:bg-white/20"
                        }`}
                    >
                        <span className="text-sm font-bold">{user?.name ? user.name.charAt(0) : "?"}</span>
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#1B365D] rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;