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

const alternatives = [
  {
    name: 'Whole Grain Oat Bites',
    brand: 'NutriChoice',
    score: 84,
    description:
      'A similar snack with lower sugar and more fiber.',
    tags: ['Lower sugar', 'High fiber', 'Whole grains'],
    improvements: [
      'Sugar: 9g instead of 18g',
      'Fiber: 6g instead of 2g',
      'Protein: 8g instead of 6g',
    ],
    family:
      'Better fit across the family profiles.',
  },
  {
    name: 'High Protein Oat Crunch',
    brand: 'FitHarvest',
    score: 81,
    description:
      'A stronger option when protein and satiety matter.',
    tags: ['High protein', 'Lower sugar', 'Oats'],
    improvements: [
      'Protein: 11g',
      'Sugar: 8g',
      'Fiber: 5g',
    ],
    family:
      'Especially suitable for high-protein goals.',
  },
  {
    name: 'Simple Oat Digestives',
    brand: 'GrainGood',
    score: 78,
    description:
      'A simpler everyday option with less added sugar.',
    tags: ['Simple ingredients', 'Less sugar'],
    improvements: [
      'Lower added sugar',
      'More whole grains',
      'Less processed',
    ],
    family:
      'A better everyday snack choice.',
  },
];

export default function ResultScreen() {
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#173B2A"
            />
          </Pressable>

          <Text style={styles.headerLabel}>
            PRODUCT ANALYSIS
          </Text>

          <View style={styles.headerIcon}>
            <Ionicons
              name="sparkles"
              size={19}
              color="#287A45"
            />
          </View>
        </View>

        {/* PRODUCT */}
        <View style={styles.productCard}>
          <View style={styles.productImage}>
            <Text style={styles.productEmoji}>🍪</Text>
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.brand}>
              EXAMPLE FOODS
            </Text>

            <Text style={styles.productName}>
              Oat & Choco Biscuits
            </Text>

            <Text style={styles.productMeta}>
              Biscuits · 100 g
            </Text>
          </View>
        </View>

        {/* SCORE */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreTop}>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>
                YOUR FOOD SCORE
              </Text>

              <Text style={styles.scoreDescription}>
                Good choice, with a few things to watch.
              </Text>
            </View>

            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>
                72
              </Text>

              <Text style={styles.scoreOutOf}>
                /100
              </Text>
            </View>
          </View>

          <View style={styles.scoreBar}>
            <View style={styles.scoreFill} />
          </View>

          <View style={styles.scoreBottom}>
            <View style={styles.verdictPill}>
              <Ionicons
                name="checkmark-circle"
                size={15}
                color="#287A45"
              />

              <Text style={styles.verdictText}>
                MODERATE
              </Text>
            </View>

            <Text style={styles.scoreHint}>
              Nutrition + ingredients
            </Text>
          </View>
        </View>

        {/* WHY SCORE */}
        <Text style={styles.sectionTitle}>
          Why this score?
        </Text>

        <View style={styles.reasonCard}>
          <ReasonRow
            type="good"
            title="Good protein content"
            text="Provides a useful amount of protein for a packaged snack."
          />

          <View style={styles.divider} />

          <ReasonRow
            type="warning"
            title="Sugar needs attention"
            text="Sugar is relatively high for a regular everyday snack."
          />

          <View style={styles.divider} />

          <ReasonRow
            type="good"
            title="No major allergen detected"
            text="No major allergen was flagged in the available ingredient data."
          />
        </View>

        {/* NUTRITION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Nutrition snapshot
          </Text>

          <Text style={styles.smallLabel}>
            per 100 g
          </Text>
        </View>

        <View style={styles.nutritionGrid}>
          <NutritionCard
            value="450"
            unit="kcal"
            label="Calories"
          />

          <NutritionCard
            value="18 g"
            unit="high"
            label="Sugar"
            warning
          />

          <NutritionCard
            value="6 g"
            unit="good"
            label="Protein"
          />

          <NutritionCard
            value="2 g"
            unit="low"
            label="Fiber"
          />
        </View>

        {/* INGREDIENTS */}
        <Text
          style={[
            styles.sectionTitle,
            styles.sectionSpacing,
          ]}
        >
          Ingredient check
        </Text>

        <View style={styles.ingredientCard}>
          <View style={styles.ingredientHeader}>
            <View style={styles.ingredientIcon}>
              <Ionicons
                name="flask-outline"
                size={20}
                color="#287A45"
              />
            </View>

            <View style={styles.ingredientHeaderText}>
              <Text style={styles.ingredientTitle}>
                3 ingredients worth knowing
              </Text>

              <Text style={styles.ingredientSubtitle}>
                NutriSaathi explains what matters.
              </Text>
            </View>
          </View>

          <View style={styles.tagRow}>
            <IngredientTag
              text="Added sugar"
              type="warning"
            />

            <IngredientTag
              text="Refined flour"
              type="neutral"
            />

            <IngredientTag
              text="Oats"
              type="good"
            />
          </View>
        </View>

        {/* FAMILY */}
        <View style={styles.familyCard}>
          <View style={styles.familyHeader}>
            <View style={styles.familyHeaderText}>
              <Text style={styles.familyLabel}>
                SMART FAMILY MODE
              </Text>

              <Text style={styles.familyTitle}>
                How does it fit your family?
              </Text>
            </View>

            <View style={styles.familyIcon}>
              <Ionicons
                name="people"
                size={21}
                color="#173B2A"
              />
            </View>
          </View>

          <FamilyMember
            name="You"
            reason="Generally suitable"
            status="SAFE"
            icon="person"
          />

          <FamilyMember
            name="Mom"
            reason="Watch sodium & sugar"
            status="CAUTION"
            icon="heart"
          />

          <FamilyMember
            name="Dad"
            reason="High sugar for his profile"
            status="WATCH"
            icon="person"
          />
        </View>

        {/* PERSONALIZED WARNING */}
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
              Why this matters for your family
            </Text>

            <Text style={styles.personalBody}>
              A product can have a reasonable overall
              score but still be a poor fit for a specific
              family member because of their allergies,
              dietary restrictions, health considerations,
              goals or preferences.
            </Text>
          </View>
        </View>

        {/* BETTER ALTERNATIVES */}
        <View style={styles.alternativeHeader}>
          <View style={styles.alternativeHeaderText}>
            <Text style={styles.sectionTitle}>
              Better alternatives
            </Text>

            <Text style={styles.alternativeSubtitle}>
              Personalized options that improve the
              things that matter most.
            </Text>
          </View>

          <View style={styles.alternativeIcon}>
            <Ionicons
              name="swap-horizontal-outline"
              size={21}
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
                styles.featuredAlternative,
            ]}
          >
            {index === 0 && (
              <View style={styles.topAlternativeBadge}>
                <Ionicons
                  name="sparkles"
                  size={12}
                  color="#FFFFFF"
                />

                <Text style={styles.topAlternativeText}>
                  TOP RECOMMENDATION
                </Text>
              </View>
            )}

            <View style={styles.alternativeTop}>
              <View style={styles.alternativeImage}>
                <Text style={styles.alternativeEmoji}>
                  🌾
                </Text>
              </View>

              <View style={styles.alternativeInfo}>
                <Text style={styles.alternativeBrand}>
                  {alternative.brand}
                </Text>

                <Text style={styles.alternativeName}>
                  {alternative.name}
                </Text>

                <Text style={styles.alternativeDescription}>
                  {alternative.description}
                </Text>
              </View>

              <View style={styles.alternativeScore}>
                <Text style={styles.altScoreNumber}>
                  {alternative.score}
                </Text>

                <Text style={styles.altScoreLabel}>
                  score
                </Text>
              </View>
            </View>

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

            <View style={styles.improvementBox}>
              <Text style={styles.improvementTitle}>
                What improves
              </Text>

              {alternative.improvements.map(
                (item) => (
                  <View
                    key={item}
                    style={styles.improvementRow}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={15}
                      color="#287A45"
                    />

                    <Text style={styles.improvementText}>
                      {item}
                    </Text>
                  </View>
                )
              )}
            </View>

            <View style={styles.familyRecommendation}>
              <Ionicons
                name="people-outline"
                size={17}
                color="#287A45"
              />

              <Text style={styles.familyRecommendationText}>
                {alternative.family}
              </Text>
            </View>
          </View>
        ))}

        {/* COMPARE CTA */}
        <View style={styles.compareCard}>
          <View style={styles.compareIcon}>
            <Ionicons
              name="swap-horizontal-outline"
              size={22}
              color="#287A45"
            />
          </View>

          <View style={styles.compareText}>
            <Text style={styles.compareTitle}>
              Want to see them side-by-side?
            </Text>

            <Text style={styles.compareSubtitle}>
              Compare nutrition, ingredients and family
              suitability.
            </Text>
          </View>

          <Pressable
            style={styles.compareButton}
            onPress={() => router.push('/compare')}
          >
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/scan')}
          >
            <Ionicons
              name="scan-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.primaryButtonText}>
              Scan another product
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/family')}
          >
            <Ionicons
              name="people-outline"
              size={19}
              color="#287A45"
            />

            <Text style={styles.secondaryButtonText}>
              Manage family profiles
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          NutriSaathi · Understand your food. Choose what
          suits you.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReasonRow({
  type,
  title,
  text,
}: {
  type: 'good' | 'warning';
  title: string;
  text: string;
}) {
  return (
    <View style={styles.reasonRow}>
      <View
        style={[
          styles.reasonIcon,
          type === 'warning' &&
            styles.warningReasonIcon,
        ]}
      >
        <Ionicons
          name={
            type === 'good'
              ? 'checkmark'
              : 'warning-outline'
          }
          size={17}
          color={
            type === 'good'
              ? '#287A45'
              : '#B8754E'
          }
        />
      </View>

      <View style={styles.reasonContent}>
        <Text style={styles.reasonTitle}>
          {title}
        </Text>

        <Text style={styles.reasonText}>
          {text}
        </Text>
      </View>
    </View>
  );
}

function NutritionCard({
  value,
  unit,
  label,
  warning = false,
}: {
  value: string;
  unit: string;
  label: string;
  warning?: boolean;
}) {
  return (
    <View style={styles.nutritionCard}>
      <Text style={styles.nutritionValue}>
        {value}
      </Text>

      <Text
        style={[
          styles.nutritionUnit,
          warning && styles.warningNutrition,
        ]}
      >
        {unit}
      </Text>

      <Text style={styles.nutritionLabel}>
        {label}
      </Text>
    </View>
  );
}

function IngredientTag({
  text,
  type,
}: {
  text: string;
  type: 'good' | 'warning' | 'neutral';
}) {
  return (
    <View
      style={[
        styles.ingredientTag,
        type === 'good' && styles.goodTag,
        type === 'warning' && styles.warningTag,
        type === 'neutral' && styles.neutralTag,
      ]}
    >
      <Text
        style={[
          styles.ingredientTagText,
          type === 'good' && styles.goodTagText,
          type === 'warning' &&
            styles.warningTagText,
          type === 'neutral' &&
            styles.neutralTagText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

function FamilyMember({
  name,
  reason,
  status,
  icon,
}: {
  name: string;
  reason: string;
  status: 'SAFE' | 'CAUTION' | 'WATCH';
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const isSafe = status === 'SAFE';

  return (
    <View style={styles.familyMember}>
      <View
        style={[
          styles.familyAvatar,
          !isSafe && styles.familyAvatarWarning,
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={isSafe ? '#287A45' : '#B8754E'}
        />
      </View>

      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>
          {name}
        </Text>

        <Text style={styles.memberReason}>
          {reason}
        </Text>
      </View>

      <View
        style={[
          styles.statusPill,
          isSafe
            ? styles.safePill
            : styles.cautionPill,
        ]}
      >
        <Ionicons
          name={
            isSafe
              ? 'checkmark'
              : 'warning-outline'
          }
          size={12}
          color={isSafe ? '#287A45' : '#B8754E'}
        />

        <Text
          style={[
            styles.statusText,
            isSafe
              ? styles.safeText
              : styles.cautionText,
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
    backgroundColor: '#F6F9F4',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#287A45',
  },

  headerIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  productImage: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#F0E6D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  productEmoji: {
    fontSize: 40,
  },

  productInfo: {
    flex: 1,
  },

  brand: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#6D8878',
    marginBottom: 5,
  },

  productName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#173B2A',
  },

  productMeta: {
    fontSize: 10,
    color: '#89958E',
    marginTop: 5,
  },

  scoreCard: {
    marginTop: 12,
    backgroundColor: '#19543E',
    borderRadius: 27,
    padding: 21,
  },

  scoreTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  scoreInfo: {
    flex: 1,
    paddingRight: 12,
  },

  scoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: '#B9E6B7',
    marginBottom: 8,
  },

  scoreDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#D3E3D8',
  },

  scoreCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#B9E6B7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#173B2A',
  },

  scoreOutOf: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4C735C',
  },

  scoreBar: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#316950',
    marginTop: 19,
    overflow: 'hidden',
  },

  scoreFill: {
    width: '72%',
    height: '100%',
    backgroundColor: '#B9E6B7',
    borderRadius: 4,
  },

  scoreBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 13,
  },

  verdictPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4E7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },

  verdictText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#287A45',
    marginLeft: 4,
  },

  scoreHint: {
    fontSize: 9,
    color: '#AFC8B9',
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#173B2A',
  },

  reasonCard: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  reasonIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  warningReasonIcon: {
    backgroundColor: '#FFF0DD',
  },

  reasonContent: {
    flex: 1,
    marginLeft: 11,
  },

  reasonTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#173B2A',
  },

  reasonText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#7B8981',
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#E9EDE9',
    marginVertical: 14,
  },

  sectionHeader: {
    marginTop: 27,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  smallLabel: {
    fontSize: 10,
    color: '#89958E',
  },

  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  nutritionCard: {
    width: '48.5%',
    minHeight: 105,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E4EAE3',
    marginBottom: 10,
  },

  nutritionValue: {
    fontSize: 21,
    fontWeight: '700',
    color: '#173B2A',
  },

  nutritionUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: '#287A45',
    marginTop: 2,
  },

  warningNutrition: {
    color: '#B8754E',
  },

  nutritionLabel: {
    fontSize: 10,
    color: '#89958E',
    marginTop: 11,
  },

  sectionSpacing: {
    marginTop: 17,
    marginBottom: 12,
  },

  ingredientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  ingredientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ingredientIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  ingredientHeaderText: {
    flex: 1,
  },

  ingredientTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#173B2A',
  },

  ingredientSubtitle: {
    fontSize: 9,
    color: '#89958E',
    marginTop: 4,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },

  ingredientTag: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 13,
    marginRight: 7,
    marginBottom: 7,
  },

  warningTag: {
    backgroundColor: '#FFF0DD',
  },

  neutralTag: {
    backgroundColor: '#F0F3F0',
  },

  goodTag: {
    backgroundColor: '#E8F4E7',
  },

  ingredientTagText: {
    fontSize: 9,
    fontWeight: '700',
  },

  warningTagText: {
    color: '#A66A43',
  },

  neutralTagText: {
    color: '#6F7C74',
  },

  goodTagText: {
    color: '#287A45',
  },

  familyCard: {
    marginTop: 27,
    backgroundColor: '#19543E',
    borderRadius: 27,
    padding: 19,
  },

  familyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  familyHeaderText: {
    flex: 1,
  },

  familyLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: '#B9E6B7',
    marginBottom: 7,
  },

  familyTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  familyIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  familyMember: {
    backgroundColor: '#28664C',
    borderRadius: 17,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  familyAvatar: {
    width: 39,
    height: 39,
    borderRadius: 14,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  familyAvatarWarning: {
    backgroundColor: '#FFF0DD',
  },

  memberInfo: {
    flex: 1,
  },

  memberName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  memberReason: {
    fontSize: 9,
    color: '#C8DDD0',
    marginTop: 3,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },

  safePill: {
    backgroundColor: '#E8F4E7',
  },

  cautionPill: {
    backgroundColor: '#FFF0DD',
  },

  statusText: {
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 3,
  },

  safeText: {
    color: '#287A45',
  },

  cautionText: {
    color: '#A66A43',
  },

  personalCard: {
    flexDirection: 'row',
    backgroundColor: '#EAF5ED',
    borderRadius: 18,
    padding: 15,
    marginTop: 15,
    marginBottom: 25,
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

  alternativeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  alternativeHeaderText: {
    flex: 1,
  },

  alternativeSubtitle: {
    fontSize: 11.5,
    lineHeight: 17,
    color: '#87938C',
    marginTop: 3,
  },

  alternativeIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  alternativeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4EAE3',
    marginBottom: 12,
  },

  featuredAlternative: {
    borderColor: '#AFCDB6',
  },

  topAlternativeBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#287A45',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 12,
  },

  topAlternativeText: {
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

  alternativeImage: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: '#E9F0E2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  alternativeEmoji: {
    fontSize: 30,
  },

  alternativeInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
  },

  alternativeBrand: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#6D8878',
  },

  alternativeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#173B2A',
    marginTop: 3,
  },

  alternativeDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: '#89958E',
    marginTop: 4,
  },

  alternativeScore: {
    alignItems: 'center',
  },

  altScoreNumber: {
    fontSize: 21,
    fontWeight: '700',
    color: '#287A45',
  },

  altScoreLabel: {
    fontSize: 8,
    color: '#89958E',
  },

  smallTag: {
    backgroundColor: '#F0F6F1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },

  smallTagText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#3D6148',
  },

  improvementBox: {
    backgroundColor: '#F7FAF7',
    borderRadius: 13,
    padding: 11,
    marginTop: 7,
  },

  improvementTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#526157',
    marginBottom: 5,
  },

  improvementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  improvementText: {
    fontSize: 10.5,
    color: '#65736A',
    marginLeft: 6,
  },

  familyRecommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },

  familyRecommendationText: {
    flex: 1,
    fontSize: 10.5,
    color: '#5F7065',
    marginLeft: 6,
  },

  compareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#DCE7DE',
    padding: 14,
    marginTop: 7,
  },

  compareIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  compareText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },

  compareTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#29402F',
  },

  compareSubtitle: {
    fontSize: 10.5,
    color: '#89958E',
    marginTop: 3,
    lineHeight: 15,
  },

  compareButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actions: {
    marginTop: 18,
  },

  primaryButton: {
    backgroundColor: '#287A45',
    borderRadius: 18,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  secondaryButton: {
    backgroundColor: '#E8F4E7',
    borderRadius: 18,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
  },

  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#287A45',
    marginLeft: 7,
  },

  footer: {
    textAlign: 'center',
    fontSize: 9,
    color: '#89958E',
    marginTop: 22,
  },
});