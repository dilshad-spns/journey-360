#!/usr/bin/env node

/**
 * Setup Verification Script for Journey 360
 * Checks that all required files and configurations are in place
 */

const fs = require('fs');
const path = require('path');

const checks = [];
let allPassed = true;

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  checks.push({
    description,
    status: exists ? '✅' : '❌',
    passed: exists,
  });
  if (!exists) allPassed = false;
  return exists;
}

function checkFileContains(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const contains = content.includes(searchString);
    checks.push({
      description,
      status: contains ? '✅' : '❌',
      passed: contains,
    });
    if (!contains) allPassed = false;
    return contains;
  } catch (error) {
    checks.push({
      description,
      status: '❌',
      passed: false,
    });
    allPassed = false;
    return false;
  }
}

console.log('🔍 Journey 360 - Setup Verification\n');
console.log('Checking your local setup...\n');

// Check critical files
checkFile('package.json', 'package.json exists');
checkFile('postcss.config.js', 'postcss.config.js exists');
checkFile('next.config.js', 'next.config.js exists');
checkFile('app/layout.tsx', 'app/layout.tsx exists');
checkFile('app/page.tsx', 'app/page.tsx exists');
checkFile('styles/globals.css', 'styles/globals.css exists');

// Check package.json for required dependencies
checkFileContains('package.json', '@tailwindcss/postcss', '@tailwindcss/postcss in dependencies');
checkFileContains('package.json', 'tailwindcss', 'tailwindcss in dependencies');
checkFileContains('package.json', 'next', 'Next.js in dependencies');

// Check PostCSS config
checkFileContains('postcss.config.js', '@tailwindcss/postcss', 'PostCSS configured for Tailwind v4');

// Check CSS import in layout
checkFileContains('app/layout.tsx', 'globals.css', 'globals.css imported in layout');

// Check globals.css for critical content
checkFileContains('styles/globals.css', '@import "tailwindcss"', 'Tailwind imported in globals.css');
checkFileContains('styles/globals.css', '--background:', 'CSS variables defined');
checkFileContains('styles/globals.css', '@theme inline', 'Tailwind theme configuration present');

// Print results
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
checks.forEach(check => {
  console.log(`${check.status} ${check.description}`);
});
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (allPassed) {
  console.log('✨ All checks passed! Your setup looks good.\n');
  console.log('Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run dev');
  console.log('3. Open: http://localhost:3000\n');
} else {
  console.log('⚠️  Some checks failed. Please review the issues above.\n');
  console.log('Troubleshooting:');
  console.log('1. Make sure all files are present');
  console.log('2. Run: npm install');
  console.log('3. Delete .next folder if it exists');
  console.log('4. Try running: npm run dev\n');
  console.log('See SETUP_INSTRUCTIONS_LOCAL.md for detailed help.\n');
  process.exit(1);
}
