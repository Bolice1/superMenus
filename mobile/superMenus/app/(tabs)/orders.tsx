import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Order = {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  restaurantId?: { name?: string } | string;
};

function restaurantName(o: Order) {
  const r = o.restaurantId;
  if (r && typeof r === 'object' && r.name) return r.name;
  return 'Restaurant';
}

export default function OrdersScreen() {
  const { customer, token } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!customer?.id) return;
    const res = await api<{ orders: Order[] }>(
      `/orders/list?userId=${encodeURIComponent(customer.id)}&limit=50`,
      { token },
    );
    setOrders(res.orders ?? []);
  }, [customer?.id, token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Text style={[styles.headline, { color: c.text }]}>Your orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(o) => o._id}
        contentContainerStyle={{ paddingVertical: 12, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.title, { color: c.text }]}>{restaurantName(item)}</Text>
            <Text style={[styles.meta, { color: c.muted }]}>
              {new Date(item.createdAt).toLocaleString()} · {item.orderStatus}
            </Text>
            <Text style={[styles.price, { color: c.tint }]}>${Number(item.totalAmount).toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: c.muted, textAlign: 'center', marginTop: 32 }}>
            No orders yet. Browse restaurants and place an order from the web app when checkout is
            enabled.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headline: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14 },
  title: { fontSize: 17, fontWeight: '700' },
  meta: { fontSize: 13, marginTop: 4 },
  price: { fontSize: 18, fontWeight: '800', marginTop: 8 },
});
