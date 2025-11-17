# Export Resources Guide

## Overview
This guide ensures all images, icons, loader animations, logos, and other resources are properly included when developers extract code from Journey 360.

---

## Resources Included in Code Export

### 1. **Icons** ✅
All icons are imported from `lucide-react` package and will work automatically when developers install dependencies:

```tsx
import { Eye, Code2, Workflow, Plus, Rocket, User, Settings, LogOut, etc. } from 'lucide-react';
```

**Developer Action Required:**
- Run `npm install` or `yarn install` to get all dependencies including lucide-react

---

### 2. **Logos & SVGs** ✅
All logos are **inline SVGs** embedded directly in the component code:

#### Journey 360 Logo (TopNav)
- Located in: `/components/TopNav.tsx`
- **Fully self-contained** - no external files needed
- Uses inline `<svg>` element with gradients

#### Login Screen Logo
- Located in: `/components/LoginScreen.tsx`
- **Fully self-contained** - inline SVG

#### Imported Figma SVGs
- Located in: `/imports/svg-*.ts` files
- SVG path data stored as TypeScript constants
- Components import and use these paths
- **All included in code export**

**Developer Action Required:**
- ✅ None - all SVGs are in the code

---

### 3. **Loader Animation** ✅
The infinity loader animation is a Lottie JSON animation:

#### Infinity Animation
- Located in: `/utils/infinityAnimation.ts`
- **Fully self-contained** - exported as a JSON object
- Used in loading states throughout the application
- No external Lottie files needed

**Usage Example:**
```tsx
import { infinityAnimation } from '../utils/infinityAnimation';
import Lottie from 'lottie-react';

<Lottie animationData={infinityAnimation} loop={true} />
```

**Developer Action Required:**
- Install lottie-react: `npm install lottie-react`

---

### 4. **Images** ⚠️

#### ImageWithFallback Component
- Located in: `/components/figma/ImageWithFallback.tsx`
- **Protected system file** - automatically included
- Provides fallback SVG for broken images
- Fallback is a **base64-encoded inline SVG**

#### Template Images
Templates use placeholder image URLs from external sources. Developers should replace these with their own images:

```tsx
// Example from FormEditorPage.tsx
const templates = [
  {
    name: 'Travel Insurance',
    image: 'https://images.unsplash.com/photo-...',  // Replace with your image
    ...
  }
];
```

**Developer Action Required:**
- Replace placeholder image URLs with your own hosted images
- Or use the ImageWithFallback component which shows a generic fallback

---

### 5. **Figma Imported Assets** ⚠️

Figma imports may reference assets using `figma:asset` paths:

```tsx
import imgMain from "figma:asset/f7b67f1ac4728491bc35c5eb9063a6275d89f394.png";
```

**These will NOT work outside of Figma Make environment.**

**Developer Action Required:**
1. Download the actual image from Figma
2. Place it in a `/public` folder in your project
3. Update the import to reference the local file:
   ```tsx
   // Before (Figma Make)
   import imgMain from "figma:asset/f7b67f1ac4728491bc35c5eb9063a6275d89f394.png";
   
   // After (Your project)
   <img src="/images/main-image.png" alt="Main" />
   ```

---

## Resource Checklist for Developers

When extracting code from Journey 360, ensure you have:

### ✅ Automatically Included (No Action Needed)
- [x] All component code
- [x] Inline SVG logos (Journey 360 logo, etc.)
- [x] SVG path data files (`/imports/svg-*.ts`)
- [x] Infinity loader animation (`/utils/infinityAnimation.ts`)
- [x] ImageWithFallback component with base64 fallback
- [x] All UI components from `/components/ui/`
- [x] CSS files (`/styles/globals.css`, `/styles/tailwind.css`)

### ⚠️ Requires Developer Action
- [ ] Install npm dependencies: `npm install`
- [ ] Replace template placeholder images with your own
- [ ] If using Figma imports: Download and host images locally
- [ ] Set up environment variables if using APIs
- [ ] Configure build tools (Next.js, etc.)

---

## File Structure After Export

```
your-project/
├── components/
│   ├── ui/                    # ✅ All shadcn components included
│   ├── figma/
│   │   └── ImageWithFallback.tsx  # ✅ Protected, always included
│   ├── TopNav.tsx             # ✅ Journey 360 logo inline SVG
│   ├── LoginScreen.tsx        # ✅ Logo inline SVG
│   └── ...
├── imports/
│   ├── svg-*.ts               # ✅ All SVG path data
│   └── *.tsx                  # ✅ Imported Figma components
├── utils/
│   ├── infinityAnimation.ts   # ✅ Lottie JSON animation
│   └── ...
├── styles/
│   ├── globals.css            # ✅ Design system CSS variables
│   └── tailwind.css           # ✅ Tailwind config
└── public/                    # ⚠️ Create this - add your images here
    └── images/
```

---

## Common Issues & Solutions

### Issue: "Module not found: Can't resolve 'lucide-react'"
**Solution:** Run `npm install` to install dependencies

### Issue: "Module not found: figma:asset"
**Solution:** 
1. Download the image from Figma
2. Place in `/public/images/`
3. Update code to use local path: `/images/yourfile.png`

### Issue: Lottie animation not showing
**Solution:** Install lottie-react: `npm install lottie-react`

### Issue: Broken template images
**Solution:** Replace Unsplash URLs with your own hosted images

---

## Best Practices

1. **Keep SVGs Inline:** All logos and icons are inline - this is intentional for portability
2. **Use ImageWithFallback:** For any user-facing images, use the ImageWithFallback component
3. **Host Your Own Images:** Don't rely on external URLs - host images in your own `/public` folder
4. **Version Lock Dependencies:** The code uses specific versions for some packages (see imports)

---

## Summary

**✅ What's Already Included:**
- All icons (lucide-react)
- All logos (inline SVG)
- Loader animation (inline JSON)
- SVG graphics (inline path data)
- Fallback image (base64 SVG)

**⚠️ What Developers Need to Add:**
- npm install dependencies
- Replace placeholder images
- Download Figma assets if used
- Host images locally

---

*Last Updated: Current session*
*Maintained by: Journey 360 Development Team*
