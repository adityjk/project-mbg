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
- **Database**: MySQL
- **AI Integration**: Google Generative AI SDK (@google/generative-ai)
- **File Handling**: Multer

## 📦 Prerequisites

- Node.js (v18+ recommended)
- MySQL Server
- NPM or Yarn

## 🔧 Installation & Setup

### 1. Database Setup
Ensure you have a MySQL database running. Import the provided SQL schema (if available) or ensure the following tables exist:
- `menus` (for storing menu history and analysis results)
- `reports` (for user feedback)

### 2. Backend Setup (`api`)

```bash
cd api
npm install
```

Create a `.env` file in the `api` directory:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mbg_db
GEMINI_API_KEY=your_google_gemini_api_key
```

Run the server:
```bash
npm run dev
```
The backend will start at `http://localhost:3000`.

### 3. Frontend Setup (`fe`)

```bash
cd fe
npm install
```

Run the development server:
```bash
npm run dev
```
The frontend will start at `http://localhost:5173`.

## 🤖 AI Configuration
This project uses the **Google Gemini 1.5 Flash** (via `gemini-2.5-flash` alias/model) for image analysis. Ensure your `GEMINI_API_KEY` is valid and has access to the Generative Language API.

## 📄 License
[ISC](https://opensource.org/licenses/ISC)
