import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth';
import { useGameStore } from '../../store/games';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LogOut,
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Activity,
  Users,
  UserPlus
} from 'lucide-react';

export default function Bets() {
  const navigate = useLocation();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { getBetsByUser, games } = useGameStore();
  const { getUsersByHouse } = useAuthStore();
  const [expandedPlayers, setExpandedPlayers] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState({
    email: '',
    password: '',
    name: '',
  });

  const [showAddPlayer, setShowAddPlayer] = useState(false);

  const players = getUsersByHouse(user?.email || '');

  const togglePlayer = (playerId: string) => {
    setExpandedPlayers(current => 
      current.includes(playerId)
        ? current.filter(id => id !== playerId)
        : [...current, playerId]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      ...newPlayer,
      role: 'player',
    });
    setNewPlayer({
      email: '',
      password: '',
      name: '',
    });
    setShowAddPlayer(false);
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
                    location.pathname === '/house/bets'
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Player Management</h2>
                    <button
                      onClick={() => setShowAddPlayer(true)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Player
                    </button>
                  </div>

                  {showAddPlayer && (
                    <form onSubmit={handleAddPlayer} className="mb-6 p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            value={newPlayer.email}
                            onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Password</label>
                          <input
                            type="password"
                            value={newPlayer.password}
                            onChange={(e) => setNewPlayer({ ...newPlayer, password: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowAddPlayer(false)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Add Player
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                        <h3 className="text-sm font-medium text-green-800">Today's Winnings</h3>
                      </div>
                      <p className="mt-2 text-2xl font-semibold text-green-900">
                        $1,234.56
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                        <h3 className="text-sm font-medium text-red-800">Today's Losses</h3>
                      </div>
                      <p className="mt-2 text-2xl font-semibold text-red-900">
                        $567.89
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Players Bets</h2>
                    <div className="space-y-4">
                      {players.map((player) => {
                        const playerBets = getBetsByUser(player.email);
                        const todayBets = playerBets.filter(
                          bet => new Date(bet.createdAt).toDateString() === new Date().toDateString()
                        );
                        const wonBets = todayBets.filter(bet => bet.status === 'won');
                        const lostBets = todayBets.filter(bet => bet.status === 'lost');
                        const isExpanded = expandedPlayers.includes(player.email);

                        const totalWon = wonBets.reduce((sum, bet) => sum + (bet.amount * bet.odds), 0);
                        const totalLost = lostBets.reduce((sum, bet) => sum + bet.amount, 0);
                        const netResult = totalWon - totalLost;

                        return (
                          <div key={player.email} className="border rounded-lg">
                            <button
                              onClick={() => togglePlayer(player.email)}
                              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                            >
                              <div className="flex items-center space-x-4">
                                {isExpanded ? (
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-gray-400" />
                                )}
                                <div className="text-left">
                                  <h3 className="text-lg font-medium text-gray-900">{player.name}</h3>
                                  <p className="text-sm text-gray-500">{player.email}</p>
                                </div>
                              </div>
                              {!isExpanded && (
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">Today's Net Result</p>
                                  <p className={`font-medium ${
                                    netResult > 0 ? 'text-green-600' : netResult < 0 ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {netResult > 0 ? '+' : ''}{netResult.toFixed(2)}
                                  </p>
                                </div>
                              )}
                            </button>

                            {isExpanded && (
                            <div className="p-4">
                            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                              <div className="bg-gray-50 py-2 px-4 rounded-lg">
                                <p className="text-sm text-gray-600">Today's Bets</p>
                                <p className="text-lg font-medium">{todayBets.length}</p>
                              </div>
                              <div className="bg-green-50 py-2 px-4 rounded-lg">
                                <p className="text-sm text-green-600">Won</p>
                                <p className="text-lg font-medium text-green-700">{wonBets.length}</p>
                              </div>
                              <div className="bg-red-50 py-2 px-4 rounded-lg">
                                <p className="text-sm text-red-600">Lost</p>
                                <p className="text-lg font-medium text-red-700">{lostBets.length}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-900 mb-4">Today's Bets</h4>
                              <div className="grid grid-cols-2 gap-4">
                            
                                <div className="space-y-2">
                                  {wonBets.map((bet) => {
                                    const game = games.find(g => g.id === bet.gameId);
                                    if (!game) return null;

                                    return (
                                      <div
                                        key={bet.id}
                                        className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg p-3"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <CircleDot className="h-4 w-4 text-green-500" />
                                          <span className="text-sm font-medium">{game.homeTeam}</span>
                                        </div>
                                        <span className="text-sm font-medium text-green-600">+${(bet.amount * bet.odds).toFixed(2)}</span>
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="space-y-2">
                                  {lostBets.map((bet) => {
                                    const game = games.find(g => g.id === bet.gameId);
                                    if (!game) return null;

                                    return (
                                      <div
                                        key={bet.id}
                                        className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg p-3"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <CircleDot className="h-4 w-4 text-red-500" />
                                          <span className="text-sm font-medium">{game.homeTeam}</span>
                                        </div>
                                        <span className="text-sm font-medium text-red-600">-${bet.amount}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="mt-4 space-y-2">
                                  <div className="flex justify-end items-center bg-gray-50 rounded-lg px-3 py-2">
                                    <span className="text-sm text-gray-600">
                                      $6000
                                    </span>
                                  </div>
                                  <div className="flex justify-end items-center bg-gray-50 rounded-lg px-3 py-2">
                                    <span className="text-sm text-gray-600">
                                      (+2%) $350
                                    </span>
                                  </div>
                                  <div className="flex justify-end items-center bg-gray-50 rounded-lg px-3 py-2">
                                    <span className="text-sm text-gray-600">
                                      -$1500
                                    </span>
                                  </div>
                                  <div className="flex justify-end items-center bg-green-50 rounded-lg px-3 py-2">
                                    <span className="text-sm text-green-600">
                                      $5850
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                  <div className="flex  justify-end items-center bg-red-50 rounded-lg px-3 py-2">
                                    <span className="text-sm text-red-600">
                                      $1500
                                    </span>
                                  </div>
                                </div>
                              </div>


                              <div className="grid grid-cols-2 gap-4">
                                <div className="mt-4 space-y-2">
                                  <div className="flex  justify-end items-center bg-green-50 rounded-lg px-3 py-2">
                                    <span className="text-sm text-green-600">
                                      $1500
                                    </span>
                                  </div>
                                </div>

                              </div>

                            </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {players.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No players found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}