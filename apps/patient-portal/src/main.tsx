import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Callback from "./components/callback";
import Dashboard from "./components/dashboard";
import Appointment from "./pages/Appointment";
import { ToastContainer } from "react-toastify";
import ListAppointments from "./pages/ListAppointments";
//import Callback from './components/callback'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/patientAppointments" element={<ListAppointments />} />
    </Routes>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
  </BrowserRouter>
);
