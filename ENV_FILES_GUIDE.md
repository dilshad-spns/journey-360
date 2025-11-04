# Environment Files Guide

Understanding the environment file structure in AI 360.

---

## File Structure

```
project-root/
├── .env                    # Default values (committed to repo) ✅
├── .env.local             # Your local overrides (gitignored) 🔒
├── .env.example           # Template with all options (committed) 📝
├── .env.development       # Development defaults (optional)
├── .env.production        # Production defaults (optional)
└── .env.test              # Test environment (optional)
```

---

## Current Files

### .env (Committed)
- **Purpose:** Default values for all optional variables
- **Status:** Committed to repository
- **Contains:** Non-sensitive defaults only
- **Usage:** Reference and defaults

```env
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_SPEECH=true
NEXT_PUBLIC_ENABLE_UPLOAD=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_USE_MOCK_AI=true
NEXT_PUBLIC_MOCK_API_DELAY=2000
```

### .env.example (Committed)
- **Purpose:** Template showing all possible variables
- **Status:** Committed to repository
- **Contains:** All current + future variables with documentation
- **Usage:** Copy to create `.env.local`

### .env.local (Gitignored)
- **Purpose:** Your personal local overrides
- **Status:** Gitignored (never committed)
- **Contains:** Your custom values, secrets, API keys
- **Usage:** Local development customization

---

## How It Works

### Loading Order (Priority: High → Low)

1. **`.env.local`** - Highest priority, overrides everything
2. **`.env.development`** / **`.env.production`** / **`.env.test`** - Environment-specific
3. **`.env`** - Lowest priority, defaults

**Example:**
```
.env.local:          PORT=3001
.env.development:    PORT=3005
.env:                PORT=3000

Result: PORT=3001 (from .env.local)
```

### Current Behavior

**Without any .env files:**
- ✅ App works perfectly with hardcoded defaults
- ✅ All features enabled
- ✅ Runs on port 3000

**With .env only:**
- ✅ Uses values from .env (same as defaults)
- ✅ Clear documentation of what's configurable

**With .env.local:**
- ✅ Overrides .env values
- ✅ Your personal settings
- ✅ Safe for secrets

---

## Required Variables

### To Run Application

**NONE!** 🎉

The application runs perfectly without any environment variables.

### Variables in .env

All variables in `.env` are **optional defaults**:

| Variable | Default | Required |
|----------|---------|----------|
| NODE_ENV | `development` | ❌ No |
| PORT | `3000` | ❌ No |
| NEXT_PUBLIC_APP_URL | `http://localhost:3000` | ❌ No |
| NEXT_PUBLIC_ENABLE_SPEECH | `true` | ❌ No |
| NEXT_PUBLIC_ENABLE_UPLOAD | `true` | ❌ No |
| NEXT_PUBLIC_ENABLE_DARK_MODE | `true` | ❌ No |
| NEXT_PUBLIC_USE_MOCK_AI | `true` | ❌ No |
| NEXT_PUBLIC_MOCK_API_DELAY | `2000` | ❌ No |

---

## Common Scenarios

### Scenario 1: First Time Setup

**Goal:** Just run the app

**Steps:**
```bash
npm install
npm run dev
```

**Result:** Uses defaults from `.env`

---

### Scenario 2: Change Port

**Goal:** Run on port 3001 instead of 3000

**Option A - Command Line:**
```bash
PORT=3001 npm run dev
```

**Option B - .env.local file:**
```bash
# Create .env.local
echo "PORT=3001" > .env.local

# Run normally
npm run dev
```

**Result:** App runs on http://localhost:3001

---

### Scenario 3: Disable a Feature

**Goal:** Hide speech recognition option

**Steps:**
```bash
# Create .env.local
cp .env.example .env.local

# Edit .env.local
NEXT_PUBLIC_ENABLE_SPEECH=false
```

**Result:** Speech input option hidden on input screen

---

### Scenario 4: Faster Mock Processing

**Goal:** Reduce AI processing delay

**Steps:**
```bash
# In .env.local
NEXT_PUBLIC_MOCK_API_DELAY=500
```

**Result:** Form appears after 500ms instead of 2000ms

---

### Scenario 5: Production Deployment

**Goal:** Deploy to Vercel/Netlify

**Steps:**
1. Don't create .env.local on server
2. Set variables on hosting platform:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

**Result:** Production-ready deployment

---

## Best Practices

### ✅ DO

1. **Keep .env with defaults**
   - Committed to repo
   - Non-sensitive values only
   - Documents what's configurable

2. **Use .env.local for overrides**
   - Gitignored automatically
   - Personal settings
   - Safe for API keys (server-side only)

3. **Use .env.example as template**
   - Shows all possible variables
   - Documents future integrations
   - Helpful for team members

4. **Set production vars on platform**
   - Vercel dashboard
   - Netlify settings
   - Railway variables tab

### ❌ DON'T

1. **Don't commit .env.local**
   - Already gitignored
   - Contains personal settings
   - May have secrets

2. **Don't put secrets in NEXT_PUBLIC_***
   - Exposed to browser
   - Visible in client-side code
   - Use server-side vars for secrets

3. **Don't delete .env**
   - Provides defaults
   - Documents configuration
   - Helps new developers

4. **Don't hardcode values in code**
   - Use env vars instead
   - Easier to change
   - Platform-agnostic

---

## Variable Types

### NEXT_PUBLIC_* (Client-Side)

**Exposed to browser:** ✅ Yes

**Usage:**
```typescript
// Available in any component
const apiUrl = process.env.NEXT_PUBLIC_APP_URL;
```

**Security:** 
- Safe for non-sensitive config
- **Never** put API keys here
- Visible in browser DevTools

**Examples:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_SPEECH=true
NEXT_PUBLIC_MOCK_API_DELAY=2000
```

### Server-Side Only (No NEXT_PUBLIC_)

**Exposed to browser:** ❌ No

**Usage:**
```typescript
// Only in API routes and server components
const apiKey = process.env.OPENAI_API_KEY;
```

**Security:**
- Safe for secrets
- Only accessible server-side
- Not in client bundle

**Examples:**
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
NEXTAUTH_SECRET=...
```

---

## Troubleshooting

### Changes Not Taking Effect

**Problem:** Updated .env but nothing changed

**Solutions:**

1. **Restart dev server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```
   Environment variables are loaded at startup.

2. **Check file location**
   - Must be in project root
   - Same directory as package.json

3. **Check file name**
   - Exactly `.env.local` (with dot)
   - Not `env.local` or `.env.local.txt`

4. **Clear Next.js cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

### NEXT_PUBLIC_ Variable Not Available

**Problem:** `process.env.NEXT_PUBLIC_X` is undefined

**Solutions:**

1. **Check prefix**
   - Must start with `NEXT_PUBLIC_`
   - Case-sensitive

2. **Restart dev server**
   - Variables embedded at build time

3. **Check .env file**
   - Variable exists
   - No syntax errors
   - No spaces around `=`

### Different Values in Dev vs Prod

**Problem:** Works locally, fails in production

**Solutions:**

1. **Check platform variables**
   - Set on Vercel/Netlify dashboard
   - May differ from local .env.local

2. **Check NODE_ENV**
   ```env
   # Development
   NODE_ENV=development
   
   # Production (set by platform)
   NODE_ENV=production
   ```

3. **Environment-specific files**
   ```
   .env.development  → Used in dev
   .env.production   → Used in prod
   .env.local        → Overrides both
   ```

---

## Examples

### Minimal Setup (Default)

**Files:**
- `.env` (from repo)

**Command:**
```bash
npm run dev
```

**Result:** All defaults, works perfectly

---

### Custom Port

**File: .env.local**
```env
PORT=3001
```

**Command:**
```bash
npm run dev
```

**Result:** Runs on http://localhost:3001

---

### Multiple Customizations

**File: .env.local**
```env
PORT=3001
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_MOCK_API_DELAY=1000
NEXT_PUBLIC_ENABLE_UPLOAD=false
```

**Result:**
- Runs on port 3001
- Faster mock processing (1 second)
- Upload option hidden

---

### Production Setup (Vercel)

**Don't create .env.local on server**

**Set on Vercel dashboard:**
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Optional (future):**
```env
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
NEXTAUTH_SECRET=...
```

---

## Security Checklist

### ✅ Safe Practices

- [x] `.env.local` is gitignored
- [x] API keys in server-side vars (no NEXT_PUBLIC_)
- [x] Secrets on hosting platform
- [x] `.env` has only defaults
- [x] No sensitive data in NEXT_PUBLIC_*

### ⚠️ Security Warnings

**Never commit:**
- `.env.local` (personal overrides)
- API keys
- Passwords
- Secrets

**Never expose:**
- Database credentials
- API keys in NEXT_PUBLIC_*
- Auth secrets

**Always:**
- Use `.env.local` for local secrets
- Set production secrets on platform
- Use server-side vars for sensitive data
- Rotate secrets regularly

---

## Quick Reference

### File Priority
```
.env.local           (highest - your overrides)
.env.development     (environment-specific)
.env                 (lowest - defaults)
```

### Create Local Overrides
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### Check Current Values
```bash
# In Next.js app
console.log(process.env.NEXT_PUBLIC_APP_URL);
```

### Common Variables
```env
# Application
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Features
NEXT_PUBLIC_ENABLE_SPEECH=true
NEXT_PUBLIC_ENABLE_UPLOAD=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true

# Mock
NEXT_PUBLIC_USE_MOCK_AI=true
NEXT_PUBLIC_MOCK_API_DELAY=2000
```

---

## Summary

| File | Purpose | Committed | Priority |
|------|---------|-----------|----------|
| `.env` | Defaults | ✅ Yes | Low |
| `.env.local` | Overrides | ❌ No | High |
| `.env.example` | Template | ✅ Yes | N/A |
| `.env.development` | Dev-specific | ✅ Yes | Medium |
| `.env.production` | Prod-specific | ✅ Yes | Medium |

**Key Points:**
- ✅ App works without ANY .env files
- ✅ `.env` provides documented defaults
- ✅ `.env.local` for your customizations
- ✅ All variables are optional
- ✅ Zero config needed to start

---

**Last Updated:** November 4, 2025  
**Version:** 1.1.0  
**Status:** Complete ✅
