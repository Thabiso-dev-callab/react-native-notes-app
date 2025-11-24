import React, { createContext, useContext, useState } from 'react';
import { DefaultTheme, MD3DarkTheme, Theme } from 'react-native-paper';

const Light = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: '#4f46e5' },
};

const Dark = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, primary: '#7c3aed' },
};

const ThemeContext = createContext({
  dark: false,
  toggle: () => {},
  theme: Light as Theme,
});

export const DarkThemeProvider = ({ children }: any) => {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(d=>!d);
  return <ThemeContext.Provider value={{ dark, toggle, theme: dark?Dark:Light }}>{children}</ThemeContext.Provider>;
};

export const useDarkTheme = () => useContext(ThemeContext);
