# MBG Project — Progress Notes

Repo: `/home/Ashvan/project/project-mbg`
Monorepo: `api/` (Express 5 + MySQL) + `fe/` (React 19 + Vite 7 + TypeScript)

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
- [ ] `[P1]` **Test** — walk all admin pages + menu analysis + report flow in demo mode against real DB (blocked locally: no MySQL/MariaDB on this machine; do on Vercel or with DB running) — auth wiring verified via standalone middleware tests (7/7 pass)

### Known issues / cleanup
- [ ] `[P1]` `schoolRoutes.js` create route — add `console.error` logging (only route missing it)
- [ ] `[P2]` `db.js` `process.exit(1)` on DB connect fail at module load — risky on Vercel serverless cold starts; refactor to lazy connect
- [ ] `[P2]` `super_admin` login dead-end in `authRoutes.js` (login ignores that role) — only matters if demo mode is removed
- [ ] `[P2]` Root has no `package.json` (only had a stray `package-lock.json`, now deleted) — decide whether to add a root workspace or leave as-is

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

## Current state / pending

### Done — Demo mode toggle (Session 4, per user decision)
Backend + frontend implemented (see checklist above). Local `.env` files enabled for demo:
- `api/.env`: `DEMO_MODE=true` (gitignored)
- `fe/.env.local`: `VITE_DEMO_MODE=true` (gitignored) — Vite dev server + preview run in demo mode

Auth wiring verified with a standalone middleware test (7/7 pass): demo injects super_admin on missing/invalid token, `requireRole` gates pass, valid real tokens still honored, and non-demo behaviour unchanged (403/401/blocked).

### Remaining for demo mode
- Full UI walkthrough against real DB — blocked locally (no MySQL/MariaDB installed, port 3306 closed). Do on Vercel deployment or once a DB is available.

### Open issues / not yet done
- `super_admin` login dead-end (role not handled in `authRoutes.js` login flow) — only relevant if demo mode removed; demo mode bypasses this.
- `schoolRoutes.js` create route lacks `console.error` logging.
- `api/src/config/db.js` calls `process.exit(1)` on DB connect fail at module load — risky on Vercel serverless cold start (not reached demo mode).
- Root `package-lock.json` deleted — root has no `package.json`.
- Public `LocalStorage`-based auth is fragile but intentional for the showcase.

---

## Commands
```bash
bun install          # in api/ and fe/
bun run dev          # api (bun --watch), fe (vite)
bun run build        # fe: tsc -b && vite build
bun run lint         # fe
```

## Env
`api/.env` — see `.env.example`. Vercel: set `DB_*`, `JWT_SECRET`, `CLOUDINARY_*`, `GEMINI_API_KEY`, `ALLOWED_ORIGINS`, `DEMO_MODE=true`; FE: `VITE_API_URL`, `VITE_DEMO_MODE=true`.