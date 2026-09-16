# Publish MBG to Vercel — Step by Step

> This repo is a **bun workspace monorepo** (`api/` + `fe/`). From the root you can run
> `bun install`, `bun run dev`, `bun run build`. Vercel imports it as **two projects**
> using Root Directory `api/` and `fe/` (Vercel detects the workspace root automatically).

> **Database:** This project uses **PostgreSQL**. Thanks to that, hosting the DB online is
> much easier — use **Neon** (free, serverless Postgres, perfect with Vercel) or **Supabase**.
> Your local Docker Postgres (`mbg-db`) is for development only and cannot be reached by Vercel.

---

## 0. What you need (before starting)

- GitHub repo: `https://github.com/adityjk/project-mbg`
- A [Vercel](https://vercel.com) account (sign in with GitHub)
- A [Neon](https://neon.tech) account (free tier, no credit card)
- Your real keys from `api/.env`: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`, `GEMINI_API_KEY`, `JWT_SECRET`

No PostgreSQL CLI is required — the Neon web SQL editor is enough.

---

## 1. Create the cloud database (Neon, free Postgres)

1. Go to https://neon.tech → **Sign up** → **Start for free** (GitHub sign-in is fastest).
2. **Create project** → pick a name (e.g. `mbg`) → choose a region close to you → **Create project**.
3. On the next screen you get a **connection string**, e.g.:
   `postgresql://neondb_owner:XXX@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
   - This is your `DATABASE_URL` — **save it**.
4. **Import the schema**:
   - In the Neon console open **SQL Editor** (left menu).
   - Open `db_schema_pg.sql` in this repo, copy the whole file, paste it, **Run**.
   - It creates all tables: `users, schools, menus, reports, tim_sppg`.

Verify: run `\d` describe shortcut — or just run `SELECT table_name FROM information_schema.tables;`
and confirm the 5 tables exist.

---

## 2. Update `api/.env` for local testing (optional but recommended)

Point your backend at the Neon DB temporarily so you can verify locally:

```env
DATABASE_URL=postgresql://neondb_owner:XXX@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_SSL=true
```

Test locally:
```bash
cd api
bun run src/config/setup_db.js   # should print "Database setup complete!"
```

> When `DATABASE_URL` is set, it wins over `DB_HOST/DB_USER/DB_NAME/etc.`
> (`api/src/config/db.js` handles both.)

---

## 3. Commit and push to GitHub

```bash
cd /home/Ashvan/project/project-mbg
git add -A
git commit -m "Prepare for Vercel deployment (DB_SSL support, publish guide)"
git push origin main
```

Optional — make the repo private:
GitHub → `adityjk/project-mbg` → **Settings → Danger Zone → Change repository visibility → Make private**.

---

## 4. Deploy the API (backend) to Vercel

1. Go to https://vercel.com/new → **Import** your GitHub repo `adityjk/project-mbg`.
2. In **Configure Project**:
   - **Root Directory**: `api`
   - **Framework Preset**: Other
   - **Build Command**: *(leave empty — handled by `api/vercel.json`)*
   - **Install Command**: `bun install`  (Vercel detects `bun.lock` and uses Bun)
3. Add **Environment Variables** (Environment: Production):

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | your Neon connection string (ends with `?sslmode=require`) |
   | `DB_SSL` | `true` |
   | `JWT_SECRET` | your secret from `api/.env` |
   | `CLOUDINARY_CLOUD_NAME` | from `api/.env` |
   | `CLOUDINARY_API_KEY` | from `api/.env` |
   | `CLOUDINARY_API_SECRET` | from `api/.env` |
   | `GEMINI_API_KEY` | from `api/.env` |
   | `NODE_ENV` | `production` |
   | `DEMO_MODE` | `false`  ← real auth; set `true` only for a demo/portfolio site |
   | `ALLOWED_ORIGINS` | your app domains (fill after Step 5, then re-deploy) |

4. Click **Deploy**. Wait — note the API URL, e.g. `https://project-mbg-api.vercel.app`.
5. Smoke test the API:
   ```
   https://<api-url>/api/schools
   ```
   (should return JSON, not HTML). Check **Functions → Logs** in Vercel for
   `✅ Database Connected via PostgreSQL!`.

> If you see `password authentication failed` / `connection refused`, double-check the
> `DATABASE_URL` (and that `DB_SSL=true`).

---

## 5. Deploy the frontend to Vercel

1. https://vercel.com/new → **Import** the same repo again → **Add New Project**.
2. In **Configure Project**:
   - **Root Directory**: `fe`
   - **Framework Preset**: **Vite**
   - **Build Command**: `bun run build`
   - **Install Command**: `bun install`
   - **Output Directory**: `dist`
3. Add one **Environment Variable** (Production):

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<api-url>.vercel.app/api` ← the API project URL + `/api` |

   (`fe/src/services/api.ts` uses this; it also reads `import.meta.env.VITE_API_URL`.)
4. Click **Deploy** → note the frontend URL, e.g. `https://project-mbg.vercel.app`.

---

## 6. Finish the wiring (CORS)

1. Back on the **API project** in Vercel → **Settings → Environment Variables** → edit `ALLOWED_ORIGINS` to include your frontend domain, e.g.:
   ```
   https://project-mbg.vercel.app,https://project-mbg-git-main-adityjk.vercel.app
   ```
   (Keep `http://localhost:5173` in the list if you still run the frontend locally during dev.)
2. Click **Redeploy** (Deployments → ⋯ → Redeploy) so the new env var takes effect.
3. Done. Open the frontend URL and test:
   - Login / Register
   - **Analyze Menu** (upload a food photo → Gemini + Cloudinary)
   - Reports, Dashboard, Tim SPPG, Maps

---

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| `Database connected` never logged / 500s on all routes | Check `DATABASE_URL` spelling, `DB_SSL=true`, and that you imported `db_schema_pg.sql` in the Neon SQL Editor. |
| `cloud_name is disabled` on image upload | Cloudinary account issue (unverified email or disabled env) — see Cloudinary Console → Settings → Product environments, or email-verify. |
| Gemini `503` on analyze | Transient — the API now retries up to 5× with backoff. If frequent, switch model in `api/src/config/gemini.js` to `gemini-2.5-flash-lite`. |
| CORS `Not allowed by CORS` | Missing origin in `ALLOWED_ORIGINS`; add the exact frontend URL and redeploy. |
| Login works locally, not on cloud | Re-check `DEMO_MODE=false`; register a user on the deployed site (or run `node create_admin.js` against Neon). |

---

## Notes

- Local Docker Postgres (`docker compose up -d db`) is for development only; production uses Neon.
- `api/.env` is gitignored; Vercel only uses the env vars in the dashboard.
- Both `vercel.json` files are already configured: `api/` (Express → `@vercel/node`) and `fe/` (SPA rewrites).