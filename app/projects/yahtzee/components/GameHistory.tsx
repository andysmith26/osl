'use client';

import { useState } from 'react';
import { useGames } from '../hooks/useGames';
import GameCard from './GameCard';

export default function GameHistory() {
  const { games, loading, error, deleteGame } = useGames();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    setDeletingId(gameId);
    try {
      await deleteGame(gameId);
    } catch {
      alert('Failed to delete game');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-responsive-lg font-bold">Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-2 border-red-600 p-4 text-red-800">
        Error loading games: {error.message}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-responsive-4xl mb-4">🎲</div>
        <h2 className="text-responsive-xl font-black font-serif uppercase mb-2">No Games Yet</h2>
        <p className="text-theme-text-secondary">
          Start tracking your Yahtzee games by entering a new game.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-responsive-xl font-black font-serif uppercase">Game History</h2>
        <span className="text-sm text-theme-text-secondary font-bold">
          {games.length} game{games.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onDelete={() => handleDelete(game.id)}
            deleting={deletingId === game.id}
          />
        ))}
      </div>
    </div>
  );
}
