import { View, type ViewProps } from "react-native";
import { useTheme } from "react-native-paper";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();
  const backgroundColor = theme.dark ? darkColor : lightColor;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
