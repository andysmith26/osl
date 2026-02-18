'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { NewGameFormState, ScoreCategory } from '../lib/types';
import {
  createEmptyPlayerScore,
  calculatePlayerTotals,
  determineWinner,
  isScoreComplete,
  UPPER_CATEGORIES,
  LOWER_CATEGORIES,
  ALL_CATEGORIES,
  CATEGORY_NAMES,
  SCORE_RANGES,
  UPPER_BONUS_THRESHOLD,
} from '../lib/scoring';
import { useGames } from '../hooks/useGames';

const PLAYER_NAMES_STORAGE_KEY = 'yahtzee-recent-players';

function getRecentPlayerNames(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(PLAYER_NAMES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentPlayerNames(names: string[]) {
  if (typeof window === 'undefined') return;
  const unique = [...new Set(names.filter(Boolean))].slice(0, 20);
  localStorage.setItem(PLAYER_NAMES_STORAGE_KEY, JSON.stringify(unique));
}

export default function GameEntryForm() {
  const { addGame } = useGames();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formState, setFormState] = useState<NewGameFormState>({
    date: new Date().toISOString().split('T')[0],
    playerCount: 2,
    playerNames: ['', ''],
    scores: [],
    currentStep: 'setup',
    activePlayerIndex: 0,
  });

  const [recentPlayers, setRecentPlayers] = useState<string[]>([]);

  // Refs for scoring step navigation (must be at top level, not conditional)
  const focusOnesRef = useRef<(() => void) | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setRecentPlayers(getRecentPlayerNames());
  }, []);

  // Auto-focus on ones when entering scoring step or changing players
  useEffect(() => {
    if (formState.currentStep === 'scoring') {
      // Small delay to ensure refs are set
      const timer = setTimeout(() => {
        if (focusOnesRef.current) {
          focusOnesRef.current();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [formState.currentStep, formState.activePlayerIndex]);

  const handleNextPlayer = () => {
    if (formState.activePlayerIndex < formState.scores.length - 1) {
      setFormState({ ...formState, activePlayerIndex: formState.activePlayerIndex + 1 });
    }
  };

  const handlePlayerCountChange = (count: number) => {
    const names = [...formState.playerNames];
    while (names.length < count) names.push('');
    while (names.length > count) names.pop();
    setFormState({ ...formState, playerCount: count, playerNames: names });
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const names = [...formState.playerNames];
    names[index] = name;
    setFormState({ ...formState, playerNames: names });
  };

  const handleStartScoring = () => {
    const validNames = formState.playerNames.filter(Boolean);
    if (validNames.length < 2) {
      alert('Please enter at least 2 player names');
      return;
    }

    const scores = formState.playerNames
      .filter(Boolean)
      .map((name) => createEmptyPlayerScore(name));

    setFormState({
      ...formState,
      playerNames: formState.playerNames.filter(Boolean),
      scores,
      currentStep: 'scoring',
      activePlayerIndex: 0,
    });
  };

  const handleScoreChange = (playerIndex: number, category: ScoreCategory, value: number | null) => {
    const newScores = [...formState.scores];
    newScores[playerIndex] = {
      ...newScores[playerIndex],
      scores: {
        ...newScores[playerIndex].scores,
        [category]: value,
      },
    };

    // Recalculate totals
    const totals = calculatePlayerTotals(
      newScores[playerIndex].scores,
      newScores[playerIndex].yahtzeeBonus
    );
    newScores[playerIndex] = {
      ...newScores[playerIndex],
      ...totals,
    };

    setFormState({ ...formState, scores: newScores });
  };

  const handleYahtzeeBonusChange = (playerIndex: number, bonus: number) => {
    const newScores = [...formState.scores];
    const totals = calculatePlayerTotals(newScores[playerIndex].scores, bonus);
    newScores[playerIndex] = {
      ...newScores[playerIndex],
      ...totals,
    };
    setFormState({ ...formState, scores: newScores });
  };

  const handleGoToReview = () => {
    const allComplete = formState.scores.every((player) => isScoreComplete(player.scores));
    if (!allComplete) {
      alert('Please fill in all scores for all players');
      return;
    }
    setFormState({ ...formState, currentStep: 'review' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const winnerId = determineWinner(formState.scores);
      await addGame({
        date: formState.date,
        players: formState.scores,
        winnerId,
      });

      // Save player names for future suggestions
      saveRecentPlayerNames([
        ...formState.playerNames,
        ...recentPlayers,
      ]);

      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormState({
          date: new Date().toISOString().split('T')[0],
          playerCount: formState.playerCount,
          playerNames: formState.playerNames.map(() => ''),
          scores: [],
          currentStep: 'setup',
          activePlayerIndex: 0,
        });
        setSubmitSuccess(false);
        setRecentPlayers(getRecentPlayerNames());
      }, 2000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save game');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="text-responsive-4xl mb-4">🎉</div>
        <h2 className="text-responsive-2xl font-black font-serif uppercase mb-2">Game Saved!</h2>
        <p className="text-responsive-base text-theme-text-secondary">
          Winner: {formState.scores[determineWinner(formState.scores)].playerName}
        </p>
      </div>
    );
  }

  if (formState.currentStep === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-responsive-xl font-black font-serif uppercase">New Game Setup</h2>

        {/* Date */}
        <div>
          <label className="block font-bold uppercase text-sm mb-2">Date</label>
          <input
            type="date"
            value={formState.date}
            onChange={(e) => setFormState({ ...formState, date: e.target.value })}
            className="w-full max-w-xs border-4 border-theme-border bg-theme-surface p-3 font-bold focus:shadow-theme-brutal-sm outline-none"
          />
        </div>

        {/* Player Count */}
        <div>
          <label className="block font-bold uppercase text-sm mb-2">Number of Players</label>
          <div className="flex gap-2 flex-wrap">
            {[2, 3, 4, 5, 6].map((count) => (
              <button
                key={count}
                onClick={() => handlePlayerCountChange(count)}
                className={`w-12 h-12 border-4 border-theme-border font-black text-lg transition-all ${
                  formState.playerCount === count
                    ? 'bg-theme-accent shadow-theme-brutal-sm'
                    : 'bg-theme-surface hover:bg-theme-secondary'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Player Names */}
        <div>
          <label className="block font-bold uppercase text-sm mb-2">Player Names</label>
          <div className="space-y-3">
            {formState.playerNames.map((name, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="font-bold w-8">{index + 1}.</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  list={`player-suggestions-${index}`}
                  className="flex-1 max-w-xs border-4 border-theme-border bg-theme-surface p-2 font-bold focus:shadow-theme-brutal-sm outline-none"
                />
                <datalist id={`player-suggestions-${index}`}>
                  {recentPlayers
                    .filter((p) => !formState.playerNames.includes(p))
                    .map((player) => (
                      <option key={player} value={player} />
                    ))}
                </datalist>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartScoring}
          className="px-6 py-3 bg-theme-secondary border-4 border-theme-border shadow-theme-brutal font-black uppercase hover:shadow-theme-brutal-lg transition-shadow"
        >
          Start Scoring &rarr;
        </button>
      </div>
    );
  }

  if (formState.currentStep === 'scoring') {
    const activePlayer = formState.scores[formState.activePlayerIndex];
    const isLastPlayer = formState.activePlayerIndex >= formState.scores.length - 1;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-responsive-xl font-black font-serif uppercase">Enter Scores</h2>
          <button
            onClick={() => setFormState({ ...formState, currentStep: 'setup' })}
            className="text-sm font-bold text-theme-text-secondary hover:text-theme-text"
          >
            &larr; Back to Setup
          </button>
        </div>

        {/* Player Tabs */}
        <div className="flex gap-1 flex-wrap border-b-4 border-theme-border pb-2">
          {formState.scores.map((player, index) => {
            const complete = isScoreComplete(player.scores);
            return (
              <button
                key={index}
                onClick={() => setFormState({ ...formState, activePlayerIndex: index })}
                className={`px-3 py-2 border-2 border-theme-border font-bold text-sm transition-all ${
                  formState.activePlayerIndex === index
                    ? 'bg-theme-accent'
                    : 'bg-theme-surface hover:bg-theme-secondary'
                } ${complete ? 'border-green-600' : ''}`}
              >
                {player.playerName}
                {complete && ' ✓'}
              </button>
            );
          })}
        </div>

        {/* Score Card */}
        <ScoreCard
          scores={activePlayer.scores}
          onScoreChange={(cat, val) => handleScoreChange(formState.activePlayerIndex, cat, val)}
          upperTotal={activePlayer.upperTotal}
          upperBonus={activePlayer.upperBonus}
          lowerTotal={activePlayer.lowerTotal}
          yahtzeeBonus={activePlayer.yahtzeeBonus}
          onYahtzeeBonusChange={(val) => handleYahtzeeBonusChange(formState.activePlayerIndex, val)}
          grandTotal={activePlayer.grandTotal}
          onRequestNextFocus={() => {
            if (nextButtonRef.current) {
              nextButtonRef.current.focus();
            }
          }}
          focusOnesRef={focusOnesRef}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2">
            {formState.activePlayerIndex > 0 && (
              <button
                onClick={() =>
                  setFormState({ ...formState, activePlayerIndex: formState.activePlayerIndex - 1 })
                }
                className="px-4 py-2 bg-theme-surface border-2 border-theme-border font-bold hover:bg-theme-secondary"
              >
                &larr; Previous
              </button>
            )}
            {!isLastPlayer && (
              <button
                ref={nextButtonRef}
                onClick={handleNextPlayer}
                className="px-4 py-2 bg-theme-surface border-2 border-theme-border font-bold hover:bg-theme-secondary focus:ring-2 focus:ring-theme-accent"
              >
                Next &rarr;
              </button>
            )}
          </div>
          <button
            ref={isLastPlayer ? nextButtonRef : undefined}
            onClick={handleGoToReview}
            className="px-6 py-3 bg-theme-secondary border-4 border-theme-border shadow-theme-brutal font-black uppercase hover:shadow-theme-brutal-lg transition-shadow focus:ring-2 focus:ring-theme-accent"
          >
            Review &rarr;
          </button>
        </div>
      </div>
    );
  }

  // Review Step
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-responsive-xl font-black font-serif uppercase">Review & Submit</h2>
        <button
          onClick={() => setFormState({ ...formState, currentStep: 'scoring' })}
          className="text-sm font-bold text-theme-text-secondary hover:text-theme-text"
        >
          &larr; Back to Scoring
        </button>
      </div>

      <p className="text-theme-text-secondary">
        <span className="font-bold">Date:</span> {formState.date}
      </p>

      {/* Score Summary */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-theme-primary text-theme-surface">
              <th className="p-2 text-left font-black uppercase text-sm">Player</th>
              <th className="p-2 text-right font-black uppercase text-sm">Upper</th>
              <th className="p-2 text-right font-black uppercase text-sm">Bonus</th>
              <th className="p-2 text-right font-black uppercase text-sm">Lower</th>
              <th className="p-2 text-right font-black uppercase text-sm">Total</th>
            </tr>
          </thead>
          <tbody>
            {formState.scores.map((player, index) => {
              const isWinner = index === determineWinner(formState.scores);
              return (
                <tr
                  key={index}
                  className={`border-b-2 border-theme-border ${isWinner ? 'bg-theme-accent/30' : ''}`}
                >
                  <td className="p-2 font-bold">
                    {player.playerName}
                    {isWinner && ' 👑'}
                  </td>
                  <td className="p-2 text-right">{player.upperTotal}</td>
                  <td className="p-2 text-right">{player.upperBonus > 0 ? `+${player.upperBonus}` : '—'}</td>
                  <td className="p-2 text-right">{player.lowerTotal + player.yahtzeeBonus}</td>
                  <td className="p-2 text-right font-black text-lg">{player.grandTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {submitError && (
        <div className="bg-red-100 border-2 border-red-600 p-3 text-red-800">{submitError}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-4 bg-theme-secondary border-4 border-theme-border shadow-theme-brutal font-black uppercase text-lg hover:shadow-theme-brutal-lg transition-shadow disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Save Game'}
      </button>
    </div>
  );
}

// Yahtzee bonus buttons component
function YahtzeeBonusButtons({
  value,
  onChange,
  yahtzeeScored,
  onNavigate,
  onTabToNext,
}: {
  value: number;
  onChange: (value: number) => void;
  yahtzeeScored: boolean;
  onNavigate: (direction: 'up' | 'down') => void;
  onTabToNext: () => void;
}) {
  const bonusValues = [0, 100, 200, 300];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onNavigate('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onNavigate('down');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = bonusValues.indexOf(value);
      // Only allow increasing if yahtzee is scored and not at max
      if (yahtzeeScored && currentIndex < bonusValues.length - 1) {
        onChange(bonusValues[currentIndex + 1]);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentIndex = bonusValues.indexOf(value);
      if (currentIndex > 0) {
        onChange(bonusValues[currentIndex - 1]);
      }
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      onTabToNext();
    }
  };

  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {bonusValues.map((v) => {
        // Disable non-zero values if yahtzee not scored
        const disabled = v > 0 && !yahtzeeScored;
        return (
          <button
            key={v}
            onClick={() => !disabled && onChange(v)}
            tabIndex={-1}
            disabled={disabled}
            className={`min-w-[50px] h-10 px-2 border-2 border-theme-border font-bold text-sm transition-all ${
              value === v
                ? 'bg-theme-accent shadow-theme-brutal-sm'
                : disabled
                ? 'bg-theme-surface/50 text-theme-text/30 cursor-not-allowed'
                : 'bg-theme-surface hover:bg-theme-secondary'
            }`}
          >
            {v === 0 ? '0' : `+${v}`}
          </button>
        );
      })}
    </div>
  );
}

// Score card with keyboard navigation between categories
function ScoreCard({
  scores,
  onScoreChange,
  upperTotal,
  upperBonus,
  lowerTotal,
  yahtzeeBonus,
  onYahtzeeBonusChange,
  grandTotal,
  onRequestNextFocus,
  focusOnesRef,
}: {
  scores: import('../lib/types').ScoreValues;
  onScoreChange: (category: ScoreCategory, value: number | null) => void;
  upperTotal: number;
  upperBonus: number;
  lowerTotal: number;
  yahtzeeBonus: number;
  onYahtzeeBonusChange: (value: number) => void;
  grandTotal: number;
  onRequestNextFocus: () => void;
  focusOnesRef: React.MutableRefObject<(() => void) | null>;
}) {
  // Refs for each category row to enable navigation
  const rowRefs = useRef<Map<ScoreCategory, HTMLDivElement | null>>(new Map());
  const yahtzeeBonusRef = useRef<HTMLDivElement | null>(null);

  const setRowRef = useCallback((category: ScoreCategory, el: HTMLDivElement | null) => {
    rowRefs.current.set(category, el);
  }, []);

  // Expose focus method for ones category
  useEffect(() => {
    focusOnesRef.current = () => {
      const onesRow = rowRefs.current.get('ones');
      if (onesRow) {
        const focusable = onesRow.querySelector<HTMLElement>('[tabindex="0"], input[type="range"]');
        if (focusable) {
          focusable.focus();
        }
      }
    };
  }, [focusOnesRef]);

  const navigateToCategory = useCallback((fromCategory: ScoreCategory | 'yahtzeeBonus', direction: 'up' | 'down') => {
    if (fromCategory === 'yahtzeeBonus') {
      if (direction === 'up') {
        // Go to last category (chance)
        const targetRow = rowRefs.current.get('chance');
        if (targetRow) {
          const focusable = targetRow.querySelector<HTMLElement>('[tabindex="0"], input[type="range"]');
          if (focusable) focusable.focus();
        }
      } else {
        // Go to first category (ones)
        const targetRow = rowRefs.current.get('ones');
        if (targetRow) {
          const focusable = targetRow.querySelector<HTMLElement>('[tabindex="0"], input[type="range"]');
          if (focusable) focusable.focus();
        }
      }
      return;
    }

    const currentIndex = ALL_CATEGORIES.indexOf(fromCategory);
    let targetIndex: number;

    if (direction === 'up') {
      targetIndex = currentIndex > 0 ? currentIndex - 1 : -1; // -1 means yahtzee bonus
    } else {
      targetIndex = currentIndex < ALL_CATEGORIES.length - 1 ? currentIndex + 1 : -1;
    }

    if (targetIndex === -1) {
      // Navigate to yahtzee bonus
      if (yahtzeeBonusRef.current) {
        const focusable = yahtzeeBonusRef.current.querySelector<HTMLElement>('[tabindex="0"]');
        if (focusable) focusable.focus();
      }
      return;
    }

    const targetCategory = ALL_CATEGORIES[targetIndex];
    const targetRow = rowRefs.current.get(targetCategory);
    if (targetRow) {
      const focusable = targetRow.querySelector<HTMLElement>('[tabindex="0"], input[type="range"]');
      if (focusable) {
        focusable.focus();
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upper Section */}
        <div className="bg-theme-secondary/30 border-2 border-theme-border p-4">
          <h3 className="font-black uppercase text-sm mb-3">Upper Section</h3>
          <div className="space-y-2">
            {UPPER_CATEGORIES.map((cat) => (
              <div key={cat} ref={(el) => setRowRef(cat, el)}>
                <ScoreRow
                  category={cat}
                  value={scores[cat]}
                  onChange={(val) => onScoreChange(cat, val)}
                  onNavigate={(dir) => navigateToCategory(cat, dir)}
                />
              </div>
            ))}
          </div>
          <div className="border-t-2 border-theme-border mt-3 pt-3 space-y-2">
            {/* Progress toward upper bonus */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>Progress to Bonus</span>
                <span>{upperTotal} / {UPPER_BONUS_THRESHOLD}</span>
              </div>
              <div className="h-2 bg-theme-surface border border-theme-border rounded-sm overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    upperTotal >= UPPER_BONUS_THRESHOLD ? 'bg-green-500' : 'bg-theme-accent'
                  }`}
                  style={{ width: `${Math.min(100, (upperTotal / UPPER_BONUS_THRESHOLD) * 100)}%` }}
                />
              </div>
              {upperTotal < UPPER_BONUS_THRESHOLD && (
                <p className="text-xs text-theme-text/60">
                  Need {UPPER_BONUS_THRESHOLD - upperTotal} more for +35 bonus
                </p>
              )}
            </div>
            <div className="flex justify-between font-bold text-sm">
              <span>Upper Total</span>
              <span>{upperTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Bonus (≥{UPPER_BONUS_THRESHOLD})</span>
              <span className={upperBonus > 0 ? 'text-green-600 font-bold' : ''}>
                {upperBonus > 0 ? `+${upperBonus}` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Lower Section */}
        <div className="bg-theme-accent/20 border-2 border-theme-border p-4">
          <h3 className="font-black uppercase text-sm mb-3">Lower Section</h3>
          <div className="space-y-2">
            {LOWER_CATEGORIES.map((cat) => (
              <div key={cat} ref={(el) => setRowRef(cat, el)}>
                <ScoreRow
                  category={cat}
                  value={scores[cat]}
                  onChange={(val) => onScoreChange(cat, val)}
                  onNavigate={(dir) => navigateToCategory(cat, dir)}
                />
              </div>
            ))}
          </div>
          <div className="border-t-2 border-theme-border mt-3 pt-3 space-y-2">
            <div className="flex justify-between font-bold text-sm">
              <span>Lower Total</span>
              <span>{lowerTotal}</span>
            </div>
            <div
              ref={yahtzeeBonusRef}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
            >
              <span className="font-medium">Yahtzee Bonus</span>
              <YahtzeeBonusButtons
                value={yahtzeeBonus}
                onChange={onYahtzeeBonusChange}
                yahtzeeScored={scores.yahtzee !== null && scores.yahtzee > 0}
                onNavigate={(dir) => navigateToCategory('yahtzeeBonus', dir)}
                onTabToNext={onRequestNextFocus}
              />
            </div>
            {!scores.yahtzee && (
              <p className="text-xs text-theme-text/60">Score a Yahtzee to enable bonus</p>
            )}
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="bg-theme-primary text-theme-surface p-4 flex justify-between items-center">
        <span className="font-black uppercase text-lg">Grand Total</span>
        <span className="text-responsive-2xl font-black">{grandTotal}</span>
      </div>
    </div>
  );
}

// Click boxes for categories with sequential fixed values
function ClickBoxes({
  values,
  value,
  onChange,
  onNavigate,
}: {
  values: number[];
  value: number | null;
  onChange: (value: number | null) => void;
  onNavigate: (direction: 'up' | 'down') => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onNavigate('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onNavigate('down');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = value !== null ? values.indexOf(value) : -1;
      if (currentIndex < values.length - 1) {
        onChange(values[currentIndex + 1]);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentIndex = value !== null ? values.indexOf(value) : -1;
      if (currentIndex > 0) {
        onChange(values[currentIndex - 1]);
      }
    }
  };

  const handleFocus = () => {
    // Set initial value to 0 when first focusing (if not already set)
    if (value === null) {
      onChange(0);
    }
  };

  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    >
      {values.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          tabIndex={-1}
          className={`min-w-[40px] h-10 px-2 border-2 border-theme-border font-bold text-sm transition-all ${
            value === v
              ? 'bg-theme-accent shadow-theme-brutal-sm'
              : 'bg-theme-surface hover:bg-theme-secondary'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

// Slider for variable score categories (threeOfAKind, fourOfAKind, chance)
function ScoreSlider({
  value,
  onChange,
  onNavigate,
  min,
  max,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  onNavigate: (direction: 'up' | 'down') => void;
  min: number;
  max: number;
}) {
  const currentVal = value ?? min;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onNavigate('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onNavigate('down');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(Math.min(max, currentVal + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(Math.max(min, currentVal - 1));
    }
  };

  const handleFocus = () => {
    // Set initial value to min (6 for sliders) when first focusing
    if (value === null) {
      onChange(min);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-1 max-w-xs">
      <input
        type="range"
        min={min}
        max={max}
        value={currentVal}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className="flex-1 h-3 appearance-none bg-theme-surface border-2 border-theme-border cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-6
          [&::-webkit-slider-thumb]:h-6
          [&::-webkit-slider-thumb]:bg-theme-accent
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-theme-border
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-6
          [&::-moz-range-thumb]:h-6
          [&::-moz-range-thumb]:bg-theme-accent
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-theme-border
          [&::-moz-range-thumb]:cursor-pointer"
      />
      <span className="min-w-[3ch] text-right font-bold text-lg tabular-nums">
        {value ?? '—'}
      </span>
    </div>
  );
}

function ScoreRow({
  category,
  value,
  onChange,
  onNavigate,
}: {
  category: ScoreCategory;
  value: number | null;
  onChange: (value: number | null) => void;
  onNavigate: (direction: 'up' | 'down') => void;
}) {
  const range = SCORE_RANGES[category];

  // Determine input type based on category
  const isOnes = category === 'ones';
  const isSlider = ['threeOfAKind', 'fourOfAKind', 'chance'].includes(category);
  const hasFixedValues = range.fixed && range.fixed.length <= 6;

  // For ones: 0-5
  const onesValues = [0, 1, 2, 3, 4, 5];

  // Slider ranges - all sliders are 6-36
  const sliderMin = 6;
  const sliderMax = 36;

  return (
    <div className={`flex items-center justify-between gap-2 ${isSlider ? 'flex-col items-stretch sm:flex-row sm:items-center' : ''}`}>
      <label className="font-medium text-sm shrink-0">{CATEGORY_NAMES[category]}</label>

      {isOnes ? (
        <ClickBoxes values={onesValues} value={value} onChange={onChange} onNavigate={onNavigate} />
      ) : isSlider ? (
        <ScoreSlider
          value={value}
          onChange={onChange}
          onNavigate={onNavigate}
          min={sliderMin}
          max={sliderMax}
        />
      ) : hasFixedValues ? (
        <ClickBoxes values={range.fixed!} value={value} onChange={onChange} onNavigate={onNavigate} />
      ) : (
        <input
          type="number"
          min={range.min}
          max={range.max}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          placeholder="—"
          className="w-20 h-10 border-2 border-theme-border bg-theme-surface p-1 font-bold text-center"
        />
      )}
    </div>
  );
}
