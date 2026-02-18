'use client';

import { useAuth } from '../context/AuthContext';

export default function AuthButton() {
  const { user, isLocalMode, isConfigured, signIn, signOut, error } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium hidden sm:inline">
          {isLocalMode ? (
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Guest
            </span>
          ) : (
            user.displayName || user.email
          )}
        </span>
        <button
          onClick={() => signOut()}
          className="px-3 py-1.5 bg-theme-surface border-2 border-theme-border font-bold text-sm uppercase hover:bg-theme-secondary transition-colors"
        >
          {isLocalMode ? 'End Session' : 'Sign Out'}
        </button>
      </div>
    );
  }

  // When Firebase isn't configured, don't show sign-in button here
  // (The main page handles showing the guest option)
  if (!isConfigured) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => signIn()}
        className="px-4 py-2 bg-theme-primary text-theme-surface border-4 border-theme-border shadow-theme-brutal-sm font-bold uppercase hover:shadow-theme-brutal transition-shadow"
      >
        Sign in with Google
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
