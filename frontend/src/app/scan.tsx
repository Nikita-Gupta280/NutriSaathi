import React, { useRef, useState } from 'react';
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
import { File } from 'expo-file-system';
import { router } from 'expo-router';
import { getFamilyMembersForApi } from './family';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');

type InputMethod =
  | 'camera'
  | 'gallery'
  | 'barcode'
  | 'ingredients'
  | 'nutrition';

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
  const [cameraMode, setCameraMode] = useState<'barcode' | 'label'>(
    'barcode'
  );
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const cameraRef = useRef<CameraView>(null);

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

  const handleBarcodeScanned = async ({ data }: { data: string; type: string }) => {
    if (scanned || loading) return;
    const value = data.trim();
    if (!value) return;
    setScanned(true);
    setBarcode(value);
    setCameraOpen(false);
    await analyzeBarcode(value);
  };

  const analyzeBarcode = async (barcodeValue?: string) => {
    const value = (barcodeValue || barcode).trim();
    if (!value) {
      Alert.alert('Enter barcode', 'Please enter a barcode number first.');
      return;
    }
    if (!API_BASE_URL) {
      Alert.alert('Backend URL missing', 'Please set EXPO_PUBLIC_API_URL in frontend/.env and restart Expo.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/scan/barcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: value,
          family_members: getFamilyMembersForApi(),
        }),
      });
      const data = await response.json();
      if (!response.ok || data?.success === false) {
        throw new Error(data?.error || data?.message || 'Product not found');
      }
      router.push({
        pathname: '/result',
        params: { barcode: value, api_response: JSON.stringify(data) },
      });
    } catch (error: any) {
      Alert.alert('Barcode error', error?.message || 'Could not analyze this barcode.');
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const captureLabel = async () => {
    try {
      if (!cameraRef.current) return;
      if (!API_BASE_URL) {
        Alert.alert('Backend URL missing', 'Please set EXPO_PUBLIC_API_URL in frontend/.env and restart Expo.');
        return;
      }
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) throw new Error('No image was captured');
      setCameraOpen(false);
      const formData = new FormData();
      const imageFile = new File(photo.uri);
      formData.append('image', imageFile as any);
      const response = await fetch(`${API_BASE_URL}/api/scan/ocr`, { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok || data?.success === false) {
        throw new Error(data?.error || data?.message || 'OCR failed');
      }
      const text = data?.text || data?.ocr_text || data?.data?.text || '';
      Alert.alert('OCR complete', text ? text : 'Label text was received from the backend.');
    } catch (error: any) {
      Alert.alert('OCR error', error?.message || 'Could not read the food label.');
    } finally {
      setLoading(false);
    }
  };

  const openGallery = async () => {
    try {
      if (!API_BASE_URL) {
        Alert.alert('Backend URL missing', 'Please set EXPO_PUBLIC_API_URL in frontend/.env and restart Expo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      setLoading(true);
      const formData = new FormData();
      const imageFile = new File(result.assets[0].uri);
      formData.append('image', imageFile as any);
      const response = await fetch(`${API_BASE_URL}/api/scan/ocr`, { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok || data?.success === false) {
        throw new Error(data?.error || data?.message || 'OCR failed');
      }
      const text = data?.text || data?.ocr_text || data?.data?.text || '';
      Alert.alert('OCR complete', text ? text : 'Label text was received from the backend.');
    } catch (error: any) {
      Alert.alert('OCR error', error?.message || 'Could not read the food label.');
    } finally {
      setLoading(false);
    }
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
      'Ingredients added',
      'Your ingredients are ready for NutriSaathi analysis.'
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
      'Nutrition added',
      'Your nutrition information is ready for NutriSaathi analysis.'
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

  /* ================= CAMERA ================= */

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
              >
                <Ionicons
                  name="close"
                  size={27}
                  color="#FFFFFF"
                />
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
                    Fit the ingredient or nutrition label inside
                    the frame
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.cameraBottom}>
              <Text style={styles.cameraInstruction}>
                {cameraMode === 'barcode'
                  ? 'Point at a barcode, or tap the button to take a label photo'
                  : 'Capture a clear photo of the food label'}
              </Text>

              <Text style={styles.cameraHint}>
                Good lighting gives better results
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Take picture"
                style={styles.captureButton}
                onPress={captureLabel}
              >
                <View style={styles.captureInner} />
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /* ================= MAIN SCREEN ================= */

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
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.brand}>NUTRISAATHI</Text>

            <Text style={styles.title}>
              Scan your food
            </Text>

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

        {/* DEFAULT METHOD SELECTION */}

        {!selectedMethod && (
          <>
            <View style={styles.introCard}>
              <View style={styles.introIcon}>
                <Ionicons
                  name="sparkles"
                  size={25}
                  color="#287A45"
                />
              </View>

              <View style={styles.introContent}>
                <Text style={styles.introTitle}>
                  Add a product
                </Text>

                <Text style={styles.introText}>
                  Scan, upload, paste or enter the information
                  available on your food package.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              Choose an input method
            </Text>

            {/* CAMERA */}

            <Pressable
              style={styles.methodCard}
              onPress={() => openCamera('barcode')}
            >
              <View
                style={[
                  styles.methodIcon,
                  styles.greenMethodIcon,
                ]}
              >
                <Ionicons
                  name="camera-outline"
                  size={27}
                  color="#287A45"
                />
              </View>

              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>
                  Scan with camera
                </Text>

                <Text style={styles.methodText}>
                  Scan a barcode or capture a food label.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#91A097"
              />
            </Pressable>

            {/* GALLERY */}

            <Pressable
              style={styles.methodCard}
              onPress={openGallery}
            >
              <View
                style={[
                  styles.methodIcon,
                  styles.blueMethodIcon,
                ]}
              >
                <Ionicons
                  name="images-outline"
                  size={27}
                  color="#4E7E91"
                />
              </View>

              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>
                  Upload from gallery
                </Text>

                <Text style={styles.methodText}>
                  Choose a barcode, ingredient or nutrition-label
                  photo.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#91A097"
              />
            </Pressable>

            {/* BARCODE */}

            <Pressable
              style={styles.methodCard}
              onPress={() => setSelectedMethod('barcode')}
            >
              <View
                style={[
                  styles.methodIcon,
                  styles.peachMethodIcon,
                ]}
              >
                <Ionicons
                  name="barcode-outline"
                  size={27}
                  color="#A87436"
                />
              </View>

              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>
                  Enter barcode
                </Text>

                <Text style={styles.methodText}>
                  Type the product barcode number manually.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#91A097"
              />
            </Pressable>

            {/* INGREDIENTS */}

            <Pressable
              style={styles.methodCard}
              onPress={() =>
                setSelectedMethod('ingredients')
              }
            >
              <View
                style={[
                  styles.methodIcon,
                  styles.lilacMethodIcon,
                ]}
              >
                <Ionicons
                  name="document-text-outline"
                  size={27}
                  color="#816A91"
                />
              </View>

              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>
                  Paste ingredients
                </Text>

                <Text style={styles.methodText}>
                  Copy the ingredient list directly from the package
                  or another source.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#91A097"
              />
            </Pressable>

            {/* NUTRITION */}

            <Pressable
              style={styles.methodCard}
              onPress={() =>
                setSelectedMethod('nutrition')
              }
            >
              <View
                style={[
                  styles.methodIcon,
                  styles.yellowMethodIcon,
                ]}
              >
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
                  Add calories, sugar, protein, fat, fiber and
                  sodium manually.
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

        {/* BARCODE */}

        {selectedMethod === 'barcode' && (
          <View style={styles.inputSection}>
            <Pressable
              style={styles.backLink}
              onPress={resetSelection}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color="#287A45"
              />

              <Text style={styles.backText}>
                Choose another method
              </Text>
            </Pressable>

            <View style={styles.inputHero}>
              <View style={styles.inputHeroIcon}>
                <Ionicons
                  name="barcode-outline"
                  size={32}
                  color="#E8F3E8"
                />
              </View>

              <Text style={styles.inputHeroTitle}>
                Enter product barcode
              </Text>

              <Text style={styles.inputHeroText}>
                Type the number printed below the barcode.
              </Text>
            </View>

            <Text style={styles.fieldLabel}>
              Barcode number
            </Text>

            <TextInput
              value={barcode}
              onChangeText={setBarcode}
              placeholder="e.g. 8901234567890"
              placeholderTextColor="#A0AAA4"
              keyboardType="number-pad"
              style={styles.textInput}
            />

            <Pressable
              style={styles.primaryButton}
              onPress={() => analyzeBarcode()}
            >
              <Text style={styles.primaryButtonText}>
                Analyze product
              </Text>

              <Ionicons
                name="arrow-forward"
                size={22}
                color="#FFFFFF"
              />
            </Pressable>

            <Text style={styles.orText}>OR</Text>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => openCamera('barcode')}
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

        {/* INGREDIENTS */}

        {selectedMethod === 'ingredients' && (
          <View style={styles.inputSection}>
            <Pressable
              style={styles.backLink}
              onPress={resetSelection}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color="#287A45"
              />

              <Text style={styles.backText}>
                Choose another method
              </Text>
            </Pressable>

            <View style={styles.inputHero}>
              <View style={styles.inputHeroIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color="#E8F3E8"
                />
              </View>

              <Text style={styles.inputHeroTitle}>
                Paste ingredients
              </Text>

              <Text style={styles.inputHeroText}>
                Copy the ingredient list from the package and paste
                it below.
              </Text>
            </View>

            <Text style={styles.fieldLabel}>
              Ingredient list
            </Text>

            <TextInput
              value={ingredients}
              onChangeText={setIngredients}
              placeholder="Paste ingredients here..."
              placeholderTextColor="#A0AAA4"
              multiline
              textAlignVertical="top"
              style={[
                styles.textInput,
                styles.ingredientsInput,
              ]}
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

        {/* NUTRITION */}

        {selectedMethod === 'nutrition' && (
          <View style={styles.inputSection}>
            <Pressable
              style={styles.backLink}
              onPress={resetSelection}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color="#287A45"
              />

              <Text style={styles.backText}>
                Choose another method
              </Text>
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
                  setNutrition({
                    ...nutrition,
                    calories: value,
                  })
                }
              />

              <NutritionInput
                label="Sugar"
                unit="g"
                value={nutrition.sugar}
                onChangeText={(value) =>
                  setNutrition({
                    ...nutrition,
                    sugar: value,
                  })
                }
              />

              <NutritionInput
                label="Protein"
                unit="g"
                value={nutrition.protein}
                onChangeText={(value) =>
                  setNutrition({
                    ...nutrition,
                    protein: value,
                  })
                }
              />

              <NutritionInput
                label="Fat"
                unit="g"
                value={nutrition.fat}
                onChangeText={(value) =>
                  setNutrition({
                    ...nutrition,
                    fat: value,
                  })
                }
              />

              <NutritionInput
                label="Fiber"
                unit="g"
                value={nutrition.fiber}
                onChangeText={(value) =>
                  setNutrition({
                    ...nutrition,
                    fiber: value,
                  })
                }
              />

              <NutritionInput
                label="Sodium"
                unit="mg"
                value={nutrition.sodium}
                onChangeText={(value) =>
                  setNutrition({
                    ...nutrition,
                    sodium: value,
                  })
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

        {/* CAMERA RESULT */}

        {selectedMethod === 'camera' && (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons
                name="checkmark-circle"
                size={34}
                color="#287A45"
              />
            </View>

            <Text style={styles.successTitle}>
              Food label captured
            </Text>

            <Text style={styles.successText}>
              The label image is ready. The next step is connecting
              it to NutriSaathi's OCR and analysis service.
            </Text>

            <Pressable
              style={styles.primaryButton}
              onPress={() => openCamera('label')}
            >
              <Text style={styles.primaryButtonText}>
                Capture again
              </Text>

              <Ionicons
                name="camera-outline"
                size={22}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        )}

        {/* GALLERY RESULT */}

        {selectedMethod === 'gallery' && (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons
                name="image"
                size={32}
                color="#287A45"
              />
            </View>

            <Text style={styles.successTitle}>
              Image selected
            </Text>

            <Text style={styles.successText}>
              Your product image is ready. The next step is
              connecting it to NutriSaathi's OCR and analysis
              service.
            </Text>

            <Pressable
              style={styles.primaryButton}
              onPress={openGallery}
            >
              <Text style={styles.primaryButtonText}>
                Choose another image
              </Text>

              <Ionicons
                name="images-outline"
                size={22}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        )}

        {/* TIP */}

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
              Use whatever information is available on your
              package. NutriSaathi will turn it into simple,
              personalized food insights.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= NUTRITION INPUT ================= */

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

/* ================= STYLES ================= */

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
    fontSize: 16,
    fontWeight: '700',
    color: '#173C2A',
    marginBottom: 4,
  },

  methodText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#7A877F',
  },

  inputSection: {
    marginTop: 2,
  },

  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
    paddingVertical: 5,
  },

  backText: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: '600',
    color: '#287A45',
  },

  inputHero: {
    backgroundColor: '#205F47',
    borderRadius: 29,
    padding: 23,
    marginBottom: 25,
  },

  inputHeroIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },

  inputHeroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  inputHeroText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#D8E9DC',
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#526158',
    marginBottom: 8,
  },

  textInput: {
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE4DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 17,
    fontSize: 16,
    color: '#173C2A',
    marginBottom: 18,
  },

  ingredientsInput: {
    minHeight: 180,
    paddingTop: 16,
  },

  primaryButton: {
    minHeight: 58,
    borderRadius: 19,
    backgroundColor: '#287A45',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  orText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#9AA69E',
    marginVertical: 17,
  },

  secondaryButton: {
    minHeight: 56,
    borderRadius: 19,
    backgroundColor: '#EAF5E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    marginLeft: 9,
    fontSize: 15,
    fontWeight: '700',
    color: '#287A45',
  },

  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  nutritionField: {
    width: '48.3%',
    marginBottom: 15,
  },

  nutritionInputWrapper: {
    height: 55,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#DCE4DB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },

  nutritionInput: {
    flex: 1,
    fontSize: 16,
    color: '#173C2A',
  },

  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A958E',
  },

  successCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EAE2',
    borderRadius: 29,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
  },

  successIcon: {
    width: 68,
    height: 68,
    borderRadius: 23,
    backgroundColor: '#EAF5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },

  successTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#173C2A',
    marginBottom: 9,
    textAlign: 'center',
  },

  successText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#78857D',
    textAlign: 'center',
    marginBottom: 19,
  },

  tipCard: {
    borderRadius: 24,
    backgroundColor: '#EDF6EA',
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
  },

  tipIcon: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#DDF0D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#287A45',
    marginBottom: 4,
  },

  tipText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#718078',
  },

  bottomSpace: {
    height: 5,
  },

  /* CAMERA */

  cameraSafeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },

  camera: {
    ...StyleSheet.absoluteFill,
  },

  cameraOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
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
    borderRadius: 36,
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
});