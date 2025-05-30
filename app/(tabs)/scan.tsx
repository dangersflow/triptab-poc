import ReceiptConfirmation from "@/components/ReceiptConfirmation";
import { ThemedAppbar } from "@/components/ui/ThemedAppbar";
import {
  mockReceiptScan,
  ReceiptScanResult,
  scanReceiptWithOpenAI,
} from "@/services/receiptScanner";
import { ReceiptItem, useStore } from "@/store/useStore";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Divider,
  FAB,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function Scan() {
  const theme = useTheme();
  const { addReceiptItems } = useStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState<string>("");
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number>(-1);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    quantity: "1",
  });

  const handleRequestPermission = async () => {
    setPermissionRequested(true);
    const result = await requestPermission();

    if (!result?.granted) {
      Alert.alert(
        "Camera Permission Required",
        "TripTab needs camera access to scan receipts. Please enable camera permission in your device settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
    }
    setPermissionRequested(false);
  };
  const processReceipt = async (imageUri: string) => {
    setIsProcessing(true);
    try {
      console.log("Processing receipt...", imageUri);

      // Try OpenAI first, fallback to mock if no API key
      let result: ReceiptScanResult;
      try {
        result = await scanReceiptWithOpenAI(imageUri);
      } catch (error) {
        console.log("OpenAI failed, using mock data:", error);
        result = mockReceiptScan();
      }

      setCurrentImageUri(imageUri);
      setScanResult(result);
      setShowConfirmation(true);
    } catch (err) {
      console.error("Receipt processing error:", err);
      Alert.alert("Error", "Failed to process receipt. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      await handleRequestPermission();
      return;
    }

    if (!cameraRef.current) {
      Alert.alert("Camera Error", "Camera is not ready. Please try again.");
      return;
    }

    try {
      setIsProcessing(true);
      // Take picture directly from CameraView
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) {
        processReceipt(photo.uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Camera Error", "Failed to take photo. Please try again.");
      setIsProcessing(false);
    }
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      processReceipt(result.assets[0].uri);
    }
  };

  const handleConfirmReceipt = (items: ReceiptItem[]) => {
    addReceiptItems(items);
    setShowConfirmation(false);
    setScanResult(null);
    setCurrentImageUri("");

    Alert.alert(
      "Receipt Added!",
      `${items.length} items have been added to your trip.`,
      [{ text: "OK" }]
    );
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setScanResult(null);
    setCurrentImageUri("");
  };
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
    if (!scanResult || editingItemIndex < 0) return;

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

    const updatedItems = [...scanResult.items];
    updatedItems[editingItemIndex] = {
      ...updatedItems[editingItemIndex],
      name: editForm.name.trim(),
      price: price,
      quantity: quantity,
    };

    setScanResult({
      ...scanResult,
      items: updatedItems,
    });

    setShowEditModal(false);
    setEditingItemIndex(-1);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingItemIndex(-1);
  };
  // Show confirmation screen if we have scan results
  if (showConfirmation && scanResult && currentImageUri) {
    return (
      <ReceiptConfirmation
        imageUri={currentImageUri}
        scanResult={scanResult}
        onConfirm={handleConfirmReceipt}
        onCancel={handleCancelConfirmation}
        onEditItem={handleEditItem}
      />
    );
  }

  // Camera Permission Not Granted
  if (!permission?.granted) {
    return (
      <ImageBackground
        source={require("@/assets/images/background.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ThemedAppbar />
        <View style={[styles.container, { backgroundColor: "transparent" }]}>
          <Surface
            style={[
              styles.permissionCard,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={2}
          >
            <MaterialIcons
              name="receipt"
              size={64}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <Text variant="headlineSmall" style={styles.title}>
              Camera Permission Required
            </Text>
            <Text
              variant="bodyLarge"
              style={[styles.description, { color: theme.colors.onSurface }]}
            >
              TripTab needs access to your camera to scan receipts and add them
              to your trips.
            </Text>
            <Button
              mode="contained"
              onPress={handleRequestPermission}
              style={styles.button}
              disabled={permissionRequested}
              loading={permissionRequested}
            >
              {permissionRequested
                ? "Requesting Permission..."
                : "Grant Camera Permission"}
            </Button>
          </Surface>
        </View>
      </ImageBackground>
    );
  }
  // Camera Ready - Show Camera View
  return (
    <ImageBackground
      source={require("@/assets/images/background.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ThemedAppbar />
      <View style={[styles.container, { backgroundColor: "transparent" }]}>        <View style={styles.cameraWindow}>
          <CameraView ref={cameraRef} style={styles.cameraView} facing="back" />
          <View style={styles.overlay}>
            <View style={styles.receiptFrame}>
              <View style={styles.frameCorner} />
              <View style={[styles.frameCorner, styles.topRight]} />
              <View style={[styles.frameCorner, styles.bottomLeft]} />
              <View style={[styles.frameCorner, styles.bottomRight]} />

              <Text variant="bodySmall" style={styles.frameLabel}>
                Receipt Frame
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.instructionContainer}>
          <Text variant="titleMedium" style={styles.instructionText}>
            Position your receipt within the frame
          </Text>
          <Text variant="bodyMedium" style={styles.subInstructionText}>
            Make sure the text is clear and well-lit
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <FAB
            icon="image"
            style={[
              styles.galleryButton,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={handlePickFromGallery}
            disabled={isProcessing}
          />
          <FAB
            icon="camera"
            size="large"
            style={[
              styles.captureButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleTakePhoto}
            loading={isProcessing}
            disabled={isProcessing}
          />
        </View>
      </View>

      {/* Edit Item Modal */}
      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={handleCancelEdit}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Edit Item
          </Text>

          <Divider style={styles.modalDivider} />

          <TextInput
            label="Item Name"
            value={editForm.name}
            onChangeText={(text) => setEditForm({ ...editForm, name: text })}
            style={styles.modalInput}
            mode="outlined"
          />

          <TextInput
            label="Price"
            value={editForm.price}
            onChangeText={(text) => setEditForm({ ...editForm, price: text })}
            style={styles.modalInput}
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
            style={styles.modalInput}
            mode="outlined"
            keyboardType="number-pad"
          />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={handleCancelEdit}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveEdit}
              style={styles.modalButton}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Loading Overlay */}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={styles.loadingSpinner}
            />
            <Text variant="titleMedium" style={styles.loadingText}>
              Processing Receipt...
            </Text>
            <Text variant="bodyMedium" style={styles.loadingSubtext}>
              Extracting items and prices
            </Text>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  permissionCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 300,
    width: "100%",
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
    fontFamily: "Fredoka_500Medium",
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    fontFamily: "Lato_400Regular",
  },
  button: {
    width: "100%",
  },
  cameraWindow: {
    width: 320,
    height: 460,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: "#000",
    position: "relative",
  },
  cameraView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  receiptFrame: {
    width: 220,
    height: 300,
    position: "relative",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  frameCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "white",
    borderWidth: 3,
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  frameLabel: {
    color: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  instructionContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  instructionText: {
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
    fontFamily: "Fredoka_500Medium",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subInstructionText: {
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontFamily: "Lato_400Regular",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  galleryButton: {
    elevation: 4,
  },
  captureButton: {
    elevation: 4,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    margin: 20,
    borderRadius: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Fredoka_500Medium",
  },
  modalDivider: {
    marginBottom: 20,
  },
  modalInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 200,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
    fontFamily: "Fredoka_500Medium",
  },
  loadingSubtext: {
    textAlign: "center",
    opacity: 0.7,
    fontFamily: "Lato_400Regular",
  },
});
