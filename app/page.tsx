'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '../components/LandingPage';

type InputMode = 'text' | 'speech' | 'upload';

export default function Home() {
  const router = useRouter();

  const handleSelectMode = (mode: InputMode, prompt?: string) => {
    console.log('✅ handleSelectMode called with:', { mode, prompt });
    
    // Store prompt in sessionStorage if provided
    if (typeof window !== 'undefined' && prompt) {
      try {
        sessionStorage.setItem('selectedPrompt', prompt);
        console.log('✅ Successfully stored prompt in sessionStorage:', prompt);
        
        // Verify it was stored
        const verified = sessionStorage.getItem('selectedPrompt');
        console.log('✅ Verified stored value:', verified);
      } catch (error) {
        console.error('❌ Failed to store in sessionStorage:', error);
      }
    }
    
    // Navigate immediately - sessionStorage is synchronous
    router.push(`/prompt?mode=${mode}`);
  };

  return <LandingPage onSelectMode={handleSelectMode} />;
}
