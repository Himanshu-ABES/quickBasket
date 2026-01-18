# Deploying quickBasket Frontend to Vercel

This guide walks you through deploying the quickBasket frontend to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier available)
- A [GitHub account](https://github.com) with your repository pushed
- Your [Supabase project](https://supabase.com/dashboard) credentials

## Step-by-Step Deployment Guide

### Step 1: Push Your Code to GitHub

Make sure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to your `quickBasket` repository
4. If you don't see your repo, click **"Adjust GitHub App Permissions"** to grant access

### Step 3: Configure Project Settings

In the configuration screen, set the following:

| Setting              | Value                           |
| -------------------- | ------------------------------- |
| **Framework Preset** | Vite                            |
| **Root Directory**   | `frontend`                      |
| **Build Command**    | `npm run build` (auto-detected) |
| **Output Directory** | `dist` (auto-detected)          |
| **Install Command**  | `npm install` (auto-detected)   |

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add the following:

| Name                     | Value                         |
| ------------------------ | ----------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL     |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

**To find your Supabase credentials:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your site will be live at `https://your-project.vercel.app`

## Post-Deployment

### Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain and follow the DNS configuration instructions

### Configure Supabase for Production

Add your Vercel domain to Supabase allowed origins:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add your Vercel URL to **Site URL** and **Redirect URLs**

### Automatic Deployments

Vercel automatically deploys when you push to your default branch. You can also:

- Get preview deployments for pull requests
- Set up different environment variables for preview vs production

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure environment variables are correctly set in Vercel
- Check the build logs for specific errors

### Supabase Connection Issues

- Verify environment variables are correctly named (must start with `VITE_`)
- Check that your Supabase project URL and anon key are correct
- Ensure your Supabase project is active and not paused

### Routing Issues (404 on Refresh)

The `vercel.json` file already includes rewrites for client-side routing. If you still have issues, verify the file exists in the `frontend` folder.

## Environment Variables Reference

| Variable                 | Description                        | Required |
| ------------------------ | ---------------------------------- | -------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL          | Yes      |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Yes      |

---

**Need help?** Check out the [Vercel Documentation](https://vercel.com/docs) or [Supabase Documentation](https://supabase.com/docs).
