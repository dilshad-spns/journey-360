# 🎯 Getting Started with Journey 360

## Step-by-Step Visual Guide

```
┌─────────────────────────────────────────────────┐
│  Journey 360 - Installation & Setup             │
└─────────────────────────────────────────────────┘

Step 1: Navigate to Project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$ cd journey-360

Step 2: Fix Import Statements ⚠️ CRITICAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$ npm run fix-imports

Expected Output:
  🔧 Journey 360 - Fixing Versioned Imports
  ==================================================
  
  Scanning directories for versioned imports...
  
  ✅ ./components/ui/button.tsx (2 changes)
  ✅ ./components/ui/accordion.tsx (2 changes)
  ✅ ./components/ui/alert.tsx (1 changes)
  ...
  
  ==================================================
  ✨ Complete! Fixed imports in 41 files.
  
  📝 Next steps:
     1. Run: npm install
     2. Run: npm run dev
     3. Check browser console for any errors

Step 3: Install Dependencies
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$ npm install

Expected Output:
  npm WARN deprecated ...
  
  added 423 packages, and audited 424 packages in 45s
  
  153 packages are looking for funding
    run `npm fund` for details
  
  found 0 vulnerabilities

Step 4: Start Development Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$ npm run dev

Expected Output:
  ▲ Next.js 15.0.3
  - Local:        http://localhost:3000
  - Environments: .env
  
  ✓ Starting...
  ✓ Ready in 2.3s

Step 5: Open Browser
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Navigate to: http://localhost:3000

You should see:
  ┌───────────────────────────────────────┐
  │   Journey 360                    🌙   │
  ├───────────────────────────────────────┤
  │                                       │
  │   Auto-Build Deployable Journeys      │
  │                                       │
  │   ┌──────┐  ┌──────┐  ┌──────┐      │
  │   │ Text │  │Speech│  │Upload│      │
  │   └──────┘  └──────┘  └──────┘      │
  │                                       │
  └───────────────────────────────────────┘

```

## 🎉 Success!

If you see the landing page, you're ready to develop!

---

## 🔥 Quick Commands Reference

```bash
# First time setup (run in order)
npm run fix-imports    # Fix import statements
npm install            # Install dependencies  
npm run dev            # Start dev server

# Daily development
npm run dev            # Start dev server

# Build for production
npm run build          # Create optimized build
npm start              # Start production server

# Linting and quality
npm run lint           # Check code quality

# Troubleshooting
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

---

## 🚨 Common Errors & Fixes

### ❌ Error: "Cannot find module 'sonner@2.0.3'"

**Cause:** You skipped step 2 (fix-imports)

**Fix:**
```bash
npm run fix-imports
npm install
npm run dev
```

---

### ❌ Error: "Port 3000 is already in use"

**Cause:** Another process is using port 3000

**Fix Option 1** - Kill existing process:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**Fix Option 2** - Use different port:
```bash
PORT=3001 npm run dev
```

---

### ❌ Error: "Module not found: Can't resolve..."

**Cause:** Stale cache or missing dependencies

**Fix:**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

---

### ❌ TypeScript errors during build

**Cause:** Outdated TypeScript cache

**Fix:**
```bash
rm -rf .next tsconfig.tsbuildinfo
npm run dev
```

---

### ❌ Blank page or no styles

**Cause:** Tailwind CSS not loaded

**Fix:**
1. Check `/styles/globals.css` exists
2. Verify it's imported in `/app/layout.tsx`
3. Restart dev server

---

## 📁 Project Structure Overview

```
journey-360/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main entry point
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── LandingPage.tsx
│   ├── InputRequirementScreen.tsx
│   ├── FormEditorPage.tsx
│   └── ...
├── styles/                  # Global styles
│   └── globals.css          # Design system variables
├── types/                   # TypeScript types
│   └── schema.ts
├── utils/                   # Utility functions
│   ├── aiParser.ts
│   ├── mockApi.ts
│   └── testGenerator.ts
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.js           # Next.js config
└── fix-imports.js           # Import fix script
```

---

## 🎨 Design System

All components use CSS variables from `/styles/globals.css`:

**Colors:**
- `--background` - Main background
- `--foreground` - Main text
- `--primary` - Primary brand color
- `--secondary` - Secondary color
- `--accent` - Accent highlights
- `--muted` - Muted/disabled

**Borders & Radius:**
- `--radius-button` - Button border radius
- `--radius-card` - Card border radius
- `--radius-input` - Input border radius
- `--radius-pill` - Pill/badge border radius

**Typography:**
- Controlled by CSS base styles
- Never use Tailwind font classes
- Inter font family throughout

---

## 🛠️ Development Workflow

### 1. Make Changes
Edit files in your code editor. Changes auto-reload in browser.

### 2. Add New Component
```typescript
// /components/MyComponent.tsx
export function MyComponent() {
  return <div>Hello World</div>;
}
```

Import and use:
```typescript
import { MyComponent } from './components/MyComponent';
```

### 3. Update Styles
Edit `/styles/globals.css` to change colors/spacing globally.

### 4. Test Changes
Check browser console (F12) for errors.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📚 Documentation Index

| File | When to Read |
|------|--------------|
| `START_HERE.md` | **Read this first!** |
| `GETTING_STARTED.md` | You are here - Visual setup guide |
| `QUICK_FIX_GUIDE.md` | Having import errors? |
| `SETUP_INSTRUCTIONS.md` | Detailed installation |
| `INSTALLATION_FIX_SUMMARY.md` | What we fixed and why |
| `README.md` | Project overview |
| `PROJECT_OVERVIEW.md` | Architecture details |
| `TROUBLESHOOTING.md` | General help |

---

## ✅ Post-Setup Checklist

After following the steps above, verify:

- [ ] No errors in terminal
- [ ] `npm run dev` starts successfully
- [ ] Browser opens to `localhost:3000`
- [ ] Landing page displays
- [ ] Logo says "Journey 360"
- [ ] Dark mode toggle works (moon/sun icon)
- [ ] No console errors (F12 → Console)
- [ ] Can click "Start New Journey"
- [ ] Can navigate between screens

If all checked: **You're ready to develop!** 🎉

---

## 🆘 Still Stuck?

### Option 1: Nuclear Reset
```bash
rm -rf node_modules package-lock.json .next
npm run fix-imports
npm install
npm run dev
```

### Option 2: Check Node Version
```bash
node --version  # Should be 18.17+
npm --version   # Should be 9.0+
```

If outdated, install latest LTS from [nodejs.org](https://nodejs.org)

### Option 3: Review Logs
Check terminal output for specific error messages and search in:
- `QUICK_FIX_GUIDE.md`
- `TROUBLESHOOTING.md`

---

## 🎓 Learning Path

1. ✅ **Setup** (You are here)
2. 📖 **Explore**: Try the app, navigate screens
3. 🔍 **Understand**: Read `PROJECT_OVERVIEW.md`
4. 💻 **Code**: Create your first component
5. 🎨 **Style**: Customize the design system
6. 🚀 **Deploy**: Build for production

---

## 💡 Pro Tips

- **Save Time:** Bookmark `START_HERE.md`
- **Stay Organized:** Keep terminal and browser side-by-side
- **Use Hot Reload:** Save files and see instant updates
- **Check Console:** Always have DevTools open (F12)
- **Read Errors:** Terminal and console errors have solutions

---

**You're all set! Happy coding!** 🚀

_Questions? Check the documentation files or START_HERE.md_
