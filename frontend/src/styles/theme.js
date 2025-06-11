import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

const colors = {
  primary: '#70C1B3', // A friendly green
  secondary: '#FFD166', // A warm yellow
  accent: '#A8DADC', // A light blue
  background: '#F5F5F5', // Soft off-white
  cardBackground: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  success: '#2ECC71',
  warning: '#F1C40F',
  error: '#E74C3C',
  lightGray: '#DDDDDD',
  darkGray: '#AAAAAA',
};

const typography = {
  fontFamily: 'Fredoka, Baloo, System', // Playful rounded font, fallback to System
  h1: { fontSize: 32, fontWeight: 'bold', fontFamily: 'Fredoka, Baloo, System' },
  h2: { fontSize: 24, fontWeight: 'bold', fontFamily: 'Fredoka, Baloo, System' },
  h3: { fontSize: 20, fontWeight: 'bold', fontFamily: 'Fredoka, Baloo, System' },
  body: { fontSize: 16, fontFamily: 'Fredoka, Baloo, System' },
  small: { fontSize: 14, fontFamily: 'Fredoka, Baloo, System' },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const borderRadius = {
  sm: 12,
  md: 18,
  lg: 28,
};

const shadows = {
  light: {
    shadowColor: '#70C1B3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  medium: {
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
};

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export const ThemeContext = React.createContext(theme);

export const ThemeProvider = ({ children }) => (
  <StyledThemeProvider theme={theme}>
    {children}
  </StyledThemeProvider>
); 