import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { router } from 'expo-router';

type InputMethod =
  | 'camera'
  | 'gallery'
  | 'barcode'
  | 'ingredients'
  | 'nutrition';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');

export default function ScanScreen() {
  const [selectedMethod, setSelectedMethod] =
    useState<InputMethod | null>(null);

  const [barcode, setBarcode] = useState('');
  const [ingredients, setIngredients] = useState('');

  const [nutrition, setNutrition] = useState({
    calories: '',
    sugar: '',
    protein: '',
    fat: '',
    fiber: '',
    sodium: '',
  });

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'barcode' | 'label'>('barcode');
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  const ensureApiUrl = () => {
    if (!API_BASE_URL) {
      Alert.alert(
        'Backend URL missing',
        'Please set EXPO_PUBLIC_API_URL in frontend/.env and restart Expo.'
      );
      return false;
    }
    return true;
  };

  const goToResult = (payload: unknown, scannedBarcode = '') => {
    router.push({
      pathname: '/result',
      params: {
        api_response: JSON.stringify(payload),
        barcode: scannedBarcode,
      },
    });
  };

  const getErrorMessage = (payload: any, fallback: string) => {
    if (payload && typeof payload.error === 'string') return payload.error;
    if (payload && typeof payload.message === 'string') return payload.message;
    return fallback;
  };

  const openCamera = async (mode: 'barcode' | 'label') => {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert(
          'Camera permission needed',
          'NutriSaathi needs camera access to scan your product.'
        );
        return;
      }
    }

    setCameraMode(mode);
    setScanned(false);
    setCameraOpen(true);
  };

  const fetchBarcodeProduct = async (value: string) => {
    const cleanBarcode = value.trim();

    if (!cleanBarcode) {
      Alert.alert('Enter barcode', 'Please enter a barcode number first.');
      return;
    }

    if (!ensureApiUrl()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/scan/barcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barcode: cleanBarcode,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, `Barcode lookup failed (${response.status}).`)
        );
      }

      if (data?.success === false) {
        throw new Error(
          getErrorMessage(data, 'No product was found for this barcode.')
        );
      }

      goToResult(data, cleanBarcode);
    } catch (error) {
      Alert.alert(
        'Could not analyze barcode',
        error instanceof Error
          ? error.message
          : 'Please check the barcode and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = ({ data }: { data: string; type: string }) => {
    if (scanned || loading || !data) return;

    setScanned(true);
    setBarcode(data);
    setCameraOpen(false);

    void fetchBarcodeProduct(data);
  };

  const sendOcrImage = async (uri: string) => {
    if (!ensureApiUrl()) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        'image',
        {
          uri,
          name: `food-label-${Date.now()}.jpg`,
          type: 'image/jpeg',
        } as any
      );

      const response = await fetch(`${API_BASE_URL}/api/scan/ocr`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, `OCR analysis failed (${response.status}).`)
        );
      }

      if (data?.success === false) {
        throw new Error(
          getErrorMessage(data, 'The food label could not be analyzed.')
        );
      }

      goToResult(data);
    } catch (error) {
      Alert.alert(
        'Could not analyze food label',
        error instanceof Error
          ? error.message
          : 'Please use a clearer food-label image and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const captureLabel = async () => {
    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (!photo?.uri) {
        throw new Error('No image was captured.');
      }

      setCameraOpen(false);
      await sendOcrImage(photo.uri);
    } catch (error) {
      Alert.alert(
        'Capture failed',
        error instanceof Error
          ? error.message
          : 'We could not capture the food label. Please try again.'
      );
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await sendOcrImage(result.assets[0].uri);
    }
  };

  const analyzeBarcode = () => {
    void fetchBarcodeProduct(barcode);
  };

  const analyzeIngredients = () => {
    if (!ingredients.trim()) {
      Alert.alert(
        'Add ingredients',
        'Please paste or type the ingredient list first.'
      );
      return;
    }

    Alert.alert(
      'Coming next',
      'Ingredient-only analysis is not connected to the backend endpoint yet.'
    );
  };

  const analyzeNutrition = () => {
    const hasValue = Object.values(nutrition).some(
      (value) => value.trim() !== ''
    );

    if (!hasValue) {
      Alert.alert(
        'Add nutrition values',
        'Please enter at least one nutrition value.'
      );
      return;
    }

    Alert.alert(
      'Coming next',
      'Nutrition-only analysis is not connected to the backend endpoint yet.'
    );
  };

  const resetSelection = () => {
    setSelectedMethod(null);
    setBarcode('');
    setIngredients('');
    setNutrition({
      calories: '',
      sugar: '',
      protein: '',
      fat: '',
      fiber: '',
      sodium: '',
    });
  };

  if (cameraOpen) {
    return (
      <SafeAreaView
        style={styles.cameraSafeArea}
        edges={['top', 'bottom']}
      >
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            onBarcodeScanned={
              cameraMode === 'barcode' && !scanned
                ? handleBarcodeScanned
                : undefined
            }
          />

          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setCameraOpen(false)}
                disabled={loading}
              >
                <Ionicons name="close" size={27} color="#FFFFFF" />
              </Pressable>

              <Text style={styles.cameraTitle}>
                {cameraMode === 'barcode'
                  ? 'SCAN BARCODE'
                  : 'SCAN FOOD LABEL'}
              </Text>

              <View style={styles.closePlaceholder} />
            </View>

            <View style={styles.cameraFrame}>
              <View style={styles.frameTopLeft} />
              <View style={styles.frameTopRight} />
              <View style={styles.frameBottomLeft} />
              <View style={styles.frameBottomRight} />

              {cameraMode === 'barcode' && (
                <View style={styles.cameraScanLine} />
              )}

              {cameraMode === 'label' && (
                <View style={styles.labelGuide}>
                  <Ionicons
                    name="document-text-outline"
                    size={48}
                    color="#FFFFFF"
                  />
                  <Text style={styles.labelGuideText}>
                    Fit the ingredient or nutrition label inside the frame
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.cameraBottom}>
              <Text style={styles.cameraInstruction}>
                {cameraMode === 'barcode'
                  ? 'Point your camera at any supported barcode'
                  : 'Capture a clear photo of the food label'}
              </Text>

              <Text style={styles.cameraHint}>
                {cameraMode === 'barcode'
                  ? 'The product will be looked up automatically'
                  : 'Good lighting gives better OCR results'}
              </Text>

              {cameraMode === 'label' && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Take picture"
                  style={styles.captureButton}
                  onPress={captureLabel}
                  disabled={loading}
                >
                  <View style={styles.captureInner} />
                </Pressable>
              )}
            </View>
          </View>

          {loading && (
            <View style={styles.cameraLoading}>
              <View style={styles.loadingCard}>
                <ActivityIndicator size="large" color="#287A45" />
                <Text style={styles.loadingTitle}>
                  {cameraMode === 'barcode'
                    ? 'Looking up product…'
                    : 'Reading food label…'}
                </Text>
                <Text style={styles.loadingText}>
                  Please wait while NutriSaathi analyzes it.
                </Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.brand}>NUTRISAATHI</Text>
            <Text style={styles.title}>Scan your food</Text>
            <Text style={styles.subtitle}>
              Choose how you'd like to add your product.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="nutrition-outline"
              size={28}
              color="#287A45"
            />
          </View>
        </View>

        {!selectedMethod && (
          <>
            <View style={styles.introCard}>
              <View style={styles.introIcon}>
                <Ionicons name="sparkles" size={25} color="#287A45" />
              </View>

              <View style={styles.introContent}>
                <Text style={styles.introTitle}>Add a product</Text>
                <Text style={styles.introText}>
                  Scan, upload, paste or enter the information available on
                  your food package.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Choose an input method</Text>

            <Pressable
              style={styles.methodCard}
              onPress={() => openCamera('barcode')}
            >
              <View style={[styles.methodIcon, styles.greenMethodIcon]}>
                <Ionicons
                  name="barcode-outline"
                  size={27}
                  color="#287A45"
                />
              </View>

              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Scan barcode</Text>
                <Text style={styles.methodText}>
                  Point your camera at the product barcode.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#91A097"
              />
            </Pressable>

            <Pressable
              style={styles.methodCard}
              onPress={openGallery}
            >
              <View style={[styles.methodIcon, styles.blueMethodIcon]}>
                <Ionicons
                  name="images-outline"
                  size={27}
                  color="#4E7E91"
                />
              </View>

              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Upload food label</Text>
                <Text style={styles.methodText}>
                  Upload a product or nutrition-label photo for OCR.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#91A097"
              />
            </Pressable>

            <Pressable
              style={styles.methodCard}
              onPress={() => setSelectedMethod('barcode')}
            >
              <View style={[styles.methodIcon, styles.peachMethodIcon]}>
                <Ionicons
                  name="create-outline"
                  size={27}
                  color="#A87436"
                />
              </View>

              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Enter barcode</Text>
                <Text style={styles.methodText}>
                  Type any product barcode manually.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#91A097"
              />
            </Pressable>

            <Pressable
              style={styles.methodCard}
              onPress={() => openCamera('label')}
            >
              <View style={[styles.methodIcon, styles.lilacMethodIcon]}>
                <Ionicons
                  name="document-text-outline"
                  size={27}
                  color="#816A91"
                />
              </View>

              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Food Label / OCR</Text>
                <Text style={styles.methodText}>
                  Capture the ingredient or nutrition label with the camera.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#91A097"
              />
            </Pressable>

            <Pressable
              style={styles.methodCard}
              onPress={() => setSelectedMethod('ingredients')}
            >
              <View style={[styles.methodIcon, styles.lilacMethodIcon]}>
                <Ionicons
                  name="list-outline"
                  size={27}
                  color="#816A91"
                />
              </View>

              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Paste ingredients</Text>
                <Text style={styles.methodText}>
                  Copy the ingredient list directly from the package.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#91A097"
              />
            </Pressable>

            <Pressable
              style={styles.methodCard}
              onPress={() => setSelectedMethod('nutrition')}
            >
              <View style={[styles.methodIcon, styles.yellowMethodIcon]}>
                <Ionicons
                  name="nutrition-outline"
                  size={27}
                  color="#8C7433"
                />
              </View>

              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>
                  Enter nutrition values
                </Text>
                <Text style={styles.methodText}>
                  Add calories, sugar, protein, fat, fiber and sodium manually.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#91A097"
              />
            </Pressable>
          </>
        )}

        {selectedMethod === 'barcode' && (
          <View style={styles.inputSection}>
            <Pressable style={styles.backLink} onPress={resetSelection}>
              <Ionicons name="arrow-back" size={20} color="#287A45" />
              <Text style={styles.backText}>Choose another method</Text>
            </Pressable>

            <View style={styles.inputHero}>
              <View style={styles.inputHeroIcon}>
                <Ionicons
                  name="barcode-outline"
                  size={32}
                  color="#E8F3E8"
                />
              </View>

              <Text style={styles.inputHeroTitle}>Enter product barcode</Text>
              <Text style={styles.inputHeroText}>
                Type the number printed below the barcode.
              </Text>
            </View>

            <Text style={styles.fieldLabel}>Barcode number</Text>

            <TextInput
              value={barcode}
              onChangeText={setBarcode}
              placeholder="e.g. 3017620422003"
              placeholderTextColor="#A0AAA4"
              keyboardType="number-pad"
              style={styles.textInput}
              editable={!loading}
              autoCapitalize="none"
            />

            <Pressable
              style={[
                styles.primaryButton,
                loading && styles.disabledButton,
              ]}
              onPress={analyzeBarcode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>
                    Analyze product
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={22}
                    color="#FFFFFF"
                  />
                </>
              )}
            </Pressable>

            <Text style={styles.orText}>OR</Text>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => openCamera('barcode')}
              disabled={loading}
            >
              <Ionicons
                name="camera-outline"
                size={21}
                color="#287A45"
              />
              <Text style={styles.secondaryButtonText}>
                Scan barcode with camera
              </Text>
            </Pressable>
          </View>
        )}

        {selectedMethod === 'ingredients' && (
          <View style={styles.inputSection}>
            <Pressable style={styles.backLink} onPress={resetSelection}>
              <Ionicons name="arrow-back" size={20} color="#287A45" />
              <Text style={styles.backText}>Choose another method</Text>
            </Pressable>

            <View style={styles.inputHero}>
              <View style={styles.inputHeroIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color="#E8F3E8"
                />
              </View>

              <Text style={styles.inputHeroTitle}>Paste ingredients</Text>
              <Text style={styles.inputHeroText}>
                Copy the ingredient list from the package and paste it below.
              </Text>
            </View>

            <Text style={styles.fieldLabel}>Ingredient list</Text>

            <TextInput
              value={ingredients}
              onChangeText={setIngredients}
              placeholder="Paste ingredients here..."
              placeholderTextColor="#A0AAA4"
              multiline
              textAlignVertical="top"
              style={[styles.textInput, styles.ingredientsInput]}
            />

            <Pressable
              style={styles.primaryButton}
              onPress={analyzeIngredients}
            >
              <Text style={styles.primaryButtonText}>
                Analyze ingredients
              </Text>
              <Ionicons
                name="arrow-forward"
                size={22}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        )}

        {selectedMethod === 'nutrition' && (
          <View style={styles.inputSection}>
            <Pressable style={styles.backLink} onPress={resetSelection}>
              <Ionicons name="arrow-back" size={20} color="#287A45" />
              <Text style={styles.backText}>Choose another method</Text>
            </Pressable>

            <View style={styles.inputHero}>
              <View style={styles.inputHeroIcon}>
                <Ionicons
                  name="nutrition-outline"
                  size={32}
                  color="#E8F3E8"
                />
              </View>

              <Text style={styles.inputHeroTitle}>
                Enter nutrition values
              </Text>
              <Text style={styles.inputHeroText}>
                Add the values shown on the nutrition label.
              </Text>
            </View>

            <View style={styles.nutritionGrid}>
              <NutritionInput
                label="Calories"
                unit="kcal"
                value={nutrition.calories}
                onChangeText={(value) =>
                  setNutrition({ ...nutrition, calories: value })
                }
              />
              <NutritionInput
                label="Sugar"
                unit="g"
                value={nutrition.sugar}
                onChangeText={(value) =>
                  setNutrition({ ...nutrition, sugar: value })
                }
              />
              <NutritionInput
                label="Protein"
                unit="g"
                value={nutrition.protein}
                onChangeText={(value) =>
                  setNutrition({ ...nutrition, protein: value })
                }
              />
              <NutritionInput
                label="Fat"
                unit="g"
                value={nutrition.fat}
                onChangeText={(value) =>
                  setNutrition({ ...nutrition, fat: value })
                }
              />
              <NutritionInput
                label="Fiber"
                unit="g"
                value={nutrition.fiber}
                onChangeText={(value) =>
                  setNutrition({ ...nutrition, fiber: value })
                }
              />
              <NutritionInput
                label="Sodium"
                unit="mg"
                value={nutrition.sodium}
                onChangeText={(value) =>
                  setNutrition({ ...nutrition, sodium: value })
                }
              />
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={analyzeNutrition}
            >
              <Text style={styles.primaryButtonText}>
                Analyze nutrition
              </Text>
              <Ionicons
                name="arrow-forward"
                size={22}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        )}

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#287A45"
            />
          </View>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>
              One product. Multiple ways to analyze.
            </Text>
            <Text style={styles.tipText}>
              Barcode lookup and food-label OCR are connected to the NutriSaathi
              backend. The result screen uses the actual API response.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

function NutritionInput({
  label,
  unit,
  value,
  onChangeText,
}: {
  label: string;
  unit: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.nutritionField}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View style={styles.nutritionInputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="0"
          placeholderTextColor="#A0AAA4"
          keyboardType="decimal-pad"
          style={styles.nutritionInput}
        />
        <Text style={styles.unitText}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 23,
  },
  headerText: {
    flex: 1,
    paddingRight: 15,
  },
  brand: {
    fontSize: 14,
    letterSpacing: 2.2,
    fontWeight: '700',
    color: '#287A45',
    marginBottom: 6,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#173C2A',
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 7,
    fontSize: 15,
    lineHeight: 22,
    color: '#7C8B82',
  },
  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EAF3E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introCard: {
    backgroundColor: '#205F47',
    borderRadius: 29,
    padding: 21,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  introIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  introContent: {
    flex: 1,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  introText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#D8E9DC',
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#173C2A',
    marginBottom: 14,
  },
  methodCard: {
    minHeight: 82,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAE3',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodIcon: {
    width: 53,
    height: 53,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  greenMethodIcon: {
    backgroundColor: '#DDF0D9',
  },
  blueMethodIcon: {
    backgroundColor: '#DCECF1',
  },
  peachMethodIcon: {
    backgroundColor: '#FFE5C2',
  },
  lilacMethodIcon: {
    backgroundColor: '#E6D9EA',
  },
  yellowMethodIcon: {
    backgroundColor: '#F1E8C7',
  },
  methodContent: {
    flex: 1,
    paddingRight: 8,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#173C2A',
    marginBottom: 4,
  },
  methodText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#7C8B82',
  },
  inputSection: {
    paddingTop: 2,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#287A45',
    marginLeft: 7,
  },
  inputHero: {
    backgroundColor: '#205F47',
    borderRadius: 27,
    padding: 21,
    marginBottom: 22,
  },
  inputHeroIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  inputHeroTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  inputHeroText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#D8E9DC',
    marginTop: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#365342',
    marginBottom: 8,
  },
  textInput: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#DCE4DC',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#173C2A',
    marginBottom: 15,
  },
  ingredientsInput: {
    minHeight: 150,
    paddingTop: 15,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: 2,
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 10,
  },
  secondaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE7DC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#287A45',
    marginLeft: 8,
  },
  orText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#9AA69E',
    marginVertical: 13,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  nutritionField: {
    width: '48%',
    marginBottom: 13,
  },
  nutritionInputWrapper: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#DCE4DC',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 13,
  },
  nutritionInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#173C2A',
  },
  unitText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C8B82',
  },
  tipCard: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAE3',
    borderRadius: 24,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173C2A',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#7C8B82',
  },
  bottomSpace: {
    height: 30,
  },
  cameraSafeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    ...StyleSheet.absoluteFill,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePlaceholder: {
    width: 46,
    height: 46,
  },
  cameraTitle: {
    fontSize: 14,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraFrame: {
    width: '100%',
    height: 245,
    position: 'relative',
    alignSelf: 'center',
  },
  frameTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 48,
    height: 48,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 12,
  },
  frameTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 48,
    height: 48,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FFFFFF',
    borderTopRightRadius: 12,
  },
  frameBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 48,
    height: 48,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FFFFFF',
    borderBottomLeftRadius: 12,
  },
  frameBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 48,
    height: 48,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FFFFFF',
    borderBottomRightRadius: 12,
  },
  cameraScanLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: '50%',
    height: 2,
    backgroundColor: '#BFE0C2',
  },
  labelGuide: {
    position: 'absolute',
    left: 40,
    right: 40,
    top: 55,
    bottom: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelGuideText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 10,
  },
  cameraBottom: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  cameraInstruction: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 7,
  },
  cameraHint: {
    fontSize: 13,
    color: '#D8D8D8',
    textAlign: 'center',
  },
  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: '#287A45',
  },
  cameraLoading: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingCard: {
    width: '78%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 22,
    alignItems: 'center',
  },
  loadingTitle: {
    marginTop: 13,
    fontSize: 17,
    fontWeight: '800',
    color: '#173C2A',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 17,
    color: '#7C8B82',
    textAlign: 'center',
  },
});