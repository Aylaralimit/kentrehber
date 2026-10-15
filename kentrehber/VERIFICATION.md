# Phase 0 verification — 2026-10-15

Executed locally on Windows with Node 24.16.0 and pnpm 10.28.2.

| Command/check | Actual result |
| --- | --- |
| `pnpm install --frozen-lockfile --offline` | Passed after final dependency resolution |
| `pnpm check:env` | Passed with generated local credentials and media disabled |
| `pnpm db:generate` | Passed, Prisma Client 6.19.3 generated |
| `pnpm exec prisma validate --schema packages/db/prisma/schema.prisma` | Passed |
| `pnpm typecheck` | Passed for shared packages, scripts, worker and Next.js |
| `pnpm lint` | Passed with zero warnings |
| `pnpm test` | Passed: 4 test files, 29 tests, Vitest 4.1.11 |
| `pnpm build` | Passed: Next.js 15.5.28 production compilation, type validation, page generation and build traces |
| `pnpm audit --prod --json` | Zero reported advisories at verification time |
| `pnpm start` and `pnpm test:http` | Passed against the compiled local app; local development environment used for HTTP smoke |
| Browser inspection | Turkish landing page rendered; admin link redirected to the labeled login form |

The initial standalone packaging attempt failed on Windows symlink permissions. The final configuration uses the standard Next.js output served by `next start`, matching the Docker runtime, and the full build subsequently passed. The final dependency graph pins patched PostCSS/deepmerge-ts and uses Vitest 4.1.11. Prisma CLI/client are colocated in the database workspace; no authentication adapter workaround exists.

HTTP checks exercised Turkish HTML, CSP nonce, no-store, security headers, noindex/robots, protected admin redirect, CSRF rejection, unauthorized readiness rejection, authenticated dependency-status response shape, and 404s for unimplemented discovery routes. They did not authenticate a real account because the database/cache services were unavailable. Next emits a NODE_ENV warning when a compiled app is smoke-tested with the development `.env`; production Compose sets production mode and HTTPS explicitly.

## Not executed or not available

- Docker is not installed in this execution environment. `docker compose build/up`, PostgreSQL migration application, Redis/BullMQ execution, Meilisearch connectivity and `pnpm test:integration` were **not run**. The integration suite and CI workflow are provided, not claimed as passing.
- The SQL files were generated/validated against the Prisma schema and checked for byte-identical timestamped migration copies. Database CHECK/trigger behavior still requires running the integration suite on PostgreSQL 16.
- No Cloudflare R2/Images credentials were supplied. Their clients and authenticated probes are implemented; live cloud connectivity is unverified. CDN/WAF and trusted-proxy settings remain deployment operations.
- Oracle ARM build/runtime, real-domain TLS, backups/restores and production deployment are unverified. No deployment was performed.
- No authorized GitHub repository was provided. The local Git repository has no remote; no push, PR or remote CI execution occurred.
- The available master prompt stops before a complete schema/layout. The implemented schema contains only the Phase 0 configuration, geography and authentication models documented in README, not an unseen later-phase schema.

## Integration verification on a Docker-enabled machine

```sh
pnpm install --frozen-lockfile
pnpm env:init
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --wait postgres redis meilisearch
pnpm db:generate
pnpm db:migrate
pnpm dev
# In a second terminal:
pnpm worker
# In a third terminal, against the disposable local database:
pnpm test:integration
pnpm test:http
docker compose build
```

The rate-limit integration test consumes the loopback login bucket; use a fresh test Redis namespace or wait 15 minutes before rerunning. No sample vertical rows are seeded.
