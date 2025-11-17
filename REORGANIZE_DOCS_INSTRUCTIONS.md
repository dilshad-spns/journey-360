# Documentation Reorganization Instructions

## Overview

This will move all markdown files (except README.md) from the root directory to the `/docs` folder for better organization.

## Steps

### 1. Run the Reorganization Script

```bash
npm run reorganize-docs
```

This will:
- Create `/docs` folder if it doesn't exist
- Move all `.md` files except `README.md` to `/docs`
- Delete the original files from root
- Show a summary of the operation

### 2. Verify the Results

```bash
# Check docs folder was created
ls -la docs/

# Verify README.md is still in root
ls -la README.md

# Check no other .md files in root (except this one)
ls -la *.md
```

### 3. Clean Up

After verifying everything works:

```bash
# Delete the reorganization scripts and this file
rm reorganize-docs.js
rm move-docs.js
rm REORGANIZE_DOCS_INSTRUCTIONS.md
```

### 4. Update Any Custom Links

If you have any custom scripts or tools that reference the old paths, update them to use `docs/` prefix.

## What Gets Moved

All markdown files in the root directory except:
- `README.md` (stays in root)
- This file (delete after use)

## After Reorganization

Your structure will be:
```
/
├── README.md                  # Main readme (stays here)
├── docs/                      # All documentation
│   ├── README.md             # Docs index
│   ├── INSTALLATION.md
│   ├── QUICK_START_GUIDE.md
│   ├── ENVIRONMENT_VARIABLES.md
│   ├── BUILD_CHECKLIST.md
│   ├── TROUBLESHOOTING.md
│   └── ... (40+ other docs)
├── app/                       # Application code
├── components/
└── ... (other code files)
```

## Benefits

- ✅ Cleaner root directory
- ✅ Better organization
- ✅ Easier to find documentation
- ✅ README.md still in root (GitHub default)
- ✅ All docs in one place

## Rollback

If something goes wrong, the script creates copies in `/docs` before deleting from root. You can manually restore from there if needed.

## Questions?

Check the main README or the docs folder index for navigation.
