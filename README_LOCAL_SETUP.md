# Journey 360 - Local Setup Guide

## 🚀 Quick Start (3 Steps)

```bash
# Step 1: Install dependencies
npm install

# Step 2: Verify setup
npm run check-setup

# Step 3: Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Why You're Not Seeing Styles

Your application requires **Tailwind CSS v4.0** with **PostCSS** to work properly. This is a newer version of Tailwind that requires specific configuration.

### What I've Fixed For You:

1. ✅ Created `postcss.config.js` - PostCSS configuration for Tailwind v4
2. ✅ Added `@tailwindcss/postcss` to package.json
3. ✅ Verified CSS import in `/app/layout.tsx`
4. ✅ Ensured all CSS variables are properly defined
5. ✅ Created setup verification script

### What You Need To Do:

```bash
# 1. Install the new dependencies
npm install

# 2. Delete the Next.js cache (important!)
rm -rf .next
# On Windows: rmdir /s .next

# 3. Start the dev server
npm run dev
```

---

## 📁 Critical Files (Do Not Delete)

### `/postcss.config.js`
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```
This file tells Next.js how to process Tailwind CSS v4.

### `/styles/globals.css`
Contains:
- Tailwind CSS v4 import
- All design system CSS variables
- Typography base styles
- Dark mode styles

### `/app/layout.tsx`
Imports the global styles and sets up the app structure.

---

## 🔧 Troubleshooting

### Still No Styles After `npm install`?

1. **Hard Refresh Browser**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

2. **Clear Browser Cache**
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Delete .next folder**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Nuclear Option** (if nothing else works)
   ```bash
   # Delete everything and start fresh
   rm -rf node_modules
   rm -rf .next
   npm install
   npm run dev
   ```

### Verify Everything is Working

Run the setup verification script:
```bash
npm run check-setup
```

This will check:
- ✅ All required files exist
- ✅ PostCSS is configured correctly
- ✅ Tailwind CSS v4 is installed
- ✅ CSS imports are correct
- ✅ Design system variables are defined

---

## 🎨 Design System Overview

Your application uses a comprehensive design system with CSS variables. All components use these variables, so you can update the entire app's styling by editing `/styles/globals.css`.

### Color System
```css
--background       /* Main background color */
--foreground       /* Main text color */
--card            /* Card backgrounds */
--primary         /* Primary brand color (#001C56) */
--secondary       /* Secondary UI color */
--accent          /* Accent/highlight color */
--destructive     /* Error/delete actions */
--success         /* Success states */
--warning         /* Warning states */
--muted           /* Disabled/subtle elements */
--border          /* Border color */
```

### Border Radius
```css
--radius-button   /* Button corners (6px) */
--radius-card     /* Card corners (6px) */
--radius-input    /* Input corners (6px) */
--radius-pill     /* Pill-shaped elements (24px) */
```

### Typography (CSS-based, NOT Tailwind classes)
```
H1: 32px, Semi-bold
H2: 26px, Medium
H3: 21px, Medium
H4: 18px, Medium
Body: 14px, Normal
Label: 12px, Semi-bold
```

**Important:** Typography is controlled by CSS base styles, not Tailwind classes. Don't use `text-xl`, `font-bold`, etc. unless overriding.

### Dark Mode
Dark mode is built-in and controlled via the toggle button in the top navigation. All colors automatically adapt using CSS variables.

---

## 📦 Technology Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS v4.0
- **Components:** shadcn/ui + Radix UI
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **Charts:** Recharts
- **Notifications:** Sonner
- **Dark Mode:** CSS variables + localStorage

---

## 🏗️ Project Structure

```
journey-360/
├── app/
│   ├── layout.tsx              # Root layout (imports CSS)
│   └── page.tsx                # Main app component
│
├── components/
│   ├── LandingPage.tsx         # Page 1: Landing
│   ├── InputRequirementScreen.tsx  # Page 2: Input
│   ├── FormEditorPage.tsx      # Page 3: Editor
│   ├── TopNav.tsx              # Top navigation
│   └── ui/                     # shadcn/ui components
│
├── styles/
│   └── globals.css             # Main stylesheet (CRITICAL!)
│
├── utils/
│   ├── aiParser.ts             # AI parsing logic
│   ├── testGenerator.ts        # Test generation
│   └── mockApi.ts              # Mock API generation
│
├── types/
│   └── schema.ts               # TypeScript types
│
├── postcss.config.js           # PostCSS config (CRITICAL!)
├── next.config.js              # Next.js config
└── package.json                # Dependencies
```

---

## 🚨 Common Errors & Solutions

### Error: "Module not found: Can't resolve 'postcss'"
**Solution:**
```bash
npm install
```

### Error: Styles not loading
**Solution:**
```bash
rm -rf .next
npm run dev
```

### Error: Dark mode not working
**Solution:** Clear localStorage in browser DevTools:
```javascript
// In browser console:
localStorage.clear();
// Then refresh
```

### Error: "Cannot find module '@tailwindcss/postcss'"
**Solution:**
```bash
npm install @tailwindcss/postcss --save-dev
```

---

## ✅ Setup Checklist

Before reporting issues, verify:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Ran `npm install` successfully
- [ ] `postcss.config.js` exists in root directory
- [ ] `@tailwindcss/postcss` in package.json devDependencies
- [ ] Deleted `.next` folder
- [ ] Cleared browser cache
- [ ] Dev server running without errors
- [ ] Checked browser console (F12) for errors

---

## 🆘 Need More Help?

1. **Run diagnostics:**
   ```bash
   npm run check-setup
   ```

2. **Check detailed setup guide:**
   See `SETUP_INSTRUCTIONS_LOCAL.md`

3. **Check terminal output:**
   Look for errors when running `npm run dev`

4. **Check browser console:**
   Press F12 and look for errors in the Console tab

---

## 🎯 Success Indicators

You'll know everything is working when:

1. ✅ App loads at http://localhost:3000
2. ✅ You see the Journey 360 logo (blue circular icon)
3. ✅ Background is light gray/white (not pure white)
4. ✅ Cards have subtle borders and shadows
5. ✅ Buttons are styled with your brand color (#001C56)
6. ✅ Dark mode toggle works in top navigation
7. ✅ All text is in Inter font
8. ✅ Hover effects work on cards

---

## 📝 Important Notes

1. **Do NOT delete** `postcss.config.js` - it's required for Tailwind v4
2. **Do NOT delete** `/styles/globals.css` - it contains all your styles
3. **Always run** `npm run dev` from the project root
4. **Clear cache** if you make changes to CSS files
5. **Use CSS variables** (bg-primary, text-foreground) instead of hardcoded colors

---

## 🔄 Making Style Changes

To customize the design system:

1. Open `/styles/globals.css`
2. Modify CSS variables in `:root` section
3. Save the file
4. Changes apply automatically (or refresh browser)

Example - Change primary color:
```css
:root {
  --primary: rgba(0, 100, 200, 1); /* Change this */
}
```

All components using `bg-primary`, `text-primary`, `border-primary` will update automatically!

---

**Last Updated:** November 4, 2025
**Version:** 1.0.0
**Status:** ✅ Ready for Local Development
