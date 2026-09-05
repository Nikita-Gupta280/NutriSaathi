import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const products = [
  {
    id: 1,
    name: 'Whole Grain Oat Bites',
    brand: 'NutriChoice',
    score: 84,
    label: 'BEST CHOICE',
    calories: '390',
    sugar: '9g',
    protein: '8g',
    fiber: '6g',
    sodium: '180mg',
    ingredients: ['Whole grains', 'Oats', 'Cocoa'],
    concerns: 1,
  },
  {
    id: 2,
    name: 'Oat & Choco Biscuits',
    brand: 'Example Foods',
    score: 72,
    label: 'MODERATE',
    calories: '450',
    sugar: '18g',
    protein: '6g',
    fiber: '2g',
    sodium: '300mg',
    ingredients: ['Refined flour', 'Added sugar', 'Oats'],
    concerns: 2,
  },
  {
    id: 3,
    name: 'Choco Crunch Biscuits',
    brand: 'Daily Bites',
    score: 61,
    label: 'CAUTION',
    calories: '475',
    sugar: '24g',
    protein: '4g',
    fiber: '2g',
    sodium: '360mg',
    ingredients: ['Refined flour', 'Sugar', 'Palm oil'],
    concerns: 3,
  },
];

const alternatives = [
  {
    name: 'Whole Grain Oat Bites',
    brand: 'NutriChoice',
    score: 84,
    reason:
      'Lower sugar, more fiber and better ingredient quality.',
    tags: ['Lower sugar', 'High fiber', 'Whole grains'],
    improves: [
      'Sugar: 9g vs 18g',
      'Fiber: 6g vs 2g',
      'Protein: 8g vs 6g',
    ],
    family:
      'Safer fit across the family profiles.',
  },
  {
    name: 'High Protein Oat Crunch',
    brand: 'FitHarvest',
    score: 81,
    reason:
      'A stronger choice when protein and satiety matter.',
    tags: ['High protein', 'Lower sugar', 'Oats'],
    improves: [
      'Protein: 11g',
      'Sugar: 8g',
      'Fiber: 5g',
    ],
    family:
      'Good fit for high-protein goals.',
  },
  {
    name: 'Simple Oat Digestives',
    brand: 'GrainGood',
    score: 78,
    reason:
      'Simpler ingredients with less added sugar.',
    tags: ['Simple ingredients', 'Less sugar'],
    improves: [
      'Lower added sugar',
      'Less processed',
      'More whole grains',
    ],
    family:
      'Better everyday option.',
  },
];

export default function ComparisonResultScreen() {
  const winner = products[0];
  const original = products[1];

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              SMART COMPARISON
            </Text>

            <Text style={styles.title}>
              Your better choice
            </Text>

            <Text style={styles.subtitle}>
              We looked beyond the overall score.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="sparkles"
              size={24}
              color="#287A45"
            />
          </View>
        </View>

        {/* WINNER */}
        <View style={styles.winnerCard}>
          <View style={styles.winnerTop}>
            <View style={styles.winnerBadge}>
              <Ionicons
                name="trophy"
                size={15}
                color="#287A45"
              />

              <Text style={styles.winnerBadgeText}>
                RECOMMENDED
              </Text>
            </View>

            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>
                {winner.score}
              </Text>

              <Text style={styles.scoreSmall}>
                /100
              </Text>
            </View>
          </View>

          <Text style={styles.winnerName}>
            {winner.name}
          </Text>

          <Text style={styles.winnerBrand}>
            {winner.brand}
          </Text>

          <View style={styles.reasonRow}>
            <View style={styles.checkCircle}>
              <Ionicons
                name="checkmark"
                size={15}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.reasonText}>
              Best balance of nutrition, ingredients
              and family suitability.
            </Text>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                Lower sugar
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                High fiber
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                Whole grains
              </Text>
            </View>
          </View>
        </View>

        {/* WHY WINNER */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Why it wins
          </Text>
        </View>

        <View style={styles.whyCard}>
          <WhyRow
            icon="water-outline"
            title="Lower sugar"
            value={`${winner.sugar} vs ${original.sugar}`}
          />

          <WhyRow
            icon="leaf-outline"
            title="More fiber"
            value={`${winner.fiber} vs ${original.fiber}`}
          />

          <WhyRow
            icon="fitness-outline"
            title="More protein"
            value={`${winner.protein} vs ${original.protein}`}
          />

          <WhyRow
            icon="document-text-outline"
            title="Cleaner ingredients"
            value="Whole grains instead of refined flour"
          />
        </View>

        {/* BETTER ALTERNATIVES */}
        <View style={styles.sectionHeaderWithSubtitle}>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>
              Better alternatives
            </Text>

            <Text style={styles.sectionSubtitle}>
              Recommendations based on nutrition,
              ingredients and your goals.
            </Text>
          </View>

          <View style={styles.altIcon}>
            <Ionicons
              name="swap-horizontal-outline"
              size={20}
              color="#287A45"
            />
          </View>
        </View>

        {alternatives.map((alternative, index) => (
          <View
            key={alternative.name}
            style={[
              styles.alternativeCard,
              index === 0 &&
                styles.alternativeCardFeatured,
            ]}
          >
            {index === 0 && (
              <View style={styles.topPick}>
                <Ionicons
                  name="sparkles"
                  size={13}
                  color="#FFFFFF"
                />

                <Text style={styles.topPickText}>
                  TOP ALTERNATIVE
                </Text>
              </View>
            )}

            <View style={styles.alternativeTop}>
              <View style={styles.productMiniIcon}>
                <Ionicons
                  name="cube-outline"
                  size={21}
                  color="#287A45"
                />
              </View>

              <View style={styles.alternativeInfo}>
                <Text style={styles.alternativeName}>
                  {alternative.name}
                </Text>

                <Text style={styles.alternativeBrand}>
                  {alternative.brand}
                </Text>
              </View>

              <View style={styles.altScore}>
                <Text style={styles.altScoreNumber}>
                  {alternative.score}
                </Text>

                <Text style={styles.altScoreLabel}>
                  score
                </Text>
              </View>
            </View>

            <Text style={styles.alternativeReason}>
              {alternative.reason}
            </Text>

            <View style={styles.tagRow}>
              {alternative.tags.map((tag) => (
                <View
                  key={tag}
                  style={styles.smallTag}
                >
                  <Text style={styles.smallTagText}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.improvesBox}>
              <Text style={styles.improvesTitle}>
                What improves
              </Text>

              {alternative.improves.map((item) => (
                <View
                  key={item}
                  style={styles.improvesRow}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color="#287A45"
                  />

                  <Text style={styles.improvesText}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.familyRow}>
              <Ionicons
                name="people-outline"
                size={17}
                color="#287A45"
              />

              <Text style={styles.familyText}>
                {alternative.family}
              </Text>
            </View>
          </View>
        ))}

        {/* PERSONALIZED EXPLANATION */}
        <View style={styles.personalCard}>
          <View style={styles.personalIcon}>
            <Ionicons
              name="bulb-outline"
              size={21}
              color="#287A45"
            />
          </View>

          <View style={styles.personalText}>
            <Text style={styles.personalTitle}>
              Why NutriSaathi recommended these
            </Text>

            <Text style={styles.personalBody}>
              Recommendations are not based only on a
              general health score. NutriSaathi considers
              your family's dietary needs, health
              considerations, goals, allergies and food
              preferences.
            </Text>
          </View>
        </View>

        {/* NUTRITION COMPARISON */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Nutrition snapshot
          </Text>
        </View>

        <View style={styles.nutritionCard}>
          <NutritionRow
            label="Calories"
            original={original.calories}
            better={winner.calories}
          />

          <NutritionRow
            label="Sugar"
            original={original.sugar}
            better={winner.sugar}
            betterValue
          />

          <NutritionRow
            label="Protein"
            original={original.protein}
            better={winner.protein}
            betterValue
          />

          <NutritionRow
            label="Fiber"
            original={original.fiber}
            better={winner.fiber}
            betterValue
          />

          <NutritionRow
            label="Sodium"
            original={original.sodium}
            better={winner.sodium}
            betterValue
          />
        </View>

        {/* FAMILY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Family suitability
          </Text>
        </View>

        <View style={styles.familyCard}>
          <FamilyResult
            name="You"
            status="SAFE"
            detail="Fits your current profile"
            icon="person"
          />

          <FamilyResult
            name="Mom"
            status="SAFE"
            detail="No major conflicts detected"
            icon="person"
          />

          <FamilyResult
            name="Dad"
            status="CAUTION"
            detail="Watch sugar intake"
            icon="person"
          />
        </View>

        {/* ACTIONS */}
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/scan')}
        >
          <Ionicons
            name="scan-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.primaryButtonText}>
            Scan another product
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFFFFF"
          />
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/compare')}
        >
          <Ionicons
            name="swap-horizontal-outline"
            size={20}
            color="#287A45"
          />

          <Text style={styles.secondaryButtonText}>
            Compare again
          </Text>
        </Pressable>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

function WhyRow({
  icon,
  title,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.whyRow}>
      <View style={styles.whyIcon}>
        <Ionicons
          name={icon}
          size={18}
          color="#287A45"
        />
      </View>

      <View style={styles.whyInfo}>
        <Text style={styles.whyTitle}>
          {title}
        </Text>

        <Text style={styles.whyValue}>
          {value}
        </Text>
      </View>

      <Ionicons
        name="checkmark-circle"
        size={19}
        color="#287A45"
      />
    </View>
  );
}

function NutritionRow({
  label,
  original,
  better,
  betterValue = false,
}: {
  label: string;
  original: string;
  better: string;
  betterValue?: boolean;
}) {
  return (
    <View style={styles.nutritionRow}>
      <Text style={styles.nutritionLabel}>
        {label}
      </Text>

      <Text style={styles.originalValue}>
        {original}
      </Text>

      <View
        style={[
          styles.betterValueBox,
          betterValue &&
            styles.betterValueBoxActive,
        ]}
      >
        <Text
          style={[
            styles.betterValue,
            betterValue &&
              styles.betterValueActive,
          ]}
        >
          {better}
        </Text>
      </View>
    </View>
  );
}

function FamilyResult({
  name,
  status,
  detail,
  icon,
}: {
  name: string;
  status: string;
  detail: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const caution = status === 'CAUTION';

  return (
    <View style={styles.familyResult}>
      <View style={styles.familyAvatar}>
        <Ionicons
          name={icon}
          size={18}
          color="#287A45"
        />
      </View>

      <View style={styles.familyInfo}>
        <Text style={styles.familyName}>
          {name}
        </Text>

        <Text style={styles.familyDetail}>
          {detail}
        </Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          caution &&
            styles.statusBadgeCaution,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            caution &&
              styles.statusTextCaution,
          ]}
        >
          {status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF7',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 19,
  },

  eyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#287A45',
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#183B25',
  },

  subtitle: {
    fontSize: 13,
    color: '#7A877F',
    marginTop: 4,
  },

  headerIcon: {
    marginLeft: 'auto',
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E9F4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  winnerCard: {
    backgroundColor: '#183B25',
    borderRadius: 22,
    padding: 19,
    marginBottom: 23,
  },

  winnerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCEFE1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },

  winnerBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#287A45',
    marginLeft: 5,
  },

  scoreCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2B6740',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreNumber: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },

  scoreSmall: {
    color: '#BBD2C1',
    fontSize: 8,
    marginTop: -2,
  },

  winnerName: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    marginTop: 13,
  },

  winnerBrand: {
    color: '#B8CCBF',
    fontSize: 12,
    marginTop: 3,
  },

  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  checkCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  reasonText: {
    flex: 1,
    color: '#DCE9DF',
    fontSize: 12,
    lineHeight: 17,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },

  tag: {
    backgroundColor: '#2B5739',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 5,
  },

  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D9EBDD',
  },

  sectionHeader: {
    marginBottom: 11,
    marginTop: 1,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#183B25',
  },

  whyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4EBE5',
    padding: 6,
    marginBottom: 23,
  },

  whyRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2EE',
  },

  whyIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  whyInfo: {
    flex: 1,
  },

  whyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2A4031',
  },

  whyValue: {
    fontSize: 11,
    color: '#87928B',
    marginTop: 2,
  },

  sectionHeaderWithSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionSubtitle: {
    fontSize: 11.5,
    color: '#87938C',
    marginTop: 3,
    lineHeight: 17,
  },

  altIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  alternativeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E4EBE5',
    padding: 16,
    marginBottom: 12,
  },

  alternativeCardFeatured: {
    borderColor: '#AFCDB6',
    backgroundColor: '#FCFEFC',
  },

  topPick: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#287A45',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 12,
  },

  topPickText: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#FFFFFF',
    marginLeft: 4,
  },

  alternativeTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productMiniIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  alternativeInfo: {
    flex: 1,
    marginLeft: 10,
  },

  alternativeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#243A2B',
  },

  alternativeBrand: {
    fontSize: 11,
    color: '#89958E',
    marginTop: 2,
  },

  altScore: {
    alignItems: 'center',
    marginLeft: 8,
  },

  altScoreNumber: {
    fontSize: 19,
    fontWeight: '700',
    color: '#287A45',
  },

  altScoreLabel: {
    fontSize: 8,
    color: '#87938C',
  },

  alternativeReason: {
    fontSize: 12,
    lineHeight: 18,
    color: '#65736A',
    marginTop: 13,
  },

  smallTag: {
    backgroundColor: '#F0F6F1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 5,
  },

  smallTagText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#3D6148',
  },

  improvesBox: {
    backgroundColor: '#F7FAF7',
    borderRadius: 13,
    padding: 11,
    marginTop: 12,
  },

  improvesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#526157',
    marginBottom: 6,
  },

  improvesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  improvesText: {
    fontSize: 11,
    color: '#65736A',
    marginLeft: 6,
  },

  familyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },

  familyText: {
    flex: 1,
    fontSize: 10.5,
    color: '#5F7065',
    marginLeft: 6,
  },

  personalCard: {
    flexDirection: 'row',
    backgroundColor: '#EAF5ED',
    borderRadius: 18,
    padding: 15,
    marginTop: 5,
    marginBottom: 23,
  },

  personalIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  personalText: {
    flex: 1,
  },

  personalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#285333',
    marginBottom: 4,
  },

  personalBody: {
    fontSize: 11.5,
    lineHeight: 17,
    color: '#617367',
  },

  nutritionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4EBE5',
    padding: 8,
    marginBottom: 23,
  },

  nutritionRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2EE',
  },

  nutritionLabel: {
    flex: 1,
    fontSize: 12,
    color: '#526158',
    paddingLeft: 7,
  },

  originalValue: {
    width: 65,
    textAlign: 'center',
    fontSize: 12,
    color: '#8A948E',
  },

  betterValueBox: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },

  betterValueBoxActive: {
    backgroundColor: '#EAF5ED',
  },

  betterValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#536159',
  },

  betterValueActive: {
    color: '#287A45',
  },

  familyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4EBE5',
    paddingHorizontal: 13,
    marginBottom: 20,
  },

  familyResult: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2EE',
  },

  familyAvatar: {
    width: 37,
    height: 37,
    borderRadius: 13,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  familyInfo: {
    flex: 1,
  },

  familyName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#293F30',
  },

  familyDetail: {
    fontSize: 10.5,
    color: '#89958E',
    marginTop: 2,
  },

  statusBadge: {
    backgroundColor: '#E7F3EA',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  statusBadgeCaution: {
    backgroundColor: '#FFF3DE',
  },

  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#287A45',
  },

  statusTextCaution: {
    color: '#9A6A19',
  },

  primaryButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: '#287A45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    marginHorizontal: 10,
  },

  secondaryButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFD4C4',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  secondaryButtonText: {
    color: '#287A45',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 7,
  },

  bottomSpace: {
    height: 15,
  },
});