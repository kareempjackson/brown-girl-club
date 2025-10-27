# Brown Girl Club – Brand Guide & UI Kit

A production-ready editorial design system inspired by WatchHouse. Built with Next.js 15, Tailwind v4, and Framer Motion.

## Design Principles

- **Editorial minimalism** with generous white space
- **Quiet luxury**: warm neutrals, thin rules, subtle elevation
- **Type-first layout** with restrained color accents
- **Mobile-first** responsive design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (using `@theme` tokens, no config file)
- **Animations**: Framer Motion for micro-interactions
- **Typography**: Mailendra (display serif) + Frank Ruhl Libre (sans)
- **Type Safety**: TypeScript

## Brand System

### Colors

- **Espresso** (#4B2E22) — Accent for CTAs and emphasis
- **Porcelain** (#F2E4D2) — Warm surface backgrounds
- **Oat** (#D9BE8A) — Secondary accent
- **Ink** (#292929) — Primary text
- **White** (#FFFFFF) — Base background

### Typography Scale

- Display: 3.40rem → 0.78rem
- Line heights optimized for readability
- Semantic helpers: `.kicker`, `.lead`, `.text-serif`

### Elevation

- **Soft shadow**: Subtle ambient for cards
- **Elevated shadow**: Medium depth for interactive elements

## Pages

### `/` – Home

Editorial landing page introducing the design system

### `/brand-guide` – Identity System

Complete brand documentation including:
- Color system with usage guidelines
- Typography specimens and hierarchy
- Elevation and surface examples
- Tone and voice principles

### `/components` – UI Kit

Interactive component catalog featuring:
- Buttons (primary, secondary, ghost, link)
- Badges (ink, oat, espresso tones)
- Inputs with accessibility features
- Alerts (ok, warn, error)
- Stats with display serif
- Plan cards with featured styling
- Wallet CTA composite

### `/join` – Example Page

Real-world implementation showing:
- Hero section with dual CTAs
- Plan card grid with featured option
- Social proof statistics
- Mobile-first responsive layout

## Components

All components are located in `src/components/ui/`:

### Primitives

- `button.tsx` — 4 variants with hover/tap micro-animations
- `badge.tsx` — Compact pill with 3 tone options
- `card.tsx` — Container with optional surface styling
- `input.tsx` — Accessible form input with labels and focus states
- `alert.tsx` — Inline notifications with semantic tones
- `stat.tsx` — Numeric display with serif styling

### Composites

- `plan-card.tsx` — Pricing card with perks list and featured state
- `cta-wallet.tsx` — Dual-action wallet integration callout

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Accessibility

- WCAG AA color contrast ratios
- Visible focus indicators on all interactive elements
- Semantic HTML structure
- Proper heading hierarchy
- Keyboard navigation support
- Reduced motion support via `prefers-reduced-motion`

## Font Files

Custom fonts are located in `/public/fonts/`:
- `mailendra-regular.otf` — Display serif for headlines
- `FrankRuhlLibre-Bold.ttf` — Primary sans for UI and body

## Tailwind v4 Tokens

All design tokens are centralized in `src/app/globals.css` using `@theme inline`. No `tailwind.config` file needed.

Tokens include:
- Color palette and semantic mappings
- Font family declarations
- Typography scale (xs → 5xl)
- Border radius (sm, md, lg)
- Box shadows (soft, elev)

## Voice & Tone

- Understated confidence. No hype.
- Lead with benefits, not features.
- Short sentences. Clear value.
- Ritual over technology.

## Project Structure

```
brown-girl-club/
├── public/
│   └── fonts/                # Custom typefaces
├── src/
│   ├── app/
│   │   ├── brand-guide/      # Identity system page
│   │   ├── components/       # UI kit catalog
│   │   ├── join/             # Example implementation
│   │   ├── globals.css       # Tokens and base styles
│   │   ├── layout.tsx        # Root layout with nav/footer
│   │   └── page.tsx          # Home page
│   └── components/
│       └── ui/               # Reusable components
└── README.md
```

## Performance

- Font files use `font-display: swap` for optimal loading
- Minimal CSS footprint with Tailwind v4
- Framer Motion with reduced-motion safety
- Optimized component structure
- No external UI libraries

## License

Private project. All rights reserved.

---

**Built with quiet confidence.**
