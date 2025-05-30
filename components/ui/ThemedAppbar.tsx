import React from "react";
import { Appbar, useTheme } from "react-native-paper";

export function ThemedAppbar() {
  const theme = useTheme();
  return (
    <Appbar.Header
      style={{
        backgroundColor: theme.colors.elevation?.level2 || theme.colors.surface,
      }}
    >
      <Appbar.BackAction onPress={() => {}} />
      <Appbar.Content title="TripTab" />
      <Appbar.Action icon="calendar" onPress={() => {}} />
      <Appbar.Action icon="magnify" onPress={() => {}} />
    </Appbar.Header>
  );
}
