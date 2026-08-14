import { useThemeStore } from '../store/useThemeStore';

/** Convenience hook wrapping the theme store */
export function useTheme() {
  const { theme, toggleTheme } = useThemeStore();
  return { theme, toggleTheme, isDark: theme === 'dark' };
}
