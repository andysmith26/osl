// Yahtzee score categories
export type UpperCategory = 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes';
export type LowerCategory =
  | 'threeOfAKind'
  | 'fourOfAKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yahtzee'
  | 'chance';

export type ScoreCategory = UpperCategory | LowerCategory;

// Score values for each category (null = not yet scored)
export interface ScoreValues {
  // Upper section
  ones: number | null;
  twos: number | null;
  threes: number | null;
  fours: number | null;
  fives: number | null;
  sixes: number | null;
  // Lower section
  threeOfAKind: number | null;
  fourOfAKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  yahtzee: number | null;
  chance: number | null;
}

// Individual player's scores for one game
export interface PlayerGameScore {
  playerName: string;
  scores: ScoreValues;
  upperTotal: number;
  upperBonus: number; // 35 if upperTotal >= 63
  lowerTotal: number;
  yahtzeeBonus: number; // 100 per additional yahtzee
  grandTotal: number;
}

// Complete game record stored in Firestore
export interface YahtzeeGame {
  id: string;
  userId: string; // Firebase auth UID
  date: string; // ISO date string (YYYY-MM-DD)
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
  players: PlayerGameScore[];
  winnerId: number; // Index of winning player
  notes?: string;
}

// Player aggregate statistics
export interface PlayerStats {
  playerName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  totalScore: number;
  highScore: number;
  lowScore: number;
  averageScore: number;
  yahtzeeCount: number;
  yahtzeeBonusCount: number;
  upperBonusCount: number;
  upperBonusRate: number;
  categoryAverages: Record<ScoreCategory, number>;
  categoryBests: Record<ScoreCategory, number>;
  lastPlayed: number;
  last5Average: number;
  last10Average: number;
  scoreTrend: 'improving' | 'declining' | 'stable';
}

// Head-to-head statistics between two players
export interface HeadToHeadStats {
  player1: string;
  player2: string;
  player1Wins: number;
  player2Wins: number;
  ties: number;
  gamesPlayed: number;
  player1AvgScore: number;
  player2AvgScore: number;
}

// Overall statistics across all games
export interface OverallStats {
  totalGames: number;
  totalPlayers: Set<string>;
  highestScore: { score: number; playerName: string; date: string };
  lowestScore: { score: number; playerName: string; date: string };
  mostYahtzees: { count: number; playerName: string };
  highestUpperBonus: { total: number; playerName: string };
}

// Trend data point for charting
export interface TrendDataPoint {
  date: string;
  score: number;
  gameId: string;
}

// Form state for new game entry
export interface NewGameFormState {
  date: string;
  playerCount: number;
  playerNames: string[];
  scores: PlayerGameScore[];
  currentStep: 'setup' | 'scoring' | 'review';
  activePlayerIndex: number;
}

// Tab options for main navigation
export type TabId = 'newGame' | 'history' | 'stats';
