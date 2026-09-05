import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const API = 'http://192.168.29.107:5000';

export default function ScanScreen() {
  const router = useRouter();

  const [cameraMode, setCameraMode] =
    useState<'none' | 'barcode'>('none');

  const [permission, requestPermission] =
    useCameraPermissions();

  const [barcode, setBarcode] = useState('');
  const [manualBarcode, setManualBarcode] = useState('');
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------
  // BARCODE -> OPEN FOOD FACTS -> RESULT
  // ---------------------------------------------------------

  const handleBarcode = async ({
    data,
  }: {
    data: string;
  }) => {
    if (!data || loading) return;

    setLoading(true);
    setCameraMode('none');
    setBarcode(data);

    try {
      console.log('SCANNED BARCODE:', data);

      const response = await fetch(
        `${API}/api/scan/barcode`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            barcode: data,
          }),
        }
      );

      const result = await response.json();

      console.log(
        'BARCODE RESULT:',
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            'Product was not found in Open Food Facts.'
        );
      }

      router.push({
        pathname: '/result',
        params: {
          analysis: JSON.stringify(result),
        },
      });
    } catch (error) {
      console.error(
        'BARCODE ERROR:',
        error
      );

      Alert.alert(
        'Product not found',
        error instanceof Error
          ? error.message
          : 'Could not find the scanned product.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // BARCODE CAMERA
  // ---------------------------------------------------------

  const startBarcodeScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert(
          'Camera permission needed',
          'Please allow camera access to scan a barcode.'
        );
        return;
      }
    }

    setCameraMode('barcode');
  };

  // ---------------------------------------------------------
  // OCR FOOD LABEL
  // ---------------------------------------------------------

  const scanFoodLabel = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Camera permission needed',
          'Please allow camera access to scan the food label.'
        );
        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.8,
        });

      if (
        result.canceled ||
        !result.assets?.[0]?.uri
      ) {
        return;
      }

      setLoading(true);

      const imageUri = result.assets[0].uri;

      const formData = new FormData();

      formData.append('image', {
        uri: imageUri,
        name: 'food-label.jpg',
        type: 'image/jpeg',
      } as any);

      console.log('SENDING IMAGE TO OCR');

      const response = await fetch(
        `${API}/api/scan/ocr`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      console.log('OCR RESULT:', data);

      if (!response.ok || !data.success) {
        Alert.alert(
          'OCR failed',
          data.error ||
            'Could not read the food label.'
        );
        return;
      }

      Alert.alert(
        'Food label scanned',
        data.text ||
          'No text could be detected.'
      );
    } catch (error) {
      console.error('OCR ERROR:', error);

      Alert.alert(
        'OCR failed',
        'Could not connect to the OCR service. Make sure Flask is running and your phone is on the same Wi-Fi.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // MANUAL BARCODE
  // ---------------------------------------------------------

  const searchManualBarcode = async () => {
    const code = manualBarcode.trim();

    if (!code) {
      Alert.alert(
        'Barcode required',
        'Please enter a barcode.'
      );
      return;
    }

    setLoading(true);

    try {
      console.log(
        'MANUAL BARCODE:',
        code
      );

      const response = await fetch(
        `${API}/api/scan/barcode`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            barcode: code,
          }),
        }
      );

      const result = await response.json();

      console.log(
        'MANUAL BARCODE RESULT:',
        result
      );

      if (!response.ok || !result.success) {
        Alert.alert(
          'Product not found',
          result.error ||
            'Product was not found.'
        );
        return;
      }

      router.push({
        pathname: '/result',
        params: {
          analysis: JSON.stringify(result),
        },
      });
    } catch (error) {
      console.error(
        'MANUAL BARCODE ERROR:',
        error
      );

      Alert.alert(
        'Search failed',
        'Could not connect to the barcode service.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // BARCODE CAMERA SCREEN
  // ---------------------------------------------------------

  if (cameraMode === 'barcode') {
    return (
      <SafeAreaView style={styles.cameraScreen}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: [
              'ean13',
              'ean8',
              'upc_a',
              'upc_e',
              'code128',
              'code39',
            ],
          }}
          onBarcodeScanned={
            loading ? undefined : handleBarcode
          }
        />

        <View style={styles.cameraOverlay}>
          <Pressable
            style={styles.closeButton}
            onPress={() =>
              setCameraMode('none')
            }
          >
            <Ionicons
              name="close"
              size={28}
              color="#FFFFFF"
            />
          </Pressable>

          <View style={styles.scanBox} />

          <Text style={styles.cameraText}>
            Point the camera at a barcode
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------
  // MAIN SCREEN
  // ---------------------------------------------------------

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              NUTRISAATHI
            </Text>

            <Text style={styles.title}>
              Scan your food
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="sparkles"
              size={21}
              color="#287A45"
            />
          </View>
        </View>

        <View style={styles.scannerCard}>
          <View style={styles.scannerFrame}>
            <View
              style={[
                styles.corner,
                styles.topLeft,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.topRight,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.bottomLeft,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.bottomRight,
              ]}
            />

            <View style={styles.scanLine} />

            <View style={styles.barcodeCircle}>
              <Ionicons
                name="barcode-outline"
                size={42}
                color="#173B2A"
              />
            </View>
          </View>

          <Text style={styles.scannerTitle}>
            Point your camera at a barcode
          </Text>

          <Text style={styles.scannerSubtitle}>
            We'll instantly understand the product
            and check what's inside.
          </Text>
        </View>

        <View style={styles.optionsRow}>
          <Pressable
            style={styles.optionCard}
            onPress={startBarcodeScanner}
            disabled={loading}
          >
            <View style={styles.optionIcon}>
              <Ionicons
                name="barcode-outline"
                size={25}
                color="#287A45"
              />
            </View>

            <Text style={styles.optionTitle}>
              Barcode
            </Text>

            <Text style={styles.optionSubtitle}>
              Scan product code
            </Text>
          </Pressable>

          <Pressable
            style={styles.optionCard}
            onPress={scanFoodLabel}
            disabled={loading}
          >
            <View style={styles.optionIcon}>
              <Ionicons
                name="document-text-outline"
                size={25}
                color="#287A45"
              />
            </View>

            <Text style={styles.optionTitle}>
              Food Label
            </Text>

            <Text style={styles.optionSubtitle}>
              Scan ingredients
            </Text>
          </Pressable>
        </View>

        <View style={styles.manualCard}>
          <View style={styles.manualIcon}>
            <Ionicons
              name="search-outline"
              size={22}
              color="#287A45"
            />
          </View>

          <TextInput
            style={styles.manualInput}
            value={manualBarcode}
            onChangeText={setManualBarcode}
            placeholder="Enter barcode"
            placeholderTextColor="#9AA69F"
            keyboardType="numeric"
            editable={!loading}
          />

          <Pressable
            style={styles.searchButton}
            onPress={searchManualBarcode}
            disabled={loading}
          >
            <Ionicons
              name="arrow-forward"
              size={22}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <View style={styles.ocrCard}>
          <View style={styles.ocrIcon}>
            <Ionicons
              name="camera-outline"
              size={21}
              color="#173B2A"
            />
          </View>

          <View style={styles.ocrContent}>
            <Text style={styles.ocrTitle}>
              Food Label OCR
            </Text>

            <Text style={styles.ocrText}>
              Photograph an ingredients or nutrition
              label and NutriSaathi will read the text.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Ionicons
            name="bulb-outline"
            size={20}
            color="#287A45"
          />

          <Text style={styles.tipText}>
            Your scan results combine food
            information with your family's
            preferences.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------
// STYLES
// ---------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9F4',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#287A45',
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#173B2A',
  },

  headerIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scannerCard: {
    backgroundColor: '#173B2A',
    borderRadius: 30,
    padding: 18,
    paddingBottom: 24,
  },

  scannerFrame: {
    height: 350,
    borderRadius: 25,
    backgroundColor: '#20533D',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  corner: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderColor: '#B9E6B7',
  },

  topLeft: {
    top: 28,
    left: 28,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 15,
  },

  topRight: {
    top: 28,
    right: 28,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 15,
  },

  bottomLeft: {
    bottom: 28,
    left: 28,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 15,
  },

  bottomRight: {
    bottom: 28,
    right: 28,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 15,
  },

  scanLine: {
    position: 'absolute',
    left: 30,
    right: 30,
    height: 2,
    backgroundColor: '#B9E6B7',
  },

  barcodeCircle: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: '#F6F9F4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 21,
  },

  scannerSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#BFD2C5',
    textAlign: 'center',
    marginTop: 7,
    paddingHorizontal: 18,
  },

  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 13,
  },

  optionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#173B2A',
  },

  optionSubtitle: {
    fontSize: 10,
    color: '#78867D',
    marginTop: 5,
  },

  manualCard: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 21,
    padding: 12,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  manualIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  manualInput: {
    flex: 1,
    fontSize: 15,
    color: '#173B2A',
    paddingVertical: 8,
  },

  searchButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ocrCard: {
    marginTop: 12,
    backgroundColor: '#E8F4E7',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  ocrIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  ocrContent: {
    flex: 1,
  },

  ocrTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#287A45',
    marginBottom: 4,
  },

  ocrText: {
    fontSize: 10,
    lineHeight: 16,
    color: '#5F7167',
  },

  tipCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  tipText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
    color: '#78867D',
    marginLeft: 8,
  },

  cameraScreen: {
    flex: 1,
    backgroundColor: '#000',
  },

  camera: {
    flex: 1,
  },

  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanBox: {
    width: 280,
    height: 180,
    borderWidth: 3,
    borderColor: '#B9E6B7',
    borderRadius: 20,
  },

  cameraText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
});