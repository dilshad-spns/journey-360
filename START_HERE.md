# 🚀 START HERE - Journey 360 Setup

Welcome to Journey 360! Follow these steps to get your development environment running with **full styling support**.

---

## 🎨 **UPDATED: Styles Now Fully Configured!**

Your application now has complete styling support with Tailwind CSS v4 and your custom design system.

---

## ⚡ Quick Start (4 Commands)

```bash
npm run fix-imports    # Step 1: Fix import statements (one-time)
npm install            # Step 2: Install dependencies (includes new PostCSS plugin)
rm -rf .next           # Step 3: Clear build cache (important for styles!)
npm run dev            # Step 4: Start development server
```

**Windows users:** Use `rmdir /s .next` for Step 3

**That's it!** Open your browser to `http://localhost:3000`

---

## 📖 Detailed Setup Guide

**If you're seeing unstyled HTML** (like plain text without colors/borders), see:
- **Quick Fix:** [START_HERE_NOW.md](./START_HERE_NOW.md) - 5 minute setup
- **Full Guide:** [README_LOCAL_SETUP.md](./README_LOCAL_SETUP.md) - Complete instructions
- **Checklist:** [LOCAL_DEV_CHECKLIST.md](./LOCAL_DEV_CHECKLIST.md) - Step-by-step verification

---

## 📖 What Each Command Does

### 1. `npm run fix-imports`
- Removes version numbers from all import statements
- Converts `"sonner@2.0.3"` → `"sonner"`
- Fixes 40+ UI component files automatically
- **Required once** after cloning/pulling

### 2. `npm install`
- Installs all project dependencies
- Uses versions specified in `package.json`
- Creates `node_modules` folder

### 3. `npm run dev`
- Starts the Next.js development server
- Enables hot reload (auto-refresh on changes)
- Opens application at `localhost:3000`

---

## ✅ Success Checklist

After running the commands, verify:

- [ ] No errors in terminal
- [ ] Browser shows styled page (not plain HTML)
- [ ] Journey 360 logo visible (blue circular icon)
- [ ] Light gray background with styled cards
- [ ] Hover effects work on cards
- [ ] Dark mode toggle works (top navigation)
- [ ] No console errors (F12 → Console tab)

If all checked, you're ready to develop! 🎉

---

## 🐛 Troubleshooting

### Problem: No Styles Showing

**Quick Fix:**
```bash
npm install
rm -rf .next
npm run dev
```

**Still not working?** See [START_HERE_NOW.md](./START_HERE_NOW.md)

### Problem: Import Errors

**Quick Fix:**
```bash
npm run fix-imports
npm install
```

### Problem: Other Issues

Run diagnostics:
```bash
npm run check-setup
```

This will tell you exactly what's wrong.

---

## 🐛 Having Issues?

### Error: "Cannot find module 'package@version'"

**Solution:** You forgot step 1!
```bash
npm run fix-imports
npm install
npm run dev
```

### Error: "Module not found" or build errors

**Solution:** Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### Error: TypeScript compilation errors

**Solution:** Clear TypeScript cache
```bash
rm -rf .next tsconfig.tsbuildinfo
npm run dev
```

### Port 3000 already in use

**Solution:** Kill the existing process or use different port
```bash
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
PORT=3001 npm run dev
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `START_HERE.md` | **You are here!** Quick start guide |
| `QUICK_FIX_GUIDE.md` | Troubleshooting import errors |
| `SETUP_INSTRUCTIONS.md` | Detailed installation guide |
| `FIXES_APPLIED.md` | What we fixed and why |
| `README.md` | Project overview and features |

**Start with this file, then explore others as needed.**

---

## 🎯 Next Steps After Setup

1. **Explore the Application**
   - Click "Start New Journey"
   - Try different input modes (Text, Speech, Upload)
   - Generate a form from requirements
   - Test the form editor

2. **Understand the Architecture**
   - Read `PROJECT_OVERVIEW.md`
   - Explore `/components` directory
   - Check `/types/schema.ts` for data structures

3. **Customize the Design System**
   - Edit `/styles/globals.css`
   - Modify CSS variables for colors/spacing
   - Changes apply automatically to all components

4. **Add New Features**
   - Create components in `/components`
   - Add routes in `/app`
   - Update types in `/types`

---

## 🔧 Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Check code quality |
| `npm run fix-imports` | Fix import statements |

---

## 💡 Pro Tips

1. **First Time Setup:** Always run `fix-imports` before `install`
2. **After Git Pull:** Run `npm install` to get new dependencies
3. **Clean Start:** Delete `node_modules`, `.next`, run `npm install`
4. **Hot Reload Not Working:** Restart dev server with `npm run dev`
5. **Styling Issues:** Check `/styles/globals.css` for CSS variables

---

## 🆘 Emergency Reset

If nothing else works:

```bash
# Nuclear option - start completely fresh
rm -rf node_modules package-lock.json .next
npm run fix-imports
npm install
npm run dev
```

---

## 🌟 Features Overview

Journey 360 includes:

- ✅ **8 Integrated Layers**: Input → Parse → Schema → UI → Data → API → Tests → Deploy
- ✅ **3 Input Modes**: Text, Speech, Upload
- ✅ **Form Editor**: Live preview with drag-and-drop
- ✅ **Auto-Generated Tests**: Unit, validation, integration
- ✅ **Mock API**: Realistic endpoints with sample data
- ✅ **Deployment Ready**: Export as complete package
- ✅ **Design System**: Customizable via CSS variables
- ✅ **Dark Mode**: Full theme support
- ✅ **TypeScript**: Type-safe throughout
- ✅ **Next.js 15**: Latest React framework

---

## 📞 Support

- **Import Errors:** See `QUICK_FIX_GUIDE.md`
- **Setup Issues:** See `SETUP_INSTRUCTIONS.md`
- **General Help:** See `TROUBLESHOOTING.md`

---

## ✨ You're All Set!

Run these three commands and start building:

```bash
npm run fix-imports && npm install && npm run dev
```

Happy coding! 🚀
