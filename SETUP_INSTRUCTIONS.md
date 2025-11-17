# Journey 360 - Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.17 or higher (recommended: 20.x LTS)
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control

## Installation Steps

### 1. Clone or Navigate to Project Directory

If you haven't already, navigate to the project directory:

```bash
cd journey-360
```

### 2. Fix Import Statements (IMPORTANT - First Time Only)

Run the automated fix to remove versioned imports:

```bash
npm run fix-imports
```

This script will automatically fix all import statements across the project. This is a **one-time operation** that must be run before installing dependencies.

### 3. Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

This will install all packages listed in `package.json`, including:
- Next.js 15.x
- React 18.x
- Tailwind CSS 4.x
- shadcn/ui components
- Form libraries (react-hook-form)
- UI libraries (Radix UI components)
- Sonner for toast notifications

### 4. Start Development Server

Once installation is complete, start the development server:

```bash
npm run dev
```

The application will be available at:
```
http://localhost:3000
```

### 4. Build for Production

To create an optimized production build:

```bash
npm run build
```

### 5. Start Production Server

After building, you can start the production server:

```bash
npm start
```

## Common Issues and Solutions

### Issue: Import errors with sonner or react-hook-form

**Problem**: You see errors like `Cannot find module 'sonner@2.0.3'`

**Solution**: This has been fixed. The imports now use standard syntax without version numbers:
- `import { toast } from 'sonner';` ✅
- `import { useForm } from 'react-hook-form';` ✅

If you still see these errors, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Module not found errors

**Problem**: You see `Module not found` errors during development

**Solution**: 
1. Clear Next.js cache:
```bash
rm -rf .next
```

2. Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. Restart the development server:
```bash
npm run dev
```

### Issue: TypeScript errors

**Problem**: TypeScript compilation errors

**Solution**:
1. Ensure you're using the correct TypeScript version (5.7.x):
```bash
npm list typescript
```

2. If needed, reinstall TypeScript:
```bash
npm install --save-dev typescript@5.7.2
```

### Issue: Tailwind CSS not loading

**Problem**: Styles not appearing correctly

**Solution**:
1. Verify `styles/globals.css` is imported in `app/layout.tsx`
2. Check that Tailwind CSS 4.0 is installed
3. Clear the browser cache and restart the dev server

### Issue: Dark mode not working

**Problem**: Dark mode toggle doesn't work

**Solution**:
1. Check browser localStorage is enabled
2. Verify the `.dark` class is being added to `<html>` element
3. Check your browser console for any JavaScript errors

## Verification Checklist

After setup, verify the following:

- [ ] Development server starts without errors
- [ ] Landing page loads at `http://localhost:3000`
- [ ] No console errors in browser developer tools
- [ ] Typography renders correctly (Inter font)
- [ ] CSS variables are applied (check with browser DevTools)
- [ ] Dark mode toggle works
- [ ] You can navigate between screens

## Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main application entry point
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── styles/               # Global styles and CSS
│   └── globals.css       # Design system variables
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── package.json          # Dependencies
├── next.config.js        # Next.js configuration
└── tsconfig.json         # TypeScript configuration
```

## Development Tips

1. **Hot Reload**: The development server supports hot module replacement. Changes to files will automatically refresh the browser.

2. **Design System**: All components use CSS variables from `styles/globals.css`. To customize:
   - Colors: Modify color variables in `:root` selector
   - Typography: Update font size variables
   - Spacing: Adjust spacing values
   - Border radius: Change `--radius-*` variables

3. **Adding New Components**: 
   - Place in `/components` directory
   - Import in your pages as needed
   - Follow existing naming conventions

4. **TypeScript**: The project uses strict TypeScript. Ensure all types are properly defined.

## Environment Variables

Currently, this project doesn't require environment variables for local development. All features work out of the box.

For production deployment, you may need to configure:
- API endpoints
- Authentication keys
- Analytics IDs

Create a `.env.local` file if needed (see `.env.example` if provided).

## Getting Help

If you encounter issues not covered here:

1. Check the browser console for specific error messages
2. Review the Next.js documentation: https://nextjs.org/docs
3. Check the project's GitHub issues (if applicable)
4. Verify all prerequisites are met

## Next Steps

Once setup is complete:

1. Explore the landing page
2. Try different input modes (Text, Speech, Upload)
3. Generate a form from requirements
4. Test the form editor features
5. Run unit tests
6. Export deployment packages

Enjoy building with Journey 360! 🚀
