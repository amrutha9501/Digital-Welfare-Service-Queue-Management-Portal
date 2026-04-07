import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // ✅ Production Tip: Use the local state variables directly
            const res = await axios.post("http://localhost:5000/api/login", { phone, password });

            localStorage.setItem("token", res.data.token);
            navigate("/dashboard"); // ✅ Instant redirect
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
            <div className="mb-8 text-center">
                <div className="w-12 h-12 bg-[#1B365D] rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">G</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1B365D] tracking-tight">Citizen Login</h2>
                <p className="text-slate-500 text-sm">Access your welfare queue status</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-full max-w-md">
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Registered Phone</label>
                        <input
                            type="text"
                            placeholder="10-digit mobile number"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D] transition"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
                            <button className="text-xs text-[#1B365D] hover:underline font-medium">Forgot?</button>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D] transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-[#1B365D] text-white font-bold py-3 rounded-lg hover:bg-[#162d4d] active:scale-[0.98] transition-all mt-4 shadow-md"
                    >
                        Sign In
                    </button>
                </div>

                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                        New to the portal?{" "}
                        {/* ✅ Using Link prevents page reload */}
                        <Link to="/" className="text-[#1B365D] font-bold hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>
            <p className="mt-8 text-[10px] text-slate-400 text-center uppercase tracking-widest max-w-xs">
                Secure Government Gateway • OTP verification may be required for sensitive services
            </p>
        </div>
    );
};

export default Login;