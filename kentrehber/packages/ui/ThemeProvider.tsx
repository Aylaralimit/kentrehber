'use client';
import { createContext, useContext, type ReactNode } from 'react';
import { defaultTheme, type Theme } from '@kentrehber/config/theme';
const ThemeContext = createContext<Theme>(defaultTheme);
export function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
  return useContext(ThemeContext);
}
