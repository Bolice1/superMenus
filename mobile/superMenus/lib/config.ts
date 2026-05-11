import Constants from 'expo-constants';

/** Base URL for the Express API (include `/api`). Override via `app.json` → `expo.extra.apiUrl` or `EXPO_PUBLIC_API_URL`. */
export const API_BASE = (
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:4000/api'
).replace(/\/$/, '');
