import React from "react";
import { Appbar } from "react-native-paper";

export function ThemedAppbar() {
  return (
    <Appbar.Header
      style={{
        backgroundColor: "transparent",
      }}
    >
      <Appbar.Content title="TripTab" />
      <Appbar.Action icon="account-circle" onPress={() => {}} />
    </Appbar.Header>
  );
}
