# Phase 1.5 — Theme layer

The active configuration is selected with `DEPLOY_VERTICAL`. The root layout reads only its `theme` JSON, validates it, and injects CSS variables on `<html>`. Shared components consume those variables; density and hero treatment use root data attributes. There are no slug-specific rendering branches.

## Files

- `packages/config/src/theme.ts`: strict Zod input schema, normalization and CSS variable mapping.
- `packages/ui`: Button, Input, Textarea, Select, Card, Badge, Pill, Avatar, Dialog, Tabs, Toast, Skeleton, EmptyState, Breadcrumbs, Pagination and ImageFrame; ThemeProvider and useTheme.
- `apps/web/src/lib/theme.ts`: request-cached database lookup and fallback.
- `apps/web/src/app/layout.tsx`: root variable injection and shared header/footer.
- `apps/web/src/app/(public)`: home, city, district, listing-detail and search visual shells. Route groups do not change public URLs.
- `apps/web/src/app/18`: configurable entry confirmation with a server action and a 30-day httpOnly cookie scoped by configuration slug.
- `apps/web/src/app/ilkeler`: generic preview policy page.
- `db/migrations/20261015000400_vertical_theme.sql`: JSON column and requested backfill.
- `db/migrations/20261015000500_seed_themes.sql`: restoran and wellness reference configurations.
- `packages/db/prisma/migrations`: identical timestamped copies consumed by Prisma.

## Configuration

Apply the migrations using `pnpm db:migrate` after PostgreSQL is running. New reference rows use the existing schema defaults and standard moderation. Existing rows receive a reference theme only if their theme is empty; custom themes and other existing configuration are preserved.

The input schema requires complete theme objects. Empty, missing or invalid objects fall back to defaults; database unavailability also uses the default theme so the visual shells remain renderable. This fallback is not an authorization mechanism. Default palette literals live in `globals.css`; reference palette literals live in SQL data. Component and page code contains no color literals.

Font names are CSS font-family values with system fallbacks. This phase does not download fonts or call an external font service. `visibleFields` is validated as a unique list of field keys; actual field values are not wired. Search controls are visibly disabled. No listing data, search backend, new database model or API route is added.

## Verification — 2026-10-15

- `pnpm typecheck`: passed, including regenerated Prisma client and web types.
- `pnpm lint`: passed with zero warnings.
- `pnpm build`: passed, Next.js 15 production compilation and route generation.
- `pnpm test`: passed, 35 tests across five files; includes reference theme validation, invalid-input fallback, CSS injection rejection and migration-copy equality.
- `pnpm test:http`: passed against the local production build; includes the new page shells, root variables and disabled entry-gate redirect.
- Browser: default home theme visually inspected at localhost.

Commands were invoked with `npx --yes pnpm@10.28.2` on Windows. PostgreSQL was unavailable: migrations were not applied and live theme switching and enabled entry-gate behavior were not integration-tested. No deployment was performed.
