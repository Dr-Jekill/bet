export interface User {
  email: string;
  password: string;
  role: 'admin' | 'house' | 'player';
  name: string;
  createdAt: string;
  balance?: number;
  houseId?: string;
  subscriptionPaid?: boolean;
  subscriptionExpiresAt?: string; // New field
}

export interface Game {
  id: string;
  sport: 'basketball' | 'baseball' | 'football';
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: 'upcoming' | 'live' | 'finished';
  odds: BasketballOdds | BaseballOdds | FootballOdds;
  houseId: string;
}

export interface League {
  id: string;
  name: string;
  sport: 'basketball' | 'baseball' | 'football';
}

export interface SportEvent {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  sport: 'basketball' | 'baseball' | 'football';
  league: string;
  status: 'scheduled' | 'live' | 'finished';
}

export interface PeriodOdds {
  team: 'home' | 'away';
  odds: number;
  overUnderValue: number;
}

export interface BasketballOdds {
  fullGame: PeriodOdds;
  firstHalf: PeriodOdds;
  firstQuarter: PeriodOdds;
}

export interface BaseballOdds {
  fullGame: PeriodOdds;
  fifthInning: PeriodOdds;
}

export interface FootballOdds {
  fullGame: PeriodOdds;
  firstHalf: PeriodOdds;
}

export interface Bet {
  id: string;
  gameId: string;
  userId: string;
  houseId: string;
  type: 'Juego' | 'MT' | '1/4' | '5to';
  selection: 'home' | 'away' | 'over' | 'under';
  amount: number;
  odds: number;
  status: 'pending' | 'won' | 'lost' | 'draw';
  createdAt: string;
  settledAt?: string;
}

export interface Revenue {
  id: string;
  houseId: string;
  amount: number;
  date: string;
  type: 'win' | 'loss';
}