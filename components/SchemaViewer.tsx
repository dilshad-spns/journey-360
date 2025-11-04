import React, { useState } from 'react';
import { Code2, Copy, Check, Download, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { FormSchema } from '../types/schema';
import { copyToClipboard } from '../utils/clipboard';
import { toast } from 'sonner';

interface SchemaViewerProps {
  schema: FormSchema | null;
}

export function SchemaViewer({ schema }: SchemaViewerProps) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'formatted' | 'raw'>('formatted');

  if (!schema) {
    return (
      <Card className="p-12 bg-card border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="text-center text-muted-foreground">
          <div className="h-16 w-16 mx-auto mb-4 rounded-[var(--radius-card)] bg-accent flex items-center justify-center">
            <Code2 className="h-8 w-8 text-accent-foreground" />
          </div>
          <h3 className="mb-2">No schema generated yet</h3>
          <p>Enter a user story to generate a form schema</p>
        </div>
      </Card>
    );
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(JSON.stringify(schema, null, 2));
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Schema copied to clipboard');
    } else {
      toast.error('Failed to copy schema');
    }
  };

  const handleDownload = () => {
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

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-foreground">JSON Schema</h3>
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="border border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
            aria-label={copied ? 'Copied to clipboard' : 'Copy schema to clipboard'}
          >
            {copied ? (
              <Check className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Copy className="h-3 w-3" aria-hidden="true" />
            )}
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="border border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
            aria-label="Download schema as JSON file"
          >
            <Download className="h-3 w-3" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as 'formatted' | 'raw')} className="space-y-4 max-w-full">
        <TabsList className="bg-secondary/50 rounded-[var(--radius)] p-1">
          <TabsTrigger value="formatted" className="rounded-[var(--radius)] data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
            <Eye className="h-4 w-4 mr-1" />
            Formatted View
          </TabsTrigger>
          <TabsTrigger value="raw" className="rounded-[var(--radius)] data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
            <Code2 className="h-4 w-4 mr-1" />
            Raw JSON
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formatted" className="space-y-4 max-w-full">
          <Card className="p-4 bg-card border-border rounded-[var(--radius-card)] max-w-full overflow-hidden" style={{ boxShadow: 'var(--elevation-md)' }}>
            <div className="space-y-4 max-w-full">

              <div className="max-w-full">
                <label className="text-muted-foreground">Fields ({schema.fields.length})</label>
                <div className="mt-3 space-y-0 border border-border rounded-[var(--radius-card)] overflow-hidden bg-card max-w-full">
                  {schema.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-3 hover:bg-secondary/30 transition-colors border-b border-border last:border-b-0 max-w-full overflow-hidden"
                    >
                      <div className="flex items-baseline justify-between gap-4 mb-2 max-w-full">
                        <div className="flex items-baseline gap-2 min-w-0 flex-1">
                          <span className="text-muted-foreground flex-shrink-0">{index + 1}.</span>
                          <h4 className="break-words overflow-wrap-anywhere">{field.label}</h4>
                        </div>
                        <code className="text-muted-foreground flex-shrink-0 bg-secondary px-2 py-0.5 rounded-[var(--radius)]">
                          {field.type}
                        </code>
                      </div>
                      
                      <div className="pl-5 space-y-1.5 max-w-full overflow-hidden">
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
                            <div className="flex flex-wrap gap-1.5 max-w-full">
                              {field.validations.map((val, idx) => (
                                <span
                                  key={idx}
                                  className="text-accent bg-accent/10 px-2 py-0.5 rounded-[var(--radius)] break-words"
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
                            <div className="flex flex-wrap gap-1.5 max-w-full">
                              {field.options.map((opt, idx) => (
                                <span
                                  key={idx}
                                  className="bg-secondary px-2 py-0.5 rounded-[var(--radius)] break-words"
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
                <div className="pt-3 mt-3 border-t border-border space-y-2 max-w-full overflow-hidden">
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
            <div className="p-4 overflow-x-auto max-w-full">
              <pre className="text-sm whitespace-pre-wrap break-words max-w-full">
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
}
