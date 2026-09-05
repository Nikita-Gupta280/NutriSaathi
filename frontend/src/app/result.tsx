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
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  let analysis: any = null;

  try {
    const rawAnalysis = params.analysis;

    if (typeof rawAnalysis === 'string') {
      analysis = JSON.parse(rawAnalysis);
    } else if (Array.isArray(rawAnalysis)) {
      analysis = JSON.parse(rawAnalysis[0]);
    }
  } catch (error) {
    console.error(
      'Could not parse analysis:',
      error
    );
  }

  const product = analysis?.product || {};
  const healthScore = analysis?.health_score || {};
  const nutrition = product?.nutrition || {};
  const ingredientAnalysis =
    analysis?.ingredient_analysis || {};

  const productName =
    product?.product_name || 'Product';

  const brand =
    product?.brand || 'Unknown brand';

  const category =
    product?.category || 'Food product';

  const ingredients =
    product?.ingredients ||
    'Ingredients information unavailable.';

  const score =
    typeof healthScore?.score === 'number'
      ? healthScore.score
      : 0;

  const scoreLabel =
    healthScore?.label || 'Not available';

  const calories =
    nutrition?.calories_kcal_100g ??
    nutrition?.calories_kcal ??
    '--';

  const sugar =
    nutrition?.sugar_g_100g ??
    nutrition?.sugar_g ??
    '--';

  const protein =
    nutrition?.protein_g_100g ??
    nutrition?.protein_g ??
    '--';

  const fiber =
    nutrition?.fiber_g_100g ??
    nutrition?.dietary_fiber_g_100g ??
    '--';

  const sodium =
    nutrition?.sodium_mg_100g ??
    nutrition?.sodium_mg ??
    '--';

  const saturatedFat =
    nutrition?.saturated_fat_g_100g ??
    nutrition?.saturated_fat_g ??
    '--';

  const allergens =
    product?.allergens || 'None listed';

  const ingredientInsight =
    ingredientAnalysis?.summary ||
    ingredientAnalysis?.message ||
    '';

  const scorePercentage = Math.max(
    0,
    Math.min(100, score * 10)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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
              size={22}
              color="#173B2A"
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.eyebrow}>
              NUTRISAATHI
            </Text>

            <Text style={styles.headerTitle}>
              Food analysis
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* PRODUCT */}

        <View style={styles.productCard}>
          <View style={styles.productIcon}>
            <Ionicons
              name="fast-food-outline"
              size={34}
              color="#287A45"
            />
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.brand}>
              {brand}
            </Text>

            <Text style={styles.productName}>
              {productName}
            </Text>

            <Text style={styles.category}>
              {category}
            </Text>
          </View>
        </View>

        {/* HEALTH SCORE */}

        <View style={styles.scoreCard}>
          <View style={styles.scoreTop}>
            <View>
              <Text style={styles.sectionLabel}>
                HEALTH SCORE
              </Text>

              <Text style={styles.scoreNumber}>
                {score}
                <Text style={styles.scoreScale}>
                  {' '}/ 10
                </Text>
              </Text>

              <Text style={styles.scoreLabel}>
                {scoreLabel}
              </Text>
            </View>

            <View style={styles.scoreCircle}>
              <Ionicons
                name="leaf-outline"
                size={34}
                color="#287A45"
              />
            </View>
          </View>

          <View style={styles.scoreBarBackground}>
            <View
              style={[
                styles.scoreBar,
                {
                  width: `${scorePercentage}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.scoreDescription}>
            This score is calculated from the product's
            nutrition and ingredient information.
          </Text>
        </View>

        {/* WHY THIS SCORE */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Why this score?
          </Text>

          {Array.isArray(
            healthScore?.details
          ) &&
          healthScore.details.length > 0 ? (
            healthScore.details.map(
              (detail: any, index: number) => (
                <View
                  style={styles.detailRow}
                  key={index}
                >
                  <View style={styles.detailIcon}>
                    <Ionicons
                      name="information-circle-outline"
                      size={19}
                      color="#287A45"
                    />
                  </View>

                  <Text style={styles.detailText}>
                    {typeof detail === 'string'
                      ? detail
                      : detail?.reason ||
                        detail?.message ||
                        JSON.stringify(detail)}
                  </Text>
                </View>
              )
            )
          ) : (
            <Text style={styles.emptyText}>
              No detailed scoring information available.
            </Text>
          )}
        </View>

        {/* NUTRITION */}

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>
              Nutrition
            </Text>

            <Text style={styles.per100g}>
              per 100 g
            </Text>
          </View>

          <View style={styles.nutritionGrid}>
            <NutritionItem
              icon="flame-outline"
              label="Calories"
              value={calories}
              unit="kcal"
            />

            <NutritionItem
              icon="cube-outline"
              label="Sugar"
              value={sugar}
              unit="g"
            />

            <NutritionItem
              icon="barbell-outline"
              label="Protein"
              value={protein}
              unit="g"
            />

            <NutritionItem
              icon="leaf-outline"
              label="Fiber"
              value={fiber}
              unit="g"
            />

            <NutritionItem
              icon="water-outline"
              label="Sodium"
              value={sodium}
              unit="mg"
            />

            <NutritionItem
              icon="ellipse-outline"
              label="Sat. fat"
              value={saturatedFat}
              unit="g"
            />
          </View>
        </View>

        {/* INGREDIENTS */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Ingredients
          </Text>

          {ingredientInsight ? (
            <Text style={styles.insightText}>
              {ingredientInsight}
            </Text>
          ) : null}

          <Text style={styles.ingredientsText}>
            {ingredients}
          </Text>
        </View>

        {/* ALLERGENS */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Allergens
          </Text>

          <View style={styles.allergenRow}>
            <Ionicons
              name="warning-outline"
              size={20}
              color="#B97816"
            />

            <Text style={styles.allergenText}>
              {allergens}
            </Text>
          </View>
        </View>

        {/* FAMILY */}

        <View style={styles.familyCard}>
          <View style={styles.familyIcon}>
            <Ionicons
              name="people-outline"
              size={25}
              color="#287A45"
            />
          </View>

          <View style={styles.familyContent}>
            <Text style={styles.familyTitle}>
              Family compatibility
            </Text>

            <Text style={styles.familyText}>
              Add family profiles to get personalized
              safety and suitability results.
            </Text>
          </View>
        </View>

        {/* RECOMMENDATIONS */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Better alternatives
          </Text>

          {Array.isArray(
            analysis?.recommendations
          ) &&
          analysis.recommendations.length > 0 ? (
            analysis.recommendations.map(
              (item: any, index: number) => (
                <View
                  style={styles.recommendation}
                  key={index}
                >
                  <View style={styles.recommendationIcon}>
                    <Ionicons
                      name="sparkles-outline"
                      size={21}
                      color="#287A45"
                    />
                  </View>

                  <View style={styles.recommendationText}>
                    <Text style={styles.recommendationTitle}>
                      {item?.product_name ||
                        item?.name ||
                        'Recommended product'}
                    </Text>

                    <Text style={styles.recommendationSub}>
                      {item?.reason ||
                        item?.category ||
                        'Recommended by NutriSaathi'}
                    </Text>
                  </View>
                </View>
              )
            )
          ) : (
            <Text style={styles.emptyText}>
              No alternatives available for this product.
            </Text>
          )}
        </View>

        {/* ACTION */}

        <Pressable
          style={styles.scanButton}
          onPress={() =>
            router.replace('/scan')
          }
        >
          <Ionicons
            name="scan-outline"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.scanButtonText}>
            Scan another product
          </Text>
        </Pressable>

        <Text style={styles.tagline}>
          Ingredients Mein Jhol, NutriSaathi Khole Pol!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------
// NUTRITION ITEM
// ---------------------------------------------------------

function NutritionItem({
  icon,
  label,
  value,
  unit,
}: {
  icon: any;
  label: string;
  value: any;
  unit: string;
}) {
  return (
    <View style={styles.nutritionItem}>
      <View style={styles.nutritionIcon}>
        <Ionicons
          name={icon}
          size={20}
          color="#287A45"
        />
      </View>

      <Text style={styles.nutritionLabel}>
        {label}
      </Text>

      <Text style={styles.nutritionValue}>
        {value}
        <Text style={styles.nutritionUnit}>
          {' '}
          {unit}
        </Text>
      </Text>
    </View>
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
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  headerCenter: {
    alignItems: 'center',
  },

  headerSpacer: {
    width: 42,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#287A45',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#173B2A',
    marginTop: 3,
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  productIcon: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  productInfo: {
    flex: 1,
  },

  brand: {
    fontSize: 11,
    fontWeight: '700',
    color: '#287A45',
    marginBottom: 4,
  },

  productName: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '800',
    color: '#173B2A',
  },

  category: {
    fontSize: 11,
    color: '#78867D',
    marginTop: 6,
  },

  scoreCard: {
    marginTop: 12,
    backgroundColor: '#E8F4E7',
    borderRadius: 25,
    padding: 20,
  },

  scoreTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#287A45',
  },

  scoreNumber: {
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '900',
    color: '#173B2A',
    marginTop: 4,
  },

  scoreScale: {
    fontSize: 18,
    fontWeight: '700',
    color: '#78867D',
  },

  scoreLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#287A45',
  },

  scoreCircle: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreBarBackground: {
    height: 9,
    backgroundColor: '#D0E2CF',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },

  scoreBar: {
    height: '100%',
    backgroundColor: '#287A45',
    borderRadius: 10,
  },

  scoreDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#5F7167',
    marginTop: 12,
  },

  card: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#173B2A',
    marginBottom: 14,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  per100g: {
    fontSize: 10,
    color: '#78867D',
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 11,
  },

  detailIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  detailText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#4F6257',
    paddingTop: 5,
  },

  emptyText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#78867D',
  },

  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  nutritionItem: {
    width: '31%',
    minHeight: 105,
    backgroundColor: '#F6F9F4',
    borderRadius: 16,
    padding: 11,
  },

  nutritionIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  nutritionLabel: {
    fontSize: 9,
    color: '#78867D',
  },

  nutritionValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#173B2A',
    marginTop: 3,
  },

  nutritionUnit: {
    fontSize: 9,
    fontWeight: '600',
    color: '#78867D',
  },

  ingredientsText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#4F6257',
  },

  insightText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#287A45',
    fontWeight: '700',
    marginBottom: 12,
  },

  allergenRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF6E5',
    padding: 12,
    borderRadius: 15,
  },

  allergenText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#72531F',
    marginLeft: 9,
  },

  familyCard: {
    marginTop: 12,
    backgroundColor: '#E8F4E7',
    borderRadius: 23,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },

  familyIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  familyContent: {
    flex: 1,
  },

  familyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#287A45',
  },

  familyText: {
    fontSize: 10,
    lineHeight: 16,
    color: '#5F7167',
    marginTop: 4,
  },

  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  recommendationIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  recommendationText: {
    flex: 1,
  },

  recommendationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173B2A',
  },

  recommendationSub: {
    fontSize: 10,
    color: '#78867D',
    marginTop: 3,
  },

  scanButton: {
    marginTop: 18,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#287A45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 9,
  },

  tagline: {
    textAlign: 'center',
    fontSize: 10,
    color: '#78867D',
    marginTop: 15,
  },
});