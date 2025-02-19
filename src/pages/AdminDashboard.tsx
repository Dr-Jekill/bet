import React from 'react';
import { useAuthStore } from '../store/auth';
import { useGameStore } from '../store/games';
import { LogOut, Building2, Package, Users, AlertTriangle, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import ModuleManager from './admin/ModuleManager';
import AUsers from './admin/Users';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, getUsersByRole } = useAuthStore();
  const { bets, getRevenueByHouse } = useGameStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const houses = getUsersByRole('house');
  const players = getUsersByRole('player');

  // Calculate total bets for different periods
  const now = new Date();
  const todayBets = bets.filter(bet => new Date(bet.createdAt).toDateString() === now.toDateString());
  const thisMonthBets = bets.filter(bet => {
    const betDate = new Date(bet.createdAt);
    return betDate.getMonth() === now.getMonth() && betDate.getFullYear() === now.getFullYear();
  });
  const thisYearBets = bets.filter(bet => {
    const betDate = new Date(bet.createdAt);
    return betDate.getFullYear() === now.getFullYear();
  });

  // Calculate total revenue for all houses
  const calculateTotalRevenue = (period: 'daily' | 'weekly' | 'monthly') => {
    return houses.reduce((total, house) => total + getRevenueByHouse(house.email, period), 0);
  };

  // Get houses with subscription due soon (example: within next 7 days)
  const housesWithDueSoon = houses.filter(house => !house.subscriptionPaid);

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
                  to="/admin/users"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/admin/users'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users
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
            <div className="px-4 py-6 sm:px-0 space-y-6">
              {/* Subscription Alerts - Moved to top for priority */}
              {housesWithDueSoon.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-l-4 border-yellow-400 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                        <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
                        Subscription Alerts
                      </h3>
                      <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        {housesWithDueSoon.length} {housesWithDueSoon.length === 1 ? 'House' : 'Houses'} Pending Payment
                      </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {housesWithDueSoon.map(house => (
                        <div key={house.email} className="bg-white shadow rounded-lg p-4 border border-yellow-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-base font-medium text-gray-900">{house.name}</h4>
                              <p className="text-sm text-gray-500">{house.email}</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Payment Required
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <button
                              className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                              onClick={() => {
                                const { updateUser } = useAuthStore.getState();
                                updateUser(house.email, { subscriptionPaid: true });
                              }}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Mark as Paid
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Platform Overview Cards */}
                <div className="bg-gradient-to-br from-indigo-50 to-white overflow-hidden shadow-lg rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Houses</dt>
                          <dd className="text-2xl font-semibold text-indigo-600">{houses.length}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white overflow-hidden shadow-lg rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-emerald-100 rounded-lg p-3">
                        <Users className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Players</dt>
                          <dd className="text-2xl font-semibold text-emerald-600">{players.length}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bets Statistics */}
                <div className="bg-gradient-to-br from-blue-50 to-white overflow-hidden shadow-lg rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Bets Overview</h3>
                      </div>
                    </div>
                    <dl className="mt-2 space-y-3">
                      <div className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-gray-500">Today</dt>
                        <dd className="text-lg font-semibold text-blue-600">{todayBets.length}</dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-gray-500">This Month</dt>
                        <dd className="text-lg font-semibold text-blue-600">{thisMonthBets.length}</dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-gray-500">This Year</dt>
                        <dd className="text-lg font-semibold text-blue-600">{thisYearBets.length}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Revenue Overview */}
                <div className="bg-gradient-to-br from-green-50 to-white overflow-hidden shadow-lg rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
                      </div>
                    </div>
                    <dl className="mt-2 space-y-3">
                      <div className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-gray-500">Today</dt>
                        <dd className="text-lg font-semibold text-green-600">${calculateTotalRevenue('daily')}</dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-gray-500">This Week</dt>
                        <dd className="text-lg font-semibold text-green-600">${calculateTotalRevenue('weekly')}</dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-gray-500">This Month</dt>
                        <dd className="text-lg font-semibold text-green-600">${calculateTotalRevenue('monthly')}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/modules" element={<ModuleManager />} />
          <Route path="/users" element={<AUsers />} />
        </Routes>
      </main>
    </div>
  );
}