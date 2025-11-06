const fs = require('fs');
const path = require('path');

console.log('📚 Journey 360 - Documentation Reorganization\n');
console.log('=' .repeat(60));

// Create docs directory
const docsDir = path.join(process.cwd(), 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
  console.log('✅ Created /docs directory\n');
}

// List of all markdown files to move (excluding README.md)
const markdownFiles = [
  'Attributions.md',
  'BUILD_CHECKLIST.md',
  'BUILD_PREPARATION_SUMMARY.md',
  'CHANGELOG.md',
  'COMMANDS.md',
  'CONFIGURATOR_BEFORE_AFTER.md',
  'DEPLOYMENT.md',
  'ENVIRONMENT_VARIABLES.md',
  'ENV_FILES_GUIDE.md',
  'FIXES_APPLIED.md',
  'FORM_CONFIGURATOR_CHANGES.md',
  'GETTING_STARTED.md',
  'INSTALLATION.md',
  'INSTALLATION_FIX_SUMMARY.md',
  'LOCAL_DEV_CHECKLIST.md',
  'LOCAL_RUN_GUIDE.md',
  'MICROPHONE_PERMISSION_GUIDE.md',
  'MIGRATION_NOTES.md',
  'MOCK_API_SUMMARY.md',
  'MOCK_SCENARIO_SUMMARY.md',
  'NEXTJS_MIGRATION_SUMMARY.md',
  'PERMISSION_ERROR_FIX_SUMMARY.md',
  'PROJECT_OVERVIEW.md',
  'PROMPT_FLOW_DEBUG.md',
  'QUICK_FIX_GUIDE.md',
  'QUICK_REFERENCE_CONFIGURATOR.md',
  'QUICK_START.md',
  'QUICK_START_GUIDE.md',
  'README_LOCAL_SETUP.md',
  'ROUTING_GUIDE.md',
  'ROUTING_UPDATE_SUMMARY.md',
  'SETUP_COMPLETE.md',
  'SETUP_INSTRUCTIONS.md',
  'SETUP_INSTRUCTIONS_LOCAL.md',
  'SPEECH_PERMISSION_FIX.md',
  'SPEECH_UI_REDESIGN.md',
  'SPEECH_UPLOAD_FEATURES.md',
  'START_HERE.md',
  'START_HERE_NOW.md',
  'STEPPER_IMPLEMENTATION_SUMMARY.md',
  'STEPPER_TYPES_GUIDE.md',
  'STEPPER_VISUAL_REFERENCE.md',
  'STYLES_FIX_SUMMARY.md',
  'TRAVEL_INSURANCE_MOCK.md',
  'TROUBLESHOOTING.md',
  'VERSION_SNAPSHOT.md',
];

let moved = 0;
let skipped = 0;
let failed = 0;

console.log(`Processing ${markdownFiles.length} markdown files...\n`);

markdownFiles.forEach(file => {
  const sourcePath = path.join(process.cwd(), file);
  const destPath = path.join(docsDir, file);
  
  try {
    if (!fs.existsSync(sourcePath)) {
      console.log(`  ⏭️  ${file} (not found, skipping)`);
      skipped++;
      return;
    }
    
    // Read file content
    const content = fs.readFileSync(sourcePath, 'utf8');
    
    // Write to docs folder
    fs.writeFileSync(destPath, content, 'utf8');
    
    // Delete original
    fs.unlinkSync(sourcePath);
    
    console.log(`  ✅ ${file}`);
    moved++;
  } catch (error) {
    console.error(`  ❌ ${file}: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '=' .repeat(60));
console.log('\n📋 Summary:');
console.log(`   • Moved: ${moved} files`);
console.log(`   • Skipped: ${skipped} files (not found)`);
console.log(`   • Failed: ${failed} files`);
console.log(`   • Location: /docs/`);
console.log(`   • Kept in root: README.md`);

console.log('\n✨ Documentation reorganized successfully!\n');
console.log('📝 Next steps:');
console.log('   1. Update README.md to link to docs/ folder');
console.log('   2. Update any internal doc links');
console.log('   3. Commit changes\n');
