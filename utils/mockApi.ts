import { MockApiEndpoint, FormSchema } from '../types/schema';

// Mock API generator for form submissions and data
export class MockApiGenerator {
  static generateEndpoints(schema: FormSchema): MockApiEndpoint[] {
    const endpoints: MockApiEndpoint[] = [];
    const isTravelInsurance = schema.title.toLowerCase().includes('travel insurance');

    // Only generate the 3 required endpoints for travel insurance
    if (isTravelInsurance) {
      // INBOUND API 1: GET /api/v1/destination - returns destinations for dropdown
      endpoints.push({
        method: 'GET',
        path: '/api/v1/destination',
        responseBody: {
          success: true,
          data: [
            { id: 'france', name: 'France', code: 'FR', region: 'Europe' },
            { id: 'italy', name: 'Italy', code: 'IT', region: 'Europe' },
            { id: 'spain', name: 'Spain', code: 'ES', region: 'Europe' },
            { id: 'japan', name: 'Japan', code: 'JP', region: 'Asia' },
            { id: 'australia', name: 'Australia', code: 'AU', region: 'Oceania' },
            { id: 'canada', name: 'Canada', code: 'CA', region: 'North America' },
            { id: 'brazil', name: 'Brazil', code: 'BR', region: 'South America' },
            { id: 'thailand', name: 'Thailand', code: 'TH', region: 'Asia' },
            { id: 'germany', name: 'Germany', code: 'DE', region: 'Europe' },
            { id: 'uk', name: 'United Kingdom', code: 'GB', region: 'Europe' },
          ],
        },
        statusCode: 200,
        delay: 800,
      });

      // INBOUND API 2: GET /api/v1/coverages - returns coverage options based on trip info
      endpoints.push({
        method: 'GET',
        path: '/api/v1/coverages',
        responseBody: {
          success: true,
          data: {
            plans: [
              {
                id: 'bronze',
                name: 'Bronze',
                description: 'Essential coverage for budget-conscious travelers',
                price: 49.99,
                coverage: {
                  medical: 50000,
                  tripCancellation: 2500,
                  baggage: 1000,
                  emergencyEvacuation: 25000,
                },
                inclusions: [
                  'Medical expenses up to $50,000',
                  'Trip cancellation up to $2,500',
                  'Lost baggage coverage up to $1,000',
                  'Emergency evacuation',
                  '24/7 travel assistance',
                ],
                exclusions: [
                  'Pre-existing conditions (unless declared)',
                  'Adventure sports',
                  'Travel to war zones',
                ],
              },
              {
                id: 'silver',
                name: 'Silver',
                description: 'Comprehensive protection for most travelers',
                price: 99.99,
                coverage: {
                  medical: 100000,
                  tripCancellation: 5000,
                  baggage: 2500,
                  emergencyEvacuation: 50000,
                },
                inclusions: [
                  'Medical expenses up to $100,000',
                  'Trip cancellation up to $5,000',
                  'Lost baggage coverage up to $2,500',
                  'Emergency evacuation',
                  '24/7 travel assistance',
                  'Trip delay compensation',
                  'Rental car excess',
                ],
                exclusions: [
                  'Pre-existing conditions (unless declared)',
                  'Extreme adventure sports',
                ],
              },
              {
                id: 'gold',
                name: 'Gold',
                description: 'Premium coverage with maximum protection',
                price: 149.99,
                coverage: {
                  medical: 250000,
                  tripCancellation: 10000,
                  baggage: 5000,
                  emergencyEvacuation: 100000,
                },
                inclusions: [
                  'Medical expenses up to $250,000',
                  'Trip cancellation up to $10,000',
                  'Lost baggage coverage up to $5,000',
                  'Emergency evacuation',
                  '24/7 premium travel assistance',
                  'Trip delay compensation',
                  'Rental car excess',
                  'Adventure sports coverage',
                  'Cancel for any reason (75% refund)',
                ],
                exclusions: [
                  'Travel to sanctioned countries',
                ],
              },
            ],
            addOns: [
              {
                id: 'adventure-sports',
                name: 'Adventure Sports Coverage',
                description: 'Coverage for skiing, scuba diving, hiking, and other adventure activities',
                price: 29.99,
              },
              {
                id: 'rental-car',
                name: 'Rental Car Excess Coverage',
                description: 'Covers rental car excess/deductible in case of damage or theft',
                price: 19.99,
              },
              {
                id: 'covid-19',
                name: 'COVID-19 Coverage',
                description: 'Medical expenses and trip cancellation related to COVID-19',
                price: 24.99,
              },
              {
                id: 'cancel-any-reason',
                name: 'Cancel For Any Reason',
                description: 'Cancel your trip for any reason and get up to 75% refund',
                price: 39.99,
              },
            ],
          },
        },
        statusCode: 200,
        delay: 1000,
      });

      // OUTBOUND API 3: POST /api/v1/submitJourney - submits complete journey
      endpoints.push({
        method: 'POST',
        path: '/api/v1/submitJourney',
        responseBody: {
          success: true,
          message: 'Journey submitted successfully! Your travel insurance policy has been issued.',
          data: {
            journeyId: `JOURNEY-${Date.now()}`,
            policyNumber: `TRV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            policyId: `policy-${Date.now()}`,
            submittedAt: new Date().toISOString(),
            status: 'issued',
            policyPdf: 'https://example.com/policy-documents/TRV-policy.pdf',
            premiumAmount: 149.99,
            currency: 'USD',
            coverageStartDate: new Date().toISOString().split('T')[0],
            coverageEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assistanceHelpline: '+1-800-TRAVEL-HELP',
            emergencyContact: 'emergency@travelinsurance.com',
            claimsPortal: 'https://claims.travelinsurance.com',
          },
        },
        statusCode: 200,
        delay: 1500,
      });
    }

    return endpoints;
  }
}
