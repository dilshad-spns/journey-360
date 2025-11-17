# Embed Integration Guide

## Overview

Journey 360 provides embeddable form journeys that can be integrated into any React/Next.js application or embedded via iframe in any web application.

## Available Embeds

### 1. Travel Insurance Journey (`/embed/travel`)
- **Route**: `/embed/travel`
- **Type**: 4-step multi-step form
- **Use Case**: Travel insurance purchase journey
- **Steps**:
  1. Trip Details
  2. Traveler Information
  3. Coverage Selection
  4. Review & Payment

### 2. Death Claim Journey (`/embed/motor`)
- **Route**: `/embed/motor`
- **Type**: 4-step claim submission form
- **Use Case**: Universal Life Product death claim for North America Agent Portal
- **Steps**:
  1. Claimant Information
  2. Deceased Information
  3. Claim Details
  4. Review & Submit

## Integration Methods

### Method 1: iframe Embed (Any Framework)

Perfect for embedding into any web application, regardless of framework.

```html
<iframe 
  src="http://localhost:3000/embed/travel" 
  width="100%" 
  height="800px"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>
```

### Method 2: React Component Import (Same Codebase)

If you're using the Journey 360 codebase or have access to the components:

```tsx
import TravelInsuranceForm from './components/TravelInsuranceForm';

export default function MyPage() {
  const handleFormDataChange = (data: any) => {
    console.log('Form data:', data);
  };

  return (
    <TravelInsuranceForm
      showStepper={true}
      stepperType="progress"
      borderRadius="rounded"
      spacing="comfortable"
      labelPosition="top"
      inputSize="md"
      template="simple"
      onFormDataChange={handleFormDataChange}
    />
  );
}
```

### Method 3: Next.js with PostMessage (Recommended)

For Next.js applications that want real-time form data updates:

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function EmbeddedForm() {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Listen for form updates from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TRAVEL_FORM_UPDATE') {
        setFormData(event.data.data);
        console.log('Form updated:', event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div>
      <iframe 
        src="/embed/travel" 
        width="100%" 
        height="800px"
        style={{ border: 'none' }}
      />
      
      {formData && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3>Live Form Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

## PostMessage API

Forms automatically send messages to the parent window when data changes:

### Message Structure

```typescript
{
  type: 'TRAVEL_FORM_UPDATE' | 'DEATH_CLAIM_FORM_UPDATE',
  data: {
    // Form field data
    currentStep: number,
    formData: any,
    // ... other relevant data
  }
}
```

### Message Types

| Form | Message Type |
|------|-------------|
| Travel Insurance | `TRAVEL_FORM_UPDATE` |
| Death Claim | `DEATH_CLAIM_FORM_UPDATE` |

## Live Demo

Visit [http://localhost:3000/demo-integration](http://localhost:3000/demo-integration) to see:
- Live preview of both forms
- Real-time data monitoring
- Device view switching (desktop/tablet/mobile)
- Integration code examples

## Routes Overview

| Route | Purpose |
|-------|---------|
| `/embed` | Documentation and code examples |
| `/embed/travel` | Travel insurance form |
| `/embed/motor` | Death claim form |
| `/demo-integration` | Live integration demo |

## Component Props

Both form components accept these configuration props:

```typescript
interface FormProps {
  showStepper?: boolean;              // Show/hide stepper
  stepperType?: 'dots' | 'numbers' | 'progress' | 'breadcrumb';
  borderRadius?: 'sharp' | 'rounded' | 'pill';
  spacing?: 'compact' | 'comfortable' | 'spacious';
  labelPosition?: 'top' | 'left' | 'inline';
  inputSize?: 'sm' | 'md' | 'lg';
  template?: 'simple' | 'two-column' | 'carded';
  onFormDataChange?: (data: any) => void;
}
```

## Design System Integration

All embedded forms use CSS variables from your design system (`/styles/globals.css`):

- **Colors**: `--color-primary`, `--color-accent`, etc.
- **Spacing**: `--spacing-xs` to `--spacing-xl`
- **Radius**: `--radius-button`, `--radius-card`, `--radius-input`
- **Typography**: Inter font family (no Tailwind font classes)

To customize, simply update the CSS variables in your parent application.

## Features

### ✅ Included
- Multi-step wizard navigation
- Form validation
- Error handling
- Success states
- Toast notifications
- Responsive design
- Dark mode support
- Design system integration
- Real-time data updates

### 🎨 Customizable
- Stepper type and style
- Border radius
- Spacing
- Input sizes
- Layout templates
- Colors via CSS variables

## Security Considerations

### CORS
When embedding via iframe, ensure:
- Your domain is allowed in CORS configuration
- postMessage origin validation is implemented

### Data Privacy
- Forms run in sandboxed iframes
- No cookies or localStorage shared between parent and iframe by default
- Use postMessage for controlled data sharing

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Required Features
- CSS Grid & Flexbox
- ES6+ JavaScript
- postMessage API (for iframe communication)

## Troubleshooting

### iframe Not Loading
```javascript
// Check if iframe is accessible
const iframe = document.getElementById('my-iframe');
console.log(iframe.contentWindow);
```

### PostMessage Not Working
```javascript
// Verify origin
window.addEventListener('message', (event) => {
  console.log('Message from:', event.origin);
  console.log('Message data:', event.data);
});
```

### Styling Issues
- Ensure CSS variables are defined in parent app
- Check for CSS conflicts
- Verify `border: none` on iframe for seamless integration

## Examples

### Responsive iframe
```html
<div style="position: relative; width: 100%; padding-bottom: 100%; overflow: hidden;">
  <iframe 
    src="/embed/travel"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
  ></iframe>
</div>
```

### Dynamic Height
```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'RESIZE') {
    const iframe = document.getElementById('my-iframe');
    iframe.style.height = event.data.height + 'px';
  }
});
```

## Support

For questions or issues:
1. Check the [demo page](/demo-integration)
2. Review [integration examples](/embed)
3. See [troubleshooting guide](./TROUBLESHOOTING.md)

## Quick Links

- 📖 [Full Documentation](./README.md)
- 🎨 [Design System](../styles/globals.css)
- 🚀 [Getting Started](./INSTALLATION.md)
- 🔧 [Environment Variables](./ENVIRONMENT_VARIABLES.md)

---

**Ready to integrate?** Visit [/embed](/embed) for copy-paste code examples!
