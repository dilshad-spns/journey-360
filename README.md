# Journey 360 – Auto-Build Deployable Journeys

An AI-powered system that takes user stories or speech input and automatically generates complete deployable forms with UI, data bindings, mock APIs, validations, and unit tests.

---

## 🚀 **NEW: Ready for Local Development!**

**Everything is now configured for local development with full styling support.**

### Quick Start (3 Commands)
```bash
npm install              # Install dependencies
npm run check-setup      # Verify everything is configured
npm run dev             # Start development server
```

**📖 For detailed setup instructions, see:** [README_LOCAL_SETUP.md](./README_LOCAL_SETUP.md)

---

## 🚨 Current Configuration: Travel Insurance Mock

**The system is currently running with a comprehensive Travel Insurance mock scenario.**

### What This Means
- **Any prompt you enter** will generate the same Travel Insurance Quote & Buy journey
- This demonstrates the full capability of the AI 360 platform
- Perfect for demos, testing, and showcasing the system

### Mock Journey Overview
```
🛫 Travel Insurance Quote & Buy Journey
├─ Step 1: Trip Information (5 fields)
├─ Step 2: Traveler Information (14 fields per traveler)
├─ Step 3: Coverage & Add-ons (5 fields)
├─ Step 4: Review & Payment (7 fields)
└─ Step 5: Confirmation (Policy issued!)

📊 Total: 40+ fields | 9 API endpoints | 25+ tests
```

**See `TRAVEL_INSURANCE_MOCK.md` for complete details.**

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (or yarn/pnpm)
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd ai-360-auto-build-deployable-journeys
   ```

2. **Fix import statements** (CRITICAL - First time only)
   ```bash
   npm run fix-imports
   ```
   
   ⚠️ **This step is required before npm install!** It fixes versioned imports that cause module resolution errors.

3. **Install dependencies**
   ```bash
   npm install
   ```

   Or if you prefer yarn:
   ```bash
   yarn install
   ```

   Or if you prefer pnpm:
   ```bash
   pnpm install
   ```

3. **(Optional) Customize configuration**
   
   The app works with defaults in `.env`. To customize:
   ```bash
   # Copy template to create local overrides
   cp .env.example .env.local
   
   # Edit .env.local with your preferences
   # (e.g., change port, disable features, adjust timing)
   ```

   **Note:** This step is completely optional!

### Development

Run the development server:

```bash
npm run dev
```

Or:
```bash
yarn dev
```

Or:
```bash
pnpm dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

**Hot Reload:** The development server supports hot module replacement. Changes to your code will automatically reflect in the browser.

### Building for Production

1. **Create an optimized production build**
   ```bash
   npm run build
   ```

   This will:
   - Compile TypeScript to JavaScript
   - Optimize React components
   - Minify CSS and JavaScript
   - Generate static assets
   - Create the `.next` folder with production build

2. **Start the production server**
   ```bash
   npm start
   ```

   The production server will start at [http://localhost:3000](http://localhost:3000)

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

---

## ✨ Key Features

### 🎨 Three-Page Application
1. **Landing Page** - Choose input mode (Text / Speech / Upload)
2. **Input Screen** - Provide requirements through your preferred method
3. **Form Editor** - 3-panel layout with live preview and configuration

### 🛠️ 8 Integrated Layers
- **Layer 1**: Speech/Text/Upload Input
- **Layer 2**: AI Parsing (currently: Travel Insurance mock)
- **Layer 3**: JSON Schema Generation
- **Layer 4**: Form UI Rendering
- **Layer 5**: Data Binding & Validation
- **Layer 6**: Mock API Generation
- **Layer 7**: Unit Test Generation
- **Layer 8**: Deployment Simulation

### 🎨 Design System
- **Primary Color**: Sapiens Navy Blue (#001C56)
- **Typography**: Inter font family
- **CSS Variables**: Fully customizable through `globals.css`
- **Vibrant Icons**: Accent, Purple, Success, Warning colors
- **Responsive**: Desktop, tablet, and mobile optimized

### 🧪 Advanced Features
- ✅ Multi-step wizard forms
- ✅ Collapsible side panels
- ✅ Live form preview
- ✅ Multiple templates (Simple, Two-Column, Wizard, Carded, Compact)
- ✅ Theme customization
- ✅ Schema viewer with copy/download
- ✅ Auto-generated tests with pass/fail simulation
- ✅ Mock API endpoints with cURL examples
- ✅ Deployment simulation with progress tracking
- ✅ Dark mode support

---

## 🎯 Quick Start Guide

### Test the Travel Insurance Journey

1. **Navigate to Landing Page**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Click any input mode (Text, Speech, or Upload)

2. **Enter Any Prompt**
   - Try: "Create a contact form"
   - Try: "Build a registration page"
   - Try: "I need a survey"
   - **Result**: You'll get the Travel Insurance journey every time!

3. **Explore the Form Editor**
   - **Left Panel**: Configure templates, themes, and UI settings
   - **Center Panel**: Live preview canvas with viewport controls
   - **Right Panel**: View schema, tests, and deployment info

4. **Navigate the Wizard**
   - Complete all 5 steps
   - See real-time validation
   - View dynamic premium calculation

---

## 📁 Project Structure

```
ai-360-auto-build-deployable-journeys/
├── app/
│   ├── layout.tsx               # Next.js root layout
│   └── page.tsx                 # Main application page
├── components/
│   ├── LandingPage.tsx          # Input mode selection
│   ├── InputRequirementScreen.tsx  # Requirement input
│   ├── FormEditorPage.tsx       # Main editor with 3 panels
│   ├── FormRenderer.tsx         # Live form preview
│   ├── FormConfigurator.tsx     # Configuration panel
│   ├── SchemaViewer.tsx         # JSON schema display
│   ├── TestViewer.tsx           # Generated tests
│   ├── DeploymentPanel.tsx      # Deployment simulation
│   ├── TopNav.tsx               # Navigation bar
│   ├── InputLayer.tsx           # Input layer component
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ... (40+ components)
├── styles/
│   └── globals.css              # Design system variables & Tailwind
├── types/
│   └── schema.ts                # TypeScript interfaces
├── utils/
│   ├── aiParser.ts              # 🎯 MOCK: Travel Insurance
│   ├── clipboard.ts             # Clipboard with fallback
│   ├── mockApi.ts               # API endpoint generator
│   └── testGenerator.ts         # Test case generator
├── public/                      # Static assets
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── CHANGELOG.md                 # Version history
├── VERSION_SNAPSHOT.md          # Current state snapshot
└── TRAVEL_INSURANCE_MOCK.md    # Mock scenario docs
```

---

## 🎯 Travel Insurance Mock Details

### Journey Steps

#### Step 1: Trip Information
- Trip Type (Single / Annual)
- Destination (5 options)
- Start & End Dates (max 180 days)
- Number of Travelers (1-10)

#### Step 2: Traveler Information
- Personal details (Name, DOB, Gender)
- Passport & Nationality
- Medical conditions
- Full address
- **Age Limit**: 0-70 years

#### Step 3: Coverage & Add-ons
**Plans:**
- 🥉 Bronze: $50/person - Essential coverage
- 🥈 Silver: $100/person - Comprehensive coverage
- 🥇 Gold: $150/person - Premium coverage

**Add-ons:**
- Adventure Sports: +$25
- Rental Car Excess: +$15
- COVID-19 Coverage: +$20
- Cancel Any Reason: +$40

#### Step 4: Review & Payment
- Payment method selection
- Card details (validated format)
- Declaration & Terms acceptance

#### Step 5: Confirmation
- Policy Number: `TRV-{timestamp}-{code}`
- PDF Download
- Helpline: +1-800-TRAVEL-HELP

---

## 🧪 Generated Tests (25+)

### Business Logic Tests
- ✅ Trip duration validation (≤180 days)
- ✅ Age validation (0-70 years)
- ✅ Passport format validation
- ✅ Premium calculation with add-ons
- ✅ Wizard navigation logic

### Integration Tests
- ✅ API fetch for coverage plans
- ✅ Policy issuance flow
- ✅ Payment processing
- ✅ Error handling

### Field Validation Tests
- ✅ All 40+ fields with specific rules
- ✅ Required field checks
- ✅ Format validations
- ✅ Conditional logic

---

## 🔌 Mock API Endpoints (9)

1. `POST /api/travel-insurance-quote-&-buy/submit` - Submit application
2. `GET /api/travel-insurance-quote-&-buy` - List submissions
3. `GET /api/travel-insurance-quote-&-buy/:id` - Get single submission
4. `PUT /api/travel-insurance-quote-&-buy/:id` - Update submission
5. `DELETE /api/travel-insurance-quote-&-buy/:id` - Delete submission
6. `GET /api/travel-insurance/plans` - Fetch coverage plans
7. `POST /api/travel-insurance/calculate-premium` - Calculate premium
8. `POST /api/travel-insurance/issue-policy` - Issue policy
9. `POST /api/travel-insurance/process-payment` - Process payment

---

## 🎨 Design System Colors

### Primary Palette
- **Primary**: `#001C56` - Sapiens Navy Blue
- **Accent**: `#0EA5E9` - Cyan Blue
- **Success**: `#22C55E` - Green
- **Warning**: `#FB923C` - Orange
- **Purple**: `#A855F7` - Purple
- **Destructive**: `#EF4444` - Red

### Neutral Palette
- **Background**: `#FAFBFC` - Light Gray
- **Foreground**: `#0F172A` - Dark Slate
- **Card**: `#FFFFFF` - White
- **Border**: `#E2E8F0` - Light Gray
- **Muted**: `#F1F5F9` - Light Blue Gray

### Customization
All colors are CSS variables defined in `/styles/globals.css`. To customize:

1. Open `/styles/globals.css`
2. Modify the CSS variables in the `:root` section (light mode) or `.dark` section (dark mode)
3. Changes will automatically apply across the entire application

---

## 🔧 Technology Stack

- **Framework**: Next.js 15 (React 18)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS v4.0
- **Components**: shadcn/ui (40+ components)
- **Icons**: Lucide React
- **Forms**: React Hook Form 7.55.0
- **Validation**: JSON Schema
- **Toasts**: Sonner 2.0.3
- **Charts**: Recharts 2.15 (available)
- **Date Picker**: React Day Picker 9.4
- **Carousel**: Embla Carousel 8.5

---

## 🔐 Environment Variables

### Required Variables

**None!** The application works out of the box with no environment variables required.

### Optional Variables

Customize behavior by creating a `.env.local` file:

```env
# Application
PORT=3000                                    # Change default port
NEXT_PUBLIC_APP_URL=http://localhost:3000   # App URL

# Features
NEXT_PUBLIC_ENABLE_SPEECH=true              # Speech recognition
NEXT_PUBLIC_ENABLE_UPLOAD=true              # File upload
NEXT_PUBLIC_ENABLE_DARK_MODE=true           # Dark mode toggle

# Mock Configuration
NEXT_PUBLIC_MOCK_API_DELAY=2000             # Processing delay (ms)
```

### Future Integration

When adding external services:

```env
# AI Services
OPENAI_API_KEY=sk-...                       # OpenAI API key

# Database
NEXT_PUBLIC_SUPABASE_URL=https://...        # Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...           # Supabase key

# Authentication
NEXTAUTH_SECRET=...                         # NextAuth secret
```

**See `.env.example` for complete list of available variables.**

**Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Never put API keys in `NEXT_PUBLIC_*` variables
- `.env.local` is gitignored automatically

---

## 📝 How to Restore Normal AI Parsing

Currently, the system uses a mock parser that always returns the Travel Insurance journey. To restore normal AI parsing:

1. Open `/utils/aiParser.ts`
2. Replace the current `parseUserStory()` method with actual AI parsing logic
3. Remove or comment out `getTravelInsuranceSchema()` method

Example:
```typescript
// Current (Mock)
static parseUserStory(input: string): FormSchema {
  return this.getTravelInsuranceSchema();
}

// Change to (Normal)
static parseUserStory(input: string): FormSchema {
  const fields = this.extractFields(input);
  const formTitle = this.extractFormTitle(input);
  // ... original parsing logic
}
```

---

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
# Find and kill the process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
PORT=3001 npm run dev
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Type errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** to deploy your application

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy using Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform
- Cloudflare Pages

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for platform-specific instructions.

---

## 📊 Stats

- **Total Fields**: 40+
- **Wizard Steps**: 5
- **API Endpoints**: 9
- **Generated Tests**: 25+
- **Form Templates**: 5
- **Theme Options**: 6
- **Supported Layouts**: Simple, Two-Column, Wizard, Carded, Compact
- **UI Components**: 40+ (shadcn/ui)

---

## 🎯 Use Cases Demonstrated

### Travel Insurance Journey
- Multi-step wizard with progress indicator
- Complex validations (age, duration, passport)
- Dynamic pricing with add-ons
- Payment processing simulation
- Policy issuance workflow
- Repeatable sections (multiple travelers)
- Conditional fields (medical conditions)
- Industry-specific business rules

### Platform Capabilities
- AI parsing (mocked)
- Schema generation
- Form rendering
- Data binding
- Validation rules
- API mocking
- Test generation
- Deployment simulation

---

## 📚 Documentation

### Core Documentation
- **README.md** - This file (overview & quick reference)
- **QUICK_START.md** - Get started in 2 minutes
- **INSTALLATION.md** - Complete installation guide
- **DEPLOYMENT.md** - Deploy to production

### Configuration
- **ENVIRONMENT_VARIABLES.md** - All environment variables explained
- **.env.example** - Template for environment variables

### Reference
- **CHANGELOG.md** - Version history and changes
- **VERSION_SNAPSHOT.md** - Complete current state documentation
- **TRAVEL_INSURANCE_MOCK.md** - Detailed mock scenario guide
- **TROUBLESHOOTING.md** - Common issues and solutions

### Technical
- **MIGRATION_NOTES.md** - Next.js migration details
- **NEXTJS_MIGRATION_SUMMARY.md** - Migration summary
- **guidelines/Guidelines.md** - Development guidelines

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Real backend integration (Supabase)
- [ ] Actual cloud deployment
- [ ] Multiple mock scenarios
- [ ] AI model integration
- [ ] Real-time collaboration
- [ ] Version control for forms
- [ ] Analytics dashboard
- [ ] A/B testing
- [ ] Multi-framework export (Vue, Svelte, Angular)

### Travel Insurance Enhancements
- [ ] Dynamic traveler forms (add/remove)
- [ ] Real-time premium display
- [ ] Plan comparison tool
- [ ] Quote saving/retrieval
- [ ] Multi-currency support
- [ ] Document upload
- [ ] Family plan pricing
- [ ] Senior citizen plans (70+)
- [ ] Group bookings (10+)
- [ ] Real payment gateway integration

---

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icon library
- [React Hook Form](https://react-hook-form.com/) - Form management
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- And many other amazing open-source libraries

---

## 📝 License

This project demonstrates the AI 360 platform capabilities with a comprehensive travel insurance mock scenario.

---

## 📞 Support

For questions or issues:
1. Check this README for setup instructions
2. Review `TRAVEL_INSURANCE_MOCK.md` for mock scenario details
3. See `CHANGELOG.md` for recent changes
4. Check `VERSION_SNAPSHOT.md` for complete system state
5. Inspect code in `/utils/aiParser.ts` for parser logic

---

**Version**: 1.0.3  
**Last Updated**: November 4, 2025  
**Mock Scenario**: Travel Insurance Quote & Buy Journey  
**Framework**: Next.js 15 + React 18 + TypeScript 5.7  
**Status**: Active and fully functional ✅
