#!/bin/bash

echo "🚀 Journey 360 - Complete Setup"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  npm install had issues, but continuing...${NC}"
fi
echo ""

# Step 2: Prepare build (fix imports)
echo -e "${BLUE}🔧 Step 2: Fixing versioned imports...${NC}"
npm run prepare-build
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  prepare-build had issues, but continuing...${NC}"
fi
echo ""

# Step 3: Ask about docs reorganization
echo -e "${BLUE}📚 Step 3: Organize documentation?${NC}"
read -p "Move all docs to /docs folder? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run reorganize-docs
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Documentation organized in /docs${NC}"
    fi
else
    echo "Skipped documentation reorganization"
fi
echo ""

# Step 4: Environment setup
echo -e "${BLUE}🔐 Step 4: Environment setup${NC}"
if [ ! -f .env.local ]; then
    read -p "Create .env.local from template? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env.local
        echo -e "${GREEN}✅ Created .env.local (edit with your values)${NC}"
    fi
else
    echo ".env.local already exists"
fi
echo ""

# Summary
echo "========================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start development server:"
echo "     ${BLUE}npm run dev${NC}"
echo ""
echo "  2. Build for production:"
echo "     ${BLUE}npm run build${NC}"
echo ""
echo "  3. Configure environment (optional):"
echo "     ${BLUE}Edit .env.local${NC}"
echo ""
echo "Visit: ${BLUE}http://localhost:3000${NC}"
echo "========================================"
