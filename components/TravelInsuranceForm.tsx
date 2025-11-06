import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  Shield,
  CreditCard,
  FileText,
  Plane,
  Globe,
  Heart,
  Star,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  countries,
  coveragePlans,
  addOnCoverages,
} from "../utils/travelInsuranceData";
import { toast } from "sonner";

interface TravelInsuranceFormProps {
  showStepper?: boolean;
  stepperType?: "dots" | "numbers" | "progress" | "breadcrumb";
  borderRadius?: "sharp" | "rounded" | "pill";
  spacing?: "compact" | "comfortable" | "spacious";
  labelPosition?: "top" | "left" | "inline";
  inputSize?: "sm" | "md" | "lg";
  template?: "simple" | "two-column" | "carded";
  themeColors?: string[];
  onFormDataChange?: (data: any) => void;
}

interface TravellerInfo {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  passportNumber: string;
  nationality: string;
  relationship: string;
  hasMedicalConditions: string;
  medicalDetails?: string;
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  zipCode: string;
}

interface FormData {
  tripType: string;
  destination: string;
  travelStartDate: string;
  travelEndDate: string;
  numTravellers: number;
  travellers: TravellerInfo[];
  coveragePlan: string;
  addOns: string[];
  paymentMethod: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardholderName?: string;
  declaration: boolean;
  terms: boolean;
}

const getStatesByCountry = (countryCode: string) => {
  const stateData: Record<string, string[]> = {
    US: ["California", "New York", "Texas", "Florida", "Illinois"],
    IN: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat"],
    CA: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
    AU: [
      "New South Wales",
      "Victoria",
      "Queensland",
      "Western Australia",
      "South Australia",
    ],
    GB: ["England", "Scotland", "Wales", "Northern Ireland"],
  };
  return stateData[countryCode] || ["State 1", "State 2", "State 3"];
};

const getCitiesByState = (state: string) => {
  return ["City 1", "City 2", "City 3", "City 4", "City 5"];
};

export function TravelInsuranceForm({
  showStepper = true,
  stepperType = "numbers",
  borderRadius = "rounded",
  spacing = "comfortable",
  labelPosition = "top",
  inputSize = "md",
  template = "simple",
  themeColors,
  onFormDataChange,
}: TravelInsuranceFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [policyNumber, setPolicyNumber] = useState("");

  // Create scoped theme style object
  const getThemeStyle = (): React.CSSProperties => {
    if (themeColors && themeColors.length >= 2) {
      return {
        "--primary": themeColors[0],
        "--primary-foreground": "rgba(255, 255, 255, 1)",
        "--accent": themeColors[1],
        "--accent-foreground": "rgba(255, 255, 255, 1)",
        "--ring": themeColors[0],
      } as React.CSSProperties;
    }
    return {};
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      tripType: "",
      destination: "",
      travelStartDate: "",
      travelEndDate: "",
      numTravellers: 1,
      travellers: [],
      coveragePlan: "",
      addOns: [],
      paymentMethod: "",
      declaration: false,
      terms: false,
    },
  });

  const { fields: travellerFields, replace: replaceTravellers } = useFieldArray(
    {
      control,
      name: "travellers",
    }
  );

  const watchNumTravellers = watch("numTravellers");
  const watchTripType = watch("tripType");
  const watchDestination = watch("destination");
  const watchStartDate = watch("travelStartDate");
  const watchEndDate = watch("travelEndDate");
  const watchCoveragePlan = watch("coveragePlan");
  const watchAddOns = watch("addOns") || [];
  const watchPaymentMethod = watch("paymentMethod");
  const watchTravellers = watch("travellers");
  const watchDeclaration = watch("declaration");
  const watchTerms = watch("terms");

  // Configuration helper functions
  const getBorderRadiusValue = () => {
    switch (borderRadius) {
      case "sharp":
        return "0px";
      case "rounded":
        return "var(--radius-input)";
      case "pill":
        return "var(--radius-pill)";
      default:
        return "var(--radius-input)";
    }
  };

  const getButtonBorderRadius = () => {
    switch (borderRadius) {
      case "sharp":
        return "0px";
      case "rounded":
        return "var(--radius-button)";
      case "pill":
        return "var(--radius-pill)";
      default:
        return "var(--radius-button)";
    }
  };

  const getCardBorderRadius = () => {
    switch (borderRadius) {
      case "sharp":
        return "0px";
      case "rounded":
        return "var(--radius-card)";
      case "pill":
        return "var(--radius-pill)";
      default:
        return "var(--radius-card)";
    }
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case "compact":
        return "space-y-3";
      case "comfortable":
        return "space-y-6";
      case "spacious":
        return "space-y-8";
      default:
        return "space-y-6";
    }
  };

  const getFieldGap = () => {
    switch (spacing) {
      case "compact":
        return "0.5rem";
      case "comfortable":
        return "0.75rem";
      case "spacious":
        return "1rem";
      default:
        return "0.75rem";
    }
  };

  const getPadding = () => {
    switch (spacing) {
      case "compact":
        return "1rem";
      case "comfortable":
        return "1.5rem";
      case "spacious":
        return "2rem";
      default:
        return "1.5rem";
    }
  };

  const getCardPadding = () => {
    switch (spacing) {
      case "compact":
        return "1rem";
      case "comfortable":
        return "1.5rem";
      case "spacious":
        return "2rem";
      default:
        return "1.5rem";
    }
  };

  const getInputHeight = () => {
    switch (inputSize) {
      case "sm":
        return "2rem";
      case "md":
        return "2.5rem";
      case "lg":
        return "3rem";
      default:
        return "2.5rem";
    }
  };

  const getInputPadding = () => {
    switch (inputSize) {
      case "sm":
        return "0.375rem 0.75rem";
      case "md":
        return "0.5rem 1rem";
      case "lg":
        return "0.75rem 1.25rem";
      default:
        return "0.5rem 1rem";
    }
  };

  const getFieldWrapperClass = () => {
    if (labelPosition === "left")
      return "flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4";
    if (labelPosition === "inline") return "flex items-center gap-2";
    return "flex flex-col";
  };

  const getLabelStyle = () => {
    if (labelPosition === "left")
      return {
        width: "100%",
        maxWidth: "200px",
        flexShrink: 0,
        paddingTop: "0.5rem",
      };
    if (labelPosition === "inline") return { flexShrink: 0 };
    return {};
  };

  // Update traveller fields when number changes
  React.useEffect(() => {
    const num = parseInt(String(watchNumTravellers)) || 1;
    const currentTravellers = watchTravellers || [];

    if (num !== currentTravellers.length) {
      const newTravellers: TravellerInfo[] = [];
      for (let i = 0; i < num; i++) {
        newTravellers.push(
          currentTravellers[i] || {
            fullName: "",
            dateOfBirth: "",
            gender: "",
            passportNumber: "",
            nationality: "",
            relationship: i === 0 ? "self" : "",
            hasMedicalConditions: "no",
            medicalDetails: "",
            country: "",
            state: "",
            city: "",
            addressLine1: "",
            addressLine2: "",
            zipCode: "",
          }
        );
      }
      replaceTravellers(newTravellers);
    }
  }, [watchNumTravellers]);

  // Watch all form data and notify parent component using subscription
  React.useEffect(() => {
    if (!onFormDataChange) return;

    const subscription = watch((formData) => {
      onFormDataChange(formData);
    });

    return () => subscription.unsubscribe();
  }, [watch, onFormDataChange]);

  const validateDateRange = () => {
    if (watchStartDate && watchEndDate && watchTripType === "single") {
      const start = new Date(watchStartDate);
      const end = new Date(watchEndDate);
      const diffDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays <= 180;
    }
    return true;
  };

  const steps = [
    "Trip Information",
    "Traveller Information",
    "Coverage Selection",
    "Summary & Payment",
  ];

  const stepIcons = [
    <Plane className='h-5 w-5' key='plane' />,
    <Users className='h-5 w-5' key='users' />,
    <Shield className='h-5 w-5' key='shield' />,
    <FileText className='h-5 w-5' key='file' />,
  ];

  const onSubmit = (data: FormData) => {
    const policyNum = `TRV-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;
    setPolicyNumber(policyNum);
    setIsSubmitted(true);
    toast.success("Policy issued successfully!");
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (
        !watchTripType ||
        !watchDestination ||
        !watchStartDate ||
        !watchEndDate ||
        !watchNumTravellers
      ) {
        toast.error("Please fill all required fields");
        return;
      }
      if (!validateDateRange()) {
        toast.error("Trip duration cannot exceed 180 days for single trip");
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Announce to screen readers
      setTimeout(() => {
        const announcement = `Now on step ${nextStep + 1} of ${steps.length}: ${
          steps[nextStep]
        }`;
        toast.success(announcement);
      }, 100);
    }
  };

  const handleRestartJourney = () => {
    reset();
    setCurrentStep(0);
    setIsSubmitted(false);
    setPolicyNumber("");
    toast.success("Starting new insurance journey");
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      // Announce to screen readers
      setTimeout(() => {
        const announcement = `Now on step ${prevStep + 1} of ${steps.length}: ${
          steps[prevStep]
        }`;
        toast.success(announcement);
      }, 100);
    }
  };

  // Stepper renderers
  const renderDotsStepper = () => (
    <nav aria-label='Progress' className='mb-8'>
      <div className='flex justify-center items-center gap-3' role='list'>
        {steps.map((step, index) => (
          <div
            key={index}
            role='listitem'
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentStep
                ? "bg-primary scale-125"
                : index < currentStep
                ? "bg-success"
                : "bg-muted"
            }`}
            style={{ transition: "all var(--transition-normal)" }}
            aria-current={index === currentStep ? "step" : undefined}
            aria-label={`Step ${index + 1}: ${step}`}
          />
        ))}
      </div>
      <p className='text-center text-muted-foreground mt-4' aria-live='polite'>
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </p>
    </nav>
  );

  const renderNumbersStepper = () => (
    <nav aria-label='Progress' className='mb-8'>
      <ol className='flex justify-between items-start gap-2 overflow-x-auto'>
        {steps.map((step, index) => (
          <li
            key={index}
            className='flex flex-col items-center flex-1 min-w-0 relative'
          >
            {index < steps.length - 1 && (
              <div
                className='absolute left-[50%] top-5 h-[2px] w-full -z-10'
                style={{
                  backgroundColor:
                    index < currentStep
                      ? "hsl(var(--success))"
                      : "hsl(var(--muted))",
                  transition: "background-color var(--transition-normal)",
                }}
              />
            )}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 relative z-10 ${
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index < currentStep
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
              style={{
                transition: "all var(--transition-normal)",
                borderRadius: borderRadius === "sharp" ? "0px" : "50%",
              }}
              aria-current={index === currentStep ? "step" : undefined}
              aria-label={`Step ${index + 1}: ${step}`}
            >
              {index < currentStep ? <Check className='h-5 w-5' /> : index + 1}
            </div>
            <span
              className={`mt-2 text-center break-words px-1 hidden sm:block ${
                index === currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
              style={{ fontSize: "0.875rem" }}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );

  const renderProgressStepper = () => {
    const progress = ((currentStep + 1) / steps.length) * 100;
    return (
      <div className='mb-8' role='region' aria-label='Progress'>
        <div className='flex justify-between items-center mb-2 flex-wrap gap-2'>
          <span className='text-foreground'>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className='text-muted-foreground'>
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div
          className='w-full bg-muted h-2 overflow-hidden'
          style={{ borderRadius: getBorderRadiusValue() }}
          role='progressbar'
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label='Form completion progress'
        >
          <div
            className='h-full bg-primary transition-all'
            style={{
              width: `${progress}%`,
              transition: "width var(--transition-normal)",
            }}
          />
        </div>
        <p className='text-muted-foreground mt-2' aria-live='polite'>
          {steps[currentStep]}
        </p>
      </div>
    );
  };

  const renderBreadcrumbStepper = () => (
    <nav aria-label='Progress' className='mb-8'>
      <ol className='flex items-center justify-center flex-wrap gap-2'>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <li className='flex items-center gap-2'>
              <span
                className={`px-3 py-2 rounded-full flex items-center gap-2 transition-all ${
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : index < currentStep
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                style={{
                  borderRadius: getButtonBorderRadius(),
                  transition: "all var(--transition-normal)",
                  minHeight: "44px",
                  fontSize: "0.875rem",
                }}
                aria-current={index === currentStep ? "step" : undefined}
              >
                {index < currentStep ? (
                  <Check className='h-4 w-4' />
                ) : (
                  <span>{index + 1}</span>
                )}
                <span className='hidden sm:inline'>{step}</span>
              </span>
            </li>
            {index < steps.length - 1 && (
              <ChevronRight
                className={`h-5 w-5 hidden sm:block ${
                  index < currentStep ? "text-success" : "text-muted-foreground"
                }`}
                aria-hidden='true'
              />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );

  const renderStepper = () => {
    if (!showStepper) return null;
    switch (stepperType) {
      case "dots":
        return renderDotsStepper();
      case "numbers":
        return renderNumbersStepper();
      case "progress":
        return renderProgressStepper();
      case "breadcrumb":
        return renderBreadcrumbStepper();
      default:
        return renderNumbersStepper();
    }
  };

  // Form field wrapper component
  const FormField = ({
    label,
    required,
    error,
    children,
    icon,
  }: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
  }) => {
    const errorId = error
      ? `error-${label.replace(/\s+/g, "-").toLowerCase()}`
      : undefined;
    return (
      <div className={getFieldWrapperClass()} style={{ gap: getFieldGap() }}>
        <Label
          style={getLabelStyle()}
          className='break-words flex items-center gap-2'
        >
          {icon && <span className='text-primary'>{icon}</span>}
          {label} {required && <span aria-label='required'>*</span>}
        </Label>
        <div className='flex-1 min-w-0'>
          {children}
          {error && (
            <p
              className='text-destructive mt-1 break-words'
              id={errorId}
              role='alert'
              aria-live='polite'
            >
              {error}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Get container class based on template
  const getContainerClass = () => {
    if (template === "two-column")
      return "grid grid-cols-1 md:grid-cols-2 gap-4";
    return getSpacingClass();
  };

  // Render Step 1: Trip Information
  const renderStep1 = () => {
    const fields = (
      <>
        <div
          className='mb-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20'
          style={{ borderRadius: getCardBorderRadius() }}
        >
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
              <Plane className='h-5 w-5 text-primary' />
            </div>
            <h3 className='text-foreground'>Plan Your Journey</h3>
          </div>
          <p className='text-muted-foreground'>
            Let's start with your travel details
          </p>
        </div>

        {template === "carded" ? (
          <Card
            className='p-4 bg-card border border-border'
            style={{ borderRadius: getCardBorderRadius() }}
          >
            <FormField
              label='Trip Type'
              required
              error={errors.tripType?.message}
              icon={<Globe className='h-4 w-4' />}
            >
              <RadioGroup
                value={watchTripType}
                onValueChange={(value) => setValue("tripType", value)}
              >
                <div className='flex items-center space-x-3'>
                  <RadioGroupItem
                    value='single'
                    id='single'
                    className='border-border bg-input-background'
                  />
                  <Label
                    htmlFor='single'
                    className='cursor-pointer text-foreground'
                  >
                    Single Trip
                  </Label>
                </div>
                <div className='flex items-center space-x-3'>
                  <RadioGroupItem
                    value='annual'
                    id='annual'
                    className='border-border bg-input-background'
                  />
                  <Label
                    htmlFor='annual'
                    className='cursor-pointer text-foreground'
                  >
                    Annual Multi-trip
                  </Label>
                </div>
              </RadioGroup>
            </FormField>
          </Card>
        ) : (
          <FormField
            label='Trip Type'
            required
            error={errors.tripType?.message}
            icon={<Globe className='h-4 w-4' />}
          >
            <RadioGroup
              value={watchTripType}
              onValueChange={(value) => setValue("tripType", value)}
            >
              <div className='flex items-center space-x-3'>
                <RadioGroupItem
                  value='single'
                  id='single'
                  className='border-border bg-input-background'
                />
                <Label
                  htmlFor='single'
                  className='cursor-pointer text-foreground'
                >
                  Single Trip
                </Label>
              </div>
              <div className='flex items-center space-x-3'>
                <RadioGroupItem
                  value='annual'
                  id='annual'
                  className='border-border bg-input-background'
                />
                <Label
                  htmlFor='annual'
                  className='cursor-pointer text-foreground'
                >
                  Annual Multi-trip
                </Label>
              </div>
            </RadioGroup>
          </FormField>
        )}

        {template === "carded" ? (
          <Card
            className='p-4 bg-card border border-border'
            style={{ borderRadius: getCardBorderRadius() }}
          >
            <FormField
              label='Destination'
              required
              error={errors.destination?.message}
              icon={<MapPin className='h-4 w-4' />}
            >
              <Select
                value={watchDestination}
                onValueChange={(value) => setValue("destination", value)}
              >
                <SelectTrigger
                  className='bg-input-background border-border text-foreground'
                  style={{
                    borderRadius: getBorderRadiusValue(),
                    height: getInputHeight(),
                    padding: getInputPadding(),
                  }}
                >
                  <SelectValue placeholder='Select destination country' />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </Card>
        ) : (
          <FormField
            label='Destination'
            required
            error={errors.destination?.message}
            icon={<MapPin className='h-4 w-4' />}
          >
            <Select
              value={watchDestination}
              onValueChange={(value) => setValue("destination", value)}
            >
              <SelectTrigger
                className='bg-input-background border-border text-foreground'
                style={{
                  borderRadius: getBorderRadiusValue(),
                  height: getInputHeight(),
                  padding: getInputPadding(),
                }}
              >
                <SelectValue placeholder='Select destination country' />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}

        {template === "carded" ? (
          <Card
            className='p-4 bg-card border border-border'
            style={{ borderRadius: getCardBorderRadius() }}
          >
            <FormField
              label='Travel Start Date'
              required
              error={errors.travelStartDate?.message}
              icon={<Calendar className='h-4 w-4' />}
            >
              <Input
                type='date'
                {...register("travelStartDate", {
                  required: "Start date is required",
                })}
                className='bg-input-background border-border text-foreground'
                style={{
                  borderRadius: getBorderRadiusValue(),
                  height: getInputHeight(),
                  padding: getInputPadding(),
                }}
              />
            </FormField>
          </Card>
        ) : (
          <FormField
            label='Travel Start Date'
            required
            error={errors.travelStartDate?.message}
            icon={<Calendar className='h-4 w-4' />}
          >
            <Input
              type='date'
              {...register("travelStartDate", {
                required: "Start date is required",
              })}
              className='bg-input-background border-border text-foreground'
              style={{
                borderRadius: getBorderRadiusValue(),
                height: getInputHeight(),
                padding: getInputPadding(),
              }}
            />
          </FormField>
        )}

        {template === "carded" ? (
          <Card
            className='p-4 bg-card border border-border'
            style={{ borderRadius: getCardBorderRadius() }}
          >
            <FormField
              label='Travel End Date'
              required
              error={errors.travelEndDate?.message}
              icon={<Calendar className='h-4 w-4' />}
            >
              <Input
                type='date'
                {...register("travelEndDate", {
                  required: "End date is required",
                })}
                className='bg-input-background border-border text-foreground'
                style={{
                  borderRadius: getBorderRadiusValue(),
                  height: getInputHeight(),
                  padding: getInputPadding(),
                }}
              />
            </FormField>
          </Card>
        ) : (
          <FormField
            label='Travel End Date'
            required
            error={errors.travelEndDate?.message}
            icon={<Calendar className='h-4 w-4' />}
          >
            <Input
              type='date'
              {...register("travelEndDate", {
                required: "End date is required",
              })}
              className='bg-input-background border-border text-foreground'
              style={{
                borderRadius: getBorderRadiusValue(),
                height: getInputHeight(),
                padding: getInputPadding(),
              }}
            />
          </FormField>
        )}

        {template === "carded" ? (
          <Card
            className='p-4 bg-card border border-border'
            style={{ borderRadius: getCardBorderRadius() }}
          >
            <FormField
              label='Number of Travellers'
              required
              error={errors.numTravellers?.message}
              icon={<Users className='h-4 w-4' />}
            >
              <Input
                type='number'
                min='1'
                max='10'
                {...register("numTravellers", {
                  required: "Number of travellers is required",
                  min: { value: 1, message: "At least 1 traveller required" },
                  max: { value: 10, message: "Maximum 10 travellers allowed" },
                })}
                className='bg-input-background border-border text-foreground'
                style={{
                  borderRadius: getBorderRadiusValue(),
                  height: getInputHeight(),
                  padding: getInputPadding(),
                }}
              />
            </FormField>
          </Card>
        ) : (
          <FormField
            label='Number of Travellers'
            required
            error={errors.numTravellers?.message}
            icon={<Users className='h-4 w-4' />}
          >
            <Input
              type='number'
              min='1'
              max='10'
              {...register("numTravellers", {
                required: "Number of travellers is required",
                min: { value: 1, message: "At least 1 traveller required" },
                max: { value: 10, message: "Maximum 10 travellers allowed" },
              })}
              className='bg-input-background border-border text-foreground'
              style={{
                borderRadius: getBorderRadiusValue(),
                height: getInputHeight(),
                padding: getInputPadding(),
              }}
            />
          </FormField>
        )}
      </>
    );

    return (
      <div
        className={
          template === "two-column"
            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
            : getSpacingClass()
        }
      >
        {fields}
        {watchTripType === "single" &&
          watchStartDate &&
          watchEndDate &&
          !validateDateRange() && (
            <div
              className={template === "two-column" ? "md:col-span-2" : ""}
              role='alert'
              aria-live='polite'
            >
              <div
                className='flex items-start gap-2 p-4 bg-warning/10 border border-warning'
                style={{ borderRadius: getCardBorderRadius() }}
              >
                <AlertCircle
                  className='h-5 w-5 text-warning flex-shrink-0 mt-0.5'
                  aria-hidden='true'
                />
                <div className='break-words'>
                  <p className='text-warning'>Trip duration exceeds 180 days</p>
                  <p className='text-warning/80'>
                    Single trip policies are limited to 180 days. Consider an
                    annual multi-trip policy.
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  };

  // Render Step 2: Traveller Information
  const renderStep2 = () => (
    <div className={getSpacingClass()}>
      <div
        className='mb-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20'
        style={{ borderRadius: getCardBorderRadius() }}
      >
        <div className='flex items-center gap-3 mb-2'>
          <div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
            <Users className='h-5 w-5 text-primary' />
          </div>
          <h3 className='text-foreground'>Traveller Details</h3>
        </div>
        <p className='text-muted-foreground'>
          Provide information for all travellers
        </p>
      </div>

      {travellerFields.map((field, index) => (
        <Card
          key={field.id}
          className='p-4 sm:p-6 bg-card border border-border transition-all hover:border-primary/30'
          style={{
            borderRadius: getCardBorderRadius(),
            boxShadow: "var(--elevation-sm)",
          }}
        >
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
              <span className='text-primary'>{index + 1}</span>
            </div>
            <h3 className='text-foreground break-words'>
              Traveller {index + 1}
            </h3>
            {index === 0 && (
              <Badge className='bg-primary/10 text-primary border-primary/20'>
                Primary
              </Badge>
            )}
          </div>
          <div className={getSpacingClass()}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField label='Full Name' required>
                <Input
                  {...register(`travellers.${index}.fullName`, {
                    required: "Name is required",
                  })}
                  placeholder='Enter full name'
                  className='bg-input-background border-border text-foreground'
                  style={{
                    borderRadius: getBorderRadiusValue(),
                    height: getInputHeight(),
                    padding: getInputPadding(),
                  }}
                />
              </FormField>

              <FormField label='Date of Birth' required>
                <Input
                  type='date'
                  {...register(`travellers.${index}.dateOfBirth`, {
                    required: "Date of birth is required",
                  })}
                  className='bg-input-background border-border text-foreground'
                  style={{
                    borderRadius: getBorderRadiusValue(),
                    height: getInputHeight(),
                    padding: getInputPadding(),
                  }}
                />
              </FormField>

              <FormField label='Gender' required>
                <Select
                  value={watchTravellers?.[index]?.gender || ""}
                  onValueChange={(value) =>
                    setValue(`travellers.${index}.gender`, value)
                  }
                >
                  <SelectTrigger
                    className='bg-input-background border-border text-foreground'
                    style={{
                      borderRadius: getBorderRadiusValue(),
                      height: getInputHeight(),
                      padding: getInputPadding(),
                    }}
                  >
                    <SelectValue placeholder='Select gender' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='male'>Male</SelectItem>
                    <SelectItem value='female'>Female</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label='Passport Number' required>
                <Input
                  {...register(`travellers.${index}.passportNumber`, {
                    required: "Passport number is required",
                  })}
                  placeholder='Enter passport number'
                  className='bg-input-background border-border text-foreground'
                  style={{
                    borderRadius: getBorderRadiusValue(),
                    height: getInputHeight(),
                    padding: getInputPadding(),
                  }}
                />
              </FormField>

              <FormField label='Nationality' required>
                <Select
                  value={watchTravellers?.[index]?.nationality || ""}
                  onValueChange={(value) =>
                    setValue(`travellers.${index}.nationality`, value)
                  }
                >
                  <SelectTrigger
                    className='bg-input-background border-border text-foreground'
                    style={{
                      borderRadius: getBorderRadiusValue(),
                      height: getInputHeight(),
                      padding: getInputPadding(),
                    }}
                  >
                    <SelectValue placeholder='Select nationality' />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label='Relationship' required>
                <Select
                  value={watchTravellers?.[index]?.relationship || ""}
                  onValueChange={(value) =>
                    setValue(`travellers.${index}.relationship`, value)
                  }
                >
                  <SelectTrigger
                    className='bg-input-background border-border text-foreground'
                    style={{
                      borderRadius: getBorderRadiusValue(),
                      height: getInputHeight(),
                      padding: getInputPadding(),
                    }}
                  >
                    <SelectValue placeholder='Select relationship' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='self'>Self</SelectItem>
                    <SelectItem value='spouse'>Spouse</SelectItem>
                    <SelectItem value='child'>Child</SelectItem>
                    <SelectItem value='parent'>Parent</SelectItem>
                    <SelectItem value='sibling'>Sibling</SelectItem>
                    <SelectItem value='friend'>Friend</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField
              label='Pre-existing Medical Conditions?'
              required
              icon={<Heart className='h-4 w-4' />}
            >
              <RadioGroup
                value={watchTravellers?.[index]?.hasMedicalConditions || "no"}
                onValueChange={(value) =>
                  setValue(`travellers.${index}.hasMedicalConditions`, value)
                }
              >
                <div className='flex items-center space-x-3'>
                  <RadioGroupItem
                    value='no'
                    id={`no-${index}`}
                    className='border-border bg-input-background'
                  />
                  <Label
                    htmlFor={`no-${index}`}
                    className='cursor-pointer text-foreground'
                  >
                    No
                  </Label>
                </div>
                <div className='flex items-center space-x-3'>
                  <RadioGroupItem
                    value='yes'
                    id={`yes-${index}`}
                    className='border-border bg-input-background'
                  />
                  <Label
                    htmlFor={`yes-${index}`}
                    className='cursor-pointer text-foreground'
                  >
                    Yes
                  </Label>
                </div>
              </RadioGroup>
            </FormField>

            {watchTravellers?.[index]?.hasMedicalConditions === "yes" && (
              <FormField label='Medical Condition Details' required>
                <Textarea
                  {...register(`travellers.${index}.medicalDetails`, {
                    required: "Please provide details",
                  })}
                  placeholder='Please describe the medical condition'
                  className='bg-input-background border-border text-foreground'
                  style={{
                    borderRadius: getBorderRadiusValue(),
                    padding: getInputPadding(),
                  }}
                  rows={3}
                />
              </FormField>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  // Render Step 3: Coverage Selection
  const renderStep3 = () => (
    <div className={getSpacingClass()}>
      <div
        className='mb-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20'
        style={{ borderRadius: getCardBorderRadius() }}
      >
        <div className='flex items-center gap-3 mb-2'>
          <div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
            <Shield className='h-5 w-5 text-primary' />
          </div>
          <h3 className='text-foreground'>Choose Your Coverage</h3>
        </div>
        <p className='text-muted-foreground'>
          Select the plan that best fits your needs
        </p>
      </div>

      <FormField label='Coverage Plan' required>
        <div
          className='flex flex-col lg:grid lg:grid-cols-3 gap-4'
          role='radiogroup'
          aria-label='Coverage Plan'
        >
          {coveragePlans.map((plan, planIndex) => {
            const planIcons = [
              <Shield className='h-6 w-6' key='basic' />,
              <Star className='h-6 w-6' key='silver' />,
              <Sparkles className='h-6 w-6' key='gold' />,
            ];

            return (
              <Card
                key={plan.id}
                role='radio'
                tabIndex={0}
                aria-checked={watchCoveragePlan === plan.id}
                className={`p-4 sm:p-6 cursor-pointer transition-all border-2 flex flex-col focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  watchCoveragePlan === plan.id
                    ? "border-primary bg-primary/5 scale-105 shadow-lg"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                }`}
                onClick={() => setValue("coveragePlan", plan.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setValue("coveragePlan", plan.id);
                  }
                }}
                style={{
                  borderRadius: getCardBorderRadius(),
                  transition: "all var(--transition-normal)",
                  width: "100%",
                }}
              >
                <div className='flex items-center justify-between mb-4 gap-2'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        watchCoveragePlan === plan.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {planIcons[planIndex]}
                    </div>
                    <h4 className='text-foreground break-words'>{plan.name}</h4>
                  </div>
                  {watchCoveragePlan === plan.id && (
                    <CheckCircle2
                      className='h-6 w-6 text-primary flex-shrink-0'
                      aria-hidden='true'
                    />
                  )}
                </div>
                <p className='text-muted-foreground mb-4 break-words'>
                  {plan.description}
                </p>
                <div className='space-y-2 flex-1'>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className='flex items-start gap-2'>
                      <Check
                        className='h-4 w-4 text-success mt-0.5 flex-shrink-0'
                        aria-hidden='true'
                      />
                      <span className='text-foreground break-words'>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <div className='mt-auto pt-4 border-t border-border'>
                  <div className='flex items-baseline gap-2 flex-wrap'>
                    <span
                      className='text-foreground'
                      style={{ fontSize: "1.5rem", fontWeight: "600" }}
                    >
                      ${plan.price}
                    </span>
                    <span className='text-muted-foreground'>per person</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </FormField>

      <div className='pt-4'>
        <div className='flex items-center gap-2 mb-4'>
          <Sparkles className='h-5 w-5 text-primary' />
          <h4 className='text-foreground'>Add Extra Protection</h4>
        </div>
        <div className='space-y-3'>
          {addOnCoverages.map((addon) => (
            <Card
              key={addon.id}
              className={`p-4 bg-card border transition-all cursor-pointer ${
                watchAddOns.includes(addon.id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
              style={{ borderRadius: getCardBorderRadius(), minHeight: "44px" }}
              onClick={() => {
                if (watchAddOns.includes(addon.id)) {
                  setValue(
                    "addOns",
                    watchAddOns.filter((id: string) => id !== addon.id)
                  );
                } else {
                  setValue("addOns", [...watchAddOns, addon.id]);
                }
              }}
            >
              <div className='flex items-start gap-3 flex-wrap sm:flex-nowrap'>
                <Checkbox
                  id={addon.id}
                  checked={watchAddOns.includes(addon.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue("addOns", [...watchAddOns, addon.id]);
                    } else {
                      setValue(
                        "addOns",
                        watchAddOns.filter((id: string) => id !== addon.id)
                      );
                    }
                  }}
                  className='mt-1 flex-shrink-0'
                />
                <div className='flex-1 min-w-0'>
                  <Label
                    htmlFor={addon.id}
                    className='cursor-pointer text-foreground break-words'
                  >
                    {addon.name}
                  </Label>
                  <p className='text-muted-foreground break-words'>
                    {addon.description}
                  </p>
                </div>
                <div className='flex items-center gap-1 flex-shrink-0'>
                  <span
                    className='text-foreground'
                    style={{ fontWeight: "600" }}
                  >
                    +${addon.price}
                  </span>
                  <span className='text-muted-foreground'>/person</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Step 4: Summary & Payment
  const renderStep4 = () => {
    const selectedPlan = coveragePlans.find((p) => p.id === watchCoveragePlan);
    const selectedAddOns = addOnCoverages.filter((a) =>
      watchAddOns.includes(a.id)
    );
    const subtotal = (selectedPlan?.price || 0) * watchNumTravellers;
    const addOnsTotal =
      selectedAddOns.reduce((sum, addon) => sum + addon.price, 0) *
      watchNumTravellers;
    const total = subtotal + addOnsTotal;

    return (
      <div className={getSpacingClass()}>
        <div
          className='mb-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20'
          style={{ borderRadius: getCardBorderRadius() }}
        >
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
              <FileText className='h-5 w-5 text-primary' />
            </div>
            <h3 className='text-foreground'>Review & Pay</h3>
          </div>
          <p className='text-muted-foreground'>
            Verify your details and complete payment
          </p>
        </div>

        <Card
          className='p-4 sm:p-6 bg-card border border-border'
          style={{
            borderRadius: getCardBorderRadius(),
            boxShadow: "var(--elevation-md)",
          }}
        >
          <div className='flex items-center gap-2 mb-4'>
            <FileText className='h-5 w-5 text-primary' />
            <h3 className='text-foreground break-words'>Booking Summary</h3>
          </div>
          <div className='space-y-3'>
            <div className='flex justify-between gap-4 flex-wrap'>
              <span className='text-muted-foreground'>Trip Type:</span>
              <span className='text-foreground text-right break-words'>
                {watchTripType === "single"
                  ? "Single Trip"
                  : "Annual Multi-trip"}
              </span>
            </div>
            <div className='flex justify-between gap-4 flex-wrap'>
              <span className='text-muted-foreground'>Destination:</span>
              <span className='text-foreground text-right break-words'>
                {countries.find((c) => c.value === watchDestination)?.label}
              </span>
            </div>
            <div className='flex justify-between gap-4 flex-wrap'>
              <span className='text-muted-foreground'>Travel Dates:</span>
              <span className='text-foreground text-right break-words'>
                {watchStartDate} to {watchEndDate}
              </span>
            </div>
            <div className='flex justify-between gap-4 flex-wrap'>
              <span className='text-muted-foreground'>
                Number of Travellers:
              </span>
              <span className='text-foreground text-right'>
                {watchNumTravellers}
              </span>
            </div>
            <div className='flex justify-between gap-4 flex-wrap'>
              <span className='text-muted-foreground'>Coverage Plan:</span>
              <span className='text-foreground text-right break-words'>
                {selectedPlan?.name}
              </span>
            </div>
            {selectedAddOns.length > 0 && (
              <div className='flex justify-between gap-4 flex-wrap'>
                <span className='text-muted-foreground'>Add-ons:</span>
                <span className='text-foreground text-right break-words'>
                  {selectedAddOns.map((a) => a.name).join(", ")}
                </span>
              </div>
            )}
            <div className='border-t border-border pt-3 mt-3'>
              <div className='flex justify-between gap-4 flex-wrap'>
                <span className='text-muted-foreground'>Base Coverage:</span>
                <span className='text-foreground'>${subtotal}</span>
              </div>
              {addOnsTotal > 0 && (
                <div className='flex justify-between gap-4 flex-wrap'>
                  <span className='text-muted-foreground'>Add-ons:</span>
                  <span className='text-foreground'>${addOnsTotal}</span>
                </div>
              )}
              <div
                className='flex justify-between gap-4 flex-wrap mt-2 pt-2 border-t border-border bg-primary/5 -mx-6 px-6 py-3 -mb-6 rounded-b'
                style={{
                  borderRadius: `0 0 ${getCardBorderRadius()} ${getCardBorderRadius()}`,
                }}
              >
                <span className='text-foreground'>Total Amount:</span>
                <span
                  className='text-primary'
                  style={{ fontSize: "1.5rem", fontWeight: "700" }}
                >
                  ${total}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <FormField
          label='Payment Method'
          required
          icon={<CreditCard className='h-4 w-4' />}
        >
          <RadioGroup
            value={watchPaymentMethod}
            onValueChange={(value) => setValue("paymentMethod", value)}
            className='space-y-3'
          >
            <Card
              className={`p-4 cursor-pointer transition-all ${
                watchPaymentMethod === "credit_card"
                  ? "border-2 border-primary bg-primary/5"
                  : "border border-border"
              }`}
              style={{ borderRadius: getCardBorderRadius() }}
              onClick={() => setValue("paymentMethod", "credit_card")}
            >
              <div className='flex items-center space-x-3'>
                <RadioGroupItem
                  value='credit_card'
                  id='credit_card'
                  className='border-border bg-input-background'
                />
                <Label
                  htmlFor='credit_card'
                  className='cursor-pointer text-foreground flex items-center gap-2'
                >
                  <CreditCard className='h-4 w-4' />
                  Credit/Debit Card
                </Label>
              </div>
            </Card>
            <Card
              className={`p-4 cursor-pointer transition-all ${
                watchPaymentMethod === "paypal"
                  ? "border-2 border-primary bg-primary/5"
                  : "border border-border"
              }`}
              style={{ borderRadius: getCardBorderRadius() }}
              onClick={() => setValue("paymentMethod", "paypal")}
            >
              <div className='flex items-center space-x-3'>
                <RadioGroupItem
                  value='paypal'
                  id='paypal'
                  className='border-border bg-input-background'
                />
                <Label
                  htmlFor='paypal'
                  className='cursor-pointer text-foreground'
                >
                  PayPal
                </Label>
              </div>
            </Card>
            <Card
              className={`p-4 cursor-pointer transition-all ${
                watchPaymentMethod === "bank_transfer"
                  ? "border-2 border-primary bg-primary/5"
                  : "border border-border"
              }`}
              style={{ borderRadius: getCardBorderRadius() }}
              onClick={() => setValue("paymentMethod", "bank_transfer")}
            >
              <div className='flex items-center space-x-3'>
                <RadioGroupItem
                  value='bank_transfer'
                  id='bank_transfer'
                  className='border-border bg-input-background'
                />
                <Label
                  htmlFor='bank_transfer'
                  className='cursor-pointer text-foreground'
                >
                  Bank Transfer
                </Label>
              </div>
            </Card>
          </RadioGroup>
        </FormField>

        {watchPaymentMethod === "credit_card" && (
          <Card
            className='p-4 sm:p-6 bg-card border border-primary/20'
            style={{ borderRadius: getCardBorderRadius() }}
          >
            <div className='flex items-center gap-2 mb-4'>
              <CreditCard className='h-5 w-5 text-primary' />
              <h4 className='text-foreground break-words'>Card Details</h4>
            </div>
            <div className={getSpacingClass()}>
              <FormField label='Cardholder Name' required>
                <Input
                  {...register("cardholderName", {
                    required: "Name is required",
                  })}
                  placeholder='Enter name on card'
                  className='bg-input-background border-border text-foreground'
                  style={{
                    borderRadius: getBorderRadiusValue(),
                    height: getInputHeight(),
                    padding: getInputPadding(),
                  }}
                />
              </FormField>

              <FormField label='Card Number' required>
                <Input
                  {...register("cardNumber", {
                    required: "Card number is required",
                  })}
                  placeholder='1234 5678 9012 3456'
                  className='bg-input-background border-border text-foreground'
                  style={{
                    borderRadius: getBorderRadiusValue(),
                    height: getInputHeight(),
                    padding: getInputPadding(),
                  }}
                />
              </FormField>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <FormField label='Expiry Date' required>
                  <Input
                    {...register("cardExpiry", {
                      required: "Expiry date is required",
                    })}
                    placeholder='MM/YY'
                    className='bg-input-background border-border text-foreground'
                    style={{
                      borderRadius: getBorderRadiusValue(),
                      height: getInputHeight(),
                      padding: getInputPadding(),
                    }}
                  />
                </FormField>

                <FormField label='CVV' required>
                  <Input
                    {...register("cardCvv", { required: "CVV is required" })}
                    placeholder='123'
                    type='password'
                    maxLength={4}
                    className='bg-input-background border-border text-foreground'
                    style={{
                      borderRadius: getBorderRadiusValue(),
                      height: getInputHeight(),
                      padding: getInputPadding(),
                    }}
                    aria-label='Card CVV security code'
                  />
                </FormField>
              </div>
            </div>
          </Card>
        )}

        <div className='space-y-3'>
          <Card
            className={`p-4 cursor-pointer transition-all ${
              watchDeclaration
                ? "border-primary/30 bg-primary/5"
                : "border-border"
            }`}
            style={{ borderRadius: getBorderRadiusValue(), minHeight: "44px" }}
            onClick={() => setValue("declaration", !watchDeclaration)}
          >
            <div className='flex items-start gap-3'>
              <Checkbox
                id='declaration'
                checked={watchDeclaration}
                onCheckedChange={(checked) =>
                  setValue("declaration", checked as boolean)
                }
                className='mt-1'
              />
              <Label
                htmlFor='declaration'
                className='cursor-pointer text-foreground break-words flex-1'
              >
                I declare that all information provided is accurate and complete
                to the best of my knowledge.
              </Label>
            </div>
          </Card>

          <Card
            className={`p-4 cursor-pointer transition-all ${
              watchTerms ? "border-primary/30 bg-primary/5" : "border-border"
            }`}
            style={{ borderRadius: getBorderRadiusValue(), minHeight: "44px" }}
            onClick={() => setValue("terms", !watchTerms)}
          >
            <div className='flex items-start gap-3'>
              <Checkbox
                id='terms'
                checked={watchTerms}
                onCheckedChange={(checked) =>
                  setValue("terms", checked as boolean)
                }
                className='mt-1'
              />
              <Label
                htmlFor='terms'
                className='cursor-pointer text-foreground break-words flex-1'
              >
                I agree to the terms and conditions and privacy policy.
              </Label>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Render thank you page
  const renderThankYou = () => (
    <Card
      className='p-4 sm:p-8 bg-card border border-border text-center overflow-hidden relative'
      style={{ borderRadius: getCardBorderRadius() }}
      role='region'
      aria-live='polite'
    >
      <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10'></div>
      <div className='absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-3xl -z-10'></div>

      <div
        className='w-20 h-20 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce'
        style={{
          borderRadius: borderRadius === "sharp" ? "0px" : "50%",
          animation: "bounce 1s ease-in-out 2",
        }}
        aria-hidden='true'
      >
        <CheckCircle2 className='h-10 w-10 text-success-foreground' />
      </div>

      <div className='flex items-center justify-center gap-2 mb-2'>
        <Sparkles className='h-6 w-6 text-primary' />
        <h2 className='text-foreground break-words'>
          Policy Issued Successfully!
        </h2>
        <Sparkles className='h-6 w-6 text-primary' />
      </div>

      <p className='text-muted-foreground mb-6 break-words'>
        Your travel insurance policy has been issued and confirmed.
      </p>

      <div
        className='bg-gradient-to-br from-primary/10 to-primary/5 p-6 mb-6 border border-primary/20'
        style={{ borderRadius: getCardBorderRadius() }}
      >
        <p className='text-muted-foreground mb-2'>Policy Number</p>
        <p
          className='text-foreground break-all'
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            letterSpacing: "0.05em",
          }}
        >
          {policyNumber}
        </p>
      </div>

      <div
        className='text-left bg-card border border-border p-6 mb-6'
        style={{
          borderRadius: getCardBorderRadius(),
          boxShadow: "var(--elevation-sm)",
        }}
      >
        <div className='flex items-center gap-2 mb-4'>
          <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
            <Check className='h-4 w-4 text-primary' />
          </div>
          <h3 className='text-foreground break-words'>What happens next?</h3>
        </div>
        <ul className='space-y-3 text-muted-foreground'>
          <li className='break-words flex items-start gap-2'>
            <CheckCircle2 className='h-5 w-5 text-success flex-shrink-0 mt-0.5' />
            <span>Policy documents sent to your email</span>
          </li>
          <li className='break-words flex items-start gap-2'>
            <CheckCircle2 className='h-5 w-5 text-success flex-shrink-0 mt-0.5' />
            <span>Coverage effective from {watchStartDate}</span>
          </li>
          <li className='break-words flex items-start gap-2'>
            <CheckCircle2 className='h-5 w-5 text-success flex-shrink-0 mt-0.5' />
            <span>24/7 emergency assistance available</span>
          </li>
          <li className='break-words flex items-start gap-2'>
            <CheckCircle2 className='h-5 w-5 text-success flex-shrink-0 mt-0.5' />
            <span>Digital policy card in your inbox</span>
          </li>
        </ul>
      </div>

      <div
        className='text-left bg-muted/30 p-6 border border-muted'
        style={{ borderRadius: getCardBorderRadius() }}
      >
        <div className='flex items-center gap-2 mb-3'>
          <AlertCircle className='h-5 w-5 text-primary' />
          <h4 className='text-foreground break-words'>Important Information</h4>
        </div>
        <ul className='space-y-2 text-muted-foreground'>
          <li className='break-words'>• Keep your policy number handy</li>
          <li className='break-words'>
            • Emergency helpline: 1-800-TRAVEL-HELP
          </li>
          <li className='break-words'>• Claims can be filed 24/7 online</li>
        </ul>
      </div>

      <Button
        onClick={handleRestartJourney}
        className='w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90'
        style={{
          borderRadius: getButtonBorderRadius(),
          minHeight: "48px",
          padding: "0.75rem 1.5rem",
        }}
      >
        <Plane className='h-4 w-4 mr-2' />
        Create New Policy
      </Button>
    </Card>
  );

  // Main render
  if (isSubmitted) {
    return (
      <div
        className='min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8'
        style={getThemeStyle()}
      >
        <div className='max-w-4xl mx-auto'>{renderThankYou()}</div>
      </div>
    );
  }

  return (
    <main
      className='min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8'
      style={getThemeStyle()}
    >
      <div className='max-w-4xl mx-auto'>
        <header className='mb-6 sm:mb-8 text-center'>
          <div className='flex items-center justify-center gap-3 mb-3'>
            <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
              <Shield className='h-6 w-6 text-primary' />
            </div>
            <h1 className='text-foreground break-words px-2'>
              Travel Insurance Quote & Buy
            </h1>
          </div>
          <p className='text-muted-foreground break-words px-2'>
            Complete your travel insurance purchase through our guided journey
          </p>
        </header>

        {renderStepper()}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card
            className='p-4 sm:p-8 bg-card border border-border mb-6'
            style={{
              borderRadius: getCardBorderRadius(),
              boxShadow: "var(--elevation-md)",
              padding: getCardPadding(),
            }}
          >
            {currentStep === 0 && renderStep1()}
            {currentStep === 1 && renderStep2()}
            {currentStep === 2 && renderStep3()}
            {currentStep === 3 && renderStep4()}
          </Card>

          <div className='flex gap-3 justify-between flex-wrap'>
            <Button
              type='button'
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant='outline'
              className='transition-all disabled:opacity-50'
              style={{
                borderRadius: getButtonBorderRadius(),
                minHeight: "48px",
                padding: "0.75rem 1.5rem",
              }}
            >
              <ChevronLeft className='h-4 w-4 mr-1' />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type='button'
                onClick={handleNext}
                className='bg-primary text-primary-foreground hover:bg-primary/90 transition-all ml-auto'
                style={{
                  borderRadius: getButtonBorderRadius(),
                  minHeight: "48px",
                  padding: "0.75rem 1.5rem",
                }}
              >
                Next
                <ChevronRight className='h-4 w-4 ml-1' />
              </Button>
            ) : (
              <Button
                type='submit'
                disabled={!watchDeclaration || !watchTerms}
                className='bg-primary text-primary-foreground hover:bg-primary/90 transition-all ml-auto disabled:opacity-50'
                style={{
                  borderRadius: getButtonBorderRadius(),
                  minHeight: "48px",
                  padding: "0.75rem 1.5rem",
                }}
              >
                <Check className='h-4 w-4 mr-2' />
                Complete Purchase
              </Button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

// Import Badge component at the top
import { Badge } from "./ui/badge";
