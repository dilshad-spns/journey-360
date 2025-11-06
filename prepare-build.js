const fs = require('fs');
const path = require('path');

console.log('🚀 Journey 360 - Production Build Preparation\n');
console.log('=' .repeat(60));

// Comprehensive list of all versioned imports to fix
const importReplacements = [
  // Radix UI - All packages
  { from: /@radix-ui\/react-accordion@[\d.]+/g, to: '@radix-ui/react-accordion' },
  { from: /@radix-ui\/react-alert-dialog@[\d.]+/g, to: '@radix-ui/react-alert-dialog' },
  { from: /@radix-ui\/react-aspect-ratio@[\d.]+/g, to: '@radix-ui/react-aspect-ratio' },
  { from: /@radix-ui\/react-avatar@[\d.]+/g, to: '@radix-ui/react-avatar' },
  { from: /@radix-ui\/react-checkbox@[\d.]+/g, to: '@radix-ui/react-checkbox' },
  { from: /@radix-ui\/react-collapsible@[\d.]+/g, to: '@radix-ui/react-collapsible' },
  { from: /@radix-ui\/react-context-menu@[\d.]+/g, to: '@radix-ui/react-context-menu' },
  { from: /@radix-ui\/react-dialog@[\d.]+/g, to: '@radix-ui/react-dialog' },
  { from: /@radix-ui\/react-dropdown-menu@[\d.]+/g, to: '@radix-ui/react-dropdown-menu' },
  { from: /@radix-ui\/react-hover-card@[\d.]+/g, to: '@radix-ui/react-hover-card' },
  { from: /@radix-ui\/react-label@[\d.]+/g, to: '@radix-ui/react-label' },
  { from: /@radix-ui\/react-menubar@[\d.]+/g, to: '@radix-ui/react-menubar' },
  { from: /@radix-ui\/react-navigation-menu@[\d.]+/g, to: '@radix-ui/react-navigation-menu' },
  { from: /@radix-ui\/react-popover@[\d.]+/g, to: '@radix-ui/react-popover' },
  { from: /@radix-ui\/react-progress@[\d.]+/g, to: '@radix-ui/react-progress' },
  { from: /@radix-ui\/react-radio-group@[\d.]+/g, to: '@radix-ui/react-radio-group' },
  { from: /@radix-ui\/react-scroll-area@[\d.]+/g, to: '@radix-ui/react-scroll-area' },
  { from: /@radix-ui\/react-select@[\d.]+/g, to: '@radix-ui/react-select' },
  { from: /@radix-ui\/react-separator@[\d.]+/g, to: '@radix-ui/react-separator' },
  { from: /@radix-ui\/react-slider@[\d.]+/g, to: '@radix-ui/react-slider' },
  { from: /@radix-ui\/react-slot@[\d.]+/g, to: '@radix-ui/react-slot' },
  { from: /@radix-ui\/react-switch@[\d.]+/g, to: '@radix-ui/react-switch' },
  { from: /@radix-ui\/react-tabs@[\d.]+/g, to: '@radix-ui/react-tabs' },
  { from: /@radix-ui\/react-toggle@[\d.]+/g, to: '@radix-ui/react-toggle' },
  { from: /@radix-ui\/react-toggle-group@[\d.]+/g, to: '@radix-ui/react-toggle-group' },
  { from: /@radix-ui\/react-tooltip@[\d.]+/g, to: '@radix-ui/react-tooltip' },
  
  // Other popular libraries (without quotes to catch all variations)
  { from: /lucide-react@[\d.]+/g, to: 'lucide-react' },
  { from: /class-variance-authority@[\d.]+/g, to: 'class-variance-authority' },
  { from: /react-day-picker@[\d.]+/g, to: 'react-day-picker' },
  { from: /embla-carousel-react@[\d.]+/g, to: 'embla-carousel-react' },
  { from: /recharts@[\d.]+/g, to: 'recharts' },
  { from: /cmdk@[\d.]+/g, to: 'cmdk' },
  { from: /vaul@[\d.]+/g, to: 'vaul' },
  { from: /input-otp@[\d.]+/g, to: 'input-otp' },
  { from: /react-resizable-panels@[\d.]+/g, to: 'react-resizable-panels' },
  { from: /next-themes@[\d.]+/g, to: 'next-themes' },
  { from: /sonner@[\d.]+/g, to: 'sonner' },
  { from: /react-hook-form@[\d.]+/g, to: 'react-hook-form' },
  { from: /tailwind-merge@[\d.]+/g, to: 'tailwind-merge' },
  { from: /tailwindcss-animate@[\d.]+/g, to: 'tailwindcss-animate' },
  { from: /date-fns@[\d.]+/g, to: 'date-fns' },
  { from: /clsx@[\d.]+/g, to: 'clsx' },
];

let totalChanges = 0;
let filesFixed = 0;

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changeCount = 0;
    
    importReplacements.forEach(({ from, to }) => {
      const matches = content.match(from);
      if (matches) {
        content = content.replace(from, to);
        modified = true;
        changeCount += matches.length;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      const shortPath = filePath.replace(process.cwd(), '.');
      console.log(`  ✅ ${shortPath} (${changeCount} changes)`);
      totalChanges += changeCount;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, and .git
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        fixedCount += walkDirectory(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixImportsInFile(filePath)) {
        fixedCount++;
      }
    }
  });
  
  return fixedCount;
}

// Step 1: Fix versioned imports
console.log('\n📦 Step 1: Fixing versioned imports...\n');
const directories = ['./components', './app', './utils', './types'];

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    const count = walkDirectory(dir);
    if (count > 0) {
      filesFixed += count;
    }
  }
});

console.log('\n' + '-'.repeat(60));
console.log(`✨ Fixed ${totalChanges} imports in ${filesFixed} files\n`);

// Step 2: Create .eslintrc.json if it doesn't exist
console.log('📋 Step 2: Configuring ESLint...\n');

const eslintConfig = {
  "extends": "next/core-web-vitals",
  "rules": {
    "@next/next/no-img-element": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
};

const eslintPath = path.join(process.cwd(), '.eslintrc.json');
if (!fs.existsSync(eslintPath)) {
  fs.writeFileSync(eslintPath, JSON.stringify(eslintConfig, null, 2));
  console.log('  ✅ Created .eslintrc.json');
} else {
  console.log('  ℹ️  .eslintrc.json already exists');
}

// Step 3: Check for missing metadata export in layout.tsx
console.log('\n📝 Step 3: Checking Next.js configuration...\n');

const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  let layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  // Check if metadata export exists
  if (!layoutContent.includes('export const metadata')) {
    console.log('  ⚠️  Warning: No metadata export found in app/layout.tsx');
    console.log('  💡 Consider adding metadata for SEO');
  } else {
    console.log('  ✅ Metadata export found');
  }
}

// Step 4: Check for .env.example
console.log('\n📄 Step 4: Checking environment setup...\n');

const envExamplePath = path.join(process.cwd(), '.env.example');
const envLocalPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envExamplePath)) {
  console.log('  ✅ .env.example found');
  
  if (!fs.existsSync(envLocalPath)) {
    console.log('  ℹ️  .env.local not found (optional for development)');
    console.log('  💡 Run: cp .env.example .env.local (if needed)');
  } else {
    console.log('  ✅ .env.local found');
  }
} else {
  console.log('  ℹ️  No .env.example file');
}

// Step 5: Verify design system files
console.log('\n🎨 Step 5: Verifying design system...\n');

const globalsCssPath = path.join(process.cwd(), 'styles', 'globals.css');
if (fs.existsSync(globalsCssPath)) {
  const globalsContent = fs.readFileSync(globalsCssPath, 'utf8');
  
  // Check for design tokens
  const hasColorVars = globalsContent.includes('--color-primary');
  const hasRadiusVars = globalsContent.includes('--radius-button');
  const hasSpacingVars = globalsContent.includes('--spacing-');
  
  if (hasColorVars && hasRadiusVars && hasSpacingVars) {
    console.log('  ✅ Design system CSS variables configured');
  } else {
    console.log('  ⚠️  Some design tokens may be missing');
  }
} else {
  console.log('  ⚠️  globals.css not found');
}

// Summary and next steps
console.log('\n' + '='.repeat(60));
console.log('🎉 Build Preparation Complete!\n');

console.log('📋 Summary:');
console.log(`   • Fixed ${totalChanges} versioned imports`);
console.log(`   • Updated ${filesFixed} files`);
console.log(`   • Configured ESLint`);
console.log(`   • Verified environment setup`);
console.log(`   • Checked design system`);

console.log('\n🚀 Next Steps:\n');
console.log('   1. Install dependencies (if not done):');
console.log('      npm install\n');
console.log('   2. Run linting (optional):');
console.log('      npm run lint\n');
console.log('   3. Test build:');
console.log('      npm run build\n');
console.log('   4. Start production server:');
console.log('      npm start\n');

console.log('💡 Tips:');
console.log('   • Build errors: Check messages above');
console.log('   • Type errors: npx tsc --noEmit');
console.log('   • Import errors: Re-run this script');
console.log('   • Environment: Copy .env.example to .env.local (optional)\n');

console.log('=' .repeat(60) + '\n');
