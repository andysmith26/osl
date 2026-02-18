import { UpperCategory, LowerCategory, ScoreCategory, ScoreValues, PlayerGameScore } from './types';

export const UPPER_CATEGORIES: UpperCategory[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
export const LOWER_CATEGORIES: LowerCategory[] = [
  'threeOfAKind',
  'fourOfAKind',
  'fullHouse',
  'smallStraight',
  'largeStraight',
  'yahtzee',
  'chance',
];
export const ALL_CATEGORIES: ScoreCategory[] = [...UPPER_CATEGORIES, ...LOWER_CATEGORIES];

export const UPPER_BONUS_THRESHOLD = 63;
export const UPPER_BONUS_VALUE = 35;
export const YAHTZEE_BONUS_VALUE = 100;

// Human-readable names for categories
export const CATEGORY_NAMES: Record<ScoreCategory, string> = {
  ones: 'Ones',
  twos: 'Twos',
  threes: 'Threes',
  fours: 'Fours',
  fives: 'Fives',
  sixes: 'Sixes',
  threeOfAKind: 'Three of a Kind',
  fourOfAKind: 'Four of a Kind',
  fullHouse: 'Full House',
  smallStraight: 'Small Straight',
  largeStraight: 'Large Straight',
  yahtzee: 'Yahtzee',
  chance: 'Chance',
};

// Maximum possible scores for each category
export const MAX_SCORES: Record<ScoreCategory, number> = {
  ones: 5,
  twos: 10,
  threes: 15,
  fours: 20,
  fives: 25,
  sixes: 30,
  threeOfAKind: 30,
  fourOfAKind: 30,
  fullHouse: 25,
  smallStraight: 30,
  largeStraight: 40,
  yahtzee: 50,
  chance: 30,
};

// Score validation ranges
export const SCORE_RANGES: Record<ScoreCategory, { min: number; max: number; fixed?: number[] }> = {
  ones: { min: 0, max: 5 },
  twos: { min: 0, max: 10, fixed: [0, 2, 4, 6, 8, 10] },
  threes: { min: 0, max: 15, fixed: [0, 3, 6, 9, 12, 15] },
  fours: { min: 0, max: 20, fixed: [0, 4, 8, 12, 16, 20] },
  fives: { min: 0, max: 25, fixed: [0, 5, 10, 15, 20, 25] },
  sixes: { min: 0, max: 30, fixed: [0, 6, 12, 18, 24, 30] },
  threeOfAKind: { min: 0, max: 30 },
  fourOfAKind: { min: 0, max: 30 },
  fullHouse: { min: 0, max: 25, fixed: [0, 25] },
  smallStraight: { min: 0, max: 30, fixed: [0, 30] },
  largeStraight: { min: 0, max: 40, fixed: [0, 40] },
  yahtzee: { min: 0, max: 50, fixed: [0, 50] },
  chance: { min: 5, max: 30 },
};

export function validateScore(category: ScoreCategory, value: number): boolean {
  const range = SCORE_RANGES[category];
  if (value < range.min || value > range.max) return false;
  if (range.fixed && !range.fixed.includes(value)) return false;
  return true;
}

export function calculateUpperTotal(scores: ScoreValues): number {
  return UPPER_CATEGORIES.reduce((sum, cat) => sum + (scores[cat] ?? 0), 0);
}

export function calculateUpperBonus(upperTotal: number): number {
  return upperTotal >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS_VALUE : 0;
}

export function calculateLowerTotal(scores: ScoreValues): number {
  return LOWER_CATEGORIES.reduce((sum, cat) => sum + (scores[cat] ?? 0), 0);
}

export function calculateGrandTotal(
  upperTotal: number,
  upperBonus: number,
  lowerTotal: number,
  yahtzeeBonus: number
): number {
  return upperTotal + upperBonus + lowerTotal + yahtzeeBonus;
}

export function calculatePlayerTotals(scores: ScoreValues, yahtzeeBonus: number = 0): Omit<PlayerGameScore, 'playerName' | 'scores'> {
  const upperTotal = calculateUpperTotal(scores);
  const upperBonus = calculateUpperBonus(upperTotal);
  const lowerTotal = calculateLowerTotal(scores);
  const grandTotal = calculateGrandTotal(upperTotal, upperBonus, lowerTotal, yahtzeeBonus);

  return {
    upperTotal,
    upperBonus,
    lowerTotal,
    yahtzeeBonus,
    grandTotal,
  };
}

export function createEmptyScores(): ScoreValues {
  return {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeOfAKind: null,
    fourOfAKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null,
  };
}

export function createEmptyPlayerScore(playerName: string): PlayerGameScore {
  return {
    playerName,
    scores: createEmptyScores(),
    upperTotal: 0,
    upperBonus: 0,
    lowerTotal: 0,
    yahtzeeBonus: 0,
    grandTotal: 0,
  };
}

export function determineWinner(players: PlayerGameScore[]): number {
  let maxScore = -1;
  let winnerId = 0;
  players.forEach((player, idx) => {
    if (player.grandTotal > maxScore) {
      maxScore = player.grandTotal;
      winnerId = idx;
    }
  });
  return winnerId;
}

export function isScoreComplete(scores: ScoreValues): boolean {
  return ALL_CATEGORIES.every((cat) => scores[cat] !== null);
}
