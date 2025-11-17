# Troubleshooting Guide

Common issues and solutions for AI 360 - Auto-Build Deployable Journeys.

---

## Installation Issues

### Issue: npm install fails with EACCES error

**Error:**
```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/local/lib/node_modules
npm ERR! errno -13
```

**Cause:** Permission issues with npm global directory

**Solution:**
```bash
# Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile

# Then retry installation
npm install
```

**Alternative:** Use nvm to manage Node.js:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js via nvm
nvm install 18
nvm use 18
```

---

### Issue: Package installation is very slow

**Symptoms:**
- Installation takes > 10 minutes
- Timeouts during package downloads

**Solutions:**

**1. Clear npm cache:**
```bash
npm cache clean --force
npm install
```

**2. Use a different registry:**
```bash
# Try npm registry mirror
npm config set registry https://registry.npmjs.org/
npm install
```

**3. Use yarn or pnpm instead:**
```bash
# Using yarn
npm install -g yarn
yarn install

# Using pnpm
npm install -g pnpm
pnpm install
```

**4. Check your internet connection:**
```bash
# Test npm registry connectivity
npm ping
```

---

### Issue: peer dependency warnings

**Warning:**
```
npm WARN ERESOLVE overriding peer dependency
```

**Cause:** Dependency version conflicts (usually harmless)

**Solution:**
- These warnings are usually safe to ignore
- If builds fail, try:
  ```bash
  npm install --legacy-peer-deps
  ```

---

## Development Server Issues

### Issue: Port 3000 already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution 1 - Use different port:**
```bash
PORT=3001 npm run dev
```

**Solution 2 - Kill process on port 3000:**

**macOS/Linux:**
```bash
# Find process
lsof -i :3000

# Kill process
lsof -ti:3000 | xargs kill -9
```

**Windows (PowerShell):**
```powershell
# Find process
Get-NetTCPConnection -LocalPort 3000

# Kill process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

**Windows (Command Prompt):**
```cmd
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

### Issue: Server won't start or crashes immediately

**Symptoms:**
- `npm run dev` exits immediately
- Error messages about missing modules

**Solution 1 - Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Solution 2 - Check Node version:**
```bash
node --version
# Should be 18.0.0 or higher

# Update if needed
nvm install 18
nvm use 18
```

**Solution 3 - Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

---

### Issue: Hot reload not working

**Symptoms:**
- Changes to code don't reflect in browser
- Need to manually refresh

**Solutions:**

**1. Check file system watcher limits (Linux):**
```bash
# Increase watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**2. Restart dev server:**
```bash
# Stop server (Ctrl+C)
# Clear cache
rm -rf .next
# Restart
npm run dev
```

**3. Check for symlinks:**
- Hot reload may not work with symlinked directories
- Copy files instead of symlinking

---

## Build Issues

### Issue: Build fails with type errors

**Error:**
```
Type error: Cannot find module './components/Component' or its corresponding type declarations.
```

**Solution 1 - Check import paths:**
```typescript
// ❌ Wrong
import { Button } from '@/components/ui/button';

// ✅ Correct
import { Button } from '../components/ui/button';
```

**Solution 2 - Restart TypeScript server (VS Code):**
1. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows)
2. Type: "TypeScript: Restart TS Server"
3. Select and run

**Solution 3 - Clear TypeScript cache:**
```bash
rm -rf .next
rm tsconfig.tsbuildinfo
npm run build
```

---

### Issue: Out of memory during build

**Error:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution - Increase Node memory:**
```bash
# Temporary (for one build)
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Permanent (add to package.json)
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
}
```

---

### Issue: Module not found errors

**Error:**
```
Module not found: Can't resolve 'react'
```

**Solution:**
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install

# If still failing, check package.json for correct dependencies
```

---

## Runtime Issues

### Issue: Dark mode not persisting

**Symptoms:**
- Dark mode resets on page refresh
- localStorage errors in console

**Solution:**

Check browser settings:
- Ensure cookies/localStorage are enabled
- Check for browser extensions blocking localStorage
- Try incognito/private mode

Clear browser storage:
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Clear all items
4. Refresh page

---

### Issue: Speech recognition not working

**Symptoms:**
- Microphone button doesn't work
- Permission errors

**Solutions:**

**1. Check HTTPS:**
- Speech API requires HTTPS (except localhost)
- Use `https://localhost:3000` in production

**2. Check browser support:**
```javascript
if (!('webkitSpeechRecognition' in window)) {
  console.log('Speech recognition not supported');
}
```

**3. Grant microphone permission:**
- Click microphone icon in browser address bar
- Allow microphone access
- Refresh page

**4. Supported browsers:**
- ✅ Chrome/Edge (best support)
- ✅ Safari (partial support)
- ❌ Firefox (limited support)

---

### Issue: Forms not submitting

**Symptoms:**
- Submit button doesn't work
- No validation errors shown

**Solution:**

Check console for errors:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors

Common causes:
- Required fields not filled
- Validation errors
- JavaScript errors in form handler

---

### Issue: Styles not loading

**Symptoms:**
- Page appears unstyled
- Tailwind classes not working

**Solution 1 - Check globals.css import:**
Verify `/app/layout.tsx` imports styles:
```typescript
import '../styles/globals.css';
```

**Solution 2 - Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

**Solution 3 - Rebuild:**
```bash
npm run build
npm start
```

---

### Issue: Images not loading

**Symptoms:**
- Broken image icons
- 404 errors for images

**Solution:**

**1. Check image paths:**
```tsx
// ✅ Correct (public folder)
<img src="/logo.png" alt="Logo" />

// ❌ Wrong
<img src="./logo.png" alt="Logo" />
```

**2. Use Next.js Image component:**
```tsx
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={200} height={200} />
```

**3. Check public folder:**
- Images must be in `/public` directory
- Reference without `/public` prefix

---

## Browser Issues

### Issue: Console errors in browser

**Error:**
```
Warning: Each child in a list should have a unique "key" prop.
```

**Cause:** React list rendering without keys

**Solution:**
```tsx
// ❌ Wrong
{items.map(item => <div>{item.name}</div>)}

// ✅ Correct
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

---

### Issue: Hydration errors

**Error:**
```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

**Cause:** Server-rendered HTML doesn't match client

**Solutions:**

**1. Use client-side only rendering:**
```tsx
'use client';

import { useEffect, useState } from 'react';

function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <div>Client-only content</div>;
}
```

**2. Check for:**
- Date/time rendering (changes between server/client)
- Random values
- Browser-only APIs (localStorage, window)

---

### Issue: localStorage not available

**Error:**
```
ReferenceError: localStorage is not defined
```

**Cause:** Accessing localStorage during server-side rendering

**Solution:**
```tsx
// ❌ Wrong
const value = localStorage.getItem('key');

// ✅ Correct
const value = typeof window !== 'undefined' 
  ? localStorage.getItem('key') 
  : null;
```

---

## Performance Issues

### Issue: Slow page loads

**Solutions:**

**1. Check bundle size:**
```bash
npm install -D @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

# Analyze
ANALYZE=true npm run build
```

**2. Optimize images:**
- Use Next.js Image component
- Compress images
- Use appropriate formats (WebP)

**3. Code splitting:**
- Use dynamic imports
- Lazy load components

**4. Remove unused dependencies:**
```bash
npm install -g depcheck
depcheck
```

---

### Issue: High memory usage

**Solution:**

**1. Limit concurrent processes:**
```bash
# In package.json
"dev": "NODE_OPTIONS='--max-old-space-size=2048' next dev"
```

**2. Close other applications**

**3. Restart development server regularly**

---

## Deployment Issues

### Issue: Build succeeds locally but fails on platform

**Solutions:**

**1. Check Node version:**
- Ensure platform uses Node 18+
- Set in platform settings or package.json:
  ```json
  "engines": {
    "node": ">=18.0.0"
  }
  ```

**2. Check environment variables:**
- Ensure all required vars are set on platform

**3. Review build logs:**
- Check platform's build logs for specific errors

---

### Issue: App works locally but not in production

**Solutions:**

**1. Test production build locally:**
```bash
npm run build
npm start
```

**2. Check environment:**
```bash
NODE_ENV=production npm start
```

**3. Enable debug logs:**
```bash
DEBUG=* npm start
```

---

## IDE Issues

### Issue: TypeScript errors in VS Code

**Solutions:**

**1. Restart TS Server:**
- Cmd/Ctrl + Shift + P
- "TypeScript: Restart TS Server"

**2. Check TypeScript version:**
```bash
# Should use workspace version
npx tsc --version
```

**3. Reload window:**
- Cmd/Ctrl + Shift + P
- "Developer: Reload Window"

---

### Issue: Intellisense not working

**Solutions:**

**1. Install extensions:**
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense

**2. Check settings:**
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## Getting More Help

If your issue isn't listed here:

1. **Check documentation:**
   - README.md
   - INSTALLATION.md
   - DEPLOYMENT.md

2. **Review logs:**
   - Terminal output
   - Browser console (F12)
   - Network tab for API errors

3. **Search issues:**
   - Next.js GitHub issues
   - Stack Overflow
   - Next.js Discord

4. **Platform docs:**
   - [Next.js](https://nextjs.org/docs)
   - [React](https://react.dev/)
   - [Tailwind CSS](https://tailwindcss.com/docs)

5. **Debug mode:**
   ```bash
   NODE_OPTIONS='--inspect' npm run dev
   # Then open chrome://inspect in Chrome
   ```

---

## Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Port in use | `PORT=3001 npm run dev` |
| Build fails | `rm -rf .next && npm run build` |
| Styles broken | `rm -rf .next && npm run dev` |
| Dependencies error | `rm -rf node_modules && npm install` |
| Type errors | Restart TS Server in IDE |
| Memory error | `NODE_OPTIONS='--max-old-space-size=4096' npm run build` |
| Hot reload broken | `rm -rf .next && npm run dev` |

---

**Last Updated**: November 4, 2025  
**Next.js Version**: 15.0.3  
**Status**: Complete ✅
