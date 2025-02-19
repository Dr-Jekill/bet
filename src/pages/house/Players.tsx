import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { 
  LogOut, 
  Activity,
  Users,
  TrendingUp,
  UserPlus,
  Pencil,
  Trash2
} from 'lucide-react';

export default function Players() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, addUser, updateUser, getUsersByHouse } = useAuthStore();
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [newPlayer, setNewPlayer] = useState({
    email: '',
    password: '',
    name: '',
  });

  const players = getUsersByHouse(user?.email || '');

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

  const handleUpdatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      updateUser(editingPlayer.email, {
        name: editingPlayer.name,
        balance: editingPlayer.balance
      });
      setEditingPlayer(null);
    }
  };

  const handleDeletePlayer = (email: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      // In a real application, you would want to handle this more gracefully
      const users = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      users.state.users = users.state.users.filter((u: any) => u.email !== email);
      localStorage.setItem('auth-storage', JSON.stringify(users));
      window.location.reload(); // Refresh to update the state
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
                  to="/house/#players"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/house'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Players
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
                  to="/house/most-bet-games"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/house/most-bet-games'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Most Bet Games
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
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-indigo-500 mr-2" />
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Players Management
                  </h1>
                </div>
                <button
                  onClick={() => setShowAddPlayer(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Player
                </button>
              </div>

              {showAddPlayer && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <form onSubmit={handleAddPlayer} className="space-y-4">
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
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Add Player
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {players.map((player) => (
                  <div key={player.email} className="border rounded-lg p-4">
                    {editingPlayer?.email === player.email ? (
                      <form onSubmit={handleUpdatePlayer} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            value={editingPlayer.name}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Balance</label>
                          <input
                            type="number"
                            value={editingPlayer.balance}
                            onChange={(e) => setEditingPlayer({ ...editingPlayer, balance: parseFloat(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setEditingPlayer(null)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{player.name}</h3>
                          <p className="text-sm text-gray-500">{player.email}</p>
                          <p className="text-sm font-medium text-green-600 mt-1">
                            Balance: ${player.balance}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingPlayer(player)}
                            className="p-2 text-gray-400 hover:text-gray-500"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player.email)}
                            className="p-2 text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {players.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Players Yet
                    </h3>
                    <p className="text-gray-500">
                      Add your first player to start managing bets.
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