import { ReceiptScanResult } from "@/services/receiptScanner";
import { ReceiptItem } from "@/store/useStore";
import React, { useState } from "react";
import {
  Alert,
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
  TextInput,
  useTheme,
} from "react-native-paper";

interface ReceiptConfirmationProps {
  imageUri: string;
  scanResult: ReceiptScanResult;
  onConfirm: (items: ReceiptItem[]) => void;
  onCancel: () => void;
}

export default function ReceiptConfirmation({
  imageUri,
  scanResult,
  onConfirm,
  onCancel,
}: ReceiptConfirmationProps) {
  const theme = useTheme();
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [currentScanResult, setCurrentScanResult] = useState(scanResult);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number>(-1);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    quantity: "1",
  });

  const handleEditItem = (item: ReceiptItem, index: number) => {
    setEditingItemIndex(index);
    setEditForm({
      name: item.name,
      price: item.price.toString(),
      quantity: (item.quantity || 1).toString(),
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!currentScanResult || editingItemIndex < 0) return;

    const price = parseFloat(editForm.price);
    const quantity = parseInt(editForm.quantity);

    if (isNaN(price) || price < 0) {
      Alert.alert("Invalid Price", "Please enter a valid price.");
      return;
    }

    if (isNaN(quantity) || quantity < 1) {
      Alert.alert(
        "Invalid Quantity",
        "Please enter a valid quantity (1 or more)."
      );
      return;
    }

    const updatedItems = [...currentScanResult.items];
    updatedItems[editingItemIndex] = {
      ...updatedItems[editingItemIndex],
      name: editForm.name.trim(),
      price: price,
      quantity: quantity,
    };

    setCurrentScanResult({
      ...currentScanResult,
      items: updatedItems,
    });

    setShowEditModal(false);
    setEditingItemIndex(-1);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingItemIndex(-1);
  };

  const calculateTotal = () => {
    return (
      currentScanResult.items.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      ) + (currentScanResult.total_tax || 0)
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

          {currentScanResult.items.length === 0 ? (
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              No items found. Please try scanning again with better lighting.
            </Text>
          ) : (
            currentScanResult.items.map((item, index) => (
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
                    onPress={() => handleEditItem(item, index)}
                  />
                </View>
                {index < currentScanResult.items.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </View>
            ))
          )}

          {/* Total */}
          <Divider style={[styles.divider, styles.totalDivider]} />
          <View style={styles.totalRow}>
            <Text variant="titleLarge" style={styles.totalLabel}>
              Total Tax:
            </Text>
            <Text
              variant="titleLarge"
              style={[styles.totalAmount, { color: theme.colors.primary }]}
            >
              {formatCurrency(currentScanResult.total_tax || 0)}
            </Text>
          </View>
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
          onPress={() => onConfirm(currentScanResult.items)}
          style={[styles.button, styles.confirmButton]}
          disabled={currentScanResult.items.length === 0}
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

      {/* Edit Item Modal */}
      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={handleCancelEdit}
          contentContainerStyle={[
            styles.editModal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text variant="headlineSmall" style={styles.editModalTitle}>
            Edit Item
          </Text>

          <Divider style={styles.editModalDivider} />

          <TextInput
            label="Item Name"
            value={editForm.name}
            onChangeText={(text) => setEditForm({ ...editForm, name: text })}
            style={styles.editModalInput}
            mode="outlined"
          />

          <TextInput
            label="Price"
            value={editForm.price}
            onChangeText={(text) => setEditForm({ ...editForm, price: text })}
            style={styles.editModalInput}
            mode="outlined"
            keyboardType="decimal-pad"
            left={<TextInput.Affix text="$" />}
          />

          <TextInput
            label="Quantity"
            value={editForm.quantity}
            onChangeText={(text) =>
              setEditForm({ ...editForm, quantity: text })
            }
            style={styles.editModalInput}
            mode="outlined"
            keyboardType="number-pad"
          />

          <View style={styles.editModalActions}>
            <Button
              mode="outlined"
              onPress={handleCancelEdit}
              style={styles.editModalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveEdit}
              style={styles.editModalButton}
            >
              Save
            </Button>
          </View>
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
  editModal: {
    backgroundColor: "white",
    padding: 24,
    margin: 20,
    borderRadius: 16,
    maxHeight: "80%",
  },
  editModalTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Fredoka_500Medium",
  },
  editModalDivider: {
    marginBottom: 20,
  },
  editModalInput: {
    marginBottom: 16,
  },
  editModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  editModalButton: {
    flex: 1,
  },
});
