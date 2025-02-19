import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useGameStore } from '../../store/games';
import { 
  ArrowLeft, 
  TrendingUp, 
  FolderRoot as Football, 
  Baseline as Baseball, 
  ShoppingBasket as Basketball,
  LogOut,
  Activity,
  DollarSign,
  Users
} from 'lucide-react';

export default function MostBetGames() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { getMostBetGames } = useGameStore();
  const mostBetGames = getMostBetGames();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'football':
        return <Football className="h-5 w-5" />;
      case 'baseball':
        return <Baseball className="h-5 w-5" />;
      case 'basketball':
        return <Basketball className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">House Dashboard</h1>
              <div className="flex space-x-4">
                <Link
                  to="/house"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/house'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Games
                </Link>
                <Link
                  to="/house/players"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/house/players'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Players
                </Link>
                <Link
                  to="/house/bets"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/house/players/bets'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Bets
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user?.email}</span>
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

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-6 w-6 text-indigo-500 mr-2" />
                <h1 className="text-2xl font-semibold text-gray-900">
                  Most Bet Games Today
                </h1>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-600 font-medium">Total Games with Bets</p>
                  <p className="text-2xl font-bold text-indigo-900 mt-1">
                    {mostBetGames.length}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Total Bets Placed</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {mostBetGames.reduce((sum, { stats }) => sum + stats.totalBets, 0)}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Total Amount Wagered</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    ${mostBetGames.reduce((sum, { stats }) => sum + stats.totalAmount, 0)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Total House Profit</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">
                    ${mostBetGames.reduce((sum, { stats }) => sum + stats.netProfit, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Detailed Game List */}
              <div className="space-y-6">
                {mostBetGames.map(({ game, stats }) => (
                  <div key={game.id} className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {getSportIcon(game.sport)}
                        <span className="ml-2 text-lg font-medium capitalize">
                          {game.sport}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          {stats.totalBets} bets
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">
                      {game.homeTeam} vs {game.awayTeam}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Wagered</p>
                        <p className="text-lg font-semibold">${stats.totalAmount}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Won by Players</p>
                        <p className="text-lg font-semibold text-green-600">
                          ${stats.totalWon.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Lost by Players</p>
                        <p className="text-lg font-semibold text-red-600">
                          ${stats.totalLost.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">House Profit</p>
                        <p className={`text-lg font-semibold ${
                          stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${stats.netProfit.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Game Date: {new Date(game.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                {mostBetGames.length === 0 && (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Bets Today
                    </h3>
                    <p className="text-gray-500">
                      There haven't been any bets placed on games today.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}