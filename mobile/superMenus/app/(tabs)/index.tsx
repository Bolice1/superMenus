import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { api } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Restaurant = {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  isActive?: boolean;
};

export default function DiscoverScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [items, setItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const res = await api<{ restaurants: Restaurant[] }>('/restaurants/active');
    setItems(res.restaurants ?? []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Text style={[styles.headline, { color: c.text }]}>Active restaurants</Text>
      <Text style={[styles.sub, { color: c.muted }]}>Tap a venue to see the menu.</Text>
      <FlatList
        data={items}
        keyExtractor={(r) => r._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.tint} />}
        contentContainerStyle={{ paddingVertical: 12, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/restaurant/${item._id}`)}
            style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.name, { color: c.text }]}>{item.name}</Text>
            {item.description ? (
              <Text style={[styles.desc, { color: c.muted }]} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
            {item.address ? (
              <Text style={[styles.addr, { color: c.muted }]} numberOfLines={1}>
                {item.address}
              </Text>
            ) : null}
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ color: c.muted, textAlign: 'center', marginTop: 24 }}>
            No active restaurants yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headline: { fontSize: 22, fontWeight: '800' },
  sub: { fontSize: 14, marginTop: 4, marginBottom: 8 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  name: { fontSize: 18, fontWeight: '700' },
  desc: { fontSize: 14, marginTop: 6 },
  addr: { fontSize: 13, marginTop: 4 },
});
