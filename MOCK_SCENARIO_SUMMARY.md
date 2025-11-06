# Mock Scenario Configuration - Summary

## ✅ What Has Been Done

The Journey 360 system has been configured to **always generate a Travel Insurance Quote & Buy journey**, regardless of the input prompt. This serves as a comprehensive demonstration of the multi-step form capabilities.

## 🔧 Modified Files

### 1. `/utils/aiParser.ts`
- **Change**: Always returns travel insurance schema
- **Method**: `parseUserStory()` now ignores input and returns `getTravelInsuranceSchema()`
- **Result**: ANY text input generates the same travel insurance journey

### 2. `/components/FormRenderer.tsx`
- **Change**: Updated wizard step grouping logic
- **Before**: Fields were split evenly across 3 steps
- **After**: Fields are grouped by their `wizardStep` property from schema
- **Result**: Proper 4-step journey display when stepper is ON

### 3. `/components/TravelInsuranceForm.tsx` (NEW)
- **Purpose**: Custom dynamic form component for travel insurance
- **Features**:
  - Dynamic traveller sections based on count selected in Step 1
  - Each traveller in a separate card container
  - Country → State → City cascade dropdowns
  - First traveller relationship locked to "Self"
  - Conditional medical details field
  - Address fields (Line 1, Line 2, ZIP as text inputs)
  - City and State as dependent dropdowns
  - Full form validation
  - Policy number generation
  - Thank you screen
- **Integration**: Automatically used when schema title contains "travel insurance"

### 4. `/utils/travelInsuranceData.ts` (NEW)
- **Contains**: 
  - 195 countries for destination dropdown
  - 3 coverage plans (Bronze $49.99, Silver $99.99, Gold $149.99)
  - 4 add-on coverages ($15-$40)
- **Usage**: Referenced in documentation and available for future form enhancements

### 4. `/utils/mockApi.ts`
- **Status**: Already had travel insurance support
- **Features**: Generates policy numbers in format `TRV-{timestamp}-{random}`
- **Endpoints**: 11 total endpoints including payment, premium calculation, policy issuance

## 📋 Travel Insurance Journey Structure

### Step 1: Trip Information (5 fields)
- Trip Type (radio)
- Destination (select with 5 regions)
- Travel Start Date (date)
- Travel End Date (date) - with 180-day validation
- Number of Travellers (number, 1-10)

### Step 2: Traveller Information (Dynamic - based on count from Step 1)
**Dynamic Behaviour:**
- If "Number of Travellers" = 2 in Step 1, shows 2 traveller cards
- If "Number of Travellers" = 5 in Step 1, shows 5 traveller cards
- Each traveller's information is in a separate card container

**For Each Traveller:**
- Full Name (text input)
- Date of Birth (date picker)
- Gender (radio: Male/Female/Other)
- Passport Number (text input with validation)
- Nationality (dropdown)
- Relationship to Proposer (dropdown - first traveller locked to "Self", others can choose Spouse/Child/Parent/Other)
- Pre-existing Medical Conditions (radio: Yes/No)
  - If Yes: Medical Details (textarea - shown conditionally)
- **Address Section:**
  - Country (dropdown) - Select first
  - State/Province (dropdown) - Dependent on country selection
  - City (dropdown) - Dependent on state selection
  - Address Line 1 (text input)
  - Address Line 2 (text input - optional)
  - ZIP/Postal Code (text input)

### Step 3: Coverage Selection (8 fields)
- Coverage Plan (Bronze/Silver/Gold)
- 4 Add-on checkboxes (Adventure, Rental Car, COVID-19, Cancel Any Reason)

### Step 4: Review & Payment (7 fields)
- Payment Method (radio: Card/Net Banking/UPI/Wallet/Pay Later)
- Card Number, Expiry, CVV, Cardholder Name
- 2 Declaration checkboxes (required)

### Step 5: Confirmation
- Thank you screen with policy number
- Shown after successful submission

## 🎨 Design System Compliance

All components use CSS variables from `/styles/globals.css`:

**Colors**: ✅
- `bg-background`, `bg-card`, `bg-primary`
- `text-foreground`, `text-muted-foreground`
- `border-border`, `bg-input-background`

**Border Radius**: ✅
- `var(--radius-card)`
- `var(--radius-button)`  
- `var(--radius-input)`
- `var(--radius-pill)`

**Typography**: ✅
- Inter font family from CSS
- NO Tailwind font size classes (text-xl, text-2xl, etc.)
- NO Tailwind font weight classes (font-bold, font-semibold, etc.)
- All controlled by CSS base styles

**Shadows**: ✅
- `var(--elevation-sm/md/lg)`

**Dark Mode**: ✅
- Fully supported with WCAG AA compliance

## 🧪 How to Test

1. Open the application
2. Click any input mode (Text / Speech / Upload)
3. Type **ANYTHING** (e.g., "create a contact form", "xyz", "hello world")
4. Click "Generate Journey"
5. **Result**: You'll get the Travel Insurance journey every time

## 🔄 Reverting to Normal Behavior

To restore normal AI parsing (where input actually matters):

1. Open `/utils/aiParser.ts`
2. Replace the `parseUserStory` method to actually parse user input
3. Implement conditional logic to return different schemas based on input

## 📊 Form Configurator Options

Users can customize the travel insurance journey using:

- **Template**: Simple / Two-Column / Carded
- **Stepper**: ON/OFF (4 steps when ON)
- **Stepper Type**: Dots / Numbers / Progress / Breadcrumb
- **Border Radius**: Sharp / Rounded / Pill
- **Spacing**: Compact / Comfortable / Spacious
- **Label Position**: Top / Left / Inline
- **Input Size**: Small / Medium / Large
- **Theme Colors**: Custom primary color
- **Highlight Required**: Show required field indicators

## 📝 Key Features Demonstrated

✅ Multi-step wizard with stepper navigation
✅ Dynamic field grouping by wizardStep property
✅ Comprehensive form validations
✅ Radio buttons, checkboxes, selects, text inputs, dates
✅ Conditional fields (medical details shown when conditions = yes)
✅ Mock API with realistic delays and policy number generation
✅ Thank you screen with confirmation
✅ Responsive design
✅ Dark mode support
✅ Design system adherence (all CSS variable-based styling)
✅ Auto-generated unit tests
✅ Form configurator integration

## 🎯 Use Case Completed

The travel insurance journey now includes:

- ✅ 4 steps (Trip Info → Traveller Info → Coverage → Payment)
- ✅ Thank you screen with policy number
- ✅ Stepper showing progress
- ✅ Trip type selection (Single/Annual)
- ✅ Searchable destination dropdown
- ✅ Date fields with 180-day validation
- ✅ Number of travellers field
- ✅ **Dynamic traveller sections** (fully implemented - shows N cards based on traveller count)
- ✅ Each traveller in separate card container with styling
- ✅ Gender, Passport, Nationality, Relationship fields
- ✅ Pre-existing conditions (Yes/No + conditional details textarea)
- ✅ Complete address fields (Line 1, Line 2 as text, Country/State/City as dropdowns)
- ✅ **Cascade dropdowns** (Country → State → City dependency)
- ✅ First traveller locked to "Self" relationship (disabled dropdown)
- ✅ Other travellers can select relationship (Spouse/Child/Parent/Other)
- ✅ Coverage selection (Bronze/Silver/Gold)
- ✅ Add-on covers (multi-select checkboxes)
- ✅ Summary and payment section
- ✅ Declarations and T&C checkboxes
- ✅ Payment method selection
- ✅ Card details fields
- ✅ Form validations throughout
- ✅ Policy number generation on submission

## 📚 Documentation Files

1. `/TRAVEL_INSURANCE_MOCK.md` - Comprehensive documentation
2. `/MOCK_SCENARIO_SUMMARY.md` - This file (quick reference)
3. `/utils/travelInsuranceData.ts` - Data file with countries and plans

## ⚠️ Important Notes

- This is a **mock scenario** - AIParser ignores all input
- Real implementation would need actual AI parsing logic
- Payment is simulated (no real payment gateway)
- Multi-traveller forms show structure for 1 traveller (can be extended)
- All data is mock data (no real database)

## 🚀 Next Steps (If Needed)

To make this production-ready:
1. Implement real AI parsing that analyzes user input
2. Connect to actual payment gateway
3. Integrate with backend API for policy storage
4. Add document upload for passport verification
5. Implement email notifications
6. Add claims management workflow
7. Create admin dashboard for policy management

---

**Status**: ✅ Mock scenario fully configured and ready to demo
**Last Updated**: 2025-01-04
