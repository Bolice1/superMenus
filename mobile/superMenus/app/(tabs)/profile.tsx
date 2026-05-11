import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const { customer, signOut } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  async function onSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Text style={[styles.title, { color: c.text }]}>Profile</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.name, { color: c.text }]}>
          {customer?.firstName} {customer?.lastName}
        </Text>
        <Text style={[styles.row, { color: c.muted }]}>@{customer?.userName}</Text>
        <Text style={[styles.row, { color: c.muted }]}>{customer?.email}</Text>
        {customer?.phoneNumber ? (
          <Text style={[styles.row, { color: c.muted }]}>{customer.phoneNumber}</Text>
        ) : null}
      </View>

      <Pressable style={[styles.outline, { borderColor: c.border }]} onPress={onSignOut}>
        <Text style={[styles.outlineText, { color: c.text }]}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: '800' },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  name: { fontSize: 20, fontWeight: '700' },
  row: { fontSize: 15, marginTop: 6 },
  outline: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  outlineText: { fontWeight: '700', fontSize: 16 },
});
