# Deployment Guide

Complete guide for deploying AI 360 - Auto-Build Deployable Journeys to production.

---

## Overview

This Next.js application can be deployed to various platforms. We recommend Vercel for the easiest deployment experience, but provide instructions for multiple platforms.

---

## Prerequisites

Before deploying:

1. ✅ Application builds successfully locally (`npm run build`)
2. ✅ All tests pass (`npm run lint`)
3. ✅ Environment variables configured (if any)
4. ✅ Git repository set up
5. ✅ Account on your chosen platform

---

## Vercel (Recommended)

Vercel is created by the makers of Next.js and provides the best experience.

### Method 1: Vercel CLI

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Login to Vercel**
```bash
vercel login
```

**Step 3: Deploy**
```bash
# From project root
vercel

# Or for production
vercel --prod
```

**Step 4: Follow prompts**
- Set up and deploy: Yes
- Which scope: Select your account
- Link to existing project: No (first time)
- Project name: ai-360-auto-build (or your choice)
- Directory: ./ (current directory)
- Override settings: No

**Your app is now live!** 🎉

The CLI will provide a URL like: `https://ai-360-auto-build.vercel.app`

### Method 2: Vercel Dashboard (GUI)

**Step 1: Push to Git**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

**Step 2: Import to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. Click "Deploy"

**Done!** Vercel will build and deploy your app.

### Environment Variables (Vercel)

If you need environment variables:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add variables:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://api.example.com`
   - Environment: Production, Preview, Development

---

## Netlify

### Method 1: Netlify CLI

**Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

**Step 2: Login**
```bash
netlify login
```

**Step 3: Initialize**
```bash
netlify init
```

**Step 4: Deploy**
```bash
# Build first
npm run build

# Deploy
netlify deploy --prod
```

### Method 2: Netlify Dashboard

**Step 1: Push to Git**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

**Step 2: Import to Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to Git provider
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory: (leave empty)

**Note**: You may need to add a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## Railway

**Step 1: Push to Git**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

**Step 2: Deploy to Railway**
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway auto-detects Next.js
6. Click "Deploy"

**Configuration (if needed):**
- Start Command: `npm start`
- Build Command: `npm run build`
- Node Version: 18

---

## Render

**Step 1: Push to Git**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

**Step 2: Create Web Service**
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your Git repository
4. Configure:
   - Name: ai-360-auto-build
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Node Version: 18

---

## AWS Amplify

**Step 1: Push to Git**
```bash
git push -u origin main
```

**Step 2: Deploy via AWS Console**
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your Git provider
4. Select repository and branch
5. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
6. Deploy

---

## DigitalOcean App Platform

**Step 1: Push to Git**
```bash
git push -u origin main
```

**Step 2: Create App**
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Choose "GitHub" or "GitLab"
4. Select repository
5. Configure:
   - Type: Web Service
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - HTTP Port: 3000
6. Choose plan (Basic is fine for testing)
7. Launch

---

## Docker Deployment

### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Create .dockerignore

```
node_modules
.next
.git
.gitignore
README.md
.env*.local
```

### Build and Run

```bash
# Build the image
docker build -t ai-360-app .

# Run the container
docker run -p 3000:3000 ai-360-app
```

### Deploy to Docker Hub

```bash
# Tag the image
docker tag ai-360-app yourusername/ai-360-app:latest

# Push to Docker Hub
docker push yourusername/ai-360-app:latest
```

---

## Environment Variables

### Required Variables

Currently, the app doesn't require environment variables. In the future, you may need:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Future: AI Integration
OPENAI_API_KEY=sk-...

# Future: Database
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJ...
```

### Setting Variables by Platform

**Vercel:**
- Dashboard → Project → Settings → Environment Variables

**Netlify:**
- Site settings → Build & deploy → Environment

**Railway:**
- Project → Variables tab

**Render:**
- Dashboard → Service → Environment

**AWS Amplify:**
- App settings → Environment variables

---

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS:
   - Type: `CNAME`
   - Name: `www` (or `@` for root)
   - Value: `cname.vercel-dns.com`

### Netlify
1. Site settings → Domain management
2. Add custom domain
3. Configure DNS (automatic with Netlify DNS)

### Other Platforms
Follow platform-specific documentation for domain configuration.

---

## SSL/HTTPS

All recommended platforms provide **automatic SSL certificates** via Let's Encrypt:
- ✅ Vercel: Automatic
- ✅ Netlify: Automatic
- ✅ Railway: Automatic
- ✅ Render: Automatic
- ✅ AWS Amplify: Automatic

No configuration needed!

---

## Performance Optimization

### Before Deploying

1. **Optimize Images**
   - Use Next.js Image component (already done if using ImageWithFallback)
   - Compress images

2. **Code Splitting**
   - Already handled by Next.js

3. **Bundle Analysis**
   ```bash
   npm install -D @next/bundle-analyzer
   ```

   Add to `next.config.js`:
   ```javascript
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });

   module.exports = withBundleAnalyzer({
     // your existing config
   });
   ```

   Run:
   ```bash
   ANALYZE=true npm run build
   ```

4. **Cache Strategy**
   - Already optimized by Next.js

---

## Monitoring

### Vercel Analytics

Free built-in analytics:
1. Go to Project → Analytics
2. View performance metrics

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

Initialize:
```bash
npx @sentry/wizard -i nextjs
```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Post-Deployment Checklist

After deploying:

- [ ] App is accessible via URL
- [ ] All pages load correctly
- [ ] Dark mode toggle works
- [ ] Speech input works (if using HTTPS)
- [ ] Form submission works
- [ ] Navigation between screens works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Performance is acceptable (Lighthouse score)

---

## Troubleshooting

### Build Fails

**Issue**: Build errors during deployment

**Solution**:
1. Ensure local build works: `npm run build`
2. Check Node.js version matches (18+)
3. Verify all dependencies are in package.json
4. Check for missing environment variables

### App Crashes on Start

**Issue**: Application crashes after deployment

**Solution**:
1. Check logs on your platform
2. Verify start command: `npm start`
3. Ensure port is correct (3000 or platform-specific)
4. Check for missing dependencies

### 404 Errors

**Issue**: Pages not found

**Solution**:
1. Verify output directory is set to `.next`
2. Check routing configuration
3. Ensure all files are committed to Git

---

## Costs

### Free Tiers (Hobby/Personal Projects)

- **Vercel**: Free for personal projects
- **Netlify**: 300 build minutes/month
- **Railway**: $5 free credit/month
- **Render**: Free tier available
- **AWS Amplify**: Free tier for 12 months

### Paid Plans

Upgrade when you need:
- More bandwidth
- Custom domains
- Team collaboration
- Priority support
- SLA guarantees

---

## Support

For deployment issues:

1. **Platform Docs**:
   - [Vercel](https://vercel.com/docs)
   - [Netlify](https://docs.netlify.com/)
   - [Railway](https://docs.railway.app/)
   - [Render](https://render.com/docs)

2. **Next.js Deployment**: https://nextjs.org/docs/deployment

3. **Community**: Next.js Discord, Stack Overflow

---

## Summary

| Platform | Difficulty | Free Tier | Best For |
|----------|-----------|-----------|----------|
| Vercel | ⭐ Easy | ✅ Yes | Next.js apps |
| Netlify | ⭐⭐ Easy | ✅ Yes | JAMstack |
| Railway | ⭐⭐ Easy | ✅ Yes ($5) | Full-stack |
| Render | ⭐⭐ Medium | ✅ Yes | Containers |
| AWS Amplify | ⭐⭐⭐ Medium | ✅ 12 months | AWS ecosystem |

**Recommendation**: Start with Vercel for simplest deployment.

---

**Last Updated**: November 4, 2025  
**Next.js Version**: 15.0.3  
**Deployment Status**: Ready ✅
