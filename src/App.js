import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import CarForm from './components/CarForm';
import CarGallery from './pages/CarGallery';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/car-form" element={<CarForm />} />
        <Route path="/car-gallery" element={<CarGallery />} />
      </Routes>
    </Router>
  );
}

export default App;