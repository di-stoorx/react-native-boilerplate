/**
 * Unified token manager that synchronizes in-memory and persistent storage
 * This provides fast access while maintaining persistence across app restarts
 */

import { AsyncStorageService, STORAGE_KEYS } from './storage/asyncStorageService';

let globalToken: string | null = null;
let globalRefreshToken: string | null = null;

// Initialize tokens from storage on app start
export const initializeTokensFromStorage = async (): Promise<void> => {
  try {
    const [storedToken, storedRefreshToken] = await Promise.all([
      AsyncStorageService.getAuthToken(),
      AsyncStorageService.getRefreshToken(),
    ]);
    
    globalToken = storedToken;
    globalRefreshToken = storedRefreshToken;
    
    console.log('[TokenManager] Tokens initialized from storage');
  } catch (error) {
    console.error('[TokenManager] Error initializing tokens from storage:', error);
  }
};

// Token getters
export const getGlobalToken = (): string | null => {
  return globalToken;
};

export const getGlobalRefreshToken = (): string | null => {
  return globalRefreshToken;
};

// Token setters (with automatic persistence)
export const setGlobalToken = async (token: string | null): Promise<void> => {
  globalToken = token;
  
  try {
    if (token) {
      await AsyncStorageService.setAuthToken(token);
    } else {
      await AsyncStorageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  } catch (error) {
    console.error('[TokenManager] Error persisting auth token:', error);
  }
};

export const setGlobalRefreshToken = async (refreshToken: string | null): Promise<void> => {
  globalRefreshToken = refreshToken;
  
  try {
    if (refreshToken) {
      await AsyncStorageService.setRefreshToken(refreshToken);
    } else {
      await AsyncStorageService.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  } catch (error) {
    console.error('[TokenManager] Error persisting refresh token:', error);
  }
};

// Synchronous versions for axios interceptor (use when persistence is already handled)
export const setGlobalTokenSync = (token: string | null): void => {
  globalToken = token;
};

export const setGlobalRefreshTokenSync = (refreshToken: string | null): void => {
  globalRefreshToken = refreshToken;
};

// Clear all tokens (both memory and storage)
export const clearGlobalTokens = async (): Promise<void> => {
  globalToken = null;
  globalRefreshToken = null;
  
  try {
    await AsyncStorageService.clearAuthData();
    console.log('[TokenManager] All tokens cleared');
  } catch (error) {
    console.error('[TokenManager] Error clearing tokens:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return globalToken !== null;
};

// Utility to set both tokens at once (for login)
export const setTokens = async (authToken: string, refreshToken: string): Promise<void> => {
  await Promise.all([
    setGlobalToken(authToken),
    setGlobalRefreshToken(refreshToken),
  ]);
};