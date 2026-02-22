import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

// O app usa tema fixo claro (preto/branco) — o DefaultTheme é sobrescrito
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    text: "#111111",
    primary: "#111111",
    card: "#FFFFFF",
    border: "#E0E0E0",
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={AppTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ presentation: "modal", title: "Configurações", headerShown: true }} />
      </Stack>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
    </ThemeProvider>
  );
}
