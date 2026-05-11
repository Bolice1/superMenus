import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Sign in failed', e instanceof ApiError ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.root, { backgroundColor: c.background }]}>
      <View style={styles.inner}>
        <Text style={[styles.logo, { color: c.tint }]}>Super Menus</Text>
        <Text style={[styles.sub, { color: c.muted }]}>Order from great restaurants near you.</Text>

        <TextInput
          style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.card }]}
          placeholder="Email"
          placeholderTextColor={c.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.card }]}
          placeholder="Password"
          placeholderTextColor={c.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={[styles.primaryBtn, { backgroundColor: c.tint, opacity: busy ? 0.7 : 1 }]}
          onPress={onSubmit}
          disabled={busy}>
          <Text style={styles.primaryBtnText}>{busy ? 'Signing in…' : 'Sign in'}</Text>
        </Pressable>

        <Link href="/register" asChild>
          <Pressable style={styles.linkWrap}>
            <Text style={[styles.link, { color: c.tint }]}>Create an account</Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  inner: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  logo: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  sub: { textAlign: 'center', marginBottom: 16, fontSize: 15 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  primaryBtn: { borderRadius: 12, paddingVertical: 16, marginTop: 8 },
  primaryBtnText: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 16 },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  link: { fontWeight: '600', fontSize: 15 },
});
