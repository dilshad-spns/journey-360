import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar, MapPin, Users, Check, Shield, Plane, Heart, Home, Sparkles, ChevronRight } from 'lucide-react';

interface TravelInsuranceFormCreativeProps {
  showStepper?: boolean;
  stepperType?: 'dots' | 'numbers' | 'progress' | 'breadcrumb';
  borderRadius?: 'sharp' | 'rounded' | 'pill';
  spacing?: 'compact' | 'comfortable' | 'spacious';
  labelPosition?: 'top' | 'left' | 'inline';
  inputSize?: 'sm' | 'md' | 'lg';
  template?: 'simple' | 'two-column' | 'carded';
  themeColors?: string[];
  templateStyle?: string;
  onFormDataChange?: (data: any) => void;
  wizardStep?: number;
  onWizardStepChange?: (step: number) => void;
}

export function TravelInsuranceFormCreative({
  showStepper = true,
  stepperType = 'numbers',
  borderRadius = 'rounded',
  spacing = 'comfortable',
  labelPosition = 'top',
  inputSize = 'md',
  template = 'simple',
  themeColors,
  onFormDataChange,
  wizardStep = 0,
  onWizardStepChange,
}: TravelInsuranceFormCreativeProps) {
  const [internalStep, setInternalStep] = useState(0);
  
  // Use external step if provided, otherwise use internal
  const currentStep = wizardStep !== undefined ? wizardStep : internalStep;
  const setCurrentStep = onWizardStepChange || setInternalStep;
  
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  
  const steps = [
    'Basic details',
    'Plan page',
    'Traveller details',
    'Payment',
    "You're Done!"
  ];

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    fullName: '',
    email: '',
    phone: '',
    passportNumber: '',
  });

  // Update internal step when wizardStep prop changes
  useEffect(() => {
    if (wizardStep !== undefined) {
      setInternalStep(wizardStep);
    }
  }, [wizardStep]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleInputChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onFormDataChange?.(updated);
  };

  const handleStartNewQuote = () => {
    // Reset form data to initial state
    const resetData = {
      destination: '',
      startDate: '',
      endDate: '',
      travelers: 1,
      fullName: '',
      email: '',
      phone: '',
      passportNumber: '',
    };
    setFormData(resetData);
    onFormDataChange?.(resetData);
    
    // Reset to first step
    setCurrentStep(0);
    
    // Reset selected plan to default
    setSelectedPlan('premium');
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '₹1,250',
      coverage: '₹2,50,000',
      deductible: '₹500',
      badge: null,
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '₹2,499',
      coverage: '₹10,00,000',
      deductible: '₹250',
      badge: 'BEST CHOICE',
      badgeColor: 'bg-emerald-500',
      color: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-300',
    },
    {
      id: 'platinum',
      name: 'Platinum Plan',
      price: '₹4,999',
      coverage: '₹25,00,000',
      deductible: '₹0',
      badge: '₹250 DEDUCTIBLE',
      badgeColor: 'bg-purple-500',
      color: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
    },
  ];

  const benefits = [
    { icon: Shield, label: 'Medical Coverage', description: 'Up to coverage amount' },
    { icon: Plane, label: 'Flight Cancellation', description: 'Get refund on cancellations' },
    { icon: Heart, label: 'Emergency Assistance', description: '24/7 support worldwide' },
    { icon: Home, label: 'Baggage Protection', description: 'Lost baggage coverage' },
  ];

  // Helper functions
  const getFieldGap = () => {
    switch (spacing) {
      case 'compact': return '0.75rem';
      case 'comfortable': return '1rem';
      case 'spacious': return '1.5rem';
      default: return '1rem';
    }
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case 'compact': return 'space-y-3';
      case 'comfortable': return 'space-y-4';
      case 'spacious': return 'space-y-6';
      default: return 'space-y-4';
    }
  };

  const getInputHeight = () => {
    switch (inputSize) {
      case 'sm': return '36px';
      case 'md': return '40px';
      case 'lg': return '48px';
      default: return '40px';
    }
  };

  const getInputSizeClass = () => {
    switch (inputSize) {
      case 'sm': return 'h-9';
      case 'md': return 'h-10';
      case 'lg': return 'h-12';
      default: return 'h-10';
    }
  };

  const getInputBorderRadius = () => {
    switch (borderRadius) {
      case 'sharp': return '0px';
      case 'rounded': return 'var(--radius-input)';
      case 'pill': return '9999px';
      default: return 'var(--radius-input)';
    }
  };

  const getButtonBorderRadius = () => {
    switch (borderRadius) {
      case 'sharp': return '0px';
      case 'rounded': return 'var(--radius-button)';
      case 'pill': return '9999px';
      default: return 'var(--radius-button)';
    }
  };

  const getBorderRadiusClass = () => {
    switch (borderRadius) {
      case 'sharp': return 'rounded-none';
      case 'rounded': return 'rounded-[var(--radius-input)]';
      case 'pill': return 'rounded-full';
      default: return 'rounded-[var(--radius-input)]';
    }
  };

  const getCardBorderRadius = () => {
    switch (borderRadius) {
      case 'sharp': return '0px';
      case 'rounded': return 'var(--radius-card)';
      case 'pill': return '24px';
      default: return 'var(--radius-card)';
    }
  };

  // Stepper renderers
  const renderProgress = () => {
    if (!showStepper) return null;

    const progressPercent = ((currentStep) / (steps.length - 1)) * 100;

    // Dots Stepper
    if (stepperType === 'dots') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className="transition-all duration-300"
                style={{
                  width: index === currentStep ? '2rem' : '0.75rem',
                  height: '0.75rem',
                  borderRadius: '999px',
                  background: index <= currentStep 
                    ? index === currentStep
                      ? themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
                      : 'var(--success)'
                    : 'var(--border)'
                }}
              />
            ))}
          </div>
          <div className="text-center">
            <span className="text-foreground">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </span>
          </div>
        </div>
      );
    }

    // Progress Bar Stepper
    if (stepperType === 'progress') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
          <div className="flex justify-between items-center">
            <span className="text-foreground">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-muted-foreground">{Math.round(progressPercent)}% Complete</span>
          </div>
          <div 
            className="w-full bg-muted h-2 overflow-hidden"
            style={{ borderRadius: getInputBorderRadius() }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{ 
                width: `${progressPercent}%`,
                backgroundColor: themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
              }}
            />
          </div>
          <p className="text-muted-foreground">{steps[currentStep]}</p>
        </div>
      );
    }

    // Breadcrumb Stepper
    if (stepperType === 'breadcrumb') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
          <div className="flex items-center justify-center flex-wrap gap-2">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className="px-3 py-2 flex items-center gap-2 transition-all duration-300"
                  style={{
                    background: index === currentStep
                      ? themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
                      : index < currentStep
                      ? 'var(--success)'
                      : 'var(--muted)',
                    color: index <= currentStep ? 'white' : 'var(--muted-foreground)',
                    borderRadius: getButtonBorderRadius()
                  }}
                >
                  {index < currentStep && <Check className="w-4 h-4" />}
                  <span className="hidden sm:inline">{step}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }

    // Numbers Stepper (default)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
        {/* Circle Connector Stepper */}
        <div className="flex items-center relative">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <div className="flex flex-col items-center gap-2 relative z-10 flex-1">
                <div
                  className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                    index === currentStep ? 'scale-110' : ''
                  }`}
                  style={{
                    background: index <= currentStep
                      ? index === currentStep
                        ? themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
                        : 'var(--success)'
                      : 'var(--card)',
                    border: index > currentStep ? '2px solid var(--border)' : 'none',
                    borderRadius: borderRadius === 'sharp' ? '0px' : '50%'
                  }}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={index === currentStep ? 'text-white' : 'text-muted-foreground'}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <span className={`text-xs text-center max-w-[80px] hidden sm:block ${
                  index === currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div 
                  className="h-0.5 transition-all duration-300"
                  style={{
                    flex: '1',
                    background: index < currentStep
                      ? themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
                      : 'var(--border)',
                    marginTop: '-24px',
                    marginLeft: '8px',
                    marginRight: '8px'
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Field wrapper for label positioning
  const FieldWrapper = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => {
    if (labelPosition === 'left') {
      return (
        <div className="flex items-start gap-4">
          <Label className="text-foreground" style={{ 
            width: '180px', 
            flexShrink: 0,
            paddingTop: '0.5rem'
          }}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <div className="flex-1">{children}</div>
        </div>
      );
    }

    if (labelPosition === 'inline') {
      return (
        <div className="flex items-center gap-4">
          <Label className="text-foreground" style={{ width: '180px', flexShrink: 0 }}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <div className="flex-1">{children}</div>
        </div>
      );
    }

    // Default: top
    return (
      <div>
        <Label className="text-foreground mb-2 block">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {children}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic details
        return (
          <div className={getSpacingClass()}>
            <FieldWrapper label="Where are you traveling?" required>
              <Input
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                placeholder="Enter destination"
                style={{ height: getInputHeight() }}
              />
            </FieldWrapper>
            
            <div className="grid grid-cols-2 gap-4">
              <FieldWrapper label="Start Date" required>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                  style={{ height: getInputHeight() }}
                />
              </FieldWrapper>
              <FieldWrapper label="End Date" required>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                  style={{ height: getInputHeight() }}
                />
              </FieldWrapper>
            </div>

            <FieldWrapper label="Number of Travelers" required>
              <Input
                type="number"
                value={formData.travelers}
                onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                style={{ height: getInputHeight() }}
                min="1"
              />
            </FieldWrapper>
          </div>
        );

      case 1: // Plan page
        return (
          <div className={getSpacingClass()}>
            <h3 className="text-foreground mb-4">Choose Your Plan</h3>
            <div className="space-y-3">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedPlan === plan.id 
                      ? `${plan.borderColor} border-2 bg-gradient-to-br ${plan.color}` 
                      : 'border border-border bg-card hover:border-foreground/20'
                  }`}
                  style={{ borderRadius: getCardBorderRadius() }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-foreground">{plan.name}</h4>
                        {plan.badge && (
                          <Badge className={`${plan.badgeColor} text-white border-0 px-2 py-0.5 text-[10px]`}>
                            {plan.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{plan.price} / trip</p>
                    </div>
                    {selectedPlan === plan.id && (
                      <div 
                        className="h-5 w-5 flex items-center justify-center"
                        style={{ 
                          borderRadius: '50%',
                          backgroundColor: themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
                        }}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coverage:</span>
                      <span className="text-foreground">{plan.coverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deductible:</span>
                      <span className="text-foreground">{plan.deductible}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2: // Traveller details
        return (
          <div className={getSpacingClass()}>
            <FieldWrapper label="Full Name" required>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                placeholder="Enter full name"
                style={{ height: getInputHeight() }}
              />
            </FieldWrapper>

            <FieldWrapper label="Email Address" required>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                placeholder="your@email.com"
                style={{ height: getInputHeight() }}
              />
            </FieldWrapper>

            <FieldWrapper label="Phone Number" required>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                placeholder="+91 1234567890"
                style={{ height: getInputHeight() }}
              />
            </FieldWrapper>

            <FieldWrapper label="Passport Number" required>
              <Input
                value={formData.passportNumber}
                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                placeholder="Enter passport number"
                style={{ height: getInputHeight() }}
              />
            </FieldWrapper>
          </div>
        );

      case 3: // Payment
        return (
          <div className={getSpacingClass()}>
            <h3 className="text-foreground mb-4">Payment Information</h3>
            <FieldWrapper label="Card Number" required>
              <Input
                placeholder="1234 5678 9012 3456"
                className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                style={{ height: getInputHeight() }}
              />
            </FieldWrapper>

            <div className="grid grid-cols-2 gap-4">
              <FieldWrapper label="Expiry Date" required>
                <Input
                  placeholder="MM/YY"
                  className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                  style={{ height: getInputHeight() }}
                />
              </FieldWrapper>
              <FieldWrapper label="CVV" required>
                <Input
                  placeholder="123"
                  className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                  style={{ height: getInputHeight() }}
                  maxLength={3}
                />
              </FieldWrapper>
            </div>

            <FieldWrapper label="Cardholder Name" required>
              <Input
                placeholder="Name on card"
                className={`${getInputSizeClass()} ${getBorderRadiusClass()} bg-background border-border`}
                style={{ height: getInputHeight() }}
              />
            </FieldWrapper>
          </div>
        );

      case 4: // Success
        return (
          <div className="text-center py-8">
            <div className="mb-4 flex justify-center">
              <div 
                className="h-16 w-16 flex items-center justify-center"
                style={{
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)'
                }}
              >
                <Check className="h-8 w-8" style={{ color: 'rgb(34, 197, 94)' }} />
              </div>
            </div>
            <h3 className="text-foreground mb-2">You're All Set!</h3>
            <p className="text-muted-foreground mb-4">
              Your travel insurance has been successfully purchased.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Confirmation email sent to {formData.email || 'your email'}
            </p>
            <Button
              onClick={handleStartNewQuote}
              className="text-white"
              style={{
                height: getInputHeight(),
                borderRadius: getButtonBorderRadius(),
                backgroundColor: themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
              }}
            >
              Start New Quote
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  // Apply theme colors to CSS variables if provided
  useEffect(() => {
    if (themeColors && themeColors.length > 0) {
      document.documentElement.style.setProperty('--theme-primary', themeColors[0]);
      if (themeColors[1]) {
        document.documentElement.style.setProperty('--theme-secondary', themeColors[1]);
      }
      if (themeColors[2]) {
        document.documentElement.style.setProperty('--theme-accent', themeColors[2]);
      }
    }
    return () => {
      document.documentElement.style.removeProperty('--theme-primary');
      document.documentElement.style.removeProperty('--theme-secondary');
      document.documentElement.style.removeProperty('--theme-accent');
    };
  }, [themeColors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Stepper */}
        {renderProgress()}

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Card 
              className="p-6 bg-card border-border shadow-lg"
              style={{ borderRadius: getCardBorderRadius() }}
            >
              {renderStepContent()}

              {/* Navigation Buttons */}
              {currentStep < steps.length - 1 && (
                <div className="flex gap-3 mt-6">
                  {currentStep > 0 && (
                    <Button
                      onClick={() => handleStepChange(currentStep - 1)}
                      variant="outline"
                      className="flex-1"
                      style={{
                        height: getInputHeight(),
                        borderRadius: getButtonBorderRadius()
                      }}
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    onClick={() => handleStepChange(currentStep + 1)}
                    className="flex-1 text-white"
                    style={{
                      height: getInputHeight(),
                      borderRadius: getButtonBorderRadius(),
                      backgroundColor: themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
                    }}
                  >
                    {currentStep === steps.length - 2 ? 'Complete' : 'Next'}
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Summary & Benefits */}
          <div className="space-y-6">
            {/* Trip Summary */}
            <Card 
              className="p-5 bg-card border-border shadow-lg"
              style={{ borderRadius: getCardBorderRadius() }}
            >
              <h4 className="text-foreground mb-4 flex items-center gap-2">
                <Sparkles 
                  className="h-4 w-4"
                  style={{ color: themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)' }}
                />
                Trip Summary
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="text-foreground">{formData.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Travel Dates</p>
                    <p className="text-foreground text-sm">
                      {formData.startDate} - {formData.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Travelers</p>
                    <p className="text-foreground">{formData.travelers} {formData.travelers === 1 ? 'person' : 'people'}</p>
                  </div>
                </div>
              </div>

              {selectedPlan && currentStep >= 1 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Selected Plan</p>
                    <p className="text-foreground">
                      {plans.find(p => p.id === selectedPlan)?.name}
                    </p>
                    <p 
                      className="mt-1"
                      style={{ color: themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)' }}
                    >
                      {plans.find(p => p.id === selectedPlan)?.price}
                    </p>
                  </div>
                </>
              )}
            </Card>

            {/* Benefits Cards */}
            {currentStep >= 1 && (
              <Card 
                className="p-5 bg-card border-border shadow-lg"
                style={{ borderRadius: getCardBorderRadius() }}
              >
                <h4 className="text-foreground mb-4">What's Covered</h4>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 bg-muted/50"
                      style={{ borderRadius: getInputBorderRadius() }}
                    >
                      <div 
                        className="h-8 w-8 flex items-center justify-center shrink-0"
                        style={{
                          borderRadius: getInputBorderRadius(),
                          backgroundColor: themeColors?.[0] ? `${themeColors[0]}1A` : 'rgba(var(--primary), 0.1)'
                        }}
                      >
                        <benefit.icon 
                          className="h-4 w-4"
                          style={{ color: themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-sm">{benefit.label}</p>
                        <p className="text-muted-foreground text-xs">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}