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

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>NUTRISAATHI</Text>
            <Text style={styles.title}>Explore</Text>
            <Text style={styles.subtitle}>
              Make every food choice a healthier one.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="sparkles" size={28} color="#287A45" />
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="leaf" size={38} color="#EAF5E8" />
          </View>

          <Text style={styles.heroEyebrow}>SMART NUTRITION</Text>

          <Text style={styles.heroTitle}>
            Know what's{'\n'}inside your food.
          </Text>

          <Text style={styles.heroText}>
            Scan products, understand ingredients and make choices that fit
            your family's needs.
          </Text>

          <Pressable
            style={styles.heroButton}
            onPress={() => router.push('/scan')}
          >
            <Text style={styles.heroButtonText}>Scan a product</Text>
            <Ionicons name="arrow-forward" size={24} color="#173C2A" />
          </Pressable>
        </View>

        {/* Toolkit heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your nutrition toolkit</Text>
          <Text style={styles.featureCount}>4 features</Text>
        </View>

        {/* Toolkit cards */}
        <View style={styles.grid}>
          <Pressable
            style={[styles.toolCard, styles.greenCard]}
            onPress={() => router.push('/scan')}
          >
            <View style={[styles.toolIcon, styles.greenIcon]}>
              <Ionicons name="scan-outline" size={26} color="#287A45" />
            </View>

            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Smart Scan</Text>
              <Text style={styles.toolText}>
                Check ingredients, nutrition and allergens instantly.
              </Text>
            </View>

            <Ionicons
              name="arrow-forward"
              size={25}
              color="#287A45"
              style={styles.cardArrow}
            />
          </Pressable>

          <Pressable
            style={[styles.toolCard, styles.peachCard]}
            onPress={() => router.push('/family')}
          >
            <View style={[styles.toolIcon, styles.peachIcon]}>
              <Ionicons name="people-outline" size={26} color="#A87436" />
            </View>

            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Family Safety</Text>
              <Text style={styles.toolText}>
                Keep everyone's dietary needs together in one place.
              </Text>
            </View>

            <Ionicons
              name="arrow-forward"
              size={25}
              color="#A87436"
              style={styles.cardArrow}
            />
          </Pressable>

          <Pressable
            style={[styles.toolCard, styles.blueCard]}
            onPress={() => router.push('/profile')}
          >
            <View style={[styles.toolIcon, styles.blueIcon]}>
              <Ionicons
                name="person-outline"
                size={26}
                color="#4E7E91"
              />
            </View>

            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>My Preferences</Text>
              <Text style={styles.toolText}>
                Set your dietary preferences, allergies and nutrition goals.
              </Text>
            </View>

            <Ionicons
              name="arrow-forward"
              size={25}
              color="#4E7E91"
              style={styles.cardArrow}
            />
          </Pressable>

          <Pressable
            style={[styles.toolCard, styles.lilacCard]}
            onPress={() => router.push('/scan')}
          >
            <View style={[styles.toolIcon, styles.lilacIcon]}>
              <Ionicons name="time-outline" size={26} color="#816A91" />
            </View>

            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>Scan History</Text>
              <Text style={styles.toolText}>
                Revisit the products you've already checked.
              </Text>
            </View>

            <Ionicons
              name="arrow-forward"
              size={25}
              color="#816A91"
              style={styles.cardArrow}
            />
          </Pressable>
        </View>

        {/* Bottom information card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={25}
              color="#287A45"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Food safety. Made simple.</Text>
            <Text style={styles.infoText}>
              One scan helps you understand what's inside and what works best
              for you and your family.
            </Text>
          </View>
        </View>

        {/* Bottom breathing space */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 8,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  brand: {
    fontSize: 14,
    letterSpacing: 2.2,
    fontWeight: '700',
    color: '#287A45',
    marginBottom: 6,
  },

  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#173C2A',
    letterSpacing: -1,
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
    marginTop: 2,
  },

  hero: {
    backgroundColor: '#205F47',
    borderRadius: 34,
    padding: 28,
    marginBottom: 26,
  },

  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },

  heroEyebrow: {
    fontSize: 13,
    letterSpacing: 1.7,
    fontWeight: '700',
    color: '#BFE0C2',
    marginBottom: 18,
  },

  heroTitle: {
    fontSize: 36,
    lineHeight: 43,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 18,
  },

  heroText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#D8E9DC',
    marginBottom: 25,
  },

  heroButton: {
    height: 62,
    borderRadius: 21,
    backgroundColor: '#F8FAF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 23,
  },

  heroButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#173C2A',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#173C2A',
    letterSpacing: -0.5,
  },

  featureCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B968F',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },

  toolCard: {
    width: '48.3%',
    minHeight: 190,
    borderRadius: 28,
    padding: 20,
    justifyContent: 'space-between',
  },

  greenCard: {
    backgroundColor: '#EAF5E8',
  },

  peachCard: {
    backgroundColor: '#FFF1E2',
  },

  blueCard: {
    backgroundColor: '#E7F2F5',
  },

  lilacCard: {
    backgroundColor: '#F0EAF4',
  },

  toolIcon: {
    width: 54,
    height: 54,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  greenIcon: {
    backgroundColor: '#DDF0D9',
  },

  peachIcon: {
    backgroundColor: '#FFE4BE',
  },

  blueIcon: {
    backgroundColor: '#DCECF1',
  },

  lilacIcon: {
    backgroundColor: '#E5D8EA',
  },

  toolContent: {
    marginTop: 18,
  },

  toolTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#173C2A',
    marginBottom: 8,
  },

  toolText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6F7E75',
  },

  cardArrow: {
    alignSelf: 'flex-end',
    marginTop: 14,
  },

  infoCard: {
    marginTop: 16,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6ECE5',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#EAF5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#173C2A',
    marginBottom: 5,
  },

  infoText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#78857D',
  },

  bottomSpace: {
    height: 4,
  },
});