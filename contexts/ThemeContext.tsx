import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_COLORS, DEFAULTS } from '../constants/constants';
import { STORAGE_KEYS } from '../services/storage/asyncStorageService';
import { ThemeMode, ThemeState } from '../types';

interface ThemeContextType extends ThemeState {
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeState, setThemeState] = useState<ThemeState & { isLoading: boolean }>({
    mode: DEFAULTS.THEME as ThemeMode,
    colors: THEME_COLORS.light,
    isLoading: true,
  });

  // Initialize theme from storage
  useEffect(() => {
    initializeTheme();
  }, []);

  // Listen to system color scheme changes
  useEffect(() => {
    if (themeState.mode === 'system') {
      const effectiveTheme = systemColorScheme === 'dark' ? 'dark' : 'light';
      setThemeState(prev => ({
        ...prev,
        colors: THEME_COLORS[effectiveTheme],
      }));
    }
  }, [systemColorScheme, themeState.mode]);

  const initializeTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      const themeMode = (savedTheme || DEFAULTS.THEME) as ThemeMode;

      const effectiveTheme = getEffectiveTheme(themeMode, systemColorScheme);

      setThemeState({
        mode: themeMode,
        colors: THEME_COLORS[effectiveTheme],
        isLoading: false,
      });
    } catch (error) {
      console.error('Error initializing theme:', error);
      setThemeState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const getEffectiveTheme = (mode: ThemeMode, systemScheme: 'light' | 'dark' | null | undefined): 'light' | 'dark' => {
    switch (mode) {
      case 'dark':
        return 'dark';
      case 'light':
        return 'light';
      case 'system':
        return systemScheme === 'dark' ? 'dark' : 'light';
      default:
        return 'light';
    }
  };

  const setTheme = async (mode: ThemeMode) => {
    try {
      setThemeState(prev => ({ ...prev, isLoading: true }));

      const effectiveTheme = getEffectiveTheme(mode, systemColorScheme);

      await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);

      setThemeState({
        mode,
        colors: THEME_COLORS[effectiveTheme],
        isLoading: false,
      });
    } catch (error) {
      console.error('Error setting theme:', error);
      setThemeState(prev => ({
        ...prev,
        isLoading: false,
      }));
      throw error;
    }
  };

  const toggleTheme = async () => {
    const newMode = themeState.mode === 'light' ? 'dark' : 'light';
    await setTheme(newMode);
  };

  const isDarkMode = () => {
    const effectiveTheme = getEffectiveTheme(themeState.mode, systemColorScheme);
    return effectiveTheme === 'dark';
  };

  return (
    <ThemeContext.Provider
      value={{
        ...themeState,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper hook for theme utilities
export const useThemeUtils = () => {
  const { mode, colors } = useTheme();
  const systemColorScheme = useColorScheme();

  const getEffectiveTheme = (): 'light' | 'dark' => {
    switch (mode) {
      case 'dark':
        return 'dark';
      case 'light':
        return 'light';
      case 'system':
        return systemColorScheme === 'dark' ? 'dark' : 'light';
      default:
        return 'light';
    }
  };

  const isDarkMode = getEffectiveTheme() === 'dark';
  const isLightMode = getEffectiveTheme() === 'light';

  return {
    mode,
    colors,
    isDarkMode,
    isLightMode,
    effectiveTheme: getEffectiveTheme(),
  };
};