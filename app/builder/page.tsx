'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormEditorPage } from '../../components/FormEditorPage';
import { AIParser } from '../../utils/aiParser';
import { TestGenerator } from '../../utils/testGenerator';
import { MockApiGenerator } from '../../utils/mockApi';
import { FormSchema, TestCase, MockApiEndpoint } from '../../types/schema';

export default function BuilderPage() {
  const router = useRouter();
  const [requirements, setRequirements] = useState('');
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [tests, setTests] = useState<TestCase[]>([]);
  const [mockApi, setMockApi] = useState<MockApiEndpoint[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Get requirements from sessionStorage
    if (typeof window !== 'undefined') {
      const storedRequirements = sessionStorage.getItem('requirements');
      
      if (!storedRequirements) {
        // If no requirements found, redirect to prompt page
        router.push('/prompt');
        return;
      }

      setRequirements(storedRequirements);

      // Simulate AI processing
      setTimeout(() => {
        const generatedSchema = AIParser.parseUserStory(storedRequirements);
        const generatedTests = TestGenerator.generateTests(generatedSchema);
        const generatedMockApi = MockApiGenerator.generateEndpoints(generatedSchema);

        setSchema(generatedSchema);
        setTests(generatedTests);
        setMockApi(generatedMockApi);
        setIsProcessing(false);
      }, 2000);
    }
  }, [router]);

  const handleSchemaUpdate = (updatedSchema: FormSchema) => {
    setSchema(updatedSchema);
  };

  const handleRegenerate = async (newRequirements: string) => {
    setRequirements(newRequirements);
    setIsProcessing(true);

    // Update sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('requirements', newRequirements);
    }

    // Simulate regeneration
    setTimeout(() => {
      const generatedSchema = AIParser.parseUserStory(newRequirements);
      const generatedTests = TestGenerator.generateTests(generatedSchema);
      const generatedMockApi = MockApiGenerator.generateEndpoints(generatedSchema);

      setSchema(generatedSchema);
      setTests(generatedTests);
      setMockApi(generatedMockApi);
      setIsProcessing(false);
    }, 1500);
  };

  if (isProcessing || !schema) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-[var(--radius-card)] p-8 text-center" style={{ boxShadow: 'var(--elevation-lg)' }}>
          <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <h3 className="text-foreground mb-2">Processing Your Requirements</h3>
          <p className="text-muted-foreground">
            AI is generating your form, tests, and deployment package...
          </p>
        </div>
      </div>
    );
  }

  return (
    <FormEditorPage
      requirements={requirements}
      schema={schema}
      tests={tests}
      mockApi={mockApi}
      onSchemaUpdate={handleSchemaUpdate}
      onRegenerate={handleRegenerate}
    />
  );
}
