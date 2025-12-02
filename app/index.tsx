import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { useTheme, useAuth, useLanguage } from '../contexts';
import { PADDING, FONT_SIZE, SPACING } from '../constants/constants';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleAuthNavigation = () => {
    if (isAuthenticated) {
      router.push('/(screens)');
    } else {
      router.push('/(auth)');
    }
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    changeLanguage(newLanguage);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: PADDING.screen,
    },
    title: {
      fontSize: FONT_SIZE.heading,
      fontWeight: 'bold',
      color: colors.text.primary,
      marginBottom: SPACING.lg,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: FONT_SIZE.lg,
      color: colors.text.secondary,
      marginBottom: SPACING.xl,
      textAlign: 'center',
    },
    button: {
      backgroundColor: colors.text.primary,
      paddingHorizontal: PADDING.button * 2,
      paddingVertical: PADDING.button,
      borderRadius: 8,
      marginBottom: SPACING.md,
      minWidth: 200,
    },
    buttonText: {
      color: colors.text.inverse,
      fontSize: FONT_SIZE.lg,
      fontWeight: '600',
      textAlign: 'center',
    },
    secondaryButton: {
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: PADDING.button * 2,
      paddingVertical: PADDING.button,
      borderRadius: 8,
      minWidth: 200,
    },
    secondaryButtonText: {
      color: colors.text.primary,
      fontSize: FONT_SIZE.lg,
      fontWeight: '600',
      textAlign: 'center',
    },
    userInfo: {
      marginTop: SPACING.xl,
      alignItems: 'center',
    },
    userText: {
      fontSize: FONT_SIZE.md,
      color: colors.text.secondary,
      marginBottom: SPACING.sm,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('navigation.home')}</Text>
      <Text style={styles.subtitle}>
        React Native Boilerplate with i18n, Theme, and Auth
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleAuthNavigation}>
        <Text style={styles.buttonText}>
          {isAuthenticated ? t('navigation.dashboard') : t('auth.login')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={toggleLanguage}>
        <Text style={styles.secondaryButtonText}>
          {t('settings.language')}: {currentLanguage.toUpperCase()}
        </Text>
      </TouchableOpacity>

      {isAuthenticated && user && (
        <View style={styles.userInfo}>
          <Text style={styles.userText}>
            {t('common.welcome')}, {user.name}!
          </Text>
          <Text style={styles.userText}>
            {user.email}
          </Text>
        </View>
      )}
    </View>
  );
}