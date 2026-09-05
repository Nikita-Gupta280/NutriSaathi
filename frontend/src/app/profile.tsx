import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type SectionType =
  | 'dietary'
  | 'allergies'
  | 'goals'
  | null;

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Jain',
  'Satvik',
  'Low sodium',
  'Lactose free',
  'Gluten free',
  'Halal',
  'High protein',
];

const ALLERGY_OPTIONS = [
  'Peanuts',
  'Tree nuts',
  'Milk / Lactose',
  'Soy',
  'Wheat / Gluten',
  'Eggs',
  'Sesame',
  'Fish',
  'Shellfish',
];

const GOAL_OPTIONS = [
  'Weight management',
  'Weight gain',
  'Muscle gain',
  'High protein',
  'Low sugar',
  'Balanced diet',
  'Heart health',
  'Better digestion',
  'More fiber',
];

export default function ProfileScreen() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const [activeSection, setActiveSection] =
    useState<SectionType>(null);

  const [dietaryPreferences, setDietaryPreferences] =
    useState<string[]>([
      'Vegetarian',
      'High protein',
      'Balanced diet',
    ]);

  const [allergies, setAllergies] = useState<string[]>([
    'Peanuts',
  ]);

  const [nutritionGoals, setNutritionGoals] =
    useState<string[]>([
      'High protein',
      'Balanced diet',
    ]);

  const [draftValues, setDraftValues] = useState<string[]>([]);

  const openEditor = (section: SectionType) => {
    setActiveSection(section);

    if (section === 'dietary') {
      setDraftValues([...dietaryPreferences]);
    }

    if (section === 'allergies') {
      setDraftValues([...allergies]);
    }

    if (section === 'goals') {
      setDraftValues([...nutritionGoals]);
    }
  };

  const closeEditor = () => {
    setActiveSection(null);
    setDraftValues([]);
  };

  const toggleOption = (option: string) => {
    setDraftValues((current) => {
      if (current.includes(option)) {
        return current.filter((item) => item !== option);
      }

      return [...current, option];
    });
  };

  const saveSection = () => {
    if (activeSection === 'dietary') {
      setDietaryPreferences([...draftValues]);
    }

    if (activeSection === 'allergies') {
      setAllergies([...draftValues]);
    }

    if (activeSection === 'goals') {
      setNutritionGoals([...draftValues]);
    }

    closeEditor();
  };

  const preferenceCount = useMemo(() => {
    return (
      dietaryPreferences.length +
      allergies.length +
      nutritionGoals.length
    );
  }, [
    dietaryPreferences,
    allergies,
    nutritionGoals,
  ]);

  const getSectionTitle = () => {
    if (activeSection === 'dietary') {
      return 'Dietary preferences';
    }

    if (activeSection === 'allergies') {
      return 'Allergies & intolerances';
    }

    return 'Nutrition goals';
  };

  const getSectionSubtitle = () => {
    if (activeSection === 'dietary') {
      return 'Choose the dietary patterns and restrictions that fit you.';
    }

    if (activeSection === 'allergies') {
      return 'Select anything you need to avoid or be alerted about.';
    }

    return 'Tell NutriSaathi what you want your food choices to support.';
  };

  const getSectionOptions = () => {
    if (activeSection === 'dietary') {
      return DIETARY_OPTIONS;
    }

    if (activeSection === 'allergies') {
      return ALLERGY_OPTIONS;
    }

    return GOAL_OPTIONS;
  };

  const renderSelectedPreview = (
    values: string[],
    emptyText: string
  ) => {
    if (values.length === 0) {
      return (
        <Text style={styles.emptyPreview}>
          {emptyText}
        </Text>
      );
    }

    return (
      <View style={styles.previewRow}>
        {values.slice(0, 3).map((item) => (
          <View
            key={item}
            style={styles.previewChip}
          >
            <Text style={styles.previewChipText}>
              {item}
            </Text>
          </View>
        ))}

        {values.length > 3 && (
          <View style={styles.previewMore}>
            <Text style={styles.previewMoreText}>
              +{values.length - 3}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              NUTRISAATHI
            </Text>

            <Text style={styles.title}>
              My profile
            </Text>

            <Text style={styles.subtitle}>
              Personalize your food experience around
              your needs.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="person-outline"
              size={22}
              color="#287A45"
            />
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              B
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileTitle}>
              Your food profile
            </Text>

            <Text style={styles.profileSubtitle}>
              Preferences & dietary needs
            </Text>

            <View style={styles.activeRow}>
              <View style={styles.activeDot} />

              <Text style={styles.activeText}>
                Profile active
              </Text>
            </View>
          </View>

          <View style={styles.profileBadge}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#D7F0DC"
            />
          </View>
        </View>

        {activeSection !== null ? (
          <View style={styles.editorCard}>
            <View style={styles.editorHeader}>
              <Pressable
                style={styles.editorBack}
                onPress={closeEditor}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color="#173B2A"
                />
              </Pressable>

              <View style={styles.editorHeaderText}>
                <Text style={styles.editorTitle}>
                  {getSectionTitle()}
                </Text>

                <Text style={styles.editorSubtitle}>
                  {getSectionSubtitle()}
                </Text>
              </View>
            </View>

            <View style={styles.selectionSummary}>
              <View style={styles.selectionIcon}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#287A45"
                />
              </View>

              <Text style={styles.selectionText}>
                {draftValues.length === 0
                  ? 'Nothing selected'
                  : `${draftValues.length} selected`}
              </Text>
            </View>

            <Text style={styles.chooseLabel}>
              SELECT ALL THAT APPLY
            </Text>

            <View style={styles.optionsContainer}>
              {getSectionOptions().map((option) => {
                const selected =
                  draftValues.includes(option);

                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionChip,
                      selected &&
                        styles.optionChipSelected,
                    ]}
                    onPress={() =>
                      toggleOption(option)
                    }
                  >
                    <View
                      style={[
                        styles.optionCheck,
                        selected &&
                          styles.optionCheckSelected,
                      ]}
                    >
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color="#FFFFFF"
                        />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.optionText,
                        selected &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.editorNote}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#66806F"
              />

              <Text style={styles.editorNoteText}>
                NutriSaathi will use these choices to
                personalize product insights and
                recommendations.
              </Text>
            </View>

            <View style={styles.editorActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={closeEditor}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={saveSection}
              >
                <Ionicons
                  name="checkmark"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.saveText}>
                  Save changes
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Your preferences
              </Text>

              <Text style={styles.saved}>
                {preferenceCount} saved
              </Text>
            </View>

            <Pressable
              style={styles.preferenceCard}
              onPress={() =>
                openEditor('dietary')
              }
            >
              <View
                style={[
                  styles.preferenceIcon,
                  {
                    backgroundColor: '#E8F4E7',
                  },
                ]}
              >
                <Ionicons
                  name="leaf-outline"
                  size={23}
                  color="#4D8964"
                />
              </View>

              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>
                  Dietary preferences
                </Text>

                <Text style={styles.preferenceSubtitle}>
                  Choose the foods that fit your
                  lifestyle.
                </Text>

                {renderSelectedPreview(
                  dietaryPreferences,
                  'No dietary preferences added'
                )}
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#A1AAA5"
              />
            </Pressable>

            <Pressable
              style={styles.preferenceCard}
              onPress={() =>
                openEditor('allergies')
              }
            >
              <View
                style={[
                  styles.preferenceIcon,
                  {
                    backgroundColor: '#FFF0DD',
                  },
                ]}
              >
                <Ionicons
                  name="warning-outline"
                  size={23}
                  color="#B8754E"
                />
              </View>

              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>
                  Allergies & intolerances
                </Text>

                <Text style={styles.preferenceSubtitle}>
                  Get an alert before choosing risky
                  products.
                </Text>

                {renderSelectedPreview(
                  allergies,
                  'No allergies or intolerances added'
                )}
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#A1AAA5"
              />
            </Pressable>

            <Pressable
              style={styles.preferenceCard}
              onPress={() =>
                openEditor('goals')
              }
            >
              <View
                style={[
                  styles.preferenceIcon,
                  {
                    backgroundColor: '#E5F1F7',
                  },
                ]}
              >
                <Ionicons
                  name="nutrition-outline"
                  size={23}
                  color="#668CA0"
                />
              </View>

              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>
                  Nutrition goals
                </Text>

                <Text style={styles.preferenceSubtitle}>
                  Make healthier choices with
                  personalized guidance.
                </Text>

                {renderSelectedPreview(
                  nutritionGoals,
                  'No nutrition goals added'
                )}
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#A1AAA5"
              />
            </Pressable>
          </>
        )}

        {activeSection === null && (
          <>
            <Text
              style={[
                styles.sectionTitle,
                styles.activityTitle,
              ]}
            >
              Your activity
            </Text>

            <View style={styles.activityCard}>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons
                    name="scan-outline"
                    size={21}
                    color="#287A45"
                  />
                </View>

                <View>
                  <Text style={styles.activityNumber}>
                    12
                  </Text>

                  <Text style={styles.activityLabel}>
                    products scanned
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={21}
                    color="#287A45"
                  />
                </View>

                <View>
                  <Text style={styles.activityNumber}>
                    8
                  </Text>

                  <Text style={styles.activityLabel}>
                    safe choices
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={[
                styles.sectionTitle,
                styles.settingsTitle,
              ]}
            >
              Settings
            </Text>

            <View style={styles.settingsCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Ionicons
                    name="notifications-outline"
                    size={21}
                    color="#287A45"
                  />
                </View>

                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>
                    Smart alerts
                  </Text>

                  <Text style={styles.settingSubtitle}>
                    Nutrition and allergy notifications
                  </Text>
                </View>

                <Switch
                  value={alertsEnabled}
                  onValueChange={setAlertsEnabled}
                  trackColor={{
                    false: '#D7DED8',
                    true: '#7AB18C',
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingDivider} />

              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={21}
                    color="#287A45"
                  />
                </View>

                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>
                    Privacy & safety
                  </Text>

                  <Text style={styles.settingSubtitle}>
                    Manage your personal information
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color="#A1AAA5"
                />
              </View>
            </View>

            <View style={styles.bottomCard}>
              <View style={styles.bottomIcon}>
                <Ionicons
                  name="sparkles"
                  size={20}
                  color="#173B2A"
                />
              </View>

              <View style={styles.bottomContent}>
                <Text style={styles.bottomTitle}>
                  Made for your wellbeing
                </Text>

                <Text style={styles.bottomText}>
                  NutriSaathi turns complicated food
                  information into simple, meaningful
                  choices.
                </Text>
              </View>
            </View>

            <Text style={styles.footer}>
              Better information. Better choices.
              Better health.
            </Text>
          </>
        )}
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
    justifyContent: 'space-between',
    marginBottom: 21,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#287A45',
    marginBottom: 5,
  },

  title: {
    fontSize: 29,
    fontWeight: '800',
    color: '#173B2A',
  },

  subtitle: {
    maxWidth: 285,
    fontSize: 12,
    lineHeight: 19,
    color: '#78867D',
    marginTop: 7,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCard: {
    backgroundColor: '#19543E',
    borderRadius: 27,
    padding: 21,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E6F2DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#173B2A',
  },

  profileInfo: {
    flex: 1,
  },

  profileTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  profileSubtitle: {
    fontSize: 10,
    color: '#C8DDD0',
    marginTop: 4,
  },

  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B9E6B7',
    marginRight: 6,
  },

  activeText: {
    fontSize: 10,
    color: '#D8E9DD',
  },

  profileBadge: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#28684E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionHeader: {
    marginTop: 27,
    marginBottom: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#173B2A',
  },

  saved: {
    fontSize: 10,
    fontWeight: '700',
    color: '#89958E',
  },

  preferenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 21,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4EAE3',
    marginBottom: 10,
  },

  preferenceIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  preferenceInfo: {
    flex: 1,
  },

  preferenceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173B2A',
  },

  preferenceSubtitle: {
    fontSize: 10,
    lineHeight: 15,
    color: '#89958E',
    marginTop: 4,
  },

  previewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 7,
  },

  previewChip: {
    backgroundColor: '#EEF6EF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 3,
  },

  previewChipText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#3E7350',
  },

  previewMore: {
    backgroundColor: '#F1F3F1',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginBottom: 3,
  },

  previewMoreText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#78857D',
  },

  emptyPreview: {
    fontSize: 9,
    color: '#A0AAA4',
    marginTop: 7,
  },

  editorCard: {
    marginTop: 23,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E1E8E1',
  },

  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },

  editorBack: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EFF5EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  editorHeaderText: {
    flex: 1,
  },

  editorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#173B2A',
  },

  editorSubtitle: {
    fontSize: 10.5,
    lineHeight: 15,
    color: '#829087',
    marginTop: 4,
  },

  selectionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F8F3',
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginBottom: 18,
  },

  selectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#E3F1E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  selectionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4D6255',
  },

  chooseLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#8A968F',
    marginBottom: 10,
  },

  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  optionChip: {
    minHeight: 42,
    borderRadius: 14,
    backgroundColor: '#F7F9F7',
    borderWidth: 1,
    borderColor: '#E1E7E1',
    paddingHorizontal: 11,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 7,
    marginBottom: 8,
  },

  optionChipSelected: {
    backgroundColor: '#E8F4E7',
    borderColor: '#8FBE9A',
  },

  optionCheck: {
    width: 21,
    height: 21,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#B9C4BC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    backgroundColor: '#FFFFFF',
  },

  optionCheckSelected: {
    backgroundColor: '#287A45',
    borderColor: '#287A45',
  },

  optionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#536158',
  },

  optionTextSelected: {
    color: '#245B36',
    fontWeight: '700',
  },

  editorNote: {
    marginTop: 12,
    padding: 12,
    borderRadius: 15,
    backgroundColor: '#F8FAF8',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  editorNoteText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 15,
    color: '#748078',
    marginLeft: 8,
  },

  editorActions: {
    flexDirection: 'row',
    marginTop: 18,
  },

  cancelButton: {
    flex: 1,
    height: 49,
    borderRadius: 15,
    backgroundColor: '#F1F4F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  cancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#526057',
  },

  saveButton: {
    flex: 1.45,
    height: 49,
    borderRadius: 15,
    backgroundColor: '#287A45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },

  activityTitle: {
    marginTop: 25,
    marginBottom: 13,
  },

  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  activityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  activityIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  activityNumber: {
    fontSize: 19,
    fontWeight: '800',
    color: '#173B2A',
  },

  activityLabel: {
    fontSize: 9,
    color: '#89958E',
    marginTop: 2,
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E4EAE3',
    marginHorizontal: 8,
  },

  settingsTitle: {
    marginTop: 25,
    marginBottom: 13,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E4EAE3',
  },

  settingRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  settingInfo: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173B2A',
  },

  settingSubtitle: {
    fontSize: 9,
    color: '#89958E',
    marginTop: 3,
  },

  settingDivider: {
    height: 1,
    backgroundColor: '#E6EBE6',
  },

  bottomCard: {
    marginTop: 13,
    backgroundColor: '#E8F4E7',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  bottomContent: {
    flex: 1,
  },

  bottomTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173B2A',
    marginBottom: 4,
  },

  bottomText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#60746A',
  },

  footer: {
    textAlign: 'center',
    fontSize: 10,
    color: '#89958E',
    marginTop: 25,
  },
});