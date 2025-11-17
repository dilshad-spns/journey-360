import React, { useState } from 'react';
import { Code2, Copy, Check, Download, Eye, Database, FileJson } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { FormSchema } from '../types/schema';
import { copyToClipboard } from '../utils/clipboard';
import { toast } from 'sonner';

interface SchemaViewerProps {
  schema: FormSchema | null;
  formData?: any;
}

export function SchemaViewer({ schema, formData }: SchemaViewerProps) {
  const [copied, setCopied] = useState(false);
  const [mainView, setMainView] = useState<'data-model' | 'form-schema'>('data-model');
  const [schemaView, setSchemaView] = useState<'formatted' | 'raw'>('formatted');

  if (!schema) {
    return (
      <Card className="p-8 bg-card border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="text-center text-muted-foreground">
          <div className="h-12 w-12 mx-auto mb-3 rounded-[var(--radius-card)] bg-accent flex items-center justify-center">
            <Code2 className="h-6 w-6 text-accent-foreground" />
          </div>
          <h3 className="mb-1.5" style={{ fontSize: '13px' }}>No schema generated yet</h3>
          <p style={{ fontSize: '12px' }}>Enter a user story to generate a form schema</p>
        </div>
      </Card>
    );
  }

  const handleCopySchema = async () => {
    const success = await copyToClipboard(JSON.stringify(schema, null, 2));
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Schema copied to clipboard');
    } else {
      toast.error('Failed to copy schema');
    }
  };

  const handleCopyDataModel = async () => {
    const success = await copyToClipboard(JSON.stringify(formData || {}, null, 2));
    if (success) {
      toast.success('Data model copied to clipboard');
    } else {
      toast.error('Failed to copy data model');
    }
  };

  const handleDownloadSchema = () => {
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDataModel = () => {
    const blob = new Blob([JSON.stringify(formData || {}, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderDataModelView = () => {
    const hasData = formData && Object.keys(formData).some(key => {
      const value = formData[key];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      return value !== '' && value !== null && value !== undefined;
    });

    return (
      <div className="space-y-4 max-w-full overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h3 style={{ fontSize: '13px' }}>Live Data Model</h3>
            {hasData && <Badge variant="outline" className="bg-success/10 text-success border-success/20" style={{ fontSize: '11px' }}>Active</Badge>}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCopyDataModel}
              variant="outline"
              size="sm"
              className="rounded-[var(--radius-button)] transition-all"
              aria-label="Copy data model to clipboard"
            >
              <Copy className="h-3 w-3" aria-hidden="true" />
            </Button>
            <Button
              onClick={handleDownloadDataModel}
              variant="outline"
              size="sm"
              className="rounded-[var(--radius-button)] transition-all"
              aria-label="Download data model as JSON file"
            >
              <Download className="h-3 w-3" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {!hasData ? (
          <Card className="p-8 bg-card border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
            <div className="text-center text-muted-foreground">
              <div className="h-12 w-12 mx-auto mb-3 rounded-[var(--radius-card)] bg-muted flex items-center justify-center">
                <Database className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-1.5" style={{ fontSize: '13px' }}>No data yet</h3>
              <p style={{ fontSize: '12px' }}>Start filling out the form to see the live data model</p>
            </div>
          </Card>
        ) : (
          <Card className="bg-background border-border rounded-[var(--radius-card)] max-w-full overflow-hidden" style={{ boxShadow: 'var(--elevation-md)' }}>
            <div className="p-3 overflow-x-auto max-w-full">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground" style={{ fontSize: '11px' }}>
                <FileJson className="h-3.5 w-3.5" />
                <span>JSON Data Model</span>
              </div>
              <pre style={{ fontSize: '11px' }} className="whitespace-pre-wrap break-words max-w-full">
                <code className="text-foreground">
                  {JSON.stringify(formData, null, 2)}
                </code>
              </pre>
            </div>
          </Card>
        )}

        <Card className="p-3 bg-primary/5 border-primary/20 rounded-[var(--radius-card)]">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Database className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 style={{ fontSize: '12px' }} className="mb-1">About Data Model</h4>
              <p className="text-muted-foreground" style={{ fontSize: '11px' }}>This shows the real-time JSON structure of your form data as users fill it out. This same data structure is used for API requests and responses.</p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderFormSchemaView = () => {
    return (
      <div className="space-y-4 max-w-full overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileJson className="h-4 w-4 text-primary" />
            <h3 style={{ fontSize: '13px' }}>Form Schema</h3>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCopySchema}
              variant="outline"
              size="sm"
              className="rounded-[var(--radius-button)] transition-all"
              aria-label={copied ? 'Copied to clipboard' : 'Copy schema to clipboard'}
            >
              {copied ? (
                <Check className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Copy className="h-3 w-3" aria-hidden="true" />
              )}
            </Button>
            <Button
              onClick={handleDownloadSchema}
              variant="outline"
              size="sm"
              className="rounded-[var(--radius-button)] transition-all"
              aria-label="Download schema as JSON file"
            >
              <Download className="h-3 w-3" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <Tabs value={schemaView} onValueChange={(v) => setSchemaView(v as 'formatted' | 'raw')} className="space-y-4 max-w-full">
          <TabsList className="bg-secondary/50 rounded-[var(--radius)] p-1">
            <TabsTrigger value="formatted" className="rounded-[var(--radius)] data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all" style={{ fontSize: '11px' }}>
              <Eye className="h-3.5 w-3.5 mr-1" />
              Formatted View
            </TabsTrigger>
            <TabsTrigger value="raw" className="rounded-[var(--radius)] data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all" style={{ fontSize: '11px' }}>
              <Code2 className="h-3.5 w-3.5 mr-1" />
              Raw JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formatted" className="space-y-3 max-w-full">
            <Card className="p-3 bg-card border-border rounded-[var(--radius-card)] max-w-full overflow-hidden" style={{ boxShadow: 'var(--elevation-md)' }}>
              <div className="space-y-3 max-w-full">

                <div className="max-w-full">
                  <label className="text-muted-foreground" style={{ fontSize: '11px' }}>Fields ({schema.fields.length})</label>
                  <div className="mt-2 space-y-0 border border-border rounded-[var(--radius-card)] overflow-hidden bg-card max-w-full">
                    {schema.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-2.5 hover:bg-secondary/30 transition-colors border-b border-border last:border-b-0 max-w-full overflow-hidden"
                      >
                        <div className="flex items-baseline justify-between gap-4 mb-1.5 max-w-full">
                          <div className="flex items-baseline gap-2 min-w-0 flex-1">
                            <span className="text-muted-foreground flex-shrink-0" style={{ fontSize: '11px' }}>{index + 1}.</span>
                            <h4 style={{ fontSize: '12px' }} className="break-words overflow-wrap-anywhere">{field.label}</h4>
                          </div>
                          <code className="text-muted-foreground flex-shrink-0 bg-secondary px-1.5 py-0.5 rounded-[var(--radius)]" style={{ fontSize: '10px' }}>
                            {field.type}
                          </code>
                        </div>
                        
                        <div className="pl-4 space-y-1 max-w-full overflow-hidden" style={{ fontSize: '11px' }}>
                          <div className="flex items-baseline gap-2 min-w-0 max-w-full">
                            <span className="text-muted-foreground flex-shrink-0">Field:</span>
                            <code className="break-all overflow-wrap-anywhere">{field.name}</code>
                          </div>
                          
                          {field.placeholder && (
                            <div className="flex items-baseline gap-2 min-w-0 max-w-full">
                              <span className="text-muted-foreground flex-shrink-0">Hint:</span>
                              <span className="break-words overflow-wrap-anywhere">{field.placeholder}</span>
                            </div>
                          )}

                          {field.validations && field.validations.length > 0 && (
                            <div className="flex items-baseline gap-2 min-w-0 flex-wrap max-w-full">
                              <span className="text-muted-foreground flex-shrink-0">Rules:</span>
                              <div className="flex flex-wrap gap-1 max-w-full">
                                {field.validations.map((val, idx) => (
                                  <span
                                    key={idx}
                                    className="text-accent bg-accent/10 px-1.5 py-0.5 rounded-[var(--radius)] break-words"
                                    style={{ fontSize: '10px' }}
                                  >
                                    {val.type}{val.value && ` (${val.value})`}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {field.options && (
                            <div className="flex items-baseline gap-2 min-w-0 flex-wrap max-w-full">
                              <span className="text-muted-foreground flex-shrink-0">Options:</span>
                              <div className="flex flex-wrap gap-1 max-w-full">
                                {field.options.map((opt, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-secondary px-1.5 py-0.5 rounded-[var(--radius)] break-words"
                                    style={{ fontSize: '10px' }}
                                  >
                                    {opt.label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {schema.metadata && (
                  <div className="pt-2 mt-2 border-t border-border space-y-1.5 max-w-full overflow-hidden" style={{ fontSize: '11px' }}>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="text-foreground">
                        {new Date(schema.metadata.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 min-w-0 max-w-full">
                      <span className="text-muted-foreground flex-shrink-0">Schema ID:</span>
                      <code className="text-foreground break-all overflow-wrap-anywhere">
                        {schema.id}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="raw" className="max-w-full overflow-hidden">
            <Card className="bg-background border-border rounded-[var(--radius-card)] max-w-full overflow-hidden" style={{ boxShadow: 'var(--elevation-md)' }}>
              <div className="p-3 overflow-x-auto max-w-full">
                <pre style={{ fontSize: '11px' }} className="whitespace-pre-wrap break-words max-w-full">
                  <code className="text-foreground">
                    {JSON.stringify(schema, null, 2)}
                  </code>
                </pre>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <Tabs value={mainView} onValueChange={(v) => setMainView(v as 'data-model' | 'form-schema')} className="space-y-4 max-w-full">
        <TabsList className="bg-transparent rounded-none p-0 grid grid-cols-2 w-full h-10 border-b border-border">
          <TabsTrigger 
            value="data-model" 
            className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
            style={{ fontSize: '11px' }}
          >
            <Database className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
            Data Model
          </TabsTrigger>
          <TabsTrigger 
            value="form-schema" 
            className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
            style={{ fontSize: '11px' }}
          >
            <FileJson className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
            Form Schema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data-model" className="max-w-full overflow-hidden">
          {renderDataModelView()}
        </TabsContent>

        <TabsContent value="form-schema" className="max-w-full overflow-hidden">
          {renderFormSchemaView()}
        </TabsContent>
      </Tabs>
    </div>
  );
}