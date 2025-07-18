# Enhanced Typography Scale and Design System

## Font Stack with Cyrillic Support

### Primary Font Stack
```css
font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Alternative with Google Fonts (Cyrillic-optimized)
```css
font-family: 'Inter', 'Manrope', 'Source Sans Pro', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

## Typography Hierarchy

### Heading Styles
| Level | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing | Usage |
|-------|----------------|---------------|---------|-------------|----------------|--------|
| H1    | 72px (4.5rem)  | 48px (3rem)   | 700     | 1.1         | -0.04em        | Hero titles, main headings |
| H2    | 60px (3.75rem) | 40px (2.5rem) | 600     | 1.15        | -0.03em        | Section headings, page titles |
| H3    | 48px (3rem)    | 32px (2rem)   | 600     | 1.2         | -0.025em       | Subsection headings |
| H4    | 36px (2.25rem) | 24px (1.5rem) | 600     | 1.3         | -0.02em        | Card titles, component headings |
| H5    | 24px (1.5rem)  | 20px (1.25rem)| 600     | 1.4         | -0.015em       | Small section headings |
| H6    | 20px (1.25rem) | 18px (1.125rem)| 600    | 1.4         | -0.01em        | Minor headings, labels |

### Body Text Styles
| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|--------|
| Lead  | 24px (1.5rem) | 400 | 1.6 | -0.01em | Introduction paragraphs, hero descriptions |
| Body Large | 18px (1.125rem) | 400 | 1.7 | -0.005em | Important body text, descriptions |
| Body | 16px (1rem) | 400 | 1.6 | 0 | Standard body text, paragraphs |
| Body Small | 14px (0.875rem) | 400 | 1.5 | 0.005em | Secondary text, captions |
| Caption | 12px (0.75rem) | 500 | 1.4 | 0.05em | Labels, metadata, fine print |

### Display Text Styles
| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|--------|
| Display Large | 96px (6rem) | 700 | 1.0 | -0.05em | Marketing headlines, hero banners |
| Display Medium | 72px (4.5rem) | 700 | 1.0 | -0.04em | Large promotional text |
| Display Small | 60px (3.75rem) | 600 | 1.1 | -0.03em | Featured content headings |

## Color Palette for Typography

### Primary Text Colors
- **Primary**: `hsl(222, 47%, 11%)` - Main body text
- **Secondary**: `hsl(215, 16%, 47%)` - Supporting text
- **Muted**: `hsl(215, 16%, 65%)` - Placeholder text
- **Accent**: `hsl(262, 83%, 58%)` - Interactive elements

### Semantic Colors
- **Success**: `hsl(142, 76%, 36%)` - Success messages
- **Warning**: `hsl(38, 92%, 50%)` - Warning text
- **Error**: `hsl(0, 84%, 60%)` - Error messages
- **Info**: `hsl(262, 83%, 58%)` - Informational text

## Design Principles

### 1. Hierarchy & Contrast
- Clear visual hierarchy with consistent size scaling
- High contrast ratios for accessibility (minimum 4.5:1)
- Strategic use of weight to create emphasis

### 2. Readability
- Optimized line heights for reading comfort
- Appropriate letter spacing for different text sizes
- Responsive scaling for mobile devices

### 3. Brand Consistency
- Consistent use of Inter font family
- Harmonious color palette
- Unified spacing and sizing system

### 4. International Support
- Full Cyrillic character set support
- Proper Unicode handling
- Fallback fonts for edge cases

## Implementation Guidelines

### CSS Custom Properties
```css
:root {
  /* Font weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line heights */
  --line-height-tight: 1.1;
  --line-height-snug: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;
  --line-height-loose: 1.7;
  
  /* Letter spacing */
  --letter-spacing-tighter: -0.04em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
}
```

### Responsive Typography
- Mobile-first approach with progressive enhancement
- Fluid typography using clamp() for smooth scaling
- Consistent vertical rhythm across all devices

### Accessibility Considerations
- WCAG 2.1 AA compliant contrast ratios
- Proper semantic HTML structure
- Screen reader friendly text hierarchy
- Scalable text that maintains readability at 200% zoom

## Best Practices

1. **Consistent Spacing**: Use the 8px grid system for all typography spacing
2. **Semantic HTML**: Always use appropriate heading levels (h1-h6)
3. **Performance**: Preload critical fonts and use font-display: swap
4. **Internationalization**: Test with both Latin and Cyrillic text
5. **Accessibility**: Ensure sufficient color contrast and proper focus states

## Testing Checklist

- [ ] All text renders correctly in Cyrillic
- [ ] Contrast ratios meet WCAG standards
- [ ] Typography scales properly on mobile devices
- [ ] Font loading is optimized for performance
- [ ] Screen readers can navigate the content hierarchy
- [ ] Text remains readable at 200% zoom level
