import React, { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useGameStore } from '../store/games';
import { LogOut, UserPlus, DollarSign, Building2, Package } from 'lucide-react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import ModuleManager from './admin/ModuleManager';

export default function AdminDashboard() {
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'house' as const,
  });
  const { user, logout, addUser, users, getUsersByRole } = useAuthStore();
  const { getRevenueByHouse } = useGameStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(newUser);
    setNewUser({
      email: '',
      password: '',
      name: '',
      role: 'house',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const houses = getUsersByRole('house');
  const players = getUsersByRole('player');
  const admins = getUsersByRole('admin');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <div className="flex space-x-4">
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/admin'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/modules"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/admin/modules'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Modules
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
        <Routes>
          <Route path="/" element={
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* New User Form */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Add New User</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'house' | 'player' })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="house">House</option>
                          <option value="player">Player</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </button>
                    </form>
                  </div>
                </div>

                {/* Houses Overview */}
                <div className="space-y-6">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Houses</h2>
                      <div className="space-y-4">
                        {houses.map((house) => (
                          <div
                            key={house.email}
                            className="border rounded-lg p-4 space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-900">{house.name}</p>
                                <p className="text-sm text-gray-500">{house.email}</p>
                              </div>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  house.subscriptionPaid
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {house.subscriptionPaid ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">Daily Revenue</p>
                                <p className="text-sm font-medium">${getRevenueByHouse(house.email, 'daily')}</p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">Weekly Revenue</p>
                                <p className="text-sm font-medium">${getRevenueByHouse(house.email, 'weekly')}</p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">Monthly Revenue</p>
                                <p className="text-sm font-medium">${getRevenueByHouse(house.email, 'monthly')}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const { updateUser } = useAuthStore.getState();
                                updateUser(house.email, {
                                  subscriptionPaid: !house.subscriptionPaid,
                                });
                              }}
                              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Toggle Subscription
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Players List */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Players</h2>
                      <div className="space-y-4">
                        {players.map((player) => {
                          const house = houses.find(h => h.email === player.houseId);
                          return (
                            <div
                              key={player.email}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-gray-900">{player.name}</p>
                                  <p className="text-sm text-gray-500">{player.email}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">Balance</p>
                                  <p className="font-medium">${player.balance}</p>
                                </div>
                              </div>
                              {house && (
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <Building2 className="h-4 w-4 mr-1" />
                                  House: {house.name}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Admins List */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Administrators</h2>
                      <div className="space-y-4">
                        {admins.map((admin) => (
                          <div
                            key={admin.email}
                            className="border rounded-lg p-4"
                          >
                            <p className="font-medium text-gray-900">{admin.name}</p>
                            <p className="text-sm text-gray-500">{admin.email}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/modules" element={<ModuleManager />} />
        </Routes>
      </main>
    </div>
  );
}