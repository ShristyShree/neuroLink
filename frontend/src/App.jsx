import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ExpertDetails from './pages/ExpertDetails';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="expert/:id" element={<ExpertDetails />} />
        <Route path="dashboard" element={<UserDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
