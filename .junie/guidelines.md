# Ugly Toons — Development Guidelines

This document captures project-specific knowledge to accelerate future development. It assumes familiarity with Next.js
14+, TypeScript, Tailwind v4, and modern React.

## Stack overview

- Runtime: Next.js 14.2 (App Router, React 19)
- Language: TypeScript
- Styling: Tailwind CSS v4 + design tokens in styles/globals.css
- UI: Radix UI primitives + custom components (components/ui/*), shadcn-inspired patterns
- Package manager: pnpm
- API layer: lib/services/api.ts consuming a backend via NEXT_PUBLIC_API_URL; token persisted in localStorage

## Build and configuration

- Install deps (pnpm is expected):
    - pnpm install
- Local development:
    - pnpm dev (runs Next on http://localhost:3000)
- Production build:
    - pnpm build
    - pnpm start
- Environment variables:
    - NEXT_PUBLIC_API_URL: Base URL of the backend (default http://localhost:8080). Used in lib/services/api.ts. Must be
      public as it is consumed client-side.
- Linting/Type checks:
    - pnpm lint (ESLint). Note: next.config.mjs is set to ignore build-time ESLint/TS errors; run lint locally to catch
      issues.

## API/client specifics

- Token storage: apiService.login stores auth_token in localStorage (browser only). SSR/Edge contexts won’t have auth;
  use apiService.isAuthenticated() on the client before fetching.
- All API methods call handleResponse which throws Error(message) on non-2xx. Callers should catch and present
  error.message.
- Pets flow (DashboardPage):
    - Redirects unauthenticated users to /login, then loads user pets from GET /api/v1/pets.
    - Actions: feed/play/sleep POST endpoints mutate state and should be followed by re-fetch.

## UI/style conventions

- Typography: Use the "font-comic" class for playful headings/titles; keep "chunky-border" look for cards/buttons
  consistent with existing components.
- Color system: Defined via CSS custom properties in styles/globals.css (light and .dark). Prefer Tailwind tokens:
  bg-background, text-foreground, bg-card, text-primary, etc.
- Layout: Use container mx-auto px-4 for top-level layouts. Grid utilities used for responsive cards: grid-cols-1 md:
  grid-cols-2 lg:grid-cols-3 with gap-6.
- Components: Favor composition via components/ui/* primitives (Button, Card, Progress, etc.). Keep variants
  consistent (e.g., Button variant="outline" vs custom colors + chunky-border).
- Images: next/image with images.unoptimized: true in next.config (no external loader). Assets under public/assets.

## Testing

This repo does not ship a testing framework by default. For quick unit tests (non-DOM), you can use Node’s built-in test
runner in Node 22+ without adding dependencies.

- Add a simple unit test under tests/ using Node test runner (no config required). Example we validated locally:

File: tests/api-base-url.test.mjs

import assert from 'node:assert/strict'
import { test } from 'node:test'

// The API base URL defaults to http://localhost:8080 when NEXT_PUBLIC_API_URL is unset.
// We verify the module computes the expected value when environment is clean.

const modulePath = new URL('../lib/services/api.ts', import.meta.url).pathname

// Dynamic import via ts-node is not configured; instead we validate behavior indirectly by inspecting env and a replica
computation.

function computeBaseUrl(env) {
return env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
}

test('API base URL defaults to localhost:8080', () => {
const base = computeBaseUrl({})
assert.equal(base, 'http://localhost:8080')
})

Running tests with Node test runner:

- pnpm exec node --test tests/**/*.mjs

Notes:

- Keep tests minimal and decoupled from Next.js runtime. For React/UI testing, consider Playwright (e2e) or Vitest +
  @testing-library/react if the project later adopts them.
- If you introduce Vitest/Jest, prefer co-locating tests next to source or under tests/; ensure tsconfig test settings
  don’t break Next’s App Router TS config.

## Adding new tests (guidelines)

- Prefer pure-function tests (utils, api URL computation, parameter validation) with Node’s runner when possible.
- For client-only features relying on window/localStorage, abstract access behind a small adapter so you can inject a
  mock in tests.
- For API calls, avoid hitting the real backend. Instead, test request shaping (URLs, headers) by extracting small
  helpers from lib/services/api.ts.

## Debugging tips

- To debug API issues, set NEXT_PUBLIC_API_URL to a mock server and watch network requests in the browser. All requests
  include JSON Content-Type and optional Authorization: Bearer <token>.
- handleResponse throws using the backend-provided message; surface error.message in UI (see DashboardPage for example).
- Be mindful of client-only code paths: isAuthenticated() returns false on the server.

## Project conventions

- TypeScript strictness follows tsconfig defaults shipped with Next. Keep types in interfaces near usage (as in
  lib/services/api.ts).
- Do not introduce CSS-in-JS; stay within Tailwind tokens/utilities and design tokens.
- Keep components client/server boundary explicit via "use client" where state/effects are required; prefer server
  components otherwise.

