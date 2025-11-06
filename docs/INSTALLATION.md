# Installation Guide

Quick guide to get Journey 360 running on your local machine.

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Browser**: Chrome, Edge, Safari, or Firefox (latest version)
- **OS**: Windows, macOS, or Linux

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd journey-360
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 15
- React 18
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui components
- Radix UI primitives

### 3. Fix Import Issues (Important!)

```bash
npm run prepare-build
```

This script:
- Removes versioned package imports
- Fixes compatibility issues
- Prepares project for build

### 4. Configure Environment (Optional)

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your settings
# (Not required for local development)
```

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for details.

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

## Verify Installation

### 1. Check Browser Console
- Open Developer Tools (F12)
- Look for any errors in Console tab
- Should see "Journey 360" loaded message

### 2. Test Features
- Click "Get Started"
- Select "Paste User Story" mode
- Enter test prompt: "Create a contact form with name, email, and message"
- Click continue and verify form generation

### 3. Check Dark Mode
- Click moon/sun icon in top navigation
- Theme should switch smoothly

## Common Issues

### Port 3000 Already in Use

```bash
# Use different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run prepare-build
```

### Import Version Errors

```bash
# Run fix script
npm run prepare-build

# Then rebuild
npm run build
```

### TypeScript Errors

```bash
# Check types without building
npx tsc --noEmit
```

## Production Build

### Build Application

```bash
npm run build
```

This command:
1. Runs `prepare-build` automatically (via prebuild script)
2. Type-checks all TypeScript files
3. Bundles optimized production code
4. Generates static assets

### Start Production Server

```bash
npm start
```

App runs at: **http://localhost:3000**

### Verify Production Build

1. Check build output for errors
2. Test all features in production mode
3. Verify performance (should be faster than dev)
4. Check bundle size in `.next` folder

## Project Structure

```
journey-360/
├── app/                   # Next.js pages (App Router)
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout
│   ├── prompt/           # Input screen
│   └── builder/          # Form editor
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── *.tsx            # Feature components
├── imports/             # Figma imports
├── styles/              # CSS and design tokens
│   └── globals.css      # Design system variables
├── types/               # TypeScript types
├── utils/               # Utilities
└── .env.local          # Environment variables (create this)
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Building
npm run build            # Build for production
npm start                # Start production server

# Utilities
npm run lint             # Run ESLint
npm run prepare-build    # Fix versioned imports

# Legacy (if needed)
npm run fix-imports      # Alternative import fixer
```

## Design System Customization

Edit `/styles/globals.css` to customize:

### Colors
```css
:root {
  --color-primary: 33 150 243;      /* Blue */
  --color-accent: 236 64 122;       /* Pink */
  --color-success: 76 175 80;       /* Green */
}
```

### Spacing
```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### Border Radius
```css
:root {
  --radius-button: 8px;
  --radius-card: 12px;
  --radius-input: 6px;
  --radius-pill: 9999px;
}
```

All components automatically use these variables.

## Browser Requirements

### Supported Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Speech Recognition
- Requires HTTPS in production
- Works on localhost for development
- Chrome/Edge recommended for best support

### Permissions
- Microphone access (for speech input)
- Notification permission (optional)

## Development Tips

### Hot Reload
- Changes auto-reload in development
- CSS changes reload instantly
- Component changes may require browser refresh

### Clear Cache
```bash
# Next.js cache
rm -rf .next

# Full clean
rm -rf .next node_modules
npm install
```

### Debug Mode
Add to `.env.local`:
```bash
NEXT_PUBLIC_DEBUG=true
```

## Next Steps

1. ✅ Complete installation
2. 📖 Read [README.md](./README.md) for feature overview
3. 🎨 Review [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
4. 🚀 Start building forms!

## Need Help?

- **Build Issues**: See [BUILD_CHECKLIST.md](./BUILD_CHECKLIST.md)
- **Errors**: Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Features**: Read [README.md](./README.md)

## Success Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Import fixes applied (`npm run prepare-build`)
- [ ] Dev server running (`npm run dev`)
- [ ] App loads at http://localhost:3000
- [ ] No console errors
- [ ] Features work (try creating a form)
- [ ] Dark mode toggles successfully

---

**Ready to build!** 🚀
