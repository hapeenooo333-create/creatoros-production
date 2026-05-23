# CreatorOS - Premium Full-Stack Creator Workspace

CreatorOS is a highly optimized full-stack application designed for creators to manage scripts, generate premium human-style social captions, optimize video workflows, automate multi-channel publishing sequences, and monitor local and live metrics.

The application features a hybrid offline-first execution engine: it runs entirely locally in a fully interactive, simulated **Sandbox Mode** without needing any third-party credentials, while being completely pre-configured to light up real AI and database operations once cloud secrets are provided or hooked up.

---

## 🚀 Quick Start (Local Development)

### Final Project Root Folder
The final project root is the top-level directory where `package.json` resides. All commands below must be executed from this root directory.

### 1. Install Dependencies
Ensure you are using Node.js v18 or later.
```bash
npm install
```

### 2. Configure Environment Variables
Copy the template `.env.example` into a new `.env` file at the project root:
```bash
cp .env.example .env
```
Fill in the requested variables (or leave them blank to automatically run in Sandbox Mode):
* `GEMINI_API_KEY`: Secrets for real AI caption/script generation.
* `SUPABASE_URL`: Remote project database URL.
* `SUPABASE_ANON_KEY`: Public anonymous auth key for multi-user sync.
* `APP_URL`: Local or hosted fallback target environment URL.

### 3. Run the App Locally (Dev Mode)
To launch the hot-reloading development server:
```bash
npm run dev
```
The application will run on **http://localhost:3000** (proxied cleanly by the Node.js/tsx runner and Express middleware layer).

---

## 🛠️ Production Build Process

To compile both the React client assets (using Vite) and bundle the server typescript engine (using Esbuild into a lightweight CJS capsule):
```bash
npm run build
```

This generates:
1. `dist/`: A single precompiled folder incorporating the static client bundles.
2. `dist/server.cjs`: A compressed, self-contained Express server script that bypasses strict ES module lookup mechanisms to guarantee container resilience.
3. Source maps for rapid production error tracing.

### Run in Production Mode Locally:
Once built, you can spin up the unified full-stack engine with Node:
```bash
node dist/server.cjs
```

---

## ☁️ Deployment Guide

### Deployment Target 1: Google Cloud Run (Recommended for Full Stack)
Because the app features a responsive custom Node.js/Express server API layer, Cloud Run is the native choice to host this multi-tiered architecture securely.

#### Configuration Steps:
1. Ensure your `package.json` contains:
   ```json
   "scripts": {
     "start": "node dist/server.cjs"
   }
   ```
2. Build your container image (this uses standard `gcloud` commands):
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/creatoros
   ```
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy creatoros --image gcr.io/[PROJECT_ID]/creatoros --platform managed --allow-unauthenticated --port 3000 --set-env-vars GEMINI_API_KEY="your-gemini-key",SUPABASE_URL="https://...",SUPABASE_ANON_KEY="..."
   ```

### Deployment Target 2: Vercel (For Frontend-Only SPA)
If you wish to deploy the frontend-only client as a fully single-page application (bypassing the custom Express API and using Client/Browser logic), you can host natively on Vercel:

#### Configuration Steps:
1. Import your repository into the Vercel Dashboard.
2. Select **Vite** as your preset framework.
3. Configure **Build Command**: `vite build`
4. Configure **Output Directory**: `dist`
5. Input your Environment Variables (`VITE_` prefixed if you call them directly in browser-only logic) in the Vercel console interface.

---

## 📁 Repository Structure & Download/Upload Manifest

When downloading this project or pushing it to a clean GitHub repository, keep only productive source files.

### FILES & FOLDERS TO INCLUDE (Push to GitHub):
* `src/` (Entire client components, context, and visual views)
* `server.ts` (Full-stack API & Vite middleware router)
* `package.json` / `package-lock.json` (Required manifest & dependency locks)
* `index.html` (Primary SPA mounting layout)
* `tsconfig.json` (TypeScript parameters)
* `vite.config.ts` (Build system pipelines and CSS configuration)
* `metadata.json` (System metrics and permissions)
* `.env.example` (Template environment file)
* `.gitignore` (Source excludes)
* `README.md` (Setup instructions)

### CRITICAL EXCLUDE LIST (Do NOT Commit/Upload):
* `node_modules/` (Local dependencies - will be rebuilt using `npm install`)
* `dist/` (Surgical build outcomes)
* `.env` (Private production secrets)
* `.DS_Store` / Log files
