import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type SectionKey =
  | 'allergies'
  | 'diet'
  | 'health'
  | 'goals'
  | 'preferences';

type Member = {
  id: string;
  name: string;
  relation: string;
};

const allergyOptions = [
  'Peanut',
  'Soy',
  'Milk / Dairy',
  'Gluten',
  'Tree nuts',
  'Sesame',
  'Egg',
  'Other',
];

const dietOptions = [
  'Vegetarian',
  'Vegan',
  'Jain',
  'Satvik',
  'Low sodium',
  'Lactose free',
  'Gluten free',
];

const healthOptions = [
  'Diabetes',
  'High blood pressure',
  'High cholesterol',
  'Heart health',
  'PCOS',
  'Other',
];

const goalOptions = [
  'Weight gain',
  'Muscle gain',
  'Weight management',
  'High protein',
  'Low sugar',
  'Balanced diet',
];

const preferenceOptions = [
  'Avoid artificial sweeteners',
  'Avoid palm oil',
  'Minimally processed food',
  'Prefer whole grains',
  'Prefer high fiber',
  'Avoid added sugar',
];

export default function FamilyScreen() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 'you',
      name: 'You',
      relation: 'Your profile',
    },
    {
      id: 'mom',
      name: 'Mom',
      relation: 'Family member',
    },
    {
      id: 'dad',
      name: 'Dad',
      relation: 'Family member',
    },
  ]);

  const [selectedMember, setSelectedMember] =
    useState('you');

  const [openSection, setOpenSection] =
    useState<SectionKey | null>('allergies');

  const [selected, setSelected] = useState<
    Record<string, string[]>
  >({
    allergies: [],
    diet: [],
    health: [],
    goals: [],
    preferences: [],
  });

  const [customName, setCustomName] = useState('');

  const currentMember = members.find(
    (member) => member.id === selectedMember
  );

  const toggleOption = (
    section: SectionKey,
    option: string
  ) => {
    setSelected((current) => {
      const values = current[section] || [];

      if (values.includes(option)) {
        return {
          ...current,
          [section]: values.filter(
            (item) => item !== option
          ),
        };
      }

      return {
        ...current,
        [section]: [...values, option],
      };
    });
  };

  const addMember = () => {
    if (members.length >= 5) {
      Alert.alert(
        'Maximum reached',
        'You can create up to 5 family profiles.'
      );
      return;
    }

    const id = `member-${members.length + 1}`;

    setMembers((current) => [
      ...current,
      {
        id,
        name: `Member ${members.length + 1}`,
        relation: 'New family member',
      },
    ]);

    setSelectedMember(id);
  };

  const saveProfile = () => {
    Alert.alert(
      'Profile saved',
      `${currentMember?.name}'s nutrition profile has been saved.`
    );
  };

  const renderSection = (
    key: SectionKey,
    title: string,
    subtitle: string,
    icon: keyof typeof Ionicons.glyphMap,
    options: string[]
  ) => {
    const isOpen = openSection === key;
    const selectedCount = selected[key]?.length || 0;

    return (
      <View style={styles.sectionCard}>
        <Pressable
          style={styles.sectionHeader}
          onPress={() =>
            setOpenSection(isOpen ? null : key)
          }
        >
          <View style={styles.sectionIcon}>
            <Ionicons
              name={icon}
              size={21}
              color="#287A45"
            />
          </View>

          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>
              {title}
            </Text>

            <Text style={styles.sectionSubtitle}>
              {selectedCount > 0
                ? `${selectedCount} selected`
                : subtitle}
            </Text>
          </View>

          <Ionicons
            name={
              isOpen
                ? 'chevron-up'
                : 'chevron-down'
            }
            size={19}
            color="#7E8B83"
          />
        </Pressable>

        {isOpen && (
          <View style={styles.optionsContainer}>
            {options.map((option) => {
              const isSelected =
                selected[key]?.includes(option);

              return (
                <Pressable
                  key={option}
                  style={[
                    styles.optionChip,
                    isSelected &&
                      styles.optionChipSelected,
                  ]}
                  onPress={() =>
                    toggleOption(key, option)
                  }
                >
                  <View
                    style={[
                      styles.checkbox,
                      isSelected &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
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
                      isSelected &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
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
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              PERSONALIZED NUTRITION
            </Text>

            <Text style={styles.title}>
              Family Profiles
            </Text>

            <Text style={styles.subtitle}>
              Tell NutriSaathi what matters to each
              person so food recommendations stay
              personal.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="people-outline"
              size={25}
              color="#287A45"
            />
          </View>
        </View>

        <View style={styles.memberCard}>
          <View style={styles.memberCardHeader}>
            <View>
              <Text style={styles.memberLabel}>
                WHO ARE WE CHECKING FOR?
              </Text>

              <Text style={styles.memberHint}>
                Select a profile to personalize it.
              </Text>
            </View>

            <Pressable
              style={styles.addMemberButton}
              onPress={addMember}
            >
              <Ionicons
                name="person-add"
                size={18}
                color="#287A45"
              />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.memberScroll}
          >
            {members.map((member) => {
              const active =
                selectedMember === member.id;

              return (
                <Pressable
                  key={member.id}
                  style={[
                    styles.memberPill,
                    active &&
                      styles.memberPillActive,
                  ]}
                  onPress={() =>
                    setSelectedMember(member.id)
                  }
                >
                  <View
                    style={[
                      styles.avatar,
                      active &&
                        styles.avatarActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        active &&
                          styles.avatarTextActive,
                      ]}
                    >
                      {member.name.charAt(0)}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.memberName,
                      active &&
                        styles.memberNameActive,
                    ]}
                  >
                    {member.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.profileBanner}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {currentMember?.name.charAt(0)}
            </Text>
          </View>

          <View style={styles.profileBannerText}>
            <Text style={styles.profileName}>
              {currentMember?.name}
            </Text>

            <Text style={styles.profileRelation}>
              {currentMember?.relation}
            </Text>
          </View>

          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>
              ACTIVE
            </Text>
          </View>
        </View>

        <Text style={styles.setupTitle}>
          Build {currentMember?.name}'s profile
        </Text>

        <Text style={styles.setupSubtitle}>
          Select everything that applies. NutriSaathi
          will use this information when analyzing
          food.
        </Text>

        {renderSection(
          'allergies',
          'Allergies & intolerances',
          'Peanut, soy, dairy, gluten...',
          'warning-outline',
          allergyOptions
        )}

        {renderSection(
          'diet',
          'Dietary restrictions',
          'Vegetarian, vegan, Jain...',
          'leaf-outline',
          dietOptions
        )}

        {renderSection(
          'health',
          'Health considerations',
          'Diabetes, blood pressure...',
          'fitness-outline',
          healthOptions
        )}

        {renderSection(
          'goals',
          'Nutrition goals',
          'Muscle gain, low sugar...',
          'trophy',
          goalOptions
        )}

        {renderSection(
          'preferences',
          'Food preferences',
          'Ingredients and processing...',
          'heart-outline',
          preferenceOptions
        )}

        <View style={styles.customCard}>
          <View style={styles.customIcon}>
            <Ionicons
              name="create-outline"
              size={20}
              color="#287A45"
            />
          </View>

          <View style={styles.customText}>
            <Text style={styles.customTitle}>
              Add another family member
            </Text>

            <Text style={styles.customSubtitle}>
              Create a personalized profile for anyone
              in your family.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={saveProfile}
        >
          <Ionicons
            name="checkmark-circle"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.saveButtonText}>
            Save {currentMember?.name}'s Profile
          </Text>
        </Pressable>

        <View style={styles.intelligenceCard}>
          <View style={styles.intelligenceIcon}>
            <Ionicons
              name="sparkles"
              size={20}
              color="#287A45"
            />
          </View>

          <View style={styles.intelligenceText}>
            <Text style={styles.intelligenceTitle}>
              How NutriSaathi uses this
            </Text>

            <Text style={styles.intelligenceBody}>
              Example: If Dad has diabetes and a low
              sugar goal, a product with high added
              sugar can be flagged even when its
              general health score looks acceptable.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#287A45',
    marginBottom: 5,
  },

  title: {
    fontSize: 29,
    fontWeight: '700',
    color: '#183B25',
  },

  subtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#718078',
    marginTop: 5,
    paddingRight: 8,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E9F4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5ECE6',
    marginBottom: 14,
  },

  memberCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  memberLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: '#287A45',
  },

  memberHint: {
    fontSize: 11.5,
    color: '#8A958E',
    marginTop: 3,
  },

  addMemberButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  memberScroll: {
    paddingTop: 15,
    paddingRight: 8,
  },

  memberPill: {
    minWidth: 84,
    height: 82,
    borderRadius: 15,
    backgroundColor: '#F6F9F6',
    borderWidth: 1,
    borderColor: '#E4EBE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
    paddingHorizontal: 10,
  },

  memberPillActive: {
    backgroundColor: '#EAF5ED',
    borderColor: '#A9CBB1',
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#E1E8E3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  avatarActive: {
    backgroundColor: '#287A45',
  },

  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#607067',
  },

  avatarTextActive: {
    color: '#FFFFFF',
  },

  memberName: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#66746B',
  },

  memberNameActive: {
    color: '#287A45',
    fontWeight: '700',
  },

  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#183B25',
    borderRadius: 18,
    padding: 15,
    marginBottom: 22,
  },

  profileAvatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#D7EBDD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileAvatarText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#287A45',
  },

  profileBannerText: {
    flex: 1,
    marginLeft: 12,
  },

  profileName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  profileRelation: {
    color: '#B9CCBF',
    fontSize: 11.5,
    marginTop: 2,
  },

  activeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#2D6640',
  },

  activeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#DDF0E2',
  },

  setupTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#183B25',
  },

  setupSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#7B8880',
    marginTop: 4,
    marginBottom: 15,
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5ECE6',
    marginBottom: 11,
    overflow: 'hidden',
  },

  sectionHeader: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#263D2D',
  },

  sectionSubtitle: {
    fontSize: 11.5,
    color: '#89958E',
    marginTop: 3,
  },

  optionsContainer: {
    paddingHorizontal: 14,
    paddingBottom: 13,
    paddingTop: 2,
  },

  optionChip: {
    minHeight: 43,
    borderRadius: 12,
    backgroundColor: '#F7FAF7',
    borderWidth: 1,
    borderColor: '#E6ECE7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    marginTop: 7,
  },

  optionChipSelected: {
    backgroundColor: '#EDF7EF',
    borderColor: '#B7D4BE',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#B9C4BC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  checkboxSelected: {
    backgroundColor: '#287A45',
    borderColor: '#287A45',
  },

  optionText: {
    flex: 1,
    fontSize: 12.5,
    color: '#526159',
  },

  optionTextSelected: {
    color: '#245D35',
    fontWeight: '600',
  },

  customCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5ECE6',
    marginTop: 4,
    marginBottom: 13,
  },

  customIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  customText: {
    flex: 1,
  },

  customTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#29402F',
  },

  customSubtitle: {
    fontSize: 11,
    color: '#89958E',
    marginTop: 3,
    lineHeight: 16,
  },

  saveButton: {
    height: 53,
    borderRadius: 16,
    backgroundColor: '#287A45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    marginLeft: 8,
  },

  intelligenceCard: {
    flexDirection: 'row',
    backgroundColor: '#EAF5ED',
    borderRadius: 17,
    padding: 15,
    marginTop: 13,
  },

  intelligenceIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  intelligenceText: {
    flex: 1,
  },

  intelligenceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#285333',
    marginBottom: 4,
  },

  intelligenceBody: {
    fontSize: 11.5,
    lineHeight: 17,
    color: '#617367',
  },

  bottomSpace: {
    height: 20,
  },
});