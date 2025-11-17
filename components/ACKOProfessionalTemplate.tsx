import React from 'react';
import { Button } from './ui/button';
import { Check } from 'lucide-react';

interface ACKOProfessionalTemplateProps {
  currentStep: number;
  steps: string[];
  showStepper: boolean;
  isSubmitted: boolean;
  handleSubmit: any;
  onSubmit: any;
  handleNext: () => void;
  handlePrevious: () => void;
  renderCurrentStep: () => React.ReactNode;
  coveragePlan: string;
  numTravellers: number;
  currency?: string;
  borderRadius?: 'sharp' | 'rounded' | 'pill';
  spacing?: 'compact' | 'comfortable' | 'spacious';
  stepperType?: 'dots' | 'numbers' | 'progress' | 'breadcrumb';
  inputSize?: 'sm' | 'md' | 'lg';
  startDate?: string;
  endDate?: string;
  destination?: string;
  selectedAddOns?: string[];
  themeColors?: string[];
}

export const ACKOProfessionalTemplate: React.FC<ACKOProfessionalTemplateProps> = ({
  currentStep,
  steps,
  showStepper,
  isSubmitted,
  handleSubmit,
  onSubmit,
  handleNext,
  handlePrevious,
  renderCurrentStep,
  coveragePlan,
  numTravellers,
  currency = 'USD',
  borderRadius = 'rounded',
  spacing = 'comfortable',
  stepperType = 'numbers',
  inputSize = 'md',
  startDate,
  endDate,
  destination,
  selectedAddOns,
  themeColors
}) => {
  if (isSubmitted) {
    return null;
  }

  // Real pricing calculation based on form data
  const calculateTripDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRegionalMultiplier = () => {
    if (!destination) return 1;
    // High-cost regions
    const highCostRegions = ['US', 'CA', 'AU', 'GB', 'FR', 'DE', 'IT', 'ES', 'CH', 'NL', 'SE', 'NO', 'DK'];
    // Medium-cost regions
    const mediumCostRegions = ['JP', 'SG', 'HK', 'NZ', 'KR', 'AE', 'IL'];
    
    if (highCostRegions.includes(destination)) return 1.5;
    if (mediumCostRegions.includes(destination)) return 1.2;
    return 1.0; // Low-cost regions
  };

  const getPlanBasePrice = () => {
    switch(coveragePlan.toLowerCase()) {
      case 'bronze': return 50;
      case 'silver': return 100;
      case 'gold': return 150;
      case 'basic': return 50;
      case 'standard': return 100;
      case 'premium': return 150;
      default: return 100;
    }
  };

  const getAddOnsTotal = () => {
    if (!selectedAddOns || selectedAddOns.length === 0) return 0;
    const addOnPrices: { [key: string]: number } = {
      'adventure': 30,
      'rental': 20,
      'covid': 25,
      'cancel': 40
    };
    return selectedAddOns.reduce((total, addOn) => total + (addOnPrices[addOn] || 0), 0);
  };

  const tripDuration = calculateTripDuration();
  const regionalMultiplier = getRegionalMultiplier();
  const planBasePrice = getPlanBasePrice();
  const addOnsTotal = getAddOnsTotal();
  
  // Calculate base premium: (plan price per day * days * regional multiplier * travellers)
  const basePremiumPerTraveller = tripDuration > 0 
    ? Math.round((planBasePrice / 7) * tripDuration * regionalMultiplier) 
    : planBasePrice;
  const basePremium = basePremiumPerTraveller * (numTravellers || 1);
  const addOnsPremium = addOnsTotal * (numTravellers || 1);
  const subtotal = basePremium + addOnsPremium;
  const gst = Math.round(subtotal * 0.18);
  const totalPrice = subtotal + gst;

  // Get currency symbol
  const getCurrencySymbol = () => {
    switch(currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      case 'AUD': return 'A$';
      case 'CAD': return 'C$';
      default: return '$';
    }
  };

  const currencySymbol = getCurrencySymbol();

  // Configuration helpers
  const getStepCircleSize = () => {
    switch(inputSize) {
      case 'sm': return '36px';
      case 'lg': return '52px';
      default: return '44px';
    }
  };

  const getStepCircleRadius = () => {
    switch(borderRadius) {
      case 'sharp': return '4px';
      case 'pill': return '50%';
      default: return '50%'; // Always circular for stepper
    }
  };

  const getStepGap = () => {
    switch(spacing) {
      case 'compact': return '0.375rem';
      case 'spacious': return '0.75rem';
      default: return '0.5rem';
    }
  };

  const getStepperPadding = () => {
    switch(spacing) {
      case 'compact': return '1rem';
      case 'spacious': return '2rem';
      default: return '1.5rem';
    }
  };

  const circleSize = getStepCircleSize();
  const circleRadius = getStepCircleRadius();
  const stepGap = getStepGap();
  const stepperPadding = getStepperPadding();
  const halfCircleSize = parseInt(circleSize) / 2;

  // Get theme custom properties if themeColors provided
  const getThemeStyles = () => {
    if (!themeColors || themeColors.length === 0) {
      return {};
    }
    return {
      '--theme-primary': themeColors[0],
      '--theme-accent': themeColors[1] || themeColors[0],
    } as React.CSSProperties;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', ...getThemeStyles() }}>
      {/* Horizontal Progress Stepper */}
      {showStepper && (
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border)',
            padding: stepperPadding,
            marginBottom: '1.5rem'
          }}
        >
          {/* Stepper based on type */}
          {stepperType === 'dots' ? (
            // Dots Stepper
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {steps.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: index === currentStep ? '2rem' : '0.75rem',
                      height: '0.75rem',
                      borderRadius: '999px',
                      background: index <= currentStep 
                        ? index === currentStep
                          ? 'var(--primary)'
                          : 'var(--success)'
                        : 'var(--border)',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--muted-foreground)' }}>
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
                </span>
              </div>
            </div>
          ) : stepperType === 'progress' ? (
            // Progress Bar Stepper
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--foreground)' }}>Step {currentStep + 1} of {steps.length}</span>
                <span style={{ color: 'var(--muted-foreground)' }}>{Math.round((currentStep / (steps.length - 1)) * 100)}% Complete</span>
              </div>
              <div 
                style={{ 
                  width: '100%', 
                  backgroundColor: 'var(--muted)', 
                  height: '0.5rem', 
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-input)'
                }}
              >
                <div
                  style={{ 
                    height: '100%',
                    width: `${(currentStep / (steps.length - 1)) * 100}%`,
                    backgroundColor: 'var(--primary)',
                    transition: 'all 0.3s'
                  }}
                />
              </div>
              <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>{steps[currentStep]}</p>
            </div>
          ) : stepperType === 'breadcrumb' ? (
            // Breadcrumb Stepper
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div
                      style={{
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: index === currentStep
                          ? 'var(--primary)'
                          : index < currentStep
                          ? 'var(--success)'
                          : 'var(--muted)',
                        color: index <= currentStep ? 'white' : 'var(--muted-foreground)',
                        borderRadius: 'var(--radius-button)',
                        transition: 'all 0.3s'
                      }}
                    >
                      {index < currentStep && <Check style={{ width: '16px', height: '16px' }} />}
                      <span>{step}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            // Numbers Stepper (default)
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <React.Fragment key={index}>
                    {/* Step Circle */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: stepGap, zIndex: 1, position: 'relative' }}>
                      <div 
                        style={{
                          width: circleSize,
                          height: circleSize,
                          borderRadius: circleRadius,
                          background: index <= currentStep
                            ? isCurrent
                              ? themeColors?.[0] ? 'var(--theme-primary)' : 'var(--primary)'
                              : themeColors?.[0] ? 'var(--theme-primary)' : 'var(--success)'
                            : 'var(--card)',
                          border: index > currentStep ? '2px solid var(--border)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: index <= currentStep ? 'white' : 'var(--muted-foreground)',
                          transition: 'all 0.3s',
                          transform: isCurrent ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        {isCompleted ? (
                          <Check style={{ width: '18px', height: '18px' }} />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <span 
                        style={{
                          fontWeight: isCurrent ? '600' : '400',
                          color: isCurrent ? 'var(--foreground)' : 'var(--muted-foreground)',
                          whiteSpace: 'nowrap',
                          textAlign: 'center'
                        }}
                      >
                        {step}
                      </span>
                    </div>
                    
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div 
                        style={{
                          flex: '1 1 0%',
                          height: '2px',
                          transition: 'all 0.3s',
                          marginLeft: '0.5rem',
                          marginRight: '0.5rem',
                          background: index < currentStep
                            ? 'var(--primary)'
                            : 'var(--border)',
                          marginTop: `-${parseInt(circleSize) / 2 + parseInt(stepGap.replace('rem', '')) * 16}px`,
                          position: 'relative',
                          zIndex: 0
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Two Column Layout */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Left Column - Form Card */}
        <div style={{ flex: '1 1 0%', minWidth: 0 }}>
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border)',
              overflow: 'hidden'
            }}
          >
            {/* Card Header with Step Title */}
            <div 
              style={{
                backgroundColor: 'white',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Check style={{ width: '18px', height: '18px', color: 'white' }} />
                </div>
                <h3 style={{ fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>
                  {steps[currentStep]}
                </h3>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ backgroundColor: 'var(--muted/5)', padding: '1.5rem' }}>
                {renderCurrentStep()}
              </div>

              {/* Navigation Buttons */}
              <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                {currentStep > 0 && (
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    variant="outline"
                    style={{ 
                      height: '36px',
                      borderRadius: 'var(--radius-button)'
                    }}
                  >
                    Back
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    style={{
                      height: '36px',
                      borderRadius: 'var(--radius-button)',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem'
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    style={{
                      height: '36px',
                      borderRadius: 'var(--radius-button)',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem'
                    }}
                  >
                    Complete Purchase
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Price Summary Card */}
        <div style={{ width: '324px', flexShrink: 0 }}>
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border)',
              overflow: 'hidden'
            }}
          >
            {/* Blue Gradient Header */}
            <div 
              style={{
                background: themeColors && themeColors.length > 0 
                  ? 'linear-gradient(to right, var(--theme-primary), var(--theme-accent))'
                  : 'linear-gradient(to right, var(--primary), var(--accent))',
                padding: '1rem',
                color: 'white'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>Price Summary</h3>
            </div>

            {/* Price Details */}
            <div style={{ padding: '1rem' }}>
              {coveragePlan && (
                <>
                  {tripDuration > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>
                        Trip Duration
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--foreground)' }}>{tripDuration} {tripDuration === 1 ? 'day' : 'days'}</span>
                    </div>
                  )}
                  {destination && regionalMultiplier !== 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>
                        Regional Adjustment
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--foreground)' }}>{regionalMultiplier === 1.5 ? '+50%' : '+20%'}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                      Base Premium ({numTravellers || 1} {(numTravellers || 1) === 1 ? 'traveller' : 'travellers'})
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--foreground)' }}>{currencySymbol}{basePremium}</span>
                  </div>
                  {addOnsPremium > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                        Add-ons {selectedAddOns && selectedAddOns.length > 0 ? `(${selectedAddOns.length})` : ''}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--foreground)' }}>{currencySymbol}{addOnsPremium}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Subtotal</span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--foreground)' }}>{currencySymbol}{subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Tax</span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--foreground)' }}>{currencySymbol}{gst}</span>
                  </div>
                  <div 
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '0.75rem',
                      marginTop: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>Total Premium</span>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>{currencySymbol}{totalPrice}</span>
                  </div>
                </>
              )}
            </div>

            {/* Info Section */}
            <div 
              style={{
                backgroundColor: 'color-mix(in srgb, var(--accent) 10%, white)',
                borderTop: '1px solid color-mix(in srgb, var(--accent) 20%, white)',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '12px', color: 'var(--foreground)', lineHeight: '1.4' }}>
                <span style={{ color: 'var(--accent)', fontWeight: '600', flexShrink: 0 }}>Instant policy:</span>
                <span style={{ color: 'var(--muted-foreground)' }}>Your policy will be activated immediately after payment</span>
              </div>
            </div>
          </div>

          {/* Benefits Card */}
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border)',
              padding: '1rem',
              marginTop: '1rem'
            }}
          >
            <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: 'var(--foreground)' }}>Benefits</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['100% Secure Payment', 'Instant Policy Issuance', '24/7 Claim Support'].map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div 
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent)',
                      flexShrink: 0
                    }}
                  />
                  <span style={{ color: 'var(--muted-foreground)' }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};