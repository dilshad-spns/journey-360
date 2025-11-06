import React, { useState, useEffect } from "react";
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
import { Badge } from "./ui/badge";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  Shield,
  CreditCard,
  Plane,
  Globe,
  Heart,
  Sparkles,
  CheckCircle2,
  Circle,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import {
  countries,
  coveragePlans,
  addOnCoverages,
} from "../utils/travelInsuranceData";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  TripIllustration,
  TravellerIllustration,
  CoverageIllustration,
  NomineeIllustration,
  SuccessIllustration,
} from "./TravelInsuranceIllustrations";

interface TravelInsuranceFormGlassProps {
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
  age: string;
  passportNumber: string;
  hasMedicalConditions: string;
}

interface FormData {
  tripType: string;
  destination: string;
  travelStartDate: string;
  travelEndDate: string;
  numTravellers: number;
  travellers: TravellerInfo[];
  coveragePlan: string;
  nomineeName: string;
  nomineeRelation: string;
  nomineeContact: string;
  paymentMethod: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

const TravelInsuranceFormGlassComponent = ({
  showStepper = true,
  stepperType = "numbers",
  borderRadius = "rounded",
  spacing = "comfortable",
  labelPosition = "top",
  inputSize = "md",
  template = "simple",
  themeColors,
  onFormDataChange,
}: TravelInsuranceFormGlassProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [policyNumber, setPolicyNumber] = useState("");
  const [viewportMode, setViewportMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  // Local state for conditional rendering (prevents re-renders from watch)
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [nomineeRelation, setNomineeRelation] = useState("");
  const [tripType, setTripType] = useState("");
  const [destination, setDestination] = useState("");
  const [coveragePlan, setCoveragePlan] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numTravellers, setNumTravellers] = useState(1);
  const [travellerMedicalConditions, setTravellerMedicalConditions] = useState<{
    [key: number]: string;
  }>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    getValues,
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
      nomineeName: "",
      nomineeRelation: "",
      nomineeContact: "",
      paymentMethod: "card",
    },
  });

  const { fields: travellerFields, replace: replaceTravellers } = useFieldArray(
    {
      control,
      name: "travellers",
    }
  );

  // Initialize travellers array on mount
  useEffect(() => {
    if (travellerFields.length === 0) {
      const num = getValues("numTravellers") || 1;
      const initialTravellers: TravellerInfo[] = [];
      const medicalConditions: { [key: number]: string } = {};
      for (let i = 0; i < num; i++) {
        initialTravellers.push({
          fullName: "",
          age: "",
          passportNumber: "",
          hasMedicalConditions: "no",
        });
        medicalConditions[i] = "no";
      }
      replaceTravellers(initialTravellers);
      setTravellerMedicalConditions(medicalConditions);
    }
  }, []);

  // Configuration helper functions
  const getCardBorderRadius = () => {
    switch (borderRadius) {
      case "sharp":
        return "0px";
      case "pill":
        return "24px";
      default:
        return "var(--radius-card)";
    }
  };

  const getInputBorderRadius = () => {
    switch (borderRadius) {
      case "sharp":
        return "0px";
      case "pill":
        return "999px";
      default:
        return "var(--radius-input)";
    }
  };

  const getButtonBorderRadius = () => {
    switch (borderRadius) {
      case "sharp":
        return "0px";
      case "pill":
        return "999px";
      default:
        return "var(--radius-button)";
    }
  };

  const getSpacingValue = () => {
    switch (spacing) {
      case "compact":
        return "1rem";
      case "spacious":
        return "2rem";
      default:
        return "1.5rem";
    }
  };

  const getFieldGap = () => {
    switch (spacing) {
      case "compact":
        return "0.75rem";
      case "spacious":
        return "1.5rem";
      default:
        return "1rem";
    }
  };

  const getInputHeight = () => {
    switch (inputSize) {
      case "sm":
        return "2.5rem";
      case "lg":
        return "3.5rem";
      default:
        return "3rem";
    }
  };

  const getInputPadding = () => {
    switch (inputSize) {
      case "sm":
        return "0.5rem 0.875rem";
      case "lg":
        return "0.875rem 1.25rem";
      default:
        return "0.75rem 1rem";
    }
  };

  // Update traveller fields when number changes
  useEffect(() => {
    const subscription = watch((formData, { name }) => {
      if (name === "numTravellers") {
        const num = parseInt(String(formData.numTravellers)) || 1;
        const currentLength = travellerFields.length;

        // Only update if the actual count is different
        if (num !== currentLength && num > 0 && num <= 10) {
          const currentTravellers = getValues("travellers") || [];
          const newTravellers: TravellerInfo[] = [];
          const medicalConditions: { [key: number]: string } = {};
          for (let i = 0; i < num; i++) {
            newTravellers.push(
              currentTravellers[i] || {
                fullName: "",
                age: "",
                passportNumber: "",
                hasMedicalConditions: "no",
              }
            );
            medicalConditions[i] =
              currentTravellers[i]?.hasMedicalConditions || "no";
          }
          replaceTravellers(newTravellers);
          setTravellerMedicalConditions(medicalConditions);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [travellerFields.length]);

  // Sync local state with form values for conditional rendering
  useEffect(() => {
    const subscription = watch((formData, { name }) => {
      if (name === "paymentMethod" && formData.paymentMethod) {
        setPaymentMethod(formData.paymentMethod);
      }
      if (name === "nomineeRelation" && formData.nomineeRelation) {
        setNomineeRelation(formData.nomineeRelation);
      }
      if (name === "tripType" && formData.tripType) {
        setTripType(formData.tripType);
      }
      if (name === "destination" && formData.destination) {
        setDestination(formData.destination);
      }
      if (name === "coveragePlan" && formData.coveragePlan) {
        setCoveragePlan(formData.coveragePlan);
      }
      if (name === "travelStartDate" && formData.travelStartDate) {
        setStartDate(formData.travelStartDate);
      }
      if (name === "travelEndDate" && formData.travelEndDate) {
        setEndDate(formData.travelEndDate);
      }
      if (name === "numTravellers" && formData.numTravellers !== undefined) {
        setNumTravellers(formData.numTravellers);
      }
      if (
        name?.startsWith("travellers.") &&
        name?.includes("hasMedicalConditions")
      ) {
        const index = parseInt(name.split(".")[1]);
        const travellers = formData.travellers || [];
        if (travellers[index]?.hasMedicalConditions) {
          setTravellerMedicalConditions((prev) => ({
            ...prev,
            [index]: travellers[index].hasMedicalConditions,
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
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

  const steps = ["Trip Details", "Travellers", "Plan", "Nominee", "Payment"];

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
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestartJourney = () => {
    reset();
    setCurrentStep(0);
    setIsSubmitted(false);
    setPolicyNumber("");
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return (
      value
        .replace(/\s/g, "")
        .match(/.{1,4}/g)
        ?.join(" ") || value
    );
  };

  // Format expiry as MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  // Get theme custom properties if themeColors provided
  const getThemeStyles = () => {
    if (!themeColors || themeColors.length === 0) {
      return {};
    }
    return {
      "--theme-primary": themeColors[0],
      "--theme-accent": themeColors[1] || themeColors[0],
    } as React.CSSProperties;
  };

  // Get container max width based on viewport mode
  const getContainerMaxWidth = () => {
    switch (viewportMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      case "desktop":
        return "1024px";
      default:
        return "1024px";
    }
  };

  // Success Screen
  if (isSubmitted) {
    return (
      <div
        className='min-h-screen flex items-center justify-center p-4'
        style={{ ...getThemeStyles(), backgroundColor: "#F8F8F8" }}
      >
        <div
          className='max-w-2xl w-full bg-card border border-border shadow-xl overflow-hidden'
          style={{
            borderRadius: getCardBorderRadius(),
          }}
        >
          {/* Success Illustration */}
          <div className='relative overflow-hidden'>
            <div
              className='flex items-center justify-center py-12'
              style={{
                background: `linear-gradient(135deg, ${
                  themeColors?.[0] ? "var(--theme-primary)" : "var(--primary)"
                } 0%, ${
                  themeColors?.[1] ? "var(--theme-accent)" : "var(--success)"
                } 100%)`,
              }}
            >
              <div className='w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg'>
                <CheckCircle2
                  className='w-20 h-20'
                  style={{ color: themeColors?.[0] || "var(--success)" }}
                />
              </div>
            </div>
          </div>

          <div
            className='p-4 sm:p-8 text-center'
            style={{
              gap: getSpacingValue(),
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <h2 className='text-foreground'>Successful!</h2>
              <p className='text-muted-foreground'>
                Your travel insurance has been activated
              </p>
            </div>

            <div
              className='p-3 sm:p-6 bg-muted border border-border overflow-hidden'
              style={{
                borderRadius: getInputBorderRadius(),
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div className='flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-4 min-w-0'>
                <span className='text-muted-foreground flex items-center gap-2 flex-shrink-0'>
                  <Shield className='w-4 h-4 text-success flex-shrink-0' />
                  Coverage Plan
                </span>
                <span className='text-foreground capitalize break-words sm:text-right min-w-0 overflow-wrap-anywhere'>
                  {coveragePlan}
                </span>
              </div>
              <div className='flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-4 min-w-0'>
                <span className='text-muted-foreground flex items-center gap-2 flex-shrink-0'>
                  <Plane className='w-4 h-4 text-success flex-shrink-0' />
                  Trip Type
                </span>
                <span className='text-foreground capitalize break-words sm:text-right min-w-0 overflow-wrap-anywhere'>
                  {tripType === "single" ? "Single Trip" : "Annual Multi-trip"}
                </span>
              </div>
              <div className='flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-4 min-w-0'>
                <span className='text-muted-foreground flex items-center gap-2 flex-shrink-0'>
                  <Globe className='w-4 h-4 text-success flex-shrink-0' />
                  Destination
                </span>
                <span className='text-foreground break-words sm:text-right min-w-0 overflow-wrap-anywhere'>
                  {countries.find((c) => c.value === destination)?.label}
                </span>
              </div>
              <div className='flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-4 min-w-0'>
                <span className='text-muted-foreground flex items-center gap-2 flex-shrink-0'>
                  <Calendar className='w-4 h-4 text-success flex-shrink-0' />
                  Travel Dates
                </span>
                <span className='text-foreground break-words sm:text-right min-w-0 overflow-wrap-anywhere'>
                  {startDate} - {endDate}
                </span>
              </div>
              <div className='flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-4 min-w-0'>
                <span className='text-muted-foreground flex items-center gap-2 flex-shrink-0'>
                  <Users className='w-4 h-4 text-success flex-shrink-0' />
                  Travellers
                </span>
                <span className='text-foreground break-words sm:text-right min-w-0 overflow-wrap-anywhere'>
                  {numTravellers}
                </span>
              </div>
              <div className='flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-4 pt-3 border-t border-border min-w-0'>
                <span className='text-muted-foreground flex-shrink-0'>
                  Policy Number
                </span>
                <Badge
                  variant='secondary'
                  className='flex items-center gap-1.5 bg-success/10 text-success border-success/20 w-fit break-all max-w-full'
                >
                  <CheckCircle2 className='w-3.5 h-3.5 flex-shrink-0' />
                  <span className='truncate'>{policyNumber}</span>
                </Badge>
              </div>
            </div>

            <Button
              onClick={handleRestartJourney}
              className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
              style={{
                height: getInputHeight(),
                borderRadius: getButtonBorderRadius(),
                backgroundColor: themeColors?.[0]
                  ? `var(--theme-primary)`
                  : undefined,
              }}
            >
              Start New Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Progress Indicator - Different types based on stepperType
  const renderProgress = () => {
    if (!showStepper) return null;

    const progressPercent = (currentStep / (steps.length - 1)) * 100;

    // Dots Stepper
    if (stepperType === "dots") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: getFieldGap(),
          }}
        >
          <div className='flex items-center justify-center gap-2'>
            {steps.map((_, index) => (
              <div
                key={index}
                className='transition-all duration-300'
                style={{
                  width: index === currentStep ? "2rem" : "0.75rem",
                  height: "0.75rem",
                  borderRadius: "999px",
                  background:
                    index <= currentStep
                      ? index === currentStep
                        ? themeColors?.[0]
                          ? `var(--theme-primary)`
                          : "var(--primary)"
                        : "var(--success)"
                      : "var(--border)",
                }}
              />
            ))}
          </div>
          <div className='text-center'>
            <span className='text-muted-foreground'>
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </span>
          </div>
        </div>
      );
    }

    // Progress Bar Stepper
    if (stepperType === "progress") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: getFieldGap(),
          }}
        >
          <div className='flex justify-between items-center'>
            <span className='text-foreground'>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className='text-muted-foreground'>
              {Math.round(progressPercent)}% Complete
            </span>
          </div>
          <div
            className='w-full bg-muted h-2 overflow-hidden'
            style={{ borderRadius: getInputBorderRadius() }}
          >
            <div
              className='h-full transition-all duration-300'
              style={{
                width: `${progressPercent}%`,
                backgroundColor: themeColors?.[0]
                  ? `var(--theme-primary)`
                  : "var(--primary)",
              }}
            />
          </div>
          <p className='text-muted-foreground'>{steps[currentStep]}</p>
        </div>
      );
    }

    // Breadcrumb Stepper
    if (stepperType === "breadcrumb") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: getFieldGap(),
          }}
        >
          <div className='flex items-center justify-center flex-wrap gap-2'>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className='px-3 py-2 flex items-center gap-2 transition-all duration-300'
                  style={{
                    background:
                      index === currentStep
                        ? themeColors?.[0]
                          ? `var(--theme-primary)`
                          : "var(--primary)"
                        : index < currentStep
                        ? "var(--success)"
                        : "var(--muted)",
                    color:
                      index <= currentStep
                        ? "white"
                        : "var(--muted-foreground)",
                    borderRadius: getButtonBorderRadius(),
                  }}
                >
                  {index < currentStep && <Check className='w-4 h-4' />}
                  <span className='hidden sm:inline'>{step}</span>
                  <span className='sm:hidden'>{index + 1}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className='w-5 h-5 text-muted-foreground hidden sm:block' />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }

    // Numbers Stepper (default)
    return (
      <div
        style={{ display: "flex", flexDirection: "column", gap: getFieldGap() }}
      >
        {/* Progress Bar */}
        <div className='flex items-center gap-2'>
          {steps.map((_, index) => (
            <div
              key={index}
              className='flex-1 h-2 transition-all duration-300'
              style={{
                background:
                  index <= currentStep
                    ? themeColors?.[0]
                      ? `var(--theme-primary)`
                      : "var(--primary)"
                    : "var(--border)",
                borderRadius: getInputBorderRadius(),
              }}
            />
          ))}
        </div>

        {/* Step Circles */}
        <div className='flex items-center justify-between relative'>
          {steps.map((step, index) => (
            <div
              key={index}
              className='flex flex-col items-center gap-2 relative z-10'
            >
              <div
                className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                  index === currentStep ? "scale-110" : ""
                }`}
                style={{
                  background:
                    index <= currentStep
                      ? index === currentStep
                        ? themeColors?.[0]
                          ? `var(--theme-primary)`
                          : "var(--primary)"
                        : "var(--success)"
                      : "var(--card)",
                  border:
                    index > currentStep ? "2px solid var(--border)" : "none",
                  borderRadius: borderRadius === "sharp" ? "0px" : "50%",
                }}
              >
                {index < currentStep ? (
                  <Check className='w-5 h-5 text-white' />
                ) : (
                  <span
                    className={
                      index === currentStep
                        ? "text-white"
                        : "text-muted-foreground"
                    }
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`text-xs text-center max-w-[60px] hidden sm:block ${
                  index === currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        {stepperType === "dots" && (
          <div className='text-center'>
            <span className='text-muted-foreground'>
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Field wrapper for label positioning
  const FieldWrapper = ({
    label,
    required,
    children,
  }: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
  }) => {
    if (labelPosition === "left") {
      return (
        <div className='flex items-start gap-4'>
          <Label
            className='text-foreground pt-2'
            style={{ width: "180px", flexShrink: 0 }}
          >
            {label} {required && <span className='text-destructive'>*</span>}
          </Label>
          <div className='flex-1'>{children}</div>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Label className='text-foreground flex items-center gap-2'>
          {label} {required && <span className='text-destructive'>*</span>}
        </Label>
        {children}
      </div>
    );
  };

  // Step content wrapper for template layouts
  const StepContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (template === "two-column") {
      return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>{children}</div>
      );
    }

    if (template === "carded") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: getFieldGap(),
          }}
        >
          {React.Children.map(children, (child) => (
            <div
              className='p-4 bg-card border border-border'
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
      <div
        style={{ display: "flex", flexDirection: "column", gap: getFieldGap() }}
      >
        {children}
      </div>
    );
  };

  // Step 1: Trip Information
  const renderStep1 = () => (
    <div
      className='animate-in fade-in-50 slide-in-from-bottom-4 duration-500'
      style={{
        display: "flex",
        flexDirection: "column",
        gap: getSpacingValue(),
      }}
    >
      {/* Illustration */}
      <div
        className='relative overflow-hidden bg-card border border-border flex items-center gap-4'
        style={{
          borderRadius: getInputBorderRadius(),
          padding:
            spacing === "compact"
              ? "1rem"
              : spacing === "spacious"
              ? "1.5rem"
              : "1.25rem",
        }}
      >
        <TripIllustration
          className='w-16 h-16 flex-shrink-0'
          strokeColor={
            themeColors?.[0] ? "var(--theme-primary)" : "var(--primary)"
          }
        />
        <div>
          <h3 className='mb-1 text-foreground'>Trip Information</h3>
          <p className='text-muted-foreground'>
            Let's start with your travel details
          </p>
        </div>
      </div>

      <StepContentWrapper>
        <FieldWrapper label='Trip Type' required>
          <Select
            value={tripType}
            onValueChange={(value) => {
              setValue("tripType", value);
              setTripType(value);
            }}
          >
            <SelectTrigger
              className='bg-input-background border-border text-foreground'
              style={{
                height: getInputHeight(),
                borderRadius: getInputBorderRadius(),
                padding: getInputPadding(),
              }}
            >
              <SelectValue placeholder='Select trip type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='single'>Single Trip</SelectItem>
              <SelectItem value='annual'>Annual Multi-trip</SelectItem>
            </SelectContent>
          </Select>
        </FieldWrapper>

        <FieldWrapper label='Destination' required>
          <Select
            value={destination}
            onValueChange={(value) => {
              setValue("destination", value);
              setDestination(value);
            }}
          >
            <SelectTrigger
              className='bg-input-background border-border text-foreground'
              style={{
                height: getInputHeight(),
                borderRadius: getInputBorderRadius(),
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
        </FieldWrapper>

        <FieldWrapper label='Start Date' required>
          <Input
            type='date'
            {...register("travelStartDate")}
            className='bg-input-background border-border text-foreground date-input-white-icon'
            style={{
              height: getInputHeight(),
              borderRadius: getInputBorderRadius(),
              padding: getInputPadding(),
            }}
          />
        </FieldWrapper>

        <FieldWrapper label='End Date' required>
          <Input
            type='date'
            {...register("travelEndDate")}
            className='bg-input-background border-border text-foreground date-input-white-icon'
            style={{
              height: getInputHeight(),
              borderRadius: getInputBorderRadius(),
              padding: getInputPadding(),
            }}
          />
        </FieldWrapper>

        <FieldWrapper label='Number of Travellers' required>
          <Input
            type='number'
            min='1'
            max='10'
            {...register("numTravellers")}
            className='bg-input-background border-border text-foreground'
            style={{
              height: getInputHeight(),
              borderRadius: getInputBorderRadius(),
              padding: getInputPadding(),
            }}
          />
        </FieldWrapper>
      </StepContentWrapper>
    </div>
  );

  // Step 2: Traveller Information
  const renderStep2 = () => (
    <div
      className='animate-in fade-in-50 slide-in-from-bottom-4 duration-500'
      style={{
        display: "flex",
        flexDirection: "column",
        gap: getSpacingValue(),
      }}
    >
      {/* Illustration */}
      <div
        className='relative overflow-hidden bg-card border border-border flex items-center gap-4'
        style={{
          borderRadius: getInputBorderRadius(),
          padding:
            spacing === "compact"
              ? "1rem"
              : spacing === "spacious"
              ? "1.5rem"
              : "1.25rem",
        }}
      >
        <TravellerIllustration
          className='w-16 h-16 flex-shrink-0'
          strokeColor={
            themeColors?.[0] ? "var(--theme-primary)" : "var(--primary)"
          }
        />
        <div>
          <h3 className='mb-1 text-foreground'>Traveller Information</h3>
          <p className='text-muted-foreground'>
            Please provide details for each traveller
          </p>
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: getFieldGap() }}
      >
        {travellerFields.map((field, index) => (
          <div
            key={field.id}
            className='p-6 border border-border bg-card relative overflow-hidden'
            style={{
              borderRadius: getInputBorderRadius(),
              display: "flex",
              flexDirection: "column",
              gap: getFieldGap(),
            }}
          >
            {/* Decorative corner accent */}
            <div
              className='absolute top-0 left-0 w-20 h-20 opacity-10 pointer-events-none'
              style={{
                background: `linear-gradient(135deg, ${
                  themeColors?.[0] ? "var(--theme-primary)" : "var(--accent)"
                } 0%, transparent 100%)`,
              }}
            />

            <div className='flex items-center gap-3 pb-4 border-b border-border relative z-10'>
              <div
                className='w-8 h-8 flex items-center justify-center text-white relative'
                style={{
                  backgroundColor: themeColors?.[0]
                    ? `var(--theme-primary)`
                    : "var(--accent)",
                  borderRadius: borderRadius === "sharp" ? "0px" : "50%",
                }}
              >
                {index + 1}
                {/* Small decorative dot */}
                <div
                  className='absolute -top-1 -right-1 w-3 h-3 bg-success border-2 border-card'
                  style={{ borderRadius: "50%" }}
                />
              </div>
              <h4 className='text-foreground'>Traveller {index + 1}</h4>
            </div>

            <StepContentWrapper>
              <FieldWrapper label='Full Name' required>
                <Input
                  {...register(`travellers.${index}.fullName`)}
                  placeholder='Enter full name'
                  className='bg-input-background border-border text-foreground'
                  style={{
                    height: getInputHeight(),
                    borderRadius: getInputBorderRadius(),
                    padding: getInputPadding(),
                  }}
                />
              </FieldWrapper>

              <FieldWrapper label='Age' required>
                <Input
                  type='number'
                  {...register(`travellers.${index}.age`)}
                  placeholder='Age'
                  className='bg-input-background border-border text-foreground'
                  style={{
                    height: getInputHeight(),
                    borderRadius: getInputBorderRadius(),
                    padding: getInputPadding(),
                  }}
                />
              </FieldWrapper>

              <FieldWrapper label='Passport Number' required>
                <Input
                  {...register(`travellers.${index}.passportNumber`)}
                  placeholder='Passport number'
                  className='bg-input-background border-border text-foreground'
                  style={{
                    height: getInputHeight(),
                    borderRadius: getInputBorderRadius(),
                    padding: getInputPadding(),
                  }}
                />
              </FieldWrapper>

              <FieldWrapper label='Pre-existing Medical Conditions' required>
                <Select
                  value={travellerMedicalConditions[index] || "no"}
                  onValueChange={(value) => {
                    setValue(`travellers.${index}.hasMedicalConditions`, value);
                    setTravellerMedicalConditions((prev) => ({
                      ...prev,
                      [index]: value,
                    }));
                  }}
                >
                  <SelectTrigger
                    className='bg-input-background border-border text-foreground'
                    style={{
                      height: getInputHeight(),
                      borderRadius: getInputBorderRadius(),
                      padding: getInputPadding(),
                    }}
                  >
                    <SelectValue placeholder='Select an option' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='no'>No</SelectItem>
                    <SelectItem value='yes'>Yes</SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrapper>
            </StepContentWrapper>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 3: Plan Selection
  const renderStep3 = () => (
    <div
      className='animate-in fade-in-50 slide-in-from-bottom-4 duration-500'
      style={{
        display: "flex",
        flexDirection: "column",
        gap: getSpacingValue(),
      }}
    >
      {/* Illustration */}
      <div
        className='relative overflow-hidden bg-card border border-border flex items-center gap-4'
        style={{
          borderRadius: getInputBorderRadius(),
          padding:
            spacing === "compact"
              ? "1rem"
              : spacing === "spacious"
              ? "1.5rem"
              : "1.25rem",
        }}
      >
        <CoverageIllustration
          className='w-16 h-16 flex-shrink-0'
          strokeColor={
            themeColors?.[0] ? "var(--theme-primary)" : "var(--primary)"
          }
        />
        <div>
          <h3 className='mb-1 text-foreground'>Choose Your Plan</h3>
          <p className='text-muted-foreground'>
            Select the coverage that fits your needs
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3'>
        {coveragePlans.map((plan, planIndex) => (
          <div
            key={plan.id}
            className={`p-4 border-2 cursor-pointer transition-all duration-300 bg-card relative overflow-hidden ${
              coveragePlan === plan.id
                ? "border-primary shadow-lg"
                : "border-border hover:border-primary/50"
            }`}
            style={{
              transform: coveragePlan === plan.id ? "translateY(-4px)" : "none",
              borderRadius: getInputBorderRadius(),
              borderColor:
                coveragePlan === plan.id && themeColors?.[0]
                  ? `var(--theme-primary)`
                  : undefined,
            }}
            onClick={() => {
              setValue("coveragePlan", plan.id);
              setCoveragePlan(plan.id);
            }}
          >
            {/* Decorative Shield SVG in background */}
            <div className='absolute -bottom-4 -right-4 w-24 h-24 opacity-5 pointer-events-none'>
              <svg viewBox='0 0 24 24' fill='none' className='w-full h-full'>
                <path
                  d='M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z'
                  fill={themeColors?.[0] || "var(--primary)"}
                />
              </svg>
            </div>

            {/* Decorative circles */}
            {coveragePlan === plan.id && (
              <>
                <div
                  className='absolute top-2 left-2 w-2 h-2'
                  style={{
                    backgroundColor: themeColors?.[0]
                      ? "var(--theme-primary)"
                      : "var(--primary)",
                    borderRadius: "50%",
                    opacity: 0.6,
                  }}
                />
                <div
                  className='absolute top-2 left-6 w-2 h-2'
                  style={{
                    backgroundColor: themeColors?.[0]
                      ? "var(--theme-primary)"
                      : "var(--primary)",
                    borderRadius: "50%",
                    opacity: 0.4,
                  }}
                />
                <div
                  className='absolute top-2 left-10 w-2 h-2'
                  style={{
                    backgroundColor: themeColors?.[0]
                      ? "var(--theme-primary)"
                      : "var(--primary)",
                    borderRadius: "50%",
                    opacity: 0.2,
                  }}
                />
              </>
            )}

            {plan.recommended && (
              <div
                className='absolute -top-3 right-4 px-3 py-1 text-xs text-white flex items-center gap-1'
                style={{
                  borderRadius: getButtonBorderRadius(),
                  backgroundColor: themeColors?.[1]
                    ? `var(--theme-accent)`
                    : "#F8F8F8",
                }}
              >
                <Sparkles className='w-3 h-3' />
                Popular
              </div>
            )}

            <h4 className='text-foreground mb-1 relative z-10'>{plan.name}</h4>
            <div
              className='mb-2'
              style={{
                color: themeColors?.[0]
                  ? `var(--theme-primary)`
                  : "var(--primary)",
              }}
            >
              <span style={{ fontSize: "clamp(18px, 4vw, 24px)" }}>
                ${plan.price}
              </span>
              <span className='text-muted-foreground'> /trip</span>
            </div>
            <p className='text-muted-foreground mb-2'>
              Coverage: {plan.coverage}
            </p>
            <ul className='space-y-1'>
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className='text-muted-foreground flex items-start gap-2'
                >
                  <Check className='w-4 h-4 text-success mt-0.5 flex-shrink-0' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  // Step 4: Nominee Details
  const renderStep4 = () => (
    <div
      className='animate-in fade-in-50 slide-in-from-bottom-4 duration-500'
      style={{
        display: "flex",
        flexDirection: "column",
        gap: getSpacingValue(),
      }}
    >
      {/* Illustration */}
      <div
        className='relative overflow-hidden bg-card border border-border flex items-center gap-4'
        style={{
          borderRadius: getInputBorderRadius(),
          padding:
            spacing === "compact"
              ? "1rem"
              : spacing === "spacious"
              ? "1.5rem"
              : "1.25rem",
        }}
      >
        <NomineeIllustration
          className='w-16 h-16 flex-shrink-0'
          strokeColor={
            themeColors?.[0] ? "var(--theme-primary)" : "var(--primary)"
          }
        />
        <div>
          <h3 className='mb-1 text-foreground'>Nominee Details</h3>
          <p className='text-muted-foreground'>
            Who should we contact in case of emergency?
          </p>
        </div>
      </div>

      <StepContentWrapper>
        <FieldWrapper label='Nominee Name' required>
          <Input
            {...register("nomineeName")}
            placeholder='Enter nominee full name'
            className='bg-input-background border-border text-foreground'
            style={{
              height: getInputHeight(),
              borderRadius: getInputBorderRadius(),
              padding: getInputPadding(),
            }}
          />
        </FieldWrapper>

        <FieldWrapper label='Relationship' required>
          <Select
            value={nomineeRelation}
            onValueChange={(value) => {
              setValue("nomineeRelation", value);
              setNomineeRelation(value);
            }}
          >
            <SelectTrigger
              className='bg-input-background border-border text-foreground'
              style={{
                height: getInputHeight(),
                borderRadius: getInputBorderRadius(),
                padding: getInputPadding(),
              }}
            >
              <SelectValue placeholder='Select relationship' />
            </SelectTrigger>
            <SelectContent>
              {["Spouse", "Parent", "Child", "Sibling", "Friend", "Other"].map(
                (rel) => (
                  <SelectItem key={rel} value={rel.toLowerCase()}>
                    {rel}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </FieldWrapper>

        <FieldWrapper label='Contact Number' required>
          <Input
            {...register("nomineeContact")}
            placeholder='Enter contact number'
            className='bg-input-background border-border text-foreground'
            style={{
              height: getInputHeight(),
              borderRadius: getInputBorderRadius(),
              padding: getInputPadding(),
            }}
          />
        </FieldWrapper>
      </StepContentWrapper>
    </div>
  );

  // Step 5: Payment
  const renderStep5 = () => (
    <div
      className='animate-in fade-in-50 slide-in-from-bottom-4 duration-500'
      style={{
        display: "flex",
        flexDirection: "column",
        gap: getSpacingValue(),
      }}
    >
      {/* Illustration */}
      <div
        className='relative overflow-hidden bg-card border border-border flex items-center gap-4'
        style={{
          borderRadius: getInputBorderRadius(),
          padding:
            spacing === "compact"
              ? "1rem"
              : spacing === "spacious"
              ? "1.5rem"
              : "1.25rem",
        }}
      >
        <div
          className='w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center'
          style={{
            backgroundColor: `color-mix(in srgb, ${
              themeColors?.[0] || "var(--primary)"
            } 12%, var(--card))`,
            border: `2px solid color-mix(in srgb, ${
              themeColors?.[0] || "var(--primary)"
            } 20%, var(--border))`,
          }}
        >
          <CreditCard
            className='w-8 h-8'
            style={{ color: themeColors?.[0] || "var(--primary)" }}
          />
        </div>
        <div>
          <h3 className='mb-1 text-foreground'>Payment Details</h3>
          <p className='text-muted-foreground'>
            Enter your payment information
          </p>
        </div>
      </div>

      <StepContentWrapper>
        <div>
          <Label className='text-foreground mb-3'>
            Payment Method <span className='text-destructive'>*</span>
          </Label>
          <div className='grid grid-cols-2 gap-3'>
            {["card", "upi"].map((method) => (
              <div
                key={method}
                className={`p-4 border-2 cursor-pointer transition-all relative overflow-hidden ${
                  paymentMethod === method
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
                style={{
                  borderRadius: getInputBorderRadius(),
                  borderColor:
                    paymentMethod === method && themeColors?.[0]
                      ? `var(--theme-primary)`
                      : undefined,
                }}
                onClick={() => {
                  setValue("paymentMethod", method);
                  setPaymentMethod(method);
                }}
              >
                {/* Decorative wave pattern */}
                {paymentMethod === method && (
                  <div className='absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none'>
                    <svg viewBox='0 0 100 100' className='w-full h-full'>
                      <path
                        d='M0,50 Q25,30 50,50 T100,50 L100,0 L0,0 Z'
                        fill={themeColors?.[0] || "var(--primary)"}
                      />
                    </svg>
                  </div>
                )}

                <div className='flex flex-col items-center gap-2 relative z-10'>
                  <div
                    className='w-10 h-10 flex items-center justify-center relative'
                    style={{
                      backgroundColor:
                        paymentMethod === method
                          ? themeColors?.[0]
                            ? `var(--theme-primary)`
                            : "var(--primary)"
                          : "var(--secondary)",
                      borderRadius: borderRadius === "sharp" ? "4px" : "8px",
                    }}
                  >
                    <CreditCard
                      className={`w-5 h-5 ${
                        paymentMethod === method
                          ? "text-white"
                          : "text-muted-foreground"
                      }`}
                    />
                    {paymentMethod === method && (
                      <div
                        className='absolute -top-1 -right-1 w-3 h-3 bg-success border-2 border-card'
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                  </div>
                  <span className='text-foreground capitalize'>
                    {method === "card" ? "Credit/Debit" : "UPI"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {paymentMethod === "card" && (
          <>
            <FieldWrapper label='Card Number' required>
              <Input
                {...register("cardNumber")}
                placeholder='1234 5678 9012 3456'
                maxLength={19}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setValue("cardNumber", formatted);
                }}
                className='bg-input-background border-border text-foreground'
                style={{
                  height: getInputHeight(),
                  borderRadius: getInputBorderRadius(),
                  padding: getInputPadding(),
                }}
              />
            </FieldWrapper>

            <FieldWrapper label='Expiry (MM/YY)' required>
              <Input
                {...register("cardExpiry")}
                placeholder='MM/YY'
                maxLength={5}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value);
                  setValue("cardExpiry", formatted);
                }}
                className='bg-input-background border-border text-foreground'
                style={{
                  height: getInputHeight(),
                  borderRadius: getInputBorderRadius(),
                  padding: getInputPadding(),
                }}
              />
            </FieldWrapper>

            <FieldWrapper label='CVV' required>
              <Input
                {...register("cardCvv")}
                placeholder='123'
                maxLength={3}
                type='password'
                className='bg-input-background border-border text-foreground'
                style={{
                  height: getInputHeight(),
                  borderRadius: getInputBorderRadius(),
                  padding: getInputPadding(),
                }}
              />
            </FieldWrapper>
          </>
        )}

        {paymentMethod === "upi" && (
          <FieldWrapper label='UPI ID' required>
            <Input
              placeholder='yourname@upi'
              className='bg-input-background border-border text-foreground'
              style={{
                height: getInputHeight(),
                borderRadius: getInputBorderRadius(),
                padding: getInputPadding(),
              }}
            />
          </FieldWrapper>
        )}
      </StepContentWrapper>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      case 3:
        return renderStep4();
      case 4:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <div
      className='min-h-screen relative overflow-hidden'
      style={{
        ...getThemeStyles(),
        backgroundColor: "var(--container-bg)",
        padding:
          spacing === "compact"
            ? "1rem"
            : spacing === "spacious"
            ? "3rem 1rem"
            : "2rem 1rem",
      }}
    >
      {/* Background Pattern */}
      <div
        className='absolute inset-0 opacity-5 pointer-events-none'
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative Background Elements */}
      <div className='absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none'>
        <div
          className='w-full h-full'
          style={{
            background: themeColors?.[0]
              ? `var(--theme-primary)`
              : "var(--primary)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />
      </div>
      <div className='absolute bottom-0 left-0 w-96 h-96 opacity-10 pointer-events-none'>
        <div
          className='w-full h-full'
          style={{
            background: themeColors?.[1]
              ? `var(--theme-accent)`
              : "var(--accent)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Floating SVG Shapes */}
      <div className='absolute bottom-40 right-20 opacity-10 pointer-events-none hidden lg:block'>
        <svg width='100' height='100' viewBox='0 0 100 100' fill='none'>
          <circle
            cx='50'
            cy='50'
            r='40'
            stroke={themeColors?.[1] || "var(--accent)"}
            strokeWidth='8'
            fill='none'
          />
          <circle
            cx='50'
            cy='50'
            r='20'
            fill={themeColors?.[1] || "var(--accent)"}
          />
        </svg>
      </div>

      <div
        className='mx-auto relative z-10 transition-all duration-300'
        style={{
          maxWidth: getContainerMaxWidth(),
        }}
      >
        {/* Main Card */}
        <div
          className='overflow-hidden bg-card border border-border shadow-xl'
          style={{
            borderRadius: getCardBorderRadius(),
          }}
        >
          {/* Header */}
          <div
            className='border-b border-border relative overflow-hidden'
            style={{
              background: `linear-gradient(135deg,
                color-mix(in srgb, ${
                  themeColors?.[0] || "var(--primary)"
                } 8%, var(--background)) 0%,
                var(--background) 50%,
                color-mix(in srgb, ${
                  themeColors?.[1] || "var(--accent)"
                } 6%, var(--background)) 100%)`,
              padding: getSpacingValue(),
            }}
          >
            {/* Decorative Background Patterns */}
            <div className='absolute inset-0 pointer-events-none opacity-10'>
              {/* Grid Pattern */}
              <div
                className='absolute inset-0'
                style={{
                  backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />
              {/* Radial gradient overlay */}
              <div
                className='absolute inset-0'
                style={{
                  background: `radial-gradient(circle at 30% 50%, color-mix(in srgb, ${
                    themeColors?.[0] || "var(--primary)"
                  } 15%, transparent) 0%, transparent 60%)`,
                }}
              />
            </div>

            {/* Main Content */}
            <div className='relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 max-w-5xl mx-auto w-full'>
              {/* Icon */}
              <div className='relative flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-full bg-[rgba(241,245,249,0)]'>
                <Plane
                  className='w-12 h-12'
                  style={{ color: themeColors?.[0] || "var(--primary)" }}
                />
              </div>

              {/* Text Content */}
              <div className='text-center md:text-left flex-1'>
                <div
                  className='inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3'
                  style={{
                    background: `color-mix(in srgb, ${
                      themeColors?.[0] || "var(--primary)"
                    } 12%, var(--card))`,
                    border: `1px solid color-mix(in srgb, ${
                      themeColors?.[0] || "var(--primary)"
                    } 20%, var(--border))`,
                  }}
                >
                  <Sparkles
                    className='w-3.5 h-3.5'
                    style={{ color: themeColors?.[0] || "var(--primary)" }}
                  />
                  <span
                    style={{
                      color: themeColors?.[0] || "var(--primary)",
                      fontSize: "13px",
                    }}
                  >
                    Quick & Easy Process
                  </span>
                </div>
                <h2
                  className='text-foreground mb-2'
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Travel Insurance Journey
                </h2>
                <p
                  className='text-muted-foreground'
                  style={{ maxWidth: "500px" }}
                >
                  Get comprehensive coverage for your trip in just 5 simple
                  steps.
                  <span
                    style={{
                      color: themeColors?.[0] || "var(--primary)",
                      marginLeft: "4px",
                    }}
                  >
                    Travel safe, travel smart.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          {showStepper && (
            <div
              className='border-b border-border bg-background'
              style={{
                padding: getSpacingValue(),
              }}
            >
              {renderProgress()}
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className='bg-background'
              style={{
                minHeight: "400px",
                padding: getSpacingValue(),
              }}
            >
              {renderCurrentStep()}
            </div>

            {/* Navigation */}
            <div
              className='flex gap-3 border-t border-border bg-background'
              style={{
                padding: getSpacingValue(),
              }}
            >
              {currentStep > 0 && (
                <Button
                  type='button'
                  onClick={handlePrevious}
                  variant='outline'
                  style={{
                    height: getInputHeight(),
                    borderRadius: getButtonBorderRadius(),
                  }}
                >
                  <ChevronLeft className='w-5 h-5 mr-1' />
                  Back
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  type='button'
                  onClick={handleNext}
                  className='flex-1 text-white bg-primary hover:bg-primary/90'
                  style={{
                    height: getInputHeight(),
                    borderRadius: getButtonBorderRadius(),
                    backgroundColor: themeColors?.[0]
                      ? `var(--theme-primary)`
                      : undefined,
                  }}
                >
                  Continue
                  <ChevronRight className='w-5 h-5 ml-1' />
                </Button>
              ) : (
                <Button
                  type='submit'
                  className='flex-1 text-white bg-primary hover:bg-primary/90'
                  style={{
                    height: getInputHeight(),
                    borderRadius: getButtonBorderRadius(),
                    backgroundColor: themeColors?.[0]
                      ? `var(--theme-primary)`
                      : undefined,
                  }}
                >
                  Complete Purchase
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
export const TravelInsuranceFormGlass = React.memo(
  TravelInsuranceFormGlassComponent
);
