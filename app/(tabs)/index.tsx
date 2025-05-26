import { useStore } from "@/store/useStore";
import { StyleSheet, View } from "react-native";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { Button, Text } from "react-native-paper";
import { Easing } from "react-native-reanimated";

export default function Index() {
  const { runningTotal, setRunningTotal } = useStore();

  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      <Text variant="displaySmall">Running Total</Text>
      <AnimatedRollingNumber
        value={runningTotal}
        useGrouping
        enableCompactNotation
        compactToFixed={2}
        textStyle={styles.digits}
        spinningAnimationConfig={{
          duration: 800,
          easing: Easing.elastic(2),
        }}
      />
      <Button onPress={() => setRunningTotal(runningTotal + 120)}>
        <Text variant="titleLarge">Increment</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  digits: {
    fontSize: 32,
    fontWeight: "bold",
    paddingHorizontal: 2,
    color: "#4A90E2",
  },
});
