# Journey 360 - AI Form Builder

> Transform natural language and speech into production-ready forms with AI-powered generation.

## 🚀 Quick Start

```bash
# Clone and navigate
git clone https://github.com/dilshad-spns/journey-360.git
cd journey-360

# Install dependencies
npm install

# Start development server
npm run dev
```

**Open:** http://localhost:3000

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- Modern browser (Chrome, Firefox, Safari, Edge)

## 🎯 Key Features

- **AI Form Generation** - Natural language to form conversion
- **Speech-to-Text** - Voice input with Whisper API
- **Multi-step Forms** - 4 stepper types, 3 layouts
- **Embeddable** - iframe or React component integration
- **Dark Mode** - Full theme support

## 📖 Available Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | http://localhost:3000 | Main form builder |
| Travel Demo | http://localhost:3000/embed/travel | 4-step travel form |
| Claim Demo | http://localhost:3000/embed/motor | 4-step claim form |
| Builder | http://localhost:3000/builder | Visual form editor |
| Diagnostics | http://localhost:3000/diagnostics | Test AI configuration |

## ⚙️ Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Run production server
npm run prepare-build    # Fix import paths
npm run reorganize-docs  # Organize documentation
```

## 🔐 Environment Variables (Optional)

Create `.env.local` to enable AI features:

```env
# Speech-to-Text
NEXT_PUBLIC_WHISPER_API_KEY=your_whisper_key
NEXT_PUBLIC_WHISPER_ENDPOINT=your_whisper_endpoint

# AI Form Generation
AZURE_OPENAI_API_KEY=your_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

**Get API Keys:** [Azure Portal](https://portal.azure.com) → OpenAI Resource → Keys and Endpoint

**Test Configuration:** http://localhost:3000/diagnostics

## 🔧 Troubleshooting

### Common Issues

**Port 3000 in use:**
```bash
$env:PORT=3001; npm run dev
```

**Module not found errors:**
```bash
npm run prepare-build
npm install
```

**Build fails:**
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**AI Features (403 Error):**
1. Visit http://localhost:3000/diagnostics
2. Check deployment name matches Azure Portal exactly (case-sensitive!)
3. Verify "Cognitive Services OpenAI User" role in Azure
4. Restart: `npm run dev`

### Need Help?

- **Documentation:** [/docs](./docs) folder
- **Troubleshooting Guide:** [/docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- **Environment Setup:** [/docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md)

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 18, TypeScript 5
- **Styling:** Tailwind CSS v4.0
- **Forms:** React Hook Form 7.55
- **AI:** Azure OpenAI (Whisper, GPT-4o)

## 📁 Project Structure

```
├── app/                 # Next.js pages
├── components/          # React components
├── utils/              # Utilities & AI services
├── hooks/              # Custom hooks
├── types/              # TypeScript types
├── styles/             # Global styles
└── docs/               # Documentation
```


## 📄 License

Proprietary - Internal Use Only

---

**Built by Journey 360 Team** | [Documentation](./docs) | [Diagnostics](http://localhost:3000/diagnostics)
