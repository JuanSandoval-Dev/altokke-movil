import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider } from "@/context/AuthContext";
import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme, StatusBar } from "react-native";
import { paletaColores } from "@/paletaColores";

// Bloqueo el auto hide del splash hasta que la app termine de cargar
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor={paletaColores.fondo} />
        <AnimatedSplashOverlay />
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}
