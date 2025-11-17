# Command Reference

Quick reference for all available commands.

## Installation

```bash
# Install dependencies
npm install

# Fix versioned imports (required before first build)
npm run prepare-build
```

## Development

```bash
# Start development server (http://localhost:3000)
npm run dev

# Start on different port
PORT=3001 npm run dev
```

## Building

```bash
# Build for production (runs prepare-build automatically)
npm run build

# Start production server
npm start
```

## Code Quality

```bash
# Run ESLint
npm run lint

# Type check without building
npx tsc --noEmit
```

## Utilities

```bash
# Fix all versioned imports
npm run prepare-build

# Legacy import fixer
npm run fix-imports

# Check project setup
npm run check-setup
```

## Maintenance

```bash
# Clear Next.js cache
rm -rf .next

# Clear all and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run prepare-build

# Update dependencies (careful!)
npm update
```

## Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local  # or use your editor
```

## Git

```bash
# Check ignored files
git status --ignored

# Ensure env files are not tracked
git ls-files | grep .env
# (should return nothing)
```

## Testing Build Process

```bash
# Complete build test
npm run prepare-build && npm run build && npm start
```

## Troubleshooting

```bash
# Fix import errors
npm run prepare-build

# Reinstall everything
rm -rf node_modules package-lock.json
npm install

# Check for type errors
npx tsc --noEmit

# Verbose build output
npm run build -- --verbose
```

## Quick Fixes

```bash
# Build failing with import errors
npm run prepare-build && npm run build

# TypeScript errors
npx tsc --noEmit

# Port in use
lsof -ti:3000 | xargs kill  # macOS/Linux
# or
netstat -ano | findstr :3000  # Windows
```

---

**Most Common Workflow**:
```bash
npm install
npm run prepare-build
npm run dev
```
