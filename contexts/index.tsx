import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { GlobalProvider } from './GlobalContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Combined providers wrapper for the entire app
 * This ensures proper provider order and wrapping
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <GlobalProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </GlobalProvider>
  );
};

// Re-export all contexts and hooks for easy importing
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, useTheme, useThemeUtils } from './ThemeContext';
export { LanguageProvider, useLanguage, useLanguageInfo } from './LanguageContext';
export { GlobalProvider, useGlobal, useNetworkStatus, useAppState } from './GlobalContext';

// Export types
export type { User, AuthState, LoginCredentials, RegisterCredentials } from '../types';
export type { ThemeMode, ThemeState } from '../types';
export type { SupportedLanguage, LanguageState } from '../types';
export type { GlobalState } from '../types';