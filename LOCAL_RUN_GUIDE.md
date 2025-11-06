# Quick Start - Running Journey 360 Locally

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Setup & Run

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open in Browser

```
http://localhost:3000
```

## Application Routes

The app now runs on multiple routes:

| Route | Description | Component |
|-------|-------------|-----------|
| `/` | Landing Page - Select input mode | LandingPage |
| `/prompt?mode=text` | Input Screen - Enter requirements | InputRequirementScreen |
| `/builder` | Form Editor - Build and configure | FormEditorPage |

## Navigation Flow

1. **Start at Landing Page** (`/`)
   - Click "Text Input", "Speech Input", or "Upload Files"
   
2. **Enter Requirements** (`/prompt`)
   - Type or paste requirements
   - Use grammar check feature
   - Import from URL, Jira, or GitHub
   - Click "Continue" to proceed
   
3. **Build & Configure** (`/builder`)
   - View generated form schema
   - Configure form settings
   - Add rules and validations
   - View tests and mock APIs
   - Deploy

## Key Features Available at Each Route

### Landing Page (`/`)
- ✨ Mode selection (Text, Speech, Upload)
- 🌙 Dark/Light mode toggle (persistent)
- 📱 Responsive design

### Prompt Page (`/prompt`)
- 📝 Rich text editor with formatting
- ✅ Grammarly-style grammar correction
- 🔗 Import from URL, Jira, GitHub
- 📤 File upload support
- 🎤 Speech input (if mode=speech)
- ⬅️ Back to landing
- ➡️ Continue to builder

### Builder Page (`/builder`)
- 📋 Form schema viewer
- ⚙️ Form configurator
- ✅ Rules and validation manager
- 🧪 Test case viewer
- 🔌 Mock API viewer
- 🚀 Deployment panel
- 🆕 New Project button
- 🔄 Regenerate from requirements

## Testing Routes Directly

You can navigate directly to any route:

```bash
# Landing
http://localhost:3000/

# Prompt (Text mode)
http://localhost:3000/prompt?mode=text

# Prompt (Speech mode)
http://localhost:3000/prompt?mode=speech

# Prompt (Upload mode)
http://localhost:3000/prompt?mode=upload

# Builder (requires sessionStorage data)
http://localhost:3000/builder
```

⚠️ **Note**: Direct access to `/builder` will redirect to `/prompt` if no requirements are found in sessionStorage.

## Browser Features

### Dark Mode
- Toggle in TopNav (moon/sun icon)
- Preference saved to localStorage
- Persists across sessions

### Session Data
- Requirements saved in sessionStorage
- Cleared on "New Project"
- Available on browser refresh (within same tab)

### Navigation
- Browser back/forward buttons work
- Each screen has proper URL
- Can bookmark specific routes

## Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Check setup
npm run check-setup
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Route Not Found
- Ensure you're using correct route paths
- Check file structure in `/app` directory
- Verify `page.tsx` files exist in route folders

## Development Tips

1. **Hot Reload**: Changes auto-refresh in development mode
2. **Console Logs**: Check browser console for errors
3. **Network Tab**: Monitor API calls and data flow
4. **React DevTools**: Use for component debugging
5. **Session Storage**: Check Application tab in DevTools

## File Structure (Routes)

```
app/
├── layout.tsx          → Root layout (TopNav, Toaster, Dark mode)
├── page.tsx            → Landing page route (/)
├── prompt/
│   └── page.tsx        → Prompt page route (/prompt)
└── builder/
    └── page.tsx        → Builder page route (/builder)
```

## Design System

All components use CSS variables from `/styles/globals.css`:

- Colors: `--color-background`, `--color-foreground`, etc.
- Spacing: `--spacing-*` tokens
- Radius: `--radius-button`, `--radius-card`, etc.
- Typography: Inter font family (base styles)

## Next Steps

After running locally:
1. Test all routes and navigation
2. Try dark/light mode toggle
3. Test import features (URL, Jira, GitHub)
4. Generate a form and explore builder
5. Check deployment panel

## Support

For issues or questions:
- Check `/ROUTING_GUIDE.md` for detailed routing info
- Check `/TROUBLESHOOTING.md` for common problems
- Review console logs for error messages
