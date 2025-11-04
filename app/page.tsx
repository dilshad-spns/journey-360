'use client';

import React, { useState, useEffect } from 'react';
import { LandingPage } from '../components/LandingPage';
import { InputRequirementScreen } from '../components/InputRequirementScreen';
import { FormEditorPage } from '../components/FormEditorPage';
import { TopNav } from '../components/TopNav';
import { Toaster } from '../components/ui/sonner';
import { AIParser } from '../utils/aiParser';
import { TestGenerator } from '../utils/testGenerator';
import { MockApiGenerator } from '../utils/mockApi';
import { FormSchema, TestCase, MockApiEndpoint } from '../types/schema';

type Screen = 'landing' | 'input' | 'editor';
type InputMode = 'text' | 'speech' | 'upload';

interface AppState {
  screen: Screen;
  inputMode: InputMode | null;
  requirements: string;
  schema: FormSchema | null;
  tests: TestCase[];
  mockApi: MockApiEndpoint[];
  isProcessing: boolean;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  const [state, setState] = useState<AppState>({
    screen: 'landing',
    inputMode: null,
    requirements: '',
    schema: null,
    tests: [],
    mockApi: [],
    isProcessing: false,
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSelectMode = (mode: InputMode) => {
    setState(prev => ({
      ...prev,
      screen: 'input',
      inputMode: mode,
    }));
  };

  const handleBackToLanding = () => {
    setState(prev => ({
      ...prev,
      screen: 'landing',
      inputMode: null,
    }));
  };

  const handleNewProject = () => {
    setState({
      screen: 'landing',
      inputMode: null,
      requirements: '',
      schema: null,
      tests: [],
      mockApi: [],
      isProcessing: false,
    });
  };

  const handleContinueWithRequirements = async (requirements: string) => {
    setState(prev => ({
      ...prev,
      requirements,
      isProcessing: true,
    }));

    // Simulate AI processing
    setTimeout(() => {
      const schema = AIParser.parseUserStory(requirements);
      const tests = TestGenerator.generateTests(schema);
      const mockApi = MockApiGenerator.generateEndpoints(schema);

      setState(prev => ({
        ...prev,
        screen: 'editor',
        schema,
        tests,
        mockApi,
        isProcessing: false,
      }));
    }, 2000);
  };

  const handleSchemaUpdate = (schema: FormSchema) => {
    setState(prev => ({
      ...prev,
      schema,
    }));
  };

  const handleRegenerate = async (newRequirements: string) => {
    setState(prev => ({
      ...prev,
      requirements: newRequirements,
      isProcessing: true,
    }));

    // Simulate regeneration
    setTimeout(() => {
      const schema = AIParser.parseUserStory(newRequirements);
      const tests = TestGenerator.generateTests(schema);
      const mockApi = MockApiGenerator.generateEndpoints(schema);

      setState(prev => ({
        ...prev,
        schema,
        tests,
        mockApi,
        isProcessing: false,
      }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Top Navigation - Show on all screens except landing */}
      {state.screen !== 'landing' && (
        <TopNav 
          darkMode={darkMode} 
          onToggleDarkMode={toggleDarkMode}
          onNewProject={handleNewProject}
        />
      )}

      {/* Screen Routing */}
      {state.screen === 'landing' && (
        <LandingPage onSelectMode={handleSelectMode} />
      )}

      {state.screen === 'input' && state.inputMode && (
        <InputRequirementScreen
          mode={state.inputMode}
          onBack={handleBackToLanding}
          onContinue={handleContinueWithRequirements}
        />
      )}

      {state.screen === 'editor' && state.schema && (
        <FormEditorPage
          requirements={state.requirements}
          schema={state.schema}
          tests={state.tests}
          mockApi={state.mockApi}
          onSchemaUpdate={handleSchemaUpdate}
          onRegenerate={handleRegenerate}
        />
      )}

      {/* Processing Overlay */}
      {state.isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-[var(--radius-card)] p-8 text-center" style={{ boxShadow: 'var(--elevation-lg)' }}>
            <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
            <h3 className="text-foreground mb-2">Processing Your Requirements</h3>
            <p className="text-muted-foreground">
              AI is generating your form, tests, and deployment package...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
