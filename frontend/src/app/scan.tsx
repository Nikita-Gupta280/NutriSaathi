import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ScanScreen() {
  const manualEntry = () => {
    Alert.alert(
      'Manual barcode',
      'Manual barcode entry will be connected to the product database.'
    );
  };

  const openResult = () => {
    router.push('/result');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>NUTRISAATHI</Text>
            <Text style={styles.title}>Scan your food</Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="sparkles" size={21} color="#287A45" />
          </View>
        </View>

        <View style={styles.scannerCard}>
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

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
            We'll instantly understand the product and check what's inside.
          </Text>
        </View>

        <View style={styles.optionsRow}>
          <Pressable style={styles.optionCard}>
            <View style={styles.optionIcon}>
              <Ionicons
                name="barcode-outline"
                size={25}
                color="#287A45"
              />
            </View>

            <Text style={styles.optionTitle}>Barcode</Text>

            <Text style={styles.optionSubtitle}>
              Scan product code
            </Text>
          </Pressable>

          <Pressable style={styles.optionCard}>
            <View style={styles.optionIcon}>
              <Ionicons
                name="document-text-outline"
                size={25}
                color="#287A45"
              />
            </View>

            <Text style={styles.optionTitle}>Food Label</Text>

            <Text style={styles.optionSubtitle}>
              Scan ingredients
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.manualCard}
          onPress={manualEntry}
        >
          <View style={styles.manualIcon}>
            <Ionicons
              name="search-outline"
              size={22}
              color="#287A45"
            />
          </View>

          <Text style={styles.manualText}>
            Enter barcode manually
          </Text>

          <Ionicons
            name="chevron-forward"
            size={24}
            color="#287A45"
          />
        </Pressable>

        <Pressable
          style={styles.demoCard}
          onPress={openResult}
        >
          <View style={styles.demoIcon}>
            <Ionicons
              name="sparkles"
              size={21}
              color="#173B2A"
            />
          </View>

          <View style={styles.demoContent}>
            <Text style={styles.demoTitle}>
              Smart food analysis
            </Text>

            <Text style={styles.demoText}>
              Tap here to preview how NutriSaathi analyses nutrition,
              ingredients, allergens and family compatibility.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#287A45"
          />
        </Pressable>

        <View style={styles.tipCard}>
          <Ionicons
            name="bulb-outline"
            size={20}
            color="#287A45"
          />

          <Text style={styles.tipText}>
            Your scan results combine food information with your family's
            preferences.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    padding: 16,
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
    marginRight: 12,
  },

  manualText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#315541',
  },

  demoCard: {
    marginTop: 12,
    backgroundColor: '#E8F4E7',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  demoIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  demoContent: {
    flex: 1,
  },

  demoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#287A45',
    marginBottom: 4,
  },

  demoText: {
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
});