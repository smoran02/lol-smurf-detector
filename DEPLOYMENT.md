# Deployment Guide

Deploy LoL Smurf Detector using Vercel (frontend) + Render (backend).

## Prerequisites

- GitHub account with this repo
- Vercel account (free): https://vercel.com
- Render account (free): https://render.com
- Riot API key: https://developer.riotgames.com

---

## Step 1: Deploy Backend to Render

### 1.1 Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Configure:
   - **Name:** `smurf-detector-db`
   - **Region:** Oregon (or closest to you)
   - **Plan:** Free
4. Click **Create Database**
5. Copy the **Internal Database URL** (starts with `postgresql://`)

### 1.2 Deploy Backend Service

1. Click **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name:** `lol-smurf-detector-api`
   - **Region:** Same as database
   - **Branch:** `master`
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

4. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `RIOT_API_KEY` | Your Riot API key |
   | `DATABASE_URL` | The Internal Database URL from step 1.1 (change `postgresql://` to `postgresql+asyncpg://`) |
   | `CORS_ORIGINS` | `http://localhost:3000` (update after Vercel deploy) |
   | `DEBUG` | `false` |

5. Click **Create Web Service**
6. Wait for deploy (~2-3 min)
7. Copy your backend URL (e.g., `https://lol-smurf-detector-api.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repo
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`

### 2.2 Add Environment Variables

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | Your Render backend URL (e.g., `https://lol-smurf-detector-api.onrender.com`) |

### 2.3 Deploy

1. Click **Deploy**
2. Wait for build (~1-2 min)
3. Copy your frontend URL (e.g., `https://lol-smurf-detector.vercel.app`)

---

## Step 3: Update CORS

Go back to Render and update the `CORS_ORIGINS` environment variable:

```
http://localhost:3000,https://your-app.vercel.app
```

Replace `your-app.vercel.app` with your actual Vercel URL.

The backend will automatically redeploy.

---

## Step 4: Test

1. Visit your Vercel URL
2. Enter a Riot ID
3. Verify the analysis works

---

## Troubleshooting

### Backend sleeping (30s delay)
Render free tier sleeps after 15min of inactivity. First request takes ~30s to wake up. This is normal for free tier.

### CORS errors
Make sure `CORS_ORIGINS` includes your exact Vercel URL (with `https://`).

### Database connection errors
Ensure `DATABASE_URL` uses `postgresql+asyncpg://` (not just `postgresql://`).

### API key errors
Riot dev keys expire every 24 hours. Get a new one or apply for production key.

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS as instructed

### Render
1. Go to Service Settings → Custom Domains
2. Add your domain
3. Update DNS as instructed

Remember to update `CORS_ORIGINS` with any new domains!
