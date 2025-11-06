# Stepper Types - Visual Reference

This document provides a visual representation of all 4 stepper types available in the Travel Insurance Form.

## 1. Dots Stepper

```
Step 1        Step 2        Step 3        Step 4
  ●             ○             ○             ○
  
Active        Inactive      Inactive      Inactive
```

**Visual Characteristics:**
- Small filled dots (3px for active, 2.5px for inactive)
- Active dot is larger (scale 125%)
- Completed dots shown in success green
- Labels centered below dots
- No connecting lines

**Layout:** Horizontal, centered, minimal spacing

---

## 2. Numbers Stepper (Default)

```
   Step 1             Step 2             Step 3             Step 4
    ┌──┐─────────────┌──┐─────────────┌──┐─────────────┌──┐
    │✓ │─────────────│ 2│─────────────│ 3│─────────────│ 4│
    └──┘─────────────└──┘─────────────└──┘─────────────└──┘
   
 Trip Info      Traveller        Coverage         Summary
```

**Visual Characteristics:**
- 40px circular containers
- Numbers inside circles
- Check marks (✓) for completed steps
- Horizontal lines connecting steps
- Active circle scales up (110%)
- Labels centered below circles

**Layout:** Horizontal with max-width 3xl, full width distribution

---

## 3. Progress Bar Stepper

```
Step 1          Step 2          Step 3          Step 4
  ║               ║               ║               ║
  ▼               ▼               ▼               ▼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ●               ○               ○               ○

[████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]
  ^progress bar (25% filled for step 1)
```

**Visual Characteristics:**
- Horizontal progress bar (2px height)
- Filled portion shows primary color
- Step labels above progress bar
- Small circular indicators on the bar
- Check marks in completed indicators
- Smooth width transition animation

**Layout:** Horizontal with max-width 3xl, labels distributed evenly

---

## 4. Breadcrumb Stepper

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ 1 Step1 │ -> │ 2 Step2 │ -> │ 3 Step3 │ -> │ 4 Step4 │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

**Visual Characteristics:**
- Pill-shaped containers with rounded corners
- Number and label in same container
- Chevron (→) separators between steps
- Completed steps show check mark instead of number
- Active step has subtle inner circle for number
- Wraps gracefully on small screens

**Layout:** Horizontal, centered, with gap-2 spacing

---

## Color States

### Active Step (Current)
- Background: `--primary` (Dark Blue)
- Text: `--primary-foreground` (White)
- Scale: 110% (numbers) or 125% (dots)

### Completed Step
- Background: `--success` (Green)
- Text: `--success-foreground` (White)
- Icon: Check mark (✓)

### Inactive Step (Future)
- Background: `--muted` (Light Gray)
- Text: `--muted-foreground` (Gray)
- No special effects

### Step Labels
- Active: `--foreground` (Dark) or `--primary` (progress bar)
- Completed: `--success` (progress bar)
- Inactive: `--muted-foreground` (Gray)

---

## Animations & Transitions

All steppers use `--transition-normal` (250ms by default) for:
- ✅ Color changes when progressing
- ✅ Scale transformations (active state)
- ✅ Progress bar width (progress stepper)
- ✅ Background color changes
- ✅ Check mark appearance

---

## Responsive Behavior

### Desktop (>1024px)
- All steppers display horizontally
- Full step labels visible
- Optimal spacing

### Tablet (768px - 1024px)
- Steppers remain horizontal
- Labels may wrap on longer text
- Slightly reduced spacing

### Mobile (<768px)
- **Dots**: Works perfectly, compact design
- **Numbers**: Labels may wrap, circles remain visible
- **Progress**: Labels may overlap slightly, consider shorter text
- **Breadcrumb**: Wraps to multiple rows automatically

**Recommendation:** Use Dots or Numbers for mobile-first designs.

---

## Use Case Matrix

| Stepper Type | Best For | Form Length | Mobile | Visual Impact |
|--------------|----------|-------------|--------|---------------|
| **Dots** | Minimalist designs | 3-5 steps | ★★★★★ | Low |
| **Numbers** | Traditional forms | 3-6 steps | ★★★★☆ | Medium |
| **Progress** | Long processes | 4-8 steps | ★★★☆☆ | High |
| **Breadcrumb** | Guided journeys | 3-5 steps | ★★★★☆ | Medium-High |

★ = Rating (5 stars = best)

---

## Quick Selection Guide

Choose your stepper based on:

1. **Form Length**
   - 2-3 steps: Dots or Breadcrumb
   - 4-5 steps: Numbers (default)
   - 6+ steps: Progress

2. **Design Style**
   - Minimal/Modern: Dots
   - Traditional/Professional: Numbers
   - Task-oriented: Progress
   - Journey/Wizard: Breadcrumb

3. **User Context**
   - First-time users: Numbers (most familiar)
   - Returning users: Dots (minimal distraction)
   - Complex process: Progress (shows completion)
   - Sequential workflow: Breadcrumb (navigation feel)

4. **Screen Size Priority**
   - Desktop-first: Any type works
   - Mobile-first: Dots or Numbers
   - Tablet-optimized: Numbers or Breadcrumb
   - Responsive: Dots (safest)

---

## Implementation Quick Reference

```tsx
// Dots - Clean and minimal
<TravelInsuranceForm stepperType="dots" />

// Numbers - Classic and familiar (DEFAULT)
<TravelInsuranceForm stepperType="numbers" />

// Progress - Shows completion percentage
<TravelInsuranceForm stepperType="progress" />

// Breadcrumb - Navigation style
<TravelInsuranceForm stepperType="breadcrumb" />

// No stepper
<TravelInsuranceForm showStepper={false} />
```

---

## Accessibility Notes

All steppers include:
- Proper color contrast (WCAG AA)
- Clear visual indicators
- Consistent spacing
- Readable labels
- Animation that respects `prefers-reduced-motion`

---

## Testing Checklist

When implementing a new stepper type:

- [ ] Test on Desktop (>1920px)
- [ ] Test on Laptop (1366px)
- [ ] Test on Tablet (768px)
- [ ] Test on Mobile (375px)
- [ ] Test step progression (1→2→3→4)
- [ ] Test step regression (4→3→2→1)
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Verify all CSS variables load
- [ ] Check animations are smooth
- [ ] Ensure labels don't overflow
- [ ] Test with longer step names
- [ ] Test with shorter step names

---

## Design System Compliance

✅ All colors use CSS variables  
✅ All font sizes use CSS variables  
✅ All border radius use CSS variables  
✅ All transitions use CSS variables  
✅ No hardcoded Tailwind font classes  
✅ Inter font family throughout  
✅ Consistent spacing scale  
✅ Shadow variables for elevation  

---

## Need Help?

- See [STEPPER_TYPES_GUIDE.md](STEPPER_TYPES_GUIDE.md) for detailed documentation
- Check `/components/TravelInsuranceForm.tsx` for implementation
- Review `/styles/globals.css` for design tokens
- Test with `/components/StepperTypesDemo.tsx` demo component
