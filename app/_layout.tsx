import dark from "@/themes/dark";
import light from "@/themes/light";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

import { ThemedAppbar } from "@/components/ui/ThemedAppbar";

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...light.colors,
  },
};

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...dark.colors,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
