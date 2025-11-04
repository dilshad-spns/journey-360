# Local Development Setup Instructions

## Complete Setup Guide for Journey 360

This guide will help you get Journey 360 running on your local machine with all styles and functionality working correctly.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

First, install all required packages including the new PostCSS plugin for Tailwind v4:

```bash
npm install
```

This will install:
- All React and Next.js dependencies
- Tailwind CSS v4.0 with PostCSS support
- All shadcn/ui components and Radix UI primitives
- Design system dependencies

### 2. Verify PostCSS Configuration

Make sure you have the `postcss.config.js` file in your root directory:

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### 3. Verify CSS Import

Your `/app/layout.tsx` should import the global styles:

```typescript
import '../styles/globals.css';
```

### 4. Run Fix Imports Script (if needed)

If you encounter any import errors, run:

```bash
npm run fix-imports
```

### 5. Start Development Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:3000`

## Troubleshooting

### Issue: No Styles Visible

**Solution:**
1. Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Stop the dev server (Ctrl+C)
3. Delete `.next` folder: `rm -rf .next` (Windows: `rmdir /s .next`)
4. Reinstall dependencies: `npm install`
5. Start dev server again: `npm run dev`

### Issue: Tailwind Classes Not Working

**Solution:**
1. Verify `postcss.config.js` exists in root directory
2. Verify `@tailwindcss/postcss` is in package.json devDependencies
3. Run `npm install` again
4. Restart the dev server

### Issue: CSS Variables Not Loading

**Solution:**
1. Check that `/styles/globals.css` contains all CSS variables
2. Verify the import in `/app/layout.tsx`
3. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)

### Issue: Dark Mode Not Working

**Solution:**
- Dark mode is controlled via the toggle in the top navigation
- It uses localStorage to persist the preference
- The dark class is added to the `<html>` element

## File Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with CSS import
│   └── page.tsx            # Main app component
├── components/             # All React components
├── styles/
│   ├── globals.css         # Main styles with Tailwind v4 import
│   └── tailwind.css        # Legacy file (can be ignored)
├── postcss.config.js       # PostCSS configuration for Tailwind v4
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies
```

## Design System

All components use CSS variables defined in `/styles/globals.css`:

### Color Variables
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--accent`, `--accent-foreground`
- And many more...

### Radius Variables
- `--radius-button`
- `--radius-card`
- `--radius-input`
- `--radius-pill`

### Typography
Typography is controlled via base CSS styles, not Tailwind classes:
- H1: 32px, semi-bold
- H2: 26px, medium
- H3: 21px, medium
- H4: 18px, medium
- Body: 14px, normal
- Label: 12px, semi-bold

## Building for Production

```bash
npm run build
npm start
```

## Need Help?

If you're still experiencing issues:
1. Check the console for errors (F12 in browser)
2. Check terminal for build errors
3. Verify all files mentioned in this guide exist
4. Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`

## Success Checklist

- ✅ `npm install` completed without errors
- ✅ `postcss.config.js` exists in root
- ✅ `@tailwindcss/postcss` is in package.json
- ✅ `/styles/globals.css` contains all CSS variables
- ✅ `/app/layout.tsx` imports globals.css
- ✅ `npm run dev` starts without errors
- ✅ Styles are visible in browser
- ✅ Dark mode toggle works
- ✅ All components render correctly
