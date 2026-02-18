'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useStats } from '../hooks/useStats';
import { CATEGORY_NAMES } from '../lib/scoring';

export default function StatsDashboard() {
  const {
    loading,
    error,
    playerStats,
    allPlayers,
    overallStats,
    getHeadToHead,
    getPlayerTrends,
    getCategoryPerformance,
  } = useStats();

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [h2hPlayer1, setH2hPlayer1] = useState<string>('');
  const [h2hPlayer2, setH2hPlayer2] = useState<string>('');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-responsive-lg font-bold">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-2 border-red-600 p-4 text-red-800">
        Error loading stats: {error.message}
      </div>
    );
  }

  if (overallStats.totalGames === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-responsive-4xl mb-4">📊</div>
        <h2 className="text-responsive-xl font-black font-serif uppercase mb-2">No Stats Yet</h2>
        <p className="text-theme-text-secondary">
          Play some games to see your statistics here.
        </p>
      </div>
    );
  }

  const stats = selectedPlayer ? playerStats.get(selectedPlayer) : null;
  const trendData = selectedPlayer ? getPlayerTrends(selectedPlayer) : [];
  const categoryData = selectedPlayer ? getCategoryPerformance(selectedPlayer) : [];
  const h2hStats =
    h2hPlayer1 && h2hPlayer2 && h2hPlayer1 !== h2hPlayer2
      ? getHeadToHead(h2hPlayer1, h2hPlayer2)
      : null;

  return (
    <div className="space-y-8">
      <h2 className="text-responsive-xl font-black font-serif uppercase">Statistics</h2>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Games" value={overallStats.totalGames} />
        <StatCard label="Total Players" value={allPlayers.length} />
        <StatCard
          label="Highest Score"
          value={overallStats.highestScore.score}
          subtitle={overallStats.highestScore.playerName}
        />
        <StatCard
          label="Most Yahtzees"
          value={overallStats.mostYahtzees.count}
          subtitle={overallStats.mostYahtzees.playerName || '—'}
        />
      </div>

      {/* Leaderboard */}
      <div className="bg-theme-secondary/30 border-2 border-theme-border p-4">
        <h3 className="font-black uppercase text-sm mb-4">Leaderboard</h3>
        <div className="space-y-2">
          {Array.from(playerStats.values())
            .sort((a, b) => b.wins - a.wins)
            .map((player, index) => (
              <div
                key={player.playerName}
                className="flex items-center justify-between p-2 bg-theme-surface border-2 border-theme-border"
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-lg w-6">{index + 1}</span>
                  <span className="font-bold">{player.playerName}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    <span className="font-bold">{player.wins}</span> wins
                  </span>
                  <span className="text-theme-text-secondary">
                    {player.gamesPlayed} games ({((player.wins / player.gamesPlayed) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Player Selector */}
      <div>
        <label className="block font-bold uppercase text-sm mb-2">Select Player for Details</label>
        <select
          value={selectedPlayer || ''}
          onChange={(e) => setSelectedPlayer(e.target.value || null)}
          className="border-4 border-theme-border bg-theme-surface p-2 font-bold min-w-[200px]"
        >
          <option value="">Choose a player...</option>
          {allPlayers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Player Stats */}
      {stats && (
        <div className="space-y-6">
          <div className="bg-theme-accent/20 border-2 border-theme-border p-4">
            <h3 className="font-black uppercase text-lg mb-4">{stats.playerName}&apos;s Stats</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Win Rate" value={`${((stats.wins / stats.gamesPlayed) * 100).toFixed(0)}%`} />
              <StatCard label="Avg Score" value={Math.round(stats.averageScore)} />
              <StatCard label="High Score" value={stats.highScore} />
              <StatCard label="Yahtzees" value={stats.yahtzeeCount} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Upper Bonus Rate" value={`${stats.upperBonusRate.toFixed(0)}%`} />
              <StatCard label="Last 5 Avg" value={Math.round(stats.last5Average)} />
              <StatCard label="Last 10 Avg" value={Math.round(stats.last10Average)} />
              <StatCard
                label="Trend"
                value={stats.scoreTrend === 'improving' ? '📈' : stats.scoreTrend === 'declining' ? '📉' : '➡️'}
                subtitle={stats.scoreTrend}
              />
            </div>
          </div>

          {/* Score Trend Chart */}
          {trendData.length > 1 && (
            <div className="bg-theme-surface border-2 border-theme-border p-4">
              <h4 className="font-bold uppercase text-sm mb-4">Score Trend</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) => new Date(val + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value) => [value ?? 0, 'Score']}
                      labelFormatter={(label) => new Date(label + 'T00:00:00').toLocaleDateString()}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-accent)"
                      strokeWidth={3}
                      dot={{ fill: 'var(--color-accent)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Category Performance */}
          {categoryData.length > 0 && (
            <div className="bg-theme-surface border-2 border-theme-border p-4">
              <h4 className="font-bold uppercase text-sm mb-4">Category Performance</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData.map((d) => ({
                      ...d,
                      name: CATEGORY_NAMES[d.category],
                    }))}
                    layout="vertical"
                  >
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={90} />
                    <Tooltip
                      formatter={(value, _name, props) => {
                        const v = typeof value === 'number' ? value : 0;
                        const payload = props?.payload as { avg?: number; best?: number } | undefined;
                        const avg = payload?.avg ?? 0;
                        const best = payload?.best ?? 0;
                        return [`${v.toFixed(0)}% (avg: ${avg.toFixed(1)}, best: ${best})`, 'Performance'];
                      }}
                    />
                    <Bar dataKey="avgPercent" fill="var(--color-accent)">
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.avgPercent > 70 ? 'var(--color-secondary)' : entry.avgPercent < 40 ? '#ef4444' : 'var(--color-accent)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-theme-text-secondary mt-2">
                Percentage of maximum possible score for each category
              </p>
            </div>
          )}
        </div>
      )}

      {/* Head to Head */}
      {allPlayers.length >= 2 && (
        <div className="bg-theme-secondary/30 border-2 border-theme-border p-4">
          <h3 className="font-black uppercase text-sm mb-4">Head to Head</h3>

          <div className="flex flex-wrap gap-4 mb-4">
            <select
              value={h2hPlayer1}
              onChange={(e) => setH2hPlayer1(e.target.value)}
              className="border-2 border-theme-border bg-theme-surface p-2 font-bold"
            >
              <option value="">Player 1...</option>
              {allPlayers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <span className="font-black self-center">vs</span>
            <select
              value={h2hPlayer2}
              onChange={(e) => setH2hPlayer2(e.target.value)}
              className="border-2 border-theme-border bg-theme-surface p-2 font-bold"
            >
              <option value="">Player 2...</option>
              {allPlayers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {h2hStats && h2hStats.gamesPlayed > 0 ? (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-theme-surface border-2 border-theme-border p-4">
                <p className="text-responsive-2xl font-black">{h2hStats.player1Wins}</p>
                <p className="font-bold text-sm">{h2hStats.player1}</p>
                <p className="text-xs text-theme-text-secondary">
                  Avg: {Math.round(h2hStats.player1AvgScore)}
                </p>
              </div>
              <div className="bg-theme-surface border-2 border-theme-border p-4">
                <p className="text-responsive-2xl font-black">{h2hStats.ties}</p>
                <p className="font-bold text-sm">Ties</p>
                <p className="text-xs text-theme-text-secondary">{h2hStats.gamesPlayed} games</p>
              </div>
              <div className="bg-theme-surface border-2 border-theme-border p-4">
                <p className="text-responsive-2xl font-black">{h2hStats.player2Wins}</p>
                <p className="font-bold text-sm">{h2hStats.player2}</p>
                <p className="text-xs text-theme-text-secondary">
                  Avg: {Math.round(h2hStats.player2AvgScore)}
                </p>
              </div>
            </div>
          ) : h2hPlayer1 && h2hPlayer2 && h2hPlayer1 !== h2hPlayer2 ? (
            <p className="text-theme-text-secondary">No games played between these players.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="bg-theme-surface border-2 border-theme-border p-3 text-center">
      <p className="text-responsive-xl font-black">{value}</p>
      <p className="text-xs font-bold uppercase text-theme-text-secondary">{label}</p>
      {subtitle && <p className="text-xs text-theme-text-secondary">{subtitle}</p>}
    </div>
  );
}
