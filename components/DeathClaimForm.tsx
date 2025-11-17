import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  CheckCircle2,
  Circle,
  AlertCircle,
  ClipboardList,
  DollarSign,
  User,
  Calendar,
  Heart,
  X,
  Sparkles,
  AlertTriangle,
  Shield
} from 'lucide-react';
import {
  medicalReasons,
  requiredDocuments,
  statusOptions,
  reasonOptions,
  assessmentQuestions,
  mockPayees,
  calculateAssessmentResult,
  generateClaimId,
  type AssessmentResult
} from '../utils/deathClaimData';
import { toast } from 'sonner';

interface DeathClaimFormProps {
  showStepper?: boolean;
  stepperType?: 'dots' | 'numbers' | 'progress' | 'breadcrumb';
  borderRadius?: 'sharp' | 'rounded' | 'pill';
  spacing?: 'compact' | 'comfortable' | 'spacious';
  labelPosition?: 'top' | 'left' | 'inline';
  inputSize?: 'sm' | 'md' | 'lg';
  template?: 'simple' | 'two-column' | 'carded';
  themeColors?: string[];
  onFormDataChange?: (data: any) => void;
  wizardStep?: number;
  onWizardStepChange?: (step: number) => void;
}

interface DocumentUpload {
  id: string;
  requestDate: string;
  status: string;
  reason: string;
  receivedDate: string;
  uploaded: boolean;
  uploadError: boolean;
  fileName?: string;
}

interface FormData {
  requestDate: string;
  effectiveDate: string;
  medicalReason: string;
  otherReason?: string;
  selectedPayee: string;
  paymentPercentage: string;
  notes: string;
}

const DeathClaimFormComponent = ({ 
  showStepper = true, 
  stepperType = 'numbers',
  borderRadius = 'rounded',
  spacing = 'comfortable',
  labelPosition = 'top',
  inputSize = 'md',
  template = 'simple',
  themeColors,
  onFormDataChange,
  wizardStep: externalWizardStep,
  onWizardStepChange: externalOnWizardStepChange
}: DeathClaimFormProps) => {
  const [internalStep, setInternalStep] = useState(0);
  
  // Use external step if provided, otherwise use internal
  const currentStep = externalWizardStep !== undefined ? externalWizardStep : internalStep;
  const setCurrentStep = externalOnWizardStepChange || setInternalStep;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [claimId, setClaimId] = useState('');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult>(null);
  const [documentUploads, setDocumentUploads] = useState<Record<string, DocumentUpload>>({});
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      requestDate: new Date().toISOString().split('T')[0],
      effectiveDate: new Date().toISOString().split('T')[0],
      medicalReason: '',
      paymentPercentage: '100',
      notes: ''
    }
  });

  const watchAll = watch();
  const watchMedicalReason = watch('medicalReason');
  const watchSelectedPayee = watch('selectedPayee');

  // Initialize document uploads
  useEffect(() => {
    const initialUploads: Record<string, DocumentUpload> = {};
    requiredDocuments.forEach(doc => {
      initialUploads[doc.id] = {
        id: doc.id,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        reason: 'awaiting-submission',
        receivedDate: '',
        uploaded: false,
        uploadError: false
      };
    });
    setDocumentUploads(initialUploads);
  }, []);

  // Notify parent of form changes
  useEffect(() => {
    if (onFormDataChange) {
      const subscription = watch((formData) => {
        onFormDataChange(formData);
      });
      return () => subscription.unsubscribe();
    }
  }, []); // Empty dependency array - watch and onFormDataChange are stable references

  const steps = ['Claim Details', 'Documents', 'Assessment', 'Payment'];

  // Configuration helper functions
  const getCardBorderRadius = () => {
    switch (borderRadius) {
      case 'sharp': return '0px';
      case 'pill': return '24px';
      default: return 'var(--radius-card)';
    }
  };

  const getInputBorderRadius = () => {
    switch (borderRadius) {
      case 'sharp': return '0px';
      case 'pill': return '999px';
      default: return 'var(--radius-input)';
    }
  };

  const getButtonBorderRadius = () => {
    switch (borderRadius) {
      case 'sharp': return '0px';
      case 'pill': return '999px';
      default: return 'var(--radius-button)';
    }
  };

  const getSpacingValue = () => {
    switch (spacing) {
      case 'compact': return '1rem';
      case 'spacious': return '2rem';
      default: return '1.5rem';
    }
  };

  const getFieldGap = () => {
    switch (spacing) {
      case 'compact': return '0.75rem';
      case 'spacious': return '1.5rem';
      default: return '1rem';
    }
  };

  const getInputHeight = () => {
    switch (inputSize) {
      case 'sm': return '2.5rem';
      case 'lg': return '3.5rem';
      default: return '3rem';
    }
  };

  const getInputPadding = () => {
    switch (inputSize) {
      case 'sm': return '0.5rem 0.875rem';
      case 'lg': return '0.875rem 1.25rem';
      default: return '0.75rem 1rem';
    }
  };

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

  const handleDocumentUpload = (docId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const uploadSuccess = Math.random() > 0.2;
        
        setTimeout(() => {
          setDocumentUploads(prev => ({
            ...prev,
            [docId]: {
              ...prev[docId],
              uploaded: uploadSuccess,
              uploadError: !uploadSuccess,
              fileName: file.name,
              receivedDate: uploadSuccess ? new Date().toISOString().split('T')[0] : '',
              status: uploadSuccess ? 'received' : 'pending',
              reason: uploadSuccess ? 'approved' : 'awaiting-submission'
            }
          }));

          if (uploadSuccess) {
            toast.success(`Document uploaded successfully: ${file.name}`);
          } else {
            toast.error(`Upload failed for ${file.name}. Please try again.`);
          }
        }, 1000);
      }
    };
    
    input.click();
  };

  const handleDocumentFieldChange = (docId: string, field: string, value: string) => {
    setDocumentUploads(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: value
      }
    }));
  };

  const handleAssessmentAnswer = (questionId: string, answer: string) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const allAssessmentQuestionsAnswered = () => {
    return assessmentQuestions
      .filter(q => q.required)
      .every(q => assessmentAnswers[q.id]);
  };

  const handleAssessmentComplete = () => {
    const result = calculateAssessmentResult(assessmentAnswers);
    setAssessmentResult(result);

    if (result === 'rejected') {
      const generatedClaimId = generateClaimId();
      setClaimId(generatedClaimId);
      setIsSubmitted(true);
      toast.error('Claim has been rejected based on assessment.');
    } else if (result === 'approved' || result === 'referred') {
      setCurrentStep(3);
      toast.success(result === 'approved' ? 'Claim approved! Proceed to payment details.' : 'Claim referred for review. Proceed to payment details.');
    }
  };

  const onSubmit = (data: FormData) => {
    const generatedClaimId = generateClaimId();
    setClaimId(generatedClaimId);
    setIsSubmitted(true);
    toast.success('Death claim submitted successfully!');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestartJourney = () => {
    reset();
    setCurrentStep(0);
    setIsSubmitted(false);
    setClaimId('');
    setAssessmentResult(null);
    setAssessmentAnswers({});
  };

  const canProceedToStep2 = () => {
    return watchMedicalReason && watchAll.effectiveDate;
  };

  const canProceedToStep3 = () => {
    return Object.values(documentUploads).every(doc => {
      const docInfo = requiredDocuments.find(d => d.id === doc.id);
      if (docInfo?.required) {
        return doc.uploaded || doc.status === 'not-applicable';
      }
      return true;
    });
  };

  const canSubmitFinal = () => {
    return watchSelectedPayee && watchAll.paymentPercentage;
  };

  // Success Screen
  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        role="main"
        aria-live="polite"
        style={{ 
          ...getThemeStyles(), 
          backgroundColor: isDarkMode ? '#171E2D' : '#F8F8F8' 
        }}
      >
        <div 
          className="max-w-2xl w-full border border-border shadow-xl overflow-hidden"
          role="region"
          aria-labelledby="claim-result-heading"
          style={{
            borderRadius: getCardBorderRadius(),
            backgroundColor: isDarkMode ? '#171E2D' : 'var(--card)'
          }}
        >
          {/* Success Illustration */}
          <div className="relative overflow-hidden">
            <div 
              className="flex items-center justify-center py-6"
              role="img"
              aria-label={assessmentResult === 'rejected' ? 'Claim rejected' : 'Claim approved'}
              style={{ 
                backgroundColor: assessmentResult === 'rejected' ? '#ffebee' : '#e8f5e9'
              }}
            >
              <div 
                className="w-32 h-32 flex items-center justify-center"
                style={{
                  color: assessmentResult === 'rejected' ? 'var(--destructive)' : 'var(--success)'
                }}
              >
                {assessmentResult === 'rejected' ? (
                  <X className="w-20 h-20" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="w-20 h-20" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-8 text-center" style={{ gap: getSpacingValue(), display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h2 id="claim-result-heading" className="text-foreground">
                {assessmentResult === 'rejected' ? 'Claim Rejected' : 'Successful!'}
              </h2>
              <p className="text-foreground" style={{ opacity: 0.9 }}>
                {assessmentResult === 'rejected' 
                  ? 'The claim has been rejected based on assessment criteria'
                  : 'Your death claim has been successfully submitted'}
              </p>
            </div>

            <div 
              className="p-3 sm:p-6 border border-border overflow-hidden"
              style={{
                borderRadius: getInputBorderRadius(),
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                backgroundColor: isDarkMode ? '#1A2332' : 'var(--muted)'
              }}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-4 min-w-0">
                <span className="text-foreground flex items-center gap-2 flex-shrink-0" style={{ opacity: 0.85 }}>
                  <FileText className="w-4 h-4 text-success flex-shrink-0" />
                  Claim ID
                </span>
                <Badge 
                  variant="secondary"
                  className="flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20 w-fit break-all max-w-full"
                >
                  <span className="truncate">{claimId}</span>
                </Badge>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-4 min-w-0">
                <span className="text-foreground flex items-center gap-2 flex-shrink-0" style={{ opacity: 0.85 }}>
                  <Shield className="w-4 h-4 text-success flex-shrink-0" />
                  Status
                </span>
                <Badge 
                  variant="secondary"
                  style={{
                    backgroundColor: assessmentResult === 'rejected' 
                      ? 'var(--destructive)' 
                      : assessmentResult === 'referred'
                      ? 'rgb(234, 179, 8)'
                      : 'var(--success)',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {assessmentResult === 'rejected' ? 'Rejected' : assessmentResult === 'referred' ? 'Under Review' : 'Approved'}
                </Badge>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-4 min-w-0">
                <span className="text-foreground flex items-center gap-2 flex-shrink-0" style={{ opacity: 0.85 }}>
                  <Calendar className="w-4 h-4 text-success flex-shrink-0" />
                  Submission Date
                </span>
                <span className="text-foreground break-words sm:text-right min-w-0 overflow-wrap-anywhere">{new Date().toLocaleDateString()}</span>
              </div>
              {watchMedicalReason && (
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-4 min-w-0">
                  <span className="text-foreground flex-shrink-0" style={{ opacity: 0.85 }}>Medical Reason</span>
                  <span className="text-foreground capitalize break-words sm:text-right min-w-0 overflow-wrap-anywhere">
                    {medicalReasons.find(r => r.value === watchMedicalReason)?.label}
                  </span>
                </div>
              )}
            </div>

            <Button
              onClick={handleRestartJourney}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              style={{
                height: getInputHeight(),
                borderRadius: getButtonBorderRadius(),
                backgroundColor: themeColors?.[0] ? `var(--theme-primary)` : undefined
              }}
            >
              Start New Claim
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Progress Indicator - Different types based on stepperType
  const renderProgress = () => {
    if (!showStepper) return null;

    const progressPercent = ((currentStep) / (steps.length - 1)) * 100;

    // Dots Stepper
    if (stepperType === 'dots') {
      return (
        <nav aria-label="Form progress" style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
          <div className="flex items-center justify-center gap-2" role="list">
            {steps.map((step, index) => (
              <div
                key={index}
                role="listitem"
                aria-label={`${step}${index === currentStep ? ' (current)' : index < currentStep ? ' (completed)' : ''}`}
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
          <div className="text-center" aria-live="polite" aria-atomic="true">
            <span className="text-foreground" style={{ opacity: 0.85 }}>
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </span>
          </div>
        </nav>
      );
    }

    // Progress Bar Stepper
    if (stepperType === 'progress') {
      return (
        <nav aria-label="Form progress" style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
          <div className="flex justify-between items-center">
            <span className="text-foreground">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-foreground" style={{ opacity: 0.85 }}>{Math.round(progressPercent)}% Complete</span>
          </div>
          <div 
            className="w-full bg-muted h-2 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${Math.round(progressPercent)}% complete`}
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
          <p className="text-foreground" style={{ opacity: 0.85 }} aria-live="polite">{steps[currentStep]}</p>
        </nav>
      );
    }

    // Breadcrumb Stepper
    if (stepperType === 'breadcrumb') {
      return (
        <nav aria-label="Form progress" style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
          <ol className="flex items-center justify-center flex-wrap gap-2">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <li>
                  <div
                    className="px-3 py-2 flex items-center gap-2 transition-all duration-300"
                    aria-current={index === currentStep ? 'step' : undefined}
                    aria-label={`${step}${index === currentStep ? ' (current)' : index < currentStep ? ' (completed)' : ''}`}
                    style={{
                      background: index === currentStep
                        ? themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
                        : index < currentStep
                        ? 'var(--success)'
                        : 'var(--muted)',
                      color: index <= currentStep ? 'white' : 'var(--foreground)',
                      opacity: index <= currentStep ? 1 : 0.85,
                      borderRadius: getButtonBorderRadius()
                    }}
                  >
                    {index < currentStep && <Check className="w-4 h-4" aria-hidden="true" />}
                    <span className="hidden sm:inline">{step}</span>
                    <span className="sm:hidden">{index + 1}</span>
                  </div>
                </li>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-foreground hidden sm:block" aria-hidden="true" style={{ opacity: 0.6 }} />
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      );
    }

    // Numbers Stepper (default)
    return (
      <nav aria-label="Form progress" style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
        {/* Circle Connector Stepper */}
        <ol className="flex items-center relative">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <li className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                    index === currentStep ? 'scale-110' : ''
                  }`}
                  aria-current={index === currentStep ? 'step' : undefined}
                  aria-label={`${step}${index === currentStep ? ' (current)' : index < currentStep ? ' (completed)' : ''}`}
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
                    <Check className="w-5 h-5 text-white" aria-hidden="true" />
                  ) : (
                    <span className={index === currentStep ? 'text-white' : 'text-foreground'} aria-hidden="true" style={index === currentStep ? {} : { opacity: 0.7 }}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <span className={`text-xs text-center max-w-[80px] hidden sm:block ${
                  index === currentStep ? 'text-foreground' : 'text-foreground'
                }`} aria-hidden="true" style={index === currentStep ? {} : { opacity: 0.75 }}>
                  {step}
                </span>
              </li>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div 
                  className="flex-1 h-0.5 transition-all duration-300 mx-2"
                  aria-hidden="true"
                  style={{
                    background: index < currentStep
                      ? themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
                      : 'var(--border)',
                    marginTop: '-24px'
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    );
  };

  // Field wrapper for label positioning
  const FieldWrapper = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => {
    if (labelPosition === 'left') {
      return (
        <div className="flex items-start gap-4">
          <Label className="text-foreground pt-2" style={{ width: '180px', flexShrink: 0 }}>
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
          <div className="flex-1">{children}</div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Label className="text-foreground flex items-center gap-2">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        {children}
      </div>
    );
  };

  // Step content wrapper for template layouts
  const StepContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (template === 'two-column') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children}
        </div>
      );
    }
    
    if (template === 'carded') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
          {React.Children.map(children, (child) => (
            <div 
              className="p-4 bg-card border border-border"
              style={{ borderRadius: getInputBorderRadius() }}
            >
              {child}
            </div>
          ))}
        </div>
      );
    }
    
    // Simple layout (default)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
        {children}
      </div>
    );
  };

  // Step 1: Claim Main Details
  const renderStep1 = () => (
    <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500" style={{ display: 'flex', flexDirection: 'column', gap: getSpacingValue() }}>
      {/* Header */}
      <div 
        className="relative overflow-hidden bg-card border border-border flex items-center gap-4"
        role="region"
        aria-labelledby="step1-heading"
        style={{ 
          borderRadius: getInputBorderRadius(),
          padding: spacing === 'compact' ? '1rem' : spacing === 'spacious' ? '1.5rem' : '1.25rem'
        }}
      >
        <FileText 
          className="w-16 h-16 flex-shrink-0"
          style={{ color: themeColors?.[0] ? 'var(--theme-primary)' : 'var(--primary)', strokeWidth: 0.5 }}
          aria-hidden="true"
        />
        <div>
          <h3 id="step1-heading" className="mb-1 text-foreground">Claim Main Details</h3>
          <p className="text-foreground" style={{ opacity: 0.85 }}>Provide key claim initiation details for the policyholder</p>
        </div>
      </div>

      <StepContentWrapper>
        <FieldWrapper label="Request Date">
          <Input
            type="date"
            disabled
            {...register('requestDate')}
            className="bg-input-background border-border text-foreground cursor-not-allowed"
            style={{ 
              height: getInputHeight(),
              borderRadius: getInputBorderRadius(),
              padding: getInputPadding(),
              opacity: 0.7
            }}
          />
          <p className="text-xs text-foreground mt-1" style={{ opacity: 0.75 }}>Auto-populated with current date</p>
        </FieldWrapper>

        <FieldWrapper label="Effective Date" required>
          <Input
            type="date"
            {...register('effectiveDate', { required: true })}
            className="bg-input-background border-border text-foreground"
            style={{ 
              height: getInputHeight(),
              borderRadius: getInputBorderRadius(),
              padding: getInputPadding()
            }}
          />
          {errors.effectiveDate && (
            <p className="text-xs text-destructive mt-1">Effective date is required</p>
          )}
        </FieldWrapper>

        <FieldWrapper label="Primary Medical Reason" required>
          <Select
            value={watchMedicalReason}
            onValueChange={(value) => setValue('medicalReason', value)}
          >
            <SelectTrigger 
              className="bg-input-background border-border text-foreground"
              style={{ 
                height: getInputHeight(),
                borderRadius: getInputBorderRadius(),
                padding: getInputPadding()
              }}
            >
              <SelectValue placeholder="Select medical reason" />
            </SelectTrigger>
            <SelectContent>
              {medicalReasons.map(reason => (
                <SelectItem key={reason.value} value={reason.value}>
                  {reason.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.medicalReason && (
            <p className="text-xs text-destructive mt-1">Medical reason is required</p>
          )}
        </FieldWrapper>

        {watchMedicalReason === 'other' && (
          <FieldWrapper label="Please specify">
            <Input
              placeholder="Enter medical reason"
              {...register('otherReason')}
              className="bg-input-background border-border text-foreground"
              style={{ 
                height: getInputHeight(),
                borderRadius: getInputBorderRadius(),
                padding: getInputPadding()
              }}
            />
          </FieldWrapper>
        )}
      </StepContentWrapper>

      <div 
        className="p-4 bg-accent border border-border flex items-start gap-3"
        style={{ borderRadius: getInputBorderRadius() }}
        role="note"
        aria-labelledby="step1-info-heading"
      >
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <h4 id="step1-info-heading" className="text-foreground text-sm">Important Information</h4>
          <p className="text-foreground text-sm" style={{ opacity: 0.9 }}>
            All information provided will be verified against policy records and medical documentation. 
            Ensure accuracy to prevent delays in claim processing.
          </p>
        </div>
      </div>
    </div>
  );

  // Step 2: Required Documents
  const renderStep2 = () => (
    <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500" style={{ display: 'flex', flexDirection: 'column', gap: getSpacingValue() }}>
      {/* Header */}
      <div 
        className="relative overflow-hidden bg-card border border-border flex items-center gap-4"
        role="region"
        aria-labelledby="step2-heading"
        style={{ 
          borderRadius: getInputBorderRadius(),
          padding: spacing === 'compact' ? '1rem' : spacing === 'spacious' ? '1.5rem' : '1.25rem'
        }}
      >
        <Upload 
          className="w-16 h-16 flex-shrink-0"
          style={{ color: themeColors?.[0] ? 'var(--theme-primary)' : 'var(--primary)', strokeWidth: 0.5 }}
          aria-hidden="true"
        />
        <div>
          <h3 id="step2-heading" className="mb-1 text-foreground">Required Documents</h3>
          <p className="text-foreground" style={{ opacity: 0.85 }}>Upload all required claim documentation</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Required documents table">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="text-left py-3 px-2 text-foreground text-sm">Document Name</th>
              <th scope="col" className="text-left py-3 px-2 text-foreground text-sm hidden md:table-cell">Request Date</th>
              <th scope="col" className="text-left py-3 px-2 text-foreground text-sm">Status</th>
              <th scope="col" className="text-left py-3 px-2 text-foreground text-sm hidden lg:table-cell">Reason</th>
              <th scope="col" className="text-left py-3 px-2 text-foreground text-sm hidden md:table-cell">Received Date</th>
              <th scope="col" className="text-center py-3 px-2 text-foreground text-sm">Upload</th>
            </tr>
          </thead>
          <tbody>
            {requiredDocuments.map((doc) => {
              const upload = documentUploads[doc.id];
              if (!upload) return null;

              return (
                <tr key={doc.id} className="border-b border-border/50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-foreground flex-shrink-0" aria-hidden="true" style={{ opacity: 0.7 }} />
                      <span className="text-foreground text-sm">{doc.name}</span>
                      {doc.required && (
                        <span className="text-destructive text-xs" aria-label="required">*</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 hidden md:table-cell">
                    <Input
                      type="date"
                      value={upload.requestDate}
                      onChange={(e) => handleDocumentFieldChange(doc.id, 'requestDate', e.target.value)}
                      className="bg-input-background border-border text-foreground text-sm w-full max-w-[150px]"
                      style={{ borderRadius: getInputBorderRadius() }}
                      aria-label={`Request date for ${doc.name}`}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <Select
                      value={upload.status}
                      onValueChange={(value) => handleDocumentFieldChange(doc.id, 'status', value)}
                    >
                      <SelectTrigger 
                        className="bg-input-background border-border text-foreground text-sm w-full max-w-[140px]"
                        style={{ borderRadius: getInputBorderRadius() }}
                        aria-label={`Status for ${doc.name}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-2 hidden lg:table-cell">
                    <Select
                      value={upload.reason}
                      onValueChange={(value) => handleDocumentFieldChange(doc.id, 'reason', value)}
                    >
                      <SelectTrigger 
                        className="bg-input-background border-border text-foreground text-sm w-full max-w-[160px]"
                        style={{ borderRadius: getInputBorderRadius() }}
                        aria-label={`Reason for ${doc.name}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {reasonOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-2 hidden md:table-cell">
                    {upload.receivedDate && (
                      <span className="text-foreground text-sm">{upload.receivedDate}</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDocumentUpload(doc.id)}
                        className="p-2 transition-all"
                        style={{
                          backgroundColor: upload.uploaded 
                            ? 'var(--success)' 
                            : upload.uploadError 
                            ? 'var(--destructive)'
                            : 'var(--muted)',
                          borderRadius: getButtonBorderRadius(),
                          color: upload.uploaded || upload.uploadError ? 'white' : 'var(--foreground)'
                        }}
                        aria-label={
                          upload.uploaded 
                            ? `${doc.name} uploaded successfully` 
                            : upload.uploadError 
                            ? `Upload failed for ${doc.name}, click to retry` 
                            : `Upload ${doc.name}`
                        }
                        title={upload.uploaded ? 'Uploaded' : upload.uploadError ? 'Upload failed - retry' : 'Upload document'}
                      >
                        {upload.uploaded ? (
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        ) : upload.uploadError ? (
                          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Upload className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div 
        className="p-4 bg-accent border border-border flex items-start gap-3"
        style={{ borderRadius: getInputBorderRadius() }}
        role="note"
        aria-labelledby="step2-info-heading"
      >
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <h4 id="step2-info-heading" className="text-foreground text-sm">Document Requirements</h4>
          <p className="text-foreground text-sm" style={{ opacity: 0.9 }}>
            All documents marked with * are required. Accepted formats: PDF, JPG, PNG. Maximum file size: 10MB per document.
          </p>
        </div>
      </div>
    </div>
  );

  // Step 3: Claim Assessment
  const renderStep3 = () => (
    <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500" style={{ display: 'flex', flexDirection: 'column', gap: getSpacingValue() }}>
      {/* Header */}
      <div 
        className="relative overflow-hidden bg-card border border-border flex items-center gap-4"
        style={{ 
          borderRadius: getInputBorderRadius(),
          padding: spacing === 'compact' ? '1rem' : spacing === 'spacious' ? '1.5rem' : '1.25rem'
        }}
      >
        <ClipboardList 
          className="w-16 h-16 flex-shrink-0"
          style={{ color: themeColors?.[0] ? 'var(--theme-primary)' : 'var(--primary)', strokeWidth: 0.5 }}
        />
        <div>
          <h3 className="mb-1 text-foreground">Claim Assessment</h3>
          <p className="text-foreground" style={{ opacity: 0.85 }}>Complete the assessment questionnaire</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground" style={{ opacity: 0.85 }}>Assessment Progress</span>
          <span className="text-foreground">
            {Object.keys(assessmentAnswers).length} / {assessmentQuestions.filter(q => q.required).length}
          </span>
        </div>
        <div 
          className="h-2 bg-muted overflow-hidden"
          style={{ borderRadius: getInputBorderRadius() }}
        >
          <div 
            className="h-full transition-all duration-300"
            style={{
              width: `${(Object.keys(assessmentAnswers).length / assessmentQuestions.filter(q => q.required).length) * 100}%`,
              backgroundColor: themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)'
            }}
          />
        </div>
      </div>

      {/* Assessment Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: getFieldGap() }}>
        {assessmentQuestions.map((question, index) => (
          <div 
            key={question.id}
            className="p-6 border border-border bg-card relative overflow-hidden"
            style={{ 
              borderRadius: getInputBorderRadius(),
              display: 'flex',
              flexDirection: 'column',
              gap: getFieldGap()
            }}
          >
            {/* Decorative corner accent */}
            <div 
              className="absolute top-0 left-0 w-20 h-20 opacity-10 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${themeColors?.[0] ? 'var(--theme-primary)' : 'var(--accent)'} 0%, transparent 100%)`
              }}
            />
            
            <div className="flex items-start gap-3 relative z-10">
              <div 
                className="w-8 h-8 flex items-center justify-center text-white flex-shrink-0"
                style={{
                  backgroundColor: assessmentAnswers[question.id]
                    ? themeColors?.[0] ? `var(--theme-primary)` : 'var(--accent)'
                    : 'var(--muted)',
                  color: assessmentAnswers[question.id] ? 'white' : 'var(--muted-foreground)',
                  borderRadius: borderRadius === 'sharp' ? '0px' : '50%'
                }}
              >
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                <Label className="text-foreground">
                  {question.question}
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                {question.type === 'radio' && question.options && (
                  <RadioGroup
                    value={assessmentAnswers[question.id] || ''}
                    onValueChange={(value) => handleAssessmentAnswer(question.id, value)}
                  >
                    <div className="flex gap-3">
                      {question.options.map(option => {
                        const isSelected = assessmentAnswers[question.id] === option.value;
                        return (
                          <label 
                            key={option.value} 
                            htmlFor={`${question.id}-${option.value}`}
                            className="relative flex items-center justify-center p-4 border cursor-pointer transition-all flex-1"
                            style={{
                              borderRadius: getInputBorderRadius(),
                              borderColor: isSelected 
                                ? themeColors?.[0] ? 'var(--theme-primary)' : 'var(--accent)'
                                : 'var(--border)',
                              backgroundColor: isSelected 
                                ? themeColors?.[0] ? 'rgba(var(--theme-primary-rgb), 0.05)' : 'var(--accent-background)'
                                : 'var(--card)',
                              borderWidth: isSelected ? '2px' : '1px'
                            }}
                          >
                            <RadioGroupItem 
                              value={option.value} 
                              id={`${question.id}-${option.value}`}
                              className="sr-only"
                            />
                            <span className="text-foreground">
                              {option.label}
                            </span>
                            {isSelected && (
                              <CheckCircle2 
                                className="flex-shrink-0 ml-2"
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  color: themeColors?.[0] ? 'var(--theme-primary)' : 'var(--accent)'
                                }}
                              />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </RadioGroup>
                )}

                {question.type === 'dropdown' && question.options && (
                  <Select
                    value={assessmentAnswers[question.id] || ''}
                    onValueChange={(value) => handleAssessmentAnswer(question.id, value)}
                  >
                    <SelectTrigger 
                      className="bg-input-background border-border text-foreground"
                      style={{ 
                        height: getInputHeight(),
                        borderRadius: getInputBorderRadius(),
                        padding: getInputPadding()
                      }}
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {question.type === 'textarea' && (
                  <Textarea
                    value={assessmentAnswers[question.id] || ''}
                    onChange={(e) => handleAssessmentAnswer(question.id, e.target.value)}
                    placeholder="Enter your response..."
                    className="bg-input-background border-border text-foreground min-h-24"
                    style={{ borderRadius: getInputBorderRadius() }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => {
            const generatedClaimId = generateClaimId();
            setClaimId(generatedClaimId);
            setIsSubmitted(true);
            toast.success('Claim saved successfully!');
          }}
          variant="outline"
          className="flex-1"
          style={{ 
            height: getInputHeight(),
            borderRadius: getButtonBorderRadius() 
          }}
        >
          Save & Exit
        </Button>
        <Button
          type="button"
          onClick={handleAssessmentComplete}
          disabled={!allAssessmentQuestionsAnswered()}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          style={{
            height: getInputHeight(),
            borderRadius: getButtonBorderRadius(),
            backgroundColor: allAssessmentQuestionsAnswered() 
              ? (themeColors?.[0] ? `var(--theme-primary)` : undefined)
              : 'var(--muted)',
            color: allAssessmentQuestionsAnswered() ? 'white' : 'var(--muted-foreground)',
          }}
        >
          Complete Assessment
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Step 4: Payment Details
  const renderStep4 = () => (
    <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500" style={{ display: 'flex', flexDirection: 'column', gap: getSpacingValue() }}>
      {/* Header */}
      <div 
        className="relative overflow-hidden bg-card border border-border flex items-center gap-4"
        style={{ 
          borderRadius: getInputBorderRadius(),
          padding: spacing === 'compact' ? '1rem' : spacing === 'spacious' ? '1.5rem' : '1.25rem'
        }}
      >
        <DollarSign 
          className="w-16 h-16 flex-shrink-0"
          style={{ color: themeColors?.[0] ? 'var(--theme-primary)' : 'var(--primary)', strokeWidth: 0.5 }}
        />
        <div>
          <h3 className="mb-1 text-foreground">Payment Details</h3>
          <p className="text-muted-foreground">Set or confirm payment details for the approved claim</p>
        </div>
      </div>

      {/* Assessment Result Badge */}
      {assessmentResult && (
        <div 
          className="p-4 border flex items-center gap-3"
          style={{
            backgroundColor: assessmentResult === 'approved' 
              ? 'rgba(34, 197, 94, 0.1)'
              : 'rgba(234, 179, 8, 0.1)',
            borderColor: assessmentResult === 'approved'
              ? 'rgba(34, 197, 94, 0.2)'
              : 'rgba(234, 179, 8, 0.2)',
            borderRadius: getInputBorderRadius()
          }}
        >
          {assessmentResult === 'approved' ? (
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(234, 179, 8)' }} />
          )}
          <div>
            <p className="text-foreground">
              Assessment Result: <strong>{assessmentResult === 'approved' ? 'Approved' : 'Referred for Review'}</strong>
            </p>
            <p className="text-muted-foreground text-sm">
              {assessmentResult === 'approved' 
                ? 'This claim has been approved for payment processing.'
                : 'This claim requires additional review before final approval.'}
            </p>
          </div>
        </div>
      )}

      <StepContentWrapper>
        <FieldWrapper label="Select Payee / Beneficiary" required>
          <Select
            value={watchSelectedPayee}
            onValueChange={(value) => setValue('selectedPayee', value)}
          >
            <SelectTrigger 
              className="bg-input-background border-border text-foreground"
              style={{ 
                height: getInputHeight(),
                borderRadius: getInputBorderRadius(),
                padding: getInputPadding()
              }}
            >
              <SelectValue placeholder="Choose payee from beneficiaries" />
            </SelectTrigger>
            <SelectContent>
              {mockPayees.map(payee => (
                <SelectItem key={payee.id} value={payee.id}>
                  <div className="flex flex-col">
                    <span>{payee.name}</span>
                    <span className="text-xs text-muted-foreground">{payee.relationship} - {payee.bankDetails}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldWrapper>

        {watchSelectedPayee && (
          <div 
            className="p-4 bg-muted border border-border"
            style={{ borderRadius: getInputBorderRadius() }}
          >
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-foreground">Selected Payee Details</p>
                {(() => {
                  const selectedPayee = mockPayees.find(p => p.id === watchSelectedPayee);
                  return selectedPayee ? (
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">Name: <span className="text-foreground">{selectedPayee.name}</span></p>
                      <p className="text-muted-foreground">Relationship: <span className="text-foreground">{selectedPayee.relationship}</span></p>
                      <p className="text-muted-foreground">Bank: <span className="text-foreground">{selectedPayee.bankDetails}</span></p>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        )}

        <FieldWrapper label="Payment Percentage" required>
          <div className="relative">
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="100"
              {...register('paymentPercentage', { required: true, min: 0, max: 100 })}
              className="bg-input-background border-border text-foreground pr-12"
              style={{ 
                height: getInputHeight(),
                borderRadius: getInputBorderRadius(),
                padding: getInputPadding()
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
          {errors.paymentPercentage && (
            <p className="text-xs text-destructive mt-1">Payment percentage must be between 0 and 100</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Default is 100% of the claim amount to the selected payee</p>
        </FieldWrapper>
      </StepContentWrapper>

      <div 
        className="p-4 bg-accent/50 border border-border flex items-start gap-3"
        style={{ borderRadius: getInputBorderRadius() }}
      >
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-foreground text-sm">Payment Processing</p>
          <p className="text-muted-foreground text-sm">
            Payment will be processed within 5-7 business days after claim approval. 
            The payee will be notified via email and SMS once payment is initiated.
          </p>
        </div>
      </div>
    </div>
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderStep1();
      case 1: return renderStep2();
      case 2: return renderStep3();
      case 3: return renderStep4();
      default: return null;
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        ...getThemeStyles(),
        backgroundColor: isDarkMode ? '#171E2D' : '#F8F8F8',
        padding: spacing === 'compact' ? '1rem' : spacing === 'spacious' ? '3rem 1rem' : '2rem 1rem'
      }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            background: themeColors?.[0] ? `var(--theme-primary)` : 'var(--primary)',
            borderRadius: '50%',
            filter: 'blur(80px)'
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-10 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            background: themeColors?.[1] ? `var(--theme-accent)` : 'var(--accent)',
            borderRadius: '50%',
            filter: 'blur(80px)'
          }}
        />
      </div>
      
      <div 
        className="mx-auto relative z-10 transition-all duration-300"
        style={{
          maxWidth: '1024px'
        }}
      >
        {/* Main Card */}
        <div 
          className="overflow-hidden bg-card border border-border shadow-xl"
          style={{
            borderRadius: getCardBorderRadius()
          }}
        >
          {/* Header */}
          <div 
            className="border-b border-border relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, 
                color-mix(in srgb, ${themeColors?.[0] || 'var(--primary)'} 8%, var(--background)) 0%,
                var(--background) 50%,
                color-mix(in srgb, ${themeColors?.[1] || 'var(--accent)'} 6%, var(--background)) 100%)`,
              padding: getSpacingValue()
            }}
          >
            {/* Decorative Background Patterns */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              {/* Grid Pattern */}
              <div 
                className="absolute inset-0" 
                style={{
                  backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}
              />
              {/* Radial gradient overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 30% 50%, color-mix(in srgb, ${themeColors?.[0] || 'var(--primary)'} 15%, transparent) 0%, transparent 60%)`
                }}
              />
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 max-w-5xl mx-auto w-full">
              {/* Icon */}
              <div className="relative flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-full bg-[rgba(241,245,249,0)]">
                <Shield 
                  className="w-12 h-12"
                  style={{ color: themeColors?.[0] || 'var(--primary)' }}
                />
              </div>
              
              {/* Text Content */}
              <div className="text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                  style={{
                    background: `color-mix(in srgb, ${themeColors?.[0] || 'var(--primary)'} 12%, var(--card))`,
                    border: `1px solid color-mix(in srgb, ${themeColors?.[0] || 'var(--primary)'} 20%, var(--border))`
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: themeColors?.[0] || 'var(--primary)' }} />
                  <span style={{ color: themeColors?.[0] || 'var(--primary)', fontSize: '13px' }}>Claim</span>
                </div>
                <h2 className="text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>
                  Death Claim Submission
                </h2>
                <p className="text-muted-foreground" style={{ maxWidth: '500px' }}>
                  We understand this is a difficult time. 
                  <span style={{ color: themeColors?.[0] || 'var(--primary)', marginLeft: '4px' }}>Please provide the required information so we can assist with compassion.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          {showStepper && (
            <div 
              className="border-b border-border"
              style={{
                padding: getSpacingValue(),
                backgroundColor: isDarkMode ? '#171E2D' : 'var(--background)'
              }}
            >
              {renderProgress()}
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div 
              style={{
                padding: getSpacingValue(),
                backgroundColor: isDarkMode ? '#171E2D' : 'var(--background)'
              }}
            >
              {renderCurrentStep()}
            </div>

            {/* Footer with Navigation */}
            <div 
              className="border-t border-border"
              style={{
                padding: getSpacingValue(),
                display: 'flex',
                gap: '1rem',
                justifyContent: 'space-between',
                backgroundColor: isDarkMode ? '#171E2D' : 'var(--card)'
              }}
            >
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                  style={{
                    height: getInputHeight(),
                    borderRadius: getButtonBorderRadius(),
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}

              {currentStep < steps.length - 1 && currentStep !== 2 && (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 0 && !canProceedToStep2()) ||
                    (currentStep === 1 && !canProceedToStep3())
                  }
                  className="ml-auto text-white"
                  style={{
                    height: getInputHeight(),
                    borderRadius: getButtonBorderRadius(),
                    background: ((currentStep === 0 && canProceedToStep2()) || (currentStep === 1 && canProceedToStep3()))
                      ? (themeColors?.[0] 
                        ? 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%)'
                        : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)')
                      : 'var(--muted)',
                    color: ((currentStep === 0 && canProceedToStep2()) || (currentStep === 1 && canProceedToStep3()))
                      ? 'white'
                      : 'var(--muted-foreground)',
                    border: 'none',
                  }}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {currentStep === 3 && (
                <Button
                  type="submit"
                  disabled={!canSubmitFinal()}
                  className="ml-auto text-white"
                  style={{
                    height: getInputHeight(),
                    borderRadius: getButtonBorderRadius(),
                    background: canSubmitFinal()
                      ? (themeColors?.[0] 
                        ? 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%)'
                        : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)')
                      : 'var(--muted)',
                    color: canSubmitFinal() ? 'white' : 'var(--muted-foreground)',
                    border: 'none',
                  }}
                >
                  Submit Claim
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const DeathClaimForm = React.memo(DeathClaimFormComponent);
