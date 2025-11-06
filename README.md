# Journey 360 – Auto-Build Deployable Journeys

AI-powered system that transforms user stories and speech input into complete, production-ready forms with UI, data bindings, mock APIs, validations, and unit tests.

> **First Time Setup?** Run `npm run reorganize-docs` to organize all documentation into the `/docs` folder for better structure.

## Quick Links

- **[Try Live Demo Forms](http://localhost:3000)** - Explore embeddable journeys
- **[Integration Demo](http://localhost:3000/demo-integration)** - Live preview with data monitoring
- **[Code Examples](http://localhost:3000/embed)** - Copy-paste integration code

## Overview

Journey 360 is an 8-layer AI form generation system built with React, TypeScript, Next.js, and Tailwind CSS v4.0. It automatically generates multi-step forms with complete business logic from natural language input.

### Key Features

- **Multiple Input Methods**: Text, speech recognition, or file upload
- **AI-Powered Generation**: Converts natural language to form schemas
- **Design System Integration**: Uses CSS variables for complete customization
- **8 Integrated Layers**: Input → Schema → UI → Bindings → Validation → API → Tests → Deployment
- **Production-Ready**: Generates deployable forms with validations and tests
- **Dark Mode**: Full theme support with persistence
- **Accessible**: WCAG-compliant components
- **Responsive**: Mobile-first design

### Mock Scenarios Included

1. **Travel Insurance Journey** (4 steps)
   - Trip details, traveler info, coverage selection, payment
2. **Death Claim Journey** (4 steps)
   - Universal Life Product for North America Agent Portal

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 18, TypeScript 5
- **Styling**: Tailwind CSS v4.0, CSS Variables
- **Components**: shadcn/ui, Radix UI
- **Forms**: React Hook Form 7.55
- **Icons**: Lucide React
- **Notifications**: Sonner

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Edge, Safari, Firefox)

### Installation

**Option 1: Automated Setup (Recommended)**

```bash
# macOS/Linux
chmod +x setup.sh
./setup.sh

# Windows
setup.bat
```

**Option 2: Manual Setup**

```bash
# Clone the repository
git clone <repository-url>
cd journey-360

# Install dependencies
npm install

# Prepare build (fixes imports)
npm run prepare-build

# Organize docs (optional but recommended)
npm run reorganize-docs

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
# AI Service Configuration (Future Integration)
NEXT_PUBLIC_AI_SERVICE_URL=https://api.your-ai-service.com
NEXT_PUBLIC_AI_SERVICE_API_KEY=your_api_key_here

# AI Model Settings
NEXT_PUBLIC_AI_MODEL=gpt-4
NEXT_PUBLIC_AI_MAX_TOKENS=2000
NEXT_PUBLIC_AI_TEMPERATURE=0.7

# Optional: Enable AI features
NEXT_PUBLIC_ENABLE_AI_PARSER=false
```

See [ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md) for details.

## Design System

The project uses CSS variables defined in `/styles/globals.css` for complete design system control:

- **Colors**: `--color-primary`, `--color-accent`, etc.
- **Spacing**: `--spacing-xs` to `--spacing-2xl`
- **Borders**: `--border-width`, `--border-color`
- **Radius**: `--radius-button`, `--radius-card`, `--radius-input`, `--radius-pill`
- **Typography**: Inter font family with defined weights and sizes

### Customization

Update design tokens in `/styles/globals.css`:

```css
:root {
  --color-primary: 33 150 243;
  --radius-button: 8px;
  --font-family: "Inter", sans-serif;
}
```

All components automatically use these variables.

## Project Structure

```
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── figma/             # Figma import components
├── imports/               # Figma design imports
├── utils/                 # Utilities (AI parser, mock API, tests)
├── types/                 # TypeScript type definitions
└── styles/                # Global styles and CSS variables
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run prepare-build    # Fix imports before build
```

## Features

### Input Layer

- Rich text editor with formatting
- Speech-to-text with microphone permission handling
- File upload (PDF, DOCX, TXT)
- Grammar correction and AI suggestions

### Schema Generation

- Automatic field detection from natural language
- Validation rule generation
- Multi-step wizard configuration
- Conditional logic support

### Form Rendering

- 4 stepper types: Dots, Numbers, Progress, Breadcrumb
- 3 layout templates: Simple, Two-Column, Carded
- 3 spacing options: Compact, Comfortable, Spacious
- 3 border radius styles: Sharp, Rounded, Pill
- Responsive and accessible

### Embeddable Forms

- **Travel Insurance Journey**: `/embed/travel` - 4-step travel insurance form
- **Death Claim Journey**: `/embed/motor` - 4-step claim submission form
- **Integration Demo**: `/demo-integration` - Live preview with data monitoring
- **Code Examples**: `/embed` - Copy-paste integration code
- iframe and React component integration support
- Real-time postMessage communication
- See [Embed Integration Guide](./docs/EMBED_INTEGRATION.md)

### Mock API

- Auto-generated endpoints
- Configurable response delays
- Status code simulation

### Testing

- Auto-generated unit tests
- Validation tests
- Integration tests

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Note**: Speech recognition requires HTTPS (or localhost for development).

## Troubleshooting

### Build Fails with Import Errors

```bash
npm run prepare-build
npm install
npm run build
```

### TypeScript Errors

```bash
npx tsc --noEmit
```

### Clear Cache

```bash
rm -rf .next node_modules package-lock.json
npm install
```

See [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for more details.

## Documentation

### Getting Started

- [Installation Guide](./docs/INSTALLATION.md) - Complete setup instructions
- [Quick Start Guide](./docs/QUICK_START_GUIDE.md) - Get running in 5 minutes
- [Commands Reference](./docs/COMMANDS.md) - All available commands

### Configuration

- [Environment Variables](./docs/ENVIRONMENT_VARIABLES.md) - AI service setup
- [Design System](./styles/globals.css) - CSS variables and tokens

### Build & Deploy

- [Build Checklist](./docs/BUILD_CHECKLIST.md) - Pre-build verification
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues

### Reference

- [Project Overview](./docs/PROJECT_OVERVIEW.md) - Architecture details
- [Stepper Types Guide](./docs/STEPPER_TYPES_GUIDE.md) - Form stepper options
- [Mock Scenarios](./docs/MOCK_SCENARIO_SUMMARY.md) - Sample forms included

**[View All Documentation →](./docs/)**

## Contributing

This is an internal team project. Contributions follow team guidelines in `/guidelines/Guidelines.md`.

## License

Proprietary - Internal Use Only

---

**Built with care for Journey 360 Team**
