import React, { useState } from 'react';
import { Rocket, Globe, CheckCircle2, Loader2, ExternalLink, Copy, Download, Server, RotateCcw, Code } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Alert } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DeploymentConfig, MockApiEndpoint } from '../types/schema';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/clipboard';
import { generatePublishConfig, downloadHTMLBundle, PublishConfig } from '../utils/htmlGenerator';

interface DeploymentPanelProps {
  schema: any;
  mockApi: MockApiEndpoint[];
}

export function DeploymentPanel({ schema, mockApi }: DeploymentPanelProps) {
  const [deployment, setDeployment] = useState<DeploymentConfig>({
    environment: 'development',
    status: 'draft',
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [publishConfig, setPublishConfig] = useState<PublishConfig | null>(null);

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployProgress(0);
    setDeployment(prev => ({ ...prev, status: 'building' }));

    const steps = [
      { label: 'Validating schema...', duration: 800 },
      { label: 'Generating HTML bundle...', duration: 1200 },
      { label: 'Creating embed script...', duration: 1000 },
      { label: 'Running tests...', duration: 1500 },
      { label: 'Publishing to CDN...', duration: 1000 },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setDeployProgress(((i + 1) / steps.length) * 100);
    }

    // Generate publish configuration
    const config = generatePublishConfig(schema);
    setPublishConfig(config);

    const mockUrl = config.scriptUrl;
    setDeploymentUrl(mockUrl);
    setDeployment({
      ...deployment,
      status: 'deployed',
      url: mockUrl,
      timestamp: new Date().toISOString(),
    });
    setIsDeploying(false);
    toast.success('Form published successfully!');
  };

  const copyUrl = async () => {
    if (deploymentUrl) {
      const success = await copyToClipboard(deploymentUrl);
      if (success) {
        toast.success('URL copied to clipboard');
      } else {
        toast.error('Failed to copy URL');
      }
    }
  };

  const downloadBundle = () => {
    if (publishConfig) {
      // Download HTML bundle
      downloadHTMLBundle(publishConfig.htmlBundle, `journey360-form-${publishConfig.uuid}.html`);
      toast.success('HTML bundle downloaded');
    } else {
      // Fallback: download JSON bundle
      const bundle = {
        schema,
        mockApi,
        deployment,
        generatedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${schema.id}-deployment-bundle.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Deployment bundle downloaded');
    }
  };

  const copyEmbedCode = async () => {
    if (publishConfig) {
      const success = await copyToClipboard(publishConfig.embedCode);
      if (success) {
        toast.success('Embed code copied to clipboard');
      } else {
        toast.error('Failed to copy embed code');
      }
    }
  };

  if (!schema) {
    return (
      <Card className="p-8 bg-card border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="text-center text-muted-foreground">
          <div className="h-12 w-12 mx-auto mb-3 rounded-[var(--radius-card)] bg-warning flex items-center justify-center">
            <Rocket className="h-6 w-6 text-warning-foreground" />
          </div>
          <h3 className="mb-1.5" style={{ fontSize: '13px' }}>No form to publish</h3>
          <p style={{ fontSize: '12px' }}>Generate a schema first to publish your form</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 style={{ fontSize: '13px' }}>Publish</h3>
      </div>

      <Card className="p-3 bg-card border border-border rounded-[var(--radius)] w-full max-w-full overflow-hidden" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="space-y-3">
          <div className="space-y-2.5">
            <div className="space-y-2">
              <label style={{ fontSize: '11px' }}>Environment</label>
              <Select
                value={deployment.environment}
                onValueChange={(value: any) =>
                  setDeployment({ ...deployment, environment: value })
                }
                disabled={isDeploying || deployment.status === 'deployed'}
              >
                <SelectTrigger className="bg-input-background border-border rounded-[var(--radius-input)] focus:ring-2 focus:ring-ring/20 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-[var(--radius)]">
                  <SelectItem value="development" className="rounded-[var(--radius)]">
                    Development
                  </SelectItem>
                  <SelectItem value="staging" className="rounded-[var(--radius)]">
                    Staging
                  </SelectItem>
                  <SelectItem value="production" className="rounded-[var(--radius)]">
                    Production
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-foreground" style={{ fontSize: '11px' }}>Status:</label>
              <Badge
                className={`rounded-[var(--radius-pill)] px-4 py-2 ${
                  deployment.status === 'deployed'
                    ? 'bg-primary text-primary-foreground'
                    : deployment.status === 'building'
                    ? 'bg-primary/70 text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
                style={{ fontSize: '10px' }}
              >
                {deployment.status === 'building' && (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                )}
                {deployment.status === 'deployed' && (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                )}
                {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
              </Badge>
            </div>
          </div>

          {isDeploying && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Publishing...</span>
                <span className="text-muted-foreground">{Math.round(deployProgress)}%</span>
              </div>
              <Progress value={deployProgress} className="h-2 bg-muted rounded-[var(--radius-pill)]" />
            </div>
          )}

          {deployment.status === 'deployed' && publishConfig && (
            <Alert className="bg-primary/10 border-2 border-primary rounded-[var(--radius-card)]">
              <Globe className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-primary">Published Successfully!</h4>
                
                {/* Script URL */}
                <div className="mt-3">
                  <label className="text-muted-foreground block mb-2">Script URL:</label>
                  <div className="flex items-start gap-2">
                    <code className="px-3 py-2 bg-background rounded-[var(--radius)] flex-1 min-w-0 break-all" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                      {publishConfig.scriptUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyUrl}
                      className="rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all flex-shrink-0"
                      aria-label="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Embed Code */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <label className="text-muted-foreground">Embed Code:</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyEmbedCode}
                      className="rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all flex-shrink-0"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="p-3 bg-background rounded-[var(--radius)] border border-border overflow-hidden" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%' }}>
                    <code className="text-foreground block" style={{ fontSize: '0.75rem', wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                      {publishConfig.embedCode}
                    </code>
                  </pre>
                </div>

                {/* UUID */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-muted-foreground">
                  <span className="break-all">UUID: {publishConfig.uuid}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="break-all">Published at {new Date(publishConfig.publishedAt).toLocaleString()}</span>
                </div>
              </div>
            </Alert>
          )}

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button
              onClick={handleDeploy}
              disabled={isDeploying || deployment.status === 'deployed'}
              size="sm"
              className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90 transition-all flex-1"
            >
              <Rocket className="h-3 w-3 mr-1" />
              {isDeploying ? 'Publishing...' : deployment.status === 'deployed' ? 'Published' : 'Publish'}
            </Button>
            <Button
              onClick={downloadBundle}
              variant="outline"
              size="sm"
              className="border border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
            >
              <Download className="h-3 w-3" />
            </Button>
            {deployment.status === 'deployed' && (
              <Button
                onClick={() => {
                  setDeployment({ ...deployment, status: 'draft' });
                  setDeploymentUrl(null);
                  setPublishConfig(null);
                }}
                variant="outline"
                size="sm"
                className="border border-border rounded-[var(--radius-button)] hover:border-destructive hover:bg-destructive/5 hover:text-destructive transition-all"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* React Embed Example */}
      {publishConfig && (
        <Card className="p-4 bg-card border border-border rounded-[var(--radius)] w-full max-w-full overflow-hidden" style={{ boxShadow: 'var(--elevation-sm)' }}>
          <div className="space-y-4 w-full max-w-full overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[var(--radius)] bg-accent flex items-center justify-center">
                <Code className="h-4 w-4 text-accent-foreground" />
              </div>
              <h4 className="text-foreground">Embed in React App</h4>
            </div>

            <div className="space-y-3">
              <p className="text-muted-foreground">
                Use this code to embed the form in your React application:
              </p>

              <Tabs defaultValue="next" className="w-full">
                <TabsList className="bg-transparent rounded-none p-0 grid grid-cols-3 w-full h-10 border-b border-border">
                  <TabsTrigger 
                    value="next" 
                    className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                    style={{ fontSize: '11px' }}
                  >
                    Next.js
                  </TabsTrigger>
                  <TabsTrigger 
                    value="react" 
                    className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                    style={{ fontSize: '11px' }}
                  >
                    React
                  </TabsTrigger>
                  <TabsTrigger 
                    value="html" 
                    className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                    style={{ fontSize: '11px' }}
                  >
                    HTML
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="next" className="mt-3">
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(`import Script from 'next/script';\n\nexport default function Page() {\n  return (\n    <>\n      <Script src="${publishConfig.scriptUrl}" />\n      <div id="journey360-form-${publishConfig.uuid}"></div>\n    </>\n  );\n}`)}
                      className="absolute top-2 right-2 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all z-10"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <pre className="p-4 bg-background rounded-[var(--radius)] overflow-hidden border border-border" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%' }}>
                      <code className="text-foreground block" style={{ fontSize: '0.75rem', wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
{`import Script from 'next/script';

export default function Page() {
  return (
    <>
      <Script src="${publishConfig.scriptUrl}" />
      <div id="journey360-form-${publishConfig.uuid}"></div>
    </>
  );
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="react" className="mt-3">
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(`import { useEffect } from 'react';\n\nexport default function MyForm() {\n  useEffect(() => {\n    const script = document.createElement('script');\n    script.src = '${publishConfig.scriptUrl}';\n    script.async = true;\n    document.body.appendChild(script);\n    return () => {\n      document.body.removeChild(script);\n    };\n  }, []);\n\n  return <div id="journey360-form-${publishConfig.uuid}"></div>;\n}`)}
                      className="absolute top-2 right-2 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all z-10"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <pre className="p-4 bg-background rounded-[var(--radius)] overflow-hidden border border-border" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%' }}>
                      <code className="text-foreground block" style={{ fontSize: '0.75rem', wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
{`import { useEffect } from 'react';

export default function MyForm() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '${publishConfig.scriptUrl}';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="journey360-form-${publishConfig.uuid}"></div>;
}`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="html" className="mt-3">
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(`<script src="${publishConfig.scriptUrl}" async></script>\n<div id="journey360-form-${publishConfig.uuid}"></div>`)}
                      className="absolute top-2 right-2 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all z-10"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <pre className="p-4 bg-background rounded-[var(--radius)] overflow-hidden border border-border" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%' }}>
                      <code className="text-foreground block" style={{ fontSize: '0.75rem', wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
{`<script src="${publishConfig.scriptUrl}" async></script>
<div id="journey360-form-${publishConfig.uuid}"></div>`}
                      </code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>

              <Alert className="bg-muted border border-border rounded-[var(--radius-card)] block">
                <div className="text-foreground" style={{ display: 'block' }}>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.6', display: 'block', whiteSpace: 'normal' }}>
                    💡 <strong>Tip:</strong> The form will communicate with your parent app using <code className="px-1.5 py-0.5 bg-background rounded text-foreground border border-border" style={{ display: 'inline', whiteSpace: 'nowrap' }}>window.postMessage</code>. Listen for <code className="px-1.5 py-0.5 bg-background rounded text-foreground border border-border" style={{ display: 'inline', whiteSpace: 'nowrap' }}>journey360-form-submit</code> events to capture form submissions.
                  </p>
                </div>
              </Alert>
            </div>
          </div>
        </Card>
      )}

      {/* API Endpoints */}
      <Card className="p-4 bg-card border border-border rounded-[var(--radius)] w-full max-w-full" style={{ boxShadow: 'var(--elevation-sm)', boxSizing: 'border-box' }}>
        <div className="space-y-4 w-full max-w-full" style={{ boxSizing: 'border-box' }}>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-8 w-8 rounded-[var(--radius)] bg-primary flex items-center justify-center flex-shrink-0">
              <Server className="h-4 w-4 text-primary-foreground" />
            </div>
            <h4 className="text-foreground">API Endpoints</h4>
            <Badge className="bg-primary text-primary-foreground rounded-[var(--radius-pill)]">
              {mockApi.length} endpoints
            </Badge>
          </div>

          <Tabs defaultValue="endpoints" className="space-y-4 w-full max-w-full" style={{ boxSizing: 'border-box' }}>
            <TabsList className="bg-transparent rounded-none p-0 grid grid-cols-2 w-full h-10 border-b border-border">
              <TabsTrigger 
                value="endpoints" 
                className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                style={{ fontSize: '11px' }}
              >
                Endpoints
              </TabsTrigger>
              <TabsTrigger 
                value="curl" 
                className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                style={{ fontSize: '11px' }}
              >
                cURL Examples
              </TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints" className="space-y-3 w-full max-w-full" style={{ boxSizing: 'border-box' }}>
              {mockApi.map((endpoint, index) => (
                <div
                  key={index}
                  className="p-4 bg-background border border-border rounded-[var(--radius-card)] hover:border-primary/30 transition-all w-full max-w-full"
                  style={{ boxShadow: 'var(--elevation-sm)', boxSizing: 'border-box' }}
                >
                  <div className="space-y-2 w-full max-w-full" style={{ boxSizing: 'border-box' }}>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`rounded-[var(--radius-pill)] px-3 py-1 flex-shrink-0 ${
                          endpoint.method === 'GET' ? 'border-accent bg-accent/10 text-accent' :
                          endpoint.method === 'POST' ? 'border-primary bg-primary/10 text-primary' :
                          endpoint.method === 'PUT' ? 'border-secondary bg-secondary/10' :
                          'border-destructive bg-destructive/10 text-destructive'
                        }`}
                      >
                        {endpoint.method}
                      </Badge>
                    </div>
                    <div className="w-full max-w-full" style={{ boxSizing: 'border-box' }}>
                      <code className="text-foreground block w-full" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere', fontSize: '0.875rem' }}>{endpoint.path}</code>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground flex-wrap" style={{ fontSize: '0.875rem' }}>
                      <span>Status: {endpoint.statusCode}</span>
                      <span>•</span>
                      <span>Delay: {endpoint.delay || 500}ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="curl" className="space-y-3 w-full max-w-full" style={{ boxSizing: 'border-box' }}>
              {mockApi.slice(0, 3).map((endpoint, index) => (
                <div
                  key={index}
                  className="p-4 bg-background border border-border rounded-[var(--radius-card)] w-full max-w-full"
                  style={{ boxShadow: 'var(--elevation-sm)', boxSizing: 'border-box' }}
                >
                  <div className="space-y-3 w-full max-w-full" style={{ boxSizing: 'border-box' }}>
                    <div className="flex items-center justify-between gap-2 w-full max-w-full" style={{ boxSizing: 'border-box' }}>
                      <span className="text-muted-foreground break-all" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere', fontSize: '0.875rem' }}>{endpoint.method} {endpoint.path}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          const curl = `curl -X ${endpoint.method} "${deploymentUrl || 'https://api.example.com'}${endpoint.path}"`;
                          const success = await copyToClipboard(curl);
                          if (success) {
                            toast.success('cURL command copied');
                          } else {
                            toast.error('Failed to copy cURL command');
                          }
                        }}
                        className="rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all flex-shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="w-full max-w-full bg-card rounded-[var(--radius)] overflow-x-auto" style={{ boxSizing: 'border-box' }}>
                      <pre className="p-3 m-0 w-full max-w-full" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflowWrap: 'anywhere', boxSizing: 'border-box' }}>
                        <code className="text-foreground block w-full" style={{ fontSize: '0.75rem', wordBreak: 'break-all', overflowWrap: 'anywhere' }}>curl -X {endpoint.method} "{deploymentUrl || 'https://api.example.com'}{endpoint.path}" \{'\n'}{'  '}-H "Content-Type: application/json" \{'\n'}{'  '}-H "Authorization: Bearer YOUR_API_KEY"</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}