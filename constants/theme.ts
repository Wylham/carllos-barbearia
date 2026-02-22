/**
 * CARLLOS BARBEARIA — Design Tokens
 * Tema preto e branco com suporte ao hook useColorScheme existente.
 */

import { Platform } from "react-native";

// Mantido para compatibilidade com hooks/use-theme-color.ts existente
export const Colors = {
  light: {
    text: "#111111",
    background: "#FFFFFF",
    tint: "#111111",
    icon: "#444444",
    tabIconDefault: "#888888",
    tabIconSelected: "#111111",
  },
  dark: {
    text: "#FFFFFF",
    background: "#111111",
    tint: "#FFFFFF",
    icon: "#AAAAAA",
    tabIconDefault: "#666666",
    tabIconSelected: "#FFFFFF",
  },
};

// Tokens do app (tema fixo preto/branco — independente do dark mode do SO)
export const T = {
  colors: {
    black: "#111111",
    white: "#FFFFFF",

    bg: "#FFFFFF",
    surface: "#F7F7F7",
    surfaceAlt: "#EFEFEF",
    border: "#E0E0E0",
    borderStrong: "#BBBBBB",

    textPrimary: "#111111",
    textSecondary: "#555555",
    textMuted: "#999999",
    textInverse: "#FFFFFF",
    textDisabled: "#BBBBBB",

    accent: "#111111",
    accentHover: "#333333",

    // Status de agendamento
    scheduled: "#1A6BB5",
    done: "#2A7A2A",
    cancelled: "#B22020",

    success: "#2A7A2A",
    error: "#B22020",
    warning: "#CC8800",
    info: "#1A6BB5",
  },

  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 14,
    xl: 20,
    full: 9999,
  },

  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },

  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },

  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
