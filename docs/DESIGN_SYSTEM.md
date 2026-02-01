# Design System Documentation

## Overview

The Eva People Ops design system provides a centralized set of design tokens that ensure visual consistency across the application. All colors, spacing, typography, and other design decisions are defined in `src/design-system.ts` and implemented via CSS custom properties in `src/global.css`.

## Philosophy

**Never hardcode design values.** Always reference the design system tokens.

```tsx
// ❌ Bad
<div style={{ color: '#4f39f6', padding: '16px' }}>

// ✅ Good
import { colors, spacing } from '../design-system';
<div style={{ color: colors.brand.primary, padding: spacing.md }}>
```

---

## Colors

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `colors.brand.primary` | `#4f39f6` | Primary brand color (buttons, links) |
| `colors.brand.primaryLight` | `#6366f1` | Hover states |
| `colors.brand.primaryDark` | `#4338ca` | Active states |

### Node Type Colors

Each node type has a dedicated color:

| Node Type | Token | Value | Visual |
|-----------|-------|-------|--------|
| Trigger | `colors.nodes.trigger` | `#ff5a1f` | 🟠 Orange |
| Journey | `colors.nodes.journey` | `#4f39f6` | 🟣 Indigo |
| Decision | `colors.nodes.decision` | `#8b5cf6` | 🟪 Purple |
| Tag Manager | `colors.nodes.tagManager` | `#10b981` | 🟢 Emerald |
| Delay | `colors.nodes.delay` | `#f59e0b` | 🟡 Amber |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `colors.semantic.success` | `#10b981` | Success messages, completed states |
| `colors.semantic.warning` | `#f59e0b` | Warnings, pending actions |
| `colors.semantic.error` | `#ef4444` | Errors, destructive actions |
| `colors.semantic.info` | `#3b82f6` | Informational messages |

### Neutral Scale

| Token | Value | Usage |
|-------|-------|-------|
| `colors.neutral.white` | `#ffffff` | Pure white backgrounds |
| `colors.neutral.slate50` | `#f8fafc` | Canvas background |
| `colors.neutral.slate100` | `#f1f5f9` | Card backgrounds |
| `colors.neutral.slate200` | `#e2e8f0` | Borders |
| `colors.neutral.slate400` | `#94a3b8` | Muted text |
| `colors.neutral.slate900` | `#0f172a` | Primary text |
| `colors.neutral.black` | `#000000` | Pure black |

---

## Spacing

Based on a **4px base unit**:

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `spacing.xs` | `0.25rem` | 4px | Tight spacing |
| `spacing.sm` | `0.5rem` | 8px | Small gaps |
| `spacing.md` | `1rem` | 16px | Default spacing |
| `spacing.lg` | `1.5rem` | 24px | Section spacing |
| `spacing.xl` | `2rem` | 32px | Large spacing |
| `spacing.2xl` | `3rem` | 48px | Extra large |
| `spacing.3xl` | `4rem` | 64px | Massive spacing |

### Usage Example

```tsx
<div style={{
  padding: spacing.lg,     // 24px
  marginBottom: spacing.xl // 32px
}}>
```

---

## Typography

### Font Families

```typescript
typography.fontFamily.sans  // System fonts (UI)
typography.fontFamily.mono  // Monospace (code, IDs)
```

### Font Sizes

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `typography.fontSize.xs` | `0.625rem` | 10px | Labels, metadata |
| `typography.fontSize.sm` | `0.75rem` | 12px | Small text |
| `typography.fontSize.base` | `0.875rem` | 14px | Body text |
| `typography.fontSize.lg` | `1rem` | 16px | Large body |
| `typography.fontSize.xl` | `1.25rem` | 20px | Subheadings |
| `typography.fontSize.2xl` | `1.5rem` | 24px | Headings |
| `typography.fontSize.3xl` | `2rem` | 32px | Large headings |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `typography.fontWeight.normal` | 400 | Body text |
| `typography.fontWeight.medium` | 500 | Slightly emphasized |
| `typography.fontWeight.semibold` | 600 | Subheadings |
| `typography.fontWeight.bold` | 700 | Headings |
| `typography.fontWeight.black` | 900 | Ultra bold (hero text) |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `typography.letterSpacing.tight` | `-0.025em` | Large headings |
| `typography.letterSpacing.normal` | `0` | Body text |
| `typography.letterSpacing.wide` | `0.025em` | Buttons |
| `typography.letterSpacing.wider` | `0.05em` | Labels |
| `typography.letterSpacing.widest` | `0.2em` | Uppercase labels |

---

## Border Radius

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `borderRadius.sm` | `0.5rem` | 8px | Small elements |
| `borderRadius.md` | `1rem` | 16px | Buttons, inputs |
| `borderRadius.lg` | `1.5rem` | 24px | Cards |
| `borderRadius.xl` | `2rem` | 32px | Large cards |
| `borderRadius.2xl` | `2.5rem` | 40px | Containers |
| `borderRadius.3xl` | `3rem` | 48px | Major containers |
| `borderRadius.full` | `9999px` | ∞ | Circles, pills |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadows.sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle depth |
| `shadows.md` | `0 4px 6px rgba(0,0,0,0.1)` | Buttons, inputs |
| `shadows.lg` | `0 10px 15px rgba(0,0,0,0.1)` | Cards |
| `shadows.xl` | `0 20px 25px rgba(0,0,0,0.1)` | Modals |
| `shadows.2xl` | `0 25px 50px rgba(0,0,0,0.25)` | Popovers |
| `shadows.premium` | Custom purple glow | Brand emphasis |

---

## Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `transitions.fast` | `150ms ease-in-out` | Hover effects |
| `transitions.base` | `300ms ease-in-out` | Default animations |
| `transitions.slow` | `500ms ease-in-out` | Complex transitions |

---

## Component Tokens

### Node Dimensions

```typescript
components.node.width.trigger      // 280px
components.node.width.journey      // 260px
components.node.width.decision     // 300px
components.node.width.tagManager   // 240px
components.node.width.delay        // 220px
```

### Buttons

```typescript
components.button.height.sm        // 2rem (32px)
components.button.height.md        // 2.5rem (40px)
components.button.height.lg        // 3rem (48px)
```

---

## Usage in Components

### Option 1: Import Tokens

```tsx
import { colors, spacing, typography } from '../design-system';

export const MyComponent = () => (
  <div style={{
    backgroundColor: colors.neutral.slate50,
    padding: spacing.lg,
    fontSize: typography.fontSize.base,
    color: colors.neutral.slate900
  }}>
    Content
  </div>
);
```

### Option 2: CSS Custom Properties

In `global.css`, tokens are already defined as CSS variables:

```css
:root {
  --color-brand-primary: #4f39f6;
  --spacing-md: 1rem;
  --font-size-base: 0.875rem;
}
```

Use in CSS:

```css
.my-component {
  background-color: var(--color-slate-50);
  padding: var(--spacing-lg);
  font-size: var(--font-size-base);
}
```

---

## Utility Functions

### Get Node Color

```typescript
import { getNodeColor } from '../design-system';

const color = getNodeColor('trigger'); // Returns '#ff5a1f'
```

### Get Status Color

```typescript
import { getStatusColor } from '../design-system';

const color = getStatusColor('active'); // Returns '#10b981'
```

---

## Best Practices

### ✅ Do

- Reference design system tokens
- Use semantic naming
- Maintain consistency
- Update tokens centrally

### ❌ Don't

- Hardcode colors or spacing
- Use arbitrary values
- Create one-off styles
- Override tokens locally

---

## Extending the Design System

### Adding a New Color

1. Add to `src/design-system.ts`:
   ```typescript
   colors: {
     // ...existing
     custom: {
       newColor: '#abc123'
     }
   }
   ```

2. Add CSS custom property in `global.css`:
   ```css
   :root {
     --color-custom-new: #abc123;
   }
   ```

3. Document in this file

### Adding a New Token Category

Follow the same pattern as existing categories:
- Define in TypeScript
- Export from design system
- Add CSS variables
- Document here

---

## Resources

- **Design System File**: `src/design-system.ts`
- **CSS Implementation**: `src/global.css`
- **Component Examples**: `src/components/nodes/`

---

**Last Updated**: 2026-02-01  
**Maintained By**: Hugo Soares Nascimento
