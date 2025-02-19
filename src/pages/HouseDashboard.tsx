import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useGameStore } from '../store/games';
import { sportsApi, type ApiGame } from '../services/sportsApi';
import { 
  LogOut, 
  Plus, 
  TrendingUp, 
  Timer, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Users,
  DollarSign,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { MdSportsSoccer as Football, MdSportsBasketball as Basketball, MdSportsBaseball as Baseball } from "react-icons/md";
import type { Game, League, BasketballOdds, BaseballOdds, FootballOdds } from '../types';
import OddsForm from '../components/OddsForm';

export default function HouseDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isSubscriptionExpiringSoon } = useAuthStore();
  const { addGame, games, getMostBetGames } = useGameStore();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [apiGames, setApiGames] = useState<ApiGame[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<ApiGame | null>(null);
  const [showOddsForm, setShowOddsForm] = useState(false);
  const [lastGameCount, setLastGameCount] = useState(games.length);
  const [newGamesCount, setNewGamesCount] = useState(0);
  const [showNewGamesNotification, setShowNewGamesNotification] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaguesData, gamesData] = await Promise.all([
          sportsApi.getLeagues(),
          sportsApi.getGames(selectedSport, selectedLeague || undefined),
        ]);
        
        setLeagues(leaguesData);
        setApiGames(gamesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSport, selectedLeague]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOddsSubmit = (odds: BasketballOdds | BaseballOdds | FootballOdds) => {
    if (!selectedGame) return;

    const newGame: Omit<Game, 'id'> = {
      sport: selectedGame.sport,
      homeTeam: selectedGame.homeTeam,
      awayTeam: selectedGame.awayTeam,
      date: selectedGame.startTime,
      status: 'upcoming',
      odds
    };

    addGame(newGame);
    setSelectedGame(null);
    setShowOddsForm(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Timer className="h-4 w-4 text-blue-500" />;
      case 'live':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'finished':
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const sportGroups = leagues.reduce((acc: { [key: string]: League[] }, league) => {
    if (!acc[league.sport]) {
      acc[league.sport] = [];
    }
    acc[league.sport].push(league);
    return acc;
  }, {});

  const mostBetGames = getMostBetGames().slice(0, 5);
  
  // Calculate days until subscription expires
  const getDaysUntilExpiration = () => {
    if (!user?.subscriptionExpiresAt) return 0;
    const expirationDate = new Date(user.subscriptionExpiresAt);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Subscription Warning Banner */}
      {user && isSubscriptionExpiringSoon(user) && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                <p className="text-yellow-700">
                  <span className="font-medium">Subscription Notice:</span>
                  {' '}Your subscription will expire in {getDaysUntilExpiration()} days.
                </p>
              </div>
              <Link
                to="/admin"
                className="ml-6 font-medium text-yellow-600 hover:text-yellow-500"
              >
                Contact Admin <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}

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
              <div className="mr-4 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Expires: {new Date(user?.subscriptionExpiresAt || '').toLocaleDateString()}
              </div>
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Sports & Leagues</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setSelectedSport(null);
                      setSelectedLeague(null);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      !selectedSport
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Sports
                  </button>
                  {Object.entries(sportGroups).map(([sport, sportLeagues]) => (
                    <div key={sport} className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedSport(sport);
                          setSelectedLeague(null);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          selectedSport === sport && !selectedLeague
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {getSportIcon(sport)}
                        <span className="ml-2 capitalize">{sport}</span>
                      </button>
                      {selectedSport === sport && (
                        <div className="ml-6 space-y-2">
                          {sportLeagues.map((league) => (
                            <button
                              key={league.id}
                              onClick={() => setSelectedLeague(league.id)}
                              className={`w-full text-left px-4 py-2 rounded-md ${
                                selectedLeague === league.id
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {league.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-indigo-500 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Most Bet Games Today</h2>
                  </div>
                  <Link
                    to="/house/most-bet-games"
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {mostBetGames.map(({ game, stats }) => (
                    <div key={game.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center text-sm font-medium text-gray-600">
                          {getSportIcon(game.sport)}
                          <span className="ml-2 capitalize">{game.sport}</span>
                        </span>
                        <span className="text-sm font-medium text-indigo-600">
                          {stats.totalBets} bets
                        </span>
                      </div>
                      <p className="font-medium">{game.homeTeam} vs {game.awayTeam}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Total Wagered</p>
                          <p className="font-medium">${stats.totalAmount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">House Profit</p>
                          <p className={`font-medium ${
                            stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${stats.netProfit.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {mostBetGames.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No bets placed today</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {showOddsForm && selectedGame ? (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        Set Odds for {selectedGame.homeTeam} vs {selectedGame.awayTeam}
                      </h2>
                      <button
                        onClick={() => {
                          setSelectedGame(null);
                          setShowOddsForm(false);
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        ×
                      </button>
                    </div>
                    <OddsForm
                      sport={selectedGame.sport}
                      onSubmit={handleOddsSubmit}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Available Games
                    </h2>
                    
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading games...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {apiGames.map((game) => {
                          const isAdded = games.some(g => 
                            g.homeTeam === game.homeTeam && 
                            g.awayTeam === game.awayTeam &&
                            new Date(g.date).toDateString() === new Date(game.startTime).toDateString()
                          );

                          return (
                            <div
                              key={game.id}
                              className="border rounded-lg p-4 space-y-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    {getSportIcon(game.sport)}
                                    <span className="text-sm font-medium text-gray-600">
                                      {game.league.toUpperCase()}
                                    </span>
                                    {getStatusIcon(game.status)}
                                  </div>
                                  <p className="font-medium">
                                    {game.homeTeam} vs {game.awayTeam}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(game.startTime).toLocaleString()}
                                  </p>
                                </div>
                                {!isAdded && game.status === 'scheduled' && (
                                  <button
                                    onClick={() => {
                                      setSelectedGame(game);
                                      setShowOddsForm(true);
                                    }}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Set Odds
                                  </button>
                                )}
                              </div>

                              {game.status !== 'scheduled' && game.score && (
                                <div className="border-t pt-4">
                                  <p className="text-sm font-medium mb-2">
                                    Current Score: {game.score.home} - {game.score.away}
                                  </p>
                                  {game.score.periods && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                      {game.score.periods.map((period) => (
                                        <div key={period.period} className="text-sm bg-gray-50 p-2 rounded">
                                          <p className="font-medium">{period.period}</p>
                                          <p className="text-gray-600">
                                            {period.home} - {period.away}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {apiGames.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No games available for the selected filters.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}