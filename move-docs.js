const fs = require('fs');
const path = require('path');

console.log('📚 Moving markdown files to /docs folder...\n');

// Create docs directory if it doesn't exist
const docsDir = path.join(process.cwd(), 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
  console.log('✅ Created /docs directory\n');
}

// Get all files in root directory
const rootFiles = fs.readdirSync(process.cwd());

// Filter for markdown files (excluding README.md)
const markdownFiles = rootFiles.filter(file => 
  file.endsWith('.md') && file !== 'README.md'
);

console.log(`Found ${markdownFiles.length} markdown files to move:\n`);

let moved = 0;
let failed = 0;

// Move each markdown file to docs folder
markdownFiles.forEach(file => {
  const sourcePath = path.join(process.cwd(), file);
  const destPath = path.join(docsDir, file);
  
  try {
    // Read file content
    const content = fs.readFileSync(sourcePath, 'utf8');
    
    // Write to docs folder
    fs.writeFileSync(destPath, content, 'utf8');
    
    // Delete original file
    fs.unlinkSync(sourcePath);
    
    console.log(`  ✅ ${file}`);
    moved++;
  } catch (error) {
    console.error(`  ❌ Failed to move ${file}: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\n📋 Summary:`);
console.log(`   • Moved: ${moved} files`);
console.log(`   • Failed: ${failed} files`);
console.log(`   • Location: /docs/`);
console.log(`\n✨ Complete!\n`);
