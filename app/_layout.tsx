import { useFonts } from "@/hooks/useFonts";
import dark from "@/themes/dark";
import light from "@/themes/light";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

import { ThemedAppbar } from "@/components/ui/ThemedAppbar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...light.colors,
  },
  fonts: {
    ...DefaultTheme.fonts,
    ...light.fonts,
  },
};

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...dark.colors,
  },
  fonts: {
    ...DefaultTheme.fonts,
    ...dark.fonts,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
      <ThemedAppbar />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
