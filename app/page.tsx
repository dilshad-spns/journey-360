'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginScreen } from '../components/LoginScreen';
import { MainPromptScreen } from '../components/MainPromptScreen';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleContinue = (requirements: string) => {
    // Store requirements in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('requirements', requirements);
    }
    
    // Navigate to builder page
    router.push('/builder');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <MainPromptScreen onContinue={handleContinue} />;
}
