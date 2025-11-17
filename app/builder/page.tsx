"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormEditorPage } from "../../components/FormEditorPage";
import { AIParser } from "../../utils/aiParser";
import { TestGenerator } from "../../utils/testGenerator";
import { MockApiGenerator } from "../../utils/mockApi";
import { FormSchema, TestCase, MockApiEndpoint } from "../../types/schema";

export default function BuilderPage() {
  const router = useRouter();
  const [requirements, setRequirements] = useState("");
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [tests, setTests] = useState<TestCase[]>([]);
  const [mockApi, setMockApi] = useState<MockApiEndpoint[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Get requirements from sessionStorage
    if (typeof window !== "undefined") {
      const storedRequirements = sessionStorage.getItem("requirements");

      if (!storedRequirements) {
        // If no requirements found, redirect to home page
        router.push("/");
        return;
      }

      setRequirements(storedRequirements);

      // Process requirements asynchronously
      const processRequirements = async () => {
        try {
          // Wait for schema to be generated
          const generatedSchema = await AIParser.parseUserStory(
            storedRequirements
          );

          // Only generate tests and mock API after schema is ready
          const generatedTests = TestGenerator.generateTests(generatedSchema);
          const generatedMockApi =
            MockApiGenerator.generateEndpoints(generatedSchema);

          setSchema(generatedSchema);
          setTests(generatedTests);
          setMockApi(generatedMockApi);
          setIsProcessing(false);
        } catch (error) {
          console.error("Error processing requirements:", error);
          setIsProcessing(false);
          router.push("/");
        }
      };

      processRequirements();
    }
  }, [router]);

  const handleSchemaUpdate = (updatedSchema: FormSchema) => {
    setSchema(updatedSchema);
  };

  const handleRegenerate = async (newRequirements: string) => {
    setRequirements(newRequirements);
    setIsProcessing(true);

    // Update sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("requirements", newRequirements);
    }

    try {
      // Wait for schema to be generated
      const generatedSchema = await AIParser.parseUserStory(newRequirements);

      // Only generate tests and mock API after schema is ready
      const generatedTests = TestGenerator.generateTests(generatedSchema);
      const generatedMockApi =
        MockApiGenerator.generateEndpoints(generatedSchema);

      setSchema(generatedSchema);
      setTests(generatedTests);
      setMockApi(generatedMockApi);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error regenerating schema:", error);
      setIsProcessing(false);
    }
  };

  if (isProcessing || !schema) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div
          className='bg-card border border-border rounded-[var(--radius-card)] p-8 text-center'
          style={{ boxShadow: "var(--elevation-lg)" }}
        >
          <div className='h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4' />
          <h3 className='text-foreground mb-2'>Processing Your Requirements</h3>
          <p className='text-muted-foreground'>
            AI is generating your form, tests, and deployment package...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <FormEditorPage
        requirements={requirements}
        schema={schema}
        tests={tests}
        mockApi={mockApi}
        onSchemaUpdate={handleSchemaUpdate}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}
