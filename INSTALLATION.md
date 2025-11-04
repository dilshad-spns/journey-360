# Installation Guide

Complete guide to install and run AI 360 - Auto-Build Deployable Journeys locally.

---

## System Requirements

### Required

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository
- **Operating System**: Windows, macOS, or Linux

### Optional

- **yarn**: As an alternative to npm
- **pnpm**: As another alternative package manager

### Check Your Versions

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check npm version
npm --version
# Expected: 9.0.0 or higher

# Check Git version
git --version
# Expected: 2.x.x or higher
```

### Install Node.js (if needed)

**Download from official website:**

- Visit: https://nodejs.org/
- Download the LTS (Long Term Support) version
- Run the installer and follow instructions

**Or use a version manager:**

On macOS/Linux (using nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

On Windows (using nvm-windows):

1. Download from: https://github.com/coreybutler/nvm-windows/releases
2. Install and run:

```bash
nvm install 18
nvm use 18
```

---

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the project
git clone <your-repository-url>

# Navigate to project directory
cd ai-360-auto-build-deployable-journeys
```

**If you don't have Git:**

- Download the project as a ZIP file
- Extract to your desired location
- Open terminal/command prompt in the extracted folder

### 2. Install Dependencies

This will download all required packages (~500MB):

```bash
npm install
```

**Alternative package managers:**

Using yarn:

```bash
yarn install
```

Using pnpm:

```bash
pnpm install
```

**What gets installed:**

- Next.js 15.0.3
- React 18.3.1
- TypeScript 5.7.2
- Tailwind CSS 4.0.0
- 40+ shadcn/ui components
- React Hook Form, Sonner, Lucide Icons
- And all other dependencies (see package.json)

**Expected time**: 2-5 minutes (depending on internet speed)

**Expected output:**

```
added 342 packages, and audited 343 packages in 2m

54 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### 3. Verify Installation

Check that all dependencies are installed:

```bash
npm list --depth=0
```

You should see a list of packages including:

- next@15.0.3
- react@18.3.1
- typescript@5.7.2
- tailwindcss@4.0.0
- etc.

---

## Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

**Expected output:**

```
   ▲ Next.js 15.0.3
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in 2.3s
```

**What this does:**

- Starts Next.js development server
- Enables hot module replacement (auto-refresh on code changes)
- Runs on http://localhost:3000
- Shows detailed error messages
- Runs TypeScript type checking

**Access the app:**
Open your browser and navigate to: **http://localhost:3000**

### Production Mode

Build and run the optimized production version:

```bash
# Step 1: Build the application
npm run build

# Step 2: Start the production server
npm start
```

**Build output:**

```
   ▲ Next.js 15.0.3

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (3/3)
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                   137 B          87.2 kB
└ ○ /_not-found                         871 B          85.9 kB
```

**Production benefits:**

- Optimized bundle size
- Minified code
- Better performance
- Production-ready deployment

---

## Troubleshooting

### Issue: Port 3000 already in use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution 1 - Use a different port:**

```bash
PORT=3001 npm run dev
```

**Solution 2 - Kill the process using port 3000:**

On macOS/Linux:

```bash
lsof -ti:3000 | xargs kill -9
```

On Windows (PowerShell):

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Issue: Module not found errors

**Error:**

```
Module not found: Can't resolve 'react'
```

**Solution:**

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall all dependencies
npm install
```

### Issue: Permission errors during installation

**Error:**

```
EACCES: permission denied
```

**Solution (avoid using sudo):**

Fix npm permissions:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

Then retry:

```bash
npm install
```

### Issue: Build or type errors

**Error:**

```
Type error: Cannot find module
```

**Solution:**

```bash
# Clear Next.js cache
rm -rf .next

# Clear TypeScript cache
rm -rf tsconfig.tsbuildinfo

# Rebuild
npm run build
```

### Issue: Slow installation

**Solutions:**

1. Use a faster DNS (8.8.8.8)
2. Clear npm cache: `npm cache clean --force`
3. Use a different registry: `npm config set registry https://registry.npmjs.org/`
4. Try yarn or pnpm instead

### Issue: Module resolution errors in VS Code

**Solution:**

1. Open VS Code
2. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
3. Type: "TypeScript: Restart TS Server"
4. Select and run

---

## Verification Steps

After installation, verify everything works:

### 1. Development Server

```bash
npm run dev
```

✓ Server starts without errors
✓ Accessible at http://localhost:3000
✓ Landing page loads correctly

### 2. Linting

```bash
npm run lint
```

✓ No linting errors

### 3. Type Checking

```bash
npx tsc --noEmit
```

✓ No type errors

### 4. Production Build

```bash
npm run build
```

✓ Build completes successfully
✓ No compilation errors

---

## Environment Setup (Optional)

### Environment Variables

The application works out of the box with default values. Environment variables are **optional** but allow customization.

#### Create .env.local file

For local development overrides:

```bash
# Copy the example file
cp .env.example .env.local
```

#### Required Variables (None)

The application currently requires **no environment variables** to run. All features work with sensible defaults.

#### Optional Variables

Edit `.env.local` to customize:

```env
# Application Configuration
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_SPEECH=true
NEXT_PUBLIC_ENABLE_UPLOAD=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true

# Mock Configuration
NEXT_PUBLIC_USE_MOCK_AI=true
NEXT_PUBLIC_MOCK_API_DELAY=2000
```

#### Future Integration Variables

When integrating external services (not currently used):

```env
# AI Services (OpenAI, Anthropic, etc.)
# OPENAI_API_KEY=sk-your-api-key-here

# Database (Supabase, PostgreSQL, MongoDB)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Authentication (NextAuth)
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret

# Analytics (Google Analytics, Sentry)
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**See `.env.example` for complete list of available variables.**

**Important Notes:**
- `.env.local` is gitignored and won't be committed
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Never put secrets in `NEXT_PUBLIC_*` variables
- Server-side variables (without NEXT_PUBLIC_) are safe for API keys

---

## IDE Setup

### VS Code (Recommended)

**Install recommended extensions:**

1. ESLint
2. Prettier
3. Tailwind CSS IntelliSense
4. TypeScript and JavaScript Language Features

**Settings (`.vscode/settings.json`):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### WebStorm

- TypeScript support is built-in
- Configure Node.js interpreter: Settings → Languages → Node.js
- Enable ESLint: Settings → Languages → JavaScript → Code Quality Tools → ESLint

---

## Next Steps

After successful installation:

1. **Read the Quick Start**: See `QUICK_START.md`
2. **Explore the app**: Navigate through all 3 screens
3. **Check documentation**: See `README.md` for detailed features
4. **Try the Travel Insurance journey**: Enter any prompt and explore
5. **Customize styles**: Edit `/styles/globals.css` to change colors
6. **Review code**: Explore `/components` and `/utils` directories

---

## Getting Help

If you encounter issues not covered here:

1. Check `TROUBLESHOOTING.md` (if available)
2. Review `README.md` for feature documentation
3. See `MIGRATION_NOTES.md` for Next.js structure
4. Check the Next.js documentation: https://nextjs.org/docs
5. Review package.json for dependency versions

---

## Uninstallation

To remove the project:

```bash
# Remove dependencies
rm -rf node_modules

# Remove build artifacts
rm -rf .next

# Remove lock files
rm package-lock.json

# Remove the entire project (if desired)
cd ..
rm -rf ai-360-auto-build-deployable-journeys
```

---

## Summary

| Step       | Command                 | Time     |
| ---------- | ----------------------- | -------- |
| 1. Clone   | `git clone <url>`       | < 1 min  |
| 2. Install | `npm install`           | 2-5 min  |
| 3. Run     | `npm run dev`           | < 10 sec |
| 4. Access  | `http://localhost:3000` | Instant  |

**Total setup time**: ~3-6 minutes

---

**Last Updated**: November 4, 2025  
**Node.js Required**: 18.0.0+  
**Next.js Version**: 15.0.3  
**Status**: Ready for local development ✅