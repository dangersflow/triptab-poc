import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

export default function FontShowcase() {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Header Fonts (Fredoka)
          </Text>

          <View style={styles.fontSection}>
            <Text variant="displayLarge">Display Large</Text>
            <Text variant="displayMedium">Display Medium</Text>
            <Text variant="displaySmall">Display Small</Text>
            <Text variant="headlineLarge">Headline Large</Text>
            <Text variant="headlineMedium">Headline Medium</Text>
            <Text variant="headlineSmall">Headline Small</Text>
            <Text variant="titleLarge">Title Large</Text>
            <Text variant="titleMedium">Title Medium</Text>
            <Text variant="titleSmall">Title Small</Text>
          </View>

          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Body Fonts (Lato)
          </Text>

          <View style={styles.fontSection}>
            <Text variant="bodyLarge">
              Body Large - This is regular body text that should use Lato font
              family for better readability.
            </Text>
            <Text variant="bodyMedium">
              Body Medium - This is medium body text that should also use Lato
              font family.
            </Text>
            <Text variant="bodySmall">
              Body Small - This is small body text in Lato font.
            </Text>
            <Text variant="labelLarge">Label Large</Text>
            <Text variant="labelMedium">Label Medium</Text>
            <Text variant="labelSmall">Label Small</Text>
          </View>

          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Custom Styled Examples
          </Text>

          <View style={styles.fontSection}>
            <Text style={styles.customHeader}>
              Custom Header (Fredoka Bold)
            </Text>
            <Text style={styles.customBody}>
              Custom body text (Lato Regular) - This demonstrates custom styling
              with the new font families.
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
    fontFamily: "Fredoka_600SemiBold",
  },
  fontSection: {
    gap: 8,
    marginBottom: 16,
  },
  customHeader: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Fredoka_700Bold",
    marginBottom: 8,
  },
  customBody: {
    fontSize: 16,
    fontFamily: "Lato_400Regular",
    lineHeight: 24,
  },
});
