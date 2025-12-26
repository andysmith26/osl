'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeId, ThemeConfig, getTheme } from './themes';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (themeId: ThemeId) => void;
  customizations: {
    colorScheme?: string;
    scale?: number;
    spacing?: number;
  };
  updateCustomizations: (customizations: Partial<ThemeContextType['customizations']>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'osl-theme-preferences';

function getInitialThemeState() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { themeId, customizations: savedCustomizations } = JSON.parse(saved);
        return {
          themeId: themeId || 'minimal',
          customizations: savedCustomizations || {
            colorScheme: 'default',
            scale: 1,
            spacing: 1,
          }
        };
      } catch {
        console.warn('Failed to load theme preferences');
      }
    }
  }
  return {
    themeId: 'minimal' as ThemeId,
    customizations: {
      colorScheme: 'default',
      scale: 1,
      spacing: 1,
    }
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [initialState] = useState(getInitialThemeState);
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(initialState.themeId);
  const [customizations, setCustomizations] = useState(initialState.customizations);

  // Save preferences when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        themeId: currentThemeId,
        customizations,
      }));
    }
  }, [currentThemeId, customizations]);

  // Apply CSS custom properties when theme changes
  useEffect(() => {
    const theme = getTheme(currentThemeId);
    const root = document.documentElement;

    // Apply base theme colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply spacing with scale
    Object.entries(theme.spacing).forEach(([key, value]) => {
      const scaledValue = parseFloat(value) * customizations.spacing;
      root.style.setProperty(`--spacing-${key}`, `${scaledValue}rem`);
    });

    // Apply typography
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);
    if (theme.fonts.mono) {
      root.style.setProperty('--font-mono', theme.fonts.mono);
    }

    // Apply layout properties
    root.style.setProperty('--border-radius', theme.layout.borderRadius);
    
    // Apply typography scale
    const baseSize = parseFloat(theme.typography.baseSize) * customizations.scale;
    root.style.setProperty('--text-base', `${baseSize}rem`);
    
    // Set theme class on body for conditional styling
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .concat(`theme-${currentThemeId}`)
      .join(' ');
      
  }, [currentThemeId, customizations]);

  const setTheme = (themeId: ThemeId) => {
    setCurrentThemeId(themeId);
  };

  const updateCustomizations = (newCustomizations: Partial<ThemeContextType['customizations']>) => {
    setCustomizations((prev: ThemeContextType['customizations']) => ({ ...prev, ...newCustomizations }));
  };

  const value = {
    currentTheme: getTheme(currentThemeId),
    setTheme,
    customizations,
    updateCustomizations,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}