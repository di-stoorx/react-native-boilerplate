// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  colors: typeof import('../constants/constants').THEME_COLORS.light | typeof import('../constants/constants').THEME_COLORS.dark;
}

// Language Types
export type SupportedLanguage = 'en' | 'fr';

export interface LanguageState {
  currentLanguage: SupportedLanguage;
  availableLanguages: typeof import('../constants/constants').SUPPORTED_LANGUAGES;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  autoHide?: boolean;
}

export interface ToastState {
  toasts: ToastMessage[];
}

// Global App State
export interface GlobalState {
  isOnboardingCompleted: boolean;
  isAppReady: boolean;
  networkStatus: 'online' | 'offline';
  lastSyncTime: string | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type ScreenStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  Notifications: undefined;
};