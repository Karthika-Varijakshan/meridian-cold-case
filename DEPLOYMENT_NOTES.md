# Deployment Prep

## Code changes made
1. **`frontend/src/services/api.js`** — API base URL is now
   `import.meta.env.VITE_API_URL || '/api'`. Locally this still falls back
   to the relative path (Vite's dev proxy handles it, unchanged). In
   production, set `VITE_API_URL` to your deployed backend's full URL.
2. **`backend/main.py`** — CORS origins now read from an `ALLOWED_ORIGINS`
   env var (comma-separated for multiple), defaulting to `*` so local dev
   is untouched. Set this to your real frontend URL once deployed.
3. **`.gitignore`** (new, project root) — excludes `node_modules`,
   `.venv`, `dist`, `__pycache__`, and any `.env` files from being pushed
   to GitHub. There wasn't one in what I had, so nothing was being
   protected from accidental commits before this.
4. **`frontend/.env.example`** and **`backend/.env.example`** (new) —
   document the env vars each side needs, without containing real secrets.

## Deployment steps (frontend: Vercel, backend: Render — both free tiers)

### 1. Push to GitHub
If this project isn't already a git repo pushed to GitHub, you'll need
that first — both Vercel and Render deploy from a GitHub repo.
```powershell
cd C:\Users\KARTHIKA\.gemini\antigravity\scratch\meridian-cold-case
git init
git add .
git commit -m "Deploy-ready MERIDIAN"
```
Then create a new repo on github.com and follow its "push an existing
repository" instructions.

### 2. Deploy the backend first (Render)
- Sign up at render.com (GitHub login is fastest)
- **New +** → **Web Service** → connect your repo
- **Root Directory:** `backend`
- **Environment:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add environment variables if you want them (`OPENAI_API_KEY` is
  optional — the app works without it, just uses the regex-based entity
  extraction instead of the LLM path)
- Deploy — Render gives you a URL like
  `https://meridian-backend-xxxx.onrender.com`
- **Note:** Render's free tier spins down after inactivity and takes
  ~30-60s to wake up on the next request — expect a slow first load if
  no one's used it in a while.

### 3. Deploy the frontend (Vercel)
- Sign up at vercel.com (GitHub login)
- **Add New** → **Project** → import your repo
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:** add `VITE_API_URL` =
  `https://meridian-backend-xxxx.onrender.com/api` (your actual Render
  URL from step 2, with `/api` on the end)
- Deploy — Vercel gives you a URL like
  `https://meridian-cold-case.vercel.app`

### 4. Lock down CORS (optional but recommended)
Once you have your real Vercel URL, go back to Render → your backend
service → Environment → add:
```
ALLOWED_ORIGINS=https://meridian-cold-case.vercel.app
```
This restricts the backend to only accept requests from your actual
frontend instead of any website.

### 5. Test the live link
Visit your Vercel URL, confirm the landing page loads, click "Launch
Platform", confirm cases load on the dashboard (this proves the frontend
is actually reaching the deployed backend, not just rendering static UI).

## What I could not do from here
I can't create accounts on Vercel/Render or click through their UI on
your behalf — that needs your own GitHub/Vercel/Render logins. What I
could do (and did) was make sure the code itself won't break once it's
running on two different domains, since that's the part that's easy to
get wrong and hard to debug remotely. If you hit an error during
deployment, paste me the exact error from Render's or Vercel's build
logs and I'll help you fix it.
