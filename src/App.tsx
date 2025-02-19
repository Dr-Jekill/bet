import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import HouseDashboard from './pages/HouseDashboard';
import PlayerDashboard from './pages/PlayerDashboard';
import MostBetGames from './pages/house/MostBetGames';

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/house"
          element={
            <ProtectedRoute allowedRoles={['house']}>
              <HouseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/house/most-bet-games"
          element={
            <ProtectedRoute allowedRoles={['house']}>
              <MostBetGames />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/*"
          element={
            <ProtectedRoute allowedRoles={['player']}>
              <PlayerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;