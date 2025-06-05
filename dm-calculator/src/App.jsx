import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/Login";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminDashboard2 from "./Admin/AdminDashboard2";

function App() {
  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">Hello world</h1> */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* <Route path="/admin/2/dashboard" element={<AdminDashboard2 />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
