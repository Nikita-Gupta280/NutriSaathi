import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>NUTRISAATHI</Text>
            <Text style={styles.greeting}>Good to see you.</Text>
          </View>

          <View style={styles.headerButtons}>
            <Pressable
              style={styles.headerCircle}
              onPress={() => router.push('/profile')}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color="#173B2A"
              />
            </Pressable>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Ionicons
              name="sparkles"
              size={15}
              color="#173B2A"
            />

            <Text style={styles.heroBadgeText}>
              SMART FOOD COMPANION
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Know what{'\n'}you eat.
          </Text>

          <Text style={styles.heroSubtitle}>
            Choose what suits you, your health, and your family.
          </Text>

          <View style={styles.heroVisual}>
            <View style={styles.insightCard}>
              <View style={styles.checkCircle}>
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="#FFFFFF"
                />
              </View>

              <View>
                <Text style={styles.insightTitle}>
                  Made for you
                </Text>

                <Text style={styles.insightSubtitle}>
                  Personalised insight
                </Text>
              </View>
            </View>

            <View style={styles.foodCircle}>
              <Text style={styles.foodEmoji}>🥗</Text>
            </View>
          </View>

          <Pressable
            style={styles.scanButton}
            onPress={() => router.push('/scan')}
          >
            <View style={styles.scanButtonIcon}>
              <Ionicons
                name="scan-outline"
                size={20}
                color="#173B2A"
              />
            </View>

            <Text style={styles.scanButtonText}>
              Scan a product
            </Text>

            <Ionicons
              name="arrow-forward"
              size={22}
              color="#173B2A"
            />
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Products scanned</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Safer choices</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.familyStatIcon}>
              <Ionicons
                name="shield-checkmark"
                size={21}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.statLabel}>Family safe</Text>
          </View>
        </View>

        {/* Toolkit */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Your toolkit</Text>
            <Text style={styles.sectionSubtitle}>
              Everything you need to choose smarter.
            </Text>
          </View>
        </View>

        <View style={styles.toolkitRow}>
          {/* Family */}
          <Pressable
            style={styles.toolCard}
            onPress={() => router.push('/family')}
          >
            <View style={styles.toolIcon}>
              <Ionicons
                name="people-outline"
                size={24}
                color="#287A45"
              />
            </View>

            <Text style={styles.toolTitle}>Family Mode</Text>

            <Text style={styles.toolText}>
              See whether a product suits everyone at home.
            </Text>

            <View style={styles.toolArrow}>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#287A45"
              />
            </View>
          </Pressable>

          {/* Compare */}
          <Pressable
            style={styles.toolCard}
            onPress={() => router.push('/explore')}
          >
            <View style={styles.toolIcon}>
              <Ionicons
                name="swap-horizontal-outline"
                size={24}
                color="#287A45"
              />
            </View>

            <Text style={styles.toolTitle}>Compare</Text>

            <Text style={styles.toolText}>
              Put products side by side before you buy.
            </Text>

            <View style={styles.toolArrow}>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#287A45"
              />
            </View>
          </Pressable>
        </View>

        {/* Daily Insight */}
        <View style={styles.insightBanner}>
          <View style={styles.insightBannerIcon}>
            <Ionicons
              name="bulb-outline"
              size={23}
              color="#173B2A"
            />
          </View>

          <View style={styles.insightBannerContent}>
            <Text style={styles.insightBannerLabel}>
              TODAY'S INSIGHT
            </Text>

            <Text style={styles.insightBannerText}>
              A product can look healthy on the front and still hide
              important ingredients in the label.
            </Text>
          </View>
        </View>

        {/* Bottom message */}
        <View style={styles.bottomMessage}>
          <Ionicons
            name="leaf-outline"
            size={22}
            color="#4D9165"
          />

          <Text style={styles.bottomMessageText}>
            Better information. Better choices. A healthier everyday.
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
    paddingTop: 10,
    paddingBottom: 28,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  logo: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#287A45',
    marginBottom: 5,
  },

  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#173B2A',
  },

  headerButtons: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAE3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  hero: {
    backgroundColor: '#B9E6B7',
    borderRadius: 30,
    padding: 24,
    minHeight: 500,
    overflow: 'hidden',
  },

  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFF3DE',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  heroBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#173B2A',
    marginLeft: 6,
  },

  heroTitle: {
    fontSize: 39,
    lineHeight: 43,
    fontWeight: '800',
    color: '#173B2A',
    marginTop: 31,
  },

  heroSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#315541',
    marginTop: 14,
    maxWidth: 290,
  },

  heroVisual: {
    height: 170,
    position: 'relative',
    marginTop: 5,
  },

  foodCircle: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#D9F0D8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  foodEmoji: {
    fontSize: 78,
  },

  insightCard: {
    position: 'absolute',
    left: 0,
    top: 45,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingHorizontal: 13,
    paddingVertical: 11,
    elevation: 3,
  },

  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  insightTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#173B2A',
  },

  insightSubtitle: {
    fontSize: 8,
    color: '#89958E',
    marginTop: 3,
  },

  scanButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    minHeight: 58,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  scanButtonIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#173B2A',
    marginLeft: 2,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 13,
  },

  statCard: {
    flex: 1,
    minHeight: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E4EAE3',
    justifyContent: 'space-between',
  },

  statNumber: {
    fontSize: 25,
    fontWeight: '800',
    color: '#173B2A',
  },

  statLabel: {
    fontSize: 9,
    color: '#89958E',
    lineHeight: 13,
  },

  familyStatIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionHeader: {
    marginTop: 29,
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#173B2A',
  },

  sectionSubtitle: {
    fontSize: 11,
    color: '#89958E',
    marginTop: 5,
  },

  toolkitRow: {
    flexDirection: 'row',
    gap: 10,
  },

  toolCard: {
    flex: 1,
    minHeight: 235,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 19,
  },

  toolTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#173B2A',
  },

  toolText: {
    fontSize: 10,
    lineHeight: 16,
    color: '#89958E',
    marginTop: 9,
  },

  toolArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    bottom: 15,
  },

  insightBanner: {
    marginTop: 14,
    backgroundColor: '#173B2A',
    borderRadius: 24,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },

  insightBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#B9E6B7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  insightBannerContent: {
    flex: 1,
  },

  insightBannerLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#B9E6B7',
    marginBottom: 5,
  },

  insightBannerText: {
    fontSize: 10,
    lineHeight: 16,
    color: '#D1E0D6',
  },

  bottomMessage: {
    marginTop: 14,
    backgroundColor: '#E8F4E7',
    borderRadius: 22,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomMessageText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '600',
    color: '#496756',
    marginLeft: 10,
  },
});