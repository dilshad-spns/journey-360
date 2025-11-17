# Visual Assets Reference Guide

This document provides a comprehensive reference for all SVGs, loaders, images, and icons used in Journey 360. Developers can use this as a checklist when extracting and implementing the codebase.

---

## 🎨 Icon Library

### Lucide React Icons
All icons are imported from the `lucide-react` package. Install via:
```bash
npm install lucide-react
```

#### Icons Used Throughout the Application:

**Navigation & Actions:**
- `ArrowRight`, `ArrowLeft`, `ChevronRight`, `ChevronDown`, `ChevronUp`
- `X`, `Plus`, `Minus`, `Check`, `CheckCircle2`
- `Upload`, `Download`, `Send`, `Trash2`, `RotateCcw`
- `ExternalLink`, `Link`, `Copy`

**Files & Data:**
- `FileText`, `File`, `FileJson`, `Code`, `Code2`
- `Database`, `Globe`, `Server`

**Communication & Media:**
- `Mic`, `MicOff`, `Paperclip`
- `Eye`, `EyeOff`
- `Image`, `Video`

**Forms & Input:**
- `Calendar`, `CalendarIcon`
- `Search`, `Filter`
- `Edit`, `Edit2`, `Edit3`

**Status & Feedback:**
- `Loader2` (animated spinner)
- `Sparkles` (AI/magic indicator)
- `AlertCircle`, `AlertTriangle`, `Info`
- `CheckCircle2` (success)
- `Shield` (security)

**Business & Features:**
- `Plane` (travel)
- `Car` (motor insurance)
- `Zap` (fast/instant)
- `Clock` (time)
- `Rocket` (deployment)
- `Diamond` (premium)
- `Wand2` (AI generation)
- `PlayCircle` (demo/preview)

**Layout & Organization:**
- `LayoutGrid`, `Layout`, `Layers`
- `Settings`, `Sliders`
- `Menu`, `MoreHorizontal`, `MoreVertical`

**Text Formatting (Rich Text Editor):**
- `Bold`, `Italic`, `Underline`, `Strikethrough`
- `List`, `ListOrdered`
- `AlignLeft`, `AlignCenter`, `AlignRight`
- `Type`, `Heading`

**User & Profile:**
- `User`, `UserCircle`, `Users`
- `Mail`, `Building`, `MapPin`
- `Frame` (UI frame)
- `Sun`, `Moon` (theme switching)

---

## 🖼️ Custom SVG Components

All custom SVG components are located in `/imports` directory and must be included in any extraction.

### Brand Icons

#### GrammarlyIcon1 (`/imports/GrammarlyIcon1.tsx`)
```tsx
import GrammarlyIcon1 from '../imports/GrammarlyIcon1';
// Uses: /imports/svg-bmrgywwwrd.ts
```

#### Jira1 (`/imports/Jira1.tsx`)
```tsx
import Jira1 from '../imports/Jira1';
// Uses: SVG path data for Jira logo
```

#### GitHub1 (`/imports/GitHub1.tsx`)
```tsx
import GitHub1 from '../imports/GitHub1';
// Uses: SVG path data for GitHub logo
```

### SVG Path Data Files

All SVG path data is stored in TypeScript files with the naming pattern `svg-*.ts`:

**Required SVG Path Files:**
- `/imports/svg-29qu4bx6lr.ts` - Multiple shape paths
- `/imports/svg-89r87cioit.ts`
- `/imports/svg-bmrgywwwrd.ts` - Used by GrammarlyIcon1
- `/imports/svg-hxhu55jt9m.ts`
- `/imports/svg-j4cx2wg87e.ts`
- `/imports/svg-mlwojnnry6.ts`
- `/imports/svg-pg5wjz8x6o.ts`
- `/imports/svg-xsy5c1fxhy.ts`
- `/imports/svg-yf1a89to86.ts`
- `/imports/svg-yha5ctoso0.ts`
- `/imports/svg-zjq9y2uvjw.ts`
- `/imports/svg-zwm860q1st.ts`

**Format Example:**
```typescript
export default {
  p14e74900: "M108.023 16H61.805C...",
  p2234e780: "M62.219 62.078H16C...",
}
```

### UI Component SVGs

**Stepper Variants:**
- `/imports/Numbers.tsx` - Number-based stepper
- `/imports/Dots.tsx` - Dot-based stepper
- `/imports/Progress.tsx` - Progress bar stepper
- `/imports/Breadcrumb.tsx` - Breadcrumb stepper

**Layout Components:**
- `/imports/Simple.tsx` - Simple layout variant
- `/imports/Simple-210-107.tsx` - Simple layout (alt)
- `/imports/Carded.tsx` - Card-based layout

**Spacing Variants:**
- `/imports/Compact.tsx`
- `/imports/Comfortable.tsx`
- `/imports/Spacious.tsx`

**Border Radius Variants:**
- `/imports/Sharp.tsx`
- `/imports/Rounded.tsx`
- `/imports/Pill.tsx`

**Size Variants:**
- `/imports/Sm.tsx` - Small
- `/imports/Md.tsx` - Medium
- `/imports/Lg.tsx` - Large

**Position Variants:**
- `/imports/Left.tsx`
- `/imports/Top.tsx`

**Other Components:**
- `/imports/Steppers.tsx` - Stepper configuration component
- `/imports/BasicInformation.tsx` - Form basic info display
- `/imports/1440WLight.tsx` - Desktop width light theme variant
- `/imports/Progress-220-208.tsx` - Progress indicator variant
- `/imports/Progress-220-226.tsx` - Progress indicator variant (alt)

---

## 📸 Images & Image Handling

### ImageWithFallback Component

**Location:** `/components/figma/ImageWithFallback.tsx`

**Purpose:** Handles image loading with graceful fallback for broken images.

**Usage:**
```tsx
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback
  src="https://example.com/image.jpg"
  alt="Description"
  className="your-classes"
/>
```

**Features:**
- Automatic error handling
- SVG fallback placeholder when image fails to load
- Supports all standard img attributes
- Built-in error state management

**Fallback SVG:**
The component includes a base64-encoded SVG placeholder showing a generic image icon.

### External Images (Unsplash)

The application uses Unsplash images for template previews. These are referenced by URL:

**Template Images:**
1. **Minimal Template:**
   ```
   https://images.unsplash.com/photo-1751307259858-8af1ecae4347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY2xlYW4lMjBmb3JtfGVufDF8fHx8MTc2MzE3MzkyM3ww&ixlib=rb-4.1.0&q=80&w=1080
   ```

2. **Professional Template:**
   ```
   https://images.unsplash.com/photo-1761623135057-e41b632694f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwZ3JhZGllbnQlMjBwYXN0ZWx8ZW58MXx8fHwxNzYzMTc0NTU3fDA&ixlib=rb-4.1.0&q=80&w=1080
   ```

3. **Creative Template:**
   ```
   https://images.unsplash.com/photo-1759266292888-e8709d1ce717?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWJyYW50JTIwZ3JhZGllbnQlMjBkZXNpZ258ZW58MXx8fHwxNjMxNzM5MjR8MA&ixlib=rb-4.1.0&q=80&w=1080
   ```

---

## ⏳ Loading States & Animations

### Loader Component (Loader2)

**From:** `lucide-react`

**Usage:**
```tsx
import { Loader2 } from 'lucide-react';

<Loader2 className="animate-spin" />
```

**Animation:** The loader automatically spins when the `animate-spin` Tailwind class is applied.

### Loading Messages

Located in `/App.tsx`, the application uses a rotating set of loading messages:

```typescript
const loadingMessages = [
  "Analyzing your requirements...",
  "Generating form schema...",
  "Creating UI components...",
  "Applying design system...",
  "Configuring validations...",
  "Building API integrations...",
  "Generating test cases...",
  "Finalizing your form..."
];
```

**Implementation:**
- Messages rotate every 800ms during processing
- Smooth fade transitions using CSS transforms
- Progress bar updates based on message index

### Skeleton Loader

**Component:** Available in `/components/ui/skeleton.tsx` (shadcn/ui)

**Usage:**
```tsx
import { Skeleton } from './components/ui/skeleton';

<Skeleton className="h-4 w-full" />
```

---

## 🎭 CSS Design System Icons

### Custom Variables for Icons

The design system uses CSS variables that can affect icon colors:

**Color Variables (from `/styles/globals.css`):**
```css
--primary
--secondary
--accent
--foreground
--background
--muted
--muted-foreground
--border
--success
--warning
--destructive
```

**Usage in Icons:**
```tsx
<Check style={{ color: 'var(--success)' }} />
<AlertTriangle style={{ color: 'var(--warning)' }} />
<X style={{ color: 'var(--destructive)' }} />
```

---

## 📦 Asset Extraction Checklist

When extracting code from Journey 360, ensure you include:

### ✅ Required Packages
- [ ] `lucide-react` - Icon library
- [ ] All shadcn/ui components from `/components/ui/`

### ✅ Custom Components
- [ ] `/components/figma/ImageWithFallback.tsx`
- [ ] All files in `/imports/` directory

### ✅ SVG Path Data
- [ ] All `svg-*.ts` files from `/imports/`
- [ ] Custom icon components (GrammarlyIcon1, Jira1, GitHub1)

### ✅ Configuration Files
- [ ] `/styles/globals.css` - Contains icon color variables
- [ ] `/styles/tailwind.css` - Tailwind configuration

### ✅ Image Assets
- [ ] Unsplash image URLs (or replace with your own)
- [ ] ImageWithFallback component for error handling

### ✅ Animation Classes
- [ ] Tailwind's `animate-spin` for loaders
- [ ] Custom CSS transitions in globals.css

---

## 🔄 Replacing Icons

### To Replace lucide-react Icons:

1. Find the icon usage in code:
   ```tsx
   import { Check } from 'lucide-react';
   ```

2. Replace with your icon library:
   ```tsx
   import { CheckIcon } from 'your-icon-library';
   ```

3. Update the component usage accordingly.

### To Replace Custom SVGs:

1. Update the SVG path data in `/imports/svg-*.ts` files
2. Or replace the entire component in `/imports/YourIcon.tsx`
3. Keep the same component export interface

### To Replace Images:

1. Update Unsplash URLs in `/components/FormEditorPage.tsx`
2. Or use the `ImageWithFallback` component with your own image sources
3. Ensure fallback behavior is maintained

---

## 💡 Best Practices

1. **Always use ImageWithFallback for external images** to handle loading errors gracefully
2. **Use CSS variables for icon colors** to maintain design system consistency
3. **Import icons individually** from lucide-react to optimize bundle size
4. **Keep SVG path data in separate files** for easier maintenance
5. **Use semantic icon names** that describe their purpose, not appearance
6. **Test loading states** with Loader2 component during async operations
7. **Preserve animation classes** when replacing icons to maintain UX

---

## 📚 Additional Resources

- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)
- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Tailwind CSS Animations](https://tailwindcss.com/docs/animation)

---

**Last Updated:** Generated automatically by Journey 360 system  
**Maintained By:** Development Team
