import { MaterialIcons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";
import { BottomNavigation, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors }) => {
        // Create an array of routes with icons and labels
        const routes = state.routes.map((route) => {
          const { options } = descriptors[route.key];
          const label = options.title || route.name;

          return {
            ...route,
            title: label,
            focusedIcon: route.name === "index" ? "home" : "qr-code-scanner",
            unfocusedIcon: route.name === "index" ? "home" : "qr-code-scanner",
          };
        });

        return (
          <BottomNavigation.Bar
            navigationState={{ index: state.index, routes }}
            onTabPress={({ route }) => {
              const index = state.routes.findIndex((r) => r.key === route.key);
              if (index === -1) return;
              const selectedTabRoute = state.routes[index];
              navigation.dispatch(
                CommonActions.navigate({
                  name: selectedTabRoute.name,
                  merge: true,
                })
              );
            }}
            renderIcon={({ route, color, focused }) => (
              <MaterialIcons
                name={
                  focused
                    ? (route.focusedIcon as any)
                    : (route.unfocusedIcon as any)
                }
                size={24}
                color={color}
              />
            )}
            style={{
              backgroundColor:
                theme.colors.elevation?.level2 || theme.colors.surface,
              height: 80 + insets.bottom,
              paddingBottom: insets.bottom,
            }}
            activeColor={Colors[colorScheme ?? "light"].tint}
            inactiveColor={Colors[colorScheme ?? "light"].tabIconDefault}
            shifting={false}
          />
        );
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
        }}
      />
    </Tabs>
  );
}
