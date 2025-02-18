import React from 'react';
import {
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { LogOut, Wallet, History } from 'lucide-react';
import PlayerGames from './player/PlayerGames';
import PlayerBets from './player/PlayerBets';

export default function PlayerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">
                Player Dashboard
              </h1>
              <div className="flex space-x-4">
                <Link
                  to="/player"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/player'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Games
                </Link>
                <Link
                  to="/player/bets"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/player/bets'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <History className="h-4 w-4 mr-2" />
                  My Bets
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Balance:</span>
                <span className="ml-2 font-semibold text-green-600">
                  ${user?.balance}
                </span>
              </div>
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<PlayerGames />} />
          <Route path="/bets" element={<PlayerBets />} />
        </Routes>
      </main>
    </div>
  );
}
