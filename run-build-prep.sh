#!/bin/bash

echo "🚀 Journey 360 - Complete Build Preparation"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Run prepare-build script
echo "📦 Step 1: Fixing versioned imports..."
echo ""
node prepare-build.js

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ prepare-build.js failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Import fixes complete${NC}"
echo ""

# Step 2: Install dependencies
echo "📥 Step 2: Installing dependencies..."
echo ""
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Run linting
echo "🔍 Step 3: Running ESLint..."
echo ""
npm run lint

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Linting found issues (non-critical)${NC}"
else
    echo -e "${GREEN}✅ Linting passed${NC}"
fi

echo ""

# Step 4: Type check
echo "📝 Step 4: Type checking..."
echo ""
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Type errors found (may be non-critical)${NC}"
else
    echo -e "${GREEN}✅ Type check passed${NC}"
fi

echo ""

# Step 5: Test build
echo "🏗️  Step 5: Testing production build..."
echo ""
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed - check errors above${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Summary
echo "=========================================="
echo "🎉 Build Preparation Complete!"
echo ""
echo "Next steps:"
echo "  1. Test the build: npm start"
echo "  2. Visit: http://localhost:3000"
echo "  3. Verify all features work correctly"
echo ""
echo "To start production server:"
echo "  npm start"
echo ""
echo "=========================================="
