'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InputRequirementScreen } from '../../components/InputRequirementScreen';

type InputMode = 'text' | 'speech' | 'upload';

function PromptPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get input mode from URL params
  const mode = (searchParams.get('mode') as InputMode) || 'text';
  const [inputMode, setInputMode] = React.useState<InputMode>(mode);
  
  // Get prompt from sessionStorage
  const [initialPrompt, setInitialPrompt] = React.useState<string>('');
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    console.log('🔍 PromptPageContent: useEffect triggered');
    if (typeof window !== 'undefined') {
      // Get mode from URL
      const urlMode = searchParams.get('mode') as InputMode;
      console.log('🔍 PromptPageContent: URL mode:', urlMode);
      if (urlMode && ['text', 'speech', 'upload'].includes(urlMode)) {
        setInputMode(urlMode);
      }
      
      // Get prompt from sessionStorage
      const storedPrompt = sessionStorage.getItem('selectedPrompt');
      console.log('🔍 PromptPageContent: Retrieved from sessionStorage:', storedPrompt);
      if (storedPrompt) {
        console.log('✅ PromptPageContent: Setting initial prompt:', storedPrompt);
        setInitialPrompt(storedPrompt);
        // Clear it after reading so it doesn't persist
        sessionStorage.removeItem('selectedPrompt');
        console.log('🧹 PromptPageContent: Cleared sessionStorage');
      } else {
        console.log('⚠️ PromptPageContent: No prompt found in sessionStorage');
      }
      
      setIsReady(true);
    }
  }, [searchParams]);

  const handleBack = () => {
    router.push('/');
  };

  const handleContinue = async (requirements: string) => {
    // Store requirements in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('requirements', requirements);
    }
    
    // Navigate to builder page
    router.push('/builder');
  };

  // Don't render until we've checked sessionStorage
  if (!isReady) {
    console.log('⏳ PromptPageContent: Not ready yet, returning null');
    return null;
  }

  console.log('✅ PromptPageContent: Rendering with initialPrompt:', initialPrompt);

  return (
    <InputRequirementScreen
      mode={inputMode}
      onBack={handleBack}
      onContinue={handleContinue}
      initialRequirements={initialPrompt}
    />
  );
}

export default function PromptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PromptPageContent />
    </Suspense>
  );
}
