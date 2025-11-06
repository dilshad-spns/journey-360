import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { InputRequirementScreen } from './components/InputRequirementScreen';
import { FormEditorPage } from './components/FormEditorPage';
import { TopNav } from './components/TopNav';
import { Toaster } from './components/ui/sonner';
import { AIParser } from './utils/aiParser';
import { TestGenerator } from './utils/testGenerator';
import { MockApiGenerator } from './utils/mockApi';
import { FormSchema, TestCase, MockApiEndpoint } from './types/schema';

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

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Analyzing your requirements...",
    "Generating form schema...",
    "Creating UI components...",
    "Setting up data bindings...",
    "Building validation rules...",
    "Generating mock APIs...",
    "Writing unit tests...",
    "Optimizing performance...",
    "Almost ready...",
  ];

  useEffect(() => {
    if (state.isProcessing) {
      setLoadingMessageIndex(0);
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [state.isProcessing]);

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

  const handleSelectMode = (mode: InputMode, prompt?: string) => {
    console.log('🎯 App.tsx: handleSelectMode called with mode:', mode, 'prompt:', prompt);
    setState(prev => ({
      ...prev,
      screen: 'input',
      inputMode: mode,
      requirements: prompt || '',
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
    }, 7000);
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
          onGoHome={handleBackToLanding}
        />
      )}

      {/* Screen Routing */}
      {state.screen === 'landing' && (
        <LandingPage 
          onSelectMode={handleSelectMode}
        />
      )}

      {state.screen === 'input' && state.inputMode && (
        <InputRequirementScreen
          mode={state.inputMode}
          onBack={handleBackToLanding}
          onContinue={handleContinueWithRequirements}
          initialRequirements={state.requirements}
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
        <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50">
          <div className="p-8 text-center relative">
            {/* Animated Logo Loader */}
            <div className="relative mb-6">
              <div className="relative h-24 w-24 mx-auto">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl scale-110 animate-pulse" />
                
                {/* SVG Logo with animations */}
                <div className="relative h-24 w-24">
                  <svg width="96" height="96" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <filter id="filter0_loader" x="9.87988" y="4.76001" width="45.7266" height="16.0312" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur"/>
                      </filter>
                      <filter id="filter1_loader" x="8.46387" y="43.1794" width="45.7266" height="16.0312" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur"/>
                      </filter>
                      <linearGradient id="paint0_loader" x1="10.8232" y1="5.72879" x2="46.1092" y2="-10.3627" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="#00BDFF"/>
                      </linearGradient>
                      <linearGradient id="paint1_loader" x1="51.5199" y1="14.4" x2="15.1596" y2="31.7874" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="#00BDFF"/>
                      </linearGradient>
                      <linearGradient id="paint2_loader" x1="9.4072" y1="44.1482" x2="44.6932" y2="28.0567" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="#00BDFF"/>
                      </linearGradient>
                      <linearGradient id="paint3_loader" x1="9.4072" y1="44.1482" x2="44.6932" y2="28.0567" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="#00BDFF"/>
                      </linearGradient>
                    </defs>
                    
                    {/* Rotating outer circle with all elements */}
                    <g style={{ transformOrigin: 'center', animation: 'spin 4s linear infinite' }}>
                      {/* Base circle */}
                      <path d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z" fill="#001C56"/>
                      
                      {/* Inner rings */}
                      <path d="M31.9999 57.92C46.3359 57.92 57.9199 46.336 57.9199 32C57.9199 17.664 46.3359 6.07998 31.9999 6.07998C17.6639 6.07998 6.07993 17.664 6.07993 32C6.07992 46.336 17.6639 57.92 31.9999 57.92ZM31.9999 8.19198C45.1839 8.19198 55.8079 18.88 55.8079 32C55.8079 45.12 45.1839 55.808 31.9999 55.808C18.8159 55.808 8.19193 45.184 8.19193 32C8.19193 18.816 18.8159 8.19198 31.9999 8.19198Z" fill="white" fillOpacity="0.48"/>
                      <path d="M32.0001 6.08002C17.6641 6.08002 6.08008 17.664 6.08008 32C6.08008 46.336 17.6641 57.92 32.0001 57.92C46.3361 57.92 57.9201 46.336 57.9201 32C57.9201 17.664 46.3361 6.08002 32.0001 6.08002ZM32.0001 55.808C18.8161 55.808 8.19208 45.12 8.19208 32C8.19208 18.88 18.8161 8.19202 32.0001 8.19202C45.1841 8.19202 55.8081 18.816 55.8081 32C55.8081 45.184 45.1841 55.808 32.0001 55.808Z" fill="white" fillOpacity="0.48"/>
                      
                      {/* Top orbital arc */}
                      <g filter="url(#filter0_loader)">
                        <path d="M11.0776 16.8027C21.3816 2.27466 43.1416 2.14666 54.0856 16.0347C54.9176 16.9947 54.7256 18.4667 53.7016 19.2987C52.6776 20.1307 51.0776 19.8747 50.3736 18.7867C49.4136 17.3147 48.2616 15.9067 46.9176 14.6907C40.2616 8.29066 29.5736 6.75466 21.3176 10.9787C17.9896 12.6427 15.0456 15.0747 12.7416 18.0827C11.9736 19.1067 10.3096 17.9547 11.0776 16.8027Z" fill="url(#paint0_loader)"/>
                      </g>
                      <path d="M11.0776 16.8027C21.3816 2.27466 43.1416 2.14666 54.0856 16.0347C54.9176 16.9947 54.7256 18.4667 53.7016 19.2987C52.6776 20.1307 51.0776 19.8747 50.3736 18.7867C49.4136 17.3147 48.2616 15.9067 46.9176 14.6907C40.2616 8.29066 29.5736 6.75466 21.3176 10.9787C17.9896 12.6427 15.0456 15.0747 12.7416 18.0827C11.9736 19.1067 10.3096 17.9547 11.0776 16.8027Z" fill="url(#paint1_loader)"/>
                      
                      {/* Bottom orbital arc */}
                      <g filter="url(#filter1_loader)">
                        <path d="M52.9925 47.168C42.6885 61.696 20.9285 61.824 9.98454 47.936C9.15254 46.976 9.34454 45.504 10.3685 44.672C11.3925 43.84 12.9925 44.096 13.6965 45.184C14.6565 46.656 15.8085 48.064 17.1525 49.28C23.8085 55.68 34.4965 57.216 42.7525 52.992C46.0805 51.328 49.0245 48.896 51.3285 45.888C52.0965 44.928 53.7605 46.08 52.9925 47.168Z" fill="url(#paint2_loader)"/>
                      </g>
                      <path d="M52.9925 47.168C42.6885 61.696 20.9285 61.824 9.98454 47.936C9.15254 46.976 9.34454 45.504 10.3685 44.672C11.3925 43.84 12.9925 44.096 13.6965 45.184C14.6565 46.656 15.8085 48.064 17.1525 49.28C23.8085 55.68 34.4965 57.216 42.7525 52.992C46.0805 51.328 49.0245 48.896 51.3285 45.888C52.0965 44.928 53.7605 46.08 52.9925 47.168Z" fill="url(#paint3_loader)"/>
                    </g>
                    
                    {/* Center sparkle - pulsating (stays in center) */}
                    <g style={{ transformOrigin: 'center', animation: 'pulse 2s ease-in-out infinite' }}>
                      <path d="M21.248 32L24.192 31.168C27.52 30.208 30.144 27.584 31.104 24.256L31.936 21.312L32.768 24.256C33.728 27.584 36.352 30.208 39.68 31.168L42.624 32L39.68 32.832C36.48 33.856 33.856 36.48 32.832 39.808L32 42.752L31.168 39.808C30.144 36.48 27.52 33.856 24.192 32.832L21.248 32Z" fill="white"/>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Text content */}
            <div className="relative space-y-3">
              <h3 className="text-foreground">Processing Your Requirements</h3>
              
              {/* Scrolling status messages */}
              <div className="min-h-[60px] flex items-center justify-center">
                <div className="relative overflow-hidden h-12 w-full max-w-md">
                  {loadingMessages.map((message, index) => (
                    <div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                      style={{
                        transform: `translateY(${(index - loadingMessageIndex) * 100}%)`,
                        opacity: index === loadingMessageIndex ? 1 : 0,
                      }}
                    >
                      <p className="text-center px-4" style={{ color: 'var(--loader-subtext)' }}>
                        {message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-primary"
                      style={{
                        animation: 'pulse 1.5s ease-in-out infinite',
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Progress bar */}
                <div className="w-full max-w-xs mx-auto h-1 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(((loadingMessageIndex + 1) / loadingMessages.length) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
