import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ServicesList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetching services from the backend
    axios.get("http://localhost:5000/api/services")
      .then(res => setServices(res.data))
      .catch(err => console.error("Error fetching services:", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* Header Section */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-[#1B365D] uppercase tracking-tight">
            Select Service
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Choose the department you wish to visit today.
          </p>
        </header>

        {/* Services Grid/List */}
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/service/${service.id}`)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#1B365D] hover:shadow-lg transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-5">
                {/* Icon Container */}
                <span className="text-2xl bg-slate-50 w-14 h-14 flex items-center justify-center rounded-xl group-hover:bg-blue-50 transition-colors">
                  {service.icon}
                </span>

                <div>
                  <h3 className="font-bold text-[#1B365D] text-lg uppercase tracking-tight">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium leading-tight">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Interaction Hint */}
              <div className="text-slate-200 group-hover:text-[#1B365D] group-hover:translate-x-1 transition-all">
                <span className="text-slate-300 group-hover:text-[#1B365D] transition-colors text-xl">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Action */}
        <div className="mt-10">
          <button
            onClick={() => navigate("/services/live-status")}
            className="w-full bg-[#10B981] hover:bg-[#0da371] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            View Live Queue Status
          </button>
          <p className="text-center mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Real-time updates provided by Digital Krama
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicesList;