import React, { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type InputMode =
  | 'scanBarcode'
  | 'cameraLabel'
  | 'gallery'
  | 'barcode'
  | 'ingredients'
  | 'nutrition'
  | null;

const MAX_PRODUCTS = 5;

export default function CompareScreen() {
  const [products, setProducts] = useState<number[]>([1, 2]);
  const [inputMode, setInputMode] = useState<InputMode>(null);

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

  const [, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const addProduct = () => {
    if (products.length >= MAX_PRODUCTS) {
      Alert.alert(
        'Maximum reached',
        'You can compare up to 5 products.'
      );
      return;
    }

    setProducts((current) => [
      ...current,
      Math.max(...current) + 1,
    ]);
  };

  const removeProduct = (id: number) => {
    if (products.length <= 2) {
      return;
    }

    setProducts((current) =>
      current.filter((item) => item !== id)
    );
  };

  const openCamera = async (
    mode: 'scanBarcode' | 'cameraLabel'
  ) => {
    const permission = await requestCameraPermission();

    if (!permission.granted) {
      Alert.alert(
        'Camera permission needed',
        'Please allow camera access to use this option.'
      );
      return;
    }

    setInputMode(mode);
  };

  const handleBarcodeScanned = ({
    data,
  }: {
    data: string;
    type: string;
  }) => {
    setBarcode(data);
    setInputMode(null);

    Alert.alert(
      'Barcode captured',
      `Barcode: ${data}`
    );
  };

  const openGallery = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

    if (!result.canceled) {
      setInputMode(null);

      Alert.alert(
        'Image selected',
        'Product image selected successfully.'
      );
    }
  };

  const handleLabelPhoto = async () => {
    try {
      if (!cameraRef.current) {
        Alert.alert(
          'Camera not ready',
          'Please wait a moment and try again.'
        );
        return;
      }

      await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      setInputMode(null);

      Alert.alert(
        'Label captured',
        'Product label captured successfully.'
      );
    } catch {
      Alert.alert(
        'Capture failed',
        'We could not capture the product label. Please try again.'
      );
    }
  };

  const saveBarcode = () => {
    if (!barcode.trim()) {
      Alert.alert(
        'Enter barcode',
        'Please enter a barcode first.'
      );
      return;
    }

    setInputMode(null);

    Alert.alert(
      'Barcode added',
      'Product barcode saved.'
    );
  };

  const saveIngredients = () => {
    if (!ingredients.trim()) {
      Alert.alert(
        'Enter ingredients',
        'Please enter the ingredient list first.'
      );
      return;
    }

    setInputMode(null);

    Alert.alert(
      'Ingredients added',
      'Ingredient data saved.'
    );
  };

  const saveNutrition = () => {
    const hasValue = Object.values(nutrition).some(
      (value) => value.trim() !== ''
    );

    if (!hasValue) {
      Alert.alert(
        'Enter nutrition data',
        'Please enter at least one nutrition value.'
      );
      return;
    }

    setInputMode(null);

    Alert.alert(
      'Nutrition added',
      'Nutrition data saved.'
    );
  };

  const compareProducts = () => {
    if (products.length < 2) {
      Alert.alert(
        'Add another product',
        'You need at least two products to compare.'
      );
      return;
    }

    router.push('/comparison-result');
  };

  /* ================= CAMERA ================= */

  // Use the exact same camera structure as the working Scan screen.
  // Both barcode scanning and label photography get the same visible shutter.
  if (inputMode === 'scanBarcode' || inputMode === 'cameraLabel') {
    const cameraMode =
      inputMode === 'scanBarcode' ? 'barcode' : 'label';

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
            barcodeScannerSettings={
              cameraMode === 'barcode'
                ? {
                    barcodeTypes: [
                      'ean13',
                      'ean8',
                      'upc_a',
                      'upc_e',
                      'code128',
                      'code39',
                    ],
                  }
                : undefined
            }
            onBarcodeScanned={
              cameraMode === 'barcode'
                ? handleBarcodeScanned
                : undefined
            }
          />

          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setInputMode(null)}
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
                onPress={handleLabelPhoto}
              >
                <View style={styles.captureInner}>
                  <Ionicons
                    name="camera"
                    size={30}
                    color="#287A45"
                  />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>
                SMART COMPARISON
              </Text>

              <Text style={styles.title}>
                Compare Products
              </Text>

              <Text style={styles.subtitle}>
                Find the better choice for you and your
                family.
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <Ionicons
                name="swap-horizontal-outline"
                size={25}
                color="#287A45"
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="sparkles-outline"
                size={21}
                color="#287A45"
              />
            </View>

            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>
                Smarter than a score
              </Text>

              <Text style={styles.infoBody}>
                We compare nutrition, ingredients,
                allergies and family suitability
                together.
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Products ({products.length}/5)
            </Text>

            <Text style={styles.sectionHint}>
              Add 2–5 products
            </Text>
          </View>

          {products.map((product, index) => (
            <View
              style={styles.productCard}
              key={product}
            >
              <View style={styles.productTop}>
                <View style={styles.productNumber}>
                  <Text style={styles.productNumberText}>
                    {index + 1}
                  </Text>
                </View>

                <View style={styles.productHeading}>
                  <Text style={styles.productTitle}>
                    Product {index + 1}
                  </Text>

                  <Text style={styles.productSubtitle}>
                    Choose how to add this product
                  </Text>
                </View>

                {products.length > 2 && (
                  <Pressable
                    onPress={() =>
                      removeProduct(product)
                    }
                    style={styles.removeButton}
                  >
                    <Ionicons
                      name="close"
                      size={19}
                      color="#8A968E"
                    />
                  </Pressable>
                )}
              </View>

              <View style={styles.methodGrid}>
                <Pressable
                  style={styles.methodCard}
                  onPress={() =>
                    openCamera('scanBarcode')
                  }
                >
                  <Ionicons
                    name="barcode-outline"
                    size={23}
                    color="#287A45"
                  />

                  <Text style={styles.methodText}>
                    Scan barcode
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.methodCard}
                  onPress={() =>
                    openCamera('cameraLabel')
                  }
                >
                  <Ionicons
                    name="camera-outline"
                    size={23}
                    color="#287A45"
                  />

                  <Text style={styles.methodText}>
                    Camera
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.methodCard}
                  onPress={openGallery}
                >
                  <Ionicons
                    name="images-outline"
                    size={23}
                    color="#287A45"
                  />

                  <Text style={styles.methodText}>
                    Gallery
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.methodCard}
                  onPress={() =>
                    setInputMode('barcode')
                  }
                >
                  <Ionicons
                    name="keypad-outline"
                    size={23}
                    color="#287A45"
                  />

                  <Text style={styles.methodText}>
                    Enter barcode
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.methodCard}
                  onPress={() =>
                    setInputMode('ingredients')
                  }
                >
                  <Ionicons
                    name="document-text-outline"
                    size={23}
                    color="#287A45"
                  />

                  <Text style={styles.methodText}>
                    Ingredients
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.methodCard}
                  onPress={() =>
                    setInputMode('nutrition')
                  }
                >
                  <Ionicons
                    name="nutrition-outline"
                    size={23}
                    color="#287A45"
                  />

                  <Text style={styles.methodText}>
                    Nutrition
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}

          {products.length < MAX_PRODUCTS && (
            <Pressable
              style={styles.addButton}
              onPress={addProduct}
            >
              <Ionicons
                name="add"
                size={21}
                color="#287A45"
              />

              <Text style={styles.addButtonText}>
                Add another product
              </Text>
            </Pressable>
          )}

          {inputMode === 'barcode' && (
            <View style={styles.entryPanel}>
              <Text style={styles.entryTitle}>
                Enter barcode
              </Text>

              <TextInput
                value={barcode}
                onChangeText={setBarcode}
                placeholder="e.g. 8901234567890"
                placeholderTextColor="#A0AAA3"
                keyboardType="numeric"
                autoFocus
                style={styles.input}
              />

              <Pressable
                style={styles.doneButton}
                onPress={saveBarcode}
              >
                <Text style={styles.doneButtonText}>
                  Done
                </Text>
              </Pressable>
            </View>
          )}

          {inputMode === 'ingredients' && (
            <View style={styles.entryPanel}>
              <Text style={styles.entryTitle}>
                Enter ingredients
              </Text>

              <TextInput
                value={ingredients}
                onChangeText={setIngredients}
                placeholder="Paste or type ingredient list..."
                placeholderTextColor="#A0AAA3"
                multiline
                autoFocus
                style={[
                  styles.input,
                  styles.textArea,
                ]}
              />

              <Pressable
                style={styles.doneButton}
                onPress={saveIngredients}
              >
                <Text style={styles.doneButtonText}>
                  Done
                </Text>
              </Pressable>
            </View>
          )}

          {inputMode === 'nutrition' && (
            <View style={styles.entryPanel}>
              <Text style={styles.entryTitle}>
                Enter nutrition values
              </Text>

              {[
                ['calories', 'Calories (kcal)'],
                ['sugar', 'Sugar (g)'],
                ['protein', 'Protein (g)'],
                ['fat', 'Fat (g)'],
                ['fiber', 'Fiber (g)'],
                ['sodium', 'Sodium (mg)'],
              ].map(([key, label]) => (
                <TextInput
                  key={key}
                  value={
                    nutrition[
                      key as keyof typeof nutrition
                    ]
                  }
                  onChangeText={(value) =>
                    setNutrition((current) => ({
                      ...current,
                      [key]: value,
                    }))
                  }
                  placeholder={label}
                  placeholderTextColor="#A0AAA3"
                  keyboardType="decimal-pad"
                  style={styles.input}
                />
              ))}

              <Pressable
                style={styles.doneButton}
                onPress={saveNutrition}
              >
                <Text style={styles.doneButtonText}>
                  Done
                </Text>
              </Pressable>
            </View>
          )}

          <View style={styles.bottomSpace} />
        </ScrollView>

        <View style={styles.compareBar}>
          <Pressable
            style={styles.compareButton}
            onPress={compareProducts}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.compareButtonText}>
              Compare Products
            </Text>

            <Ionicons
              name="arrow-forward"
              size={19}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF7',
  },

  flex: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: '#287A45',
    marginBottom: 5,
  },

  title: {
    fontSize: 29,
    fontWeight: '700',
    color: '#183B25',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#718078',
    marginTop: 5,
    maxWidth: 290,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F4EC',
    marginLeft: 10,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EAF5ED',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoText: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#214A2D',
    marginBottom: 3,
  },

  infoBody: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#5E7165',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#183B25',
  },

  sectionHint: {
    fontSize: 11.5,
    color: '#87938C',
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E7EDE8',
  },

  productTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  productNumber: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  productNumberText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#287A45',
  },

  productHeading: {
    flex: 1,
  },

  productTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#213A29',
  },

  productSubtitle: {
    fontSize: 11.5,
    color: '#89958E',
    marginTop: 2,
  },

  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F4F6F4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  methodCard: {
    width: '31.5%',
    minHeight: 78,
    borderRadius: 14,
    backgroundColor: '#F7FAF7',
    borderWidth: 1,
    borderColor: '#E5ECE6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginBottom: 9,
  },

  methodText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#415249',
    marginTop: 7,
    textAlign: 'center',
  },

  addButton: {
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B9D2BF',
    backgroundColor: '#F9FCF9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  addButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#287A45',
    marginLeft: 7,
  },

  entryPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E3EAE4',
    padding: 16,
    marginBottom: 16,
  },

  entryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#183B25',
    marginBottom: 11,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#DCE5DE',
    borderRadius: 13,
    backgroundColor: '#FAFCFA',
    paddingHorizontal: 13,
    color: '#25392C',
    fontSize: 14,
    marginBottom: 9,
  },

  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  doneButton: {
    height: 47,
    borderRadius: 13,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },

  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  compareBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#F7FAF7',
  },

  compareButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: '#287A45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  compareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 10,
  },

  bottomSpace: {
    height: 20,
  },

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
    borderRadius: 39,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },

  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});