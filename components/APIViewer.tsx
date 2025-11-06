import React, { useState } from 'react';
import { Globe, Copy, Check, Download, Code2, PlayCircle, FileJson } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { MockApiEndpoint } from '../types/schema';
import { copyToClipboard } from '../utils/clipboard';
import { toast } from 'sonner';

interface APIViewerProps {
  mockApi: MockApiEndpoint[];
}

export function APIViewer({ mockApi }: APIViewerProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!mockApi || mockApi.length === 0) {
    return (
      <Card className="p-12 bg-card border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="text-center text-muted-foreground">
          <div className="h-16 w-16 mx-auto mb-4 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2">No APIs generated yet</h3>
          <p>Generate a form schema to see auto-generated mock APIs</p>
        </div>
      </Card>
    );
  }

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
      toast.success('Copied to clipboard');
    } else {
      toast.error('Failed to copy');
    }
  };

  const handleDownloadAll = () => {
    const content = mockApi.map(endpoint => {
      return `// ${endpoint.method} ${endpoint.path}
// Status: ${endpoint.statusCode}
// Delay: ${endpoint.delay || 500}ms

Request Schema:
${JSON.stringify(generateRequestSchema(endpoint), null, 2)}

Response Schema:
${JSON.stringify(generateResponseSchema(endpoint), null, 2)}

Example Response:
${JSON.stringify(endpoint.responseBody, null, 2)}

---`;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mock-apis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('APIs downloaded');
  };

  const generateRequestSchema = (endpoint: MockApiEndpoint): any => {
    if (endpoint.method === 'GET') {
      return {
        type: 'object',
        properties: {
          query: {
            type: 'object',
            description: 'Optional query parameters',
          },
        },
      };
    }

    if (endpoint.path.includes('destination')) {
      return {
        type: 'object',
        properties: {},
        description: 'No request body required',
      };
    }

    if (endpoint.path.includes('coverage')) {
      return {
        type: 'object',
        properties: {
          destination: { type: 'string', description: 'Destination country code' },
          startDate: { type: 'string', format: 'date', description: 'Trip start date' },
          endDate: { type: 'string', format: 'date', description: 'Trip end date' },
          travelers: { type: 'number', description: 'Number of travelers' },
        },
        required: ['destination', 'startDate', 'endDate', 'travelers'],
      };
    }

    if (endpoint.path.includes('submit') || endpoint.path.includes('Journey')) {
      return {
        type: 'object',
        properties: {
          destinationId: { type: 'string', description: 'Selected destination ID' },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          travelers: { type: 'number' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          coveragePlanId: { type: 'string', description: 'Selected coverage plan ID' },
          addOns: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Selected add-on coverage IDs',
          },
          paymentMethod: { type: 'string', enum: ['card', 'paypal', 'bank'] },
          cardNumber: { type: 'string' },
          cardExpiry: { type: 'string' },
          cardCvv: { type: 'string' },
        },
        required: ['destinationId', 'startDate', 'endDate', 'firstName', 'lastName', 'email', 'coveragePlanId', 'paymentMethod'],
      };
    }

    return {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Request payload data',
        },
      },
    };
  };

  const generateResponseSchema = (endpoint: MockApiEndpoint): any => {
    if (endpoint.path.includes('destination')) {
      return {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                code: { type: 'string' },
                region: { type: 'string' },
              },
            },
          },
        },
      };
    }

    if (endpoint.path.includes('coverage') || endpoint.path.includes('plans')) {
      return {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                price: { type: 'number' },
                coverage: {
                  type: 'object',
                  properties: {
                    medical: { type: 'number' },
                    tripCancellation: { type: 'number' },
                    baggage: { type: 'number' },
                    emergencyEvacuation: { type: 'number' },
                  },
                },
                inclusions: { type: 'array', items: { type: 'string' } },
                exclusions: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      };
    }

    if (endpoint.path.includes('submit') || endpoint.path.includes('Journey')) {
      return {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              policyNumber: { type: 'string' },
              policyId: { type: 'string' },
              submittedAt: { type: 'string', format: 'date-time' },
              status: { type: 'string', enum: ['issued', 'pending', 'rejected'] },
              policyPdf: { type: 'string', format: 'uri' },
              premiumAmount: { type: 'number' },
              currency: { type: 'string' },
              coverageStartDate: { type: 'string', format: 'date' },
              assistanceHelpline: { type: 'string' },
            },
          },
        },
      };
    }

    return {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'object' },
        message: { type: 'string' },
      },
    };
  };

  const generateExampleRequest = (endpoint: MockApiEndpoint): any => {
    if (endpoint.method === 'GET') {
      return null;
    }

    if (endpoint.path.includes('coverage')) {
      return {
        destination: 'FR',
        startDate: '2025-12-01',
        endDate: '2025-12-15',
        travelers: 2,
      };
    }

    if (endpoint.path.includes('submit') || endpoint.path.includes('Journey')) {
      return {
        destinationId: 'france',
        startDate: '2025-12-01',
        endDate: '2025-12-15',
        travelers: 2,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        coveragePlanId: 'silver',
        addOns: ['adventure-sports', 'covid-19'],
        paymentMethod: 'card',
        cardNumber: '4111111111111111',
        cardExpiry: '12/27',
        cardCvv: '123',
      };
    }

    return { data: 'example' };
  };

  const generateCurlExample = (endpoint: MockApiEndpoint): string => {
    const baseUrl = 'https://api.example.com';
    let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;
    curl += ' \\\n  -H "Content-Type: application/json"';
    curl += ' \\\n  -H "Authorization: Bearer YOUR_API_KEY"';

    if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
      const exampleRequest = generateExampleRequest(endpoint);
      if (exampleRequest) {
        curl += ` \\\n  -d '${JSON.stringify(exampleRequest, null, 2)}'`;
      }
    }

    return curl;
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'POST': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'PUT': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'DELETE': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-secondary text-foreground';
    }
  };

  // Classify APIs as inbound or outbound
  const inboundApis = mockApi.filter(api => api.method === 'GET');
  const outboundApis = mockApi.filter(api => api.method === 'POST' || api.method === 'PUT');

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-foreground">Mock APIs</h3>
        <Button
          onClick={handleDownloadAll}
          variant="outline"
          size="sm"
          className="rounded-[var(--radius-button)] transition-all"
        >
          <Download className="h-3 w-3 mr-1" />
          Download All
        </Button>
      </div>

      <Card className="p-4 bg-card border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="space-y-3">
          <p className="text-muted-foreground">
            Auto-generated mock APIs for testing and development. Replace with real endpoints when deploying.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-primary/5 border-primary/20">
              {mockApi.length} Total APIs
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-600">
              {inboundApis.length} Inbound
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600">
              {outboundApis.length} Outbound
            </Badge>
          </div>
          <div className="pt-2 space-y-1 border-t border-border">
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">Inbound:</span>
              <span className="text-foreground">APIs to GET data from external systems</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">Outbound:</span>
              <span className="text-foreground">APIs to SEND data to external systems</span>
            </div>
          </div>
        </div>
      </Card>

      <Accordion type="single" collapsible className="space-y-2 w-full">
        {mockApi.map((endpoint, index) => {
          const requestSchema = generateRequestSchema(endpoint);
          const responseSchema = generateResponseSchema(endpoint);
          const exampleRequest = generateExampleRequest(endpoint);
          const curlExample = generateCurlExample(endpoint);
          const endpointId = `${endpoint.method}-${endpoint.path}-${index}`;
          const isInbound = endpoint.method === 'GET';
          const apiType = isInbound ? 'Inbound' : 'Outbound';
          const apiTypeColor = isInbound ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20';

          return (
            <AccordionItem 
              key={endpointId} 
              value={endpointId}
              className="border border-border rounded-[var(--radius-card)] px-4 bg-card"
              style={{ boxShadow: 'var(--elevation-sm)' }}
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={`${apiTypeColor} px-2.5 py-0.5 rounded-[var(--radius)] border`}>
                      {apiType}
                    </Badge>
                    <Badge className={`${getMethodColor(endpoint.method)} px-2.5 py-0.5 rounded-[var(--radius)] border`}>
                      {endpoint.method}
                    </Badge>
                    <Badge variant="outline" className="flex-shrink-0">
                      {endpoint.statusCode}
                    </Badge>
                  </div>
                  <code className="text-foreground break-all text-left">{endpoint.path}</code>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="bg-secondary/50 rounded-[var(--radius)] p-1 mb-4">
                    <TabsTrigger value="overview" className="rounded-[var(--radius)] data-[state=active]:bg-card">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="request" className="rounded-[var(--radius)] data-[state=active]:bg-card">
                      Request
                    </TabsTrigger>
                    <TabsTrigger value="response" className="rounded-[var(--radius)] data-[state=active]:bg-card">
                      Response
                    </TabsTrigger>
                    <TabsTrigger value="curl" className="rounded-[var(--radius)] data-[state=active]:bg-card">
                      cURL
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-secondary/30 rounded-[var(--radius-card)] border border-border">
                        <p className="text-muted-foreground mb-1">API Type</p>
                        <Badge className={apiTypeColor}>
                          {apiType}
                        </Badge>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-[var(--radius-card)] border border-border">
                        <p className="text-muted-foreground mb-1">Method</p>
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-[var(--radius-card)] border border-border">
                        <p className="text-muted-foreground mb-1">Status Code</p>
                        <p className="text-foreground">{endpoint.statusCode}</p>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-[var(--radius-card)] border border-border">
                        <p className="text-muted-foreground mb-1">Delay</p>
                        <p className="text-foreground">{endpoint.delay || 500}ms</p>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-[var(--radius-card)] border border-border col-span-2">
                        <p className="text-muted-foreground mb-1">Endpoint</p>
                        <code className="text-foreground break-all">{endpoint.path}</code>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-[var(--radius-card)] border border-border col-span-2">
                        <p className="text-muted-foreground mb-1">Description</p>
                        <p className="text-foreground">
                          {isInbound 
                            ? 'Fetches data from external system for use in the journey form' 
                            : 'Sends collected form data to external system for processing'}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="request" className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-foreground">Request Schema (JSON)</label>
                      <Button
                        onClick={() => handleCopy(JSON.stringify(requestSchema, null, 2), `${endpointId}-req-schema`)}
                        variant="ghost"
                        size="sm"
                        className="h-7 rounded-[var(--radius)]"
                      >
                        {copied === `${endpointId}-req-schema` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <Card className="bg-background border-border rounded-[var(--radius-card)] overflow-hidden">
                      <pre className="p-4 overflow-x-auto overflow-y-auto max-w-full max-h-96 text-sm whitespace-pre">
                        <code className="text-foreground block whitespace-pre-wrap break-words">{JSON.stringify(requestSchema, null, 2)}</code>
                      </pre>
                    </Card>

                    {exampleRequest && (
                      <>
                        <div className="flex items-center justify-between mb-2 mt-4">
                          <label className="text-foreground">Example Request</label>
                          <Button
                            onClick={() => handleCopy(JSON.stringify(exampleRequest, null, 2), `${endpointId}-req-example`)}
                            variant="ghost"
                            size="sm"
                            className="h-7 rounded-[var(--radius)]"
                          >
                            {copied === `${endpointId}-req-example` ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <Card className="bg-background border-border rounded-[var(--radius-card)] overflow-hidden">
                          <pre className="p-4 overflow-x-auto overflow-y-auto max-w-full max-h-96 text-sm whitespace-pre">
                            <code className="text-foreground block whitespace-pre-wrap break-words">{JSON.stringify(exampleRequest, null, 2)}</code>
                          </pre>
                        </Card>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="response" className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-foreground">Response Schema (JSON)</label>
                      <Button
                        onClick={() => handleCopy(JSON.stringify(responseSchema, null, 2), `${endpointId}-res-schema`)}
                        variant="ghost"
                        size="sm"
                        className="h-7 rounded-[var(--radius)]"
                      >
                        {copied === `${endpointId}-res-schema` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <Card className="bg-background border-border rounded-[var(--radius-card)] overflow-hidden">
                      <pre className="p-4 overflow-x-auto overflow-y-auto max-w-full max-h-96 text-sm whitespace-pre">
                        <code className="text-foreground block whitespace-pre-wrap break-words">{JSON.stringify(responseSchema, null, 2)}</code>
                      </pre>
                    </Card>

                    <div className="flex items-center justify-between mb-2 mt-4">
                      <label className="text-foreground">Example Response</label>
                      <Button
                        onClick={() => handleCopy(JSON.stringify(endpoint.responseBody, null, 2), `${endpointId}-res-example`)}
                        variant="ghost"
                        size="sm"
                        className="h-7 rounded-[var(--radius)]"
                      >
                        {copied === `${endpointId}-res-example` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <Card className="bg-background border-border rounded-[var(--radius-card)] overflow-hidden">
                      <pre className="p-4 overflow-x-auto overflow-y-auto max-w-full max-h-96 text-sm whitespace-pre">
                        <code className="text-foreground block whitespace-pre-wrap break-words">{JSON.stringify(endpoint.responseBody, null, 2)}</code>
                      </pre>
                    </Card>
                  </TabsContent>

                  <TabsContent value="curl" className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-foreground">cURL Command</label>
                      <Button
                        onClick={() => handleCopy(curlExample, `${endpointId}-curl`)}
                        variant="ghost"
                        size="sm"
                        className="h-7 rounded-[var(--radius)]"
                      >
                        {copied === `${endpointId}-curl` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <Card className="bg-background border-border rounded-[var(--radius-card)] overflow-hidden">
                      <pre className="p-4 overflow-x-auto overflow-y-auto max-w-full max-h-96 text-sm">
                        <code className="text-foreground block whitespace-pre-wrap break-all">{curlExample}</code>
                      </pre>
                    </Card>
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
