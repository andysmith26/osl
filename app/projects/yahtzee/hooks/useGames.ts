'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase-client';
import { useAuth } from '../context/AuthContext';
import { YahtzeeGame, PlayerGameScore } from '../lib/types';

const LOCAL_GAMES_KEY = 'yahtzee-local-games';

interface UseGamesReturn {
  games: YahtzeeGame[];
  loading: boolean;
  error: Error | null;
  addGame: (game: {
    date: string;
    players: PlayerGameScore[];
    winnerId: number;
    notes?: string;
  }) => Promise<string>;
  deleteGame: (gameId: string) => Promise<void>;
  updateGame: (gameId: string, updates: Partial<YahtzeeGame>) => Promise<void>;
}

// Helper to load games from session storage
function loadLocalGames(): YahtzeeGame[] {
  try {
    const data = sessionStorage.getItem(LOCAL_GAMES_KEY);
    if (data) {
      return JSON.parse(data) as YahtzeeGame[];
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

// Helper to save games to session storage
function saveLocalGames(games: YahtzeeGame[]): void {
  sessionStorage.setItem(LOCAL_GAMES_KEY, JSON.stringify(games));
}

export function useGames(): UseGamesReturn {
  const { user, isLocalMode } = useAuth();
  const [games, setGames] = useState<YahtzeeGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Keep track of local games for reactivity
  const localGamesRef = useRef<YahtzeeGame[]>([]);

  useEffect(() => {
    if (!user) {
      setGames([]);
      setLoading(false);
      return;
    }

    // Handle local mode - load from session storage
    if (isLocalMode) {
      const localGames = loadLocalGames();
      localGamesRef.current = localGames;
      setGames(localGames);
      setLoading(false);
      setError(null);
      return;
    }

    // Firebase mode
    const db = getFirebaseDb();
    if (!db) {
      setLoading(false);
      setError(new Error('Firebase not initialized'));
      return;
    }

    const gamesRef = collection(db, 'users', user.uid, 'games');
    const q = query(gamesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const gamesData: YahtzeeGame[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as YahtzeeGame[];
        setGames(gamesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isLocalMode]);

  const addGame = useCallback(
    async (game: {
      date: string;
      players: PlayerGameScore[];
      winnerId: number;
      notes?: string;
    }): Promise<string> => {
      if (!user) throw new Error('Not authenticated');

      const now = Date.now();

      // Handle local mode
      if (isLocalMode) {
        const newGame: YahtzeeGame = {
          id: 'local-' + Math.random().toString(36).substring(2, 15),
          ...game,
          userId: user.uid,
          createdAt: now,
          updatedAt: now,
        };
        const updatedGames = [newGame, ...localGamesRef.current];
        localGamesRef.current = updatedGames;
        saveLocalGames(updatedGames);
        setGames(updatedGames);
        return newGame.id;
      }

      // Firebase mode
      const db = getFirebaseDb();
      if (!db) throw new Error('Firebase not initialized');

      const gamesRef = collection(db, 'users', user.uid, 'games');

      const docRef = await addDoc(gamesRef, {
        ...game,
        userId: user.uid,
        createdAt: now,
        updatedAt: now,
      });

      return docRef.id;
    },
    [user, isLocalMode]
  );

  const deleteGame = useCallback(
    async (gameId: string): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      // Handle local mode
      if (isLocalMode) {
        const updatedGames = localGamesRef.current.filter((g) => g.id !== gameId);
        localGamesRef.current = updatedGames;
        saveLocalGames(updatedGames);
        setGames(updatedGames);
        return;
      }

      // Firebase mode
      const db = getFirebaseDb();
      if (!db) throw new Error('Firebase not initialized');

      const gameRef = doc(db, 'users', user.uid, 'games', gameId);
      await deleteDoc(gameRef);
    },
    [user, isLocalMode]
  );

  const updateGame = useCallback(
    async (gameId: string, updates: Partial<YahtzeeGame>): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      const now = Date.now();

      // Handle local mode
      if (isLocalMode) {
        const updatedGames = localGamesRef.current.map((g) =>
          g.id === gameId ? { ...g, ...updates, updatedAt: now } : g
        );
        localGamesRef.current = updatedGames;
        saveLocalGames(updatedGames);
        setGames(updatedGames);
        return;
      }

      // Firebase mode
      const db = getFirebaseDb();
      if (!db) throw new Error('Firebase not initialized');

      const gameRef = doc(db, 'users', user.uid, 'games', gameId);
      await updateDoc(gameRef, {
        ...updates,
        updatedAt: now,
      });
    },
    [user, isLocalMode]
  );

  return { games, loading, error, addGame, deleteGame, updateGame };
}
