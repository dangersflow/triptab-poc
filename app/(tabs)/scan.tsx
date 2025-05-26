import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Linking, StyleSheet, View } from "react-native";
import { Button, FAB, Surface, Text, useTheme } from "react-native-paper";

export default function Scan() {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleTakePhoto = async () => {
    setIsProcessing(true);
    try {
      // Here you would capture the photo and process it
      console.log("Taking receipt photo...");

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert(
        "Receipt Captured!",
        "Your receipt has been processed and added to your trip.",
        [{ text: "OK" }]
      );
    } catch (err) {
      console.error("Receipt processing error:", err);
      Alert.alert("Error", "Failed to process receipt. Please try again.");
    } finally {
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
      setIsProcessing(true);
      try {
        console.log("Processing receipt from gallery:", result.assets[0].uri);

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 2000));
        Alert.alert(
          "Receipt Processed!",
          "Your receipt has been processed and added to your trip.",
          [{ text: "OK" }]
        );
      } catch (err) {
        console.error("Gallery receipt processing error:", err);
        Alert.alert("Error", "Failed to process receipt. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };
  // Camera Permission Not Granted
  if (!permission?.granted) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
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
            TripTab needs access to your camera to scan receipts and add them to
            your trips.
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
    );
  } // Camera Ready - Show Camera View
  return (
    <View style={styles.cameraContainer}>
      <CameraView style={StyleSheet.absoluteFill} facing="back" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    width: "100%",
  },
  cameraContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 60,
  },
  receiptFrame: {
    width: 280,
    height: 400,
    position: "relative",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
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
  },
  instructionText: {
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  subInstructionText: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
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
});
