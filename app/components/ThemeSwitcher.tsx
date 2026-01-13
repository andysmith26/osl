'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/app/lib/theme-context';

export function ThemeSwitcher() {
  const { currentTheme, customizations, updateCustomizations } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // Prevent hydration mismatch by using default styles until client loads
  if (!isClient) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <button
          className="w-12 h-12 rounded-full bg-white border-2 border-stone-200 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow text-stone-600 hover:text-stone-800"
          aria-label="Theme Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>
      </div>
    );
  }

  const getButtonStyle = () => {
    return "w-14 h-14 bg-yellow-400 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-12 hover:rotate-0 text-black font-black border-responsive-thick scale-responsive-subtle flex items-center justify-center transition-all duration-300";
  };

  const getPanelStyle = () => {
    return "top-20 w-80 bg-yellow-400 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-responsive-md transform -rotate-2 border-responsive-thick absolute right-0 scale-responsive-subtle transition-transform duration-300";
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={getButtonStyle()}
        aria-label="Theme Settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>

      {isOpen && (
        <div className={getPanelStyle()}>
          <h3 className="mb-4 text-2xl font-black font-serif uppercase text-black">
            Design Chaos!
          </h3>

          {/* Size Controls */}
          <div className="mb-6">
            <h4 className="text-sm mb-3 font-black uppercase text-black">Size Scale</h4>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={customizations.size}
              onChange={(e) => updateCustomizations({ size: parseFloat(e.target.value) })}
              className="w-full accent-orange-500"
            />
            <div className="text-xs mt-1 font-bold text-black">
              {Math.round(customizations.size! * 100)}%
            </div>
          </div>

          {/* Color Preview */}
          <div className="mb-4">
            <h4 className="text-sm mb-3 font-black uppercase text-black">Color Palette</h4>
            <div className="flex gap-2 flex-wrap">
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: currentTheme.colors.primary }}
                title="Primary"
              />
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: currentTheme.colors.secondary }}
                title="Secondary"
              />
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: currentTheme.colors.accent }}
                title="Accent"
              />
              <div 
                className="w-8 h-8 rounded border border-gray-200"
                style={{ backgroundColor: currentTheme.colors.background }}
                title="Background"
              />
            </div>
          </div>

          <div className="text-xs pt-3 border-t-4 border-black font-bold text-black">
            This theme switcher is itself a featured project on this site.
          </div>
        </div>
      )}
    </div>
  );
}
