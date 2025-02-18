import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Game, Bet, Revenue } from '../types';
import { useAuthStore } from './auth';

interface GameState {
  games: Game[];
  bets: Bet[];
  revenues: Revenue[];
  addGame: (game: Omit<Game, 'id'>) => void;
  placeBet: (bet: Omit<Bet, 'id' | 'createdAt' | 'status' | 'houseId'>) => void;
  getGamesByHouse: (houseId: string) => Game[];
  getBetsByHouse: (houseId: string) => Bet[];
  getBetsByUser: (userId: string) => Bet[];
  getRevenueByHouse: (houseId: string, period: 'daily' | 'weekly' | 'monthly') => number;
  getMostBetGames: () => {
    game: Game;
    stats: {
      totalBets: number;
      totalAmount: number;
      totalWon: number;
      totalLost: number;
      netProfit: number;
    };
  }[];
}

const simulateBetOutcome = () => {
  return Math.random() > 0.5 ? 'won' : 'lost';
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      games: [],
      bets: [],
      revenues: [],
      addGame: (gameData) => {
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.role !== 'house') return;

        const newGame: Game = {
          ...gameData,
          id: Math.random().toString(36).substr(2, 9),
          houseId: currentUser.email
        };

        set((state) => ({
          games: [...state.games, newGame],
        }));
      },
      placeBet: (betData) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser || currentUser.role !== 'player') return;

        const game = get().games.find(g => g.id === betData.gameId);
        if (!game) return;

        const outcome = simulateBetOutcome();
        const newBet: Bet = {
          ...betData,
          id: Math.random().toString(36).substr(2, 9),
          houseId: game.houseId,
          status: outcome,
          createdAt: new Date().toISOString(),
          settledAt: new Date().toISOString()
        };

        // Update player balance
        const winAmount = outcome === 'won' ? betData.amount * betData.odds : -betData.amount;
        useAuthStore.getState().updateUser(currentUser.email, {
          balance: (currentUser.balance || 0) + winAmount
        });

        // Record revenue
        const revenue: Revenue = {
          id: Math.random().toString(36).substr(2, 9),
          houseId: game.houseId,
          amount: -winAmount, // House wins when player loses
          date: new Date().toISOString(),
          type: outcome === 'won' ? 'loss' : 'win'
        };

        set((state) => ({
          bets: [...state.bets, newBet],
          revenues: [...state.revenues, revenue]
        }));
      },
      getGamesByHouse: (houseId) => {
        return get().games.filter(game => game.houseId === houseId);
      },
      getBetsByHouse: (houseId) => {
        return get().bets.filter(bet => bet.houseId === houseId);
      },
      getBetsByUser: (userId) => {
        return get().bets.filter(bet => bet.userId === userId);
      },
      getRevenueByHouse: (houseId, period) => {
        const now = new Date();
        const revenues = get().revenues.filter(rev => {
          const revDate = new Date(rev.date);
          if (period === 'daily') {
            return rev.houseId === houseId && 
                   revDate.toDateString() === now.toDateString();
          } else if (period === 'weekly') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return rev.houseId === houseId && revDate >= weekAgo;
          } else {
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return rev.houseId === houseId && revDate >= monthAgo;
          }
        });

        return revenues.reduce((sum, rev) => sum + rev.amount, 0);
      },
      getMostBetGames: () => {
        const { games, bets } = get();
        const today = new Date().toDateString();
        const todayBets = bets.filter(bet => 
          new Date(bet.createdAt).toDateString() === today
        );

        // Group bets by game
        const gameStats = todayBets.reduce((acc, bet) => {
          if (!acc[bet.gameId]) {
            acc[bet.gameId] = {
              totalBets: 0,
              totalAmount: 0,
              totalWon: 0,
              totalLost: 0,
              netProfit: 0
            };
          }

          acc[bet.gameId].totalBets++;
          acc[bet.gameId].totalAmount += bet.amount;

          if (bet.status === 'won') {
            const winAmount = bet.amount * bet.odds;
            acc[bet.gameId].totalWon += winAmount;
            acc[bet.gameId].netProfit -= (winAmount - bet.amount);
          } else {
            acc[bet.gameId].totalLost += bet.amount;
            acc[bet.gameId].netProfit += bet.amount;
          }

          return acc;
        }, {} as Record<string, {
          totalBets: number;
          totalAmount: number;
          totalWon: number;
          totalLost: number;
          netProfit: number;
        }>);

        // Convert to array and sort by total bets
        return Object.entries(gameStats)
          .map(([gameId, stats]) => ({
            game: games.find(g => g.id === gameId)!,
            stats
          }))
          .filter(item => item.game) // Ensure game exists
          .sort((a, b) => b.stats.totalBets - a.stats.totalBets);
      }
    }),
    {
      name: 'game-storage',
    }
  )
);