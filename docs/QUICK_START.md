# Quick Start Guide

Get up and running with AI 360 in under 2 minutes!

## Prerequisites

Ensure you have Node.js 18+ installed:
```bash
node --version
# Should output v18.0.0 or higher
```

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

**Expected time**: 1-2 minutes

### Step 2: (Optional) Customize Configuration
```bash
# The app includes .env with defaults
# To customize, create .env.local (overrides .env)
cp .env.example .env.local

# Edit .env.local if you want to customize (e.g., change port)
```

**Note:** This step is completely optional. The app works perfectly with defaults in `.env`!

### Step 3: Start Development Server
```bash
npm run dev
```

**Expected output**:
```
   ▲ Next.js 15.0.3
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in 2.3s
```

### Step 4: Open in Browser
Navigate to: **http://localhost:3000**

You should see the **AI 360 Landing Page** with three input options!

---

## First Run - What to Expect

### 1. Landing Page
- Three colorful cards: Text Input, Speech Input, Upload File
- Clean Sapiens navy blue theme
- Click any card to proceed

### 2. Input Screen
- Text area or speech input
- Type anything (e.g., "Create a contact form")
- Click "Continue" or "Generate Form"

### 3. Form Editor (2-second load)
You'll see the **Travel Insurance** journey with:
- **Left Panel**: Configuration options (templates, themes, UI settings)
- **Center Panel**: Live preview of the 5-step wizard
- **Right Panel**: Schema, Tests, Deployment tabs

### 4. Explore the Journey
- Navigate through 5 wizard steps
- Try different templates (Simple, Two-Column, Wizard, Carded, Compact)
- Toggle dark mode (top-right)
- View generated tests and API endpoints

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production server |
| `npm run lint` | Check code quality |

---

## Troubleshooting

### Port 3000 in use?
```bash
PORT=3001 npm run dev
```

### Installation errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build cache issues?
```bash
rm -rf .next
npm run dev
```

---

## Next Steps

Once running, try these features:

1. **Templates**: Switch between Simple, Two-Column, Wizard, Carded, Compact
2. **Themes**: Change colors using Theme Color options
3. **Dark Mode**: Toggle with the moon/sun icon
4. **Schema**: View the JSON schema in the right panel
5. **Tests**: See 25+ auto-generated tests
6. **Deploy**: Simulate deployment process

---

## File Structure Overview

```
├── app/
│   ├── layout.tsx          # Root layout (already set up)
│   └── page.tsx            # Main app (already set up)
├── components/             # All UI components (no changes needed)
├── styles/globals.css      # Design system (customizable)
├── utils/                  # Business logic (no changes needed)
└── types/                  # TypeScript types (no changes needed)
```

---

## Support

- 📖 Full documentation: See `README.md`
- 🎯 Mock scenario details: See `TRAVEL_INSURANCE_MOCK.md`
- 📝 Version history: See `CHANGELOG.md`
- 🔧 Migration notes: See `MIGRATION_NOTES.md`
- 🔐 Environment variables: See `ENVIRONMENT_VARIABLES.md` (optional)
- 💾 Installation guide: See `INSTALLATION.md`
- 🚀 Deployment guide: See `DEPLOYMENT.md`
- 🐛 Troubleshooting: See `TROUBLESHOOTING.md`

---

**Ready to build?** Run `npm run dev` and start exploring! 🚀
