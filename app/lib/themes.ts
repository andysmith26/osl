export type ThemeId = 'minimal' | 'swiss' | 'neo-brutalist';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  fonts: {
    heading: string;
    body: string;
    mono?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    scaleRatio: number;
    baseSize: string;
    lineHeight: {
      tight: number;
      normal: number;
      loose: number;
    };
  };
  layout: {
    maxWidth: string;
    borderRadius: string;
    shadowStyle: string;
    borderStyle: string;
  };
  animations: {
    duration: string;
    easing: string;
  };
}

export const themes: Record<ThemeId, ThemeConfig> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, understated design with warm neutrals',
    fonts: {
      heading: 'var(--font-inter)',
      body: 'var(--font-inter)',
    },
    colors: {
      primary: '#78716c',
      secondary: '#e8e4e0',
      accent: '#a8a29e',
      background: '#fafaf9',
      surface: '#ffffff',
      text: '#1c1917',
      textSecondary: '#78716c',
      border: '#e8e4e0',
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      xxl: '4rem',
    },
    typography: {
      scaleRatio: 1.25,
      baseSize: '1rem',
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        loose: 1.8,
      },
    },
    layout: {
      maxWidth: 'max-w-4xl',
      borderRadius: '0.375rem',
      shadowStyle: 'shadow-sm',
      borderStyle: 'border-stone-200',
    },
    animations: {
      duration: '200ms',
      easing: 'ease-out',
    },
  },
  swiss: {
    id: 'swiss',
    name: 'Swiss',
    description: 'Precise typography and grid-based layouts',
    fonts: {
      heading: 'ui-sans-serif, system-ui, sans-serif',
      body: 'ui-sans-serif, system-ui, sans-serif',
    },
    colors: {
      primary: '#dc2626',
      secondary: '#f5f5f5',
      accent: '#1f2937',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#d1d5db',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.75rem',
      md: '1.25rem',
      lg: '2rem',
      xl: '3.5rem',
      xxl: '5rem',
    },
    typography: {
      scaleRatio: 1.414,
      baseSize: '0.95rem',
      lineHeight: {
        tight: 1.1,
        normal: 1.4,
        loose: 1.6,
      },
    },
    layout: {
      maxWidth: 'max-w-5xl',
      borderRadius: '0',
      shadowStyle: 'shadow-none',
      borderStyle: 'border-gray-900',
    },
    animations: {
      duration: '150ms',
      easing: 'linear',
    },
  },
  'neo-brutalist': {
    id: 'neo-brutalist',
    name: 'Neo-Brutalist',
    description: 'Bold forms with playful, chunky elements',
    fonts: {
      heading: 'ui-serif, Georgia, serif',
      body: 'ui-sans-serif, system-ui, sans-serif',
      mono: 'ui-monospace, monospace',
    },
    colors: {
      primary: '#000000',
      secondary: '#ffff00',
      accent: '#ff6b35',
      background: '#f5f5f5',
      surface: '#ffffff',
      text: '#000000',
      textSecondary: '#333333',
      border: '#000000',
    },
    spacing: {
      xs: '0.75rem',
      sm: '1.25rem',
      md: '2rem',
      lg: '3rem',
      xl: '4rem',
      xxl: '6rem',
    },
    typography: {
      scaleRatio: 1.5,
      baseSize: '1.1rem',
      lineHeight: {
        tight: 1.0,
        normal: 1.3,
        loose: 1.7,
      },
    },
    layout: {
      maxWidth: 'max-w-6xl',
      borderRadius: '1rem',
      shadowStyle: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
      borderStyle: 'border-4 border-black',
    },
    animations: {
      duration: '300ms',
      easing: 'ease-in-out',
    },
  },
};

export function getTheme(id: ThemeId): ThemeConfig {
  return themes[id];
}