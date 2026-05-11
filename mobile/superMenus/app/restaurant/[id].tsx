import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { api } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Restaurant = {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  website?: string;
};

type Item = {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  status?: string;
};

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [r, m] = await Promise.all([
          api<{ restaurant: Restaurant }>(`/restaurants/${id}`),
          api<{ items: Item[] }>(`/items/restaurant/${id}`),
        ]);
        if (cancelled) return;
        setRestaurant(r.restaurant);
        setMenu(m.items ?? []);
      } catch {
        if (!cancelled) {
          setRestaurant(null);
          setMenu([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.tint} />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.muted }}>Restaurant not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: restaurant.name }} />
      <View style={[styles.root, { backgroundColor: c.background }]}>
        {restaurant.description ? (
          <Text style={[styles.desc, { color: c.muted }]}>{restaurant.description}</Text>
        ) : null}
        {restaurant.address ? (
          <Text style={[styles.addr, { color: c.muted }]}>{restaurant.address}</Text>
        ) : null}

        <Text style={[styles.section, { color: c.text }]}>Menu</Text>
        <FlatList
          data={menu}
          keyExtractor={(it) => it._id}
          contentContainerStyle={{ paddingBottom: 32, gap: 8 }}
          renderItem={({ item }) => (
            <View style={[styles.row, { borderColor: c.border, backgroundColor: c.card }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: c.text }]}>{item.name}</Text>
                {item.description ? (
                  <Text style={[styles.itemDesc, { color: c.muted }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}
                <Text style={[styles.badge, { color: c.muted }]}>{item.category}</Text>
              </View>
              <Text style={[styles.price, { color: c.tint }]}>
                ${Number(item.price ?? 0).toFixed(2)}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: c.muted, marginTop: 12 }}>No menu items published yet.</Text>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  desc: { fontSize: 15, lineHeight: 22 },
  addr: { fontSize: 14, marginTop: 8 },
  section: { fontSize: 20, fontWeight: '800', marginTop: 20, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  itemName: { fontSize: 16, fontWeight: '700' },
  itemDesc: { fontSize: 13, marginTop: 4 },
  badge: { fontSize: 12, marginTop: 4, textTransform: 'uppercase' },
  price: { fontSize: 17, fontWeight: '800' },
});
