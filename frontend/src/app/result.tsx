import React, { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type AnyObject = Record<string, any>;

type ProductView = {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  ingredients: string[];
  allergens: string[];
  nutrition: AnyObject;
  score: number | null;
  label: string;
  reasons: string[];
  familyResults: AnyObject[];
  recommendations: AnyObject[];
};

const asObject = (value: any): AnyObject | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? value : null;

const firstObject = (...values: any[]) =>
  values.find((value) => asObject(value) !== null) || {};

const textValue = (...values: any[]) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
};

const numberValue = (...values: any[]) => {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return null;
};

const stringArray = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') {
          return textValue(item.name, item.ingredient, item.label, item.title);
        }
        return '';
      })
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,;|]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseApiResponse = (raw: string) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const normalizeResponse = (payload: AnyObject | null): ProductView | null => {
  if (!payload) return null;

  const data = asObject(payload.data) || {};
  const result = asObject(payload.result) || {};
  const analysis = firstObject(
    payload.analysis,
    data.analysis,
    result.analysis,
    payload
  );

  const product = firstObject(
    payload.product,
    data.product,
    result.product,
    payload.product_data,
    data.product_data,
    result.product_data
  );

  const nutrition = firstObject(
    product.nutrition,
    data.nutrition,
    payload.nutrition,
    analysis.nutrition
  );

  const ingredients = stringArray(
    product.ingredients ??
      data.ingredients ??
      payload.ingredients ??
      analysis.ingredients
  );

  const allergens = stringArray(
    product.allergens ??
      data.allergens ??
      payload.allergens ??
      analysis.allergens
  );

  const score = numberValue(
    analysis.overall_score,
    analysis.health_score,
    analysis.score,
    payload.overall_score,
    payload.health_score,
    payload.score,
    data.overall_score
  );

  const label = textValue(
    analysis.overall_label,
    analysis.health_label,
    analysis.label,
    payload.overall_label,
    payload.health_label,
    payload.label,
    score !== null ? (score >= 80 ? 'Good' : score >= 60 ? 'Moderate' : 'Needs attention') : ''
  );

  const reasons = stringArray(
    analysis.reasons ??
      analysis.health_reasons ??
      analysis.key_reasons ??
      payload.reasons ??
      payload.health_reasons
  );

  const familyResults =
    (Array.isArray(analysis.family_results) && analysis.family_results) ||
    (Array.isArray(payload.family_results) && payload.family_results) ||
    (Array.isArray(data.family_results) && data.family_results) ||
    [];

  const recommendations =
    (Array.isArray(analysis.recommendations) && analysis.recommendations) ||
    (Array.isArray(payload.recommendations) && payload.recommendations) ||
    (Array.isArray(data.recommendations) && data.recommendations) ||
    (Array.isArray(result.recommendations) && result.recommendations) ||
    [];

  const name = textValue(
    product.product_name,
    product.name,
    product.title,
    data.product_name,
    payload.product_name,
    payload.name
  );

  const id = textValue(
    product.product_id,
    product.id,
    data.product_id,
    payload.product_id
  );

  const barcode = textValue(
    product.barcode,
    data.barcode,
    payload.barcode
  );

  if (!name && !id && !barcode) return null;

  return {
    id,
    barcode,
    name: name || 'Unknown product',
    brand: textValue(product.brand, data.brand, payload.brand) || 'Brand not provided',
    category:
      textValue(product.category, data.category, payload.category) ||
      'Category not provided',
    ingredients,
    allergens,
    nutrition,
    score,
    label: label || 'Analysis available',
    reasons,
    familyResults,
    recommendations,
  };
};

const formatNutrition = (value: any, unit: string) => {
  if (value === null || value === undefined || value === '') return '—';
  return `${value}${unit}`;
};

const getFamilyName = (member: AnyObject, index: number) =>
  textValue(
    member.name,
    member.member_name,
    member.profile_name,
    member.member_id
  ) || `Member ${index + 1}`;

const getFamilyVerdict = (member: AnyObject) =>
  textValue(member.verdict, member.status, member.result, member.label) ||
  'REVIEW';

const getFamilyReasons = (member: AnyObject) =>
  stringArray(member.reasons ?? member.reason ?? member.explanation);

const getRecommendationName = (item: AnyObject, index: number) =>
  textValue(
    item.product_name,
    item.name,
    item.title,
    item.product?.product_name,
    item.product?.name
  ) || `Recommended product ${index + 1}`;

const getRecommendationBrand = (item: AnyObject) =>
  textValue(item.brand, item.product?.brand);

const getRecommendationCategory = (item: AnyObject) =>
  textValue(item.category, item.product?.category);

const getRecommendationReason = (item: AnyObject) =>
  textValue(item.reason, item.reasons, item.explanation, item.match_reason);

export default function ResultScreen() {
  const params = useLocalSearchParams<{
    api_response?: string | string[];
    barcode?: string | string[];
  }>();

  const rawResponse = Array.isArray(params.api_response)
    ? params.api_response[0]
    : params.api_response || '';

  const scannedBarcode = Array.isArray(params.barcode)
    ? params.barcode[0] || ''
    : params.barcode || '';

  const product = useMemo(
    () => normalizeResponse(parseApiResponse(rawResponse)),
    [rawResponse]
  );

  const payload = useMemo(
    () => parseApiResponse(rawResponse),
    [rawResponse]
  );

  const openChat = () => {
    if (!product) return;

    const familyMembers =
      payload?.family_members ||
      payload?.data?.family_members ||
      payload?.analysis?.family_members ||
      [];

    router.push({
      pathname: '/chat',
      params: {
        product_id: product.id,
        barcode: product.barcode || scannedBarcode,
        family_members: JSON.stringify(
          Array.isArray(familyMembers) ? familyMembers : []
        ),
      },
    });
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color="#B8754E"
            />
          </View>

          <Text style={styles.emptyTitle}>No product result</Text>
          <Text style={styles.emptyText}>
            NutriSaathi did not receive a valid product response from the
            backend. Please scan or enter the barcode again.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => router.replace('/scan')}
          >
            <Ionicons name="scan-outline" size={19} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Scan again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const scoreIsOutOfTen = product.score !== null && product.score <= 10;
  const scoreMaximum = scoreIsOutOfTen ? 10 : 100;
  const scoreDisplay =
    product.score === null ? '—' : String(product.score);
  const scoreWidth: `${number}%` =
    product.score === null
      ? '0%'
      : `${Math.max(
          0,
          Math.min(100, (product.score / scoreMaximum) * 100)
        )}%`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={21} color="#173B2A" />
          </Pressable>

          <Text style={styles.headerLabel}>PRODUCT ANALYSIS</Text>

          <View style={styles.headerIcon}>
            <Ionicons name="sparkles" size={19} color="#287A45" />
          </View>
        </View>

        <View style={styles.productCard}>
          <View style={styles.productImage}>
            <Ionicons
              name="fast-food-outline"
              size={37}
              color="#287A45"
            />
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productMeta}>
              {product.category}
              {product.barcode || scannedBarcode
                ? ` · ${product.barcode || scannedBarcode}`
                : ''}
            </Text>
          </View>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreTop}>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>YOUR FOOD SCORE</Text>
              <Text style={styles.scoreDescription}>
                {product.score === null
                  ? product.label
                  : `${product.label} based on the product analysis.`}
              </Text>
            </View>

            <View style={styles.scoreCircle}>
              {product.score === null ? (
                <Ionicons
                  name="analytics-outline"
                  size={30}
                  color="#173B2A"
                />
              ) : (
                <>
                  <Text style={styles.scoreNumber}>{product.score}</Text>
                  <Text style={styles.scoreOutOf}>/100</Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.scoreBar}>
            <View style={[styles.scoreFill, { width: scoreWidth }]} />
          </View>

          <View style={styles.scoreBottom}>
            <View style={styles.verdictPill}>
              <Ionicons
                name={
                  product.score !== null && product.score >= 70
                    ? 'checkmark-circle'
                    : 'warning-outline'
                }
                size={15}
                color="#287A45"
              />
              <Text style={styles.verdictText}>
                {product.label.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.scoreHint}>
              Backend analysis
            </Text>
          </View>
        </View>

        {product.reasons.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Why this score?</Text>

            <View style={styles.reasonCard}>
              {product.reasons.map((reason, index) => (
                <React.Fragment key={`${reason}-${index}`}>
                  {index > 0 && <View style={styles.divider} />}

                  <View style={styles.reasonRow}>
                    <View
                      style={
                        index % 2 === 0
                          ? styles.goodIcon
                          : styles.warningIcon
                      }
                    >
                      <Ionicons
                        name={
                          index % 2 === 0
                            ? 'information-outline'
                            : 'warning-outline'
                        }
                        size={17}
                        color={
                          index % 2 === 0 ? '#287A45' : '#B8754E'
                        }
                      />
                    </View>

                    <View style={styles.reasonContent}>
                      <Text style={styles.reasonTitle}>
                        {reason}
                      </Text>
                      <Text style={styles.reasonText}>
                        This point was returned by the NutriSaathi analysis
                        service.
                      </Text>
                    </View>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nutrition snapshot</Text>
          <Text style={styles.smallLabel}>API data</Text>
        </View>

        <View style={styles.nutritionGrid}>
          <NutritionCard
            value={formatNutrition(
              product.nutrition.calories_kcal ??
                product.nutrition.calories ??
                product.nutrition.energy_kcal,
              ''
            )}
            unit="kcal"
            label="Calories"
          />
          <NutritionCard
            value={formatNutrition(
              product.nutrition.sugar_g ?? product.nutrition.sugar,
              ' g'
            )}
            label="Sugar"
          />
          <NutritionCard
            value={formatNutrition(
              product.nutrition.protein_g ?? product.nutrition.protein,
              ' g'
            )}
            label="Protein"
          />
          <NutritionCard
            value={formatNutrition(
              product.nutrition.fat_g ?? product.nutrition.fat,
              ' g'
            )}
            label="Fat"
          />
          <NutritionCard
            value={formatNutrition(
              product.nutrition.fiber_g ?? product.nutrition.fiber,
              ' g'
            )}
            label="Fiber"
          />
          <NutritionCard
            value={formatNutrition(
              product.nutrition.sodium_mg ?? product.nutrition.sodium,
              ' mg'
            )}
            label="Sodium"
          />
        </View>

        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>
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
                {product.ingredients.length > 0
                  ? `${product.ingredients.length} ingredients received`
                  : 'No ingredient list returned'}
              </Text>
              <Text style={styles.ingredientSubtitle}>
                Displayed directly from the backend product response.
              </Text>
            </View>
          </View>

          {product.ingredients.length > 0 && (
            <View style={styles.tagRow}>
              {product.ingredients.slice(0, 20).map((ingredient, index) => (
                <View
                  key={`${ingredient}-${index}`}
                  style={
                    index % 3 === 0
                      ? styles.warningTag
                      : index % 3 === 1
                        ? styles.neutralTag
                        : styles.goodTag
                  }
                >
                  <Text
                    style={
                      index % 3 === 0
                        ? styles.warningTagText
                        : index % 3 === 1
                          ? styles.neutralTagText
                          : styles.goodTagText
                    }
                  >
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {product.allergens.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.sectionSpacing]}>
              Allergens
            </Text>

            <View style={styles.allergenCard}>
              <Ionicons
                name="warning-outline"
                size={20}
                color="#B8754E"
              />
              <Text style={styles.allergenText}>
                {product.allergens.join(', ')}
              </Text>
            </View>
          </>
        )}

        {product.familyResults.length > 0 && (
          <View style={styles.familyCard}>
            <View style={styles.familyHeader}>
              <View style={styles.familyHeaderText}>
                <Text style={styles.familyLabel}>SMART FAMILY MODE</Text>
                <Text style={styles.familyTitle}>
                  How does it fit your family?
                </Text>
              </View>

              <View style={styles.familyIcon}>
                <Ionicons name="people" size={21} color="#173B2A" />
              </View>
            </View>

            {product.familyResults.map((member, index) => {
              const verdict = getFamilyVerdict(member);
              const reasons = getFamilyReasons(member);
              const isSafe =
                verdict.toLowerCase().includes('safe') ||
                verdict.toLowerCase().includes('suitable');

              return (
                <View
                  style={styles.familyMember}
                  key={`${getFamilyName(member, index)}-${index}`}
                >
                  <View
                    style={[
                      styles.memberAvatar,
                      isSafe
                        ? styles.memberAvatarSafe
                        : styles.memberAvatarCaution,
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={17}
                      color={isSafe ? '#287A45' : '#B8754E'}
                    />
                  </View>

                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {getFamilyName(member, index)}
                    </Text>
                    <Text style={styles.memberReason}>
                      {reasons[0] || 'See backend analysis for details'}
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
                    <Text
                      style={
                        isSafe ? styles.safeText : styles.cautionText
                      }
                    >
                      {verdict.toUpperCase()}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {product.recommendations.length > 0 && (
          <>
            <View style={[styles.sectionHeader, styles.recommendationHeader]}>
              <Text style={styles.sectionTitle}>Better alternatives</Text>
              <Text style={styles.smallLabel}>
                {product.recommendations.length} found
              </Text>
            </View>

            <View style={styles.recommendationCard}>
              {product.recommendations.slice(0, 5).map((item, index) => {
                const name = getRecommendationName(item, index);
                const brand = getRecommendationBrand(item);
                const category = getRecommendationCategory(item);
                const reason = getRecommendationReason(item);

                return (
                  <View
                    key={`${name}-${index}`}
                    style={[
                      styles.recommendationItem,
                      index > 0 && styles.recommendationDivider,
                    ]}
                  >
                    <View style={styles.recommendationIcon}>
                      <Ionicons
                        name="leaf-outline"
                        size={20}
                        color="#287A45"
                      />
                    </View>

                    <View style={styles.recommendationInfo}>
                      <Text style={styles.recommendationName}>{name}</Text>
                      {!!brand && (
                        <Text style={styles.recommendationBrand}>{brand}</Text>
                      )}
                      {!!category && (
                        <Text style={styles.recommendationCategory}>
                          {category}
                        </Text>
                      )}
                      {!!reason && (
                        <Text style={styles.recommendationReason}>
                          {reason}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={21} color="#173B2A" />
          </View>

          <View style={styles.aiContent}>
            <Text style={styles.aiLabel}>NUTRISAATHI AI</Text>
            <Text style={styles.aiTitle}>
              Have a question about this product?
            </Text>
            <Text style={styles.aiText}>
              Ask about this product and get an explanation from the connected
              NutriSaathi backend.
            </Text>
          </View>

          <Pressable
            style={styles.aiButton}
            onPress={openChat}
            disabled={!product.id}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={19}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.replace('/scan')}
          >
            <Ionicons name="scan-outline" size={19} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Scan another</Text>
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
              Family details
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          NutriSaathi · Understand your food. Choose what suits you.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function NutritionCard({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <View style={styles.nutritionCard}>
      <Text style={styles.nutritionValue}>{value}</Text>
      {unit ? <Text style={styles.nutritionUnit}>{unit}</Text> : null}
      <Text style={styles.nutritionLabel}>{label}</Text>
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
    fontWeight: '800',
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
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  productInfo: {
    flex: 1,
  },
  brand: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#6D8878',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 19,
    fontWeight: '800',
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
    fontWeight: '800',
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
    fontWeight: '800',
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
    fontWeight: '800',
    color: '#287A45',
    marginLeft: 4,
  },
  scoreHint: {
    fontSize: 9,
    color: '#AFC8B9',
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#173B2A',
  },
  sectionSpacing: {
    marginTop: 27,
    marginBottom: 12,
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
  reasonContent: {
    flex: 1,
    marginLeft: 11,
  },
  reasonTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173B2A',
  },
  reasonText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#7B8981',
    marginTop: 4,
  },
  goodIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#FFF0DD',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '800',
    color: '#173B2A',
  },
  nutritionUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: '#287A45',
    marginTop: 2,
  },
  nutritionLabel: {
    fontSize: 10,
    color: '#89958E',
    marginTop: 11,
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
    fontWeight: '800',
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
    gap: 7,
    marginTop: 15,
  },
  warningTag: {
    backgroundColor: '#FFF0DD',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 13,
  },
  warningTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A66A43',
  },
  neutralTag: {
    backgroundColor: '#F0F3F0',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 13,
  },
  neutralTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6F7C74',
  },
  goodTag: {
    backgroundColor: '#E8F4E7',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 13,
  },
  goodTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#287A45',
  },
  allergenCard: {
    backgroundColor: '#FFF8EF',
    borderWidth: 1,
    borderColor: '#F1DDC8',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  allergenText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 11,
    lineHeight: 17,
    color: '#7B5C45',
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
    fontWeight: '800',
    letterSpacing: 1.3,
    color: '#B9E6B7',
    marginBottom: 7,
  },
  familyTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '800',
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
  memberAvatar: {
    width: 39,
    height: 39,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarSafe: {
    backgroundColor: '#E8F4E7',
  },
  memberAvatarCaution: {
    backgroundColor: '#FFF0DD',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  memberReason: {
    fontSize: 9,
    color: '#C8DDD0',
    marginTop: 3,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  safePill: {
    backgroundColor: '#E8F4E7',
  },
  cautionPill: {
    backgroundColor: '#FFF0DD',
  },
  safeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#287A45',
  },
  cautionText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#A66A43',
  },
  recommendationHeader: {
    marginTop: 27,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 7,
  },
  recommendationDivider: {
    borderTopWidth: 1,
    borderTopColor: '#E9EDE9',
    paddingTop: 15,
    marginTop: 8,
  },
  recommendationIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173B2A',
  },
  recommendationBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#287A45',
    marginTop: 3,
  },
  recommendationCategory: {
    fontSize: 9,
    color: '#89958E',
    marginTop: 3,
  },
  recommendationReason: {
    fontSize: 10,
    lineHeight: 15,
    color: '#60746A',
    marginTop: 5,
  },
  aiCard: {
    marginTop: 27,
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E4EAE3',
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  aiContent: {
    flex: 1,
    paddingRight: 10,
  },
  aiLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: '#287A45',
    marginBottom: 4,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173B2A',
  },
  aiText: {
    fontSize: 9,
    lineHeight: 14,
    color: '#60746A',
    marginTop: 4,
  },
  aiButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    marginTop: 18,
    gap: 10,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8,
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
  emptyState: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#FFF0DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#173B2A',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: '#7C8B82',
    marginBottom: 22,
  },
  footer: {
    textAlign: 'center',
    fontSize: 9,
    color: '#89958E',
    marginTop: 22,
  },
});