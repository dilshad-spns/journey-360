# Travel Insurance Mock Scenario - Documentation

## Overview
The Journey 360 system is now configured to **always generate a Travel Insurance Quote & Buy journey**, regardless of what text prompt is entered. This is a mock scenario designed to demonstrate the full capabilities of the multi-step form builder.

## How It Works

### AIParser Behavior
The `utils/aiParser.ts` has been modified to always return a comprehensive travel insurance schema with 4 steps, no matter what input is provided:

```typescript
static parseUserStory(input: string): FormSchema {
  // Always return the comprehensive travel insurance schema
  return this.getTravelInsuranceSchema();
}
```

This means whether you type:
- "Create a travel insurance quote and buy journey"
- "Build a contact form"
- "Make me a registration form"
- Or ANY other text...

**You will always get the Travel Insurance journey.**

## Travel Insurance Journey Structure

### Step 1: Trip Information
Fields included:
- **Trip Type**: Radio button (Single Trip | Annual Multi-trip)
- **Destination**: Searchable dropdown with all countries
- **Travel Start Date**: Date picker
- **Travel End Date**: Date picker with validation (max 180 days for single trip)
- **Number of Travellers**: Number input (1-10)

**Validations**:
- All fields are required
- Date range validation (end date must be after start date)
- Maximum 180 days for single trips
- Minimum 1 traveller, maximum 10

### Step 2: Traveller Information
This step **dynamically generates traveller information sections** based on the "Number of Travellers" selected in Step 1.

**Dynamic Behavior:**
- If you select 2 travellers in Step 1 → You'll see 2 separate traveller cards in Step 2
- If you select 5 travellers in Step 1 → You'll see 5 separate traveller cards in Step 2
- Each traveller's information is contained in its own card for clear separation

**For Each Traveller (in a separate card):**
- **Full Name** (text input - as per passport)
- **Date of Birth** (date picker - age 0-70 required for coverage)
- **Gender** (radio buttons: Male | Female | Other)
- **Passport Number** (text input - validated format: 6-9 alphanumeric characters)
- **Nationality** (dropdown - top 20 countries)
- **Relationship to Proposer** (dropdown)
  - **First traveller**: Locked to "Self" (disabled field)
  - **Other travellers**: Can select Spouse | Child | Parent | Other
- **Pre-existing Medical Conditions** (radio: Yes | No)
  - **If Yes**: Medical Details textarea appears (required)
  - **If No**: Medical Details field is hidden
- **Address Section:**
  - **Country** (dropdown - select first) - Top 20 countries
  - **State/Province** (dropdown - dependent on country) - Populated based on country
  - **City** (dropdown - dependent on state) - Populated based on state
  - **Address Line 1** (text input - required)
  - **Address Line 2** (text input - optional)
  - **ZIP/Postal Code** (text input - required)

**Validations**:
- All fields required except Address Line 2 and Medical Details (Medical Details only required if "Yes" is selected)
- Passport format validation (6-9 alphanumeric characters)
- Proper date validation for DOB
- Cascade validation (must select Country before State, State before City)

**Important Notes**:
- Each traveller's information is rendered in a **separate card container** with rounded borders and shadow
- The Country → State → City dropdowns are **dependent/cascading** - changing country resets state and city
- First traveller's relationship is **always "Self"** and the dropdown is disabled
- Medical details textarea only appears when "Yes" is selected for pre-existing conditions

### Step 3: Coverage Selection & Add-ons

**Coverage Plans** (Radio - Select One):
1. **Bronze - Essential Coverage** ($50/person)
   - Medical expenses up to $50,000
   - Trip cancellation up to $5,000
   - Lost baggage up to $1,000
   - Emergency evacuation up to $25,000
   - 24/7 travel assistance

2. **Silver - Comprehensive Coverage** ($100/person)
   - Medical expenses up to $100,000
   - Trip cancellation up to $10,000
   - Lost baggage up to $2,500
   - Emergency evacuation up to $50,000
   - 24/7 travel assistance
   - Trip delay compensation
   - Rental car excess

3. **Gold - Premium Coverage** ($150/person)
   - Medical expenses up to $250,000
   - Trip cancellation up to $25,000
   - Lost baggage up to $5,000
   - Emergency evacuation up to $100,000
   - 24/7 premium travel assistance
   - Trip delay compensation
   - Rental car excess
   - Adventure sports coverage
   - Cancel for any reason (75% refund)

**Add-on Covers** (Checkboxes - Multi-select):
- Adventure Sports Coverage (+$25)
- Rental Car Excess Coverage (+$15)
- COVID-19 Coverage (+$20)
- Cancel For Any Reason (+$40)

**Validations**:
- Coverage plan selection is required
- Add-ons are optional

### Step 4: Review & Payment

**Payment Methods** (Radio - Select One):
- Credit / Debit Card
- Net Banking
- UPI
- Wallet
- Pay Later

**Card Payment Fields** (when card is selected):
- Card Number (13-19 digits)
- Expiry Date (MM/YY format)
- CVV (3-4 digits)
- Cardholder Name

**Declarations** (Checkboxes - Both Required):
- "I declare that all information provided is accurate and complete"
- "I agree to the Terms & Conditions and Privacy Policy"

**Validations**:
- Payment method required
- Card details validated with regex patterns
- Both declarations must be checked

### Step 5: Confirmation (Thank You Screen)
After successful submission, a confirmation message is displayed with:
- Success message: "🎉 Policy issued successfully! Check your email for policy documents."
- Generated Policy Number (format: `TRV-{timestamp}-{random}`)
- Policy PDF link
- Certificate number
- Issue and expiry dates
- Payment transaction details

## Mock API Integration

The `utils/mockApi.ts` generates comprehensive API endpoints for:

### Standard Endpoints:
- `POST /api/travel-insurance-quote-buy/submit` - Form submission
- `GET /api/travel-insurance-quote-buy/:id` - Get submission
- `GET /api/travel-insurance-quote-buy` - List submissions
- `PUT /api/travel-insurance-quote-buy/:id` - Update submission
- `DELETE /api/travel-insurance-quote-buy/:id` - Delete submission

### Travel Insurance Specific Endpoints:
- `GET /api/travel-insurance/plans` - Get coverage plans
- `POST /api/travel-insurance/calculate-premium` - Calculate total premium
- `POST /api/travel-insurance/issue-policy` - Issue policy
- `POST /api/travel-insurance/process-payment` - Process payment

All endpoints return properly formatted mock data with realistic delays (500-2000ms).

## Form Configurator Support

The form can be customized using the Form Configurator panel:

### Available Configurations:
- **Template**: Simple | Two-Column | Carded
- **Stepper**: ON/OFF
- **Stepper Type**: Dots | Numbers | Progress | Breadcrumb
- **Border Radius**: Sharp | Rounded | Pill
- **Spacing**: Compact | Comfortable | Spacious
- **Label Position**: Top | Left | Inline
- **Input Size**: Small | Medium | Large
- **Theme Colors**: Primary color customization
- **Highlight Required**: Toggle to highlight required fields

## Design System Integration

All components use the design system CSS variables from `/styles/globals.css`:

### Colors:
- `bg-background` - Page background
- `bg-card` - Card backgrounds
- `bg-primary` - Primary buttons and highlights
- `text-foreground` - Main text color
- `text-muted-foreground` - Secondary text
- `border-border` - Border colors
- `bg-input-background` - Input field backgrounds

### Spacing & Borders:
- `rounded-[var(--radius-card)]` - Card border radius
- `rounded-[var(--radius-button)]` - Button border radius
- `rounded-[var(--radius-input)]` - Input border radius
- `rounded-[var(--radius-pill)]` - Pill-shaped elements

### Typography:
- All text uses Inter font family from CSS
- Font sizes controlled by CSS base styles (NO Tailwind font size classes)
- Font weights controlled by CSS variables (NO Tailwind font weight classes)

### Shadows:
- `var(--elevation-sm)` - Small elevation
- `var(--elevation-md)` - Medium elevation
- `var(--elevation-lg)` - Large elevation

## Dark Mode Support
The entire journey is fully compatible with dark mode, using the `.dark` class variants defined in `globals.css`. All colors automatically adjust with WCAG AA compliance for contrast ratios.

## Testing

### Unit Tests Generated:
The `utils/testGenerator.ts` automatically generates tests for:
- Field validation rules
- Form submission
- Required field checks
- Pattern validation (passport, card number, CVV, etc.)
- Date validation
- Step navigation

### Test Framework:
- Tests are generated in React Testing Library + Jest format
- Cover all validation scenarios
- Include integration tests for multi-step navigation

## Data Files

### `/utils/travelInsuranceData.ts`
Contains:
- 195 countries for destination dropdown
- 3 coverage plans (Bronze, Silver, Gold) with pricing and features
- 4 add-on coverages with descriptions and pricing

## How to Use

1. **Start the application**: Navigate to the landing page
2. **Select any input mode**: Text, Speech, or Upload
3. **Enter ANY text** in the requirement field
4. **Click "Generate Journey"**
5. **Result**: You'll always get the Travel Insurance journey
6. **Navigate through steps** using the stepper
7. **Submit the form** to see the thank you screen with policy number

## Customization

To revert to normal AI parsing behavior:
1. Open `/utils/aiParser.ts`
2. Modify the `parseUserStory` method to parse actual user input instead of always returning travel insurance schema

To modify the travel insurance journey:
1. Edit the schema in `getTravelInsuranceSchema()` method
2. Update field definitions, validations, or add/remove fields
3. Modify coverage plans in `/utils/travelInsuranceData.ts`

## Known Limitations

- Currently configured as a mock scenario (always returns same journey)
- Real API integration would require backend implementation
- Payment processing is simulated
- File uploads not yet implemented for document verification
- Multi-traveller dynamic forms are simplified (showing structure for 1 traveller in schema)

## Future Enhancements

Potential improvements:
- Dynamic traveller forms based on count
- Real-time premium calculation
- Document upload for passport verification
- Payment gateway integration
- Email notifications with policy documents
- Admin dashboard for policy management
- Claims management workflow
