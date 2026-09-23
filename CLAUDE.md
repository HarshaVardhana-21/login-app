# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # tsc -b (project references) then vite build
npm run lint      # oxlint
npm run preview   # preview the production build
npm test          # run Vitest once
npm run test:watch                      # Vitest in watch mode
npx vitest run src/hooks/useForm.test.ts  # run a single test file
```

## Testing

Vitest + React Testing Library, configured in the `test` block of `vite.config.ts` (jsdom environment, setup in `src/test/setup.ts` which registers `jest-dom` matchers). Test files live next to their source as `*.test.ts(x)` and are type-checked by `npm run build`, so they must satisfy the strict tsconfig.

Component tests mock `authService` with `vi.mock` to skip its 1s mock latency; `authService.test.ts` itself uses fake timers.

## Architecture

React 19 + TypeScript + Vite SPA implementing a login/register auth UI, with Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config.js` — configured through CSS in `src/index.css`) and `react-router` v8 for client-side routing.

**Routing**: `src/App.tsx` defines two routes (`ROUTES.LOGIN`, `ROUTES.REGISTER` from `src/constants/routes.ts`), with all unknown paths redirecting to login.

**Feature-first structure**: auth logic lives under `src/features/auth/`, separate from generic UI:
- `services/authService.ts` — mock `login`/`register` async functions simulating network latency and known failure cases (wrong password, taken email `taken@example.com`). These are the seams to replace with real API calls.
- `hooks/useLoginForm.ts`, `hooks/useRegisterForm.ts` — wire form config (initial values, validation, submit handler) into the generic `useForm` hook.
- `utils/validation.ts` — pure validators returning `FormErrors<T>` objects (field name → error message or `undefined`).
- `types.ts` — shared auth types (`LoginCredentials`, `RegisterData`, `AuthUser`, `AuthResponse`, `LoginLocationState`).
- `components/LoginForm.tsx`, `components/RegisterForm.tsx` — form markup composed from `components/ui/*` primitives, driven entirely by the hooks above.

**Generic form engine**: `src/hooks/useForm.ts` is a reusable hook (not auth-specific) that manages `values`/`errors`/`submitError`/`isSubmitting`, runs a `validate` function on submit, and calls an async `onSubmit`. Both login and register forms are thin configurations of this hook — new forms should follow the same pattern rather than hand-rolling state.

**UI primitives** (`src/components/ui/`): `Button`, `Input`, `PasswordInput` (wraps `Input` with a show/hide toggle), `Checkbox`, `Alert` (error/success variants), `Spinner`, `ThemeToggle`. `AuthLayout` (`src/components/layout/`) provides the shared card/gradient page chrome and renders `ThemeToggle` for both auth pages.

**Pages** (`src/pages/`) compose `AuthLayout` + the feature form components and own page-level state/navigation (e.g. `LoginPage` reads `registeredEmail` from router location state after a successful registration redirect; `RegisterPage` navigates to login with that state on success).

**Theming**: dark mode uses Tailwind v4's class-based variant, declared in `src/index.css` via `@custom-variant dark (&:where(.dark, .dark *))`. `src/hooks/useTheme.ts` toggles the `dark` class on `<html>` and persists the choice to `localStorage` (`theme` key), falling back to `prefers-color-scheme`. `index.html` has an inline script that applies the class before React mounts to avoid a flash of the wrong theme. Any new UI must be styled with `dark:` variants alongside light styles, not added separately later.
