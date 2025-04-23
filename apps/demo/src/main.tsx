import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Transformer from './components/transformer/Transformer';
import TransformPage from './pages/TransformPage';
//import Callback from './components/callback'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/transformer" element={<TransformPage />} />
      <Route path="/transformer/:fromType/to/:toType" element={<Transformer />} />
    </Routes>
  </BrowserRouter>
);
