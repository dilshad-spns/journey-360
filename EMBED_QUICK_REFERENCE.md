# Embed Routes - Quick Reference Card

## 🔗 Routes

| Route | Purpose | Form Type |
|-------|---------|-----------|
| `/embed/travel` | Travel insurance form | 4-step journey |
| `/embed/motor` | Death claim form | 4-step journey |
| `/embed` | Integration docs + code | Documentation |
| `/demo-integration` | Live demo | Interactive preview |

## 💻 Quick Integration

### HTML/iframe
```html
<iframe src="/embed/travel" width="100%" height="800px"></iframe>
```

### React
```tsx
import TravelInsuranceForm from './components/TravelInsuranceForm';
<TravelInsuranceForm onFormDataChange={handleData} />
```

### Listen for Updates
```javascript
window.addEventListener('message', (e) => {
  if (e.data.type === 'TRAVEL_FORM_UPDATE') {
    console.log(e.data.data);
  }
});
```

## 📋 Message Types

- `TRAVEL_FORM_UPDATE` - Travel insurance data
- `DEATH_CLAIM_FORM_UPDATE` - Death claim data

## 🎨 Customization

All forms use CSS variables from `/styles/globals.css`:
- `--color-primary`, `--color-accent`
- `--radius-button`, `--radius-card`
- `--spacing-xs` to `--spacing-xl`
- Inter font family (no Tailwind classes)

## 🚀 Demo Links

- **Travel Form**: [http://localhost:3000/embed/travel](http://localhost:3000/embed/travel)
- **Motor Form**: [http://localhost:3000/embed/motor](http://localhost:3000/embed/motor)
- **Live Demo**: [http://localhost:3000/demo-integration](http://localhost:3000/demo-integration)
- **Code Examples**: [http://localhost:3000/embed](http://localhost:3000/embed)

## ✅ Features

- ✅ Multi-step wizard
- ✅ Form validation
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Dark mode
- ✅ Design system integrated
- ✅ PostMessage API
- ✅ Toast notifications

## 📖 Full Docs

[/docs/EMBED_INTEGRATION.md](./docs/EMBED_INTEGRATION.md)
