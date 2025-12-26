'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/app/lib/theme-context';
import { themes } from '@/app/lib/themes';

export function ThemeSwitcher() {
  const { currentTheme, setTheme, customizations, updateCustomizations } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
    switch (currentTheme.id) {
      case 'minimal':
        return "w-12 h-12 rounded-full bg-white border-2 border-stone-200 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow text-stone-600 hover:text-stone-800";
      case 'swiss':
        return "w-12 h-12 bg-white border-2 border-gray-900 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors text-gray-900";
      case 'neo-brutalist':
        return "w-14 h-14 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow transform rotate-12 hover:rotate-0 text-black font-black";
      default:
        return "w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow";
    }
  };

  const getPanelStyle = () => {
    switch (currentTheme.id) {
      case 'minimal':
        return "absolute top-16 right-0 w-80 bg-white border border-stone-200 rounded-lg shadow-xl p-6";
      case 'swiss':
        return "absolute top-16 right-0 w-80 bg-white border-2 border-gray-900 p-6 shadow-none";
      case 'neo-brutalist':
        return "absolute top-20 right-0 w-80 bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform -rotate-2";
      default:
        return "absolute top-16 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-6";
    }
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
          <h3 className={`mb-4 ${currentTheme.id === 'neo-brutalist' ? 'text-2xl font-black font-serif uppercase text-black' : currentTheme.id === 'swiss' ? 'text-lg font-normal text-gray-900' : 'text-lg font-semibold text-stone-800'}`}>
            {currentTheme.id === 'neo-brutalist' ? 'Design Chaos!' : 'Design System'}
          </h3>
          
          {/* Theme Selection */}
          <div className="mb-6">
            <h4 className={`text-sm mb-3 ${currentTheme.id === 'neo-brutalist' ? 'font-black uppercase text-black' : currentTheme.id === 'swiss' ? 'font-normal uppercase tracking-widest text-gray-500' : 'font-medium text-stone-700'}`}>
              Theme Style
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(themes).map((theme) => {
                const getThemeButtonStyle = () => {
                  const isActive = currentTheme.id === theme.id;
                  switch (currentTheme.id) {
                    case 'minimal':
                      return `p-3 text-left rounded-md border-2 transition-colors ${
                        isActive 
                          ? 'border-stone-400 bg-stone-50' 
                          : 'border-stone-200 hover:border-stone-300'
                      }`;
                    case 'swiss':
                      return `p-3 text-left border-2 transition-colors ${
                        isActive 
                          ? 'border-red-600 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-900'
                      }`;
                    case 'neo-brutalist':
                      return `p-3 text-left border-4 border-black transition-colors transform hover:rotate-1 ${
                        isActive 
                          ? 'bg-orange-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                          : 'bg-white hover:bg-pink-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      }`;
                    default:
                      return `p-3 text-left rounded-md border-2 transition-colors ${
                        isActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`;
                  }
                };
                
                return (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={getThemeButtonStyle()}
                  >
                    <div className={`${currentTheme.id === 'neo-brutalist' ? 'font-black' : currentTheme.id === 'swiss' ? 'font-normal' : 'font-medium'}`}>
                      {theme.name}
                    </div>
                    <div className={`text-sm ${currentTheme.id === 'neo-brutalist' ? 'font-bold text-black' : currentTheme.id === 'swiss' ? 'text-gray-600' : 'text-stone-500'}`}>
                      {theme.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scale Controls */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Typography Scale</h4>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.1"
              value={customizations.scale}
              onChange={(e) => updateCustomizations({ scale: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(customizations.scale! * 100)}%
            </div>
          </div>

          {/* Spacing Controls */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Spacing Scale</h4>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.1"
              value={customizations.spacing}
              onChange={(e) => updateCustomizations({ spacing: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(customizations.spacing! * 100)}%
            </div>
          </div>

          {/* Color Preview */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Color Palette</h4>
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

          <div className="text-xs text-gray-500 pt-3 border-t">
            This theme switcher is itself a featured project on this site.
          </div>
        </div>
      )}
    </div>
  );
}