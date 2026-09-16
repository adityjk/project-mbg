# MBG Project — Progress Notes

Repo: `/home/Ashvan/project/project-mbg`
Monorepo: bun workspace — `api/` (Express 5 + **PostgreSQL**) + `fe/` (React 19 + Vite 7 + TypeScript)

---

## To Do (future work)

Checked = done. Priority: `[P0]` urgent, `[P1]` this week, `[P2]` nice-to-have.

### Demo mode toggle (in progress — for portfolio)
- [x] `[P0]` **Backend** — `authMiddleware.js`: when `DEMO_MODE=true`, `verifyToken` injects demo user `{ id: 0, role: 'super_admin' }` instead of rejecting (passes all role gates); valid real tokens are still honored; `server.js` warns when active
- [x] `[P0]` **Backend** — `DEMO_MODE` added to `.env` + `.env.example`; local `api/.env` set `true`; Vercel should set `DEMO_MODE=true` (API + FE)
- [x] `[P0]` **FE** — `src/utils/demo.ts` (`isDemoMode`, `DEMO_USER`, `DEMO_TOKEN`); `ProtectedRoute` bypasses auth/role checks in demo mode and seeds demo identity
- [x] `[P0]` **FE** — `Sidebar.tsx`: full admin nav (incl `/admin/analyze`) shown in demo mode and for `super_admin`
- [x] `[P1]` **FE** — persistent `DemoBanner` (floating badge) rendered once in `App.tsx` so it shows on every page
- [x] `[P1]` **FE** — Login page: "Masuk sebagai Demo (Akses Penuh)" CTA in demo mode
- [ ] `[P1]` **Test** — walk all admin pages + menu analysis + report flow in demo mode against real DB (now possible locally: Docker **Postgres** on :5432 + `DEMO_MODE=true`) — auth wiring verified via standalone middleware tests (7/7 pass)

### Known issues / cleanup
- [x] `[P1]` `schoolRoutes.js` create route — added missing `console.error` logging
- [x] `[P2]` `db.js` `process.exit(1)` on DB connect fail — replaced with warning log (serverless-safe; queries surface errors individually)
- [x] `[P2]` `super_admin` login dead-end — fixed: Login redirect now sends `super_admin` to `/admin`
- [x] `[P2]` Root `package.json` + bun workspaces added (Session 8) — `bun run dev` runs both apps

### Later (unscheduled ideas)
- [ ] `[P2]` Extract shared `useImageUpload` hook from `useUserReport.ts` + `PublicLaporan.tsx` (still duplicated)
- [ ] `[P2]` README — add Vercel deploy walkthrough + screenshots for portfolio
- [ ] `[P2]` Seed script for demo data so portfolio reviewer sees populated charts/maps

---

## Session 1 — Refactoring + Vercel routing

Goal: make existing functions more efficient **without losing** any feature, and add Vercel deployment routing. Frontend work guided by the `frontend-patterns` skill; backend by `backend-patterns`.

### Backend (`api/`)
| File | Change |
|---|---|
| `src/routes/dashboardRoutes.js` | 6 sequential SQL queries → 1 query with scalar subqueries; added `console.error`; removed `err.message` leak |
| `src/middleware/validator.js` | **Bug fix:** `kategori` whitelist was `['umum','gizi','kebersihan','pelayanan']` → now matches schema/types `['umum','kualitas_makanan','distribusi','kebersihan','lainnya']`. Added `validateUpdateMenu`, `validateUpdateSchool`, `validateUpdateTeam`; added `menu_id` validation |
| `src/middleware/uploadMiddleware.js` (new) | Shared multer error wrapper: 413 for `LIMIT_FILE_SIZE`, else 400; uses field name `image` |
| `src/config/upload.js` | Extracted `sharedTransformation` + `fileSizeLimit` (10 MB) applied to all 3 multer instances |
| `src/routes/menuRoutes.js` | Uses shared `uploadMiddleware`; PUT → COALESCE partial update; error logging |
| `src/routes/reportRoutes.js` | Uses shared `uploadMiddleware(uploadReport)`; error logging |
| `src/routes/teamRoutes.js` | Uses shared `uploadMiddleware`; added `validateUpdateTeam`; **added missing `POST /admin/tim-sppg/upload-image`** (frontend already called it → was 404); error logging |
| `src/routes/schoolRoutes.js` | `validateUpdateSchool` on PUT + `?? null` params; logging (create still lacks `console.error`) |
| `src/routes/userRoutes.js` | Error logging in GET/POST/DELETE |
| `src/server.js` | Required-env validation + `recommendedEnv` warnings (Cloudinary, Gemini); added JSON 404 handler |
| `.env.example` | Documented `GEMINI_API_KEY`, `PORT`, `NODE_ENV`, `ALLOWED_ORIGINS` |

### Frontend (`fe/`)
| File | Change |
|---|---|
| `vercel.json` | `/api/(.*)` passthrough, SPA fallback `/((?!assets/).*)`, `Cache-Control: immutable` for `/assets/*` |
| `src/services/api.ts` | `API_BASE = import.meta.env.VITE_API_URL \|\| '/api'` (was hardcoded); **401 interceptor** (clears storage, redirects `/login`); shared `uploadFile<T>` helper; typed `userApi`; **`menuApi.analyze`, `reportApi.uploadImage`, `timSppgApi.uploadImage` now return unwrapped response data**; removed unused `timSppgApi.getById` |
| `src/utils/imageUtils.ts` | Added `resolveMediaUrl`, `getAvatarUrl` (dedup), `REPORT_CATEGORIES` const |
| `src/hooks/useReports.ts` | Full rewrite: timer cleanup on unmount, `showSuccess`/`showError`, memoized callbacks, functional `setState` (fixed stale closure), debounced search |
| `src/hooks/useUserReport.ts` | Memoized callbacks, `mountedRef` guard, `res.imageUrl` (unwrapped) |
| `src/App.tsx` | All pages → `React.lazy` + `<Suspense>` code splitting; removed debug `console.log` |
| `src/pages/Reports.tsx` | `useMemo` for `filteredReports` + `pendingCount` |
| `src/pages/admin/UserManagement.tsx` | Raw `axios` → shared `userApi` |
| `src/components/ExpandableDescription.tsx` (new) | Shared component replacing 3 local copies |
| `src/pages/MenuHistory.tsx`, `Dashboard.tsx` | Use `resolveMediaUrl` |
| `src/pages/Maps.tsx` | Dynamic `import()` → static `schoolApi` import |
| Various | `menuApi.getAll` with `params` used by HistorySiswa |

### Follow-up fixes
- **Unwrapped-API consumers** (`.data.imageUrl` → `.imageUrl`, `response.data.data` → `response.data`):
  - `src/pages/admin/TimSPPGManagement.tsx:61`
  - `src/pages/AnalyzeMenu.tsx:73-74`
  - `src/pages/PublicLaporan.tsx:84`
- **Express 5 wildcard bug:** `app.use('/api/*', ...)` throws "Missing parameter name" (path-to-regexp v8) → replaced with `app.use('/api', ...)` after all API routes.
- **Dedup:** removed local `ExpandableDescription` from `MenuHariIni.tsx` + `PublicMenuHistory.tsx`; category `<option>` lists → `REPORT_CATEGORIES` in `UserReportForm.tsx`, `ReportForm.tsx`, `PublicLaporan.tsx`; duplicate `setSuccess(null)` in `AnalyzeMenu.tsx`.

---

## Session 2 — npm → bun

`bun` 1.3.14 installed at `~/.bun/bin/bun`.

- Deleted `package-lock.json` (root, `api/`, `fe/`); generated `bun.lock` in `api/` + `fe/`.
- `api/package.json`: `dev` → `bun --watch src/server.js` (bun's built-in watcher), `start` → `bun src/server.js`; removed `nodemon` devDependency.
- README commands updated `npm` → `bun`.

### TypeScript build fixes (surfaced by `bun run build` → `tsc -b && vite build`)
Previously the build was broken; all fixed:
- `Layout.tsx` now accepts optional `children` (`children ?? <Outlet />`) — unbreaks dead-but-present `AdminLayout.tsx`.
- Removed unused imports: `React`/`useEffect` in `ProgressModal.tsx`, `React` in `ReportItem.tsx`/`ReportList.tsx`, `MdRestaurantMenu`/`MdCheckCircle` in `LandingPage.tsx`, `Report` in `useUserReport.ts`/`ReportForm.tsx`.
- `ReportForm.tsx:29` — form reset keeps `kategori: 'umum'` (was dropping it).
- `Reports.tsx:36` — `onConfirm` wrapped to return `Promise<void>`.
- ✅ `bun run build` passes (588 modules, per-route chunks from code splitting).

---

## Session 3 — boot fixes

- **Missing `.env` explanation:** `server.js` validates env and `process.exit(1)` on missing `JWT_SECRET`/`DB_HOST`/`DB_NAME`.
- Created `api/.env` from `.env.example` (gitignored). Generated JWT secret. Set `NODE_ENV=development`, `DB_SSL=false`, localhost CORS.
- **Bug found while booting:** `reportRoutes.js` had duplicate `const { uploadReport }` (lines 4 + 82) → **bun** rejects duplicate declarations (Node silently tolerated). Removed the duplicate.

---

## Session 6 — Local DB (Docker MySQL) + Gemini 503 fix + deploy guide

### Local database — MySQL via Docker
- **Created `docker-compose.yml`** at repo root: `mysql:8.4` container `mbg-db` (:3306), db `db_mbg`, user `mbg`/`mbg_password` (dev creds only), healthcheck, persistent volume `mbg_db_data`.
- Imported existing schema (users, schools, menus, reports, tim_sppg); `api/.env` wired: `DB_HOST=localhost`, `DB_USER=mbg`, `DB_PASSWORD=mbg_password`, `DB_NAME=db_mbg`.
- `.env`/`.env.example` document the docker creds; `README.md` gained a Docker quick-start.

### Gemini 503 fix
- `src/services/aiServices.js`: **intermittent 503 from Google Generative Language API** (SSE-only error). Added `generateContentWithRetry` — MAX_RETRIES=5, exponential backoff from ~1.25s with jitter (1s → ~15s), retries HTTP 429/500/502/503/504 + error text `"503"`. Sets `expect: "application/json"` header.

### Deploy guide
- **Created `push.md`** — step-by-step Vercel publication guide (two projects from one repo, Root Directory `api/` and `fe/`, env vars, region/limits notes).

---

## Session 7 — Migrate MySQL → PostgreSQL (done on user request, so DB is easy to host online, e.g. Neon/Supabase)

### Backend
| File | Change |
|---|---|
| `src/config/db.js` | Rewritten for **`pg`** (`Pool`). Kept mysql2-compatible `execute()` shim so routes barely changed: `?` auto-mapped to `$1…$n` (incl. `?` inside literals), INSERT automatically appends `RETURNING *` and exposes `insertId`, `affectedRows`, `rows`; SELECT returns `.rows`. Supports **`DATABASE_URL`** (wins over DB_*), `DB_SSL` config, SSL-only pooling. No credential-conflict warnings. |
| `src/config/setup_db.js` | Rewritten: connects via `Pool`, executes migrator SQL from **`db_schema_pg.sql`**, strips `--` comment lines, splits on `;`, creates tables with `CREATE TABLE IF NOT EXISTS`, logs `✅ All tables ready`. |
| `db_schema_pg.sql` (root) | Rewritten for Postgres — all 5 tables: `users` (SERIAL PK, role CHECK, UNIQUE username), `schools`, `menus` (SERIAL, FK→schools), `reports` (SERIAL, FKs), `tim_sppg` (SERIAL, BOOLEAN `is_active` default TRUE). Backups of old MySQL schema kept as `db_schema_mysql.sql` / `db_schema.sql` (delete when ready). |
| `src/routes/menuRoutes.js` | `GROUP BY TO_CHAR(created_at,'YYYY-MM')`; `created_at::date` for date comparisons. |
| `src/routes/reportRoutes.js` | Ticket search: `LPAD(r.id::text,6,'0')` (replaces `LPAD(CAST(id AS CHAR),…)`). |
| `src/routes/teamRoutes.js` | `is_active = TRUE` filter + local `toBool` helper (replaces MySQL `1`). |
| `src/routes/authRoutes.js`, `userRoutes.js` | Duplicate-key error code `'ER_DUP_ENTRY'` → `'23505'`. |
| `src/routes/dashboardRoutes.js` | **Bug fixed by PG strictness:** quoted aliases `"totalMenus"`, `"totalReports"`, `"avgKalori"`, `"avgProtein"`, `"totalPorsi"` — MySQL unquoted aliases returned lowercase so stats showed zeros in the FE; PG 4316s on mixed-case in Node `pg` (`column "totalmenus" does not exist`). |
| `api/create_admin.js`, `verify_access.js` | Converted to `pg`; `dotenv` path fixed (`process.cwd()` fallback); `verify_access.js` role test now **PASS**. |
| `api/package.json` | Added `pg` (^8.13.1). |

### Infra / config
- `docker-compose.yml` → switched to **`postgres:16`** (still port 5432, same `mbg`/`mbg_password`/`db_mbg`); old MySQL container+volume removed (`docker compose down -v`). `db_schema_pg.sql` mounted for init.
- `api/.env` / `.env.example` → `DB_PORT=5432`, `DB_SSL=false`; `DATABASE_URL` line documented (Neon) as the online override.
- `README.md` → tech stack MySQL → PostgreSQL; Docker + setup instructions.
- `push.md` → rewritten: Neon (free serverless Postgres) walkthrough, `DATABASE_URL` env-inject flow, remove-Heroku note.

### Verification (local, against Docker Postgres)
- Register/login + token, menu insert returns real id, month filter, report insert + ticket search (`MBG-000001`), stats endpoint (nonzero aliases), tim-sppg boolean insert, school update/delete, duplicate username → 400 → all **passed**. Test data cleaned (0 users).

---

## Session 8 — Monorepo (bun workspace, light orchestrator)

User decision: keep `api/` + `fe/` as-is, add a **root orchestrator workspace** (no folder moves; Vercel root dirs unchanged — separate API + FE links, connected via `VITE_API_URL` + `ALLOWED_ORIGINS`).

- **Created root `package.json`** — `"workspaces": ["api","fe"]` + scripts:
  - `dev` → `concurrently -n api,fe` (both dev servers, API :5000 + Vite :5173)
  - `dev:api`, `dev:fe`, `build` (→ `build:fe`), `build:fe`, `lint`
  - `db:setup` (`bun src/config/setup_db.js`), `db:admin` (`bun create_admin.js`)
- **Root `bun.lock`** generated; `bun install` at root hoisted all deps (750 packages, incl. `concurrently`).
- **Bun gotchas worked around:** bare `bun --cwd <dir> run <script>` prints help (script treated as file), and file-scripts need `bun <file>` not `bun run <file>` → root scripts use `cd <dir> && bun …` instead.
- `README.md` → rewritten setup for workspace: `bun install`, `bun run dev`, `bun run build`, `bun run db:setup`. `push.md` → monorepo/workspace note at top.

### Verification
- `bun install` (root) ✅ · `bun run dev` → API on :5000 (Postgres-connected) + FE on :5173 ✅ · `bun run build` (tsc + vite) ✅  · `bun run db:setup` ✅ (5 tables) · `bun run db:admin` ✅ (admin SPPG created)

---

## Current state / pending

### Done — Demo mode toggle (Session 4, per user decision)
Backend + frontend implemented (see checklist above). Local `.env` files enabled for demo:
- `api/.env`: `DEMO_MODE=true` (gitignored)
- `fe/.env.local`: `VITE_DEMO_MODE=true` (gitignored) — Vite dev server + preview run in demo mode

Auth wiring verified with a standalone middleware test (7/7 pass): demo injects super_admin on missing/invalid token, `requireRole` gates pass, valid real tokens still honored, and non-demo behaviour unchanged (403/401/blocked).

### Done — PostgreSQL migration (Session 7)
Local DB is now **Postgres 16 via Docker** (`docker compose up -d db`, port 5432). MySQL files/volume removed. All routes + setup/admin scripts converted and verified (see Session 7).

### Done — Monorepo workspace (Session 8)
Root `package.json` + `bun.lock` (bun workspaces, light orchestrator). One command: `bun install` → `bun run dev`.

### Remaining for demo mode
- Full UI walkthrough against real DB — now doable locally: Docker Postgres on :5432 + `DEMO_MODE=true`, or on the Vercel deploy.

### Open issues / not yet done
- Public `LocalStorage`-based auth is fragile but intentional for the showcase.
- Remaining FE lint backlog (not yet addressed): `react-hooks/set-state-in-effect` (fetch-in-effect in useReports/useUserReport/UserManagement/HistorySiswa/UserReportForm), `@typescript-eslint/no-explicit-any` (~20), a few unused `err` catch bindings, `react-refresh/only-export-components` in `ConfirmDialog.tsx`, `prefer-const`/`exhaustive-deps` stragglers.
- Old MySQL schemas left at root as `db_schema_mysql.sql` / `db_schema.sql` — safe to delete.

---

## Session 5 — Bug fixes + hooks hardening

### Backend
| File | Change |
|---|---|
| `src/config/db.js` | Removed `process.exit(1)` on DB connect fail (was a Vercel serverless cold-start crash-loop). Now logs a warning and keeps running; queries surface errors individually. |
| `src/routes/schoolRoutes.js` | Added the last missing `console.error` (create route). |

### Frontend
| File | Change |
|---|---|
| `src/pages/auth/Login.tsx` | **Bug:** `super_admin` logged in wound up on `/user` (dead-end). Admin-redirect list now includes `super_admin`. |
| `src/utils/leafletIcons.ts` (new) | Shared Leaflet default marker icon factory + prototype side-effect; replaces duplicated code in `Maps.tsx` + `SchoolManagement.tsx` (also fixes 2× `let DefaultIcon` → `const`). |
| `src/pages/Maps.tsx` | Uses shared icon util (side-effect import); `fetchLocations` → `useCallback` + effect dep. |
| `src/pages/admin/SchoolManagement.tsx` | Uses shared icon util; `fetchSchools` → `useCallback` + effect dep; **stale-closure bug:** delete now uses functional `setSchools(prev => ...)`. |
| `src/pages/MenuHistory.tsx`, `PublicMenuHistory.tsx`, `TimSPPG.tsx`, `admin/TimSPPGManagement.tsx`, `user/MenuHariIni.tsx` | Fetch fns wrapped in `useCallback` + effect deps (clears `react-hooks/immutability` "accessed before declared" class of bugs). |
| `src/hooks/useReports.ts` | **Bug:** mount effect + empty-search effect caused a double fetch on every visit. Merged into one debounced effect that also performs the initial load; `catch (err)` → `catch` (unused binding). |

### Verification
- `bun run build` ✅ (per-route chunks; new `leafletIcons` chunk)
- Lint: 48 problems (46 err) → 45 problems (44 err); all 8 `react-hooks/immutability` errors eliminated; 0 new errors
- Backend boots without MySQL: prints DB warning + stays alive (was exit 1) ✅
- Remaining lint backlog tracked in "Open issues" above

---

## Commands
```bash
bun install          # from repo root — installs all workspace deps
bun run dev          # api (bun --watch, :5000) + fe (vite, :5173) concurrently
bun run dev:api      # api only
bun run dev:fe       # fe only
bun run build        # fe: tsc -b && vite build
bun run lint         # fe
bun run db:setup     # create all tables (api: bun src/config/setup_db.js)
bun run db:admin     # create default admin (api: bun create_admin.js)
docker compose up -d db   # local Postgres 16 (:5432)
```

## Env
`api/.env` — see `.env.example`. Vercel: set `DB_*`/`DATABASE_URL` (Neon), `JWT_SECRET`, `CLOUDINARY_*`, `GEMINI_API_KEY`, `ALLOWED_ORIGINS`, `DEMO_MODE=true`; FE: `VITE_API_URL` (→ deployed API link) + `VITE_DEMO_MODE=true`. Full flow in `push.md`.