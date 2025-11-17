# Journey 360 - Routing Guide

## Overview

The application now uses **Next.js App Router** with proper page-based routing. Each major screen has its own dedicated route.

## Route Structure

```
/                    → Landing Page (Home)
/prompt?mode={mode}  → Input/Prompt Screen
/builder             → Form Builder/Editor Page
```

## Routes Explained

### 1. Landing Page (`/`)
- **File**: `/app/page.tsx`
- **Component**: `LandingPage`
- **Purpose**: Initial landing screen where users select their input mode
- **Features**:
  - Mode selection buttons (Text, Speech, Upload)
  - No TopNav displayed
  - Navigates to `/prompt?mode={selected_mode}` on selection

### 2. Prompt/Input Page (`/prompt`)
- **File**: `/app/prompt/page.tsx`
- **Component**: `InputRequirementScreen`
- **Purpose**: Input screen for collecting user requirements
- **URL Parameters**:
  - `mode`: Input mode (text | speech | upload)
  - Example: `/prompt?mode=text`
- **Features**:
  - TopNav displayed
  - Rich text editor / speech input / file upload
  - Grammar checking
  - Import integrations (URL, Jira, GitHub)
  - Back button → returns to `/`
  - Continue button → saves requirements and navigates to `/builder`

### 3. Builder/Editor Page (`/builder`)
- **File**: `/app/builder/page.tsx`
- **Component**: `FormEditorPage`
- **Purpose**: Form editor with schema, tests, and deployment
- **Features**:
  - TopNav displayed
  - Retrieves requirements from sessionStorage
  - Generates schema, tests, and mock APIs
  - Form configurator
  - Schema viewer
  - Test viewer
  - Deployment panel
  - If no requirements found → redirects to `/prompt`

## Navigation Flow

```
Landing Page (/)
    ↓
    Select Mode (Text/Speech/Upload)
    ↓
Input Page (/prompt?mode=text)
    ↓
    Enter Requirements & Continue
    ↓
Builder Page (/builder)
    ↓
    Edit/Configure Form
    ↓
    Deploy
```

## Session Storage

The application uses `sessionStorage` to persist data between routes:

- **Key**: `requirements`
- **Set**: When user clicks "Continue" on `/prompt` page
- **Read**: When `/builder` page loads
- **Clear**: When "New Project" is clicked (returns to `/`)

## Layout & Global State

### Layout (`/app/layout.tsx`)
- Wraps all pages
- Manages global dark mode state
- Shows TopNav on all pages except landing (`/`)
- Includes Toaster for notifications

### TopNav Component
- Displayed on `/prompt` and `/builder` routes
- Features:
  - Logo (clickable → navigates to `/`)
  - New Project button (clears session, navigates to `/`)
  - Dark mode toggle
  - User profile menu

## Local Development

### Running the App

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

### Testing Routes

1. **Landing Page**: Navigate to `http://localhost:3000/`
2. **Prompt Page (Text)**: Navigate to `http://localhost:3000/prompt?mode=text`
3. **Prompt Page (Speech)**: Navigate to `http://localhost:3000/prompt?mode=speech`
4. **Builder Page**: Navigate to `http://localhost:3000/builder` (requires requirements in sessionStorage)

### Direct Route Access

- Accessing `/builder` directly without requirements → redirects to `/prompt`
- Accessing `/prompt` without mode parameter → defaults to `text` mode

## Migration from Previous Version

### Before (Single Route)
- All screens on `/` route
- State-based screen switching
- No browser history for navigation

### After (Multi-Route)
- Each screen has dedicated route
- Proper browser back/forward support
- Shareable URLs for specific screens
- Better SEO and analytics tracking

## Implementation Details

### Route Components

All route files use:
- `'use client'` directive (Next.js client components)
- `useRouter` from `next/navigation` for navigation
- `sessionStorage` for data persistence between routes

### Type Safety

TypeScript types are maintained across routes:
- `InputMode`: 'text' | 'speech' | 'upload'
- `FormSchema`: Defined in `/types/schema.ts`
- `TestCase`: Test case structure
- `MockApiEndpoint`: Mock API endpoint structure

## Best Practices

1. **Use Next.js Router**: Always use `router.push()` for navigation
2. **Preserve State**: Use `sessionStorage` for data that needs to persist across routes
3. **Clear State**: Clear `sessionStorage` when starting a new project
4. **Handle Missing Data**: Always check for required data and redirect if missing
5. **URL Parameters**: Use query parameters for configuration (e.g., mode)

## Troubleshooting

### Issue: Builder page shows blank/redirects immediately
**Solution**: Ensure requirements are saved in sessionStorage before navigating to `/builder`

### Issue: Mode not selected on prompt page
**Solution**: Check URL includes `?mode=text` (or speech/upload)

### Issue: TopNav not showing
**Solution**: TopNav only shows on `/prompt` and `/builder`, not on landing page `/`

### Issue: Dark mode not persisting
**Solution**: Check browser localStorage for `darkMode` key

## Legacy Files

### `/App.tsx` (Old Single-Route App)
This file contains the previous single-route implementation and is no longer used. It has been replaced by:
- `/app/page.tsx` (Landing)
- `/app/prompt/page.tsx` (Input)
- `/app/builder/page.tsx` (Editor)

The file is kept for reference but can be safely deleted if needed.

## Future Enhancements

Potential routing improvements:
- Add `/projects` route for saved projects
- Add `/templates` route for form templates
- Add `/settings` route for user preferences
- Implement proper authentication routes (`/login`, `/signup`)
- Add dynamic routes for specific projects (`/project/[id]`)
