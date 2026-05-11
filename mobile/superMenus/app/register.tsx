import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setBusy(true);
    try {
      await signUp({
        firstName,
        lastName,
        userName,
        email: email.trim(),
        phoneNumber,
        password,
      });
      Alert.alert('Account created', 'You can sign in now.', [
        { text: 'OK', onPress: () => router.replace('/login') },
      ]);
    } catch (e) {
      Alert.alert('Registration failed', e instanceof ApiError ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  function field(
    label: string,
    value: string,
    onChange: (t: string) => void,
    options?: { secure?: boolean; keyboard?: 'default' | 'email-address' | 'phone-pad' },
  ) {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text style={[styles.label, { color: c.muted }]}>{label}</Text>
        <TextInput
          style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.card }]}
          value={value}
          onChangeText={onChange}
          secureTextEntry={options?.secure}
          autoCapitalize={label === 'Email' ? 'none' : 'words'}
          keyboardType={options?.keyboard ?? 'default'}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: c.text }]}>Create account</Text>
        <Text style={[styles.sub, { color: c.muted }]}>
          Join Super Menus to track orders and discover venues.
        </Text>

        {field('First name', firstName, setFirstName)}
        {field('Last name', lastName, setLastName)}
        {field('Username', userName, setUserName)}
        {field('Email', email, setEmail, { keyboard: 'email-address' })}
        {field('Phone', phoneNumber, setPhoneNumber, { keyboard: 'phone-pad' })}
        {field('Password', password, setPassword, { secure: true })}

        <Pressable
          style={[styles.primaryBtn, { backgroundColor: c.tint, opacity: busy ? 0.7 : 1 }]}
          onPress={onSubmit}
          disabled={busy}>
          <Text style={styles.primaryBtnText}>{busy ? 'Creating…' : 'Register'}</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ textAlign: 'center', color: c.tint, fontWeight: '600' }}>Back to sign in</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  sub: { fontSize: 14, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  primaryBtn: { borderRadius: 12, paddingVertical: 16, marginTop: 8 },
  primaryBtnText: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});
