import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Member = {
  name: string;
  role: string;
  detail: string;
  icon: keyof typeof Ionicons.glyphMap;
  background: string;
};

export default function FamilyScreen() {
  const [members, setMembers] = useState<Member[]>([
    {
      name: 'You',
      role: 'Primary profile',
      detail: 'Personal preferences',
      icon: 'person',
      background: '#E8F4E7',
    },
    {
      name: 'Mom',
      role: 'Family member',
      detail: 'Low sodium',
      icon: 'heart',
      background: '#FFF0DD',
    },
    {
      name: 'Dad',
      role: 'Family member',
      detail: 'Diabetes-friendly',
      icon: 'person',
      background: '#E4F0F6',
    },
  ]);

  const addMember = () => {
    const number = members.length + 1;

    setMembers([
      ...members,
      {
        name: `Member ${number}`,
        role: 'Family member',
        detail: 'Preferences not set',
        icon: 'person',
        background: '#EEE9F5',
      },
    ]);

    Alert.alert(
      'Member added',
      `Member ${number} has been added. You can personalise their preferences next.`
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
            <Text style={styles.title}>Family safety</Text>
            <Text style={styles.subtitle}>
              One food profile for everyone you care about.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="people" size={22} color="#287A45" />
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="shield-checkmark" size={27} color="#DDF3DA" />
          </View>

          <Text style={styles.heroLabel}>SMART FAMILY MODE</Text>

          <Text style={styles.heroTitle}>
            Keep every food choice safe.
          </Text>

          <Text style={styles.heroText}>
            NutriSaathi checks ingredients against each family member's
            dietary needs, allergies and preferences.
          </Text>

          <View style={styles.protectedPill}>
            <View style={styles.greenDot} />
            <Text style={styles.protectedText}>
              {members.length} profiles protected
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your family</Text>

          <Pressable style={styles.addButton} onPress={addMember}>
            <Ionicons name="add" size={17} color="#287A45" />
            <Text style={styles.addText}>Add member</Text>
          </Pressable>
        </View>

        {members.map((member, index) => (
          <Pressable
            key={`${member.name}-${index}`}
            style={styles.memberCard}
            onPress={() =>
              Alert.alert(
                member.name,
                `${member.role}\n\n${member.detail}\n\nPersonalised food safety preferences can be managed here.`
              )
            }
          >
            <View
              style={[
                styles.memberIcon,
                { backgroundColor: member.background },
              ]}
            >
              <Ionicons name={member.icon} size={24} color="#287A45" />
            </View>

            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>

              <View style={styles.detailRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#4D9A67"
                />
                <Text style={styles.memberDetail}>{member.detail}</Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={21}
              color="#A0AAA4"
            />
          </Pressable>
        ))}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="sparkles" size={21} color="#173B2A" />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How family safety works</Text>
            <Text style={styles.infoText}>
              Add everyone's dietary needs once. When you scan a product,
              NutriSaathi highlights ingredients that may not be suitable for
              anyone in your family.
            </Text>
          </View>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="warning-outline" size={20} color="#B8754E" />
            </View>
            <Text style={styles.featureText}>Allergy alerts</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="nutrition-outline" size={20} color="#6C947F" />
            </View>
            <Text style={styles.featureText}>Dietary needs</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#658B78"
              />
            </View>
            <Text style={styles.featureText}>Safer choices</Text>
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
    marginBottom: 22,
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
    maxWidth: 280,
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

  hero: {
    backgroundColor: '#19543E',
    borderRadius: 29,
    padding: 25,
  },

  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 19,
    backgroundColor: '#24684C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  heroLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#B9E6B7',
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  heroText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#D4E3D8',
    marginTop: 15,
  },

  protectedPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28664C',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 19,
  },

  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B9E6B7',
    marginRight: 7,
  },

  protectedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#173B2A',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4E7',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 19,
  },

  addText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#287A45',
    marginLeft: 3,
  },

  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4EAE3',
    marginBottom: 10,
  },

  memberIcon: {
    width: 53,
    height: 53,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  memberInfo: {
    flex: 1,
  },

  memberName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#173B2A',
  },

  memberRole: {
    fontSize: 10,
    color: '#8A958F',
    marginTop: 3,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  memberDetail: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4D8060',
    marginLeft: 4,
  },

  infoCard: {
    marginTop: 12,
    backgroundColor: '#E8F4E7',
    borderRadius: 23,
    padding: 17,
    flexDirection: 'row',
  },

  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173B2A',
    marginBottom: 5,
  },

  infoText: {
    fontSize: 10,
    lineHeight: 16,
    color: '#60746A',
  },

  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
  },

  feature: {
    alignItems: 'center',
    width: '30%',
  },

  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAE3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#78867D',
    textAlign: 'center',
    marginTop: 7,
  },

  footer: {
    textAlign: 'center',
    fontSize: 10,
    color: '#8B9790',
    marginTop: 25,
  },
});