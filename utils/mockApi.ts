import { MockApiEndpoint, FormSchema } from '../types/schema';

// Mock API generator for form submissions and data
export class MockApiGenerator {
  static generateEndpoints(schema: FormSchema): MockApiEndpoint[] {
    const endpoints: MockApiEndpoint[] = [];
    const resourceName = schema.title.toLowerCase().replace(/\s+/g, '-');
    const isTravelInsurance = schema.title.toLowerCase().includes('travel insurance');

    // POST endpoint for form submission
    endpoints.push({
      method: 'POST',
      path: `/api/${resourceName}/submit`,
      responseBody: isTravelInsurance ? {
        success: true,
        message: 'Policy issued successfully!',
        data: {
          policyNumber: `TRV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          policyId: `policy-${Date.now()}`,
          submittedAt: new Date().toISOString(),
          status: 'issued',
          policyPdf: 'https://example.com/policy-documents/TRV-policy.pdf',
          premiumAmount: 150.00,
          currency: 'USD',
          coverageStartDate: new Date().toISOString().split('T')[0],
          assistanceHelpline: '+1-800-TRAVEL-HELP',
        },
      } : {
        success: true,
        message: schema.successMessage || 'Form submitted successfully',
        data: {
          id: `${resourceName}-${Date.now()}`,
          submittedAt: new Date().toISOString(),
          status: 'received',
        },
      },
      statusCode: 200,
      delay: 1000,
    });

    // GET endpoint for retrieving submission
    endpoints.push({
      method: 'GET',
      path: `/api/${resourceName}/:id`,
      responseBody: {
        success: true,
        data: this.generateMockData(schema),
      },
      statusCode: 200,
      delay: 500,
    });

    // GET endpoint for listing submissions
    endpoints.push({
      method: 'GET',
      path: `/api/${resourceName}`,
      responseBody: {
        success: true,
        data: Array.from({ length: 5 }, () => this.generateMockData(schema)),
        total: 5,
        page: 1,
        perPage: 10,
      },
      statusCode: 200,
      delay: 500,
    });

    // PUT endpoint for updating submission
    endpoints.push({
      method: 'PUT',
      path: `/api/${resourceName}/:id`,
      responseBody: {
        success: true,
        message: 'Submission updated successfully',
        data: this.generateMockData(schema),
      },
      statusCode: 200,
      delay: 800,
    });

    // DELETE endpoint
    endpoints.push({
      method: 'DELETE',
      path: `/api/${resourceName}/:id`,
      responseBody: {
        success: true,
        message: 'Submission deleted successfully',
      },
      statusCode: 200,
      delay: 600,
    });

    // Travel Insurance Specific Endpoints
    if (isTravelInsurance) {
      // Get coverage plans
      endpoints.push({
        method: 'GET',
        path: '/api/travel-insurance/plans',
        responseBody: {
          success: true,
          data: [
            {
              id: 'bronze',
              name: 'Bronze',
              price: 50,
              coverage: {
                medical: 50000,
                tripCancellation: 5000,
                baggage: 1000,
                emergencyEvacuation: 25000,
              },
              inclusions: [
                'Medical expenses up to $50,000',
                'Trip cancellation up to $5,000',
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
              price: 100,
              coverage: {
                medical: 100000,
                tripCancellation: 10000,
                baggage: 2500,
                emergencyEvacuation: 50000,
              },
              inclusions: [
                'Medical expenses up to $100,000',
                'Trip cancellation up to $10,000',
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
              price: 150,
              coverage: {
                medical: 250000,
                tripCancellation: 25000,
                baggage: 5000,
                emergencyEvacuation: 100000,
              },
              inclusions: [
                'Medical expenses up to $250,000',
                'Trip cancellation up to $25,000',
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
        },
        statusCode: 200,
        delay: 800,
      });

      // Calculate premium
      endpoints.push({
        method: 'POST',
        path: '/api/travel-insurance/calculate-premium',
        responseBody: {
          success: true,
          data: {
            basePremium: 100,
            addOns: 55,
            taxes: 15.50,
            totalPremium: 170.50,
            currency: 'USD',
            breakdown: {
              baseCoverage: 100,
              adventureSports: 25,
              rentalCar: 15,
              covid19: 20,
              taxes: 15.50,
            },
          },
        },
        statusCode: 200,
        delay: 600,
      });

      // Policy issuance
      endpoints.push({
        method: 'POST',
        path: '/api/travel-insurance/issue-policy',
        responseBody: {
          success: true,
          message: 'Policy issued successfully',
          data: {
            policyNumber: `TRV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            policyPdf: 'https://example.com/policies/TRV-policy.pdf',
            certificateNumber: `CERT-${Date.now()}`,
            issueDate: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
          },
        },
        statusCode: 200,
        delay: 2000,
      });

      // Payment processing
      endpoints.push({
        method: 'POST',
        path: '/api/travel-insurance/process-payment',
        responseBody: {
          success: true,
          message: 'Payment processed successfully',
          data: {
            transactionId: `TXN-${Date.now()}`,
            amount: 170.50,
            currency: 'USD',
            status: 'completed',
            paymentMethod: 'card',
            timestamp: new Date().toISOString(),
          },
        },
        statusCode: 200,
        delay: 1500,
      });
    }

    return endpoints;
  }

  private static generateMockData(schema: FormSchema): Record<string, any> {
    const data: Record<string, any> = {
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    schema.fields.forEach(field => {
      data[field.name] = this.generateFieldValue(field.type, field.name, field.options);
    });

    return data;
  }

  private static generateFieldValue(
    type: string,
    name: string,
    options?: Array<{ label: string; value: string }>
  ): any {
    switch (type) {
      case 'email':
        return `${name.toLowerCase()}@example.com`;
      case 'phone':
        return '+1-555-' + Math.floor(Math.random() * 9000 + 1000);
      case 'number':
        return Math.floor(Math.random() * 100);
      case 'date':
        return new Date().toISOString().split('T')[0];
      case 'select':
      case 'radio':
        return options && options.length > 0
          ? options[Math.floor(Math.random() * options.length)].value
          : 'option_1';
      case 'checkbox':
        return Math.random() > 0.5;
      case 'textarea':
        return `This is a sample ${name} with multiple lines of text content.`;
      case 'url':
        return `https://example.com/${name.toLowerCase()}`;
      case 'file':
        return {
          name: `${name}-file.pdf`,
          size: 1024 * Math.floor(Math.random() * 100),
          type: 'application/pdf',
          url: `https://example.com/files/${name}.pdf`,
        };
      default:
        return `Sample ${name}`;
    }
  }

  // Simulate API call
  static async simulateApiCall(
    endpoint: MockApiEndpoint,
    requestData?: any
  ): Promise<{ data: any; status: number }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, endpoint.delay || 500));

    // Simulate potential errors
    if (Math.random() < 0.05) {
      // 5% chance of error
      return {
        status: 500,
        data: {
          success: false,
          message: 'Internal server error',
        },
      };
    }

    // Return mock response
    let responseBody = { ...endpoint.responseBody };

    // If POST request, merge request data into response
    if (endpoint.method === 'POST' && requestData) {
      responseBody.data = {
        ...responseBody.data,
        ...requestData,
      };
    }

    return {
      status: endpoint.statusCode,
      data: responseBody,
    };
  }

  // Generate cURL examples
  static generateCurlExamples(endpoints: MockApiEndpoint[]): string[] {
    return endpoints.map(endpoint => {
      const baseUrl = 'https://api.example.com';
      let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;

      curl += ' \\\n  -H "Content-Type: application/json"';
      curl += ' \\\n  -H "Authorization: Bearer YOUR_API_KEY"';

      if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
        const sampleData = JSON.stringify({ sample: 'data' }, null, 2)
          .split('\n')
          .join('\n    ');
        curl += ` \\\n  -d '${sampleData}'`;
      }

      return curl;
    });
  }

  // Generate API documentation
  static generateApiDocs(endpoints: MockApiEndpoint[]): string {
    let docs = '# API Documentation\n\n';

    endpoints.forEach(endpoint => {
      docs += `## ${endpoint.method} ${endpoint.path}\n\n`;
      docs += `**Status Code:** ${endpoint.statusCode}\n\n`;
      docs += `**Response Delay:** ${endpoint.delay || 500}ms\n\n`;
      docs += '**Response Body:**\n```json\n';
      docs += JSON.stringify(endpoint.responseBody, null, 2);
      docs += '\n```\n\n';
    });

    return docs;
  }
}
