import AsyncStorage from '@react-native-async-storage/async-storage';

// User interface
interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: any;
}

// Storage Keys Configuration
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  LANGUAGE: 'app_language',
  THEME: 'app_theme',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LAST_SYNC_TIME: 'last_sync_time',
} as const;

// Legacy token and user keys for backward compatibility
const TOKEN_KEY = "@access_token";
const USER_KEY = "@user";

// AsyncStorage Service Functions
export class AsyncStorageService {
  
  // Generic storage operations
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      throw error;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      throw error;
    }
  }

  // Specific storage operations
  static async setObject(key: string, value: object): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error setting object ${key}:`, error);
      throw error;
    }
  }

  static async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error getting object ${key}:`, error);
      throw error;
    }
  }

  // Auth related storage
  static async setAuthToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static async getAuthToken(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  static async setRefreshToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  static async getRefreshToken(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  static async setUserData(userData: object): Promise<void> {
    await this.setObject(STORAGE_KEYS.USER_DATA, userData);
  }

  static async getUserData<T>(): Promise<T | null> {
    return await this.getObject<T>(STORAGE_KEYS.USER_DATA);
  }

  static async clearAuthData(): Promise<void> {
    await Promise.all([
      this.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      this.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      this.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
  }

  // App settings storage
  static async setLanguage(language: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  static async getLanguage(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.LANGUAGE);
  }

  static async setTheme(theme: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.THEME, theme);
  }

  static async getTheme(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.THEME);
  }

  static async setOnboardingCompleted(completed: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed.toString());
  }

  static async getOnboardingCompleted(): Promise<boolean> {
    const value = await this.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  }

  static async setLastSyncTime(time: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.LAST_SYNC_TIME, time);
  }

  static async getLastSyncTime(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
  }
}

// Legacy functions for backward compatibility
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const clearToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const saveUser = async (user: any) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  try {
    const serializedUser = await AsyncStorage.getItem(USER_KEY);
    if (serializedUser === null) return null;
    return JSON.parse(serializedUser) as User;
  } catch (error) {
    throw new Error("Error getting user data");
  }
};

export const clearUser = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};

export const saveRefreshToken = async (refreshToken: string) => {
  await AsyncStorage.setItem("refreshToken", refreshToken);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("refreshToken");
};