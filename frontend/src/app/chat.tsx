import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

const QUICK_QUESTIONS = [
  'What is added sugar?',
  'Why is fiber important?',
  'What does high sodium mean?',
  'What are food allergens?',
  'What is refined flour?',
  'How do I read a food label?',
];

const KNOWLEDGE: {
  keywords: string[];
  answer: string;
}[] = [
  {
    keywords: ['added sugar', 'added sugars'],
    answer:
      'Added sugar is sugar put into a food during processing or preparation. Common examples include sugar, glucose syrup, corn syrup, malt syrup and some sweeteners. Too much added sugar can make it harder to maintain a balanced diet, so checking the sugar amount and ingredient list is useful.',
  },
  {
    keywords: ['sugar', 'sweet', 'sweetness'],
    answer:
      'Sugar provides energy, but foods with a lot of added sugar can contribute substantial calories without providing much nutritional value. When comparing packaged foods, look at the sugar amount per serving and check the ingredient list for added sugars.',
  },
  {
    keywords: ['protein', 'muscle'],
    answer:
      'Protein helps build and maintain muscles and other body tissues. Good sources include pulses, beans, dairy, eggs, soy, nuts and seeds. For packaged foods, compare protein per serving rather than judging a product only by its marketing claims.',
  },
  {
    keywords: ['fiber', 'fibre'],
    answer:
      'Fiber supports normal digestion and can help you feel full for longer. Whole grains, pulses, fruits, vegetables, nuts and seeds are common sources. When comparing packaged foods, a higher fiber content can be a useful positive factor.',
  },
  {
    keywords: ['sodium', 'salt', 'salty'],
    answer:
      'Sodium is a mineral found naturally in foods and commonly added as salt. Excessive sodium intake can be a concern, especially for people who need to follow a lower-sodium diet. Check the sodium amount per serving and compare similar products.',
  },
  {
    keywords: ['allergen', 'allergy', 'allergies', 'peanut', 'soy', 'milk', 'egg'],
    answer:
      'A food allergen is an ingredient that can trigger an allergic reaction in a sensitive person. Common allergens include peanuts, tree nuts, milk, eggs, soy, wheat, sesame, fish and shellfish. If you have an allergy, always check the ingredient list and allergen information carefully.',
  },
  {
    keywords: ['refined flour', 'maida', 'refined wheat'],
    answer:
      'Refined flour, commonly called maida in India, has had much of the grain structure removed during processing. Compared with whole-grain flour, it generally contains less fiber. For everyday choices, products containing more whole grains can be a useful alternative.',
  },
  {
    keywords: ['palm oil', 'palm'],
    answer:
      'Palm oil is a commonly used vegetable oil in packaged foods. Its presence alone does not tell you whether an entire product is healthy or unhealthy. Look at the overall nutrition profile, ingredient list, portion size and your personal goals before deciding.',
  },
  {
    keywords: [
      'ultra processed',
      'ultra-processed',
      'processed food',
      'processed foods',
    ],
    answer:
      'Highly or ultra-processed foods often contain several processed ingredients and may include added sugars, refined ingredients, flavorings or other additives. Processing itself is not automatically bad, so it is better to look at the complete ingredient and nutrition profile.',
  },
  {
    keywords: ['balanced diet', 'balanced food', 'healthy diet'],
    answer:
      'A balanced diet generally includes a variety of vegetables, fruits, whole grains, pulses or other protein sources, and appropriate sources of healthy fats. The right balance depends on your age, health needs, activity level and goals.',
  },
  {
    keywords: ['food label', 'nutrition label', 'read label', 'label'],
    answer:
      'Start with serving size, calories, sugar, protein, fiber, saturated fat and sodium. Then read the ingredient list from beginning to end. Ingredients are generally listed by quantity, so the first few ingredients can tell you a lot about what the product contains.',
  },
  {
    keywords: ['calorie', 'calories', 'kcal'],
    answer:
      'Calories are a measure of the energy provided by food. Calories are not automatically good or bad; what matters is how they fit into your overall dietary needs and goals. Comparing calories per serving can help when choosing between similar products.',
  },
  {
    keywords: ['fat', 'fats', 'oil'],
    answer:
      'Dietary fat is an important nutrient, but different types and amounts matter. When comparing packaged foods, look beyond total fat and also consider saturated fat, serving size and the overall ingredient list.',
  },
  {
    keywords: ['ingredient', 'ingredients'],
    answer:
      'The ingredient list tells you what a packaged food is made from. Ingredients are generally listed from higher to lower quantity. Checking this list can help you identify added sugars, refined ingredients, allergens and other ingredients you may want to limit.',
  },
  {
    keywords: ['diabetes', 'diabetic', 'blood sugar'],
    answer:
      'For someone managing diabetes, food choices should be personalized. Sugar and carbohydrate content can matter, but the whole meal, portion size and individual medical advice are important too. NutriSaathi can help explain a label, but it should not replace advice from a doctor or dietitian.',
  },
  {
    keywords: ['high blood pressure', 'hypertension', 'bp'],
    answer:
      'People managing high blood pressure are often advised to pay attention to sodium intake, among other dietary factors. Check the sodium amount on packaged foods and discuss individual targets with a healthcare professional.',
  },
  {
    keywords: ['weight gain', 'gain weight'],
    answer:
      'Healthy weight gain usually focuses on enough overall energy plus nutrient-rich foods and adequate protein. Simply choosing foods high in sugar or highly processed calories is not the same as building a balanced diet. Individual needs vary.',
  },
  {
    keywords: ['weight loss', 'lose weight', 'weight management'],
    answer:
      'Weight management is influenced by overall energy intake, food quality, activity, sleep and many individual factors. For packaged foods, comparing calories, protein, fiber, sugar and portion size can help you make more informed choices.',
  },
  {
    keywords: ['vegan', 'vegetarian'],
    answer:
      'Vegetarian and vegan diets avoid different groups of animal-derived foods. When choosing packaged foods, check the ingredient list rather than relying only on front-of-pack claims, because ingredients such as milk, eggs or other animal-derived components may appear in unexpected products.',
  },
  {
    keywords: ['gluten', 'gluten free', 'gluten-free'],
    answer:
      'Gluten is a group of proteins found in wheat and related grains such as barley and rye. People with celiac disease or gluten-related conditions need to follow appropriate medical guidance and carefully check labels for gluten-containing ingredients and cross-contact information.',
  },
  {
    keywords: ['lactose', 'lactose free', 'milk intolerance'],
    answer:
      'Lactose is a sugar naturally present in milk and many dairy products. People with lactose intolerance may need to limit or replace certain dairy foods depending on their tolerance. A food labelled lactose-free can be useful, but always check the complete ingredient information.',
  },
];

function getBotResponse(question: string): string {
  const normalized = question.toLowerCase().trim();

  if (!normalized) {
    return 'Ask me something about ingredients, nutrition labels, allergens or healthy food choices.';
  }

  if (
    normalized.includes('hello') ||
    normalized.includes('hi') ||
    normalized.includes('hey')
  ) {
    return 'Hi! I’m NutriSaathi Assistant 🌿 Ask me about food labels, ingredients, nutrition, allergens or healthier choices.';
  }

  if (
    normalized.includes('thank') ||
    normalized.includes('thanks')
  ) {
    return 'You’re welcome! 🌿 I’m here whenever you want to understand something on a food label.';
  }

  if (
    normalized.includes('who are you') ||
    normalized.includes('what are you')
  ) {
    return 'I’m NutriSaathi Assistant. I provide simple educational information about food labels, ingredients and nutrition. For personal medical advice, please consult a qualified healthcare professional.';
  }

  for (const item of KNOWLEDGE) {
    const match = item.keywords.some((keyword) =>
      normalized.includes(keyword)
    );

    if (match) {
      return item.answer;
    }
  }

  return 'I can help with basic food and nutrition information. Try asking about sugar, protein, fiber, sodium, allergens, refined flour, ingredients, food labels or a dietary goal.';
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text:
        'Hi! I’m your NutriSaathi Assistant 🌿\n\nAsk me anything about food labels, ingredients, nutrition or common dietary concerns.',
    },
  ]);

  const [input, setInput] = useState('');

  const hasMessages = useMemo(
    () => messages.length > 0,
    [messages]
  );

  const sendMessage = (text?: string) => {
    const question = (text ?? input).trim();

    if (!question) {
      return;
    }

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      sender: 'user',
      text: question,
    };

    const botMessage: Message = {
      id: `${Date.now()}-bot`,
      sender: 'bot',
      text: getBotResponse(question),
    };

    setMessages((current) => [
      ...current,
      userMessage,
      botMessage,
    ]);

    setInput('');
  };

  const renderMessage = ({
    item,
  }: {
    item: Message;
  }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageRow,
          isUser && styles.messageRowUser,
        ]}
      >
        {!isUser && (
          <View style={styles.botAvatar}>
            <Ionicons
              name="sparkles"
              size={17}
              color="#287A45"
            />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser
              ? styles.userBubble
              : styles.botBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser && styles.userMessageText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#244A31"
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.headerAvatar}>
              <Ionicons
                name="sparkles"
                size={20}
                color="#287A45"
              />
            </View>

            <View>
              <Text style={styles.headerTitle}>
                NutriSaathi Assistant
              </Text>

              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />

                <Text style={styles.onlineText}>
                  Food & nutrition guide
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons
              name="leaf-outline"
              size={22}
              color="#287A45"
            />
          </View>

          <View style={styles.introContent}>
            <Text style={styles.introTitle}>
              Understand your food
            </Text>

            <Text style={styles.introText}>
              Get simple explanations of ingredients,
              nutrition and common food-label terms.
            </Text>
          </View>
        </View>

        {hasMessages && (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
            keyboardShouldPersistTaps="handled"
          />
        )}

        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>
            Try asking
          </Text>

          <FlatList
            horizontal
            data={QUICK_QUESTIONS}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickList}
            renderItem={({ item }) => (
              <Pressable
                style={styles.quickChip}
                onPress={() => sendMessage(item)}
              >
                <Text style={styles.quickChipText}>
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about food or nutrition..."
            placeholderTextColor="#9AA69E"
            multiline
            style={styles.input}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />

          <Pressable
            style={[
              styles.sendButton,
              !input.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage()}
            disabled={!input.trim()}
          >
            <Ionicons
              name="arrow-up"
              size={21}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          Educational information only • Not a substitute
          for professional medical advice
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF7',
  },

  flex: {
    flex: 1,
  },

  header: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEE9',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F1F6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 11,
  },

  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#183B25',
  },

  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#287A45',
    marginRight: 5,
  },

  onlineText: {
    fontSize: 10.5,
    color: '#7B8880',
  },

  headerSpacer: {
    width: 42,
  },

  introCard: {
    marginHorizontal: 18,
    marginTop: 15,
    padding: 15,
    borderRadius: 18,
    backgroundColor: '#EAF5ED',
    flexDirection: 'row',
  },

  introIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#214A2D',
    marginBottom: 3,
  },

  introText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: '#617167',
  },

  messagesContent: {
    paddingHorizontal: 18,
    paddingTop: 17,
    paddingBottom: 8,
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },

  messageRowUser: {
    justifyContent: 'flex-end',
  },

  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 17,
  },

  botBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EBE5',
    borderBottomLeftRadius: 5,
  },

  userBubble: {
    backgroundColor: '#287A45',
    borderBottomRightRadius: 5,
  },

  messageText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#3D4D44',
  },

  userMessageText: {
    color: '#FFFFFF',
  },

  quickSection: {
    paddingTop: 5,
    paddingBottom: 8,
  },

  quickTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#748178',
    marginLeft: 18,
    marginBottom: 8,
  },

  quickList: {
    paddingHorizontal: 18,
  },

  quickChip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE6DE',
    marginRight: 8,
  },

  quickChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#496054',
  },

  inputContainer: {
    marginHorizontal: 15,
    marginTop: 4,
    minHeight: 54,
    maxHeight: 105,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE6DF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 14,
    paddingRight: 7,
    paddingVertical: 6,
  },

  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 90,
    paddingTop: 9,
    paddingBottom: 8,
    paddingRight: 8,
    color: '#263A2D',
    fontSize: 13.5,
    lineHeight: 19,
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendButtonDisabled: {
    backgroundColor: '#AFC4B5',
  },

  disclaimer: {
    textAlign: 'center',
    fontSize: 9.5,
    color: '#9AA59E',
    paddingHorizontal: 20,
    paddingTop: 7,
    paddingBottom: 5,
  },
});