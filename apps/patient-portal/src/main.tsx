import { StrictMode } from 'react';
import { createRoot, ReactDOM } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Callback from './components/callback';
import Dashboard from './components/dashboard';
import Transformer from './pages/Transformer';
//import Callback from './components/callback'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transformer/:fromType/to/:toType" element={<Transformer />} />
    </Routes>
  </BrowserRouter>
);
