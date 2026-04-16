import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", phone: "", aadhaar: "", password: "" });

    const handleRegister = async () => {
        try {
            await axios.post("http://localhost:5000/api/register", form);
            alert("Registered successfully");
            navigate("/login"); 
        } catch (err) {
            alert(err.response?.data?.message || "Error during registration");
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
            <div className="mb-8 text-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-2 flex items-center justify-center border-2 border-white shadow-sm">
                    <span className="text-xs text-slate-500 font-bold uppercase">Gov</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1B365D]">Digital Welfare Service</h2>
                <p className="text-slate-500 text-sm">Citizen Registration Portal</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-full max-w-md">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                        <input
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D] transition"
                            placeholder="As per Aadhaar"
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                        <input
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D] transition"
                            placeholder="10-digit mobile"
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Aadhaar Number (UID)</label>
                        <input
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D] transition"
                            type="number" 
                            maxLength={12} 
                            placeholder="12-digit number"
                            onChange={(e) => { if(e.target.value.length <= 12) setForm({ ...form, aadhaar: e.target.value })}}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B365D] transition"
                            placeholder="••••••••"
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={handleRegister}
                        className="w-full bg-[#1B365D] text-white font-bold py-3 rounded-lg hover:bg-[#162d4d] active:scale-[0.98] transition-all mt-6 shadow-md"
                    >
                        Create Account
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#1B365D] font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
                    By registering, you agree to the official service terms. <br />
                    All data is encrypted as per Aadhaar security guidelines.
                </p>
            </div>

            <div className="mt-8 text-slate-400 text-xs flex gap-4">
                <span>Help Desk</span>
                <span>Privacy Policy</span>
                <span>Terms of Use</span>
            </div>
        </div>
    );

};

export default Register;