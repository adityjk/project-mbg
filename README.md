# Makan Bergizi Gratis (MBG) Project

A comprehensive web application for managing and analyzing "Makan Bergizi Gratis" (Free Nutritious Meals) programs. This project features an AI-powered menu analysis system using Google Gemini, report management, and a user-friendly dashboard for students and administrators.

## 🚀 Features

- **Menu Analysis**: Upload photos of food to automatically analyze nutritional content (Calories, Carbs, Protein, Fat) using Google Gemini AI.
- **Menu History**: Track daily menus and their nutritional value.
- **Reporting System**: Submit and manage reports regarding meal quality or distribution.
- **Dashboard**: Visual overview of program statistics.
- **User & Admin Roles**: Tailored interfaces for different user types.

## 🛠️ Tech Stack

### Frontend (`/fe`)
- **Framework**: React (with Vite)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4, DaisyUI
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend (`/api`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **AI Integration**: Google Generative AI SDK (@google/generative-ai)
- **File Handling**: Multer

## 📦 Prerequisites

- Node.js (v18+ recommended)
- MySQL Server
- NPM or Yarn

## 🔧 Installation & Setup

> This repo is a **bun workspace monorepo** — one command runs everything from the root.

### 0. Install (once, from repo root)

```bash
bun install
```

### 1. Database Setup

The project uses **PostgreSQL**. For local dev, spin up the container:

```bash
docker compose up -d db
bun run db:setup      # creates all tables (users, schools, menus, reports, tim_sppg)
bun run db:admin      # optional: create the default 'admin SPPG' account
```

### 2. Backend Setup (`/api`)

Create a `.env` file in the `api` directory (see `api/.env.example`):
```env
DB_HOST=localhost
DB_USER=mbg
DB_PASSWORD=mbg_password
DB_NAME=db_mbg
DB_PORT=5432
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Run Everything (from repo root)

```bash
bun run dev        # starts API (port 5000) and frontend (port 5173) together
```

Or individually:
```bash
cd api && bun run dev     # backend  → http://localhost:5000
cd fe && bun run dev      # frontend → http://localhost:5173
```

Useful root scripts:
- `bun run build` — production build of the frontend
- `bun run lint` — lint the frontend
- `bun run db:setup` / `bun run db:admin` — database helpers

## 🚀 Deployment

See **`push.md`** for the full Vercel + Neon (Postgres) step-by-step guide.
The two Vercel projects use root directories `api/` and `fe/` (workspace-aware).

## 🤖 AI Configuration
This project uses the **Google Gemini 1.5 Flash** (via `gemini-2.5-flash` alias/model) for image analysis. Ensure your `GEMINI_API_KEY` is valid and has access to the Generative Language API.

## 📄 License
[ISC](https://opensource.org/licenses/ISC)
