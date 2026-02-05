# Deployment Guide 🌍

This guide explains how to take the **Auto Post App** from your local computer and put it on the internet so others can use it.

## 1. Database Migration (SQLite -> PostgreSQL)
Local development uses **SQLite** (a file), but most serverless hosts (like Vercel) require a real database server. We recommend **Neon** (Free Tier PostgreSQL).

1.  **Create a Neon Account**: Go to [neon.tech](https://neon.tech) and create a project.
2.  **Get Connection String**: Copy the Postgres connection string (e.g., `postgres://user:pass@host/neondb...`).
3.  **Update Prisma**:
    *   Open `prisma/schema.prisma`
    *   Change `provider = "sqlite"` to `provider = "postgresql"`
    *   Delete the `migrations` folder if it exists.
4.  **Push Schema**:
    ```bash
    # In your terminal (with the generic connection string in .env)
    npx prisma db push
    ```

## 2. File Storage (Switching from Local)
The current app saves uploads to `public/uploads`. On Vercel, these files will disappear when you redeploy. You need cloud storage.

**Recommended**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
1.  Run `npm install @vercel/blob`
2.  Update `/api/upload/route.ts` to use `put` from `@vercel/blob` instead of `fs.writeFile`.

## 3. Deploying to Vercel
1.  Push your code to a **GitHub Repository**.
2.  Go to [Vercel](https://vercel.com) -> **Add New Project**.
3.  Import your repository.
4.  **Environment Variables**:
    *   Add `DATABASE_URL` (Your Neon connection string).
    *   Add your Social API Keys (`LINKEDIN_CLIENT_ID`, etc).
5.  Click **Deploy**.

## 4. Configuring Social Logins
For the "Connect" buttons to work on the live site:
1.  Go to Facebook/LinkedIn Developer portals.
2.  Update the **Redirect URIs** to match your new domain:
    *   Old: `http://localhost:3000/api/auth/linkedin/callback`
    *   New: `https://your-app-name.vercel.app/api/auth/linkedin/callback`

## Alternative: VPS hosting (Easier transition)
If you want to keep using **SQLite** and **Local Uploads** without code changes:
1.  Rent a cheap VPS (e.g., DigitalOcean Droplet, ~$6/mo).
2.  Install Docker or Node.js.
3.  Clone your repo and run `npm run build && npm start`.
4.  Use Nginx to point your domain to port 3000.
*This preserves the local filesystem, so your database and uploads stay safe.*
