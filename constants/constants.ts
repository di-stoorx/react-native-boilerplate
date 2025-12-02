import { useFonts } from "expo-font";

// Font Family Configuration
export const FontFamily = {
  PrimaryFont: "PrimaryFont",
  PrimaryFontLight: "PrimaryFontLight",
  PrimaryFontBold: "PrimaryFontBold",
  PrimaryFontMedium: "PrimaryFontMedium",
  SecondaryFont: "SecondaryFont",
  SecondaryFontBold: "SecondaryFontBold",
};

// Custom fonts hook
export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    [FontFamily.PrimaryFont]: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    [FontFamily.PrimaryFontLight]: require("../assets/fonts/Poppins/Poppins-Light.ttf"),
    [FontFamily.PrimaryFontBold]: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    [FontFamily.PrimaryFontMedium]: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    [FontFamily.SecondaryFont]: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    [FontFamily.SecondaryFontBold]: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  return fontsLoaded;
};

// Spacing & Layout
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const PADDING = {
  screen: 16,
  container: 20,
  card: 16,
  button: 12,
  input: 14,
} as const;

export const BORDER_RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
} as const;

// Typography
export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  heading: 32,
} as const;

export const FONT_WEIGHT = {
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
} as const;

// Colors
export const COLORS = {
  // Primary Colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Secondary Colors
  secondary: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Success Colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Error Colors
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Warning Colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Info Colors
  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },

  // Neutral Colors
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
} as const;

// Theme Colors (can be switched based on theme)
export const THEME_COLORS = {
  light: {
    background: COLORS.white,
    surface: COLORS.secondary[50],
    text: {
      primary: COLORS.secondary[900],
      secondary: COLORS.secondary[600],
      disabled: COLORS.secondary[400],
      inverse: COLORS.white,
    },
    border: COLORS.secondary[200],
    divider: COLORS.secondary[100],
    overlay: "rgba(0, 0, 0, 0.5)",
  },
  dark: {
    background: COLORS.secondary[900],
    surface: COLORS.secondary[800],
    text: {
      primary: COLORS.white,
      secondary: COLORS.secondary[300],
      disabled: COLORS.secondary[500],
      inverse: COLORS.secondary[900],
    },
    border: COLORS.secondary[700],
    divider: COLORS.secondary[800],
    overlay: "rgba(0, 0, 0, 0.7)",
  },
} as const;

// Screen Dimensions
export const SCREEN_WIDTH = "100%";
export const SCREEN_HEIGHT = "100%";

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// API Configuration (BASE_URL is handled in helpers/apiHelpers.ts)
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
] as const;

// Default Values
export const DEFAULTS = {
  LANGUAGE: "en",
  THEME: "light",
  TIMEOUT: 5000,
} as const;
