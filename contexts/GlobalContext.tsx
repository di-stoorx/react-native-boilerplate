import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../services/storage/asyncStorageService';
import { GlobalState, ToastMessage, ToastType } from '../types';

interface GlobalContextType extends GlobalState {
  setOnboardingCompleted: (completed: boolean) => Promise<void>;
  setAppReady: (ready: boolean) => void;
  updateLastSyncTime: () => Promise<void>;
  isLoading: boolean;
  // Toast functionality
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType, title?: string, options?: { duration?: number; autoHide?: boolean }) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState & { isLoading: boolean }>({
    isOnboardingCompleted: false,
    isAppReady: false,
    networkStatus: 'online',
    lastSyncTime: null,
    isLoading: true,
  });

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize global state
  useEffect(() => {
    initializeGlobalState();
  }, []);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setGlobalState(prev => ({
        ...prev,
        networkStatus: state.isConnected ? 'online' : 'offline',
      }));
    });

    return unsubscribe;
  }, []);

  const initializeGlobalState = async () => {
    try {
      const [onboardingCompleted, lastSyncTime] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME),
      ]);

      const netInfo = await NetInfo.fetch();

      setGlobalState(prev => ({
        ...prev,
        isOnboardingCompleted: onboardingCompleted === 'true',
        lastSyncTime: lastSyncTime,
        networkStatus: netInfo.isConnected ? 'online' : 'offline',
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error initializing global state:', error);
      setGlobalState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const setOnboardingCompleted = async (completed: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed.toString());
      setGlobalState(prev => ({
        ...prev,
        isOnboardingCompleted: completed,
      }));
    } catch (error) {
      console.error('Error setting onboarding status:', error);
      throw error;
    }
  };

  const setAppReady = (ready: boolean) => {
    setGlobalState(prev => ({
      ...prev,
      isAppReady: ready,
    }));
  };

  const updateLastSyncTime = async () => {
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, now);
      setGlobalState(prev => ({
        ...prev,
        lastSyncTime: now,
      }));
    } catch (error) {
      console.error('Error updating last sync time:', error);
      throw error;
    }
  };

  // Toast functions
  const generateToastId = () => `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const showToast = (
    message: string,
    type: ToastType = 'info',
    title?: string,
    options?: { duration?: number; autoHide?: boolean }
  ) => {
    const id = generateToastId();
    const newToast: ToastMessage = {
      id,
      type,
      title,
      message,
      duration: options?.duration || 4000,
      autoHide: options?.autoHide !== false, // Default to true
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-hide toast if enabled
    if (newToast.autoHide && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <GlobalContext.Provider
      value={{
        ...globalState,
        setOnboardingCompleted,
        setAppReady,
        updateLastSyncTime,
        toasts,
        showToast,
        hideToast,
        clearAllToasts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};

// Helper hooks
export const useNetworkStatus = () => {
  const { networkStatus } = useGlobal();
  return {
    networkStatus,
    isOnline: networkStatus === 'online',
    isOffline: networkStatus === 'offline',
  };
};

export const useAppState = () => {
  const { isAppReady, isOnboardingCompleted, setOnboardingCompleted, setAppReady } = useGlobal();
  return {
    isAppReady,
    isOnboardingCompleted,
    setOnboardingCompleted,
    setAppReady,
  };
};

export const useToast = () => {
  const { toasts, showToast, hideToast, clearAllToasts } = useGlobal();
  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
    // Convenience methods for different toast types
    showSuccess: (message: string, title?: string, options?: { duration?: number; autoHide?: boolean }) => 
      showToast(message, 'success', title, options),
    showError: (message: string, title?: string, options?: { duration?: number; autoHide?: boolean }) => 
      showToast(message, 'error', title, options),
    showWarning: (message: string, title?: string, options?: { duration?: number; autoHide?: boolean }) => 
      showToast(message, 'warning', title, options),
    showInfo: (message: string, title?: string, options?: { duration?: number; autoHide?: boolean }) => 
      showToast(message, 'info', title, options),
  };
};