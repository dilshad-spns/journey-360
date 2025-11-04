# Travel Insurance Mock Scenario

## Overview

This document describes the comprehensive Travel Insurance Quote & Buy journey that has been implemented as a mock scenario in the AI 360 system. **The system is currently configured to always generate this travel insurance journey, regardless of the input prompt.**

---

## Use Case

**As a traveler,**  
I want to seamlessly purchase a travel insurance policy through a guided multi-step journey,  
So that I can get instant coverage tailored to my trip details and preferences.

---

## Journey Architecture

### 5-Step Wizard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Trip Information                                   │
│  ├─ Trip Type (Single / Annual Multi-trip)                  │
│  ├─ Destination (Worldwide, Europe, Asia, etc.)             │
│  ├─ Travel Start Date                                       │
│  ├─ Travel End Date                                         │
│  └─ Number of Travelers                                     │
├─────────────────────────────────────────────────────────────┤
│  Step 2: Traveler Information                               │
│  ├─ Full Name (as per passport)                             │
│  ├─ Date of Birth                                           │
│  ├─ Gender (Male / Female / Other)                          │
│  ├─ Passport Number                                         │
│  ├─ Nationality                                             │
│  ├─ Relationship to Proposer                                │
│  ├─ Pre-existing Medical Conditions (Yes/No + Details)      │
│  └─ Address (Line 1, Line 2, City, State, Country, ZIP)    │
├─────────────────────────────────────────────────────────────┤
│  Step 3: Coverage & Add-ons                                 │
│  ├─ Coverage Plan (Bronze / Silver / Gold)                  │
│  ├─ Adventure Sports Coverage (Optional)                    │
│  ├─ Rental Car Excess Coverage (Optional)                   │
│  ├─ COVID-19 Coverage (Optional)                            │
│  └─ Cancel for Any Reason (Optional)                        │
├─────────────────────────────────────────────────────────────┤
│  Step 4: Review & Payment                                   │
│  ├─ Payment Method Selection                                │
│  ├─ Card Details (Number, Expiry, CVV, Name)               │
│  ├─ Declaration Checkbox                                    │
│  └─ Terms & Conditions Checkbox                             │
├─────────────────────────────────────────────────────────────┤
│  Step 5: Confirmation                                        │
│  ├─ Policy Number                                           │
│  ├─ Download Policy PDF                                     │
│  ├─ Email/SMS Confirmation                                  │
│  └─ Trip Assistance Helpline                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Scenarios

### Scenario 1: Trip Information Step

**Given** the user is on the Trip Information page  
**When** the user provides:
- Trip Type (Single / Annual Multi-trip)
- Destination (Worldwide / Europe / Asia / South East Asia / Worldwide excl. USA, Canada, Caribbean, Mexico)
- Travel Start Date
- Travel End Date
- Number of Travelers

**Then** the system should:
- Validate that Travel End Date ≥ Travel Start Date
- Calculate Travel Duration as End Date - Start Date
- Display an error if Travel Duration > 180 days for Single Trip
- Proceed to Traveler Information step on successful validation

**Validations:**
- All fields are required
- End date must be after or equal to start date
- Maximum 180 days for single trip
- Number of travelers: 1-10

---

### Scenario 2: Traveler Information Step

**Given** the user is on the Traveler Information step  
**When** the user enters for each traveler:
- Full Name (as per passport)
- Date of Birth
- Gender (Male / Female / Other)
- Passport Number
- Nationality
- Relationship to Proposer (Self / Spouse / Child / Parent / Other)
- Pre-existing Medical Conditions (Yes / No, if Yes → add details)
- Address Line 1
- Address Line 2 (optional)
- City / State / Country / ZIP

**Then** the system should:
- Validate Age within coverage limit (0–70 years)
- Validate Passport Number format as per defined regex pattern (`^[A-Z0-9]{6,9}$`)
- Allow user to add multiple travelers up to specified limit
- On successful validation, proceed to Coverage & Add-ons step

**Validations:**
- Full name: Required, minimum 2 characters
- Date of birth: Required, age must be 0-70 years
- Gender: Required
- Passport: Required, format `^[A-Z0-9]{6,9}$`
- Nationality: Required
- Relationship: Required
- Medical conditions: Required (Yes/No)
- Address Line 1: Required
- City, State, Country, ZIP: Required

---

### Scenario 3: Coverage & Add-ons Step

**Given** the user is on the Coverage and Add-ons step  
**When** the system fetches plan options from mock API  
**Then** it should display three boxed plans:
- **Bronze** ($50/person)
  - Medical: $50,000
  - Trip Cancellation: $5,000
  - Baggage: $1,000
  - Emergency Evacuation: $25,000

- **Silver** ($100/person)
  - Medical: $100,000
  - Trip Cancellation: $10,000
  - Baggage: $2,500
  - Emergency Evacuation: $50,000
  - Trip delay compensation
  - Rental car excess

- **Gold** ($150/person)
  - Medical: $250,000
  - Trip Cancellation: $25,000
  - Baggage: $5,000
  - Emergency Evacuation: $100,000
  - All Silver benefits
  - Adventure sports coverage
  - Cancel for any reason (75% refund)

**And** when the user selects a plan,  
**Then** the system should:
- Expand the plan box to display Coverage Inclusions and Exclusions
- Allow selection of add-ons if applicable:
  - Adventure Sports Coverage: +$25
  - Rental Car Excess: +$15
  - COVID-19 Coverage: +$20
  - Cancel for Any Reason: +$40
- Recalculate premium dynamically based on chosen plan and add-ons
- Enable "Proceed to Review" once selection is confirmed

---

### Scenario 4: Review & Payment Step

**Given** the user is on the Review & Payment step  
**When** the system displays a collapsible summary of trip, traveler, and plan details  
**And** the user selects a Payment Method:
- Credit/Debit Card
- Net Banking
- UPI
- Wallet
- Pay Later

**And** enters card details:
- Card Number (13-19 digits)
- Expiry Date (MM/YY format)
- CVV (3-4 digits)
- Cardholder Name

**And** checks the Declaration Checkbox confirming data accuracy

**Then** the system should:
- Validate declaration checkbox is checked before proceeding
- Validate card details format
- Initiate the selected payment flow
- Upon successful payment, call Policy Issuance API
- Display generated Policy Number and Download Link

**Validations:**
- Payment method: Required
- Card number: Required, 13-19 digits
- Expiry date: Required, MM/YY format
- CVV: Required, 3-4 digits
- Cardholder name: Required
- Declaration: Required (must be checked)
- Terms: Required (must be checked)

---

### Scenario 5: Confirmation Step

**Given** payment and policy issuance are successful  
**Then** the system should display:
- Policy Number: `TRV-{timestamp}-{random}`
- Download Policy PDF Button
- Email/SMS Confirmation Summary
- Trip Assistance Helpline Information: `+1-800-TRAVEL-HELP`

**And** store transaction and policy details in backend for audit and retrieval.

---

## Mock API Endpoints

### 1. Submit Application
```
POST /api/travel-insurance-quote-&-buy/submit
Response: {
  policyNumber: "TRV-1730745600-ABC123",
  policyId: "policy-1730745600",
  status: "issued",
  policyPdf: "https://example.com/policy-documents/TRV-policy.pdf",
  premiumAmount: 150.00,
  currency: "USD"
}
```

### 2. Get Coverage Plans
```
GET /api/travel-insurance/plans
Response: {
  data: [
    { id: "bronze", name: "Bronze", price: 50, coverage: {...} },
    { id: "silver", name: "Silver", price: 100, coverage: {...} },
    { id: "gold", name: "Gold", price: 150, coverage: {...} }
  ]
}
```

### 3. Calculate Premium
```
POST /api/travel-insurance/calculate-premium
Response: {
  basePremium: 100,
  addOns: 55,
  taxes: 15.50,
  totalPremium: 170.50
}
```

### 4. Issue Policy
```
POST /api/travel-insurance/issue-policy
Response: {
  policyNumber: "TRV-{timestamp}-{code}",
  policyPdf: "https://example.com/policies/TRV-policy.pdf",
  status: "active"
}
```

### 5. Process Payment
```
POST /api/travel-insurance/process-payment
Response: {
  transactionId: "TXN-{timestamp}",
  amount: 170.50,
  status: "completed"
}
```

---

## Generated Tests

The system generates 25+ comprehensive tests including:

### Business Logic Tests
- ✅ Travel duration validation (max 180 days for single trip)
- ✅ Traveler age validation (0-70 years)
- ✅ Passport format validation
- ✅ Premium calculation with add-ons
- ✅ Wizard step navigation logic

### Integration Tests
- ✅ Coverage plans API fetch
- ✅ Policy issuance flow
- ✅ Payment processing
- ✅ API success/error handling

### Field Validation Tests
- ✅ All 40+ form fields with their specific validations
- ✅ Required field checks
- ✅ Format validations (date, passport, card, etc.)
- ✅ Conditional field logic

---

## Form Fields Summary

### Total Fields: 40+

**Step 1 (5 fields):**
- trip_type, destination, travel_start_date, travel_end_date, num_travelers

**Step 2 (14 fields per traveler):**
- traveler_full_name, traveler_dob, traveler_gender, traveler_passport
- traveler_nationality, traveler_relationship, medical_conditions, medical_details
- address_line1, address_line2, city, state, country, zip

**Step 3 (5 fields):**
- coverage_plan, addon_adventure, addon_rental_car, addon_covid, addon_cancel_any

**Step 4 (7 fields):**
- payment_method, card_number, card_expiry, card_cvv
- cardholder_name, declaration, terms

**Step 5 (Display only):**
- Policy confirmation details

---

## Non-Functional Requirements

### Responsiveness
- All steps are fully responsive
- Optimized for desktop, tablet, and mobile viewports
- Touch-friendly controls for mobile users

### Performance
- Lightweight components
- Lazy loading of wizard steps
- Optimized re-renders

### Validation
- Real-time inline validation
- Clear, concise error messages
- Field-level and form-level validation
- Visual indicators for required fields

### User Experience
- Progress indicator showing current step (1/5, 2/5, etc.)
- Ability to navigate back to previous steps
- Form data persistence across steps
- Clear visual hierarchy

### Error Handling
- Graceful API failure handling
- User-friendly error messages
- Retry mechanisms for failed requests
- Fallback UI states

---

## Business Rules

1. **Trip Duration**: Single trips limited to 180 days maximum
2. **Age Limit**: Coverage available for travelers aged 0-70 years only
3. **Passport Validation**: Must match format `^[A-Z0-9]{6,9}$`
4. **Multiple Travelers**: Support for 1-10 travelers per policy
5. **Add-on Pricing**:
   - Adventure Sports: +$25
   - Rental Car Excess: +$15
   - COVID-19: +$20
   - Cancel Any Reason: +$40
6. **Payment Methods**: Card, Net Banking, UPI, Wallet, Pay Later
7. **Required Declarations**: User must confirm data accuracy and accept T&C

---

## Design System Integration

All components use CSS variables from `/styles/globals.css`:

### Colors Used
- **Primary**: `--primary` (Sapiens Navy Blue #001C56) - Main CTAs
- **Accent**: `--accent` (Cyan #0EA5E9) - Step indicators
- **Success**: `--success` (Green #22C55E) - Confirmation states
- **Warning**: `--warning` (Orange #FB923C) - Important notices
- **Purple**: `--purple` (Purple #A855F7) - Plan highlights

### Typography
- All text uses Inter font family
- Heading hierarchy: h1-h4 with defined sizes
- No Tailwind font classes (controlled by base CSS)

### Spacing & Layout
- Consistent spacing using CSS variables
- Responsive grid layouts
- Card-based design with elevation

---

## How to Restore Normal Parsing

To switch back from this mock scenario to normal AI parsing:

1. Open `/utils/aiParser.ts`
2. Replace the `parseUserStory` method with the original AI parsing logic
3. Remove or comment out the `getTravelInsuranceSchema()` method
4. The system will then generate forms based on actual user input

---

## Testing the Mock Scenario

### Try Different Prompts
Enter any of these prompts - they will all generate the same travel insurance journey:
- "Create a contact form"
- "Build a registration page"
- "I need a survey form"
- "Generate a booking system"
- **Result**: Travel Insurance Quote & Buy journey every time

### Navigate the Journey
1. Start on Landing Page
2. Select any input mode (Text/Speech/Upload)
3. Enter any text in the requirements field
4. Click Continue
5. Observe the 5-step travel insurance wizard

### Explore Features
- Test wizard navigation (back/forward)
- Try different coverage plans (Bronze/Silver/Gold)
- Select various add-ons
- Fill in payment details
- View the generated schema in the Schema tab
- Check the tests in the Tests tab
- Review mock API endpoints in the Deploy tab

---

## Version Info

- **Mock Version**: 1.0.0
- **Created**: November 4, 2025
- **Schema Fields**: 40+
- **API Endpoints**: 9
- **Generated Tests**: 25+
- **Wizard Steps**: 5

---

## Future Enhancements

Potential improvements to the travel insurance mock:

1. **Dynamic Traveler Fields**: Add/remove traveler forms dynamically
2. **Real-time Premium Display**: Show running total as user selects options
3. **Plan Comparison**: Side-by-side plan comparison tool
4. **Quote Saving**: Save and retrieve quotes
5. **Multi-currency Support**: Display premiums in different currencies
6. **Document Upload**: Allow uploading existing policy documents
7. **Family Plans**: Special pricing for family travelers
8. **Senior Citizen Plans**: Separate plans for 70+ travelers
9. **Group Bookings**: Support for 10+ travelers
10. **Integration with Payment Gateways**: Real payment processing

---

## Support

For questions about this mock scenario or to request modifications:
- Review the code in `/utils/aiParser.ts`
- Check API definitions in `/utils/mockApi.ts`
- See test generation in `/utils/testGenerator.ts`
- Refer to schema types in `/types/schema.ts`
