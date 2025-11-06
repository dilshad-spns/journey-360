import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormSchema, FieldSchema, ValidationRule } from '../types/schema';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Alert } from './ui/alert';
import { LayoutGrid, CheckCircle2, AlertCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface FormRendererProps {
  schema: FormSchema | null;
  onFormDataChange?: (data: Record<string, any>) => void;
  template?: 'simple' | 'two-column' | 'carded';
  themeColors?: string[];
  highlightRequired?: boolean;
  showStepper?: boolean;
  wizardStep?: number;
  onWizardStepChange?: (step: number) => void;
  borderRadius?: 'sharp' | 'rounded' | 'pill';
  spacing?: 'compact' | 'comfortable' | 'spacious';
  stepperType?: 'dots' | 'numbers' | 'progress' | 'breadcrumb';
  labelPosition?: 'top' | 'left' | 'inline';
  inputSize?: 'sm' | 'md' | 'lg';
}

export function FormRenderer({ 
  schema, 
  onFormDataChange, 
  template = 'simple', 
  themeColors,
  highlightRequired = false,
  showStepper = false,
  wizardStep: externalWizardStep,
  onWizardStepChange,
  borderRadius = 'rounded',
  spacing = 'comfortable',
  stepperType = 'progress',
  labelPosition = 'top',
  inputSize = 'md'
}: FormRendererProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [internalWizardStep, setInternalWizardStep] = useState(0);
  
  // Use external wizard step if provided, otherwise use internal
  const wizardStep = externalWizardStep !== undefined ? externalWizardStep : internalWizardStep;
  const setWizardStep = onWizardStepChange || setInternalWizardStep;

  // Reset wizard step when template changes
  React.useEffect(() => {
    setWizardStep(0);
  }, [template]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  // Use watch subscription instead of watching all fields to prevent re-renders
  React.useEffect(() => {
    if (!onFormDataChange) return;

    const subscription = watch((formData) => {
      onFormDataChange(formData);
    });

    return () => subscription.unsubscribe();
  }, []); // Empty dependency array - watch and onFormDataChange are stable references

  if (!schema) {
    return (
      <Card className="p-12 bg-card border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
        <div className="text-center text-muted-foreground">
          <div className="h-16 w-16 mx-auto mb-4 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center">
            <LayoutGrid className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2">No form to render</h3>
          <p>Generate a schema first to see the form preview</p>
        </div>
      </Card>
    );
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly simulate success/failure (90% success rate)
      if (Math.random() > 0.1) {
        console.log('Form submitted:', data);
        setSubmitSuccess(true);
        toast.success(schema.successMessage || 'Form submitted successfully!');
        setTimeout(() => {
          reset();
          setSubmitSuccess(false);
        }, 3000);
      } else {
        throw new Error('Simulated submission error');
      }
    } catch (error) {
      setSubmitError(schema.errorMessage || 'Failed to submit form. Please try again.');
      toast.error(schema.errorMessage || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create scoped theme style object
  const getThemeStyle = (): React.CSSProperties => {
    if (themeColors && themeColors.length >= 2) {
      return {
        '--primary': themeColors[0],
        '--primary-foreground': 'rgba(255, 255, 255, 1)',
        '--accent': themeColors[1],
        '--accent-foreground': 'rgba(255, 255, 255, 1)',
        '--ring': themeColors[0],
      } as React.CSSProperties;
    }
    return {};
  };

  // Helper functions for UI configuration
  const getRadiusClass = () => {
    switch (borderRadius) {
      case 'sharp': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: return 'rounded-[var(--radius-input)]';
    }
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case 'compact': return 'space-y-3';
      case 'spacious': return 'space-y-8';
      default: return 'space-y-6';
    }
  };

  const getFieldSpacingClass = () => {
    switch (spacing) {
      case 'compact': return 'space-y-1';
      case 'spacious': return 'space-y-3';
      default: return 'space-y-2';
    }
  };

  const getInputSizeClass = () => {
    switch (inputSize) {
      case 'sm': return 'h-8 text-sm';
      case 'lg': return 'h-12';
      default: return 'h-10';
    }
  };

  const getValidationRules = (validations?: ValidationRule[]) => {
    if (!validations) return {};

    const rules: any = {};

    validations.forEach(validation => {
      switch (validation.type) {
        case 'required':
          rules.required = validation.message;
          break;
        case 'minLength':
          rules.minLength = {
            value: validation.value,
            message: validation.message,
          };
          break;
        case 'maxLength':
          rules.maxLength = {
            value: validation.value,
            message: validation.message,
          };
          break;
        case 'min':
          rules.min = {
            value: validation.value,
            message: validation.message,
          };
          break;
        case 'max':
          rules.max = {
            value: validation.value,
            message: validation.message,
          };
          break;
        case 'email':
          rules.pattern = {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: validation.message,
          };
          break;
        case 'url':
          rules.pattern = {
            value: /^https?:\/\/.+\..+/i,
            message: validation.message,
          };
          break;
        case 'pattern':
          if (validation.value) {
            rules.pattern = {
              value: new RegExp(validation.value as string),
              message: validation.message,
            };
          }
          break;
      }
    });

    return rules;
  };

  const renderFieldWrapper = (
    field: FieldSchema,
    label: React.ReactNode,
    input: React.ReactNode,
    description?: React.ReactNode,
    error?: React.ReactNode
  ) => {
    const isRequired = field.validations?.some(v => v.type === 'required');
    const shouldHighlight = highlightRequired && isRequired;
    
    if (labelPosition === 'left') {
      return (
        <div key={field.id} className={`flex gap-4 items-start ${shouldHighlight ? 'p-3 bg-primary/5 border-2 border-primary rounded-[var(--radius)] animate-in fade-in-50' : ''}`}>
          <div className="w-1/3 pt-2">
            {label}
          </div>
          <div className={`flex-1 ${getFieldSpacingClass()}`}>
            {input}
            {description}
            {error}
          </div>
        </div>
      );
    }

    if (labelPosition === 'inline') {
      return (
        <div key={field.id} className={`flex items-center gap-3 ${shouldHighlight ? 'p-3 bg-primary/5 border-2 border-primary rounded-[var(--radius)] animate-in fade-in-50' : ''}`}>
          <div className="min-w-[120px]">
            {label}
          </div>
          <div className={`flex-1 ${getFieldSpacingClass()}`}>
            {input}
            {description}
            {error}
          </div>
        </div>
      );
    }

    // Default 'top' position
    return (
      <div key={field.id} className={`${getFieldSpacingClass()} ${shouldHighlight ? 'p-3 bg-primary/5 border-2 border-primary rounded-[var(--radius)] animate-in fade-in-50' : ''}`}>
        {label}
        {input}
        {description}
        {error}
      </div>
    );
  };

  const renderField = (field: FieldSchema) => {
    const validationRules = getValidationRules(field.validations);
    const error = errors[field.name];
    const isRequired = field.validations?.some(v => v.type === 'required');
    const shouldHighlight = highlightRequired && isRequired;

    switch (field.type) {
      case 'textarea':
        return renderFieldWrapper(
          field,
          <Label htmlFor={field.name}>
            {field.label}
            {shouldHighlight && <span className="ml-2 text-primary">★ Required</span>}
          </Label>,
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            className={`bg-input-background border-border ${getRadiusClass()} resize-none min-h-[100px] ${shouldHighlight ? 'border-primary ring-2 ring-primary/20' : ''}`}
            {...register(field.name, validationRules)}
          />,
          field.description && <p className="text-muted-foreground">{field.description}</p>,
          error && <p className="text-destructive">{error.message as string}</p>
        );

      case 'select':
        return renderFieldWrapper(
          field,
          <Label htmlFor={field.name}>
            {field.label}
            {shouldHighlight && <span className="ml-2 text-primary">★ Required</span>}
          </Label>,
          <Select
            onValueChange={(value) => setValue(field.name, value)}
            {...register(field.name, validationRules)}
          >
            <SelectTrigger className={`bg-input-background border-border ${getRadiusClass()} ${getInputSizeClass()} ${shouldHighlight ? 'border-primary ring-2 ring-primary/20' : ''}`}>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-[var(--radius)]">
              {field.options?.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="rounded-[var(--radius)]"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>,
          field.description && <p className="text-muted-foreground">{field.description}</p>,
          error && <p className="text-destructive">{error.message as string}</p>
        );

      case 'checkbox':
        return (
          <div key={field.id} className={`flex items-start space-x-3 ${spacing === 'compact' ? 'py-2' : spacing === 'spacious' ? 'py-4' : 'py-3'} ${shouldHighlight ? 'p-3 bg-primary/5 border-2 border-primary rounded-[var(--radius)] animate-in fade-in-50' : ''}`}>
            <Checkbox
              id={field.name}
              className={`border-border ${borderRadius === 'sharp' ? 'rounded-none' : borderRadius === 'pill' ? 'rounded-md' : 'rounded-[var(--radius)]'} ${shouldHighlight ? 'border-primary' : ''}`}
              {...register(field.name, validationRules)}
            />
            <div className="space-y-1">
              <Label htmlFor={field.name} className="cursor-pointer">
                {field.label}
                {shouldHighlight && <span className="ml-2 text-primary">★ Required</span>}
              </Label>
              {field.description && (
                <p className="text-muted-foreground">{field.description}</p>
              )}
              {error && (
                <p className="text-destructive">{error.message as string}</p>
              )}
            </div>
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className={`${getFieldSpacingClass()} ${shouldHighlight ? 'p-3 bg-primary/5 border-2 border-primary rounded-[var(--radius)] animate-in fade-in-50' : ''}`}>
            <Label>
              {field.label}
              {shouldHighlight && <span className="ml-2 text-primary">★ Required</span>}
            </Label>
            <RadioGroup {...register(field.name, validationRules)}>
              {field.options?.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${field.name}-${option.value}`}
                    className={`border-border ${shouldHighlight ? 'border-primary' : ''}`}
                  />
                  <Label
                    htmlFor={`${field.name}-${option.value}`}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {field.description && (
              <p className="text-muted-foreground">{field.description}</p>
            )}
            {error && (
              <p className="text-destructive">{error.message as string}</p>
            )}
          </div>
        );

      case 'number':
        return renderFieldWrapper(
          field,
          <Label htmlFor={field.name}>
            {field.label}
            {shouldHighlight && <span className="ml-2 text-primary">★ Required</span>}
          </Label>,
          <Input
            id={field.name}
            type="number"
            placeholder={field.placeholder}
            className={`bg-input-background border-border ${getRadiusClass()} ${getInputSizeClass()} ${shouldHighlight ? 'border-primary ring-2 ring-primary/20' : ''}`}
            {...register(field.name, validationRules)}
          />,
          field.description && <p className="text-muted-foreground">{field.description}</p>,
          error && <p className="text-destructive">{error.message as string}</p>
        );

      case 'date':
        return renderFieldWrapper(
          field,
          <Label htmlFor={field.name}>
            {field.label}
            {shouldHighlight && <span className="ml-2 text-primary">★ Required</span>}
          </Label>,
          <Input
            id={field.name}
            type="date"
            className={`bg-input-background border-border ${getRadiusClass()} ${getInputSizeClass()} ${shouldHighlight ? 'border-primary ring-2 ring-primary/20' : ''}`}
            {...register(field.name, validationRules)}
          />,
          field.description && <p className="text-muted-foreground">{field.description}</p>,
          error && <p className="text-destructive">{error.message as string}</p>
        );

      case 'file':
        return renderFieldWrapper(
          field,
          <Label htmlFor={field.name}>
            {field.label}
            {shouldHighlight && <span className="ml-2 text-primary">★ Required</span>}
          </Label>,
          <Input
            id={field.name}
            type="file"
            className={`bg-input-background border-border ${getRadiusClass()} ${getInputSizeClass()} ${shouldHighlight ? 'border-primary ring-2 ring-primary/20' : ''}`}
            {...register(field.name, validationRules)}
          />,
          field.description && <p className="text-muted-foreground">{field.description}</p>,
          error && <p className="text-destructive">{error.message as string}</p>
        );

      default:
        return renderFieldWrapper(
          field,
          <Label htmlFor={field.name}>
            {field.label}
            {shouldHighlight && <span className="ml-2 text-primary">★ Required</span>}
          </Label>,
          null,
          null,
          error && <p className="text-destructive">{error.message as string}</p>
        );
    }
  };

  // Apply theme colors if provided
  const themeStyles = themeColors && themeColors.length >= 2 ? {
    '--theme-primary': themeColors[0],
    '--theme-accent': themeColors[1],
  } as React.CSSProperties : {};

  // Group fields by wizardStep property when stepper is enabled
  const wizardSteps = showStepper 
    ? (() => {
        // Get unique wizard steps
        const stepNumbers = [...new Set(schema.fields.map(f => f.wizardStep ?? 0))].sort((a, b) => a - b);
        // Group fields by their wizardStep
        return stepNumbers.map(stepNum => 
          schema.fields.filter(f => (f.wizardStep ?? 0) === stepNum)
        );
      })()
    : [];

  const currentStepFields = showStepper ? wizardSteps[wizardStep] || [] : schema.fields;

  const handleWizardNext = () => {
    if (wizardStep < wizardSteps.length - 1) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handleWizardPrevious = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    }
  };

  // Grid classes based on template
  const getFieldsLayoutClass = () => {
    const gap = spacing === 'compact' ? 'gap-3' : spacing === 'spacious' ? 'gap-8' : 'gap-6';
    const spaceY = spacing === 'compact' ? 'space-y-3' : spacing === 'spacious' ? 'space-y-8' : 'space-y-6';
    
    switch (template) {
      case 'two-column':
        return `grid grid-cols-1 md:grid-cols-2 ${gap}`;
      case 'carded':
        return spaceY;
      default:
        return spaceY;
    }
  };

  const renderFieldGroup = (fields: FieldSchema[]) => {
    if (template === 'carded') {
      return fields.map(field => (
        <Card key={field.id} className="p-6 bg-card border border-border rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--elevation-sm)' }}>
          {renderField(field)}
        </Card>
      ));
    }
    return fields.map(field => renderField(field));
  };

  const renderWizardStepper = () => {
    if (!showStepper) return null;

    switch (stepperType) {
      case 'dots':
        return (
          <div className="flex items-center justify-center gap-2">
            {wizardSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  index === wizardStep
                    ? 'bg-primary scale-125'
                    : index < wizardStep
                    ? 'bg-primary/60'
                    : 'bg-muted'
                }`}
                style={index <= wizardStep && themeColors ? { backgroundColor: index === wizardStep ? themeColors[0] : `${themeColors[0]}99` } : {}}
              />
            ))}
          </div>
        );

      case 'numbers':
        return (
          <div className="flex items-center justify-center gap-3">
            {wizardSteps.map((_, index) => (
              <React.Fragment key={index}>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                    index === wizardStep
                      ? 'bg-primary text-primary-foreground scale-110'
                      : index < wizardStep
                      ? 'bg-primary/60 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  style={index <= wizardStep && themeColors ? { backgroundColor: index === wizardStep ? themeColors[0] : `${themeColors[0]}99` } : {}}
                >
                  {index + 1}
                </div>
                {index < wizardSteps.length - 1 && (
                  <div className={`h-0.5 w-8 ${index < wizardStep ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        );

      case 'breadcrumb':
        return (
          <div className="flex items-center gap-2 flex-wrap">
            {wizardSteps.map((_, index) => (
              <React.Fragment key={index}>
                <div
                  className={`px-3 py-1 rounded-[var(--radius)] transition-all ${
                    index === wizardStep
                      ? 'bg-primary text-primary-foreground'
                      : index < wizardStep
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  style={index === wizardStep && themeColors ? { backgroundColor: themeColors[0] } : {}}
                >
                  Step {index + 1}
                </div>
                {index < wizardSteps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
        );

      case 'progress':
      default:
        return (
          <div className="flex items-center gap-2">
            {wizardSteps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-[var(--radius-pill)] transition-all ${
                  index <= wizardStep ? 'bg-primary' : 'bg-muted'
                }`}
                style={index <= wizardStep && themeColors ? { backgroundColor: themeColors[0] } : {}}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6" style={getThemeStyle()}>
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-[var(--radius-card)] bg-primary flex items-center justify-center" style={themeColors ? { backgroundColor: themeColors[0] } : {}}>
          <LayoutGrid className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-foreground">Dynamic Form Renderer</h2>
          <p className="text-muted-foreground">Live preview with validations</p>
        </div>
      </div>

      <Card className={`bg-card border border-border rounded-[var(--radius-card)] ${spacing === 'compact' ? 'p-6' : spacing === 'spacious' ? 'p-10' : 'p-8'}`} style={{ boxShadow: 'var(--elevation-md)' }}>
        <form onSubmit={handleSubmit(onSubmit)} className={getSpacingClass()}>
          <div className="space-y-3 pb-6 border-b border-border">
            <h3 className="text-foreground">{schema.title}</h3>
            {schema.description && (
              <p className="text-muted-foreground">{schema.description}</p>
            )}
            {showStepper && (
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Step {wizardStep + 1} of {wizardSteps.length}</span>
                </div>
                {renderWizardStepper()}
              </div>
            )}
          </div>

          <div className={getFieldsLayoutClass()}>
            {renderFieldGroup(currentStepFields || [])}
          </div>

          {submitSuccess && (
            <Alert className="bg-success/10 border-2 rounded-[var(--radius-card)]" style={themeColors ? { borderColor: themeColors[0] } : { borderColor: 'var(--success)' }}>
              <CheckCircle2 className="h-5 w-5" style={themeColors ? { color: themeColors[0] } : { color: 'var(--success)' }} />
              <div>
                <h4 style={themeColors ? { color: themeColors[0] } : { color: 'var(--success)' }}>{schema.successMessage}</h4>
                <p className="text-muted-foreground mt-1">Your form has been submitted successfully.</p>
              </div>
            </Alert>
          )}

          {submitError && (
            <Alert className="bg-destructive/10 border-2 border-destructive rounded-[var(--radius-card)]">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h4 className="text-destructive">Submission Error</h4>
                <p className="text-destructive mt-1">{submitError}</p>
              </div>
            </Alert>
          )}

          <div className="flex gap-3 pt-6 border-t border-border">
            {showStepper && wizardStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleWizardPrevious}
                disabled={isSubmitting}
                className="rounded-[var(--radius-button)] transition-all"
              >
                Previous
              </Button>
            )}
            {showStepper && wizardStep < wizardSteps.length - 1 ? (
              <Button
                type="button"
                onClick={handleWizardNext}
                className="text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-all flex-1"
                style={themeColors ? { backgroundColor: themeColors[0] } : { backgroundColor: 'var(--primary)' }}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-all flex-1"
                style={themeColors ? { backgroundColor: themeColors[0] } : { backgroundColor: 'var(--primary)' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </Button>
            )}
            {!showStepper && (
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isSubmitting}
                className="rounded-[var(--radius-button)] transition-all"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
