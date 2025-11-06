# Journey 360 - Quick Fix Guide

## 🚨 Problem: Import Errors

You're seeing errors like:
```
Cannot find module 'sonner@2.0.3'
Cannot find module 'react-hook-form@7.55.0'
Cannot find module '@radix-ui/react-label@2.1.2'
```

## ✅ Solution: Run the Automated Fix

We've created an automated script to fix all versioned imports in one command.

### Step 1: Run the Fix Script

```bash
npm run fix-imports
```

This will automatically remove all version numbers from import statements across your entire project.

### Step 2: Install Dependencies

```bash
npm install
```

This installs all the required packages with the correct versions from `package.json`.

### Step 3: Start the Development Server

```bash
npm run dev
```

Your application should now run without import errors!

---

## 📋 What the Fix Script Does

The `fix-imports.js` script automatically converts:

**Before (❌ Causes Errors):**
```typescript
import { toast } from "sonner@2.0.3";
import { useForm } from "react-hook-form@7.55.0";
import * as LabelPrimitive from "@radix-ui/react-label@2.1.2";
import { ChevronDown } from "lucide-react@0.487.0";
```

**After (✅ Works Correctly):**
```typescript
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as LabelPrimitive from "@radix-ui/react-label";
import { ChevronDown } from "lucide-react";
```

---

## 🔍 Manual Verification (Optional)

After running the fix, you can verify there are no remaining versioned imports:

```bash
# Search for any remaining versioned imports
grep -r "@[0-9]\." components/
```

If this returns nothing, all imports have been fixed!

---

## 🐛 Still Having Issues?

### Issue: "Cannot find module" errors persist

**Solution 1:** Clear all caches and reinstall
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

**Solution 2:** Check Node.js version
```bash
node --version
```
Ensure you're using Node.js 18.17 or higher (recommended: 20.x LTS)

### Issue: TypeScript errors

**Solution:** Clear TypeScript cache
```bash
rm -rf .next
rm -f tsconfig.tsbuildinfo
npm run dev
```

### Issue: Build errors

**Solution:** Try a clean build
```bash
npm run build
```

This will show you exactly which files have errors.

---

## 📦 Dependencies Added

The fix script also ensures these dependencies are in `package.json`:

- `next-themes@^0.4.6` - Used by the Sonner toast component

All other dependencies were already correctly specified.

---

## 🎯 Quick Start Commands

### First Time Setup
```bash
npm run fix-imports   # Fix all import statements
npm install           # Install dependencies
npm run dev           # Start dev server
```

### After Pull/Clone
```bash
npm install
npm run dev
```

### Clean Start (if having issues)
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run fix-imports
npm run dev
```

---

## ✨ Success Indicators

You'll know everything is working when:

1. ✅ `npm run dev` starts without errors
2. ✅ Browser opens to `http://localhost:3000`
3. ✅ Landing page displays correctly
4. ✅ No console errors in browser DevTools
5. ✅ Dark mode toggle works
6. ✅ You can navigate between screens

---

## 📚 Additional Resources

- **Full Setup Guide:** See `SETUP_INSTRUCTIONS.md`
- **Troubleshooting:** See `TROUBLESHOOTING.md`
- **Recent Changes:** See `FIXES_APPLIED.md`

---

## 🆘 Emergency Reset

If nothing works, here's the nuclear option:

```bash
# Delete everything
rm -rf node_modules package-lock.json .next

# Reinstall from scratch
npm install

# Fix imports
npm run fix-imports

# Try again
npm run dev
```

---

## ✅ Checklist

After running the fixes:

- [ ] Ran `npm run fix-imports`
- [ ] Ran `npm install`
- [ ] No errors during installation
- [ ] `npm run dev` starts successfully
- [ ] Application loads in browser
- [ ] No console errors
- [ ] Can navigate between pages

If all items are checked, you're ready to develop! 🎉
