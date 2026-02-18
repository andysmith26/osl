import { YahtzeeGame, PlayerStats, HeadToHeadStats, ScoreCategory, TrendDataPoint } from './types';
import { ALL_CATEGORIES, MAX_SCORES } from './scoring';

export function calculatePlayerStats(games: YahtzeeGame[]): Map<string, PlayerStats> {
  const statsMap = new Map<string, PlayerStats>();

  // First pass: collect all player data
  const playerData = new Map<
    string,
    {
      scores: number[];
      wins: number;
      gamesPlayed: number;
      yahtzees: number;
      yahtzeeBonuses: number;
      upperBonuses: number;
      categoryScores: Map<ScoreCategory, number[]>;
      lastPlayed: number;
    }
  >();

  for (const game of games) {
    const gameTime = game.createdAt || 0;

    for (let i = 0; i < game.players.length; i++) {
      const player = game.players[i];
      const name = player.playerName;

      if (!playerData.has(name)) {
        playerData.set(name, {
          scores: [],
          wins: 0,
          gamesPlayed: 0,
          yahtzees: 0,
          yahtzeeBonuses: 0,
          upperBonuses: 0,
          categoryScores: new Map(ALL_CATEGORIES.map((cat) => [cat, []])),
          lastPlayed: 0,
        });
      }

      const data = playerData.get(name)!;
      data.scores.push(player.grandTotal);
      data.gamesPlayed++;
      if (i === game.winnerId) data.wins++;
      if (player.scores.yahtzee === 50) data.yahtzees++;
      if (player.yahtzeeBonus > 0) data.yahtzeeBonuses += player.yahtzeeBonus / 100;
      if (player.upperBonus > 0) data.upperBonuses++;
      if (gameTime > data.lastPlayed) data.lastPlayed = gameTime;

      // Category scores
      for (const cat of ALL_CATEGORIES) {
        const score = player.scores[cat];
        if (score !== null) {
          data.categoryScores.get(cat)!.push(score);
        }
      }
    }
  }

  // Second pass: calculate stats
  for (const [name, data] of playerData) {
    const sortedScores = [...data.scores].sort((a, b) => b - a);
    const totalScore = data.scores.reduce((sum, s) => sum + s, 0);

    // Category averages and bests
    const categoryAverages: Record<ScoreCategory, number> = {} as Record<ScoreCategory, number>;
    const categoryBests: Record<ScoreCategory, number> = {} as Record<ScoreCategory, number>;

    for (const cat of ALL_CATEGORIES) {
      const catScores = data.categoryScores.get(cat)!;
      if (catScores.length > 0) {
        categoryAverages[cat] = catScores.reduce((sum, s) => sum + s, 0) / catScores.length;
        categoryBests[cat] = Math.max(...catScores);
      } else {
        categoryAverages[cat] = 0;
        categoryBests[cat] = 0;
      }
    }

    // Rolling averages (games are sorted newest first)
    const recentScores = data.scores.slice(0, 10);
    const last5 = recentScores.slice(0, 5);
    const last10 = recentScores;

    const last5Avg = last5.length > 0 ? last5.reduce((sum, s) => sum + s, 0) / last5.length : 0;
    const last10Avg = last10.length > 0 ? last10.reduce((sum, s) => sum + s, 0) / last10.length : 0;

    // Trend calculation
    let scoreTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (data.scores.length >= 10) {
      const recent5Avg = last5Avg;
      const prev5 = recentScores.slice(5, 10);
      const prev5Avg = prev5.length > 0 ? prev5.reduce((sum, s) => sum + s, 0) / prev5.length : 0;

      const diff = recent5Avg - prev5Avg;
      if (diff > 10) scoreTrend = 'improving';
      else if (diff < -10) scoreTrend = 'declining';
    }

    statsMap.set(name, {
      playerName: name,
      gamesPlayed: data.gamesPlayed,
      wins: data.wins,
      losses: data.gamesPlayed - data.wins,
      totalScore,
      highScore: sortedScores[0] || 0,
      lowScore: sortedScores[sortedScores.length - 1] || 0,
      averageScore: data.gamesPlayed > 0 ? totalScore / data.gamesPlayed : 0,
      yahtzeeCount: data.yahtzees,
      yahtzeeBonusCount: data.yahtzeeBonuses,
      upperBonusCount: data.upperBonuses,
      upperBonusRate: data.gamesPlayed > 0 ? (data.upperBonuses / data.gamesPlayed) * 100 : 0,
      categoryAverages,
      categoryBests,
      lastPlayed: data.lastPlayed,
      last5Average: last5Avg,
      last10Average: last10Avg,
      scoreTrend,
    });
  }

  return statsMap;
}

export function calculateHeadToHead(
  games: YahtzeeGame[],
  player1: string,
  player2: string
): HeadToHeadStats {
  let player1Wins = 0;
  let player2Wins = 0;
  let ties = 0;
  let player1TotalScore = 0;
  let player2TotalScore = 0;
  let gamesPlayed = 0;

  for (const game of games) {
    const p1Index = game.players.findIndex((p) => p.playerName === player1);
    const p2Index = game.players.findIndex((p) => p.playerName === player2);

    if (p1Index === -1 || p2Index === -1) continue;

    gamesPlayed++;
    const p1Score = game.players[p1Index].grandTotal;
    const p2Score = game.players[p2Index].grandTotal;

    player1TotalScore += p1Score;
    player2TotalScore += p2Score;

    if (p1Score > p2Score) player1Wins++;
    else if (p2Score > p1Score) player2Wins++;
    else ties++;
  }

  return {
    player1,
    player2,
    player1Wins,
    player2Wins,
    ties,
    gamesPlayed,
    player1AvgScore: gamesPlayed > 0 ? player1TotalScore / gamesPlayed : 0,
    player2AvgScore: gamesPlayed > 0 ? player2TotalScore / gamesPlayed : 0,
  };
}

export function getPlayerTrends(games: YahtzeeGame[], playerName: string): TrendDataPoint[] {
  const points: TrendDataPoint[] = [];

  // Games are sorted newest first, we want oldest first for trends
  const sortedGames = [...games].reverse();

  for (const game of sortedGames) {
    const playerIndex = game.players.findIndex((p) => p.playerName === playerName);
    if (playerIndex === -1) continue;

    points.push({
      date: game.date,
      score: game.players[playerIndex].grandTotal,
      gameId: game.id,
    });
  }

  return points;
}

export function getCategoryPerformance(
  playerStats: PlayerStats
): { category: ScoreCategory; avgPercent: number; avg: number; best: number }[] {
  return ALL_CATEGORIES.map((cat) => ({
    category: cat,
    avgPercent: (playerStats.categoryAverages[cat] / MAX_SCORES[cat]) * 100,
    avg: playerStats.categoryAverages[cat],
    best: playerStats.categoryBests[cat],
  })).sort((a, b) => b.avgPercent - a.avgPercent);
}

export function getAllPlayers(games: YahtzeeGame[]): string[] {
  const players = new Set<string>();
  for (const game of games) {
    for (const player of game.players) {
      players.add(player.playerName);
    }
  }
  return Array.from(players).sort();
}

export function getOverallStats(games: YahtzeeGame[]) {
  let highestScore = { score: 0, playerName: '', date: '' };
  let lowestScore = { score: Infinity, playerName: '', date: '' };
  const yahtzeeCounts = new Map<string, number>();

  for (const game of games) {
    for (const player of game.players) {
      if (player.grandTotal > highestScore.score) {
        highestScore = { score: player.grandTotal, playerName: player.playerName, date: game.date };
      }
      if (player.grandTotal < lowestScore.score) {
        lowestScore = { score: player.grandTotal, playerName: player.playerName, date: game.date };
      }
      if (player.scores.yahtzee === 50) {
        yahtzeeCounts.set(player.playerName, (yahtzeeCounts.get(player.playerName) || 0) + 1);
      }
    }
  }

  let mostYahtzees = { count: 0, playerName: '' };
  for (const [name, count] of yahtzeeCounts) {
    if (count > mostYahtzees.count) {
      mostYahtzees = { count, playerName: name };
    }
  }

  if (lowestScore.score === Infinity) {
    lowestScore = { score: 0, playerName: '', date: '' };
  }

  return {
    totalGames: games.length,
    highestScore,
    lowestScore,
    mostYahtzees,
  };
}
