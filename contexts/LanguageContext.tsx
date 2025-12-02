import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPPORTED_LANGUAGES, DEFAULTS } from '../constants/constants';
import { STORAGE_KEYS } from '../services/storage/asyncStorageService';
import { saveLanguage } from '../i18n';
import { SupportedLanguage, LanguageState } from '../types';

interface LanguageContextType extends LanguageState {
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [languageState, setLanguageState] = useState<LanguageState & { isLoading: boolean }>({
    currentLanguage: DEFAULTS.LANGUAGE as SupportedLanguage,
    availableLanguages: SUPPORTED_LANGUAGES,
    isLoading: true,
  });

  // Initialize language from storage
  useEffect(() => {
    initializeLanguage();
  }, []);

  // Listen to i18n language changes
  useEffect(() => {
    const handleLanguageChange = (language: string) => {
      setLanguageState(prev => ({
        ...prev,
        currentLanguage: language as SupportedLanguage,
      }));
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const initializeLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      const currentLanguage = (savedLanguage || DEFAULTS.LANGUAGE) as SupportedLanguage;

      setLanguageState(prev => ({
        ...prev,
        currentLanguage,
        isLoading: false,
      }));

      // Ensure i18n is synchronized
      if (i18n.language !== currentLanguage) {
        await i18n.changeLanguage(currentLanguage);
      }
    } catch (error) {
      console.error('Error initializing language:', error);
      setLanguageState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const changeLanguage = async (language: SupportedLanguage) => {
    try {
      setLanguageState(prev => ({ ...prev, isLoading: true }));

      // Save language preference and change i18n language
      await saveLanguage(language);

      setLanguageState(prev => ({
        ...prev,
        currentLanguage: language,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error changing language:', error);
      setLanguageState(prev => ({
        ...prev,
        isLoading: false,
      }));
      throw error;
    }
  };

  const getLanguageName = (code: SupportedLanguage): string => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
    return language?.name || code;
  };

  const getLanguageFlag = (code: SupportedLanguage): string => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
    return language?.flag || '🌐';
  };

  return (
    <LanguageContext.Provider
      value={{
        ...languageState,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper hook for getting language info
export const useLanguageInfo = () => {
  const { currentLanguage, availableLanguages } = useLanguage();

  const getCurrentLanguageInfo = () => {
    return availableLanguages.find(lang => lang.code === currentLanguage);
  };

  const getLanguageByCode = (code: SupportedLanguage) => {
    return availableLanguages.find(lang => lang.code === code);
  };

  return {
    currentLanguage,
    availableLanguages,
    getCurrentLanguageInfo,
    getLanguageByCode,
  };
};