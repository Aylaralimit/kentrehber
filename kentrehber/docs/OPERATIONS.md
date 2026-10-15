# Operations

## Environment and services

`.env.example` documents every setting. `pnpm env:init` produces local secrets; production requires independently provisioned credentials. `pnpm check:env` fails on invalid configuration without printing credential values. `APP_URL` must be an origin, HTTPS in production. Compose uses `DOCKER_APP_URL` as the app origin because local host development uses HTTP.

Use `pnpm dev` with the generated development environment. `pnpm start` serves a compiled build and should be launched with `NODE_ENV=production` and an HTTPS `APP_URL` behind Caddy. The CI integration test uses a loopback HTTP transport with an HTTPS configured origin and explicit Origin headers; it does not certify TLS. If testing a built app with the development `.env`, Next prints a NODE_ENV warning; that mode is only for local smoke testing.

`GET /api/health/live` returns 200 if the web process can serve requests. `GET /api/health/ready` requires `Authorization: Bearer <HEALTH_TOKEN>` and checks PostgreSQL SELECT 1, authenticated Redis PING, authenticated Meilisearch stats and a worker heartbeat less than 90 seconds old. It returns 503 on any failed core dependency. When `MEDIA_ENABLED=true`, it also makes a real R2 HeadBucket and authenticated Cloudflare Images list request. Disabled media appears as `enabled:false` with null cloud results, never healthy by inference.

Database connections have explicit small pool/connect timeouts in generated local and Compose URLs. Application health checks bound response time separately. Worker heartbeats expire in Redis; scheduled cleanup removes expired sessions hourly. Failed jobs retry with exponential backoff and retain the last 100 failures. Inspect failures before retrying; the worker accepts only `session-cleanup` jobs. Stop with SIGTERM for a graceful close.

`pnpm db:dev --name descriptive_change` creates a new timestamped migration. Review the generated SQL and any cross-table invariants. Use only `pnpm db:migrate` in production; never `db push`. Back up PostgreSQL before migration and restore from a tested backup if a destructive migration cannot be reversed. The first SQL migration defines directory configuration/geography; the second creates Better Auth tables; the third adds generic configuration integrity.

## Oracle Always Free target

No Oracle instance is provisioned. On the intended VM, install Docker Engine and Compose, allow only 80/443 inbound (SSH limited to administrators), persist the named volumes, and confirm available RAM/disk for PostgreSQL 16, Redis 7, Meilisearch 1.10 and Node. Free-tier capacity and architecture availability must be checked on the actual account. The Dockerfile builds on the host architecture; ARM compatibility and capacity have not been tested here. CI on x86 does not certify ARM.

Set `DOCKER_APP_URL=https://your-real-domain`, `CADDY_ADDRESS=your-real-domain`, `BIND_IP=0.0.0.0`, `HTTP_PORT=80`, `HTTPS_PORT=443`, and unique production secrets. Keep service ports private. Never copy the developer `.env` into a public artifact. Start Compose, inspect migration completion, provision the operator, and test readiness and logout over the real origin before accepting traffic. Next's process is started with `next start`; the image deliberately retains workspace tooling so the same image runs migrations and the worker. It favors reproducibility over minimal image size.

## Cloudflare CDN/WAF and media

Cloud resources require account ownership and are not configured automatically. Set the actual DNS record to the origin, enable Cloudflare proxy, use Full (strict) TLS, and enable the managed WAF rules available for the account. Rate-limit `/api/auth/*`. Block direct origin access using firewall rules for Cloudflare address ranges only after validating certificate issuance/renewal and administrator recovery. Never trust arbitrary incoming client-IP headers for authentication.

Caddy currently overwrites `X-KentRehber-Client-IP` with its connecting client IP. Behind Cloudflare, configure Caddy's `trusted_proxies` with Cloudflare's current published CIDRs and `client_ip_headers CF-Connecting-IP` only after restricting origin access to Cloudflare. Otherwise multiple visitors share the Cloudflare edge's rate-limit bucket. Do not enable trust for arbitrary network ranges. This account/network-specific step is required before production proxying and has not been applied here.

Bypass caching for `/admin*`, `/api/*`, and all Phase 0 HTML. Preserve private/no-store headers and never override these with Cache Everything. Versioned `/_next/static/*` assets can use CDN caching. Review nonce CSP in the browser after enabling any Cloudflare feature that rewrites HTML; disable script injection such as Rocket Loader unless explicitly validated.

Create a private R2 bucket and scoped credentials. Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. For Images, set `CF_IMAGES_ACCOUNT_ID`, `CF_IMAGES_API_TOKEN`, `CF_IMAGES_ACCOUNT_HASH`; then enable `MEDIA_ENABLED=true` and verify readiness. These values remain server-only. This phase configures authenticated clients and checks access; it does not accept files or implement media publishing.

## Backups and monitoring

Back up PostgreSQL daily with encrypted, off-host storage and perform restore drills. Keep Redis AOF and Meilisearch data on persistent volumes. Do not treat Redis/search snapshots as the source of truth. Monitor authenticated readiness, process restarts, disk usage, failed jobs and certificate renewal. Protect health tokens from access logs. Restore testing, cloud connectivity, WAF verification and production deployment require the actual target environment and have not been performed by local build checks.

