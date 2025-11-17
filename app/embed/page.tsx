'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Plane, 
  Car, 
  Code2, 
  ExternalLink,
  Copy,
  Check,
  Frame
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

/**
 * Embed Routes Index
 * Lists all available embeddable forms with integration examples
 */
export default function EmbedIndexPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const embeds = [
    {
      id: 'travel',
      name: 'Travel Insurance Journey',
      description: '4-step travel insurance form with trip details, traveler info, coverage selection, and payment',
      icon: Plane,
      route: '/embed/travel',
      color: 'bg-blue-500/10 text-blue-500',
      steps: ['Trip Details', 'Traveler Information', 'Coverage Selection', 'Review & Payment']
    },
    {
      id: 'motor',
      name: 'Death Claim Journey',
      description: '4-step death claim form for Universal Life Product (North America Agent Portal)',
      icon: Car,
      route: '/embed/motor',
      color: 'bg-purple-500/10 text-purple-500',
      steps: ['Claimant Information', 'Deceased Information', 'Claim Details', 'Review & Submit']
    }
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getIframeCode = (route: string) => {
    return `<iframe 
  src="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}${route}" 
  width="100%" 
  height="800px"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>`;
  };

  const getReactCode = (embedId: string) => {
    const componentName = embedId === 'travel' ? 'TravelInsuranceForm' : 'DeathClaimForm';
    return `import ${componentName} from './components/${componentName}';

export default function MyPage() {
  const handleFormDataChange = (data) => {
    console.log('Form data:', data);
  };

  return (
    <${componentName}
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
}`;
  };

  const getNextJsCode = (route: string) => {
    return `'use client';

import { useEffect, useState } from 'react';

export default function EmbeddedForm() {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Listen for form updates from iframe
    const handleMessage = (event) => {
      if (event.data.type?.includes('FORM_UPDATE')) {
        setFormData(event.data.data);
        console.log('Form updated:', event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe 
      src="${route}" 
      width="100%" 
      height="800px"
      style={{ border: 'none' }}
    />
  );
}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-12" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <Frame className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-foreground">Embeddable Form Journeys</h1>
              <p className="text-muted-foreground">
                Production-ready forms for seamless integration
              </p>
            </div>
          </div>
        </div>

        {/* Embed Cards */}
        <div className="grid gap-8 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))' }}>
          {embeds.map((embed) => {
            const Icon = embed.icon;
            return (
              <Card key={embed.id} className="p-6 border-border bg-card">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${embed.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-card-foreground">{embed.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {embed.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {embed.steps.map((step, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {idx + 1}. {step}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={embed.route} target="_blank">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Form
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const code = getIframeCode(embed.route);
                      copyToClipboard(code, `iframe-${embed.id}`);
                    }}
                  >
                    {copiedCode === `iframe-${embed.id}` ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Integration Examples */}
        <Card className="p-6 border-border bg-card">
          <div className="flex items-center gap-2 mb-6">
            <Code2 className="w-5 h-5 text-primary" />
            <h2 className="text-card-foreground">Integration Examples</h2>
          </div>

          <Tabs defaultValue="iframe" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="iframe">HTML/iframe</TabsTrigger>
              <TabsTrigger value="react">React Component</TabsTrigger>
              <TabsTrigger value="nextjs">Next.js</TabsTrigger>
            </TabsList>

            {embeds.map((embed) => (
              <div key={embed.id}>
                <h3 className="mb-4 text-card-foreground">{embed.name}</h3>
                
                <TabsContent value="iframe" className="mt-0 mb-6">
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto text-sm">
                      <code className="text-foreground">{getIframeCode(embed.route)}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(getIframeCode(embed.route), `iframe-code-${embed.id}`)}
                    >
                      {copiedCode === `iframe-code-${embed.id}` ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="react" className="mt-0 mb-6">
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto text-sm">
                      <code className="text-foreground">{getReactCode(embed.id)}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(getReactCode(embed.id), `react-code-${embed.id}`)}
                    >
                      {copiedCode === `react-code-${embed.id}` ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="nextjs" className="mt-0 mb-6">
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto text-sm">
                      <code className="text-foreground">{getNextJsCode(embed.route)}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(getNextJsCode(embed.route), `nextjs-code-${embed.id}`)}
                    >
                      {copiedCode === `nextjs-code-${embed.id}` ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </div>
            ))}
          </Tabs>
        </Card>

        {/* Features */}
        <div className="mt-8 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}>
          <Card className="p-4 border-border bg-card">
            <h4 className="mb-2 text-card-foreground">Design System Integration</h4>
            <p className="text-sm text-muted-foreground">
              All forms use CSS variables from your design system for seamless theming
            </p>
          </Card>
          <Card className="p-4 border-border bg-card">
            <h4 className="mb-2 text-card-foreground">PostMessage API</h4>
            <p className="text-sm text-muted-foreground">
              Forms communicate with parent window via postMessage for data updates
            </p>
          </Card>
          <Card className="p-4 border-border bg-card">
            <h4 className="mb-2 text-card-foreground">Fully Responsive</h4>
            <p className="text-sm text-muted-foreground">
              Mobile-first design that works on all screen sizes and devices
            </p>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
