import { Game, SportEvent, League } from '../types';

// Simulated API response types
export interface ApiGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  sport: 'basketball' | 'baseball' | 'football';
  league: string;
  status: 'scheduled' | 'live' | 'finished';
  currentPeriod?: string;
  score?: {
    home: number;
    away: number;
    periods?: {
      period: string;
      home: number;
      away: number;
    }[];
  };
}

// Simulated leagues data
const leagues: League[] = [
  { id: 'nba', name: 'NBA', sport: 'basketball' },
  { id: 'euroleague', name: 'Euroleague', sport: 'basketball' },
  { id: 'mlb', name: 'MLB', sport: 'baseball' },
  { id: 'premier', name: 'Premier League', sport: 'football' },
  { id: 'laliga', name: 'La Liga', sport: 'football' },
];

// Simulated teams by league
const teams = {
  nba: ['Lakers', 'Celtics', 'Warriors', 'Bulls', 'Heat'],
  euroleague: ['Real Madrid', 'Barcelona', 'CSKA Moscow', 'Fenerbahce'],
  mlb: ['Yankees', 'Red Sox', 'Dodgers', 'Cubs', 'Mets'],
  premier: ['Manchester City', 'Liverpool', 'Chelsea', 'Arsenal'],
  laliga: ['Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla'],
};

// Helper function to generate random scores based on sport
const generateScore = (sport: string, status: string) => {
  if (status === 'scheduled') return undefined;

  const randomScore = () => Math.floor(Math.random() * (sport === 'basketball' ? 30 : 5));
  
  const score = {
    home: randomScore(),
    away: randomScore(),
    periods: [] as { period: string; home: number; away: number; }[]
  };

  if (sport === 'basketball') {
    score.periods = [
      { period: '1Q', home: randomScore(), away: randomScore() },
      //{ period: '2Q', home: randomScore(), away: randomScore() },
      { period: 'MT', home: score.home, away: score.away },
      //{ period: '3Q', home: randomScore(), away: randomScore() },
      { period: 'G', home: randomScore(), away: randomScore() }
    ];
  } else if (sport === 'baseball') {
    score.periods = Array.from({ length: 9 }, (_, i) => ({
      period: `${i + 1}`,
      home: randomScore(),
      away: randomScore()
    }));
    score.periods = [
      { period: '5to', home: randomScore(), away: randomScore() },
      //{ period: '2Q', home: randomScore(), away: randomScore() },
      //{ period: 'MT', home: score.home, away: score.away },
      //{ period: '3Q', home: randomScore(), away: randomScore() },
      { period: 'G', home: randomScore(), away: randomScore() }
    ];
  } else if (sport === 'football') {
    score.periods = [
      { period: 'MT', home: randomScore(), away: randomScore() },
      { period: 'G', home: score.home, away: score.away }
    ];
  }

  return score;
};

// Helper function to generate current period based on sport and status
const getCurrentPeriod = (sport: string, status: string) => {
  if (status !== 'live') return undefined;

  switch (sport) {
    case 'basketball':
      return ['1Q', 'MT', 'G'][Math.floor(Math.random() * 5)];
    case 'baseball':
      return ['MT', 'G'][Math.floor(Math.random() * 5)];
    case 'football':
      return Math.random() > 0.5 ? 'MT' : 'G';
    default:
      return undefined;
  }
};

// Simulated API endpoints
export const sportsApi = {
  getLeagues: async (): Promise<League[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return leagues;
  },

  getGames: async (sport?: string, leagueId?: string): Promise<ApiGame[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const filteredLeagues = leagueId 
      ? leagues.filter(l => l.id === leagueId)
      : sport 
        ? leagues.filter(l => l.sport === sport)
        : leagues;

    const games: ApiGame[] = [];

    filteredLeagues.forEach(league => {
      const leagueTeams = teams[league.id as keyof typeof teams];
      const numGames = Math.floor(Math.random() * 3) + 2; // 2-4 games per league

      for (let i = 0; i < numGames; i++) {
        const homeIdx = Math.floor(Math.random() * leagueTeams.length);
        let awayIdx = Math.floor(Math.random() * leagueTeams.length);
        while (awayIdx === homeIdx) {
          awayIdx = Math.floor(Math.random() * leagueTeams.length);
        }

        const status = ['scheduled', 'live', 'finished'][Math.floor(Math.random() * 3)] as ApiGame['status'];

        games.push({
          id: `${league.id}-${i}`,
          homeTeam: leagueTeams[homeIdx],
          awayTeam: leagueTeams[awayIdx],
          startTime: new Date(Date.now() + Math.random() * 86400000 * 2).toISOString(),
          sport: league.sport,
          league: league.id,
          status,
          currentPeriod: getCurrentPeriod(league.sport, status),
          score: generateScore(league.sport, status)
        });
      }
    });

    return games;
  },

  getMostBetGames: async (): Promise<ApiGame[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return a random subset of games as "most bet"
    const allGames = await sportsApi.getGames();
    const numGames = Math.min(5, allGames.length);
    const shuffled = allGames.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numGames);
  }
};