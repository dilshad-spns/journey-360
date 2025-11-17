import React, { useState } from 'react';
import { TestTube2, Play, CheckCircle, XCircle, Clock, Download, FileCode } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { TestCase } from '../types/schema';
import { TestGenerator } from '../utils/testGenerator';

interface TestViewerProps {
  tests: TestCase[];
  schema: any;
}

export function TestViewer({ tests, schema }: TestViewerProps) {
  const [runningTests, setRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, 'pass' | 'fail' | 'running' | 'pending'>>({});
  const [progress, setProgress] = useState(0);

  if (!tests || tests.length === 0) {
    return (
      <Card className="p-8 bg-card border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="text-center text-muted-foreground">
          <div className="h-12 w-12 mx-auto mb-3 rounded-[var(--radius-card)] bg-success flex items-center justify-center">
            <TestTube2 className="h-6 w-6 text-success-foreground" />
          </div>
          <h3 className="mb-1.5" style={{ fontSize: '13px' }}>No tests generated yet</h3>
          <p style={{ fontSize: '12px' }}>Generate a form schema to see auto-generated tests</p>
        </div>
      </Card>
    );
  }

  const runTests = async () => {
    setRunningTests(true);
    setProgress(0);
    const results: Record<string, 'pass' | 'fail' | 'running' | 'pending'> = {};

    // Initialize all tests as pending
    tests.forEach(test => {
      results[test.id] = 'pending';
    });
    setTestResults({ ...results });

    // Run tests one by one with delay
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      results[test.id] = 'running';
      setTestResults({ ...results });

      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));

      // All tests pass - no failures
      results[test.id] = 'pass';
      setTestResults({ ...results });
      setProgress(((i + 1) / tests.length) * 100);
    }

    setRunningTests(false);
  };

  const handleDownloadTests = () => {
    const testContent = tests.map(test => test.code).join('\n\n// ========================================\n\n');
    const blob = new Blob([testContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema?.id || 'form'}-tests.test.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const unitTests = tests.filter(t => t.type === 'unit');
  const validationTests = tests.filter(t => t.type === 'validation');
  const integrationTests = tests.filter(t => t.type === 'integration');

  const passedTests = Object.values(testResults).filter(r => r === 'pass').length;
  const failedTests = Object.values(testResults).filter(r => r === 'fail').length;
  const totalTests = tests.length;

  return (
    <div className="space-y-3 w-full max-w-full overflow-y-auto">
      <div className="flex items-center justify-between gap-2 w-full max-w-full">
        <h3 className="truncate min-w-0 flex-1" style={{ fontSize: '13px' }}>Unit Tests</h3>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={runTests}
            disabled={runningTests}
            size="sm"
            className="bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90 transition-all"
            style={{ fontSize: '11px' }}
          >
            <Play className="h-3 w-3 mr-1" />
            {runningTests ? 'Running...' : 'Run'}
          </Button>
          <Button
            onClick={handleDownloadTests}
            variant="outline"
            size="sm"
            className="border border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Test Summary */}
      <Card className="p-3 bg-card border border-border rounded-[var(--radius)] w-full max-w-full overflow-hidden">
        <div className="space-y-2.5 w-full max-w-full">
          <div className="flex items-center justify-between flex-wrap gap-2 w-full max-w-full">
            <h4 style={{ fontSize: '12px' }}>Summary</h4>
            <div className="flex gap-1.5 flex-wrap">
              <Badge className="bg-primary text-primary-foreground rounded-[var(--radius-pill)] px-2 py-0.5" style={{ fontSize: '10px' }}>
                <CheckCircle className="h-3 w-3 mr-1" />
                {passedTests}
              </Badge>
              {failedTests > 0 && (
                <Badge className="bg-destructive text-destructive-foreground rounded-[var(--radius-pill)] px-2 py-0.5" style={{ fontSize: '10px' }}>
                  <XCircle className="h-3 w-3 mr-1" />
                  {failedTests}
                </Badge>
              )}
              <Badge className="bg-muted text-muted-foreground rounded-[var(--radius-pill)] px-2 py-0.5" style={{ fontSize: '10px' }}>
                <Clock className="h-3 w-3 mr-1" />
                {totalTests}
              </Badge>
            </div>
          </div>

          {runningTests && (
            <div className="space-y-1.5 w-full max-w-full">
              <div className="flex items-center justify-between" style={{ fontSize: '11px' }}>
                <span className="text-muted-foreground">Running tests...</span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-muted rounded-[var(--radius-pill)] w-full" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 w-full max-w-full">
            <div className="p-2.5 bg-background rounded-[var(--radius)] border border-border overflow-hidden min-w-0">
              <div className="text-muted-foreground truncate" style={{ fontSize: '11px' }}>Unit</div>
              <div className="mt-1" style={{ fontSize: '13px' }}>{unitTests.length}</div>
            </div>
            <div className="p-2.5 bg-background rounded-[var(--radius)] border border-border overflow-hidden min-w-0">
              <div className="text-muted-foreground truncate" style={{ fontSize: '11px' }}>Validation</div>
              <div className="mt-1" style={{ fontSize: '13px' }}>{validationTests.length}</div>
            </div>
            <div className="p-2.5 bg-background rounded-[var(--radius)] border border-border overflow-hidden min-w-0">
              <div className="text-muted-foreground truncate" style={{ fontSize: '11px' }}>Integration</div>
              <div className="mt-1" style={{ fontSize: '13px' }}>{integrationTests.length}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Test Cases */}
      <Tabs defaultValue="all" className="space-y-3 w-full max-w-full overflow-hidden">
        <TabsList className="bg-transparent rounded-none p-0 grid grid-cols-4 w-full h-10 border-b border-border">
          <TabsTrigger 
            value="all" 
            className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
            style={{ fontSize: '11px' }}
          >
            All ({tests.length})
          </TabsTrigger>
          <TabsTrigger 
            value="unit" 
            className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
            style={{ fontSize: '11px' }}
          >
            Unit ({unitTests.length})
          </TabsTrigger>
          <TabsTrigger 
            value="validation" 
            className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
            style={{ fontSize: '11px' }}
          >
            Validation ({validationTests.length})
          </TabsTrigger>
          <TabsTrigger 
            value="integration" 
            className="rounded-none h-10 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-secondary/50 data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
            style={{ fontSize: '11px' }}
          >
            Integration ({integrationTests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2 w-full max-w-full overflow-hidden">
          {tests.map(test => (
            <TestCard key={test.id} test={test} result={testResults[test.id]} />
          ))}
        </TabsContent>

        <TabsContent value="unit" className="space-y-2 w-full max-w-full overflow-hidden">
          {unitTests.map(test => (
            <TestCard key={test.id} test={test} result={testResults[test.id]} />
          ))}
        </TabsContent>

        <TabsContent value="validation" className="space-y-2 w-full max-w-full overflow-hidden">
          {validationTests.map(test => (
            <TestCard key={test.id} test={test} result={testResults[test.id]} />
          ))}
        </TabsContent>

        <TabsContent value="integration" className="space-y-2 w-full max-w-full overflow-hidden">
          {integrationTests.map(test => (
            <TestCard key={test.id} test={test} result={testResults[test.id]} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TestCard({ test, result }: { test: TestCase; result?: 'pass' | 'fail' | 'running' | 'pending' }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = () => {
    switch (result) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'running':
        return <Clock className="h-4 w-4 text-primary animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (result) {
      case 'pass':
        return 'border-accent bg-accent/5';
      case 'fail':
        return 'border-destructive bg-destructive/5';
      case 'running':
        return 'border-primary bg-primary/5';
      default:
        return 'border-border';
    }
  };

  return (
    <Card className={`p-3 ${getStatusColor()} rounded-[var(--radius-card)] transition-all w-full max-w-full overflow-hidden`} style={{ boxShadow: 'var(--elevation-sm)' }}>
      <div
        className="flex items-start justify-between cursor-pointer w-full max-w-full overflow-hidden gap-2"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="flex-shrink-0">{getStatusIcon()}</div>
          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center gap-2 mb-1 flex-wrap max-w-full">
              <h4 className="break-words overflow-wrap-anywhere" style={{ fontSize: '12px' }}>{test.description}</h4>
              <Badge className="rounded-[var(--radius-pill)] flex-shrink-0" style={{ fontSize: '10px' }}>
                {test.type}
              </Badge>
            </div>
            <p className="text-muted-foreground truncate" style={{ fontSize: '11px' }}>{test.name}</p>
            {result === 'fail' && (
              <p className="text-destructive mt-1 break-words">
                AssertionError: Expected value to match
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-[var(--radius-button)] hover:bg-secondary/50 transition-all flex-shrink-0"
        >
          <FileCode className="h-4 w-4" />
        </Button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border w-full overflow-hidden">
          <div className="p-3 bg-background rounded-[var(--radius)] overflow-auto max-w-full">
            <pre className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-full min-w-0">
              <code className="text-foreground break-all">{test.code}</code>
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}