# Simple Accessible Calculator

A lightweight, accessible calculator web application with comprehensive ARIA support, keyboard navigation, and theme switching.

## Features

- **Full Accessibility**: ARIA labels, live regions, focus indicators, screen reader support
- **Keyboard Navigation**: Complete keyboard support (0-9, operators, Enter, Escape, Backspace)
- **Theme Support**: Light/dark mode with system preference detection
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Performance**: Sub-15KB total size, optimized for fast loading
- **WCAG 2.1 AA**: All color combinations meet 4.5:1 contrast ratio

## Accessibility Features

| Feature | Implementation |
|---------|---------------|
| Screen Reader | `aria-live="polite"` on result display |
| Button Labels | `aria-label` on all buttons |
| Application Role | `role="application"` on calculator |
| Focus Indicators | `:focus-visible` with 2px outline |
| Reduced Motion | Media query disables animations |
| Tab Order | Natural DOM order follows grid flow |
| Contrast | All text meets WCAG AA 4.5:1 ratio |

## Running the App

```bash
npm install
npm run dev
```

The calculator runs as a standalone HTML file with embedded CSS and JavaScript for optimal performance.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 0-9 | Number input |
| . | Decimal point |
| + - * / | Operators |
| Enter or = | Calculate |
| Escape | Clear all |
| Backspace | Delete last character |
| % | Percentage |

## Performance Targets

- Lighthouse Accessibility: 95+
- Total HTML size: <15KB
- First Contentful Paint: <1s on 3G

## Browser Support

All modern browsers (Chrome, Firefox, Safari, Edge)