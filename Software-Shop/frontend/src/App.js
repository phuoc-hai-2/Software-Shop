import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// TODO: import other pages (Auth, Product, Cart, Admin, ...)

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* TODO: Add more routes */}
    </Routes>
  );
}

export default App;
