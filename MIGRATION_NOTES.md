# Migration to Next.js - Important Notes

## File Structure Changes

This project has been migrated from a standalone React app to a Next.js application.

### Key Changes

#### Old Structure (Deprecated)
- `/App.tsx` - **No longer used** (kept for reference only)
- Standalone React application

#### New Structure (Active)
- `/app/layout.tsx` - Next.js root layout
- `/app/page.tsx` - Main application page (replaces App.tsx functionality)
- All other files remain in their original locations

### Important Notes

1. **Do NOT import from `/App.tsx`**
   - The file is kept for reference only
   - All functionality has been moved to `/app/page.tsx`

2. **Import Paths**
   - Components: `import { Component } from '../components/Component'`
   - Utils: `import { util } from '../utils/util'`
   - Types: `import { Type } from '../types/schema'`
   - Styles: Already imported in `/app/layout.tsx`

3. **Component Updates**
   - All existing components work without modification
   - They use relative imports which remain valid
   - No changes needed to component logic or styling

4. **Running the Application**
   - Use `npm run dev` (not any previous commands)
   - Application runs on `http://localhost:3000`
   - Hot module replacement is enabled

### Migration Checklist

✅ Created Next.js configuration files:
- `package.json` with Next.js dependencies
- `next.config.js` for Next.js settings
- `tsconfig.json` for TypeScript configuration
- `.gitignore` for version control
- `.eslintrc.json` for code quality

✅ Created Next.js App Router structure:
- `/app/layout.tsx` - Root layout with metadata
- `/app/page.tsx` - Main page component

✅ Updated styles:
- `/styles/globals.css` now imports Tailwind CSS v4.0
- All CSS variables and design system remain unchanged

✅ All existing features preserved:
- 3-page application flow (Landing → Input → Editor)
- Travel Insurance mock scenario
- Form editor with 3-panel layout
- All UI/UX elements unchanged
- Dark mode support
- Speech recognition
- All configuration options

### No Breaking Changes

All existing features, UI/UX, and functionality remain exactly the same. The migration only changes:
- How the application starts (Next.js dev server)
- File organization (App Router structure)
- Build process (Next.js build system)

The user experience and all implemented features are completely preserved.

---

**Migration Date**: November 4, 2025  
**Next.js Version**: 15.0.3  
**Status**: Complete ✅
