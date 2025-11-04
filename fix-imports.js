const fs = require('fs');
const path = require('path');

console.log('🔧 Journey 360 - Fixing Versioned Imports\n');
console.log('=' .repeat(50));

// List of all versioned imports to fix
const importReplacements = [
  // Radix UI - All packages
  { from: /"@radix-ui\/react-accordion@[\d.]+"/g, to: '"@radix-ui/react-accordion"' },
  { from: /"@radix-ui\/react-alert-dialog@[\d.]+"/g, to: '"@radix-ui/react-alert-dialog"' },
  { from: /"@radix-ui\/react-aspect-ratio@[\d.]+"/g, to: '"@radix-ui/react-aspect-ratio"' },
  { from: /"@radix-ui\/react-avatar@[\d.]+"/g, to: '"@radix-ui/react-avatar"' },
  { from: /"@radix-ui\/react-checkbox@[\d.]+"/g, to: '"@radix-ui/react-checkbox"' },
  { from: /"@radix-ui\/react-collapsible@[\d.]+"/g, to: '"@radix-ui/react-collapsible"' },
  { from: /"@radix-ui\/react-context-menu@[\d.]+"/g, to: '"@radix-ui/react-context-menu"' },
  { from: /"@radix-ui\/react-dialog@[\d.]+"/g, to: '"@radix-ui/react-dialog"' },
  { from: /"@radix-ui\/react-dropdown-menu@[\d.]+"/g, to: '"@radix-ui/react-dropdown-menu"' },
  { from: /"@radix-ui\/react-hover-card@[\d.]+"/g, to: '"@radix-ui/react-hover-card"' },
  { from: /"@radix-ui\/react-label@[\d.]+"/g, to: '"@radix-ui/react-label"' },
  { from: /"@radix-ui\/react-menubar@[\d.]+"/g, to: '"@radix-ui/react-menubar"' },
  { from: /"@radix-ui\/react-navigation-menu@[\d.]+"/g, to: '"@radix-ui/react-navigation-menu"' },
  { from: /"@radix-ui\/react-popover@[\d.]+"/g, to: '"@radix-ui/react-popover"' },
  { from: /"@radix-ui\/react-progress@[\d.]+"/g, to: '"@radix-ui/react-progress"' },
  { from: /"@radix-ui\/react-radio-group@[\d.]+"/g, to: '"@radix-ui/react-radio-group"' },
  { from: /"@radix-ui\/react-scroll-area@[\d.]+"/g, to: '"@radix-ui/react-scroll-area"' },
  { from: /"@radix-ui\/react-select@[\d.]+"/g, to: '"@radix-ui/react-select"' },
  { from: /"@radix-ui\/react-separator@[\d.]+"/g, to: '"@radix-ui/react-separator"' },
  { from: /"@radix-ui\/react-slider@[\d.]+"/g, to: '"@radix-ui/react-slider"' },
  { from: /"@radix-ui\/react-slot@[\d.]+"/g, to: '"@radix-ui/react-slot"' },
  { from: /"@radix-ui\/react-switch@[\d.]+"/g, to: '"@radix-ui/react-switch"' },
  { from: /"@radix-ui\/react-tabs@[\d.]+"/g, to: '"@radix-ui/react-tabs"' },
  { from: /"@radix-ui\/react-toggle@[\d.]+"/g, to: '"@radix-ui/react-toggle"' },
  { from: /"@radix-ui\/react-toggle-group@[\d.]+"/g, to: '"@radix-ui/react-toggle-group"' },
  { from: /"@radix-ui\/react-tooltip@[\d.]+"/g, to: '"@radix-ui/react-tooltip"' },
  
  // Other popular libraries
  { from: /"lucide-react@[\d.]+"/g, to: '"lucide-react"' },
  { from: /"class-variance-authority@[\d.]+"/g, to: '"class-variance-authority"' },
  { from: /"react-day-picker@[\d.]+"/g, to: '"react-day-picker"' },
  { from: /"embla-carousel-react@[\d.]+"/g, to: '"embla-carousel-react"' },
  { from: /"recharts@[\d.]+"/g, to: '"recharts"' },
  { from: /"cmdk@[\d.]+"/g, to: '"cmdk"' },
  { from: /"vaul@[\d.]+"/g, to: '"vaul"' },
  { from: /"input-otp@[\d.]+"/g, to: '"input-otp"' },
  { from: /"react-resizable-panels@[\d.]+"/g, to: '"react-resizable-panels"' },
  { from: /"next-themes@[\d.]+"/g, to: '"next-themes"' },
  { from: /"sonner@[\d.]+"/g, to: '"sonner"' },
  { from: /"react-hook-form@[\d.]+"/g, to: '"react-hook-form"' },
];

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
      console.log(`✅ ${shortPath} (${changeCount} changes)`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
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
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next') {
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

// Process all relevant directories
const directories = ['./components', './app', './utils', './types'];
let totalFixed = 0;

console.log('\nScanning directories for versioned imports...\n');

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    const count = walkDirectory(dir);
    if (count > 0) {
      totalFixed += count;
    }
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✨ Complete! Fixed imports in ${totalFixed} files.\n`);

if (totalFixed > 0) {
  console.log('📝 Next steps:');
  console.log('   1. Run: npm install');
  console.log('   2. Run: npm run dev');
  console.log('   3. Check browser console for any errors\n');
} else {
  console.log('✅ No versioned imports found. Project is ready!\n');
  console.log('Run: npm run dev\n');
}
