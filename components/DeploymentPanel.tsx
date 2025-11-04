import React, { useState } from 'react';
import { Rocket, Globe, CheckCircle2, Loader2, ExternalLink, Copy, Download, Server, RotateCcw } from 'lucide-react';
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

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployProgress(0);
    setDeployment(prev => ({ ...prev, status: 'building' }));

    const steps = [
      { label: 'Validating schema...', duration: 800 },
      { label: 'Building form components...', duration: 1200 },
      { label: 'Generating API endpoints...', duration: 1000 },
      { label: 'Running tests...', duration: 1500 },
      { label: 'Deploying to server...', duration: 1000 },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setDeployProgress(((i + 1) / steps.length) * 100);
    }

    const mockUrl = `https://${deployment.environment}-${schema.id}.ai360-deploy.app`;
    setDeploymentUrl(mockUrl);
    setDeployment({
      ...deployment,
      status: 'deployed',
      url: mockUrl,
      timestamp: new Date().toISOString(),
    });
    setIsDeploying(false);
    toast.success('Form deployed successfully!');
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
  };

  if (!schema) {
    return (
      <Card className="p-12 bg-card border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="text-center text-muted-foreground">
          <div className="h-16 w-16 mx-auto mb-4 rounded-[var(--radius-card)] bg-warning flex items-center justify-center">
            <Rocket className="h-8 w-8 text-warning-foreground" />
          </div>
          <h3 className="mb-2">No form to deploy</h3>
          <p>Generate a schema first to deploy your form</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground">Deployment</h3>
      </div>

      <Card className="p-4 bg-card border border-border rounded-[var(--radius)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-3">
              <label className="text-foreground">Environment</label>
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
              <label className="text-foreground">Status:</label>
              <Badge
                className={`rounded-[var(--radius-pill)] px-4 py-2 ${
                  deployment.status === 'deployed'
                    ? 'bg-primary text-primary-foreground'
                    : deployment.status === 'building'
                    ? 'bg-primary/70 text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
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
                <span className="text-muted-foreground">Deploying...</span>
                <span className="text-muted-foreground">{Math.round(deployProgress)}%</span>
              </div>
              <Progress value={deployProgress} className="h-2 bg-muted rounded-[var(--radius-pill)]" />
            </div>
          )}

          {deployment.status === 'deployed' && deploymentUrl && (
            <Alert className="bg-primary/10 border-2 border-primary rounded-[var(--radius-card)]">
              <Globe className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <h4 className="text-primary">Deployment Successful!</h4>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <code className="px-3 py-2 bg-background rounded-[var(--radius)]">
                    {deploymentUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyUrl}
                    className="rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all"
                    aria-label="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(deploymentUrl, '_blank')}
                    className="rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all"
                    aria-label="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                {deployment.timestamp && (
                  <p className="text-muted-foreground mt-3">
                    Deployed at {new Date(deployment.timestamp).toLocaleString()}
                  </p>
                )}
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
              {isDeploying ? 'Deploying...' : deployment.status === 'deployed' ? 'Deployed' : 'Deploy'}
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

      {/* API Endpoints */}
      <Card className="p-4 bg-card border border-border rounded-[var(--radius)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-8 w-8 rounded-[var(--radius)] bg-primary flex items-center justify-center">
              <Server className="h-4 w-4 text-primary-foreground" />
            </div>
            <h4 className="text-foreground">API Endpoints</h4>
            <Badge className="bg-primary text-primary-foreground rounded-[var(--radius-pill)]">
              {mockApi.length} endpoints
            </Badge>
          </div>

          <Tabs defaultValue="endpoints" className="space-y-4">
            <TabsList className="bg-secondary/50 rounded-[var(--radius)] p-1">
              <TabsTrigger value="endpoints" className="rounded-[var(--radius)] data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                Endpoints
              </TabsTrigger>
              <TabsTrigger value="curl" className="rounded-[var(--radius)] data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                cURL Examples
              </TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints" className="space-y-3">
              {mockApi.map((endpoint, index) => (
                <div
                  key={index}
                  className="p-5 bg-background border border-border rounded-[var(--radius-card)] hover:border-primary/30 transition-all"
                  style={{ boxShadow: 'var(--elevation-sm)' }}
                >
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`rounded-[var(--radius-pill)] px-3 py-1 ${
                        endpoint.method === 'GET' ? 'border-accent bg-accent/10 text-accent' :
                        endpoint.method === 'POST' ? 'border-primary bg-primary/10 text-primary' :
                        endpoint.method === 'PUT' ? 'border-secondary bg-secondary/10' :
                        'border-destructive bg-destructive/10 text-destructive'
                      }`}
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-foreground">{endpoint.path}</code>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Status: {endpoint.statusCode}</span>
                    <span>•</span>
                    <span>Delay: {endpoint.delay || 500}ms</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="curl" className="space-y-3">
              {mockApi.slice(0, 3).map((endpoint, index) => (
                <div
                  key={index}
                  className="p-5 bg-background border border-border rounded-[var(--radius-card)]"
                  style={{ boxShadow: 'var(--elevation-sm)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground">{endpoint.method} {endpoint.path}</span>
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
                      className="rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <pre className="overflow-x-auto p-3 bg-card rounded-[var(--radius)]">
                    <code className="text-foreground">
                      curl -X {endpoint.method} "{deploymentUrl || 'https://api.example.com'}{endpoint.path}" \{'\n'}
                      {'  '}-H "Content-Type: application/json" \{'\n'}
                      {'  '}-H "Authorization: Bearer YOUR_API_KEY"
                    </code>
                  </pre>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
