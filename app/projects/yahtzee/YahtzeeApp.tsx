'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TabId } from './lib/types';
import AuthButton from './components/AuthButton';
import GameEntryForm from './components/GameEntryForm';
import GameHistory from './components/GameHistory';
import StatsDashboard from './components/StatsDashboard';

function YahtzeeContent() {
  const { user, loading, isConfigured, isLocalMode, signInLocally } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('newGame');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-theme-surface border-4 border-theme-border shadow-theme-brutal p-8 transform -rotate-1">
          <p className="text-responsive-lg font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConfigured && !user) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-6 text-theme-text hover:text-theme-accent font-bold"
          >
            &larr; Back to projects
          </Link>
          <div className="bg-theme-secondary border-4 border-theme-border shadow-theme-brutal p-8 transform -rotate-1 mb-6">
            <h1 className="text-responsive-3xl font-black font-serif uppercase mb-4">
              Yahtzee Tracker
            </h1>
            <p className="text-responsive-lg mb-6">
              Track your Yahtzee games, see who really wins most often, and discover your best
              categories.
            </p>
            <button
              onClick={signInLocally}
              className="w-full px-6 py-3 bg-theme-accent border-4 border-theme-border shadow-theme-brutal font-bold uppercase hover:translate-x-1 hover:-translate-y-1 hover:shadow-theme-brutal-lg transition-all"
            >
              Continue as Guest
            </button>
            <p className="text-responsive-sm mt-4 text-theme-text/70">
              Your game data will be stored locally and cleared when you close this browser tab.
            </p>
          </div>
          <details className="bg-theme-surface border-4 border-theme-border p-4">
            <summary className="font-bold cursor-pointer">Want to save your data permanently?</summary>
            <div className="mt-4 text-responsive-sm">
              <p className="mb-2">Set up Firebase to sync your games across devices:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a Firebase project at console.firebase.google.com</li>
                <li>Enable Authentication with Google provider</li>
                <li>Create a Firestore database</li>
                <li>Add a web app and copy the config values</li>
                <li>Create a .env.local file with the Firebase config</li>
              </ol>
            </div>
          </details>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-6 text-theme-text hover:text-theme-accent font-bold"
          >
            &larr; Back to projects
          </Link>
          <div className="bg-theme-secondary border-4 border-theme-border shadow-theme-brutal p-8 transform -rotate-1">
            <h1 className="text-responsive-3xl font-black font-serif uppercase mb-4">
              Yahtzee Tracker
            </h1>
            <p className="text-responsive-lg mb-6">
              Track your Yahtzee games, see who really wins most often, and discover your best
              categories.
            </p>
            <AuthButton />
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'newGame', label: 'New Game' },
    { id: 'history', label: 'History' },
    { id: 'stats', label: 'Stats' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <Link
              href="/"
              className="inline-block mb-2 text-theme-text hover:text-theme-accent font-bold text-sm"
            >
              &larr; Back to projects
            </Link>
            <h1 className="text-responsive-2xl font-black font-serif uppercase">
              Yahtzee Tracker
            </h1>
          </div>
          <AuthButton />
        </div>

        {/* Local Mode Banner */}
        {isLocalMode && (
          <div className="bg-yellow-100 border-4 border-theme-border p-3 mb-4 flex items-center gap-2 text-sm">
            <span className="font-bold">Local Mode:</span>
            <span>Data is stored in this browser session only and will be lost when you close this tab.</span>
          </div>
        )}

        {/* Tab Navigation */}
        <nav className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border-4 border-theme-border font-bold uppercase text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-theme-accent shadow-theme-brutal-sm transform -translate-y-0.5'
                  : 'bg-theme-surface hover:bg-theme-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="bg-theme-surface border-4 border-theme-border shadow-theme-brutal p-4 md:p-6">
          {activeTab === 'newGame' && <GameEntryForm />}
          {activeTab === 'history' && <GameHistory />}
          {activeTab === 'stats' && <StatsDashboard />}
        </div>
      </div>
    </div>
  );
}

export default function YahtzeeApp() {
  return (
    <AuthProvider>
      <YahtzeeContent />
    </AuthProvider>
  );
}
