import type { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  name: 'dark',
  colors: {
    background: '#0d1117',
    surface: '#161b22',
    surfaceHover: '#1f242c',
    surfaceActive: '#262c36',
    border: '#30363d',
    borderFocus: '#f97316',
    primary: '#f97316', // Fênix Laranja vibrante
    primaryHover: '#ea580c',
    primaryLight: 'rgba(249, 115, 22, 0.15)',
    accent: '#38bdf8', // Ciano atlético
    accentHover: '#0284c7',
    success: '#10b981',
    successLight: 'rgba(16, 185, 129, 0.15)',
    warning: '#f59e0b',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    danger: '#ef4444',
    dangerLight: 'rgba(239, 68, 68, 0.15)',
    text: '#f0f6fc',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    cardBg: '#161b22',
    inputBg: '#0d1117',
  },
  fonts: {
    main: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '22px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(249, 115, 22, 0.3)',
  },
};

export const lightTheme: DefaultTheme = {
  name: 'light',
  colors: {
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceHover: '#f1f5f9',
    surfaceActive: '#e2e8f0',
    border: '#cbd5e1',
    borderFocus: '#f97316',
    primary: '#ea580c',
    primaryHover: '#c2410c',
    primaryLight: 'rgba(234, 88, 12, 0.12)',
    accent: '#0284c7',
    accentHover: '#0369a1',
    success: '#059669',
    successLight: 'rgba(5, 150, 105, 0.12)',
    warning: '#d97706',
    warningLight: 'rgba(217, 119, 6, 0.12)',
    danger: '#dc2626',
    dangerLight: 'rgba(220, 38, 38, 0.12)',
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    cardBg: '#ffffff',
    inputBg: '#f8fafc',
  },
  fonts: {
    main: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '22px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.12)',
    glow: '0 0 20px rgba(234, 88, 12, 0.2)',
  },
};
