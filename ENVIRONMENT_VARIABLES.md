# Environment Variables Documentation

Complete reference for all environment variables in AI 360 - Auto-Build Deployable Journeys.

---

## Quick Start

### No Configuration Needed

The application works **immediately** without any environment variables. All features are enabled with sensible defaults.

### Optional Customization

To customize behavior, create a `.env.local` file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your preferred values.

---

## Environment Files

### File Priority (highest to lowest)

1. `.env.local` - Local overrides (gitignored, use for development)
2. `.env.development` - Development defaults (can be committed)
3. `.env.production` - Production defaults (can be committed)
4. `.env` - Global defaults (can be committed)

### Which File to Use

**For local development:**
- Use `.env.local` (never committed)
- Overrides all other env files

**For team-wide defaults:**
- Use `.env.development` (committed to repo)
- Shared across team members

**For deployment:**
- Set variables directly on hosting platform
- Don't rely on `.env.production` file

---

## Current Configuration Variables

### Application Settings

#### NODE_ENV
- **Type:** `string`
- **Values:** `development` | `production` | `test`
- **Default:** `development`
- **Required:** No
- **Description:** Node environment mode
- **Usage:**
  ```env
  NODE_ENV=development
  ```

#### PORT
- **Type:** `number`
- **Default:** `3000`
- **Required:** No
- **Description:** Port for development server
- **Usage:**
  ```env
  PORT=3001
  ```
- **Note:** Production port is set by hosting platform

#### NEXT_PUBLIC_APP_URL
- **Type:** `string`
- **Default:** `http://localhost:3000`
- **Required:** No
- **Description:** Full application URL (used for redirects and API calls)
- **Usage:**
  ```env
  # Development
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  
  # Production
  NEXT_PUBLIC_APP_URL=https://yourdomain.com
  ```

---

## Feature Flags

### NEXT_PUBLIC_ENABLE_SPEECH
- **Type:** `boolean`
- **Default:** `true`
- **Required:** No
- **Description:** Enable/disable speech recognition feature
- **Usage:**
  ```env
  NEXT_PUBLIC_ENABLE_SPEECH=true
  ```
- **Impact:** 
  - `true`: Speech input option available on input screen
  - `false`: Speech input option hidden

### NEXT_PUBLIC_ENABLE_UPLOAD
- **Type:** `boolean`
- **Default:** `true`
- **Required:** No
- **Description:** Enable/disable file upload feature
- **Usage:**
  ```env
  NEXT_PUBLIC_ENABLE_UPLOAD=true
  ```
- **Impact:**
  - `true`: Upload option available on landing page
  - `false`: Upload option hidden

### NEXT_PUBLIC_ENABLE_DARK_MODE
- **Type:** `boolean`
- **Default:** `true`
- **Required:** No
- **Description:** Enable/disable dark mode toggle
- **Usage:**
  ```env
  NEXT_PUBLIC_ENABLE_DARK_MODE=true
  ```
- **Impact:**
  - `true`: Dark mode toggle shown in top nav
  - `false`: Dark mode toggle hidden

---

## Mock Configuration

### NEXT_PUBLIC_USE_MOCK_AI
- **Type:** `boolean`
- **Default:** `true`
- **Required:** No
- **Description:** Use mock AI parser (Travel Insurance scenario)
- **Usage:**
  ```env
  NEXT_PUBLIC_USE_MOCK_AI=true
  ```
- **Impact:**
  - `true`: Always generates Travel Insurance journey
  - `false`: Uses real AI parsing (requires AI service configuration)

### NEXT_PUBLIC_MOCK_API_DELAY
- **Type:** `number` (milliseconds)
- **Default:** `2000`
- **Required:** No
- **Description:** Simulated processing delay for mock AI
- **Usage:**
  ```env
  NEXT_PUBLIC_MOCK_API_DELAY=1500
  ```
- **Impact:** Time in milliseconds before showing generated form

---

## Future Integration Variables

### AI Services (Not Currently Active)

#### OPENAI_API_KEY
- **Type:** `string`
- **Required:** When using OpenAI
- **Description:** OpenAI API key for real AI parsing
- **Usage:**
  ```env
  OPENAI_API_KEY=sk-proj-abcd1234...
  ```
- **Where to get:** https://platform.openai.com/api-keys
- **Security:** Server-side only (no NEXT_PUBLIC_ prefix)

#### OPENAI_MODEL
- **Type:** `string`
- **Default:** `gpt-4`
- **Required:** No
- **Description:** OpenAI model to use
- **Usage:**
  ```env
  OPENAI_MODEL=gpt-4
  ```
- **Options:** `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo`

#### OPENAI_MAX_TOKENS
- **Type:** `number`
- **Default:** `2000`
- **Required:** No
- **Description:** Maximum tokens for AI response
- **Usage:**
  ```env
  OPENAI_MAX_TOKENS=3000
  ```

---

### Database (Not Currently Active)

#### NEXT_PUBLIC_SUPABASE_URL
- **Type:** `string`
- **Required:** When using Supabase
- **Description:** Supabase project URL
- **Usage:**
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
  ```
- **Where to get:** Supabase Dashboard → Settings → API

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Type:** `string`
- **Required:** When using Supabase
- **Description:** Supabase anonymous key (public)
- **Usage:**
  ```env
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  ```
- **Where to get:** Supabase Dashboard → Settings → API
- **Note:** Safe to expose (anon key, not service role key)

#### SUPABASE_SERVICE_ROLE_KEY
- **Type:** `string`
- **Required:** For admin operations
- **Description:** Supabase service role key (secret)
- **Usage:**
  ```env
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
  ```
- **Security:** Server-side only, very sensitive
- **Warning:** Never expose this key to the browser

#### DATABASE_URL
- **Type:** `string`
- **Required:** When using PostgreSQL directly
- **Description:** PostgreSQL connection string
- **Usage:**
  ```env
  DATABASE_URL=postgresql://user:password@localhost:5432/ai360
  ```

#### MONGODB_URI
- **Type:** `string`
- **Required:** When using MongoDB
- **Description:** MongoDB connection string
- **Usage:**
  ```env
  MONGODB_URI=mongodb://localhost:27017/ai360
  ```

---

### Authentication (Not Currently Active)

#### NEXTAUTH_URL
- **Type:** `string`
- **Required:** When using NextAuth
- **Description:** NextAuth canonical URL
- **Usage:**
  ```env
  # Development
  NEXTAUTH_URL=http://localhost:3000
  
  # Production
  NEXTAUTH_URL=https://yourdomain.com
  ```

#### NEXTAUTH_SECRET
- **Type:** `string`
- **Required:** Yes (for NextAuth)
- **Description:** Secret for encrypting tokens
- **Usage:**
  ```env
  NEXTAUTH_SECRET=your-secret-here
  ```
- **Generate:**
  ```bash
  openssl rand -base64 32
  ```

#### OAuth Provider Keys
- **Required:** When using OAuth
- **Examples:**
  ```env
  # GitHub
  GITHUB_ID=your-github-oauth-app-id
  GITHUB_SECRET=your-github-oauth-secret
  
  # Google
  GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your-client-secret
  
  # Microsoft
  AZURE_AD_CLIENT_ID=your-azure-client-id
  AZURE_AD_CLIENT_SECRET=your-azure-secret
  AZURE_AD_TENANT_ID=your-tenant-id
  ```

---

### Analytics & Monitoring (Not Currently Active)

#### NEXT_PUBLIC_GA_MEASUREMENT_ID
- **Type:** `string`
- **Required:** When using Google Analytics
- **Description:** Google Analytics Measurement ID
- **Usage:**
  ```env
  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
  ```
- **Where to get:** Google Analytics → Admin → Data Streams

#### SENTRY_DSN
- **Type:** `string`
- **Required:** When using Sentry
- **Description:** Sentry Data Source Name
- **Usage:**
  ```env
  SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
  ```
- **Where to get:** Sentry → Project Settings → Client Keys

---

### External Services (Not Currently Active)

#### Email Services

```env
# SendGrid
SENDGRID_API_KEY=SG.abc123...

# Resend
RESEND_API_KEY=re_abc123...

# Mailgun
MAILGUN_API_KEY=key-abc123...
MAILGUN_DOMAIN=mg.yourdomain.com
```

#### File Storage

```env
# AWS S3
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

---

## Development Tools

### ANALYZE
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Enable webpack bundle analyzer
- **Usage:**
  ```bash
  ANALYZE=true npm run build
  ```
- **Output:** Opens bundle visualization in browser

### DEBUG
- **Type:** `string`
- **Default:** (none)
- **Description:** Enable debug logging
- **Usage:**
  ```env
  DEBUG=*
  ```
- **Patterns:**
  - `*` - Everything
  - `next:*` - Next.js only
  - `app:*` - Application only

### NEXT_TELEMETRY_DISABLED
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Disable Next.js anonymous telemetry
- **Usage:**
  ```env
  NEXT_TELEMETRY_DISABLED=1
  ```

---

## Security Variables (Production)

### CORS_ORIGINS
- **Type:** `string` (comma-separated)
- **Description:** Allowed CORS origins
- **Usage:**
  ```env
  CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
  ```

### Rate Limiting

```env
# Maximum requests per window
RATE_LIMIT_MAX_REQUESTS=100

# Time window in milliseconds (default: 15 minutes)
RATE_LIMIT_WINDOW_MS=900000
```

---

## Platform-Specific Variables

### Vercel

Variables automatically set by Vercel:
- `VERCEL` - Always `1` on Vercel
- `VERCEL_ENV` - `production`, `preview`, or `development`
- `VERCEL_URL` - Deployment URL

### Netlify

Variables automatically set by Netlify:
- `NETLIFY` - Always `true` on Netlify
- `CONTEXT` - `production`, `deploy-preview`, or `branch-deploy`
- `DEPLOY_URL` - Deployment URL

---

## Best Practices

### Security

1. **Never commit `.env.local`**
   - Already in `.gitignore`
   - Contains sensitive local config

2. **Use NEXT_PUBLIC_ wisely**
   - Only for non-sensitive config
   - Exposed to browser/clients
   - Never for API keys or secrets

3. **Server-side secrets**
   - No `NEXT_PUBLIC_` prefix
   - Only accessible in API routes
   - Safe for sensitive data

4. **Rotate secrets regularly**
   - API keys
   - Database passwords
   - Auth secrets

### Organization

1. **Group related variables**
   ```env
   # Database
   DATABASE_URL=...
   DB_POOL_SIZE=...
   
   # Email
   SMTP_HOST=...
   SMTP_PORT=...
   ```

2. **Use comments**
   ```env
   # Production database (read/write)
   DATABASE_URL=postgresql://...
   
   # Analytics database (read-only)
   ANALYTICS_DB_URL=postgresql://...
   ```

3. **Document required vs optional**
   ```env
   # Required for production
   NEXTAUTH_SECRET=...
   
   # Optional - defaults to false
   ENABLE_BETA_FEATURES=true
   ```

---

## Troubleshooting

### Variable Not Working

1. **Check spelling**
   - Variables are case-sensitive
   - `NEXT_PUBLIC_API_URL` ≠ `NEXT_PUBLIC_api_url`

2. **Restart server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```
   - Environment variables are loaded at startup
   - Changes require restart

3. **Check file location**
   - Must be in project root
   - Named exactly `.env.local`

4. **Verify syntax**
   ```env
   # ✅ Correct
   API_KEY=abc123
   
   # ❌ Wrong (spaces)
   API_KEY = abc123
   
   # ❌ Wrong (quotes not needed)
   API_KEY="abc123"
   ```

### NEXT_PUBLIC_ Not Available in Browser

1. **Check prefix**
   - Must start with `NEXT_PUBLIC_`
   - Case-sensitive

2. **Restart development server**
   - Changes require rebuild

3. **Check build**
   ```bash
   npm run build
   # Variables are embedded at build time
   ```

### Different Values in Dev vs Production

**Expected behavior:**
- `.env.local` - Development only
- Platform variables - Production only

**Solution:**
- Set production values on hosting platform
- Don't rely on committed `.env.production`

---

## Examples

### Minimal Setup (Current)

No `.env.local` needed! Application works with defaults.

### Custom Port

```env
# .env.local
PORT=3001
```

```bash
npm run dev
# Runs on http://localhost:3001
```

### Enable All Features

```env
# .env.local
NEXT_PUBLIC_ENABLE_SPEECH=true
NEXT_PUBLIC_ENABLE_UPLOAD=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_MOCK_API_DELAY=1000
```

### Production with Supabase

```env
# Set on hosting platform
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## Summary

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| NODE_ENV | No | `development` | Environment mode |
| PORT | No | `3000` | Dev server port |
| NEXT_PUBLIC_APP_URL | No | `http://localhost:3000` | App URL |
| NEXT_PUBLIC_ENABLE_SPEECH | No | `true` | Speech input |
| NEXT_PUBLIC_ENABLE_UPLOAD | No | `true` | File upload |
| NEXT_PUBLIC_ENABLE_DARK_MODE | No | `true` | Dark mode |
| NEXT_PUBLIC_MOCK_API_DELAY | No | `2000` | Mock delay (ms) |

**All other variables are for future integrations and not currently required.**

---

**Last Updated:** November 4, 2025  
**Version:** 1.1.0  
**Status:** Complete ✅
