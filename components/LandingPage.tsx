import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Mic, Upload, Sparkles, Clock, ArrowRight, Zap, Shield, Code, Sun, Moon, Frame, Plane, Car, ExternalLink } from 'lucide-react';

interface LandingPageProps {
  onSelectMode: (mode: 'text' | 'speech' | 'upload', prompt?: string) => void;
}

export function LandingPage({ onSelectMode }: LandingPageProps) {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newDarkMode.toString());
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };
  const recentPrompts = [
    `As a traveler,
I want to seamlessly purchase a travel insurance policy through a guided multi-step journey,
So that I can get instant coverage tailored to my trip details and preferences.
Scenario 1: Trip Information Step
Given the user is on the Trip Information page
When the user provides:
- Trip Type (Single / Annual Multi-trip)
- Destination (Worldwide/ Europe/ Asia/South East Asia/ Worldwide excl. USA, Canada, Carribean, Mexico)
- Travel Start Date
- Travel End Date
- Number of Travellers

Then the system should:
- Validate that Travel End Date ≥ Travel Start Date
- Calculate Travel Duration as End Date - Start Date
- Display an error if Travel Duration > 180 days for Single Trip
- Proceed to Traveler Information step on successful validation
Scenario 2: Traveler Information Step
Given the user is on the Traveler Information step
When the user enters for each traveler:
- Full Name (as per passport)
- Date of Birth
- Gender (Male / Female / Other)
- Passport Number
- Nationality
- Relationship to Proposer (Self / Spouse / Child / Parent / Other)
- Pre-existing Medical Conditions (Yes / No, if Yes → add details)
- Address Line 1
- Address Line 2 (optional)
- City / State / Country / ZIP

Then the system should:
- Validate Age within coverage limit (0–70 years)
- Validate Passport Number format as per defined regex pattern
- Allow user to add multiple travelers up to specified limit
- On successful validation, proceed to Coverage & Add-ons step
Scenario 3: Coverage & Add-ons Step
Given the user is on the Coverage and Add-ons step
When the system fetches plan options from IDIT API
Then it should display three boxed plans:
- Bronze
- Silver
- Gold

And when the user selects a plan,
Then the system should:
- Expand the plan box to display Coverage Inclusions and Exclusions fetched from API
- Allow selection of add-ons if applicable
- Recalculate premium dynamically based on chosen plan and add-ons
- Enable "Proceed to Review" once selection is confirmed
Scenario 4: Review & Payment Step
Given the user is on the Review & Payment step
When the system displays a collapsible summary of trip, traveler, and plan details
And the user selects a Payment Method (Credit/Debit Card, Net Banking, UPI, Wallet, Pay Later)
And checks the Declaration Checkbox confirming data accuracy

Then the system should:
- Validate declaration checkbox is checked before proceeding
- Initiate the selected payment flow
- Upon successful payment, call Policy Issuance API
- Display generated Policy Number and Download Link
Scenario 5: Confirmation Step
Given payment and policy issuance are successful
Then the system should display:
- Policy Number
- Download Policy PDF Button
- Email/SMS Confirmation Summary
- Trip Assistance Helpline Information

And store transaction and policy details in backend for audit and retrieval.
Non-Functional / System Notes
- All steps should be responsive, lightweight, and compatible with browser and mobile viewports.
- Validation messages must be concise and inline.
- Progress indicator (e.g., 1/5 steps) should persist throughout the journey.
- API failures should trigger graceful fallback with user-friendly messages.`,
    'Create "Death Claim Journey" for Universal Life Product — North America Agent Portal. Design a complete 4-step journey flow for the "Death Claim Submission" process inside the North America Agent Portal for the Universal Life (UL) product. This journey allows insurance agents to submit death claims on behalf of existing clients with Claim Main Details (Request Date auto-populated, Effective Date picker, Primary Medical Reason dropdown), Required Documents (table with upload functionality, status tracking, received dates), Claim Assessment (dynamic questionnaire from Decisionator with approval/referral/rejection logic), and Payment Details (payee selection, payment percentage, bank details confirmation). Include success screen with Claim ID, status badges, and note-taking capability.',
    'Build a complete life insurance quote and buy journey with personal information collection, health questionnaire with conditional logic, beneficiary designation, coverage amount calculator based on income and dependents, policy comparison across term life and whole life options, underwriting document upload, payment setup with automatic premium scheduling, and digital policy delivery',
    'Design an end-to-end insurance claim submission journey featuring incident details capture with date/time/location, damage assessment with photo upload capabilities, witness information collection, police report attachment, repair estimate submission, claim amount calculation, supporting documentation management, adjuster assignment workflow, and real-time claim status tracking with notification preferences',
  ];

  const inputModes = [
    {
      id: 'text' as const,
      title: 'Paste User Story',
      description: 'Paste your user story requirements directly',
      icon: FileText,
      gradient: 'from-accent/10 to-accent/5',
      iconColor: 'text-accent-foreground',
      iconBg: 'bg-accent',
    },
    {
      id: 'speech' as const,
      title: 'Narrate User Story',
      description: 'Speak your user story using voice input',
      icon: Mic,
      gradient: 'from-purple/10 to-purple/5',
      iconColor: 'text-purple-foreground',
      iconBg: 'bg-purple',
    },
    {
      id: 'upload' as const,
      title: 'Upload Requirement Document',
      description: 'Upload a requirement document file to auto-generate your form',
      icon: Upload,
      gradient: 'from-success/10 to-success/5',
      iconColor: 'text-success-foreground',
      iconBg: 'bg-success',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate complete forms in seconds',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Shield,
      title: 'Production Ready',
      description: 'Built-in validations and error handling',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Code,
      title: 'Test Included',
      description: 'Unit tests generated automatically',
      color: 'text-purple',
      bgColor: 'bg-purple/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--color-border)) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      
      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple/20 to-accent/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Dark Mode Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDarkMode}
          className="rounded-[var(--radius-button)] bg-card border border-border hover:bg-secondary hover:border-primary transition-all shadow-[var(--elevation-sm)]"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-foreground" />
          ) : (
            <Moon className="h-5 w-5 text-foreground" />
          )}
        </Button>
      </div>
      
      <div className="relative container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-5xl mx-auto">
          {/* Logo and Badge */}
          <div className="inline-flex flex-col items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-[var(--radius-card)] blur-2xl scale-110" />
              <div className="relative h-24 w-24 rounded-[var(--radius-card)] bg-[rgba(255,255,255,0)] flex items-center justify-center">
                <svg width="72" height="72" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z" fill="#001C56"/>
                  <path d="M31.9999 57.92C46.3359 57.92 57.9199 46.336 57.9199 32C57.9199 17.664 46.3359 6.07998 31.9999 6.07998C17.6639 6.07998 6.07993 17.664 6.07993 32C6.07992 46.336 17.6639 57.92 31.9999 57.92ZM31.9999 8.19198C45.1839 8.19198 55.8079 18.88 55.8079 32C55.8079 45.12 45.1839 55.808 31.9999 55.808C18.8159 55.808 8.19193 45.184 8.19193 32C8.19193 18.816 18.8159 8.19198 31.9999 8.19198Z" fill="white" fillOpacity="0.48"/>
                  <path d="M32.0001 6.08002C17.6641 6.08002 6.08008 17.664 6.08008 32C6.08008 46.336 17.6641 57.92 32.0001 57.92C46.3361 57.92 57.9201 46.336 57.9201 32C57.9201 17.664 46.3361 6.08002 32.0001 6.08002ZM32.0001 55.808C18.8161 55.808 8.19208 45.12 8.19208 32C8.19208 18.88 18.8161 8.19202 32.0001 8.19202C45.1841 8.19202 55.8081 18.816 55.8081 32C55.8081 45.184 45.1841 55.808 32.0001 55.808Z" fill="white" fillOpacity="0.48"/>
                  <path d="M21.248 32L24.192 31.168C27.52 30.208 30.144 27.584 31.104 24.256L31.936 21.312L32.768 24.256C33.728 27.584 36.352 30.208 39.68 31.168L42.624 32L39.68 32.832C36.48 33.856 33.856 36.48 32.832 39.808L32 42.752L31.168 39.808C30.144 36.48 27.52 33.856 24.192 32.832L21.248 32Z" fill="white"/>
                  <g filter="url(#filter0_f_12458_194518)">
                    <path d="M11.0776 16.8027C21.3816 2.27466 43.1416 2.14666 54.0856 16.0347C54.9176 16.9947 54.7256 18.4667 53.7016 19.2987C52.6776 20.1307 51.0776 19.8747 50.3736 18.7867C49.4136 17.3147 48.2616 15.9067 46.9176 14.6907C40.2616 8.29066 29.5736 6.75466 21.3176 10.9787C17.9896 12.6427 15.0456 15.0747 12.7416 18.0827C11.9736 19.1067 10.3096 17.9547 11.0776 16.8027Z" fill="url(#paint0_linear_12458_194518)"/>
                  </g>
                  <path d="M11.0776 16.8027C21.3816 2.27466 43.1416 2.14666 54.0856 16.0347C54.9176 16.9947 54.7256 18.4667 53.7016 19.2987C52.6776 20.1307 51.0776 19.8747 50.3736 18.7867C49.4136 17.3147 48.2616 15.9067 46.9176 14.6907C40.2616 8.29066 29.5736 6.75466 21.3176 10.9787C17.9896 12.6427 15.0456 15.0747 12.7416 18.0827C11.9736 19.1067 10.3096 17.9547 11.0776 16.8027Z" fill="url(#paint1_linear_12458_194518)"/>
                  <g filter="url(#filter1_f_12458_194518)">
                    <path d="M52.9925 47.168C42.6885 61.696 20.9285 61.824 9.98454 47.936C9.15254 46.976 9.34454 45.504 10.3685 44.672C11.3925 43.84 12.9925 44.096 13.6965 45.184C14.6565 46.656 15.8085 48.064 17.1525 49.28C23.8085 55.68 34.4965 57.216 42.7525 52.992C46.0805 51.328 49.0245 48.896 51.3285 45.888C52.0965 44.928 53.7605 46.08 52.9925 47.168Z" fill="url(#paint2_linear_12458_194518)"/>
                  </g>
                  <path d="M52.9925 47.168C42.6885 61.696 20.9285 61.824 9.98454 47.936C9.15254 46.976 9.34454 45.504 10.3685 44.672C11.3925 43.84 12.9925 44.096 13.6965 45.184C14.6565 46.656 15.8085 48.064 17.1525 49.28C23.8085 55.68 34.4965 57.216 42.7525 52.992C46.0805 51.328 49.0245 48.896 51.3285 45.888C52.0965 44.928 53.7605 46.08 52.9925 47.168Z" fill="url(#paint3_linear_12458_194518)"/>
                  <defs>
                    <filter id="filter0_f_12458_194518" x="9.87988" y="4.76001" width="45.7266" height="16.0312" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                      <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur_12458_194518"/>
                    </filter>
                    <filter id="filter1_f_12458_194518" x="8.46387" y="43.1794" width="45.7266" height="16.0312" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                      <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur_12458_194518"/>
                    </filter>
                    <linearGradient id="paint0_linear_12458_194518" x1="10.8232" y1="5.72879" x2="46.1092" y2="-10.3627" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white"/>
                      <stop offset="1" stopColor="#00BDFF"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_12458_194518" x1="51.5199" y1="14.4" x2="15.1596" y2="31.7874" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white"/>
                      <stop offset="1" stopColor="#00BDFF"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_12458_194518" x1="9.4072" y1="44.1482" x2="44.6932" y2="28.0567" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white"/>
                      <stop offset="1" stopColor="#00BDFF"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_12458_194518" x1="9.4072" y1="44.1482" x2="44.6932" y2="28.0567" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white"/>
                      <stop offset="1" stopColor="#00BDFF"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-[var(--radius-pill)]">
              <Sparkles className="h-2.5 w-2.5 text-accent" />
              <span className="text-accent">AI-Powered</span>
            </div>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-foreground">
              Journey 360
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Transform your ideas into production-ready journeys with AI. Choose your preferred input method and watch as we build complete forms with UI, data bindings, validations, mock APIs, and comprehensive unit tests—all in seconds.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${feature.bgColor} border border-border rounded-[var(--radius-pill)] transition-all duration-300 hover:scale-105 hover:shadow-[var(--elevation-sm)]`}
                >
                  <Icon className={`h-3.5 w-3.5 ${feature.color}`} />
                  <span className={feature.color}>{feature.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {inputModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card
                key={mode.id}
                className="group relative p-6 bg-card border border-border rounded-[var(--radius-card)] hover:border-primary hover:shadow-[var(--elevation-lg)] transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => onSelectMode(mode.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectMode(mode.id);
                  }
                }}
                aria-label={`${mode.title}: ${mode.description}`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative flex flex-col h-full">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`inline-flex h-14 w-14 rounded-[var(--radius-card)] ${mode.iconBg} items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[var(--elevation-md)]`} aria-hidden="true">
                      <Icon className={`h-7 w-7 ${mode.iconColor}`} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow space-y-2 mb-5">
                    <h3 className="text-foreground text-[16px] font-bold">{mode.title}</h3>
                    <p className="text-muted-foreground text-[14px]">{mode.description}</p>
                  </div>
                  
                  {/* CTA Button */}
                  <Button
                    className="w-full bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-[var(--color-primary-hover)] transition-all group-hover:translate-x-1 duration-300 flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMode(mode.id);
                    }}
                    aria-label={`Get started with ${mode.title}`}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Prompts Section */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-[var(--radius-card)] p-6 shadow-[var(--elevation-md)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-[var(--radius)] bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-foreground font-bold">Recent Prompts</h3>
              </div>
              <Badge className="bg-accent/10 text-accent border-accent/20 rounded-[var(--radius-pill)] px-2 py-0.5">
                Quick Start
              </Badge>
            </div>
            
            {/* Prompts List */}
            <div className="space-y-3">
              {recentPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log('🎯 LandingPage: Button clicked with prompt:', prompt);
                    onSelectMode('text', prompt);
                  }}
                  className="text-left w-full p-4 bg-background/80 border border-border rounded-[var(--radius-card)] hover:border-primary hover:bg-primary/5 hover:shadow-[var(--elevation-sm)] transition-all duration-300 group"
                  aria-label={`Use recent prompt: ${prompt}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-2 w-2 rounded-full bg-accent group-hover:bg-primary group-hover:scale-125 transition-all flex-shrink-0" />
                      <p className="text-foreground group-hover:text-primary transition-colors truncate">
                        {prompt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <span className="text-primary">Use</span>
                      <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
