'use client';

import React, { useState } from 'react';
import { useTheme } from '@/app/lib/theme-context';
import { themes } from '@/app/lib/themes';

export function ThemeSwitcher() {
  const { currentTheme, setTheme, customizations, updateCustomizations } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        aria-label="Theme Settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-6 theme-panel">
          <h3 className="text-lg font-semibold mb-4">Design System</h3>
          
          {/* Theme Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Theme Style</h4>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(themes).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`p-3 text-left rounded-md border-2 transition-colors ${
                    currentTheme.id === theme.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-sm text-gray-500">{theme.description}</div>
                </button>
              ))}
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