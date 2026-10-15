# KentRehber — Phase 0

Vertical-agnostic Turkish local-business directory foundation. Next.js **15.5.28**, strict TypeScript/RSC, Tailwind **4**, shadcn/ui, PostgreSQL **16**, Prisma **6.19.3**, Redis **7**/BullMQ, Meilisearch **v1.10**, Cloudflare R2/Images configuration, Better Auth **1.7.9**, pnpm workspaces, Docker Compose/Caddy and Vitest. Deployment target: Oracle Always Free ARM; nothing has been deployed.

## Setup

Install Node 22 LTS (24 is also supported), pnpm 10.28.2 and Docker Engine/Compose. From this directory:

```sh
pnpm install --frozen-lockfile
pnpm env:init
pnpm check:env
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --wait postgres redis meilisearch
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Run `pnpm worker` in another terminal. Open `http://localhost:3000`. The environment initializer generates random credentials and refuses to overwrite an existing `.env`. No seed data is supplied. Base Compose keeps services private; the dev override exposes ports on loopback only.

## Admin authentication

Better Auth is configured in `packages/auth/src/index.ts` using the officially maintained `prismaAdapter` from `better-auth/adapters/prisma`. `@better-auth/prisma-adapter` and `@better-auth/redis-storage` are installed explicitly. There is no custom database adapter or legacy authentication implementation.

Public sign-up is disabled. Create an internal operator using environment variables:

```powershell
$env:OPERATOR_EMAIL = 'operator@example.com'
$secure = Read-Host 'Operator password (14–128 characters)' -AsSecureString
$env:OPERATOR_PASSWORD = [System.Net.NetworkCredential]::new('', $secure).Password
pnpm operator:create
Remove-Item Env:OPERATOR_PASSWORD
```

The provisioning command uses Better Auth's own password hashing and creates a credential account. Visit **`/admin/login`**; the authenticated page is `/admin`; **`POST /admin/logout`** invalidates the session. The login form calls the native Better Auth `/api/auth/sign-in/email` endpoint. Redis enforces **five attempts per 900 seconds per IP**, including in development. The official Redis storage uses atomic increments. For local direct development all requests share the loopback bucket; production uses the private Caddy proxy's overwritten client-IP header.

No public signup or recovery endpoints are mounted. Only sign-in, sign-out, session and auth health endpoints are exposed. Session records are stored in PostgreSQL with Redis secondary storage; cookie caching is disabled. Every admin page checks the database's `disabled` flag, independently of cached session attributes.

## Database

The supplied Phase 0 schema covers verticals, scoped categories, cities, districts and Better Auth's user/session/account/verification models. The referenced master prompt was truncated, so no unseen listing/billing schema is claimed to be implemented.

| SQL file | Contents |
| --- | --- |
| `db/migrations/0001_init.sql` | Directory configuration and geography |
| `db/migrations/0002_better_auth.sql` | Separate Better Auth user, session, account and verification tables |
| `db/migrations/0003_config_integrity.sql` | Generic configuration/review and category integrity |

Each SQL file has an identical timestamped Prisma migration under `packages/db/prisma/migrations`; a Vitest check detects drift. Run `pnpm db:migrate`, which uses Prisma's migration history and locking. Do not also apply the SQL files manually to the same database. They are standalone review copies of the executable migrations.

Verticals are config rows. `is_adult` is an ordinary boolean; there are no category-specific exclusions, seeds or hardcoded sector lists. Categories and typed required fields are validated structurally. All configurations default to disabled, require a recorded review before activation, and lose that review when configuration changes. This generic lifecycle applies equally to every vertical. Public listing/search/registration/payment functionality is outside Phase 0.

## Full Compose stack

```sh
docker compose up -d --build
```

The stack uses `postgres:16-alpine`, `redis:7-alpine`, `getmeili/meilisearch:v1.10` (the publisher's image), and Caddy. Migrations finish before web/worker start. `https://localhost` uses Caddy's local CA; trust that CA on your development machine when testing HTTPS. For a real domain set `DOCKER_APP_URL`, `CADDY_ADDRESS`, and `BIND_IP=0.0.0.0`. See `docs/OPERATIONS.md` for Oracle ARM, Cloudflare and backups.

To provision an operator in Compose, export the two operator environment variables and run `docker compose run --rm -e OPERATOR_EMAIL -e OPERATOR_PASSWORD migrate pnpm operator:create`.

## Checks

```sh
pnpm check:env
pnpm db:generate
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

With the dependency services and worker running, migrations applied, and the web app on port 3000:

```sh
pnpm test:integration
pnpm test:http
```

Integration creates uniquely named temporary database rows and deletes them. Use a test database and a fresh Redis auth namespace; the test intentionally exhausts the local IP rate limit. It checks actual PostgreSQL constraints, Redis, Meilisearch, BullMQ cleanup, HTTP sign-in/sign-out, disabled accounts, the five-attempt limit and readiness. HTTP smoke can run with dependencies offline, provided environment values are valid.

`.github/workflows/checks.yml` defines Linux checks and a container build. No GitHub remote is configured and no remote CI run is claimed. `VERIFICATION.md` records the actual local results.

## Implemented boundaries

Turkish server-rendered pages, accessible sign-in UI, shadcn/ui source components, secure session handling, per-request nonce CSP, origin checks, private health reporting, a real cleanup worker, and authenticated cloud health probes are implemented. There are no fake businesses or fabricated service results. Cloud media is explicitly disabled until credentials are set. Phase 0 HTML is `noindex` and private/no-store; metadata, semantic markup and Turkish language are ready for future SEO pages.

Official references: [Better Auth Prisma adapter](https://better-auth.com/docs/adapters/prisma), [Redis storage](https://better-auth.com/docs/concepts/database), [rate limits](https://better-auth.com/docs/concepts/rate-limit), [Tailwind PostCSS](https://tailwindcss.com/docs/installation/using-postcss).

## Theme layer

Phase 1.5 adds shared theme primitives and visual page shells. See [THEMING.md](THEMING.md) for configuration, migrations, file locations and verification limits.


## Phase 2.1 — Business categories and image editing

The authenticated `/admin` dashboard manages the catalog headline, hero image and up to six feature cards. `/admin/categories` creates and removes ordinary business categories; saved categories are displayed on the storefront.

The image editor uploads JPG, PNG or WebP through `POST /api/admin/media` when Cloudflare Images is configured. To enable uploads, set `CF_IMAGES_UPLOAD_ENABLED=true` and add `CF_IMAGES_ACCOUNT_ID`, `CF_IMAGES_API_TOKEN` (Images Write permission), and `CF_IMAGES_ACCOUNT_HASH` securely on the application server. The existing `MEDIA_ENABLED` switch remains independent and may stay `false`.

Uploads are limited to 4 MiB due to Vercel Functions' 4.5 MB request-body limit. A successful upload fills the image URL field; the operator must then save the catalog. Unpublished changes remain private. The new editor is limited to ordinary business verticals.

Dynamic rendering means published changes appear on the **next page request**, not as an automatic update of already-open browser tabs. No cloud media upload or live database migration is claimed to have run. Before production, configure PostgreSQL, Redis and other service secrets, run `pnpm db:migrate`, and verify access controls and uploads.
