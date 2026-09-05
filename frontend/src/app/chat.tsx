import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

type FamilyMember = Record<string, unknown>;

const QUICK_QUESTIONS = [
  'Why is this product not a good choice for Dad?',
  'What should I watch out for in this product?',
  'Is this product suitable for my family?',
  'Explain this product analysis simply.',
];

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export default function ChatScreen() {
  const params = useLocalSearchParams<{
    product_id?: string;
    barcode?: string;
    family_members?: string;
  }>();

  const productId = Array.isArray(params.product_id)
    ? params.product_id[0] || ''
    : params.product_id || '';

  const familyMembers = useMemo<FamilyMember[]>(() => {
    const rawFamilyMembers = Array.isArray(params.family_members)
      ? params.family_members[0]
      : params.family_members;

    if (!rawFamilyMembers) return [];

    try {
      const parsed = JSON.parse(rawFamilyMembers);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [params.family_members]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: productId
        ? 'Hi! I can explain this product analysis and help you understand why it may or may not suit you or your family.'
        : 'Hi! Open me from a product result to ask questions about that product.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || loading) return;

    setInput('');
    setError('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };

    setMessages((current) => [...current, userMessage]);
    setLoading(true);

    try {
      if (!API_BASE_URL) {
        throw new Error(
          'Backend URL is not configured. Set EXPO_PUBLIC_API_URL in the Expo frontend environment.'
        );
      }

      if (!productId) {
        throw new Error(
          'No product is attached to this chat. Please open NutriSaathi AI from a product result.'
        );
      }

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          product_id: productId,
          family_members: familyMembers,
        }),
      });

      let data: { success?: boolean; answer?: string; error?: string } = {};

      try {
        data = await response.json();
      } catch {
        throw new Error(`Server returned an invalid response (${response.status}).`);
      }

      if (!response.ok || !data.success || !data.answer) {
        throw new Error(
          data.error || `Chat request failed (${response.status}).`
        );
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: data.answer as string,
        },
      ]);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Something went wrong while contacting NutriSaathi AI.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={21} color="#173B2A" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.headerIcon}>
              <Ionicons name="sparkles" size={18} color="#287A45" />
            </View>
            <View>
              <Text style={styles.headerTitle}>NutriSaathi AI</Text>
              <Text style={styles.headerSubtitle}>
                {productId ? `Product ${productId}` : 'Food assistant'}
              </Text>
            </View>
          </View>

          <View style={styles.headerButtonPlaceholder} />
        </View>

        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <Ionicons name="sparkles" size={22} color="#173B2A" />
            </View>
            <View style={styles.introContent}>
              <Text style={styles.introTitle}>Ask about this product</Text>
              <Text style={styles.introText}>
                NutriSaathi AI uses the backend analysis for the selected product
                and your family context to answer your question.
              </Text>
            </View>
          </View>

          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.role === 'user' && styles.userMessageRow,
              ]}
            >
              {message.role === 'assistant' && (
                <View style={styles.botAvatar}>
                  <Ionicons name="sparkles" size={15} color="#287A45" />
                </View>
              )}

              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user'
                    ? styles.userBubble
                    : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' && styles.userMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))}

          {loading && (
            <View style={styles.messageRow}>
              <View style={styles.botAvatar}>
                <Ionicons name="sparkles" size={15} color="#287A45" />
              </View>
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color="#287A45" />
                <Text style={styles.typingText}>NutriSaathi is thinking…</Text>
              </View>
            </View>
          )}

          {!!error && (
            <View style={styles.errorCard}>
              <View style={styles.errorIcon}>
                <Ionicons name="alert-circle-outline" size={19} color="#A66A43" />
              </View>
              <View style={styles.errorContent}>
                <Text style={styles.errorTitle}>Couldn't get an answer</Text>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable
                  style={styles.retryButton}
                  onPress={() => sendMessage(messages[messages.length - 1]?.text)}
                >
                  <Ionicons name="refresh" size={15} color="#287A45" />
                  <Text style={styles.retryText}>Retry</Text>
                </Pressable>
              </View>
            </View>
          )}

          <Text style={styles.quickTitle}>TRY ASKING</Text>
          <View style={styles.quickWrap}>
            {QUICK_QUESTIONS.map((question) => (
              <Pressable
                key={question}
                style={styles.quickChip}
                onPress={() => sendMessage(question)}
                disabled={loading}
              >
                <Text style={styles.quickText}>{question}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={16} color="#89958E" />
            <Text style={styles.disclaimerText}>
              NutriSaathi AI provides food guidance based on the app's analysis.
              It is not a substitute for professional medical advice.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about this product…"
            placeholderTextColor="#9AA69E"
            style={styles.input}
            multiline
            maxLength={500}
            editable={!loading}
            onSubmitEditing={() => sendMessage()}
          />

          <Pressable
            style={[
              styles.sendButton,
              (!input.trim() || loading) && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="arrow-up" size={21} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9F4',
  },
  flex: {
    flex: 1,
  },
  header: {
    minHeight: 68,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4EAE3',
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F6F9F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonPlaceholder: {
    width: 42,
    height: 42,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#173B2A',
  },
  headerSubtitle: {
    fontSize: 9,
    color: '#89958E',
    marginTop: 2,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 18,
    paddingBottom: 25,
  },
  introCard: {
    backgroundColor: '#E8F4E7',
    borderRadius: 21,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  introIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  introContent: {
    flex: 1,
  },
  introTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173B2A',
    marginBottom: 4,
  },
  introText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#60746A',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 29,
    height: 29,
    borderRadius: 11,
    backgroundColor: '#E8F4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAE3',
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: '#287A45',
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#30443A',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  typingBubble: {
    minHeight: 42,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAE3',
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 10,
    color: '#89958E',
    marginLeft: 8,
  },
  errorCard: {
    backgroundColor: '#FFF7EF',
    borderRadius: 18,
    padding: 13,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F0DFCC',
    marginBottom: 17,
  },
  errorIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#FFF0DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7F5436',
  },
  errorText: {
    fontSize: 9,
    lineHeight: 14,
    color: '#8B725E',
    marginTop: 3,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  retryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#287A45',
    marginLeft: 4,
  },
  quickTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#89958E',
    marginTop: 8,
    marginBottom: 9,
  },
  quickWrap: {
    gap: 8,
  },
  quickChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE6DE',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  quickText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#456052',
    fontWeight: '600',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 19,
    paddingHorizontal: 3,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
    color: '#89958E',
    marginLeft: 6,
  },
  inputBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4EAE3',
    paddingHorizontal: 14,
    paddingTop: 9,
    paddingBottom: Platform.OS === 'ios' ? 10 : 9,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 110,
    backgroundColor: '#F6F9F4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCE5DE',
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 10,
    color: '#30443A',
    fontSize: 12,
    marginRight: 8,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#287A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
});
