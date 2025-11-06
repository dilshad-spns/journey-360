# Quick Start Guide

Get Journey 360 running in 5 minutes.

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Fix imports (required!)
npm run prepare-build

# 3. Start dev server
npm run dev
```

**Open**: http://localhost:3000

## First Steps

1. Click **"Get Started"**
2. Choose **"Paste User Story"**
3. Enter: `"Create a contact form with name, email, and message"`
4. Click **Continue**
5. See your form generated!

## Production Build

```bash
# Build
npm run build

# Run
npm start
```

## Environment Setup (Optional)

```bash
cp .env.example .env.local
# Edit .env.local with AI service credentials
```

## Common Commands

```bash
npm run dev              # Development mode
npm run build            # Production build
npm start                # Run production
npm run lint             # Check code
npm run prepare-build    # Fix imports
```

## Troubleshooting

### Build Fails
```bash
npm run prepare-build
npm run build
```

### Import Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run prepare-build
```

### Port Conflict
```bash
PORT=3001 npm run dev
```

## Design System

Customize in `/styles/globals.css`:

```css
:root {
  --color-primary: 33 150 243;
  --radius-button: 8px;
  --spacing-md: 1rem;
}
```

## Features

- 🎤 **Text/Speech/Upload** input
- 🎨 **4 Stepper types** (Dots, Numbers, Progress, Breadcrumb)
- 📱 **Responsive** design
- 🌓 **Dark mode**
- ♿ **Accessible** (WCAG)

## Documentation

- Full guide: [README.md](./README.md)
- Installation: [INSTALLATION.md](./INSTALLATION.md)
- Environment: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
- Issues: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Questions?** Check the docs above or review the code comments.
