import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import KanbanBoard from "./pages/Dashboard/KanbanBoard";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Homepage/Home";

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<KanbanBoard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
