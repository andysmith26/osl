'use client';

import { useState } from 'react';
import { YahtzeeGame } from '../lib/types';
import { CATEGORY_NAMES, UPPER_CATEGORIES, LOWER_CATEGORIES } from '../lib/scoring';

interface GameCardProps {
  game: YahtzeeGame;
  onDelete: () => void;
  deleting: boolean;
}

export default function GameCard({ game, onDelete, deleting }: GameCardProps) {
  const [expanded, setExpanded] = useState(false);
  const winner = game.players[game.winnerId];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-theme-surface border-4 border-theme-border shadow-theme-brutal-sm">
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-theme-secondary/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-theme-text-secondary font-bold">{formatDate(game.date)}</p>
            <p className="font-black text-lg">
              {winner.playerName} wins with {winner.grandTotal}
            </p>
            <p className="text-sm text-theme-text-secondary">
              {game.players.map((p) => p.playerName).join(' vs ')}
            </p>
          </div>
          <button
            className="text-xl transform transition-transform"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '−' : '+'}
          </button>
        </div>

        {/* Quick Scores */}
        <div className="flex gap-3 mt-3 flex-wrap">
          {game.players.map((player, idx) => (
            <div
              key={idx}
              className={`px-3 py-1 border-2 border-theme-border text-sm font-bold ${
                idx === game.winnerId ? 'bg-theme-accent' : 'bg-theme-surface'
              }`}
            >
              {player.playerName}: {player.grandTotal}
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t-4 border-theme-border p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-theme-primary text-theme-surface">
                  <th className="p-2 text-left font-bold">Category</th>
                  {game.players.map((player, idx) => (
                    <th
                      key={idx}
                      className={`p-2 text-center font-bold ${idx === game.winnerId ? 'bg-theme-accent text-theme-text' : ''}`}
                    >
                      {player.playerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Upper Section */}
                <tr className="bg-theme-secondary/30">
                  <td colSpan={game.players.length + 1} className="p-1 font-black text-xs uppercase">
                    Upper Section
                  </td>
                </tr>
                {UPPER_CATEGORIES.map((cat) => (
                  <tr key={cat} className="border-b border-theme-border/50">
                    <td className="p-1 pl-3">{CATEGORY_NAMES[cat]}</td>
                    {game.players.map((player, idx) => (
                      <td key={idx} className="p-1 text-center">
                        {player.scores[cat] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b-2 border-theme-border font-bold">
                  <td className="p-1 pl-3">Upper Total</td>
                  {game.players.map((player, idx) => (
                    <td key={idx} className="p-1 text-center">
                      {player.upperTotal}
                    </td>
                  ))}
                </tr>
                <tr className="border-b-2 border-theme-border">
                  <td className="p-1 pl-3">Bonus</td>
                  {game.players.map((player, idx) => (
                    <td key={idx} className="p-1 text-center">
                      {player.upperBonus > 0 ? `+${player.upperBonus}` : '—'}
                    </td>
                  ))}
                </tr>

                {/* Lower Section */}
                <tr className="bg-theme-accent/20">
                  <td colSpan={game.players.length + 1} className="p-1 font-black text-xs uppercase">
                    Lower Section
                  </td>
                </tr>
                {LOWER_CATEGORIES.map((cat) => (
                  <tr key={cat} className="border-b border-theme-border/50">
                    <td className="p-1 pl-3">{CATEGORY_NAMES[cat]}</td>
                    {game.players.map((player, idx) => (
                      <td key={idx} className="p-1 text-center">
                        {player.scores[cat] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b-2 border-theme-border font-bold">
                  <td className="p-1 pl-3">Lower Total</td>
                  {game.players.map((player, idx) => (
                    <td key={idx} className="p-1 text-center">
                      {player.lowerTotal}
                    </td>
                  ))}
                </tr>
                <tr className="border-b-2 border-theme-border">
                  <td className="p-1 pl-3">Yahtzee Bonus</td>
                  {game.players.map((player, idx) => (
                    <td key={idx} className="p-1 text-center">
                      {player.yahtzeeBonus > 0 ? `+${player.yahtzeeBonus}` : '—'}
                    </td>
                  ))}
                </tr>

                {/* Grand Total */}
                <tr className="bg-theme-primary text-theme-surface font-black">
                  <td className="p-2">Grand Total</td>
                  {game.players.map((player, idx) => (
                    <td key={idx} className="p-2 text-center text-lg">
                      {player.grandTotal}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={deleting}
              className="px-3 py-1 text-sm font-bold text-red-600 border-2 border-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Game'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
