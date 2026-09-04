import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const comingSoon = (title: string) => {
    Alert.alert(
      title,
      'This preference will be connected to your personalised profile.'
    );
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
            <Text style={styles.title}>My profile</Text>
            <Text style={styles.subtitle}>
              Personalize your food experience around your needs.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="person-outline" size={22} color="#287A45" />
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>B</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileTitle}>Your food profile</Text>
            <Text style={styles.profileSubtitle}>
              Preferences & dietary needs
            </Text>

            <View style={styles.activeRow}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Profile active</Text>
            </View>
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() => comingSoon('Edit profile')}
          >
            <Ionicons name="create-outline" size={20} color="#173B2A" />
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your preferences</Text>
          <Text style={styles.saved}>3 saved</Text>
        </View>

        <Pressable
          style={styles.preferenceCard}
          onPress={() => comingSoon('Dietary preferences')}
        >
          <View style={[styles.preferenceIcon, { backgroundColor: '#E8F4E7' }]}>
            <Ionicons name="leaf-outline" size={23} color="#4D8964" />
          </View>

          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Dietary preferences</Text>
            <Text style={styles.preferenceSubtitle}>
              Choose the foods that fit your lifestyle.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#A1AAA5" />
        </Pressable>

        <Pressable
          style={styles.preferenceCard}
          onPress={() => comingSoon('Allergies & intolerances')}
        >
          <View style={[styles.preferenceIcon, { backgroundColor: '#FFF0DD' }]}>
            <Ionicons name="warning-outline" size={23} color="#B8754E" />
          </View>

          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>
              Allergies & intolerances
            </Text>
            <Text style={styles.preferenceSubtitle}>
              Get an alert before choosing risky products.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#A1AAA5" />
        </Pressable>

        <Pressable
          style={styles.preferenceCard}
          onPress={() => comingSoon('Nutrition goals')}
        >
          <View style={[styles.preferenceIcon, { backgroundColor: '#E5F1F7' }]}>
            <Ionicons name="nutrition-outline" size={23} color="#668CA0" />
          </View>

          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Nutrition goals</Text>
            <Text style={styles.preferenceSubtitle}>
              Make healthier choices with personalized guidance.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#A1AAA5" />
        </Pressable>

        <Text style={[styles.sectionTitle, styles.activityTitle]}>
          Your activity
        </Text>

        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="scan-outline" size={21} color="#287A45" />
            </View>

            <View>
              <Text style={styles.activityNumber}>12</Text>
              <Text style={styles.activityLabel}>products scanned</Text>
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
              <Text style={styles.activityNumber}>8</Text>
              <Text style={styles.activityLabel}>safe choices</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, styles.settingsTitle]}>
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
              <Text style={styles.settingTitle}>Smart alerts</Text>
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

          <Pressable
            style={styles.settingRow}
            onPress={() => comingSoon('Privacy & safety')}
          >
            <View style={styles.settingIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color="#287A45"
              />
            </View>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Privacy & safety</Text>
              <Text style={styles.settingSubtitle}>
                Manage your personal information
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#A1AAA5"
            />
          </Pressable>
        </View>

        <View style={styles.bottomCard}>
          <View style={styles.bottomIcon}>
            <Ionicons name="sparkles" size={20} color="#173B2A" />
          </View>

          <View style={styles.bottomContent}>
            <Text style={styles.bottomTitle}>Made for your wellbeing</Text>
            <Text style={styles.bottomText}>
              NutriSaathi turns complicated food information into simple,
              meaningful choices.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Better information. Better choices. Better health.
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

  editButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F6F9F4',
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