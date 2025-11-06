# Stepper Types Guide

## Overview
The Travel Insurance Form now supports **4 different stepper types** that can be configured to match your design preferences. All steppers are fully responsive and use CSS variables from your design system.

## Available Stepper Types

### 1. **Dots Stepper** (`stepperType="dots"`)
- **Description**: Minimalist dot indicators with step labels
- **Best For**: Clean, modern designs with minimal visual clutter
- **Features**:
  - Small circular dots (2.5px-3px)
  - Active step scales up (125%)
  - Completed steps shown in success color
  - Step labels below each dot

### 2. **Numbers Stepper** (`stepperType="numbers"`)
- **Description**: Classic numbered circles with connecting lines
- **Best For**: Traditional forms where users expect numbered steps
- **Features**:
  - 40px circular containers with step numbers
  - Check mark icon for completed steps
  - Connecting lines between steps
  - Active step scales up (110%)
  - Step labels below circles

### 3. **Progress Bar Stepper** (`stepperType="progress"`)
- **Description**: Linear progress bar with step indicators
- **Best For**: Long forms where showing overall progress is important
- **Features**:
  - Horizontal progress bar showing completion percentage
  - Step labels above the progress bar
  - Small circular indicators on the progress line
  - Check marks in completed step indicators
  - Smooth width transition animations

### 4. **Breadcrumb Stepper** (`stepperType="breadcrumb"`)
- **Description**: Hierarchical navigation style with chevron separators
- **Best For**: Forms that need to feel like a guided journey
- **Features**:
  - Pill-shaped step containers
  - Step number/check mark with step label in same container
  - Chevron separators between steps
  - Compact and horizontal layout

## Usage

### In TravelInsuranceForm Component
```tsx
import { TravelInsuranceForm } from './components/TravelInsuranceForm';

// Default (Numbers)
<TravelInsuranceForm showStepper={true} />

// Dots
<TravelInsuranceForm showStepper={true} stepperType="dots" />

// Numbers
<TravelInsuranceForm showStepper={true} stepperType="numbers" />

// Progress
<TravelInsuranceForm showStepper={true} stepperType="progress" />

// Breadcrumb
<TravelInsuranceForm showStepper={true} stepperType="breadcrumb" />

// Hide Stepper
<TravelInsuranceForm showStepper={false} />
```

### In FormEditorPage
The stepper type can be configured in the **UI Configuration** panel on the right side:

1. Enable the stepper by clicking **ON** in the "Enable Stepper" section
2. Once enabled, the **Stepper Type** selector appears
3. Click on any of the 4 options: Dots, Numbers, Progress, or Breadcrumb
4. The preview updates immediately

## Design System Integration

### Colors Used
All steppers use the following CSS variables from `/styles/globals.css`:
- `--primary` - Active step background
- `--primary-foreground` - Active step text/icon
- `--success` - Completed step background
- `--success-foreground` - Completed step text/icon
- `--muted` - Inactive step background
- `--muted-foreground` - Inactive step text
- `--foreground` - Active step label text

### Border Radius
- `--radius-pill` - Circular elements (dots, step numbers, icons)
- `--radius-button` - Breadcrumb containers

### Typography
- `--text-label` - Step labels (12px by default)
- `--text-base` - Breadcrumb step text (14px by default)

### Transitions
- `--transition-normal` - All animations (250ms by default)

### Spacing
All spacing uses Tailwind's spacing scale which can be customized via your design system.

## Customization

### Changing Default Stepper Type
In `/components/TravelInsuranceForm.tsx`, line 79:
```tsx
export function TravelInsuranceForm({ 
  showStepper = true, 
  stepperType = 'numbers' // Change default here
}: TravelInsuranceFormProps)
```

In `/components/FormEditorPage.tsx`, line 96:
```tsx
const [stepperType, setStepperType] = useState<'dots' | 'numbers' | 'progress' | 'breadcrumb'>('numbers'); // Change default here
```

### Modifying Stepper Colors
Update the color variables in `/styles/globals.css`:
```css
:root {
  --primary: rgba(0, 28, 86, 1);     /* Active step color */
  --success: rgba(34, 197, 94, 1);   /* Completed step color */
  --muted: rgba(241, 245, 249, 1);   /* Inactive step color */
}
```

### Adjusting Stepper Sizes
Each stepper render function in `/components/TravelInsuranceForm.tsx` can be modified:

**Dots Stepper:**
- Change `h-3 w-3` for active dot size
- Change `h-2.5 w-2.5` for inactive dot size

**Numbers Stepper:**
- Change `h-10 w-10` for circle size
- Change `h-5 w-5` for check icon size

**Progress Bar:**
- Change `h-2` for progress bar height
- Change `h-4 w-4` for step indicator size

**Breadcrumb:**
- Change `h-6 w-6` for number container size
- Change `px-4 py-2` for pill padding

## Demo Component

A demo component is available at `/components/StepperTypesDemo.tsx` that shows:
- All 4 stepper types
- Interactive type selector
- Live preview with actual form
- Descriptions of each type

To use the demo:
```tsx
import { StepperTypesDemo } from './components/StepperTypesDemo';

// In your App or route
<StepperTypesDemo />
```

## Accessibility

All steppers include:
- ✅ Semantic HTML structure
- ✅ Proper color contrast ratios (WCAG AA compliant)
- ✅ Visual indicators for current, completed, and upcoming steps
- ✅ Clear step labels
- ✅ Smooth transitions for better UX

## Browser Support

All stepper types work in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Migration from Old Version

If you were using the old single stepper type:

**Before:**
```tsx
<TravelInsuranceForm showStepper={true} />
```

**After (same behavior):**
```tsx
<TravelInsuranceForm showStepper={true} stepperType="numbers" />
```

The default is "numbers" so no code changes are required if you want to keep the same appearance.

## Troubleshooting

### Stepper not showing
- Ensure `showStepper={true}` is set
- Check that the form has multiple steps defined

### Wrong stepper type displaying
- Verify the `stepperType` prop is correctly set
- Check that the value is one of: 'dots', 'numbers', 'progress', 'breadcrumb'

### Styling issues
- Ensure `/styles/globals.css` has all required CSS variables
- Check that Tailwind CSS is properly configured
- Verify that no parent components are overriding styles

### Colors not matching design system
- Update color variables in `/styles/globals.css`
- Ensure `@theme inline` section includes color mappings
- Clear browser cache and rebuild

## Best Practices

1. **Choose based on context**:
   - Short forms (2-3 steps): Breadcrumb or Dots
   - Medium forms (4-5 steps): Numbers or Progress
   - Long forms (6+ steps): Progress

2. **Mobile considerations**:
   - Dots and Progress work best on mobile
   - Breadcrumb may wrap on small screens (designed to wrap gracefully)
   - Numbers stepper is responsive but uses more vertical space

3. **Consistency**:
   - Use the same stepper type across similar forms in your app
   - Match stepper type to your overall design language

4. **User testing**:
   - Test with actual users to see which stepper they understand best
   - Consider your target audience's familiarity with different patterns

## Future Enhancements

Potential additions (not yet implemented):
- Vertical stepper orientation
- Custom icons per step
- Click-to-navigate to previous steps
- Animated transitions between steps
- Step validation indicators
- Time estimates per step
