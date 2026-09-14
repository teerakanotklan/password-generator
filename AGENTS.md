# Project Guidelines for AI Agents

## Overview
This repository (`password-generator`) is a **Next.js 16** web application written in **TypeScript** that provides a modern, feature‑rich password generation tool. The UI is built with **React**, **Tailwind CSS**, **shadcn/ui**, and a set of custom components. It allows users to:
- Generate multiple passwords with configurable length and character sets.
- Copy individual or all passwords to the clipboard.
- Download generated passwords as a text file.
- Toggle between light/dark themes.

The primary goal of the project is to deliver a **responsive, aesthetically premium** password manager that showcases best‑in‑class web design (glassmorphism, smooth micro‑animations, custom typography) while remaining fully functional.

---

## Tech Stack
| Layer | Technology / Library | Purpose |
|-------|----------------------|---------|
| **Framework** | **Next.js 16.2.6** | Server‑side rendering, routing, API routes, file‑system based routing (app directory) |
| **Language** | **TypeScript** (ts/tsx) | Static typing for robustness |
| **Styling** | **Tailwind CSS** (v4) + custom CSS | Utility‑first styling, dark mode, custom design tokens |
| **UI Components** | **shadcn/ui**, **@base-ui/react**, **lucide-react**, **tailwind‑merge**, **tw‑animate‑css** | Pre‑built accessible components and icons |
| **Form Management** | **react‑hook‑form**, **@hookform/resolvers**, **zod** | Validation schema and form handling |
| **State Management** | **React hooks** (custom `usePasswordGenerator`) | Core password generation logic |
| **Theming** | **next‑themes**, custom `ThemeProvider` | Light/Dark theme toggle |
| **Build Tools** | **pnpm**, **ESLint**, **TypeScript**, **PostCSS** | Dependency management, linting, transpilation |
| **Deployment** | **Vercel** (default) | One‑click deploy via `vercel.json` |

---

## Directory Structure (high‑level)
```
password-generator/
├─ .next/                 # Build output (generated)
├─ app/                   # Next.js app router pages
├─ components/            # UI components (forms, controls, displays)
│   ├─ generate-password-form.tsx
│   ├─ password-display-list.tsx
│   ├─ strength-meter.tsx
│   └─ …
├─ hooks/                 # Custom React hooks
│   └─ use-password-generator.tsx
├─ lib/                    # Utility libraries (e.g., password algorithms)
├─ public/                # Static assets (if any)
├─ styles/ (or global css) # Tailwind config / globals
├─ .gitignore
├─ package.json           # Dependencies & scripts
├─ tsconfig.json
├─ next.config.ts
├─ README.md               # Project description & dev instructions
└─ vercel.json            # Vercel deployment config
```

Key files:
- **[package.json](file:///d:/code/password-generator/package.json)** – lists dependencies, scripts (`dev`, `build`, `start`).
- **[README.md](file:///d:/code/password-generator/README.md)** – basic setup instructions.
- **[next.config.ts](file:///d:/code/password-generator/next.config.ts)** – Next.js configuration.
- **[hooks/use-password-generator.tsx](file:///d:/code/password-generator/hooks/use-password-generator.tsx)** – Core hook that generates passwords, handles copy/download, and exposes state.
- **[components/generate-password-form.tsx](file:///d:/code/password-generator/components/generate-password-form.tsx)** – UI for configuring generation options.

---

## Core Functionality
1. **Password Generation** – Implemented in `usePasswordGenerator` using configurable character sets and quantity.
2. **Copy & Download** – Provides `copySinglePassword`, `copyAllPasswords`, and `downloadAsTextFile` utilities.
3. **User Preferences** – Controls for length, quantity, character‑type toggles, and rule preferences.
4. **Theme Support** – `ThemeProvider` and `ThemeToggle` manage light/dark mode with smooth transitions.
5. **Accessibility & Animations** – Uses `tw-animate-css` for subtle micro‑animations and ShadCN components for accessible UI.

---

## Goals for Future AI Agents
- **Maintainability**: When modifying or extending the app, respect the existing component hierarchy (UI ↔ hooks ↔ lib). Add new components under `components/` and keep business logic in `hooks/` or `lib/`.
- **Design Consistency**: Follow the established Tailwind design tokens and animation utilities. Avoid introducing inline styles that break the premium visual language.
- **Performance**: Leverage Next.js's built‑in image optimization and server‑side rendering where appropriate. Keep bundle size low; prefer lazy‑loading heavy components.
- **Extensibility**: New password policies (e.g., exclude ambiguous characters) should be added to the generator logic inside the hook and exposed via the form controls.
- **Testing**: Ensure any changes are covered by unit tests (if present) and manually verify UI via `pnpm dev`.

---

## Build / Run Instructions
```bash
# Install dependencies
npm install   # or pnpm install (project uses pnpm)

# Development server
pnpm dev   # runs `next dev` (http://localhost:3000)

# Production build
pnpm build && pnpm start
```

Deploy to Vercel using the provided `vercel.json` configuration for a one‑click deployment.

---

## Quick Reference for AI Agents
- Use **`next dev`** for hot‑reloading during development.
- All UI components import Tailwind classes; follow the existing naming conventions.
- When adding new dependencies, update **`package.json`** and run `pnpm install`.
- Keep the `hooks/` directory focused on pure logic; UI stays in `components/`.

---

*End of Guidelines.*
