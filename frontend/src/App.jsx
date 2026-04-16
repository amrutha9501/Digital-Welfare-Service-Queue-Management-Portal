import { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import ServicesList from "./components/ServicesList";
import ViewQueues from "./components/ViewQueues";
import ServiceDetail from "./components/ServiceDetail";
import ProfilePage from "./components/ProfilePage";
import MainLayout from "./components/MainLayout";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/components/AdminDashboard";
import ManageUsers from "./admin/components/ManageUsers";
import AdminServices from "./admin/components/AdminServices";
import AdminCounters from "./admin/components/AdminCounters";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (token && (location.pathname === "/" || location.pathname === "/login")) {
      // If we are logged in but trying to see login/register pages:
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/services", { replace: true });
      }
    }
  }, [token, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route path="/services" element={<ServicesList />} />
        <Route path="/services/live-status" element={<ViewQueues />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/counters" element={<AdminCounters />} />

      </Route>
    </Routes>
  );
}

export default App;

