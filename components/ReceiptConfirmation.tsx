import { ReceiptScanResult } from "@/services/receiptScanner";
import { ReceiptItem } from "@/store/useStore";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Modal,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

interface ReceiptConfirmationProps {
  imageUri: string;
  scanResult: ReceiptScanResult;
  onConfirm: (items: ReceiptItem[]) => void;
  onCancel: () => void;
  onEditItem: (item: ReceiptItem, index: number) => void;
}

export default function ReceiptConfirmation({
  imageUri,
  scanResult,
  onConfirm,
  onCancel,
  onEditItem,
}: ReceiptConfirmationProps) {
  const theme = useTheme();
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  const calculateTotal = () => {
    return scanResult.items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt Image Preview */}
        <Card style={styles.imageCard}>
          <Card.Content>
            <TouchableOpacity onPress={() => setShowFullscreenImage(true)}>
              <Image
                source={{ uri: imageUri }}
                style={styles.receiptImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>
        {/* Merchant and Date Info */}
        {(scanResult.merchant || scanResult.date) && (
          <Surface style={styles.infoCard} elevation={1}>
            {scanResult.merchant && (
              <Text variant="titleMedium" style={styles.merchantText}>
                {scanResult.merchant}
              </Text>
            )}
            {scanResult.date && (
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {new Date(scanResult.date).toLocaleDateString()}
              </Text>
            )}
          </Surface>
        )}
        {/* Items List */}
        <Surface style={styles.itemsCard} elevation={1}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Scanned Items
          </Text>

          {scanResult.items.length === 0 ? (
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              No items found. Please try scanning again with better lighting.
            </Text>
          ) : (
            scanResult.items.map((item, index) => (
              <View key={item.id}>
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text variant="bodyLarge" style={styles.itemName}>
                      {item.name}
                    </Text>
                    <View style={styles.itemDetails}>
                      <Chip style={styles.quantityChip}>
                        Qty: {item.quantity || 1}
                      </Chip>
                      <Text variant="titleMedium" style={styles.itemPrice}>
                        {formatCurrency(item.price)}
                      </Text>
                    </View>
                  </View>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => onEditItem(item, index)}
                  />
                </View>
                {index < scanResult.items.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </View>
            ))
          )}

          {/* Total */}
          <Divider style={[styles.divider, styles.totalDivider]} />
          <View style={styles.totalRow}>
            <Text variant="titleLarge" style={styles.totalLabel}>
              Total:
            </Text>
            <Text
              variant="titleLarge"
              style={[styles.totalAmount, { color: theme.colors.primary }]}
            >
              {formatCurrency(calculateTotal())}
            </Text>
          </View>
        </Surface>
        {/* Confirmation Message */}
        <Surface style={styles.confirmationCard} elevation={1}>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            Review the scanned items above. You can edit any item by tapping the
            pencil icon.
          </Text>
        </Surface>
      </ScrollView>
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={[styles.button, styles.cancelButton]}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={() => onConfirm(scanResult.items)}
          style={[styles.button, styles.confirmButton]}
          disabled={scanResult.items.length === 0}
        >
          Add to Trip
        </Button>
      </View>
      {/* Fullscreen Image Modal */}
      <Portal>
        <Modal
          visible={showFullscreenImage}
          onDismiss={() => setShowFullscreenImage(false)}
          contentContainerStyle={styles.fullscreenModal}
        >
          <TouchableOpacity
            style={styles.fullscreenContainer}
            onPress={() => setShowFullscreenImage(false)}
            activeOpacity={1}
          >
            <Image
              source={{ uri: imageUri }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
            <IconButton
              icon="close"
              size={30}
              iconColor="white"
              style={styles.closeButton}
              onPress={() => setShowFullscreenImage(false)}
            />
          </TouchableOpacity>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  imageCard: {
    marginBottom: 16,
  },
  receiptImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  merchantText: {
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "Fredoka_500Medium",
  },
  itemsCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 16,
    fontFamily: "Fredoka_500Medium",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: "500",
    marginBottom: 4,
    fontFamily: "Lato_400Regular",
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityChip: {
    height: 24,
  },
  itemPrice: {
    fontWeight: "600",
    fontFamily: "Fredoka_500Medium",
  },
  divider: {
    marginVertical: 4,
  },
  totalDivider: {
    marginTop: 12,
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  totalLabel: {
    fontWeight: "600",
    fontFamily: "Fredoka_600SemiBold",
  },
  totalAmount: {
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Fredoka_700Bold",
  },
  confirmationCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 8,
  },
  confirmButton: {
    marginLeft: 8,
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  fullscreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
