import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

export const colors = {
  primary: '#2E7D32', // Golf green
  secondary: '#1B5E20', // Dark green
  accent: '#F9A825', // Golf flag yellow
  background: '#FFFFFF',
  text: '#333333',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#FFA000',
  info: '#1976D2',
  border: '#E0E0E0',
  disabled: '#BDBDBD',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
};

export const layout = {
  borderRadius: 8,
  padding: spacing.md,
  margin: spacing.md,
};

const theme = {
  colors,
  typography,
  spacing,
  layout,
  shadows,
};

export const ThemeContext = React.createContext(theme);

export const ThemeProvider = ({ children }) => (
  <StyledThemeProvider theme={theme}>
    {children}
  </StyledThemeProvider>
); 