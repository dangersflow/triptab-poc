import { useStore } from "@/store/useStore";
import { MaterialIcons } from "@expo/vector-icons";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import {
  Button,
  Card,
  DataTable,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { Easing } from "react-native-reanimated";

export default function Index() {
  const {
    runningTotal,
    receiptItems,
    removeReceiptItem,
    clearReceiptItems,
    addReceiptItems,
  } = useStore();
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handleClearAll = () => {
    clearReceiptItems();
  };
  return (
    <ImageBackground
      source={require("@/assets/images/background.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView
        style={[styles.container, { backgroundColor: "transparent" }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Running Total Section */}
        <Surface
          style={[styles.totalCard, { backgroundColor: theme.colors.surface }]}
          elevation={2}
        >
          <View style={styles.totalContent}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <MaterialIcons
                name="person"
                size={32}
                color={theme.colors.onPrimaryContainer}
              />
            </View>
            <Text variant="headlineSmall" style={styles.totalLabel}>
              Our Super Amazing Trip!!!
            </Text>
            <View style={styles.totalAmount}>
              <Text
                style={[styles.dollarSign, { color: theme.colors.primary }]}
              >
                $
              </Text>
              <AnimatedRollingNumber
                value={runningTotal}
                useGrouping
                enableCompactNotation={false}
                toFixed={2}
                textStyle={[styles.digits, { color: theme.colors.primary }]}
                spinningAnimationConfig={{
                  duration: 800,
                  easing: Easing.elastic(2),
                }}
              />
            </View>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {receiptItems.length} items
            </Text>
          </View>
        </Surface>
        {/* Receipt Items Table */}
        {receiptItems.length > 0 ? (
          <Surface
            style={[
              styles.tableCard,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={1}
          >
            <View style={styles.tableHeader}>
              <Text variant="titleLarge" style={styles.tableTitle}>
                Receipt Items
              </Text>
              <Button
                mode="outlined"
                onPress={handleClearAll}
                style={styles.clearButton}
                compact
              >
                Clear All
              </Button>
            </View>

            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.nameColumn}>
                  Item
                </DataTable.Title>
                <DataTable.Title numeric style={styles.qtyColumn}>
                  Qty
                </DataTable.Title>
                <DataTable.Title numeric style={styles.priceColumn}>
                  Price
                </DataTable.Title>
                <DataTable.Title style={styles.actionColumn}> </DataTable.Title>
              </DataTable.Header>
              {receiptItems.map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell style={styles.nameColumn}>
                    <Text variant="bodyMedium" numberOfLines={2}>
                      {item.name}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={styles.qtyColumn}>
                    <Text variant="bodyMedium">{item.quantity || 1}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={styles.priceColumn}>
                    <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                      {formatCurrency(item.price * (item.quantity || 1))}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.actionColumn}>
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => removeReceiptItem(item.id)}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Surface>
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialIcons
                name="receipt-long"
                size={64}
                color={theme.colors.onSurfaceVariant}
                style={styles.emptyIcon}
              />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No Receipts Yet
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  textAlign: "center",
                }}
              >
                Start scanning receipts to track your trip expenses
              </Text>
            </Card.Content>
          </Card>
        )}
        {/* Test Button (temporary) */}
        <View style={styles.testSection}>
          <Button
            mode="contained"
            onPress={() => {
              // Test button to add sample data
              const testItem = {
                id: `test_${Date.now()}`,
                name: `Test Item ${receiptItems.length + 1}`,
                price: Math.random() * 20 + 5,
                quantity: 1,
              };
              addReceiptItems([testItem]);
            }}
            style={styles.testButton}
          >
            Add Test Item
          </Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  totalCard: {
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
  },
  totalContent: {
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  totalAmount: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  dollarSign: {
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 4,
    fontFamily: "Fredoka_700Bold",
  },
  totalLabel: {
    marginBottom: 8,
    fontSize: 28,
    fontFamily: "Fredoka_700Bold",
  },
  digits: {
    fontSize: 48,
    fontWeight: "bold",
    paddingHorizontal: 2,
    marginBottom: 4,
    fontFamily: "Fredoka_700Bold",
  },
  tableCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  tableTitle: {
    fontWeight: "600",
    fontFamily: "Fredoka_500Medium",
  },
  clearButton: {
    minWidth: 80,
  },
  nameColumn: {
    flex: 3,
  },
  qtyColumn: {
    flex: 1,
  },
  priceColumn: {
    flex: 1.5,
  },
  actionColumn: {
    flex: 0.8,
    justifyContent: "center",
  },
  emptyCard: {
    marginVertical: 32,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyTitle: {
    marginBottom: 8,
    fontWeight: "600",
    fontFamily: "Fredoka_500Medium",
  },
  testSection: {
    marginTop: 32,
    marginBottom: 16,
  },
  testButton: {
    marginVertical: 8,
  },
});
