import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AppDataProvider } from "@/contexts/AppDataContext";
import { AppThemeProvider, useTheme } from "@/contexts/ThemeContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutInner() {
  const { isDark } = useTheme();

  const NavTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: "#111111",
          card: "#1C1C1C",
          text: "#F0F0F0",
          border: "#2E2E2E",
          primary: "#F0F0F0",
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: "#FFFFFF",
          card: "#FFFFFF",
          text: "#111111",
          border: "#E0E0E0",
          primary: "#111111",
        },
      };

  return (
    <ThemeProvider value={NavTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ presentation: "modal", title: "Configurações", headerShown: true }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor={isDark ? "#111111" : "#FFFFFF"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AppDataProvider>
        <RootLayoutInner />
      </AppDataProvider>
    </AppThemeProvider>
  );
}
