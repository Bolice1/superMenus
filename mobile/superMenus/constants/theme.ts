/**
 * Super Menus brand palette (aligned with web admin / design tokens).
 */

import { Platform } from 'react-native';

const primary = '#a04100';
const primaryAccent = '#ff6b00';
const surface = '#fff8f6';
const onSurface = '#261812';

export const Colors = {
  light: {
    text: onSurface,
    background: surface,
    tint: primaryAccent,
    icon: '#5a4136',
    tabIconDefault: '#8e7164',
    tabIconSelected: primaryAccent,
    card: '#ffffff',
    border: '#e2bfb0',
    muted: '#5a4136',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: primaryAccent,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryAccent,
    card: '#1e1f22',
    border: '#3d2d26',
    muted: '#9BA1A6',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
