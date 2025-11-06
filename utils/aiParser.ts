import { FormSchema, FieldSchema, FieldType, ValidationRule } from '../types/schema';

// Mock AI Parser - Always returns Travel Insurance Journey
export class AIParser {
  static parseUserStory(input: string): FormSchema {
    // Always return the comprehensive travel insurance schema
    return this.getTravelInsuranceSchema();
  }

  private static getTravelInsuranceSchema(): FormSchema {
    const timestamp = new Date().toISOString();

    return {
      id: `travel-insurance-${Date.now()}`,
      title: 'Travel Insurance Quote & Buy',
      description: 'Complete your travel insurance purchase through our guided multi-step journey',
      layout: 'simple',
      fields: [
        // ==================== STEP 1: Trip Information ====================
        {
          id: 'step1-heading',
          name: 'trip_info_heading',
          label: 'Step 1: Trip Information',
          type: 'text',
          placeholder: '',
          validations: [],
          wizardStep: 0,
          description: 'Tell us about your travel plans',
        },
        {
          id: 'trip-type',
          name: 'trip_type',
          label: 'Trip Type',
          type: 'radio',
          placeholder: '',
          validations: [
            {
              type: 'required',
              message: 'Please select a trip type',
            },
          ],
          options: [
            { label: 'Single Trip', value: 'single' },
            { label: 'Annual Multi-trip', value: 'annual' },
          ],
          wizardStep: 0,
          description: 'Choose between a one-time trip or year-round coverage',
        },
        {
          id: 'destination',
          name: 'destination',
          label: 'Destination',
          type: 'select',
          placeholder: 'Select your destination',
          validations: [
            {
              type: 'required',
              message: 'Please select your destination',
            },
          ],
          options: [
            { label: 'Worldwide', value: 'worldwide' },
            { label: 'Europe', value: 'europe' },
            { label: 'Asia', value: 'asia' },
            { label: 'South East Asia', value: 'sea' },
            { label: 'Worldwide excl. USA, Canada, Caribbean, Mexico', value: 'worldwide_excl_americas' },
          ],
          wizardStep: 0,
        },
        {
          id: 'travel-start-date',
          name: 'travel_start_date',
          label: 'Travel Start Date',
          type: 'date',
          placeholder: '',
          validations: [
            {
              type: 'required',
              message: 'Travel start date is required',
            },
          ],
          wizardStep: 0,
        },
        {
          id: 'travel-end-date',
          name: 'travel_end_date',
          label: 'Travel End Date',
          type: 'date',
          placeholder: '',
          validations: [
            {
              type: 'required',
              message: 'Travel end date is required',
            },
          ],
          wizardStep: 0,
          description: 'Must be after start date. Maximum 180 days for single trip.',
        },
        {
          id: 'num-travelers',
          name: 'num_travelers',
          label: 'Number of Travelers',
          type: 'number',
          placeholder: 'Enter number of travelers',
          validations: [
            {
              type: 'required',
              message: 'Number of travelers is required',
            },
            {
              type: 'min',
              value: 1,
              message: 'At least 1 traveler required',
            },
            {
              type: 'max',
              value: 10,
              message: 'Maximum 10 travelers allowed',
            },
          ],
          wizardStep: 0,
        },

        // ==================== STEP 2: Traveler Information ====================
        {
          id: 'step2-heading',
          name: 'traveler_info_heading',
          label: 'Step 2: Traveler Information',
          type: 'text',
          placeholder: '',
          validations: [],
          wizardStep: 1,
          description: 'Provide details for all travelers (as per passport)',
        },
        {
          id: 'traveler-full-name',
          name: 'traveler_full_name',
          label: 'Full Name (as per passport)',
          type: 'text',
          placeholder: 'Enter full name',
          validations: [
            {
              type: 'required',
              message: 'Full name is required',
            },
            {
              type: 'minLength',
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          ],
          wizardStep: 1,
        },
        {
          id: 'traveler-dob',
          name: 'traveler_dob',
          label: 'Date of Birth',
          type: 'date',
          placeholder: '',
          validations: [
            {
              type: 'required',
              message: 'Date of birth is required',
            },
          ],
          wizardStep: 1,
          description: 'Age must be between 0-70 years for coverage',
        },
        {
          id: 'traveler-gender',
          name: 'traveler_gender',
          label: 'Gender',
          type: 'radio',
          placeholder: '',
          validations: [
            {
              type: 'required',
              message: 'Please select gender',
            },
          ],
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ],
          wizardStep: 1,
        },
        {
          id: 'traveler-passport',
          name: 'traveler_passport',
          label: 'Passport Number',
          type: 'text',
          placeholder: 'Enter passport number',
          validations: [
            {
              type: 'required',
              message: 'Passport number is required',
            },
            {
              type: 'pattern',
              value: '^[A-Z0-9]{6,9}$',
              message: 'Invalid passport format',
            },
          ],
          wizardStep: 1,
        },
        {
          id: 'traveler-nationality',
          name: 'traveler_nationality',
          label: 'Nationality',
          type: 'select',
          placeholder: 'Select nationality',
          validations: [
            {
              type: 'required',
              message: 'Nationality is required',
            },
          ],
          options: [
            { label: 'United States', value: 'us' },
            { label: 'United Kingdom', value: 'uk' },
            { label: 'Canada', value: 'ca' },
            { label: 'Australia', value: 'au' },
            { label: 'India', value: 'in' },
            { label: 'Singapore', value: 'sg' },
            { label: 'Other', value: 'other' },
          ],
          wizardStep: 1,
        },
        {
          id: 'traveler-relationship',
          name: 'traveler_relationship',
          label: 'Relationship to Proposer',
          type: 'select',
          placeholder: 'Select relationship',
          validations: [
            {
              type: 'required',
              message: 'Relationship is required',
            },
          ],
          options: [
            { label: 'Self', value: 'self' },
            { label: 'Spouse', value: 'spouse' },
            { label: 'Child', value: 'child' },
            { label: 'Parent', value: 'parent' },
            { label: 'Other', value: 'other' },
          ],
          wizardStep: 1,
        },
        {
          id: 'medical-conditions',
          name: 'medical_conditions',
          label: 'Pre-existing Medical Conditions',
          type: 'radio',
          placeholder: '',
          validations: [
            {
              type: 'required',
              message: 'Please indicate if you have pre-existing conditions',
            },
          ],
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ],
          wizardStep: 1,
        },
        {
          id: 'medical-details',
          name: 'medical_details',
          label: 'Medical Condition Details',
          type: 'textarea',
          placeholder: 'Please describe any pre-existing medical conditions',
          validations: [],
          wizardStep: 1,
          description: 'Required if you answered Yes above',
        },
        {
          id: 'address-line1',
          name: 'address_line1',
          label: 'Address Line 1',
          type: 'text',
          placeholder: 'Enter street address',
          validations: [
            {
              type: 'required',
              message: 'Address is required',
            },
          ],
          wizardStep: 1,
        },
        {
          id: 'address-line2',
          name: 'address_line2',
          label: 'Address Line 2',
          type: 'text',
          placeholder: 'Apartment, suite, etc. (optional)',
          validations: [],
          wizardStep: 1,
        },
        {
          id: 'city',
          name: 'city',
          label: 'City',
          type: 'text',
          placeholder: 'Enter city',
          validations: [
            {
              type: 'required',
              message: 'City is required',
            },
          ],
          wizardStep: 1,
        },
        {
          id: 'state',
          name: 'state',
          label: 'State / Province',
          type: 'text',
          placeholder: 'Enter state or province',
          validations: [
            {
              type: 'required',
              message: 'State/Province is required',
            },
          ],
          wizardStep: 1,
        },
        {
          id: 'country',
          name: 'country',
          label: 'Country',
          type: 'select',
          placeholder: 'Select country',
          validations: [
            {
              type: 'required',
              message: 'Country is required',
            },
          ],
          options: [
            { label: 'United States', value: 'us' },
            { label: 'United Kingdom', value: 'uk' },
            { label: 'Canada', value: 'ca' },
            { label: 'Australia', value: 'au' },
            { label: 'India', value: 'in' },
            { label: 'Singapore', value: 'sg' },
          ],
          wizardStep: 1,
        },
        {
          id: 'zip',
          name: 'zip',
          label: 'ZIP / Postal Code',
          type: 'text',
          placeholder: 'Enter ZIP code',
          validations: [
            {
              type: 'required',
              message: 'ZIP/Postal code is required',
            },
          ],
          wizardStep: 1,
        },

        // ==================== STEP 3: Coverage & Add-ons ====================
        {
          id: 'step3-heading',
          name: 'coverage_heading',
          label: 'Step 3: Coverage & Add-ons',
          type: 'text',
          placeholder: '',
          validations: [],
          wizardStep: 2,
          description: 'Select your coverage plan and optional add-ons',
        },
        {
          id: 'coverage-plan',
          name: 'coverage_plan',
          label: 'Coverage Plan',
          type: 'radio',
          placeholder: '',
          validations: [
            {
              type: 'required',
              message: 'Please select a coverage plan',
            },
          ],
          options: [
            { label: 'Bronze - Essential Coverage ($50/person)', value: 'bronze' },
            { label: 'Silver - Comprehensive Coverage ($100/person)', value: 'silver' },
            { label: 'Gold - Premium Coverage ($150/person)', value: 'gold' },
          ],
          wizardStep: 2,
          description: 'Each plan includes medical coverage, trip cancellation, and baggage protection',
        },
        {
          id: 'addon-adventure',
          name: 'addon_adventure',
          label: 'Adventure Sports Coverage',
          type: 'checkbox',
          placeholder: '',
          validations: [],
          wizardStep: 2,
          description: 'Add $25 - Covers skiing, scuba diving, and other adventure activities',
        },
        {
          id: 'addon-rental-car',
          name: 'addon_rental_car',
          label: 'Rental Car Excess Coverage',
          type: 'checkbox',
          placeholder: '',
          validations: [],
          wizardStep: 2,
          description: 'Add $15 - Covers rental car excess/deductible',
        },
        {
          id: 'addon-covid',
          name: 'addon_covid',
          label: 'COVID-19 Coverage',
          type: 'checkbox',
          placeholder: '',
          validations: [],
          wizardStep: 2,
          description: 'Add $20 - Medical and trip cancellation due to COVID-19',
        },
        {
          id: 'addon-cancel-any',
          name: 'addon_cancel_any',
          label: 'Cancel for Any Reason',
          type: 'checkbox',
          placeholder: '',
          validations: [],
          wizardStep: 2,
          description: 'Add $40 - Cancel your trip for any reason and get 75% refund',
        },

        // ==================== STEP 4: Review & Payment ====================
        {
          id: 'step4-heading',
          name: 'payment_heading',
          label: 'Step 4: Review & Payment',
          type: 'text',
          placeholder: '',
          validations: [],
          wizardStep: 3,
          description: 'Review your details and complete payment',
        },
        {
          id: 'payment-method',
          name: 'payment_method',
          label: 'Payment Method',
          type: 'radio',
          placeholder: '',
          validations: [
            {
              type: 'required',
              message: 'Please select a payment method',
            },
          ],
          options: [
            { label: 'Credit / Debit Card', value: 'card' },
            { label: 'Net Banking', value: 'netbanking' },
            { label: 'UPI', value: 'upi' },
            { label: 'Wallet', value: 'wallet' },
            { label: 'Pay Later', value: 'paylater' },
          ],
          wizardStep: 3,
        },
        {
          id: 'card-number',
          name: 'card_number',
          label: 'Card Number',
          type: 'text',
          placeholder: '1234 5678 9012 3456',
          validations: [
            {
              type: 'required',
              message: 'Card number is required',
            },
            {
              type: 'pattern',
              value: '^[0-9]{13,19}$',
              message: 'Invalid card number',
            },
          ],
          wizardStep: 3,
          description: 'Enter your 13-19 digit card number',
        },
        {
          id: 'card-expiry',
          name: 'card_expiry',
          label: 'Expiry Date (MM/YY)',
          type: 'text',
          placeholder: 'MM/YY',
          validations: [
            {
              type: 'required',
              message: 'Expiry date is required',
            },
            {
              type: 'pattern',
              value: '^(0[1-9]|1[0-2])\\/[0-9]{2}$',
              message: 'Invalid format. Use MM/YY',
            },
          ],
          wizardStep: 3,
        },
        {
          id: 'card-cvv',
          name: 'card_cvv',
          label: 'CVV',
          type: 'text',
          placeholder: '123',
          validations: [
            {
              type: 'required',
              message: 'CVV is required',
            },
            {
              type: 'pattern',
              value: '^[0-9]{3,4}$',
              message: 'Invalid CVV',
            },
          ],
          wizardStep: 3,
          description: '3 or 4 digit security code',
        },
        {
          id: 'cardholder-name',
          name: 'cardholder_name',
          label: 'Cardholder Name',
          type: 'text',
          placeholder: 'Name on card',
          validations: [
            {
              type: 'required',
              message: 'Cardholder name is required',
            },
          ],
          wizardStep: 3,
        },
        {
          id: 'declaration',
          name: 'declaration',
          label: 'I declare that all information provided is accurate and complete',
          type: 'checkbox',
          placeholder: '',
          validations: [
            {
              type: 'required',
              message: 'You must accept the declaration to proceed',
            },
          ],
          wizardStep: 3,
        },
        {
          id: 'terms',
          name: 'terms',
          label: 'I agree to the Terms & Conditions and Privacy Policy',
          type: 'checkbox',
          placeholder: '',
          validations: [
            {
              type: 'required',
              message: 'You must accept the terms to proceed',
            },
          ],
          wizardStep: 3,
        },

        // ==================== STEP 5: Confirmation ====================
        {
          id: 'step5-heading',
          name: 'confirmation_heading',
          label: 'Step 5: Confirmation',
          type: 'text',
          placeholder: '',
          validations: [],
          wizardStep: 4,
          description: 'Your policy has been issued successfully!',
        },
      ],
      submitUrl: '/api/travel-insurance/submit',
      successMessage: '🎉 Policy issued successfully! Check your email for policy documents.',
      errorMessage: 'Failed to process your insurance application. Please try again.',
      metadata: {
        createdAt: timestamp,
        userStory: 'Travel Insurance Quote & Buy Journey',
      },
    };
  }

  // Speech-to-text simulation - also returns travel insurance
  static processSpeechInput(audioData: string): string {
    return 'Create a travel insurance quote and buy journey with trip details, traveler information, and coverage selection';
  }
}
