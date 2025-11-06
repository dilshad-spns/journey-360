import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { TravelInsuranceForm } from './TravelInsuranceForm';

export function StepperTypesDemo() {
  const [selectedType, setSelectedType] = React.useState<'dots' | 'numbers' | 'progress' | 'breadcrumb'>('numbers');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-2">Stepper Types Demo</h1>
          <p className="text-muted-foreground">
            Choose a stepper type to see how it looks in the Travel Insurance Form
          </p>
        </div>

        {/* Stepper Type Selector */}
        <Card className="p-6 mb-8 bg-card border border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-md)' }}>
          <h3 className="text-foreground mb-4">Select Stepper Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['dots', 'numbers', 'progress', 'breadcrumb'] as const).map((type) => (
              <Button
                key={type}
                onClick={() => setSelectedType(type)}
                variant={selectedType === type ? 'default' : 'outline'}
                className={`${
                  selectedType === type 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border bg-card text-foreground'
                } rounded-[var(--radius-button)]`}
              >
                <span className="capitalize">{type}</span>
              </Button>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-muted/50 border border-border" style={{ borderRadius: 'var(--radius)' }}>
            <p className="text-muted-foreground mb-2">Current Selection: <span className="text-primary capitalize">{selectedType}</span></p>
            <div className="text-muted-foreground space-y-1">
              {selectedType === 'dots' && (
                <p><strong>Dots:</strong> Minimalist dot indicators with step labels below</p>
              )}
              {selectedType === 'numbers' && (
                <p><strong>Numbers:</strong> Classic numbered circles with connecting lines and check marks</p>
              )}
              {selectedType === 'progress' && (
                <p><strong>Progress:</strong> Linear progress bar with step indicators and labels above</p>
              )}
              {selectedType === 'breadcrumb' && (
                <p><strong>Breadcrumb:</strong> Hierarchical navigation style with chevron separators</p>
              )}
            </div>
          </div>
        </Card>

        {/* Form with Selected Stepper */}
        <TravelInsuranceForm showStepper={true} stepperType={selectedType} />
      </div>
    </div>
  );
}
