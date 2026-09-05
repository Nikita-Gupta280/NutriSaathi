import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Profile = {
  member_id: string;
  name: string;
  dietary: string[];
  allergies: string[];
  health: string[];
  goals: string[];
};

let store: Profile[] = [
  { member_id: 'you', name: 'You', dietary: [], allergies: [], health: [], goals: [] },
  { member_id: 'mom', name: 'Mom', dietary: [], allergies: [], health: [], goals: [] },
  { member_id: 'dad', name: 'Dad', dietary: [], allergies: [], health: [], goals: [] },
];

const OPTIONS = {
  dietary: ['Vegetarian', 'Vegan', 'Jain', 'Gluten free', 'Non-vegetarian'],
  allergies: ['Peanuts', 'Tree nuts', 'Milk / Lactose', 'Soy', 'Wheat / Gluten', 'Eggs', 'Sesame'],
  health: ['Diabetes', 'High blood pressure', 'High cholesterol', 'Low sodium', 'High protein'],
  goals: ['Weight management', 'Weight gain', 'Muscle gain', 'High protein', 'Low sugar', 'Balanced diet'],
};

const API_DIETARY: Record<string, string> = {
  Vegetarian: 'vegetarian',
  Vegan: 'vegan',
  Jain: 'jain',
  'Gluten free': 'gluten_free',
  'Non-vegetarian': 'non_vegetarian',
};

const API_ALLERGIES: Record<string, string> = {
  Peanuts: 'peanut',
  'Tree nuts': 'tree_nut',
  'Milk / Lactose': 'milk',
  Soy: 'soy',
  'Wheat / Gluten': 'gluten',
  Eggs: 'egg',
  Sesame: 'sesame',
};

const API_HEALTH: Record<string, string> = {
  Diabetes: 'diabetes',
  'High blood pressure': 'high_blood_pressure',
  'High cholesterol': 'high_cholesterol',
  'Low sodium': 'low_sodium',
  'High protein': 'high_protein',
};

export const getFamilyMembersForApi = () =>
  store.map(member => ({
    member_id: member.member_id,
    name: member.name,
    dietary_preferences: member.dietary.map(v => API_DIETARY[v]).filter(Boolean),
    allergies: member.allergies.map(v => API_ALLERGIES[v]).filter(Boolean),
    health_considerations: Array.from(new Set([
      ...member.health.map(v => API_HEALTH[v]).filter(Boolean),
      ...member.goals.map(v => ({
        'Weight management': 'weight_management',
        'High protein': 'high_protein',
      } as Record<string, string>)[v]).filter(Boolean),
    ])),
  }));

type Section = keyof typeof OPTIONS;

export default function FamilyScreen() {
  const [profiles, setProfiles] = useState<Profile[]>(store);
  const [draft, setDraft] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [section, setSection] = useState<Section | null>(null);

  const open = (p: Profile) => {
    setDraft({
      ...p,
      dietary: [...p.dietary],
      allergies: [...p.allergies],
      health: [...p.health],
      goals: [...p.goals],
    });
    setName(p.name);
    setSection(null);
  };

  const add = () => {
    setDraft({ member_id: `member-${Date.now()}`, name: '', dietary: [], allergies: [], health: [], goals: [] });
    setName('');
    setSection(null);
  };

  const save = () => {
    if (!draft || !name.trim()) {
      Alert.alert('Name required', 'Enter a name for this family member.');
      return;
    }
    const saved = { ...draft, name: name.trim() };
    const index = store.findIndex(p => p.member_id === saved.member_id);
    if (index >= 0) store[index] = saved;
    else store = [...store, saved];
    setProfiles([...store]);
    setDraft(null);
  };

  const toggle = (value: string) => {
    if (!draft || !section) return;
    const values = draft[section];
    const next = values.includes(value) ? values.filter(v => v !== value) : [...values, value];
    setDraft({ ...draft, [section]: next });
  };

  const remove = (p: Profile) => {
    if (p.member_id === 'you') return;
    Alert.alert('Remove member?', `Remove ${p.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {
        store = store.filter(x => x.member_id !== p.member_id);
        setProfiles([...store]);
      }},
    ]);
  };

  if (draft) {
    if (section) {
      const selected = draft[section];
      return (
        <SafeAreaView style={s.safe}>
          <View style={s.header}>
            <Pressable style={s.back} onPress={() => setSection(null)}>
              <Ionicons name="arrow-back" size={22} color="#173B2A" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={s.eyebrow}>FAMILY PROFILE</Text>
              <Text style={s.headerTitle}>{section === 'dietary' ? 'Dietary preferences' : section === 'allergies' ? 'Allergies & restrictions' : section === 'health' ? 'Health considerations' : 'Nutrition goals'}</Text>
            </View>
            <Text style={s.count}>{selected.length}</Text>
          </View>
          <ScrollView contentContainerStyle={s.body}>
            <Text style={s.hint}>Select everything that applies to {name || 'this member'}.</Text>
            {OPTIONS[section].map(value => {
              const active = selected.includes(value);
              return (
                <Pressable key={value} style={[s.option, active && s.optionActive]} onPress={() => toggle(value)}>
                  <View style={[s.check, active && s.checkActive]}>
                    {active && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={[s.optionText, active && s.optionTextActive]}>{value}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={s.bottom}>
            <Pressable style={s.primary} onPress={() => setSection(null)}>
              <Text style={s.primaryText}>Done</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.body}>
          <View style={s.header}>
            <Pressable style={s.back} onPress={() => setDraft(null)}>
              <Ionicons name="arrow-back" size={22} color="#173B2A" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={s.eyebrow}>FAMILY PROFILE</Text>
              <Text style={s.headerTitle}>Member details</Text>
            </View>
          </View>

          <View style={s.card}>
            <Text style={s.label}>NAME</Text>
            <TextInput value={name} onChangeText={setName} placeholder="e.g. Test Member" placeholderTextColor="#9AA69E" style={s.input} />
          </View>

          <Text style={s.title}>Personalise this profile</Text>
          <Text style={s.hint}>These details can be used by NutriSaathi's family engine.</Text>

          <EditRow title="Dietary preferences" values={draft.dietary} onPress={() => setSection('dietary')} />
          <EditRow title="Allergies & restrictions" values={draft.allergies} onPress={() => setSection('allergies')} />
          <EditRow title="Health considerations" values={draft.health} onPress={() => setSection('health')} />
          <EditRow title="Nutrition goals" values={draft.goals} onPress={() => setSection('goals')} />

          <Pressable style={s.primary} onPress={save}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={s.primaryText}>Save profile</Text>
          </Pressable>
          <Pressable style={s.cancel} onPress={() => setDraft(null)}>
            <Text style={s.cancelText}>Cancel</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.body}>
        <View style={s.top}>
          <View>
            <Text style={s.eyebrow}>SMART FAMILY MODE</Text>
            <Text style={s.title}>Your family</Text>
            <Text style={s.hint}>Personalised food safety for everyone.</Text>
          </View>
          <View style={s.icon}><Ionicons name="people-outline" size={25} color="#287A45" /></View>
        </View>

        <View style={s.hero}>
          <Ionicons name="shield-checkmark-outline" size={28} color="#287A45" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.heroTitle}>Family-first food decisions</Text>
            <Text style={s.hint}>Add diets, allergies, health considerations and goals.</Text>
          </View>
        </View>

        <View style={s.row}>
          <View><Text style={s.sectionTitle}>Family members</Text><Text style={s.hint}>{profiles.length} profiles saved</Text></View>
          <Pressable style={s.add} onPress={add}><Ionicons name="add" size={18} color="#fff" /><Text style={s.addText}>Add member</Text></Pressable>
        </View>

        {profiles.map(p => (
          <View key={p.member_id} style={s.card}>
            <View style={s.memberRow}>
              <View style={s.avatar}><Ionicons name="person" size={20} color="#287A45" /></View>
              <View style={{ flex: 1 }}><Text style={s.memberName}>{p.name}</Text><Text style={s.hint}>{p.member_id === 'you' ? 'Primary profile' : 'Family profile'}</Text></View>
              <Pressable style={s.smallButton} onPress={() => open(p)}><Ionicons name="create-outline" size={18} color="#287A45" /></Pressable>
              {p.member_id !== 'you' && <Pressable style={s.smallButton} onPress={() => remove(p)}><Ionicons name="trash-outline" size={17} color="#B8754E" /></Pressable>}
            </View>
            <Summary label="Diet" values={p.dietary} />
            <Summary label="Allergies" values={p.allergies} />
            <Summary label="Health" values={p.health} />
            <Summary label="Goals" values={p.goals} />
          </View>
        ))}

        <Text style={s.footer}>NutriSaathi · Food decisions made personal.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function EditRow({ title, values, onPress }: { title: string; values: string[]; onPress: () => void }) {
  return (
    <Pressable style={s.editRow} onPress={onPress}>
      <View style={{ flex: 1 }}><Text style={s.rowTitle}>{title}</Text><Text style={s.hint}>{values.length ? values.join(' · ') : 'Not added yet'}</Text></View>
      <Ionicons name="chevron-forward" size={20} color="#9AA69E" />
    </Pressable>
  );
}

function Summary({ label, values }: { label: string; values: string[] }) {
  return (
    <View style={s.summary}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.hint}>{values.length ? values.join(' · ') : 'None added'}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F9F4' },
  body: { padding: 20, paddingBottom: 40 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E1E8E1' },
  back: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  eyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.8, color: '#287A45', marginBottom: 5 },
  title: { fontSize: 28, fontWeight: '800', color: '#173B2A' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#173B2A' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#173B2A' },
  hint: { fontSize: 10, lineHeight: 15, color: '#718078', marginTop: 4 },
  icon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#E8F4E7', alignItems: 'center', justifyContent: 'center' },
  hero: { backgroundColor: '#E8F4E7', borderRadius: 20, padding: 16, flexDirection: 'row', marginBottom: 22 },
  heroTitle: { fontSize: 13, fontWeight: '800', color: '#173B2A' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  add: { backgroundColor: '#287A45', borderRadius: 13, minHeight: 40, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
  addText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E1E8E1', marginBottom: 12 },
  memberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#E8F4E7', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  memberName: { fontSize: 15, fontWeight: '800', color: '#173B2A' },
  smallButton: { width: 35, height: 35, borderRadius: 11, backgroundColor: '#E8F4E7', alignItems: 'center', justifyContent: 'center', marginLeft: 5 },
  summary: { marginTop: 9 },
  label: { fontSize: 8, fontWeight: '800', letterSpacing: 1, color: '#89958E' },
  editRow: { minHeight: 66, backgroundColor: '#fff', borderRadius: 17, borderWidth: 1, borderColor: '#E1E8E1', paddingHorizontal: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  rowTitle: { fontSize: 12, fontWeight: '800', color: '#173B2A' },
  input: { fontSize: 17, fontWeight: '700', color: '#173B2A', paddingVertical: 8 },
  option: { minHeight: 52, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E1E8E1', paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  optionActive: { backgroundColor: '#E8F4E7', borderColor: '#BBD8BE' },
  check: { width: 25, height: 25, borderRadius: 13, borderWidth: 1.5, borderColor: '#C7D0C9', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  checkActive: { backgroundColor: '#287A45', borderColor: '#287A45' },
  optionText: { fontSize: 11, color: '#51615A' },
  optionTextActive: { color: '#173B2A', fontWeight: '800' },
  count: { backgroundColor: '#E8F4E7', color: '#287A45', paddingHorizontal: 9, paddingVertical: 7, borderRadius: 10, fontWeight: '800' },
  bottom: { padding: 12, borderTopWidth: 1, borderTopColor: '#E1E8E1', backgroundColor: '#F6F9F4' },
  primary: { minHeight: 52, borderRadius: 17, backgroundColor: '#287A45', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, marginTop: 16 },
  primaryText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  cancel: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: '#718078', fontSize: 12, fontWeight: '700' },
  footer: { textAlign: 'center', color: '#89958E', fontSize: 9, marginTop: 18 },
});