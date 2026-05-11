import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { api } from '@/lib/api';

const TOKEN_KEY = 'sm_customer_token';
const CUSTOMER_KEY = 'sm_customer_json';

async function storageGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

async function storageSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function storageDelete(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    /* key may not exist */
  }
}

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
};

type AuthContextValue = {
  ready: boolean;
  token: string | null;
  customer: Customer | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (payload: {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeCustomer(raw: { id?: unknown } & Partial<Customer>): Customer {
  return {
    id: String(raw.id ?? ''),
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    userName: raw.userName ?? '',
    email: raw.email ?? '',
    phoneNumber: raw.phoneNumber,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, c] = await Promise.all([storageGet(TOKEN_KEY), storageGet(CUSTOMER_KEY)]);
        if (cancelled) return;
        setToken(t);
        if (c) setCustomer(JSON.parse(c) as Customer);
      } catch {
        if (!cancelled) {
          setToken(null);
          setCustomer(null);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (t: string | null, c: Customer | null) => {
    if (t) await storageSet(TOKEN_KEY, t);
    else await storageDelete(TOKEN_KEY);
    if (c) await storageSet(CUSTOMER_KEY, JSON.stringify(c));
    else await storageDelete(CUSTOMER_KEY);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await api<{ token: string; customer: Customer & { id: unknown } }>('/customers/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const cust = normalizeCustomer(res.customer);
    setToken(res.token);
    setCustomer(cust);
    await persist(res.token, cust);
  }, [persist]);

  const signOut = useCallback(async () => {
    setToken(null);
    setCustomer(null);
    await persist(null, null);
  }, [persist]);

  const signUp = useCallback(
    async (payload: {
      firstName: string;
      lastName: string;
      userName: string;
      email: string;
      phoneNumber: string;
      password: string;
    }) => {
      await api('/customers/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ ready, token, customer, signIn, signOut, signUp }),
    [ready, token, customer, signIn, signOut, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
