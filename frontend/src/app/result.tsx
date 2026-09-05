import React from 'react';
import { useLocalSearchParams } from 'expo-router';
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

export default function ResultScreen() {
  const { product_id, barcode } = useLocalSearchParams<{
    product_id?: string;
    barcode?: string;
  }>();

  const productId = product_id || 'IND-0001';

  const familyMembers = [
    { member_id: 'you', name: 'You' },
    { member_id: 'mom', name: 'Mom' },
    { member_id: 'dad', name: 'Dad' },
  ];

  const openChat = () => {
    router.push({
      pathname: '/chat',
      params: {
        product_id: productId,
        barcode: barcode || '',
        family_members: JSON.stringify(familyMembers),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
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

        {/* Product */}
        <View style={styles.productCard}>
          <View style={styles.productImage}>
            <Text style={styles.productEmoji}>🍪</Text>
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.brand}>EXAMPLE FOODS</Text>
            <Text style={styles.productName}>Oat & Choco Biscuits</Text>
            <Text style={styles.productMeta}>Biscuits · 100 g</Text>
          </View>
        </View>

        {/* Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreTop}>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>YOUR FOOD SCORE</Text>

              <Text style={styles.scoreDescription}>
                Good choice, with a few things to watch.
              </Text>
            </View>

            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>72</Text>
              <Text style={styles.scoreOutOf}>/100</Text>
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
              <Text style={styles.verdictText}>MODERATE</Text>
            </View>

            <Text style={styles.scoreHint}>
              Nutrition + ingredients
            </Text>
          </View>
        </View>

        {/* Why score */}
        <Text style={styles.sectionTitle}>Why this score?</Text>

        <View style={styles.reasonCard}>
          <View style={styles.reasonRow}>
            <View style={styles.goodIcon}>
              <Ionicons name="checkmark" size={17} color="#287A45" />
            </View>

            <View style={styles.reasonContent}>
              <Text style={styles.reasonTitle}>Good protein content</Text>
              <Text style={styles.reasonText}>
                Provides a useful amount of protein for a packaged snack.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.reasonRow}>
            <View style={styles.warningIcon}>
              <Ionicons
                name="warning-outline"
                size={17}
                color="#B8754E"
              />
            </View>

            <View style={styles.reasonContent}>
              <Text style={styles.reasonTitle}>Sugar needs attention</Text>
              <Text style={styles.reasonText}>
                Sugar is relatively high for a regular everyday snack.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.reasonRow}>
            <View style={styles.goodIcon}>
              <Ionicons name="checkmark" size={17} color="#287A45" />
            </View>

            <View style={styles.reasonContent}>
              <Text style={styles.reasonTitle}>
                No major allergen detected
              </Text>
              <Text style={styles.reasonText}>
                No major allergen was flagged in the available ingredient
                data.
              </Text>
            </View>
          </View>
        </View>

        {/* Nutrition */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nutrition snapshot</Text>
          <Text style={styles.smallLabel}>per 100 g</Text>
        </View>

        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionValue}>450</Text>
            <Text style={styles.nutritionUnit}>kcal</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>

          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionValue}>18 g</Text>
            <Text style={styles.highLabel}>high</Text>
            <Text style={styles.nutritionLabel}>Sugar</Text>
          </View>

          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionValue}>6 g</Text>
            <Text style={styles.nutritionUnit}>good</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
          </View>

          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionValue}>2 g</Text>
            <Text style={styles.nutritionUnit}>low</Text>
            <Text style={styles.nutritionLabel}>Fiber</Text>
          </View>
        </View>

        {/* Ingredients */}
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
                3 ingredients worth knowing
              </Text>

              <Text style={styles.ingredientSubtitle}>
                NutriSaathi explains what matters.
              </Text>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.warningTag}>
              <Text style={styles.warningTagText}>Added sugar</Text>
            </View>

            <View style={styles.neutralTag}>
              <Text style={styles.neutralTagText}>Refined flour</Text>
            </View>

            <View style={styles.goodTag}>
              <Text style={styles.goodTagText}>Oats</Text>
            </View>
          </View>
        </View>

        {/* Family */}
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

          {/* You */}
          <View style={styles.familyMember}>
            <View style={styles.youAvatar}>
              <Ionicons name="person" size={17} color="#287A45" />
            </View>

            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>You</Text>
              <Text style={styles.memberReason}>
                Generally suitable
              </Text>
            </View>

            <View style={styles.safePill}>
              <Ionicons name="checkmark" size={12} color="#287A45" />
              <Text style={styles.safeText}>SAFE</Text>
            </View>
          </View>

          {/* Mom */}
          <View style={styles.familyMember}>
            <View style={styles.momAvatar}>
              <Ionicons name="heart" size={17} color="#B8754E" />
            </View>

            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Mom</Text>
              <Text style={styles.memberReason}>
                Watch sodium & sugar
              </Text>
            </View>

            <View style={styles.cautionPill}>
              <Ionicons
                name="warning-outline"
                size={12}
                color="#B8754E"
              />
              <Text style={styles.cautionText}>CAUTION</Text>
            </View>
          </View>

          {/* Dad */}
          <View style={styles.familyMember}>
            <View style={styles.dadAvatar}>
              <Ionicons name="person" size={17} color="#668CA0" />
            </View>

            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Dad</Text>
              <Text style={styles.memberReason}>
                High sugar for his profile
              </Text>
            </View>

            <View style={styles.watchPill}>
              <Ionicons
                name="warning-outline"
                size={12}
                color="#B8754E"
              />
              <Text style={styles.watchText}>WATCH</Text>
            </View>
          </View>
        </View>

        {/* Alternative */}
        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>
          A better choice
        </Text>

        <View style={styles.alternativeCard}>
          <View style={styles.alternativeImage}>
            <Text style={styles.alternativeEmoji}>🌾</Text>
          </View>

          <View style={styles.alternativeInfo}>
            <Text style={styles.alternativeLabel}>
              HIGHER FIBER · LOWER SUGAR
            </Text>

            <Text style={styles.alternativeName}>
              Whole Grain Oat Bites
            </Text>

            <Text style={styles.alternativeText}>
              A similar snack with a more balanced nutrition profile.
            </Text>
          </View>

          <View style={styles.alternativeScore}>
            <Text style={styles.altScoreNumber}>84</Text>
            <Text style={styles.altScoreLabel}>score</Text>
          </View>
        </View>

        {/* AI ASSISTANT */}
        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={21} color="#173B2A" />
          </View>

          <View style={styles.aiContent}>
            <Text style={styles.aiLabel}>NUTRISAATHI AI</Text>
            <Text style={styles.aiTitle}>Have a question about this product?</Text>
            <Text style={styles.aiText}>
              Ask why it may suit you or your family, and get an explanation based on this product's analysis.
            </Text>
          </View>

          <Pressable style={styles.aiButton} onPress={openChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={19} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Actions */}
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
              Scan another
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
    fontWeight: '800',
    letterSpacing: 1,
    color: '#6D8878',
    marginBottom: 5,
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
    gap: 10,
  },

  nutritionCard: {
    width: '48.5%',
    minHeight: 105,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E4EAE3',
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

  highLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B8754E',
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

  youAvatar: {
    width: 39,
    height: 39,
    borderRadius: 14,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  momAvatar: {
    width: 39,
    height: 39,
    borderRadius: 14,
    backgroundColor: '#FFF0DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  dadAvatar: {
    width: 39,
    height: 39,
    borderRadius: 14,
    backgroundColor: '#E4F0F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
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

  safePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4E7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },

  safeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#287A45',
    marginLeft: 3,
  },

  cautionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0DD',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },

  cautionText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#A66A43',
    marginLeft: 3,
  },

  watchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0DD',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },

  watchText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#A66A43',
    marginLeft: 3,
  },

  alternativeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  alternativeImage: {
    width: 65,
    height: 65,
    borderRadius: 19,
    backgroundColor: '#E9F0E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  alternativeEmoji: {
    fontSize: 34,
  },

  alternativeInfo: {
    flex: 1,
  },

  alternativeLabel: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#4E9565',
    marginBottom: 5,
  },

  alternativeName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173B2A',
  },

  alternativeText: {
    fontSize: 9,
    lineHeight: 14,
    color: '#89958E',
    marginTop: 4,
  },

  alternativeScore: {
    alignItems: 'center',
    marginLeft: 7,
  },

  altScoreNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#287A45',
  },

  altScoreLabel: {
    fontSize: 8,
    color: '#89958E',
  },

  actions: {
    marginTop: 18,
    gap: 9,
  },

  primaryButton: {
    backgroundColor: '#287A45',
    borderRadius: 18,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  primaryButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  secondaryButton: {
    backgroundColor: '#E8F4E7',
    borderRadius: 18,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#287A45',
  },

  aiCard: {
    marginTop: 18,
    backgroundColor: '#E8F4E7',
    borderRadius: 23,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E8D7',
  },

  aiIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  aiContent: {
    flex: 1,
    paddingRight: 8,
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

  footer: {
    textAlign: 'center',
    fontSize: 9,
    color: '#89958E',
    marginTop: 22,
  },
});