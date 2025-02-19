import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/auth';
import { useGameStore } from '../../store/games';
import { DollarSign, Bell } from 'lucide-react';
import { MdSportsSoccer as Football, MdSportsBasketball as Basketball, MdSportsBaseball as Baseball } from "react-icons/md";
import type { Game, Bet } from '../types';

type PendingBet = {
  gameId: string;
  type: 'Juego' | 'MT' | '1/4' | '5to';
  selection: Bet['selection'];
  amount: number;
  odds: number;
};

export default function PlayerGames() {
  const { user } = useAuthStore();
  const { games, bets, placeBet } = useGameStore();
  const [selectedSport, setSelectedSport] = useState<Game['sport'] | 'all'>('all');
  const [pendingBets, setPendingBets] = useState<PendingBet[]>([]);
  const [lastGameCount, setLastGameCount] = useState(games.length);
  const [newGamesCount, setNewGamesCount] = useState(0);
  const [showNewGamesNotification, setShowNewGamesNotification] = useState(false);

  const userBets = bets.filter(bet => bet.userId === user?.email);

  const checkForNewGames = useCallback(() => {
    const currentGameCount = games.length;
    if (currentGameCount > lastGameCount) {
      const newCount = currentGameCount - lastGameCount;
      setNewGamesCount(newCount);
      setShowNewGamesNotification(true);
    }
  }, [games.length, lastGameCount]);

  useEffect(() => {
    const interval = setInterval(checkForNewGames, 5000);
    return () => clearInterval(interval);
  }, [checkForNewGames]);

  const handleViewNewGames = () => {
    setLastGameCount(games.length);
    setShowNewGamesNotification(false);
    setNewGamesCount(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredGames = games.filter(game => 
    selectedSport === 'all' || game.sport === selectedSport
  );

  const addToPendingBets = (bet: Omit<PendingBet, 'amount'>, amount: number) => {
    if (amount <= 0) return;
    
    setPendingBets(current => {
      const existingBetIndex = current.findIndex(
        b => b.gameId === bet.gameId && b.type === bet.type
      );

      if (existingBetIndex >= 0) {
        const newBets = [...current];
        newBets[existingBetIndex] = { ...bet, amount };
        return newBets;
      }
      return [...current, { ...bet, amount }];
    });
  };

  const removePendingBet = (gameId: string, type: string) => {
    setPendingBets(current => 
      current.filter(bet => !(bet.gameId === gameId && bet.type === type))
    );
  };

  const submitAllBets = () => {
    pendingBets.forEach(bet => {
      placeBet({
        gameId: bet.gameId,
        userId: user!.email,
        type: bet.type,
        selection: bet.selection,
        amount: bet.amount,
        odds: bet.odds
      });
    });
    setPendingBets([]);
  };

  const getTotalAmount = () => {
    return pendingBets.reduce((sum, bet) => sum + bet.amount, 0);
  };

  const getPotentialWinnings = () => {
    return pendingBets.reduce((sum, bet) => sum + (bet.amount * bet.odds), 0);
  };

  const getGameBetStatus = (gameId: string) => {
    const gameBet = userBets.find(bet => bet.gameId === gameId);
    return gameBet?.status;
  };

  const renderGameSection = (game: Game, type: PendingBet['type'], label: string) => {
    const pendingBet = pendingBets.find(bet => bet.gameId === game.id && bet.type === type);
    const betStatus = getGameBetStatus(game.id);

    if (betStatus) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {game.sport}
            </span>
            <span className="text-sm font-medium">{label}</span>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(game.date).toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <p className="font-medium">{game.homeTeam}</p>
            <p className="text-gray-500">Home ({game.odds.fullGame.odds})</p>
          </div>
          <div className="text-sm text-right">
            <p className="font-medium">{game.awayTeam}</p>
            <p className="text-gray-500">Away ({game.odds.fullGame.odds})</p>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <p>Alta/Baja: {game.odds.fullGame.overUnderValue}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            onChange={(e) => {
              const [selection, odds] = e.target.value.split('|');
              addToPendingBets({
                gameId: game.id,
                type,
                selection: selection as Bet['selection'],
                odds: parseFloat(odds)
              }, pendingBet?.amount || 10);
            }}
            value={pendingBet ? `${pendingBet.selection}|${pendingBet.odds}` : ""}
            className="w-full text-sm border-gray-300 rounded-md"
          >
            <option value="">Select bet...</option>
            <option value={`home|${game.odds.fullGame.odds}`}>
              {game.homeTeam} ({game.odds.fullGame.odds})
            </option>
            <option value={`away|${game.odds.fullGame.odds}`}>
              {game.awayTeam} ({game.odds.fullGame.odds})
            </option>
            <option value={`over/under|${game.odds.fullGame.odds}`}>
              Over/Under {game.odds.fullGame.overUnderValue}
            </option>
          </select>

          {pendingBet && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={pendingBet.amount}
                onChange={(e) => {
                  const amount = parseInt(e.target.value);
                  if (!isNaN(amount)) {
                    addToPendingBets({
                      gameId: game.id,
                      type,
                      selection: pendingBet.selection,
                      odds: pendingBet.odds
                    }, amount);
                  }
                }}
                className="w-full text-sm border-gray-300 rounded-md"
                placeholder="Amount"
              />
              <button
                onClick={() => removePendingBet(game.id, type)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* New Games Notification */}
      {showNewGamesNotification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <Bell className="h-5 w-5" />
            <span>{newGamesCount} new games available!</span>
            <button
              onClick={handleViewNewGames}
              className="ml-4 px-3 py-1 bg-white text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-50"
            >
              View Now
            </button>
          </div>
        </div>
      )}

      {/* Sport Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-4 py-2 rounded-md flex items-center ${
              selectedSport === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Sports
          </button>
          <button
            onClick={() => setSelectedSport('football')}
            className={`px-4 py-2 rounded-md flex items-center ${
              selectedSport === 'football'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Football className="h-4 w-4 mr-2" />
            Football
          </button>
          <button
            onClick={() => setSelectedSport('baseball')}
            className={`px-4 py-2 rounded-md flex items-center ${
              selectedSport === 'baseball'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Baseball className="h-4 w-4 mr-2" />
            Baseball
          </button>
          <button
            onClick={() => setSelectedSport('basketball')}
            className={`px-4 py-2 rounded-md flex items-center ${
              selectedSport === 'basketball'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Basketball className="h-4 w-4 mr-2" />
            Basketball
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Games List */}
        <div className="lg:col-span-2">
          {filteredGames.map((game) => {
            const betStatus = getGameBetStatus(game.id);
            const isNewGame = games.indexOf(game) >= lastGameCount;

            if (betStatus) {
              return (
                <div key={game.id} className={`bg-white rounded-lg p-4 mb-4 border-l-4 ${
                  betStatus === 'won' ? 'border-green-500' :
                  betStatus === 'lost' ? 'border-red-500' :
                  'border-yellow-500'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {game.sport}
                      </span>
                      <h3 className="mt-2 font-medium">{game.homeTeam} vs {game.awayTeam}</h3>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      betStatus === 'won' ? 'bg-green-100 text-green-800' :
                      betStatus === 'lost' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {betStatus.toUpperCase()}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={game.id}>
                {game.sport === 'basketball' && (
                  <>
                    {renderGameSection(game, 'Juego', 'Juego')}
                    {renderGameSection(game, 'MT', 'Medio Tiempo')}
                    {renderGameSection(game, '1/4', '1Q')}
                  </>
                )}
                {game.sport === 'baseball' && (
                  <>
                    {renderGameSection(game, 'Juego', 'Juego')}
                    {renderGameSection(game, '5to', '5to')}
                  </>
                )}
                {game.sport === 'football' && (
                  <>
                    {renderGameSection(game, 'Juego', 'Juego')}
                    {renderGameSection(game, 'MT', 'Medio Tiempo')}
                  </>
                )}
              </div>
            );
          })}

          {filteredGames.length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg">
              <p className="text-gray-500">No games available for the selected sport.</p>
            </div>
          )}
        </div>

        {/* Betting Slip */}
        {pendingBets.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Betting Slip</h2>
              <div className="space-y-4">
                {pendingBets.map((bet) => {
                  const game = games.find(g => g.id === bet.gameId);
                  if (!game) return null;

                  return (
                    <div key={`${bet.gameId}-${bet.type}`} className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{game.homeTeam} vs {game.awayTeam}</p>
                          <p className="text-sm text-gray-500">
                            {bet.selection} ({bet.odds})
                          </p>
                        </div>
                        <button
                          onClick={() => removePendingBet(bet.gameId, bet.type)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-2">
                        <input
                          type="number"
                          min="1"
                          value={bet.amount}
                          onChange={(e) => {
                            const amount = parseInt(e.target.value);
                            if (!isNaN(amount)) {
                              addToPendingBets({
                                gameId: bet.gameId,
                                type: bet.type,
                                selection: bet.selection,
                                odds: bet.odds
                              }, amount);
                            }
                          }}
                          className="w-full text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Total Stake:</span>
                    <span className="font-medium">${getTotalAmount()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Potential Winnings:</span>
                    <span className="font-medium text-green-600">
                      ${getPotentialWinnings().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={submitAllBets}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Place All Bets
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}