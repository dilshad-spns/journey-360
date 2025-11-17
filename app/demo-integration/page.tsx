'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Plane, 
  Car, 
  RefreshCw,
  Code2,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { Toaster } from '../../components/ui/sonner';
import { toast } from 'sonner';

/**
 * Demo Integration Page
 * Shows how Journey 360 forms can be embedded in a parent application
 * with real-time data communication via postMessage
 */
export default function DemoIntegrationPage() {
  const [selectedEmbed, setSelectedEmbed] = useState<'travel' | 'motor'>('travel');
  const [formData, setFormData] = useState<any>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const embeds = {
    travel: {
      name: 'Travel Insurance Journey',
      route: '/embed/travel',
      icon: Plane,
      color: 'text-blue-500',
      messageType: 'TRAVEL_FORM_UPDATE'
    },
    motor: {
      name: 'Death Claim Journey',
      route: '/embed/motor',
      icon: Car,
      color: 'text-purple-500',
      messageType: 'DEATH_CLAIM_FORM_UPDATE'
    }
  };

  const deviceSizes = {
    desktop: { width: '100%', height: '800px', label: 'Desktop', icon: Monitor },
    tablet: { width: '768px', height: '1024px', label: 'Tablet', icon: Tablet },
    mobile: { width: '375px', height: '667px', label: 'Mobile', icon: Smartphone }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const embed = embeds[selectedEmbed];
      
      if (event.data.type === embed.messageType) {
        setFormData(event.data.data);
        setLastUpdate(new Date().toLocaleTimeString());
        toast.success('Form data updated', {
          description: `Received update from ${embed.name}`
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedEmbed]);

  const currentEmbed = embeds[selectedEmbed];
  const CurrentIcon = currentEmbed.icon;
  const currentDevice = deviceSizes[deviceView];
  const DeviceIcon = currentDevice.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-8" style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-foreground mb-2">Integration Demo</h1>
              <p className="text-muted-foreground">
                Live preview of embeddable Journey 360 forms
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Live Preview
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Form Selector */}
            <Card className="flex-1 min-w-[300px] p-4 border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Select Form</span>
              </div>
              <div className="flex gap-2">
                {(Object.keys(embeds) as Array<keyof typeof embeds>).map((key) => {
                  const embed = embeds[key];
                  const Icon = embed.icon;
                  return (
                    <Button
                      key={key}
                      variant={selectedEmbed === key ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setSelectedEmbed(key)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {key === 'travel' ? 'Travel' : 'Motor'}
                    </Button>
                  );
                })}
              </div>
            </Card>

            {/* Device Selector */}
            <Card className="flex-1 min-w-[300px] p-4 border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Device View</span>
              </div>
              <div className="flex gap-2">
                {(Object.keys(deviceSizes) as Array<keyof typeof deviceSizes>).map((key) => {
                  const device = deviceSizes[key];
                  const Icon = device.icon;
                  return (
                    <Button
                      key={key}
                      variant={deviceView === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDeviceView(key)}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {device.label}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Preview Area */}
          <div>
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CurrentIcon className={`w-5 h-5 ${currentEmbed.color}`} />
                  <h2 className="text-card-foreground">{currentEmbed.name}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const iframe = document.getElementById('embed-iframe') as HTMLIFrameElement;
                    if (iframe) {
                      iframe.src = iframe.src;
                    }
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload
                </Button>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center overflow-auto">
                <div
                  className="bg-background rounded-lg shadow-xl overflow-hidden transition-all duration-300"
                  style={{
                    width: currentDevice.width,
                    height: currentDevice.height,
                    maxWidth: '100%'
                  }}
                >
                  <iframe
                    id="embed-iframe"
                    src={currentEmbed.route}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title={`${currentEmbed.name} Embed`}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Data Monitor */}
          <div className="flex flex-col gap-4">
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="text-card-foreground">Live Data Stream</h3>
              </div>

              {lastUpdate && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Last update: <span className="text-foreground">{lastUpdate}</span>
                  </p>
                </div>
              )}

              <div className="bg-muted/30 rounded-lg p-4 max-h-[600px] overflow-auto">
                {formData ? (
                  <pre className="text-xs text-foreground">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-2">
                      Waiting for form interactions...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Start filling the form to see live data
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 border-border bg-card">
              <h3 className="mb-4 text-card-foreground">Integration Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">URL:</span>
                  <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                    {currentEmbed.route}
                  </code>
                </div>
                <div>
                  <span className="text-muted-foreground">Message Type:</span>
                  <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                    {currentEmbed.messageType}
                  </code>
                </div>
                <div>
                  <span className="text-muted-foreground">Device:</span>
                  <Badge variant="secondary" className="ml-2">
                    {currentDevice.width} × {currentDevice.height}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Usage Instructions */}
        <Card className="mt-8 p-6 border-border bg-card">
          <h3 className="mb-4 text-card-foreground">How It Works</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                  1
                </div>
                <span className="text-sm text-foreground">Embed the Form</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Use an iframe or import the component directly into your React/Next.js app
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                  2
                </div>
                <span className="text-sm text-foreground">Listen for Updates</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Forms send postMessage events to parent window with real-time data
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                  3
                </div>
                <span className="text-sm text-foreground">Process Data</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Receive and process form data in your application for submission
              </p>
            </div>
          </div>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
