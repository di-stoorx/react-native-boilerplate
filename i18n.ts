import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULTS } from './constants/constants';
import { STORAGE_KEYS } from './services/storage/asyncStorageService';

// Import translation files
import en from './locales/en.json';
import fr from './locales/fr.json';

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

const initI18n = async () => {
  let savedLanguage = DEFAULTS.LANGUAGE;

  try {
    const storedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (storedLanguage) {
      savedLanguage = storedLanguage as typeof DEFAULTS.LANGUAGE;
    } else {
      // Use device language if available
      const deviceLanguages = Localization.getLocales();
      const deviceLanguage = deviceLanguages[0]?.languageCode;
      if (deviceLanguage && Object.keys(resources).includes(deviceLanguage)) {
        savedLanguage = deviceLanguage as typeof DEFAULTS.LANGUAGE;
      }
    }
  } catch (error) {
    console.warn('Error loading saved language:', error);
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: savedLanguage,
    fallbackLng: DEFAULTS.LANGUAGE,
    debug: __DEV__,

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });
};

// Save language preference
export const saveLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// Initialize i18n
initI18n();

export default i18n;