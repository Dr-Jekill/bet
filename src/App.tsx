import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import HouseDashboard from './pages/HouseDashboard';
import PlayerDashboard from './pages/PlayerDashboard';
import MostBetGames from './pages/house/MostBetGames';
import Bets from './pages/house/Bets';
import Players from './pages/house/Players';
import MaintenancePage from './pages/MaintenancePage';

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isSubscriptionExpired, users } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // Check if house subscription is expired
  if (user.role === 'house' && isSubscriptionExpired(user)) {
    return <MaintenancePage type="house" />;
  }

  // Check if player's house subscription is expired
  if (user.role === 'player' && user.houseId) {
    const house = users.find(u => u.email === user.houseId);
    if (house && isSubscriptionExpired(house)) {
      return <MaintenancePage type="player" houseName={house.name} />;
    }
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
          path="/house/bets"
          element={
            <ProtectedRoute allowedRoles={['house']}>
              <Bets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/house/players"
          element={
            <ProtectedRoute allowedRoles={['house']}>
              <Players />
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