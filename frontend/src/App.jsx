import { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && (location.pathname === "/" || location.pathname === "/login")) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;

