export type ThemeId = 'neo-brutalist';

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
