import {
  Fredoka_300Light,
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
  useFonts as useFredokaFonts,
} from "@expo-google-fonts/fredoka";
import {
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
  Lato_900Black,
  useFonts as useLatoFonts,
} from "@expo-google-fonts/lato";

export function useFonts() {
  const [fredokaLoaded] = useFredokaFonts({
    Fredoka_300Light,
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });

  const [latoLoaded] = useLatoFonts({
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  return fredokaLoaded && latoLoaded;
}

export const fonts = {
  // Header fonts (Fredoka)
  "Fredoka-Light": "Fredoka_300Light",
  "Fredoka-Regular": "Fredoka_400Regular",
  "Fredoka-Medium": "Fredoka_500Medium",
  "Fredoka-SemiBold": "Fredoka_600SemiBold",
  "Fredoka-Bold": "Fredoka_700Bold",

  // Body fonts (Lato)
  "Lato-Light": "Lato_300Light",
  "Lato-Regular": "Lato_400Regular",
  "Lato-Bold": "Lato_700Bold",
  "Lato-Black": "Lato_900Black",
};
