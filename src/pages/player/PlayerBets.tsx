import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth';
import { useGameStore } from '../../store/games';
import { Calendar, DollarSign } from 'lucide-react';

const groupBetsByDate = (bets: any[]) => {
  const groups: { [key: string]: any[] } = {};
  
  bets.forEach(bet => {
    const date = new Date(bet.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    const key = `${year}-${month}-${day}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(bet);
  });

  return Object.entries(groups)
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
    .map(([date, bets]) => ({
      date: new Date(date),
      bets
    }));
};

const formatBetSelection = (bet: any, game: any) => {
  const type = bet.type === 'fullGame' ? 'Full Game' : bet.type;
  const team = bet.selection === 'home' ? game.homeTeam : 
               bet.selection === 'away' ? game.awayTeam : null;
  
  if (team) {
    return `${team} (${type})`;
  } else if (bet.selection === 'over') {
    return `Over ${game.odds.fullGame.overUnder.value} (${type})`;
  } else if (bet.selection === 'under') {
    return `Under ${game.odds.fullGame.overUnder.value} (${type})`;
  }
  
  return bet.selection;
};

export default function PlayerBets() {
  const { user } = useAuthStore();
  const { bets, games } = useGameStore();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const userBets = bets.filter((bet) => bet.userId === user?.email);
  const groupedBets = groupBetsByDate(userBets);
  
  const todayBets = groupedBets.find(group => 
    group.date.toISOString().split('T')[0] === selectedDate
  )?.bets || [];

  const calculateTotals = (bets: any[]) => {
    const won = bets
      .filter((bet) => bet.status === 'won')
      .reduce((sum, bet) => sum + bet.amount * bet.odds, 0);

    const lost = bets
      .filter((bet) => bet.status === 'lost')
      .reduce((sum, bet) => sum + bet.amount, 0);

    return { won, lost, net: won - lost };
  };

  const todayTotals = calculateTotals(todayBets);

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-green-800">Today's Winnings</h3>
              <p className="mt-2 text-2xl font-semibold text-green-900">
                ${todayTotals.won.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-red-800">Today's Losses</h3>
              <p className="mt-2 text-2xl font-semibold text-red-900">
                ${todayTotals.lost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-800">
                Today's Net Profit/Loss
              </h3>
              <p
                className={`mt-2 text-2xl font-semibold ${
                  todayTotals.net > 0 ? 'text-green-900' : 'text-red-900'
                }`}
              >
                ${todayTotals.net.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bets History */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Bets History
          </h2>
          
          {groupedBets.map(({ date, bets: dateBets }) => {
            const dateStr = date.toISOString().split('T')[0];
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const totals = calculateTotals(dateBets);

            return (
              <div key={dateStr} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isToday ? 'Today' : new Date(dateStr).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <span className={`text-sm font-medium ${
                    totals.net > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Net: ${totals.net.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-4">
                  {dateBets.map((bet) => {
                    const game = games.find((g) => g.id === bet.gameId);
                    if (!game) return null;

                    return (
                      <div
                        key={bet.id}
                        className={`border rounded-lg p-4 ${
                          bet.status === 'won'
                            ? 'border-green-200 bg-green-50'
                            : bet.status === 'lost'
                            ? 'border-red-200 bg-red-50'
                            : 'border-yellow-200 bg-yellow-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {game.homeTeam} vs {game.awayTeam}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(bet.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                              bet.status === 'won'
                                ? 'bg-green-100 text-green-800'
                                : bet.status === 'lost'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {bet.status}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Bet Details</p>
                            <p className="text-sm font-medium">
                              {formatBetSelection(bet, game)} @ {bet.odds}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Amount / Potential Win
                            </p>
                            <p className="text-sm">
                              ${bet.amount} / ${(bet.amount * bet.odds).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {groupedBets.length === 0 && (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Calendar className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No bets found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't placed any bets yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}