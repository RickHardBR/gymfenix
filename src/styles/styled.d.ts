import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: 'dark' | 'light';
    colors: {
      background: string;
      surface: string;
      surfaceHover: string;
      surfaceActive: string;
      border: string;
      borderFocus: string;
      primary: string;
      primaryHover: string;
      primaryLight: string;
      accent: string;
      accentHover: string;
      success: string;
      successLight: string;
      warning: string;
      warningLight: string;
      danger: string;
      dangerLight: string;
      text: string;
      textSecondary: string;
      textMuted: string;
      cardBg: string;
      inputBg: string;
    };
    fonts: {
      main: string;
    };
    radii: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      glow: string;
    };
  }
}
