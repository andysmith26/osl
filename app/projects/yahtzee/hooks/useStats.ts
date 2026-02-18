'use client';

import { useMemo } from 'react';
import { useGames } from './useGames';
import {
  calculatePlayerStats,
  calculateHeadToHead,
  getPlayerTrends,
  getCategoryPerformance,
  getAllPlayers,
  getOverallStats,
} from '../lib/stats-calculator';
import { PlayerStats, HeadToHeadStats, TrendDataPoint, ScoreCategory } from '../lib/types';

interface UseStatsReturn {
  loading: boolean;
  error: Error | null;
  playerStats: Map<string, PlayerStats>;
  allPlayers: string[];
  overallStats: ReturnType<typeof getOverallStats>;
  getHeadToHead: (player1: string, player2: string) => HeadToHeadStats;
  getPlayerTrends: (playerName: string) => TrendDataPoint[];
  getCategoryPerformance: (
    playerName: string
  ) => { category: ScoreCategory; avgPercent: number; avg: number; best: number }[];
}

export function useStats(): UseStatsReturn {
  const { games, loading, error } = useGames();

  const playerStats = useMemo(() => calculatePlayerStats(games), [games]);
  const allPlayers = useMemo(() => getAllPlayers(games), [games]);
  const overallStats = useMemo(() => getOverallStats(games), [games]);

  const getHeadToHeadFn = (player1: string, player2: string) =>
    calculateHeadToHead(games, player1, player2);

  const getPlayerTrendsFn = (playerName: string) => getPlayerTrends(games, playerName);

  const getCategoryPerformanceFn = (playerName: string) => {
    const stats = playerStats.get(playerName);
    if (!stats) return [];
    return getCategoryPerformance(stats);
  };

  return {
    loading,
    error,
    playerStats,
    allPlayers,
    overallStats,
    getHeadToHead: getHeadToHeadFn,
    getPlayerTrends: getPlayerTrendsFn,
    getCategoryPerformance: getCategoryPerformanceFn,
  };
}
