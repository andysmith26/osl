'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeId, ThemeConfig, getTheme } from './themes';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  customizations: {
    colorScheme?: string;
    size?: number;
    boxDensity?: number;
  };
  updateCustomizations: (customizations: Partial<ThemeContextType['customizations']>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'osl-theme-preferences';
export const colorSchemes = [
  { id: 'default', label: 'Default' },
  { id: 'graphite', label: 'Graphite' },
  { id: 'clay', label: 'Clay' },
  { id: 'coastal', label: 'Coastal' },
];

const COLOR_SCHEMES: Record<string, Partial<ThemeConfig['colors']>> = {
  default: {},
  graphite: {
    primary: '#1f2937',
    secondary: '#e5e7eb',
    accent: '#111827',
    background: '#f9fafb',
    surface: '#ffffff',
  },
  clay: {
    primary: '#b45309',
    secondary: '#fef3c7',
    accent: '#92400e',
    background: '#fffbeb',
    surface: '#fff7ed',
  },
  coastal: {
    primary: '#0369a1',
    secondary: '#e0f2fe',
    accent: '#0ea5e9',
    background: '#f0f9ff',
    surface: '#ffffff',
  },
};

function getInitialThemeState() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { customizations: savedCustomizations } = JSON.parse(saved);
        return {
          customizations: savedCustomizations || {
            colorScheme: 'default',
            size: 1,
            boxDensity: 1,
          }
        };
      } catch {
        console.warn('Failed to load theme preferences');
      }
    }
  }
  return {
    customizations: {
      colorScheme: 'default',
      size: 1,
      boxDensity: 1,
    }
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [initialState] = useState(getInitialThemeState);
  const [customizations, setCustomizations] = useState(initialState.customizations);
  const currentThemeId: ThemeId = 'neo-brutalist';

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

    const schemeOverrides = COLOR_SCHEMES[customizations.colorScheme || 'default'] || {};
    const colors = { ...theme.colors, ...schemeOverrides };

    // Apply base theme colors
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply unified size scaling (more dramatic range)
    const sizeScale = customizations.size!;
    
    // Apply spacing with dramatic scaling
    Object.entries(theme.spacing).forEach(([key, value]) => {
      const scaledValue = parseFloat(value) * sizeScale;
      root.style.setProperty(`--spacing-${key}`, `${scaledValue}rem`);
    });

    // Apply typography
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);
    if (theme.fonts.mono) {
      root.style.setProperty('--font-mono', theme.fonts.mono);
    }

    // Apply layout properties with scaling
    const baseBorderRadius = parseFloat(theme.layout.borderRadius.replace('rem', '').replace('px', ''));
    root.style.setProperty('--border-radius', `${baseBorderRadius * sizeScale}rem`);
    
    // Apply dramatic scaling to shadows and borders
    root.style.setProperty('--scale-factor', `${sizeScale}`);
    root.style.setProperty('--border-width', `${Math.max(1, 2 * sizeScale)}px`);
    root.style.setProperty('--border-width-thick', `${Math.max(2, 4 * sizeScale)}px`);
    
    // Apply dramatic typography scaling
    const baseSize = parseFloat(theme.typography.baseSize) * sizeScale;
    
    root.style.setProperty('--text-xs', `${baseSize * 0.75}rem`);
    root.style.setProperty('--text-sm', `${baseSize * 0.875}rem`);
    root.style.setProperty('--text-base', `${baseSize}rem`);
    root.style.setProperty('--text-lg', `${baseSize * 1.125}rem`);
    root.style.setProperty('--text-xl', `${baseSize * 1.25}rem`);
    root.style.setProperty('--text-2xl', `${baseSize * 1.5}rem`);
    root.style.setProperty('--text-3xl', `${baseSize * 1.875}rem`);
    root.style.setProperty('--text-4xl', `${baseSize * 2.25}rem`);
    root.style.setProperty('--text-5xl', `${baseSize * 3}rem`);
    root.style.setProperty('--text-6xl', `${baseSize * 3.75}rem`);
    
    // Set theme class on body for conditional styling
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .concat(`theme-${currentThemeId}`)
      .join(' ');
      
  }, [currentThemeId, customizations]);

  const updateCustomizations = (newCustomizations: Partial<ThemeContextType['customizations']>) => {
    setCustomizations((prev: ThemeContextType['customizations']) => ({ ...prev, ...newCustomizations }));
  };

  const value = {
    currentTheme: getTheme(currentThemeId),
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
