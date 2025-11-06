# AI 360 - Version Snapshot
**Date:** November 4, 2025  
**Version:** 1.1.0 - Next.js Migration Complete  
**Status:** Stable & Production Ready

---

## Overview
This snapshot captures the complete state of the AI 360 - Auto-Build Deployable Journeys application after successful migration to Next.js 15, making it fully installable, runnable, and deployable in local and production environments.

## Major Update: Next.js Integration

### Framework Details
- **Framework:** Next.js 15.0.3 (App Router)
- **React:** 18.3.1
- **TypeScript:** 5.7.2
- **Tailwind CSS:** 4.0.0
- **Node.js Required:** 18.0.0+

### New Capabilities
✅ **Local Development:** Fully installable with `npm install`  
✅ **Production Builds:** Optimized builds with `npm run build`  
✅ **Hot Module Replacement:** Instant feedback during development  
✅ **Package Management:** Complete dependency configuration  
✅ **Deployment Ready:** Compatible with Vercel, Netlify, Railway, and more

### Commands Available
```bash
npm install        # Install all dependencies
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Create production build
npm start          # Run production server
npm run lint       # Run ESLint for code quality
```

---

## Design System Configuration

### Color Palette (Light Mode)
```css
--primary: rgba(0, 28, 86, 1);                    /* Sapiens Navy Blue #001C56 */
--primary-foreground: rgba(255, 255, 255, 1);     /* White */
--background: rgba(250, 251, 252, 1);              /* Light Gray #FAFBFC */
--foreground: rgba(15, 23, 42, 1);                 /* Dark Slate #0F172A */
--card: rgba(255, 255, 255, 1);                    /* White */
--card-foreground: rgba(15, 23, 42, 1);            /* Dark Slate */
--secondary: rgba(241, 245, 249, 1);               /* Light Blue Gray #F1F5F9 */
--secondary-foreground: rgba(15, 23, 42, 1);       /* Dark Slate */
--muted: rgba(241, 245, 249, 1);                   /* Light Blue Gray */
--muted-foreground: rgba(100, 116, 139, 1);        /* Medium Gray #64748B */
--accent: rgba(14, 165, 233, 1);                   /* Cyan Blue #0EA5E9 */
--accent-foreground: rgba(255, 255, 255, 1);       /* White */
--destructive: rgba(239, 68, 68, 1);               /* Red #EF4444 */
--destructive-foreground: rgba(255, 255, 255, 1);  /* White */
--success: rgba(34, 197, 94, 1);                   /* Green #22C55E */
--success-foreground: rgba(255, 255, 255, 1);      /* White */
--warning: rgba(251, 146, 60, 1);                  /* Orange #FB923C */
--warning-foreground: rgba(255, 255, 255, 1);      /* White */
--border: rgba(226, 232, 240, 1);                  /* Light Gray #E2E8F0 */
--input: rgba(255, 255, 255, 1);                   /* White */
--input-background: rgba(255, 255, 255, 1);        /* White */
--ring: rgba(0, 28, 86, 1);                        /* Sapiens Navy Blue */
```

### Color Palette (Dark Mode)
```css
--primary: rgba(0, 28, 86, 1);                     /* Sapiens Navy Blue #001C56 */
--primary-foreground: rgba(255, 255, 255, 1);      /* White */
--background: rgba(15, 23, 42, 1);                 /* Dark Slate #0F172A */
--foreground: rgba(248, 250, 252, 1);              /* Light Gray #F8FAFC */
--card: rgba(30, 41, 59, 1);                       /* Dark Blue Gray #1E293B */
--card-foreground: rgba(248, 250, 252, 1);         /* Light Gray */
--secondary: rgba(51, 65, 85, 1);                  /* Medium Dark Gray #334155 */
--secondary-foreground: rgba(248, 250, 252, 1);    /* Light Gray */
--muted: rgba(51, 65, 85, 1);                      /* Medium Dark Gray */
--muted-foreground: rgba(148, 163, 184, 1);        /* Medium Light Gray #94A3B8 */
--accent: rgba(56, 189, 248, 1);                   /* Light Cyan #38BDF8 */
--accent-foreground: rgba(255, 255, 255, 1);       /* White */
--destructive: rgba(248, 113, 113, 1);             /* Light Red #F87171 */
--destructive-foreground: rgba(255, 255, 255, 1);  /* White */
--border: rgba(51, 65, 85, 1);                     /* Medium Dark Gray */
--input: rgba(30, 41, 59, 1);                      /* Dark Blue Gray */
--input-background: rgba(30, 41, 59, 1);           /* Dark Blue Gray */
--ring: rgba(129, 140, 248, 1);                    /* Light Indigo #818CF8 */
```

### Typography
```css
Font Family: 'Inter', sans-serif

--text-h1: 32px;        /* Semi-Bold (600) */
--text-h2: 26px;        /* Medium (500) */
--text-h3: 21px;        /* Medium (500) */
--text-h4: 18px;        /* Medium (500) */
--text-base: 14px;      /* Normal (400) */
--text-label: 12px;     /* Semi-Bold (600) */

Font Weights:
--font-weight-semi-bold: 600;
--font-weight-medium: 500;
--font-weight-normal: 400;
```

### Border Radius
```css
--radius: 6px;
--radius-button: 6px;
--radius-card: 6px;
--radius-input: 6px;
--radius-pill: 24px;
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 12px;
--radius-xl: 18px;
```

### Elevations (Shadows)
```css
Light Mode:
--elevation-sm: 0px 0px 1px 0px rgba(3, 11, 23, 0.3), 0px 1px 1px 0px rgba(3, 11, 23, 0.15);
--elevation-md: 0px 2px 4px 0px rgba(3, 11, 23, 0.1), 0px 6px 12px 0px rgba(3, 11, 23, 0.15);
--elevation-lg: 0px 8px 16px 0px rgba(3, 11, 23, 0.1), 0px 12px 24px 0px rgba(3, 11, 23, 0.2);

Dark Mode:
--elevation-sm: 0px 0px 1px 0px rgba(255, 255, 255, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.4);
--elevation-md: 0px 2px 4px 0px rgba(0, 0, 0, 0.3), 0px 6px 12px 0px rgba(0, 0, 0, 0.4);
--elevation-lg: 0px 8px 16px 0px rgba(0, 0, 0, 0.3), 0px 12px 24px 0px rgba(0, 0, 0, 0.5);
```

### Chart Colors
```css
--chart-1: rgba(0, 28, 86, 1);      /* Sapiens Navy Blue */
--chart-2: rgba(14, 165, 233, 1);   /* Cyan Blue */
--chart-3: rgba(168, 85, 247, 1);   /* Purple */
--chart-4: rgba(34, 197, 94, 1);    /* Green */
--chart-5: rgba(251, 146, 60, 1);   /* Orange */
```

### Sidebar Colors
```css
Light Mode:
--sidebar: rgba(222, 223, 225, 1);
--sidebar-foreground: rgba(0, 28, 86, 1);
--sidebar-primary: rgba(0, 28, 86, 1);
--sidebar-primary-foreground: rgba(255, 255, 255, 1);
--sidebar-accent: rgba(0, 187, 255, 1);
--sidebar-accent-foreground: rgba(255, 255, 255, 1);
--sidebar-border: rgba(222, 223, 225, 1);
--sidebar-ring: rgba(0, 28, 86, 1);

Dark Mode:
--sidebar: rgba(30, 41, 59, 1);
--sidebar-foreground: rgba(248, 250, 252, 1);
--sidebar-primary: rgba(129, 140, 248, 1);
--sidebar-primary-foreground: rgba(255, 255, 255, 1);
--sidebar-accent: rgba(56, 189, 248, 1);
--sidebar-accent-foreground: rgba(255, 255, 255, 1);
--sidebar-border: rgba(51, 65, 85, 1);
--sidebar-ring: rgba(129, 140, 248, 1);
```

---

## Application Structure

### Page Flow
1. **Page 1: Landing Page** (`LandingPage.tsx`)
   - Input mode selection (Text, Speech, Upload)
   - Recent prompts display
   - Primary color: Sapiens Navy Blue (#001C56)

2. **Page 2: Input Requirement Screen** (`InputRequirementScreen.tsx`)
   - Text input mode
   - Speech-to-text mode with recording
   - Document upload mode
   - Tips and guidelines panel

3. **Page 3: Form Editor** (`FormEditorPage.tsx`)
   - Left Panel: Configuration options (collapsible)
   - Center Panel: Live preview canvas
   - Right Panel: Tests/Deploy/Schema tabs (collapsible)

### Key Components

#### Navigation
- **TopNav.tsx**: Main navigation with logo, dark mode toggle, profile menu
- New Project button uses primary color on hover

#### Form Components
- **FormRenderer.tsx**: Live form preview with template support
- **FormConfigurator.tsx**: Configuration panel for form customization
- **InputLayer.tsx**: Input layer with speech recognition

#### Panels
- **SchemaViewer.tsx**: JSON schema display with copy/download
- **TestViewer.tsx**: Unit test display and execution
- **DeploymentPanel.tsx**: Deployment configuration and mock API endpoints

### Theme Templates (FormEditorPage.tsx)
```javascript
{ id: 'ocean', name: 'Ocean', colors: ['#0e7490', '#06b6d4'] }
{ id: 'forest', name: 'Forest', colors: ['#047857', '#10b981'] }
{ id: 'sunset', name: 'Sunset', colors: ['#dc2626', '#f59e0b'] }
{ id: 'primary', name: 'Primary', colors: ['#001C56', '#00BBFF'] }  // Sapiens colors
{ id: 'slate', name: 'Slate', colors: ['#475569', '#64748b'] }
```

### Form Templates
```javascript
{ id: 'simple', name: 'Simple', layout: 'single' }
{ id: 'two-column', name: 'Two Column', layout: 'two-column' }
{ id: 'wizard', name: 'Wizard', layout: 'wizard' }
{ id: 'carded', name: 'Carded', layout: 'carded' }
{ id: 'compact', name: 'Compact', layout: 'compact' }
```

---

## Component Configurations

### FormConfigurator Default Theme
```javascript
{
  primaryColor: '#001C56',      // Sapiens Navy Blue
  accentColor: '#0ea5e9',       // Cyan Blue
  backgroundColor: '#fafbfc',   // Light Gray
  cardBackground: '#ffffff',    // White
  borderRadius: '8px',
  shadowLevel: 'medium',
  fontFamily: 'Inter',
}
```

### Button Classes Pattern
```css
Primary Buttons:
bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90

Outline Buttons:
border border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary

Ghost Buttons:
rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary
```

---

## Features Implemented

### ✅ Completed Features
- [x] Three-page navigation flow
- [x] Landing page with input mode selection
- [x] Text input mode
- [x] Speech-to-text with recording indicator
- [x] Document upload with drag & drop
- [x] Form editor with 3-panel layout
- [x] Collapsible side panels
- [x] Live form preview
- [x] Multiple form templates
- [x] Theme customization
- [x] Schema generation and viewing
- [x] Mock API endpoint generation
- [x] Unit test generation and display
- [x] Deployment panel with progress
- [x] Dark mode support
- [x] Sapiens design system integration
- [x] Primary color consistency across all buttons
- [x] Vibrant icon containers using design system colors
- [x] Clipboard API with fallback support

### 🎨 Design System Features
- [x] CSS variable-based theming
- [x] Consistent typography using Inter font
- [x] Standardized border radius variables
- [x] Elevation system with box shadows
- [x] Responsive spacing system
- [x] Primary color (Sapiens Navy Blue) on all action items
- [x] Vibrant colored icon containers:
  - Accent (Cyan Blue) - Text/Code icons
  - Purple - Speech/Microphone icons
  - Success (Green) - Upload/File/Test icons
  - Warning (Orange) - Deploy/AI icons

---

## File Structure
```
├── App.tsx                          # Main app entry point
├── components/
│   ├── LandingPage.tsx              # Page 1: Input mode selection
│   ├── InputRequirementScreen.tsx   # Page 2: Requirement input
│   ├── FormEditorPage.tsx           # Page 3: Form editor main
│   ├── FormRenderer.tsx             # Live form preview
│   ├── FormConfigurator.tsx         # Configuration panel
│   ├── InputLayer.tsx               # Input layer with speech
│   ├── SchemaViewer.tsx             # Schema display panel
│   ├── TestViewer.tsx               # Test display panel
│   ├── DeploymentPanel.tsx          # Deployment panel
│   ├── TopNav.tsx                   # Top navigation
│   └── ui/                          # ShadCN UI components
├── styles/
│   └── globals.css                  # Design system & CSS variables
├── types/
│   └── schema.ts                    # TypeScript interfaces
└── utils/
    ├── aiParser.ts                  # AI parsing utilities
    ├── mockApi.ts                   # Mock API generator
    ├── testGenerator.ts             # Unit test generator
    └── clipboard.ts                 # Clipboard utility with fallback
```

---

## Restoration Instructions

To restore this exact version:

1. **Verify CSS Variables**: Ensure `/styles/globals.css` has:
   - `--primary: rgba(0, 28, 86, 1)` (Sapiens Navy Blue)
   - All color, typography, and spacing variables as documented above

2. **Component Verification**:
   - Check `FormConfigurator.tsx`: `primaryColor: '#001C56'`
   - Check `FormEditorPage.tsx`: Primary theme colors `['#001C56', '#00BBFF']`

3. **Button Classes**: All buttons should use:
   - `bg-primary` for primary actions
   - `hover:bg-primary/90` for hover states
   - `hover:text-primary` for outline/ghost buttons

4. **Typography**: All text should use Inter font family with no Tailwind font size/weight classes (except where explicitly needed)

---

## Notes
- All components use CSS variables from `globals.css`
- Design system is fully customizable via CSS variables
- Primary color (Sapiens Navy Blue) is consistently applied across all interactive elements
- No hardcoded purple/indigo colors remain in the codebase
- Typography controlled by base CSS styles, not Tailwind classes
- Icon containers use vibrant colors from design system (accent, purple, success, warning)
- Clipboard operations use fallback mechanism for browsers blocking Clipboard API

---

## Bug Fixes

### Clipboard API Error (Nov 4, 2025)
**Issue**: `NotAllowedError: Failed to execute 'writeText' on 'Clipboard'`  
**Cause**: Some browsers and environments block the Clipboard API due to permissions policy  
**Solution**: Created `/utils/clipboard.ts` utility with fallback mechanism
- Primary method: Modern `navigator.clipboard.writeText()`
- Fallback: Legacy `document.execCommand('copy')` with hidden textarea
- All clipboard operations now use `copyToClipboard()` utility function
- Updated components: `SchemaViewer.tsx`, `DeploymentPanel.tsx`
- Provides user feedback via toast notifications on success/failure

---

## Mock Scenarios

⚠️ **IMPORTANT**: The system is currently configured with a **Travel Insurance Mock Scenario**.  
Regardless of what prompt you enter, it will always generate the Travel Insurance Quote & Buy journey.

See `TRAVEL_INSURANCE_MOCK.md` for complete documentation of the mock scenario.

To restore normal AI parsing, modify `/utils/aiParser.ts`.

---

## Version History
- **v1.0.2** (Nov 4, 2025): Added Travel Insurance mock scenario with 40+ fields, 5-step wizard, 9 API endpoints
- **v1.0.1** (Nov 4, 2025): Fixed Clipboard API error with fallback support, vibrant icon containers
- **v1.0.0** (Nov 4, 2025): Initial stable release with Sapiens design system
