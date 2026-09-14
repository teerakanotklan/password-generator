<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project Tech Stack & Architecture Memory

## Application Overview

- **Product**: VaultPass — Cryptographically Secure Local Password Generator
- **Privacy Model**: 100% Client-Side generation via native Web Crypto API (`window.crypto.getRandomValues`). Zero server transmission.
- **Layout Model**: Responsive 2-column desktop partition (max-height 690px with internal Base UI `ScrollArea` for passwords), borderless clean left panel containing interactive card-item password rows, settings Card container on the right, and mobile segmented tab bar placed at the very top for instant switching between passwords and settings.

## Core Framework & Runtime

- **Framework**: Next.js 16.2.6 (App Router, Turbopack)
- **Runtime / UI Library**: React 19.2.4 & React DOM 19.2.4
- **Language**: TypeScript 5.x
- **Package Manager**: pnpm

## Styling & Design System

- **CSS Framework**: Tailwind CSS v4 (`@tailwindcss/postcss`, `tailwindcss`, `tw-animate-css`)
- **Component System**: shadcn/ui (`style: base-vega`, `baseColor: neutral`)
- **Primitive Components**: Base UI (`@base-ui/react` v1.5.0 — Slider, ScrollArea)
- **Icons**: Lucide React (`lucide-react`)
- **Theming**: `next-themes` (Dark, Light, System themes supported via `ThemeProvider` and `ThemeToggle`)
- **Class Utilities**: `clsx`, `tailwind-merge` (`cn` helper in `lib/utils.ts`)

## Form Management & Validation

- **Form State**: `react-hook-form` (v7.76.x)
- **Schema Validation**: `zod` (v4.4.x)
- **Resolvers**: `@hookform/resolvers/zod`
- **Form Persistence**: Custom hook `useFormPersistence` reading/writing to browser `localStorage` under key `password-generator-settings` (when the `save` preference toggle is active).

## Core Cryptography & Algorithm Logic (`lib/password/`)

- `lib/utils.ts`: Tailwind class merging (`cn`).
- `lib/password/constants.ts`: Character sets (`CHAR_SETS`) and ambiguous character filters (`SIMILAR_CHAR_SET`).
- `lib/password/types.ts`: Type definitions (`GeneratePasswordResult`, `PasswordStrength`, `CharType`).
- `lib/password/generator.ts`: Cryptographic RNG via Web Crypto rejection sampling (`getSecureRandomInt`), Fisher–Yates shuffle, character pool guarantees, and password generation (`generateSecurePassword`, `generatePassword`).
- `lib/password/strength.ts`: Entropy and crack-time calculations (`calculatePasswordStrength`), character syntax classification (`getCharType`).
- **RNG**: Native `crypto.getRandomValues(new Uint32Array(1))`
- **Bias Elimination**: Rejection sampling (`limit = Math.floor(0x100000000 / max) * max`) to remove modulo bias.
- **Generation Flow**:
  1. Guarantees at least 1 character from each enabled character pool.
  2. Fills remaining characters up to length using cryptographically secure random selection.
  3. Applies Fisher–Yates shuffle using `getSecureRandomInt`.
  4. Enforces leading letter constraint if `beginWithLetter` rule is enabled.
  5. Enforces unique character constraints if `excludeDuplicate` rule is enabled.
- **Character Pools**:
  - Uppercase: `A-Z`
  - Lowercase: `a-z`
  - Numbers: `0-9`
  - Symbols: `@#`
  - Ambiguous / Similar filter: `i, I, l, 1, o, O, 0, S, 5, B, 8`
- **Password Strength & Entropy**:
  - Shannon Entropy: $E = \text{length} \times \log_2(\text{poolSize})$ bits.
  - Cracking estimate: Offline modern GPU benchmark at $10^{10}$ guesses/sec.
  - Scores 0–4 (Very Weak, Weak, Fair, Strong, Very Strong) with color-coded UI badges.

## Component Structure & Responsibilities

- `app/layout.tsx`: Root HTML shell, fonts (Inter & Geist Mono), sticky header with `ThemeToggle`, footer with privacy badge, `ThemeProvider`.
- `app/page.tsx`: Main page container wrapping `GeneratePasswordForm`.
- `app/loading.tsx`: Server navigation loading state rendering `PasswordGeneratorSkeleton`.
- `components/generate-password-form.tsx`: Primary orchestrator combining form state, debounced generation, copy/download actions, error display, mobile Hero Card with tap-to-copy, mobile segmented tab view switcher, and responsive column layouts.
- `components/password-display-list.tsx`: Scrollable list rendering passwords with per-character syntax highlighting (numbers in blue, symbols in bold amber), touch-friendly click-to-copy, persistent copy feedback on mobile, and status feedback.
- `components/strength-meter.tsx`: 4-segment visual strength bar, Shannon entropy (bits), crack-time estimate, and character pool indicator tags.
- `components/password-length-control.tsx`: Slider, number input (4–64 characters), and quick preset chips (`12`, `16`, `20`, `24`, `32`) for mobile touch speed.
- `components/password-quantity-control.tsx`: Slider, number input for batch generation (1–500 passwords), and quick preset chips (`1`, `5`, `10`, `25`, `50`).
- `components/character-types-control.tsx`: Checkbox toggles for Uppercase, Lowercase, Numbers, and Symbols.
- `components/rules-preferences-control.tsx`: Checkbox toggles for Start with a Letter, Disallow Duplicates, Avoid Ambiguous Characters, and Save Preferences.
- `components/password-generator-skeleton.tsx`: Borderless hydration skeleton matching exact layout and mobile hero card to prevent layout shift.
- `components/theme-provider.tsx` & `components/theme-toggle.tsx`: Dark/Light theme switching integration.
- `components/ui/*`: shadcn/ui components (`button`, `card`, `checkbox`, `input`, `scroll-area`, `slider`, `skeleton`, etc.).

## Hooks (`hooks/`)

- `hooks/use-password-generator.tsx`: Encapsulates password array state, generation trigger, copy single, copy next (sequential cyclic copy), copy all, and `.txt` file export.
- `hooks/use-form-persistence.tsx`: Subscribes to form changes and syncs settings to `localStorage` when `save` option is present.

## Development & Build Commands

- Dev server: `pnpm dev`
- Production build: `pnpm build`
- Linter: `pnpm lint`
