import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  // Protection Layer
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="animate-in fade-in duration-500">
        {/* This renders the child route components */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;