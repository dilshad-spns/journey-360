# Changelog

All notable changes to the AI 360 - Auto-Build Deployable Journeys project.

---

## [1.1.0] - 2025-11-04

### 🚀 Major Update: Next.js Migration

Migrated the entire project to Next.js 15 for production-ready local development and deployment capabilities.

#### New Features
- **Next.js 15 Integration**: Complete migration to Next.js App Router
- **Local Development**: Fully installable and runnable in local environment
- **Production Builds**: Optimized builds with `npm run build`
- **Hot Module Replacement**: Instant feedback during development
- **Type Safety**: Enhanced TypeScript configuration
- **Package Management**: Complete package.json with all dependencies

#### New Files Created (Configuration)
- `package.json` - Complete dependency management
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore rules (ignores .env.local)
- `.eslintrc.json` - ESLint configuration
- `.env` - Default configuration values (committed)
- `.env.example` - Environment variable template with all options

#### New Files Created (Application)
- `/app/layout.tsx` - Next.js root layout
- `/app/page.tsx` - Main application page
- `/styles/tailwind.css` - Tailwind CSS import

#### New Files Created (Documentation)
- `INSTALLATION.md` - Comprehensive installation guide (3,500 words)
- `QUICK_START.md` - 2-minute quick start guide
- `DEPLOYMENT.md` - Multi-platform deployment guide (3,000 words)
- `TROUBLESHOOTING.md` - Common issues and solutions (2,500 words)
- `ENVIRONMENT_VARIABLES.md` - Complete env vars reference (3,000 words)
- `ENV_FILES_GUIDE.md` - Understanding .env files structure (2,500 words)
- `MIGRATION_NOTES.md` - Next.js migration details
- `NEXTJS_MIGRATION_SUMMARY.md` - Comprehensive migration summary (3,500 words)
- `PROJECT_OVERVIEW.md` - Complete project overview and index (2,500 words)

#### Updated Files
- `README.md` - Added installation, build, deployment, and env vars sections
- `CHANGELOG.md` - Added v1.1.0 entry
- `VERSION_SNAPSHOT.md` - Updated to v1.1.0 with Next.js details
- `/styles/globals.css` - Added Tailwind CSS v4.0 import
- `QUICK_START.md` - Added environment variables section
- `INSTALLATION.md` - Added comprehensive env vars documentation

#### Technical Details
- **Framework**: Next.js 15.0.3
- **React**: 18.3.1
- **TypeScript**: 5.7.2
- **Tailwind CSS**: 4.0.0
- **Node.js Required**: 18.0.0+

#### Preserved Features
✅ All existing features remain unchanged
✅ UI/UX exactly the same
✅ Travel Insurance mock scenario
✅ Three-page application flow
✅ Form editor with 3-panel layout
✅ Dark mode support
✅ Speech recognition
✅ All configuration options
✅ Design system variables

#### Commands
```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Create production build
npm start          # Run production server
npm run lint       # Run ESLint
```

---

## [1.0.2] - 2025-11-04

### 🎯 Major Feature: Travel Insurance Mock Scenario

Implemented a comprehensive Travel Insurance Quote & Buy journey as a permanent mock scenario. **The system now always generates this specific journey regardless of user input**, demonstrating the full capability of the AI 360 platform.

#### Mock Scenario Features
- **5-Step Wizard Journey**: Trip Info → Traveler Info → Coverage → Payment → Confirmation
- **40+ Form Fields**: Complete insurance application with all necessary data points
- **9 Mock API Endpoints**: Including plan fetching, premium calculation, and policy issuance
- **25+ Generated Tests**: Comprehensive test coverage including business logic validation
- **Industry Business Rules**: Age limits (0-70), trip duration (≤180 days), passport validation

#### Journey Breakdown

**Step 1: Trip Information**
- Trip type selection (Single/Annual)
- Destination dropdown (5 options)
- Date range picker with validation
- Traveler count (1-10)

**Step 2: Traveler Information**
- Personal details (name, DOB, gender)
- Passport number with format validation
- Nationality and relationship
- Medical conditions (conditional textarea)
- Complete address fields

**Step 3: Coverage & Add-ons**
- Three plan tiers (Bronze $50, Silver $100, Gold $150)
- Four optional add-ons ($15-$40 each)
- Dynamic premium calculation
- Plan inclusions/exclusions display

**Step 4: Review & Payment**
- Five payment method options
- Card details with format validation
- Declaration and terms checkboxes
- Collapsible summary review

**Step 5: Confirmation**
- Policy number generation
- PDF download simulation
- Helpline information display

#### Updated Files
- `/utils/aiParser.ts` - Now returns travel insurance schema regardless of input
- `/utils/mockApi.ts` - Added 9 insurance-specific API endpoints
- `/utils/testGenerator.ts` - Added 7 travel insurance specific test cases
- `/TRAVEL_INSURANCE_MOCK.md` - Complete documentation (new file)
- `/README.md` - Project overview with mock scenario info (new file)

#### API Endpoints Added
1. `GET /api/travel-insurance/plans` - Fetch coverage plans with inclusions/exclusions
2. `POST /api/travel-insurance/calculate-premium` - Dynamic premium calculation
3. `POST /api/travel-insurance/issue-policy` - Policy issuance simulation
4. `POST /api/travel-insurance/process-payment` - Payment processing

#### Tests Added
- Travel duration validation (≤180 days)
- Traveler age validation (0-70 years)
- Passport format validation
- Premium calculation with add-ons
- Plan API integration tests
- Policy issuance workflow tests
- Wizard navigation logic tests

### 📚 Documentation

#### New Documentation Files
- `TRAVEL_INSURANCE_MOCK.md` - Comprehensive 500+ line documentation covering:
  - Complete use case and scenarios
  - Journey architecture
  - Field-by-field breakdowns
  - API endpoint specifications
  - Business rules
  - Testing strategy
  - Design system integration

- `README.md` - Project overview including:
  - Quick start guide
  - Feature highlights
  - Mock scenario summary
  - Technology stack
  - How to restore normal parsing

#### Updated Documentation
- `CHANGELOG.md` - Added mock scenario section and v1.0.2 details
- `VERSION_SNAPSHOT.md` - Added mock scenario warning and version bump

### 🎨 Design Enhancements

All components use the Sapiens design system:
- Wizard progress indicators with accent color
- Plan cards with hover effects
- Vibrant icon containers per step
- Responsive layout for all viewports
- Clear visual hierarchy

### 💡 Usage Notes

**Important**: This is a mock scenario for demonstration purposes.
- Any text input will generate the travel insurance journey
- Speech input will generate the travel insurance journey
- File upload will generate the travel insurance journey

To restore normal AI parsing, modify `/utils/aiParser.ts` as documented in README.md.

---

## [1.0.1] - 2025-11-04

### 🐛 Bug Fixes

#### Clipboard API Error Fixed
- **Issue**: `NotAllowedError: Failed to execute 'writeText' on 'Clipboard'`
- **Root Cause**: Modern browsers block the Clipboard API when permissions policy doesn't allow it
- **Solution**: Implemented robust clipboard utility with automatic fallback
  - Created `/utils/clipboard.ts` with `copyToClipboard()` function
  - Primary: Uses modern `navigator.clipboard.writeText()`
  - Fallback: Uses legacy `document.execCommand('copy')` with hidden textarea
  - Graceful error handling with user feedback via toast notifications

#### Updated Components
- `SchemaViewer.tsx`: Schema copy functionality now uses fallback-safe clipboard
- `DeploymentPanel.tsx`: URL and cURL command copying now uses fallback-safe clipboard

### 🎨 Design Enhancements

#### Vibrant Icon Containers
Replaced muted gray icon containers with vibrant colors from the design system:

**Color Mapping:**
- **Accent (Cyan Blue #0EA5E9)**: Text/Code related icons
  - Landing page "Paste as Text" mode
  - SchemaViewer empty state
  
- **Purple (#A855F7)**: Speech/Audio related icons
  - Landing page "Speech to Text" mode
  - InputRequirementScreen speech mode header
  - Recording button (non-recording state)
  
- **Success (Green #22C55E)**: Upload/File/Success related icons
  - Landing page "Upload Document" mode
  - InputRequirementScreen upload mode header
  - File upload icon and uploaded file icon
  - Guidelines checkmarks
  - TestViewer empty state
  
- **Warning (Orange #FB923C)**: AI/Deploy/Action related icons
  - Landing page header "Create with AI" sparkle icon
  - DeploymentPanel empty state

#### Updated Components
- `LandingPage.tsx`: All three input mode cards now have vibrant colored icon containers
- `InputRequirementScreen.tsx`: Header icons, upload zone, file display, and guideline checkmarks
- `SchemaViewer.tsx`: Empty state icon container
- `TestViewer.tsx`: Empty state icon container
- `DeploymentPanel.tsx`: Empty state icon container

### 📚 Documentation

#### Updated Files
- `VERSION_SNAPSHOT.md`: 
  - Added vibrant icon container documentation
  - Added clipboard fix documentation
  - Updated version to 1.0.1
  - Added bug fixes section
  - Updated file structure to include clipboard utility

---

## [1.0.0] - 2025-11-04

### 🎉 Initial Release

#### Core Features
- Three-page navigation flow
- Landing page with input mode selection
- Text input mode with live editing
- Speech-to-text with recording indicator
- Document upload with drag & drop
- Form editor with 3-panel layout
- Collapsible side panels
- Live form preview
- Multiple form templates (Simple, Two Column, Wizard, Carded, Compact)
- Theme customization
- Schema generation and viewing
- Mock API endpoint generation
- Unit test generation and display
- Deployment panel with progress simulation
- Dark mode support

#### Design System
- Sapiens Navy Blue (#001C56) as primary color
- CSS variable-based theming
- Inter font family throughout
- Standardized border radius variables
- Elevation system with box shadows
- Responsive spacing system
- Consistent button styling patterns

#### Technical Stack
- React with TypeScript
- Tailwind CSS v4.0
- shadcn/ui components
- JSON Schema for form definitions
- Mock API generation
- Unit test generation

---

## Color Reference

### Design System Colors

**Primary Colors:**
- Primary: `#001C56` (Sapiens Navy Blue)
- Accent: `#0EA5E9` (Cyan Blue)
- Success: `#22C55E` (Green)
- Warning: `#FB923C` (Orange)
- Destructive: `#EF4444` (Red)
- Purple: `#A855F7` (Purple)

**Neutral Colors:**
- Background: `#FAFBFC` (Light Gray)
- Foreground: `#0F172A` (Dark Slate)
- Card: `#FFFFFF` (White)
- Border: `#E2E8F0` (Light Gray)
- Muted: `#F1F5F9` (Light Blue Gray)

---

## Migration Notes

### From v1.0.0 to v1.0.1

No breaking changes. This is a bug fix and enhancement release.

**What's New:**
1. Clipboard operations are now more reliable across all browsers
2. Icon containers have more visual appeal with vibrant colors
3. Better error handling with user-friendly toast messages

**Action Required:**
- None. All changes are backward compatible.

---

## Mock Scenarios

### Travel Insurance Journey (Active)
The system is currently configured with a comprehensive travel insurance mock scenario that demonstrates the full capability of the AI 360 platform. **Regardless of what prompt you enter, the system will generate the Travel Insurance Quote & Buy journey.**

**Mock Scenario Details:**
- **Use Case**: Seamless travel insurance purchase through a guided multi-step wizard
- **Steps**: 5-step journey (Trip Info → Traveler Info → Coverage → Payment → Confirmation)
- **Fields**: 40+ form fields with comprehensive validations
- **Layout**: Wizard layout with step indicators
- **API Endpoints**: 9 mock endpoints including plan fetching, premium calculation, and policy issuance
- **Tests**: 25+ generated tests including travel-specific validations

**Journey Steps:**
1. **Trip Information**: Type, destination, dates, number of travelers
2. **Traveler Information**: Personal details, passport, address (repeatable for multiple travelers)
3. **Coverage & Add-ons**: Bronze/Silver/Gold plans with optional add-ons
4. **Review & Payment**: Payment method selection with card details
5. **Confirmation**: Policy number and download link

This mock scenario showcases:
- Complex wizard forms with conditional logic
- Multi-step validation flows
- Dynamic premium calculations
- API integration patterns
- Comprehensive test coverage
- Industry-specific business rules (age limits, trip duration, passport validation)

To restore normal AI parsing, modify `/utils/aiParser.ts` to use the original parsing logic.

---

## Known Issues

None at this time.

---

## Future Roadmap

- [ ] Real backend integration with Supabase
- [ ] Actual deployment to cloud providers
- [ ] Real-time collaboration features
- [ ] Version control for forms
- [ ] Advanced validation rules editor
- [ ] Custom component library integration
- [ ] Export to multiple frameworks (Vue, Svelte, Angular)
- [ ] A/B testing capabilities
- [ ] Analytics dashboard
- [ ] Form submission data management
