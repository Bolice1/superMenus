---
name: Modern Culinary Admin
colors:
  surface: '#fff8f6'
  surface-dim: '#efd5ca'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#ffeae1'
  surface-container-high: '#fee3d8'
  surface-container-highest: '#f8ddd2'
  on-surface: '#261812'
  on-surface-variant: '#5a4136'
  inverse-surface: '#3d2d26'
  inverse-on-surface: '#ffede6'
  outline: '#8e7164'
  outline-variant: '#e2bfb0'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#ffb693'
  secondary: '#5d5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e5'
  on-secondary-container: '#636467'
  tertiary: '#0062a1'
  on-tertiary: '#ffffff'
  tertiary-container: '#059eff'
  on-tertiary-container: '#003357'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#e2e2e5'
  secondary-fixed-dim: '#c6c6c9'
  on-secondary-fixed: '#1a1c1e'
  on-secondary-fixed-variant: '#454749'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9ccaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497b'
  background: '#fff8f6'
  on-background: '#261812'
  surface-variant: '#f8ddd2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  sidebar_width: 260px
---

## Brand & Style

The design system is engineered for high-velocity hospitality management. It strikes a balance between professional reliability and the energetic pace of the food and beverage industry. The personality is efficient, appetizing, and authoritative, designed to reduce cognitive load while highlighting critical business metrics.

The visual style follows a **Corporate Modern** approach. It utilizes a structured hierarchy, ample whitespace, and high-quality functional components. By pairing a deep, sophisticated dark sidebar with a high-energy orange accent, the interface feels like a premium tool that is both serious about data and passionate about service.

## Colors

The palette is anchored by the high-contrast relationship between the dark navigation environment and the clean workspace. 

- **Primary (#FF6B00):** Used strategically for call-to-action elements, active states, and brand-identifying accents. 
- **Neutral Dark (#1A1C1E):** Reserved for the sidebar and primary navigation, providing a grounding frame that recedes visually to let content shine.
- **Surface Palette:** The background remains pure white (#FFFFFF) to ensure maximum readability, while the soft gray (#F8F9FA) is used for card backgrounds and container differentiation.
- **Functional Colors:** Success, error, and warning tokens are standardized to provide immediate feedback on system health and order status.

## Typography

This design system utilizes **Inter** for all interface levels to ensure maximum legibility and a neutral, systematic feel. The hierarchy is strictly defined to help users scan dense menus and analytics dashboards quickly. 

Headlines utilize tighter letter spacing and heavier weights to command attention, while body text maintains a generous line height for comfortable reading of orders and logs. Labels and metadata use a smaller, uppercase treatment to distinguish them from actionable content and primary data points.

## Layout & Spacing

The layout employs a **Fluid Grid** model within a structured shell. The primary navigation is anchored to a fixed-width left sidebar, while the main content area expands to fill the viewport.

Spacing follows a strict 8px linear scale. A 12-column grid is used for the dashboard content, allowing cards to span 3, 4, 6, or 12 columns depending on the data complexity. Gutters are consistently 24px to ensure a breathable, uncluttered environment. Large containers and page headers utilize the 'lg' and 'xl' spacing tokens to define clear section boundaries.

## Elevation & Depth

Visual depth in the design system is achieved through **Tonal Layers** combined with **Ambient Shadows**.

1.  **Level 0 (Background):** Pure white, the lowest layer.
2.  **Level 1 (Cards):** Soft gray (#F8F9FA) with a subtle 1px border (#E5E7EB) to define edges without adding visual weight.
3.  **Level 2 (Active States/Dropdowns):** Elements that sit above the main surface use a highly diffused, low-opacity shadow (Color: #1A1C1E, Opacity: 6%, Blur: 12px, Y-Offset: 4px).

This approach creates a sense of "soft stacking," where the dashboard feels organized and layered rather than flat, guiding the user's eye to the most important interactive elements.

## Shapes

The shape language is defined by **Rounded** geometry to evoke a modern, approachable feel. 

Standard components like buttons, input fields, and small cards utilize a 0.5rem (8px) radius. Larger layout containers and primary dashboard cards use a 1rem (16px) radius to create a more distinct visual container. This consistent rounding softens the technical nature of the data-heavy dashboard and aligns with the friendly personality of the brand.

## Components

The design system components are built for clarity and rapid interaction.

- **Cards:** The primary container. Features a soft gray background, 16px corner radius, and a subtle bottom-heavy shadow. Headers within cards should have a thin divider to separate controls from content.
- **Buttons:** Primary buttons are vibrant orange with white text. Secondary buttons use a ghost style with the dark neutral color for text and borders.
- **Input Fields:** Polished with a 1px soft gray border that transitions to the primary orange on focus. Labels sit clearly above the input with a 4px gap.
- **Charts:** High-fidelity data visualizations. Use a palette of orange, slate, and teal for multi-series charts. Ensure lines have a 2px stroke width and data points have subtle tooltips on hover.
- **Chips/Badges:** Used for order status (e.g., "Pending", "Ready"). These should have a light background tint of their respective status color with high-contrast text.
- **Sidebar Nav:** High-contrast dark background with white icons. Active states are indicated by an orange vertical bar on the left edge and a slight opacity increase for the text.