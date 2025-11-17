// FormEditorPage - Main editor interface for form building
import React, { useState, useCallback } from "react";
import { flushSync } from "react-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Slider } from "./ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Code2,
  TestTube2,
  Palette,
  Layout,
  Wand2,
  Pencil,
  List,
  AlertCircle,
  Layers,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Sliders,
  Maximize2,
  Minimize2,
  Move,
  Type,
  Circle,
  Hash,
  BarChart3,
  Navigation,
  Mic,
  MicOff,
  Image as ImageIcon,
  Upload,
  ShieldCheck,
  Globe,
  Eye,
  Download,
  Loader2,
  Plus,
} from "lucide-react";
import { FormSchema } from "../types/schema";
import { FormRenderer } from "./FormRenderer";
import { TravelInsuranceForm } from "./TravelInsuranceForm";
import { TravelInsuranceFormGlass } from "./TravelInsuranceFormGlass";
import { TravelInsuranceFormCreative } from "./TravelInsuranceFormCreative";
import { DeathClaimForm } from "./DeathClaimForm";
import { SchemaViewer } from "./SchemaViewer";
import { TestViewer } from "./TestViewer";
import { APIViewer } from "./APIViewer";
import { TestCase, MockApiEndpoint } from "../types/schema";
import { RulesValidationManager } from "./RulesValidationManager";
import { PromptPanel } from "./PromptPanel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FlowChart } from "./FlowChart";
import Simple from "../imports/Simple";
import TwoColumn from "../imports/Simple-210-107";
import Carded from "../imports/Carded";
import Sharp from "../imports/Sharp";
import Rounded from "../imports/Rounded";
import Pill from "../imports/Pill";
import Compact from "../imports/Compact";
import Comfortable from "../imports/Comfortable";
import Spacious from "../imports/Spacious";
import Top from "../imports/Top";
import Left from "../imports/Left";
import Sm from "../imports/Sm";
import Md from "../imports/Md";
import Lg from "../imports/Lg";
import Dots from "../imports/Dots";
import Numbers from "../imports/Numbers";
import Progress from "../imports/Progress-220-226";
import Breadcrumb from "../imports/Breadcrumb";
import Steppers from "../imports/Steppers";

interface FormEditorPageProps {
  requirements: string;
  schema: FormSchema;
  tests: TestCase[];
  mockApi: MockApiEndpoint[];
  onSchemaUpdate: (schema: FormSchema) => void;
  onRegenerate: (newRequirements: string) => void;
  mainView?: "preview" | "code" | "flow";
  onViewChange?: (view: "preview" | "code" | "flow") => void;
  onDeploy?: () => void;
  onDownload?: () => void;
  onDownloadScreenshots?: () => void;
}

export function FormEditorPage({
  requirements,
  schema,
  tests,
  mockApi,
  onSchemaUpdate,
  onRegenerate,
  mainView: externalMainView,
  onViewChange: externalOnViewChange,
  onDeploy: externalOnDeploy,
  onDownload: externalOnDownload,
  onDownloadScreenshots: externalOnDownloadScreenshots,
}: FormEditorPageProps) {
  const [editableRequirements, setEditableRequirements] =
    useState(requirements);
  const [originalRequirements, setOriginalRequirements] =
    useState(requirements);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingRequirements, setIsEditingRequirements] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [viewportMode, setViewportMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [selectedTemplate, setSelectedTemplate] = useState(
    schema.layout || "simple"
  );
  const [selectedTheme, setSelectedTheme] = useState("corporate");
  const [highlightRequired, setHighlightRequired] = useState(false);
  const [showFieldsList, setShowFieldsList] = useState(false);
  const [showStepsDialog, setShowStepsDialog] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [showStepper, setShowStepper] = useState(true);

  // Selected template style state (minimal, professional, creative)
  const [selectedTemplateStyle, setSelectedTemplateStyle] = useState<
    "minimal" | "professional" | "creative"
  >("minimal");

  // Panel resize state
  const [leftPanelWidth, setLeftPanelWidth] = useState(320); // Default width in pixels
  const [isResizing, setIsResizing] = useState(false);

  // View state - Preview or Code or Flow (use external state if provided)
  const [internalMainView, setInternalMainView] = useState<
    "preview" | "code" | "flow"
  >("preview");
  const mainView =
    externalMainView !== undefined ? externalMainView : internalMainView;
  const setMainView = externalOnViewChange || setInternalMainView;

  const [leftPanelTab, setLeftPanelTab] = useState<"prompt" | "manual">(
    "prompt"
  );

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);

  // Image upload state
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  // Theme JSON upload state
  const themeJsonInputRef = React.useRef<HTMLInputElement>(null);

  // Style and Font upload dialog state
  const [showStyleUploadDialog, setShowStyleUploadDialog] = useState(false);
  const [showFontUploadDialog, setShowFontUploadDialog] = useState(false);
  const [showTemplateUploadDialog, setShowTemplateUploadDialog] =
    useState(false);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const styleUploadInputRef = React.useRef<HTMLInputElement>(null);
  const fontUploadInputRef = React.useRef<HTMLInputElement>(null);
  const templateHtmlInputRef = React.useRef<HTMLInputElement>(null);

  // UI Configuration state
  const [borderRadius, setBorderRadius] = useState<
    "sharp" | "rounded" | "pill"
  >("rounded");
  const [spacing, setSpacing] = useState<
    "compact" | "comfortable" | "spacious"
  >("comfortable");
  const [stepperType, setStepperType] = useState<
    "dots" | "numbers" | "progress" | "breadcrumb"
  >("numbers");
  const [labelPosition, setLabelPosition] = useState<"top" | "left" | "inline">(
    "top"
  );
  const [inputSize, setInputSize] = useState<"sm" | "md" | "lg">("md");
  const [selectedFont, setSelectedFont] = useState<
    "inter" | "roboto" | "poppins" | "system"
  >("inter");

  // Form data state for live preview
  const [formData, setFormData] = useState<any>({});

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Template configurations - complete styling presets
  const templateConfigs = React.useMemo(
    () => ({
      minimal: {
        layout: "simple" as const,
        theme: "slate",
        borderRadius: "sharp" as const,
        spacing: "compact" as const,
        stepperType: "dots" as const,
        labelPosition: "top" as const,
        inputSize: "sm" as const,
        font: "system" as const,
        showStepper: false,
      },
      professional: {
        layout: "two-column" as const,
        theme: "primary",
        borderRadius: "rounded" as const,
        spacing: "comfortable" as const,
        stepperType: "numbers" as const,
        labelPosition: "top" as const,
        inputSize: "md" as const,
        font: "inter" as const,
        showStepper: true,
      },
      creative: {
        layout: "carded" as const,
        theme: "sunset",
        borderRadius: "pill" as const,
        spacing: "spacious" as const,
        stepperType: "progress" as const,
        labelPosition: "top" as const,
        inputSize: "lg" as const,
        font: "poppins" as const,
        showStepper: true,
      },
    }),
    []
  );

  // Apply template configuration
  const applyTemplate = useCallback(
    (templateId: "minimal" | "professional" | "creative") => {
      const config = templateConfigs[templateId];
      if (!config) return;

      // Set selected template style
      setSelectedTemplateStyle(templateId);

      // Apply all styling configurations
      setSelectedTemplate(config.layout);
      setSelectedTheme(config.theme);
      setBorderRadius(config.borderRadius);
      setSpacing(config.spacing);
      setStepperType(config.stepperType);
      setLabelPosition(config.labelPosition);
      setInputSize(config.inputSize);
      setSelectedFont(config.font);
      setShowStepper(config.showStepper);

      // Reset wizard step when applying template
      setWizardStep(0);

      // Show success message
      const templateNames = {
        minimal: "Minimal",
        professional: "Professional",
        creative: "Creative",
      };
      toast.success(`${templateNames[templateId]} template applied!`);
    },
    [templateConfigs]
  );

  // Define templates and themes outside component or memoize them
  const templates = React.useMemo(
    () => [
      {
        id: "simple",
        name: "Simple",
        preview: "▭",
        description: "Single column layout",
      },
      {
        id: "two-column",
        name: "Two Column",
        preview: "▯▯",
        description: "Side-by-side fields",
      },
      {
        id: "carded",
        name: "Carded",
        preview: "▢▢",
        description: "Each field in a card",
      },
    ],
    []
  );

  const themes = React.useMemo(
    () => [
      { id: "corporate", name: "Corporate", colors: ["#1e40af", "#3b82f6"] },
      { id: "ocean", name: "Ocean", colors: ["#0e7490", "#06b6d4"] },
      { id: "forest", name: "Forest", colors: ["#047857", "#10b981"] },
      { id: "sunset", name: "Sunset", colors: ["#dc2626", "#f59e0b"] },
      { id: "primary", name: "Primary", colors: ["#001C56", "#00BBFF"] },
      { id: "slate", name: "Slate", colors: ["#475569", "#64748b"] },
    ],
    []
  );

  // Memoize the selected theme colors to prevent unnecessary re-renders
  const selectedThemeColors = React.useMemo(
    () => themes.find((t) => t.id === selectedTheme)?.colors,
    [themes, selectedTheme]
  );

  // Memoize the callback to prevent re-renders
  const handleFormDataChange = useCallback((data: any) => {
    setFormData(data);
  }, []);

  // Handle panel resizing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 240 && newWidth <= 600) {
        // Min 240px, Max 600px
        setLeftPanelWidth(newWidth);
      }
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add event listeners for resizing
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const loadingMessages = [
    "Analyzing your requirements...",
    "Generating form schema...",
    "Creating UI components...",
    "Setting up data bindings...",
    "Building validation rules...",
    "Generating Digital APIs...",
    "Writing unit tests...",
    "Optimizing performance...",
    "Almost ready...",
  ];

  // Track changes in requirements
  React.useEffect(() => {
    setHasChanges(editableRequirements.trim() !== originalRequirements.trim());
  }, [editableRequirements, originalRequirements]);

  // Cycle through loading messages
  React.useEffect(() => {
    if (isProcessing) {
      setLoadingMessageIndex(0);
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  // Update schema when template changes
  React.useEffect(() => {
    if (schema && schema.layout !== selectedTemplate) {
      const templateName =
        templates.find((t) => t.id === selectedTemplate)?.name ||
        selectedTemplate;
      onSchemaUpdate({
        ...schema,
        layout: selectedTemplate as "simple" | "two-column" | "carded",
      });
      toast.success(`Template changed to ${templateName}`);
    }
  }, [selectedTemplate]);

  // Show toast when theme changes
  React.useEffect(() => {
    const themeName = themes.find((t) => t.id === selectedTheme)?.name;
    if (themeName && selectedTheme !== "corporate") {
      toast.success(`Theme changed to ${themeName}`);
    }
  }, [selectedTheme]);

  // Reset wizard step when template changes
  React.useEffect(() => {
    setWizardStep(0);
    setHighlightRequired(false);
  }, [selectedTemplate]);

  // Handle screenshot capture
  React.useEffect(() => {
    const handleScreenshotCapture = async () => {
      // Import dynamically to avoid initial load
      const JSZip = (await import("jszip")).default;
      const { captureElementScreenshot } = await import(
        "../utils/screenshot-utils"
      );

      try {
        toast.info("Capturing screenshots...");

        const zip = new JSZip();

        // Get all wizard steps
        const steps = [
          ...new Set(schema.fields.map((f) => f.wizardStep ?? 0)),
        ].sort();

        if (steps.length === 0) {
          toast.error("No form steps found");
          return;
        }

        // Find the preview container
        const previewContainer = document.querySelector(
          "[data-form-preview]"
        ) as HTMLElement;

        if (!previewContainer) {
          toast.error("Form preview not found");
          return;
        }

        // Save current step
        const originalStep = wizardStep;

        // Capture each step
        for (let i = 0; i < steps.length; i++) {
          const stepNum = steps[i];

          console.log(
            `[Screenshot] Navigating to step ${stepNum + 1} of ${steps.length}`
          );

          // Navigate to step using flushSync to force synchronous render
          flushSync(() => {
            setWizardStep(stepNum);
          });

          console.log(
            `[Screenshot] Step changed to ${stepNum}, waiting for render...`
          );

          // Wait a bit for animations and transitions to complete
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Force a reflow to ensure DOM has updated
          previewContainer.getBoundingClientRect();

          // Log which step we're capturing
          console.log(
            `[Screenshot] Capturing step ${stepNum + 1} of ${steps.length}`
          );

          // Capture screenshot using the aggressive DOM modification approach
          const backgroundColor = document.documentElement.classList.contains(
            "dark"
          )
            ? "#0a0a0a"
            : "#ffffff";
          const blob = await captureElementScreenshot(
            previewContainer,
            backgroundColor
          );

          console.log(`[Screenshot] Step ${stepNum + 1} captured successfully`);

          zip.file(`step_${stepNum + 1}.png`, blob);
        }

        // Restore original step
        flushSync(() => {
          setWizardStep(originalStep);
        });

        // Generate ZIP file
        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${schema.title.replace(/\s+/g, "_")}_screenshots.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("Screenshots downloaded successfully!");
      } catch (error) {
        console.error("Error downloading screenshots:", error);
        toast.error("Failed to download screenshots");
      }
    };

    // Store the handler globally so it can be called from App.tsx
    (window as any).__captureFormScreenshots = handleScreenshotCapture;

    return () => {
      delete (window as any).__captureFormScreenshots;
    };
  }, [schema, wizardStep]);

  const handleRegenerate = () => {
    if (hasChanges) {
      setIsProcessing(true);
      setIsEditingRequirements(false);

      // Simulate processing with loading animation
      setTimeout(() => {
        onRegenerate(editableRequirements.trim());
        setOriginalRequirements(editableRequirements.trim());
        setHasChanges(false);
        setIsProcessing(false);
      }, 7000);
    }
  };

  const handleMicrophoneToggle = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("Listening...");
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");

      setEditableRequirements((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast.error(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleThemeJsonUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const themeData = JSON.parse(content);

        // Validate theme structure
        if (
          !themeData.id ||
          !themeData.name ||
          !themeData.colors ||
          !Array.isArray(themeData.colors)
        ) {
          toast.error(
            "Invalid theme JSON format. Required: { id, name, colors: [] }"
          );
          return;
        }

        if (themeData.colors.length < 2) {
          toast.error("Theme must have at least 2 colors");
          return;
        }

        // Check if theme already exists
        const existingThemeIndex = themes.findIndex(
          (t) => t.id === themeData.id
        );

        if (existingThemeIndex !== -1) {
          // Update existing theme
          themes[existingThemeIndex] = themeData;
          toast.success(`Theme "${themeData.name}" updated successfully`);
        } else {
          // Add new theme
          themes.push(themeData);
          toast.success(`Theme "${themeData.name}" added successfully`);
        }

        // Apply the uploaded theme
        setSelectedTheme(themeData.id);
      } catch (error) {
        toast.error("Failed to parse JSON file. Please check the format.");
        console.error("Theme JSON parse error:", error);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
    };

    reader.readAsText(file);
  };

  const handleTemplateHtmlUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const htmlContent = e.target?.result as string;

        // Basic validation - check if it's HTML
        if (
          !htmlContent.toLowerCase().includes("<html") &&
          !htmlContent.toLowerCase().includes("<body") &&
          !htmlContent.toLowerCase().includes("<form")
        ) {
          toast.error(
            "Invalid HTML file. Please upload a valid HTML template."
          );
          return;
        }

        // Show success message
        toast.success(
          "HTML template uploaded successfully! Template will be processed."
        );

        // Close the dialog
        setShowTemplateUploadDialog(false);

        // TODO: Process and apply the HTML template
        // This would involve parsing the HTML and converting it to your form schema
        console.log("Uploaded HTML template:", htmlContent);
      } catch (error) {
        toast.error("Failed to read HTML file. Please check the format.");
        console.error("HTML upload error:", error);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
    };

    reader.readAsText(file);
  };

  const handlePromptSubmit = (prompt: string, attachments?: File[]) => {
    // Simulate form regeneration based on prompt
    toast.success("Processing your prompt...");
    setTimeout(() => {
      onRegenerate(prompt);
      toast.success("Form updated successfully!");
    }, 2000);
  };

  const handleDeploy = () => {
    if (externalOnDeploy) {
      externalOnDeploy();
    } else {
      setShowDeployDialog(true);
    }
  };

  const handleDownload = () => {
    if (externalOnDownload) {
      externalOnDownload();
    } else {
      toast.success("Preparing download...");
      setTimeout(() => {
        toast.success("Codebase downloaded as RAR file!");
      }, 1500);
    }
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    toast.success(`Image uploaded: ${file.name}`);
    // Simulate image analysis
    setTimeout(() => {
      setEditableRequirements(
        (prev) =>
          prev +
          `\n\nImage analysis from ${file.name}: Detected additional form requirements.`
      );
    }, 1000);
  };

  const handleFieldsClick = () => {
    setShowFieldsList(true);
    toast.info(`Showing ${schema.fields.length} fields`);
  };

  const handleRequiredClick = () => {
    setHighlightRequired(!highlightRequired);
    const requiredCount = schema.fields.filter((f) =>
      f.validations?.some((v) => v.type === "required")
    ).length;
    if (!highlightRequired) {
      toast.info(`Highlighting ${requiredCount} required fields`);
    } else {
      toast.info("Required fields highlighting disabled");
    }
  };

  const handleStepsClick = () => {
    if (showStepper) {
      setShowStepsDialog(true);
      toast.info("Step navigation opened");
    } else {
      toast.info(
        'Enable "Show Stepper" in UI Customization to use multi-step navigation'
      );
    }
  };

  const handleWizardStepChange = (step: number) => {
    setWizardStep(step);
    setShowStepsDialog(false);
    toast.success(`Navigated to Step ${step + 1}`);
  };

  const getViewportWidth = () => {
    switch (viewportMode) {
      case "mobile":
        return "max-w-sm";
      case "tablet":
        return "max-w-2xl";
      default:
        return "max-w-full";
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      toast.success("Entered fullscreen mode");
    } else {
      toast.success("Exited fullscreen mode");
    }
  };

  return (
    <div
      className='h-full flex relative bg-background overflow-hidden'
      style={{
        cursor: isResizing ? "col-resize" : "default",
        userSelect: isResizing ? "none" : "auto",
      }}
    >
      {/* Enhanced Background Pattern */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none' />
      <div
        className='absolute inset-0 pointer-events-none opacity-20'
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(var(--color-border)) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative Gradient Orbs */}
      <div className='absolute top-0 right-1/3 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tr from-purple/10 to-accent/10 rounded-full blur-3xl pointer-events-none' />

      {/* Left Panel - Prompt / Manual Tabs */}
      {!isFullscreen && (
        <div
          className='relative border-r border-border bg-background flex flex-col overflow-hidden z-10'
          style={{
            width: `${leftPanelWidth}px`,
            minWidth: "240px",
            maxWidth: "600px",
          }}
        >
          {/* Tab Navigation */}
          <div className='border-b border-border bg-background'>
            <div className='flex'>
              <button
                onClick={() => setLeftPanelTab("prompt")}
                className={`flex-1 h-10 flex items-center justify-center gap-1.5 transition-all ${
                  leftPanelTab === "prompt"
                    ? "border-b-2 border-foreground bg-secondary/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                }`}
                style={{
                  fontSize: "11px",
                  fontWeight: leftPanelTab === "prompt" ? "500" : "400",
                }}
              >
                <Wand2 className='h-3.5 w-3.5' strokeWidth={1.5} />
                AI Prompt
              </button>
              <button
                onClick={() => setLeftPanelTab("manual")}
                className={`flex-1 h-10 flex items-center justify-center gap-1.5 transition-all ${
                  leftPanelTab === "manual"
                    ? "border-b-2 border-foreground bg-secondary/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                }`}
                style={{
                  fontSize: "11px",
                  fontWeight: leftPanelTab === "manual" ? "500" : "400",
                }}
              >
                <Sliders className='h-3.5 w-3.5' strokeWidth={1.5} />
                Design
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className='flex-1 overflow-hidden flex flex-col min-h-0'>
            {leftPanelTab === "prompt" ? (
              <PromptPanel
                initialPrompt={requirements}
                onPromptSubmit={handlePromptSubmit}
              />
            ) : (
              <ScrollArea className='h-full'>
                <div className='p-3 space-y-4 pb-6'>
                  {/* Requirements section removed */}

                  {/* Template Selection */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-1.5'>
                        <Wand2
                          className='h-3.5 w-3.5 text-muted-foreground'
                          strokeWidth={1.5}
                        />
                        <h4
                          className='text-foreground'
                          style={{ fontSize: "12px", fontWeight: "500" }}
                        >
                          Template
                        </h4>
                      </div>
                      <button
                        onClick={() => setShowTemplateUploadDialog(true)}
                        className='h-5 w-5 rounded-[var(--radius)] border border-border hover:border-foreground/30 bg-background transition-colors flex items-center justify-center'
                        title='Upload HTML template'
                      >
                        <Plus
                          className='h-3 w-3 text-muted-foreground'
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                    <p
                      className='text-muted-foreground'
                      style={{ fontSize: "10px", lineHeight: "1.4" }}
                    >
                      Choose a pre-designed template to automatically style your
                      form
                    </p>
                    <div className='grid grid-cols-2 gap-1.5'>
                      {[
                        {
                          id: "minimal",
                          name: "Minimal",
                          label: "Clean & Simple",
                          image:
                            "https://images.unsplash.com/photo-1751307259858-8af1ecae4347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY2xlYW4lMjBmb3JtfGVufDF8fHx8MTc2MzE3MzkyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                        },
                        {
                          id: "professional",
                          name: "Professional",
                          label: "Soft Gradient",
                          image:
                            "https://images.unsplash.com/photo-1761623135057-e41b632694f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwZ3JhZGllbnQlMjBwYXN0ZWx8ZW58MXx8fHwxNzYzMTc0NTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                        },
                        {
                          id: "creative",
                          name: "Creative",
                          label: "Vibrant Gradient",
                          image:
                            "https://images.unsplash.com/photo-1759266292888-e8709d1ce717?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWJyYW50JTIwZ3JhZGllbnQlMjBkZXNpZ258ZW58MXx8fHwxNjMxNzM5MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                        },
                      ].map((template) => (
                        <button
                          key={template.id}
                          onClick={() =>
                            applyTemplate(
                              template.id as
                                | "minimal"
                                | "professional"
                                | "creative"
                            )
                          }
                          className={`p-2 rounded-[var(--radius)] transition-colors flex items-center gap-2 border ${
                            selectedTemplateStyle === template.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-foreground/30 bg-background"
                          }`}
                        >
                          <div className='h-10 w-10 rounded-[var(--radius)] overflow-hidden flex-shrink-0 border border-border'>
                            <ImageWithFallback
                              src={template.image}
                              alt={`${template.name} template`}
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <div className='flex-1 text-left min-w-0'>
                            <p
                              className='text-foreground truncate'
                              style={{ fontSize: "11px", fontWeight: "500" }}
                            >
                              {template.name}
                            </p>
                            <p
                              className='text-muted-foreground truncate'
                              style={{ fontSize: "9px" }}
                            >
                              {template.label}
                            </p>
                          </div>
                          {selectedTemplateStyle === template.id && (
                            <CheckCircle2 className='h-3.5 w-3.5 text-primary flex-shrink-0' />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className='bg-border' />

                  {/* Layout Selection */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-1.5'>
                      <Layout
                        className='h-3.5 w-3.5 text-muted-foreground'
                        strokeWidth={1.5}
                      />
                      <h4
                        className='text-foreground'
                        style={{ fontSize: "12px", fontWeight: "500" }}
                      >
                        Layout
                      </h4>
                    </div>
                    <p
                      className='text-muted-foreground'
                      style={{ fontSize: "10px", lineHeight: "1.4" }}
                    >
                      {
                        templates.find((t) => t.id === selectedTemplate)
                          ?.description
                      }
                    </p>
                    <div className='grid grid-cols-2 gap-1.5'>
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-2 rounded-[var(--radius)] transition-colors min-h-[48px] flex flex-col items-center justify-center ${
                            selectedTemplate === template.id
                              ? "bg-background border-2 border-foreground"
                              : "border border-border hover:border-foreground/30 bg-background"
                          }`}
                        >
                          <div
                            className={`h-[32px] w-[32px] flex items-center justify-center mb-1 ${
                              selectedTemplate === template.id
                                ? "opacity-100"
                                : "opacity-60"
                            }`}
                          >
                            {template.id === "simple" && <Simple />}
                            {template.id === "two-column" && <TwoColumn />}
                            {template.id === "carded" && <Carded />}
                          </div>
                          <p
                            className='text-foreground'
                            style={{ fontSize: "12px", fontWeight: "400" }}
                          >
                            {template.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className='bg-border' />

                  {/* Theme Selection */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-1.5'>
                        <Palette
                          className='h-3.5 w-3.5 text-muted-foreground'
                          strokeWidth={1.5}
                        />
                        <h4
                          className='text-foreground'
                          style={{ fontSize: "12px", fontWeight: "500" }}
                        >
                          Color
                        </h4>
                      </div>
                      <button
                        onClick={() => setShowStyleUploadDialog(true)}
                        className='h-5 w-5 rounded-[var(--radius)] border border-border hover:border-foreground/30 bg-background transition-colors flex items-center justify-center'
                        title='Upload custom style'
                      >
                        <Plus
                          className='h-3 w-3 text-muted-foreground'
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                    <div className='grid grid-cols-2 gap-1.5'>
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`p-2 rounded-[var(--radius)] transition-colors min-h-[48px] flex flex-col items-center justify-center gap-1 ${
                            selectedTheme === theme.id
                              ? "bg-background border-2 border-foreground"
                              : "border border-border hover:border-foreground/30 bg-background"
                          }`}
                        >
                          <div className='flex gap-0.5 justify-center'>
                            {theme.colors.map((color, index) => (
                              <div
                                key={index}
                                className='h-6 w-6 rounded-[2px]'
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <p
                            className='text-foreground'
                            style={{ fontSize: "12px", fontWeight: "400" }}
                          >
                            {theme.name}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* Upload Theme JSON */}
                    <input
                      ref={themeJsonInputRef}
                      type='file'
                      className='hidden'
                      accept='.json,application/json'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleThemeJsonUpload(file);
                      }}
                    />
                  </div>

                  <Separator className='bg-border' />

                  {/* Font Selection */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-1.5'>
                        <Type
                          className='h-3.5 w-3.5 text-muted-foreground'
                          strokeWidth={1.5}
                        />
                        <h4
                          className='text-foreground'
                          style={{ fontSize: "12px", fontWeight: "500" }}
                        >
                          Typography
                        </h4>
                      </div>
                      <button
                        onClick={() => setShowFontUploadDialog(true)}
                        className='h-5 w-5 rounded-[var(--radius)] border border-border hover:border-foreground/30 bg-background transition-colors flex items-center justify-center'
                        title='Upload custom font'
                      >
                        <Plus
                          className='h-3 w-3 text-muted-foreground'
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className='w-full p-2 rounded-[var(--radius)] border border-border hover:border-foreground/30 bg-background transition-colors text-left flex items-center justify-between min-h-[40px]'>
                          <span
                            style={{
                              fontSize: "12px",
                              fontFamily: {
                                inter: "Inter, sans-serif",
                                roboto: "Roboto, sans-serif",
                                poppins: "Poppins, sans-serif",
                                system: "system-ui, sans-serif",
                              }[selectedFont],
                            }}
                          >
                            {
                              {
                                inter: "Inter",
                                roboto: "Roboto",
                                poppins: "Poppins",
                                system: "System",
                              }[selectedFont]
                            }
                          </span>
                          <ChevronDown
                            className='h-3.5 w-3.5 text-muted-foreground'
                            strokeWidth={1.5}
                          />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align='start'
                        className='w-[--radix-dropdown-menu-trigger-width] bg-card border-border'
                      >
                        {[
                          {
                            id: "inter" as const,
                            name: "Inter",
                            fontFamily: "Inter, sans-serif",
                          },
                          {
                            id: "roboto" as const,
                            name: "Roboto",
                            fontFamily: "Roboto, sans-serif",
                          },
                          {
                            id: "poppins" as const,
                            name: "Poppins",
                            fontFamily: "Poppins, sans-serif",
                          },
                          {
                            id: "system" as const,
                            name: "System",
                            fontFamily: "system-ui, sans-serif",
                          },
                        ].map((font) => (
                          <DropdownMenuItem
                            key={font.id}
                            onClick={() => {
                              setSelectedFont(font.id);
                              toast.success(`Font: ${font.name}`);
                            }}
                            className='cursor-pointer hover:bg-muted'
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                fontFamily: font.fontFamily,
                              }}
                            >
                              {font.name}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Separator className='bg-border' />

                  {/* UI Customization - Always Visible */}
                  <div className='space-y-3'>
                    <div className='flex items-center gap-1.5'>
                      <Sliders
                        className='h-3.5 w-3.5 text-muted-foreground'
                        strokeWidth={1.5}
                      />
                      <h4
                        className='text-foreground'
                        style={{ fontSize: "11px", fontWeight: "500" }}
                      >
                        Properties
                      </h4>
                    </div>

                    {/* Show Stepper Toggle - FIRST OPTION */}
                    <div className='space-y-1.5'>
                      <label
                        className='text-foreground'
                        style={{ fontSize: "12px" }}
                      >
                        Stepper
                      </label>
                      <div className='grid grid-cols-2 gap-1'>
                        {(["off", "on"] as const).map((mode) => {
                          const isSelected =
                            (mode === "on" && showStepper) ||
                            (mode === "off" && !showStepper);
                          return (
                            <button
                              key={mode}
                              onClick={() => {
                                const newValue = mode === "on";
                                setShowStepper(newValue);
                                if (newValue) {
                                  setWizardStep(0);
                                }
                                toast.success(
                                  mode === "on"
                                    ? "Stepper enabled"
                                    : "Stepper disabled"
                                );
                              }}
                              className={`p-2 rounded-[var(--radius)] transition-colors text-center min-h-[48px] flex items-center justify-center ${
                                isSelected
                                  ? "bg-background border-2 border-foreground"
                                  : "border border-border hover:border-foreground/30 bg-background"
                              }`}
                            >
                              <p
                                className='text-foreground'
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "400",
                                  textTransform: "uppercase",
                                }}
                              >
                                {mode}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stepper Type - Only show when stepper is enabled */}
                    {showStepper && (
                      <div className='space-y-1.5'>
                        <label
                          className='text-foreground'
                          style={{ fontSize: "12px" }}
                        >
                          Style
                        </label>
                        <div className='grid grid-cols-2 gap-1'>
                          {(
                            [
                              "dots",
                              "numbers",
                              "progress",
                              "breadcrumb",
                            ] as const
                          ).map((type) => {
                            const isSelected = stepperType === type;
                            return (
                              <button
                                key={type}
                                onClick={() => {
                                  setStepperType(type);
                                  toast.success(`Stepper: ${type}`);
                                }}
                                className={`p-2 rounded-[var(--radius)] transition-colors text-center min-h-[48px] flex flex-col items-center justify-center ${
                                  isSelected
                                    ? "bg-background border-2 border-foreground"
                                    : "border border-border hover:border-foreground/30 bg-background"
                                }`}
                              >
                                <div
                                  className={`h-[32px] w-full mx-auto mb-1 flex items-center justify-center ${
                                    isSelected ? "opacity-100" : "opacity-60"
                                  }`}
                                >
                                  {type === "dots" && <Dots />}
                                  {type === "numbers" && <Numbers />}
                                  {type === "progress" && <Progress />}
                                  {type === "breadcrumb" && <Breadcrumb />}
                                </div>
                                <p
                                  className='text-foreground'
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {type}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Border Radius */}
                    <div className='space-y-1.5'>
                      <label
                        className='text-foreground'
                        style={{ fontSize: "12px" }}
                      >
                        Radius
                      </label>
                      <div className='grid grid-cols-2 gap-1'>
                        {(["sharp", "rounded", "pill"] as const).map((type) => {
                          const isSelected = borderRadius === type;
                          return (
                            <button
                              key={type}
                              onClick={() => {
                                setBorderRadius(type);
                                toast.success(`Border radius: ${type}`);
                              }}
                              className={`p-2 rounded-[var(--radius)] transition-colors text-center min-h-[48px] flex flex-col items-center justify-center ${
                                isSelected
                                  ? "bg-background border-2 border-foreground"
                                  : "border border-border hover:border-foreground/30 bg-background"
                              }`}
                            >
                              <div
                                className={`h-[32px] w-full mx-auto mb-1 flex items-center justify-center ${
                                  isSelected ? "opacity-100" : "opacity-60"
                                }`}
                              >
                                {type === "sharp" && <Sharp />}
                                {type === "rounded" && <Rounded />}
                                {type === "pill" && <Pill />}
                              </div>
                              <p
                                className='text-foreground'
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "400",
                                  textTransform: "capitalize",
                                }}
                              >
                                {type}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Spacing Density */}
                    <div className='space-y-1.5'>
                      <label
                        className='text-foreground'
                        style={{ fontSize: "12px" }}
                      >
                        Spacing
                      </label>
                      <div className='grid grid-cols-2 gap-1'>
                        {(["compact", "comfortable", "spacious"] as const).map(
                          (type) => {
                            const isSelected = spacing === type;
                            return (
                              <button
                                key={type}
                                onClick={() => {
                                  setSpacing(type);
                                  toast.success(`Spacing: ${type}`);
                                }}
                                className={`p-2 rounded-[var(--radius)] transition-colors text-center min-h-[48px] flex flex-col items-center justify-center ${
                                  isSelected
                                    ? "bg-background border-2 border-foreground"
                                    : "border border-border hover:border-foreground/30 bg-background"
                                }`}
                              >
                                <div
                                  className={`h-[32px] w-full mx-auto mb-1 flex items-center justify-center ${
                                    isSelected ? "opacity-100" : "opacity-60"
                                  }`}
                                >
                                  {type === "compact" && <Compact />}
                                  {type === "comfortable" && <Comfortable />}
                                  {type === "spacious" && <Spacious />}
                                </div>
                                <p
                                  className='text-foreground'
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {type}
                                </p>
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Label Position */}
                    <div className='space-y-1.5'>
                      <label
                        className='text-foreground'
                        style={{ fontSize: "12px" }}
                      >
                        Label
                      </label>
                      <div className='grid grid-cols-2 gap-1'>
                        {(["top", "left"] as const).map((type) => {
                          const isSelected = labelPosition === type;
                          return (
                            <button
                              key={type}
                              onClick={() => {
                                setLabelPosition(type);
                                toast.success(`Label position: ${type}`);
                              }}
                              className={`p-2 rounded-[var(--radius)] transition-colors text-center min-h-[48px] flex flex-col items-center justify-center ${
                                isSelected
                                  ? "bg-background border-2 border-foreground"
                                  : "border border-border hover:border-foreground/30 bg-background"
                              }`}
                            >
                              <div
                                className={`h-[32px] w-full mx-auto mb-1 flex items-center justify-center ${
                                  isSelected ? "opacity-100" : "opacity-60"
                                }`}
                              >
                                {type === "top" && <Top />}
                                {type === "left" && <Left />}
                              </div>
                              <p
                                className='text-foreground'
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "400",
                                  textTransform: "capitalize",
                                }}
                              >
                                {type}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Input Size */}
                    <div className='space-y-1.5'>
                      <label
                        className='text-foreground'
                        style={{ fontSize: "12px" }}
                      >
                        Input Size
                      </label>
                      <div className='grid grid-cols-2 gap-1'>
                        {(["sm", "md", "lg"] as const).map((size) => {
                          const isSelected = inputSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => {
                                setInputSize(size);
                                toast.success(
                                  `Input size: ${
                                    size === "sm"
                                      ? "Small"
                                      : size === "md"
                                      ? "Medium"
                                      : "Large"
                                  }`
                                );
                              }}
                              className={`p-2 rounded-[var(--radius)] transition-all text-center min-h-[48px] flex flex-col items-center justify-center ${
                                isSelected
                                  ? "bg-background border-2 border-foreground"
                                  : "border border-border hover:border-foreground/30 bg-background"
                              }`}
                            >
                              <p
                                className='text-foreground uppercase'
                                style={{ fontSize: "12px" }}
                              >
                                {size}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={handleMouseDown}
            className='absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-30 group'
            style={{
              backgroundColor: isResizing
                ? "rgb(var(--color-primary))"
                : "transparent",
            }}
          >
            <div
              className='absolute top-1/2 -translate-y-1/2 right-0 w-1 h-12 bg-border group-hover:bg-primary/50 rounded-full transition-colors'
              style={{
                backgroundColor: isResizing
                  ? "rgb(var(--color-primary))"
                  : undefined,
              }}
            />
          </div>
        </div>
      )}

      {/* Center Panel - Canvas (only in preview mode) */}
      {mainView === "preview" && (
        <div
          className={`flex-1 flex flex-col bg-transparent overflow-hidden relative ${
            isFullscreen ? "fixed inset-0 z-[9999] bg-background" : "z-10"
          }`}
        >
          {/* Canvas Toolbar */}
          <div className='h-12 border-b-2 border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0 shadow-[var(--elevation-sm)]'>
            <div className='flex items-center gap-2.5'>
              <div className='h-6 w-6 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center shadow-[var(--elevation-sm)]'>
                <Monitor className='h-3.5 w-3.5 text-primary' />
              </div>
              <h3 className='text-foreground'>Canvas</h3>
            </div>
            <div className='flex items-center gap-2'>
              {/* Play/Exit Fullscreen Button */}
              <button
                onClick={handleFullscreenToggle}
                className='transition-all group'
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className='h-4 w-4 text-foreground hover:text-primary transition-colors' />
                ) : (
                  <Maximize2 className='h-4 w-4 text-foreground hover:text-primary transition-colors' />
                )}
              </button>

              <div className='flex items-center gap-0.5 bg-secondary p-0.5 rounded-[var(--radius)]'>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => setViewportMode("desktop")}
                  className={`h-6 px-2 rounded-[var(--radius)] transition-all ${
                    viewportMode === "desktop"
                      ? "bg-background shadow-[var(--elevation-sm)]"
                      : "hover:bg-background/50"
                  }`}
                  aria-label='Desktop view'
                  aria-pressed={viewportMode === "desktop"}
                >
                  <Monitor
                    className='h-3.5 w-3.5'
                    strokeWidth={1.5}
                    aria-hidden='true'
                  />
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => setViewportMode("tablet")}
                  className={`h-6 px-2 rounded-[var(--radius)] transition-all ${
                    viewportMode === "tablet"
                      ? "bg-background shadow-[var(--elevation-sm)]"
                      : "hover:bg-background/50"
                  }`}
                  aria-label='Tablet view'
                  aria-pressed={viewportMode === "tablet"}
                >
                  <Tablet
                    className='h-3.5 w-3.5'
                    strokeWidth={1.5}
                    aria-hidden='true'
                  />
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => setViewportMode("mobile")}
                  className={`h-6 px-2 rounded-[var(--radius)] transition-all ${
                    viewportMode === "mobile"
                      ? "bg-background shadow-[var(--elevation-sm)]"
                      : "hover:bg-background/50"
                  }`}
                  aria-label='Mobile view'
                  aria-pressed={viewportMode === "mobile"}
                >
                  <Smartphone
                    className='h-3.5 w-3.5'
                    strokeWidth={1.5}
                    aria-hidden='true'
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className='flex-1 overflow-y-auto'>
            <ScrollArea className='h-full'>
              <div className='p-8 pb-0' data-form-preview>
                <div
                  key={`${selectedTemplate}-${selectedTheme}-${selectedTemplateStyle}`}
                  className={`mx-auto transition-all animate-in fade-in-50 duration-300 ${getViewportWidth()}`}
                >
                  {/* Use TravelInsuranceFormGlass for travel insurance, DeathClaimForm for death claim, otherwise use FormRenderer */}
                  {schema.title.toLowerCase().includes("travel insurance") ? (
                    selectedTemplateStyle === "creative" ? (
                      <TravelInsuranceFormCreative
                        showStepper={showStepper}
                        stepperType={stepperType}
                        borderRadius={borderRadius}
                        spacing={spacing}
                        labelPosition={labelPosition}
                        inputSize={inputSize}
                        template={
                          selectedTemplate as "simple" | "two-column" | "carded"
                        }
                        themeColors={selectedThemeColors}
                        templateStyle={selectedTemplateStyle}
                        onFormDataChange={handleFormDataChange}
                        wizardStep={wizardStep}
                        onWizardStepChange={setWizardStep}
                      />
                    ) : (
                      <TravelInsuranceFormGlass
                        showStepper={showStepper}
                        stepperType={stepperType}
                        borderRadius={borderRadius}
                        spacing={spacing}
                        labelPosition={labelPosition}
                        inputSize={inputSize}
                        template={
                          selectedTemplate as "simple" | "two-column" | "carded"
                        }
                        themeColors={selectedThemeColors}
                        templateStyle={selectedTemplateStyle}
                        onFormDataChange={handleFormDataChange}
                        wizardStep={wizardStep}
                        onWizardStepChange={setWizardStep}
                      />
                    )
                  ) : schema.title.toLowerCase().includes("death claim") ? (
                    <DeathClaimForm
                      showStepper={showStepper}
                      stepperType={stepperType}
                      borderRadius={borderRadius}
                      spacing={spacing}
                      labelPosition={labelPosition}
                      inputSize={inputSize}
                      template={
                        selectedTemplate as "simple" | "two-column" | "carded"
                      }
                      themeColors={selectedThemeColors}
                      onFormDataChange={handleFormDataChange}
                      wizardStep={wizardStep}
                      onWizardStepChange={setWizardStep}
                    />
                  ) : (
                    <FormRenderer
                      schema={schema}
                      onFormDataChange={handleFormDataChange}
                      template={
                        selectedTemplate as "simple" | "two-column" | "carded"
                      }
                      themeColors={selectedThemeColors}
                      highlightRequired={highlightRequired}
                      showStepper={showStepper}
                      wizardStep={wizardStep}
                      onWizardStepChange={setWizardStep}
                      borderRadius={borderRadius}
                      spacing={spacing}
                      stepperType={stepperType}
                      labelPosition={labelPosition}
                      inputSize={inputSize}
                    />
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Code Panel - Schema, APIs, Tests, Deploy (only show in code mode) */}
      {mainView === "code" && (
        <div className='flex-1 bg-card flex flex-col z-10'>
          {/* The content will go here */}
          {true && (
            <Tabs defaultValue='schema' className='h-full flex flex-row'>
              {/* Side Navigation */}
              <div className='w-48 border-r border-border bg-background flex-shrink-0'>
                <TabsList className='w-full h-full bg-transparent rounded-none p-1.5 flex flex-col gap-0.5 items-stretch justify-start'>
                  <TabsTrigger
                    value='schema'
                    className='rounded-[var(--radius)] justify-start px-2 py-1.5 data-[state=active]:bg-[var(--color-selected-bg)] data-[state=active]:text-[var(--color-selected-border)] data-[state=inactive]:text-muted-foreground hover:bg-secondary/50 transition-all !h-12 !flex-none !min-h-0'
                    style={{ height: "48px" }}
                  >
                    <Code2
                      className='h-4 w-4 mr-2 flex-shrink-0'
                      strokeWidth={1.5}
                    />
                    <span style={{ fontSize: "13px" }}>Schema</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='apis'
                    className='rounded-[var(--radius)] justify-start px-2 py-1.5 data-[state=active]:bg-[var(--color-selected-bg)] data-[state=active]:text-[var(--color-selected-border)] data-[state=inactive]:text-muted-foreground hover:bg-secondary/50 transition-all !h-12 !flex-none !min-h-0'
                    style={{ height: "48px" }}
                  >
                    <Globe
                      className='h-4 w-4 mr-2 flex-shrink-0'
                      strokeWidth={1.5}
                    />
                    <span style={{ fontSize: "13px" }}>APIs</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='rules'
                    className='rounded-[var(--radius)] justify-start px-2 py-1.5 data-[state=active]:bg-[var(--color-selected-bg)] data-[state=active]:text-[var(--color-selected-border)] data-[state=inactive]:text-muted-foreground hover:bg-secondary/50 transition-all !h-12 !flex-none !min-h-0'
                    style={{ height: "48px" }}
                  >
                    <ShieldCheck
                      className='h-4 w-4 mr-2 flex-shrink-0'
                      strokeWidth={1.5}
                    />
                    <span style={{ fontSize: "13px" }}>Rules</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='tests'
                    className='rounded-[var(--radius)] justify-start px-2 py-1.5 data-[state=active]:bg-[var(--color-selected-bg)] data-[state=active]:text-[var(--color-selected-border)] data-[state=inactive]:text-muted-foreground hover:bg-secondary/50 transition-all !h-12 !flex-none !min-h-0'
                    style={{ height: "48px" }}
                  >
                    <TestTube2
                      className='h-4 w-4 mr-2 flex-shrink-0'
                      strokeWidth={1.5}
                    />
                    <span style={{ fontSize: "13px" }}>Tests</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Content Area */}
              <div className='flex-1 overflow-hidden'>
                <TabsContent value='schema' className='h-full m-0'>
                  <ScrollArea className='h-full'>
                    <div className='p-6'>
                      <SchemaViewer schema={schema} formData={formData} />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value='apis' className='h-full m-0'>
                  <ScrollArea className='h-full'>
                    <div className='p-6'>
                      <APIViewer mockApi={mockApi} />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value='rules' className='h-full m-0'>
                  <ScrollArea className='h-full'>
                    <div className='p-6'>
                      <RulesValidationManager
                        schema={schema}
                        onSchemaUpdate={onSchemaUpdate}
                      />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value='tests' className='h-full m-0'>
                  <ScrollArea className='h-full'>
                    <div className='p-6'>
                      <TestViewer tests={tests} schema={schema} />
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      )}

      {/* Flow Panel - Flowchart visualization (only show in flow mode) */}
      {mainView === "flow" && (
        <div className='flex-1 bg-card flex flex-col z-10 overflow-hidden'>
          <FlowChart schema={schema} themeColors={selectedThemeColors} />
        </div>
      )}

      {/* Fields List Dialog */}
      <Dialog open={showFieldsList} onOpenChange={setShowFieldsList}>
        <DialogContent className='bg-card border-2 border-border rounded-[var(--radius-card)] max-w-2xl shadow-[var(--elevation-lg)]'>
          <DialogHeader>
            <DialogTitle className='text-foreground flex items-center gap-2'>
              <div className='h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center'>
                <List className='h-4 w-4 text-primary' />
              </div>
              All Fields ({schema.fields.length})
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              Complete list of form fields with their types and validations
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className='max-h-[60vh]'>
            <div className='space-y-3 pr-4'>
              {schema.fields.map((field, index) => {
                const isRequired = field.validations?.some(
                  (v) => v.type === "required"
                );
                return (
                  <div
                    key={field.id}
                    className='p-4 bg-background rounded-[var(--radius-card)] border-2 border-border hover:border-primary/50 transition-all shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)]'
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <span className='text-foreground'>
                          {index + 1}. {field.label}
                        </span>
                        {isRequired && (
                          <Badge className='bg-destructive text-destructive-foreground rounded-[var(--radius-pill)]'>
                            Required
                          </Badge>
                        )}
                      </div>
                      <Badge className='bg-primary/10 text-primary rounded-[var(--radius-pill)]'>
                        {field.type}
                      </Badge>
                    </div>
                    <p className='text-muted-foreground text-sm'>
                      Field name:{" "}
                      <code className='bg-muted px-1 rounded'>
                        {field.name}
                      </code>
                    </p>
                    {field.description && (
                      <p className='text-muted-foreground text-sm mt-1'>
                        {field.description}
                      </p>
                    )}
                    {field.validations && field.validations.length > 0 && (
                      <div className='mt-2 flex flex-wrap gap-1'>
                        {field.validations.map((val, vidx) => (
                          <Badge
                            key={vidx}
                            variant='outline'
                            className='rounded-[var(--radius-pill)] text-xs'
                          >
                            {val.type}
                            {val.value ? `: ${val.value}` : ""}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Steps Navigation Dialog */}
      <Dialog open={showStepsDialog} onOpenChange={setShowStepsDialog}>
        <DialogContent className='bg-card border-2 border-border rounded-[var(--radius-card)] shadow-[var(--elevation-lg)]'>
          <DialogHeader>
            <DialogTitle className='text-foreground flex items-center gap-2'>
              <div className='h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center'>
                <Navigation className='h-4 w-4 text-primary' />
              </div>
              Wizard Steps Navigation
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              Jump to any step in your wizard form
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            {selectedTemplate === "wizard" &&
              [0, 1, 2].map((step) => {
                const fieldsPerStep = Math.ceil(schema.fields.length / 3);
                const stepFields = schema.fields.slice(
                  step * fieldsPerStep,
                  (step + 1) * fieldsPerStep
                );
                return (
                  <button
                    key={step}
                    onClick={() => handleWizardStepChange(step)}
                    className={`w-full p-4 rounded-[var(--radius-card)] border-2 transition-all duration-300 text-left hover:border-primary hover:bg-primary/10 hover:shadow-[var(--elevation-md)] ${
                      wizardStep === step
                        ? "border-primary bg-primary/10 shadow-[var(--elevation-md)]"
                        : "border-border bg-background shadow-[var(--elevation-sm)]"
                    }`}
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            wizardStep === step
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step + 1}
                        </div>
                        <span className='text-foreground'>Step {step + 1}</span>
                      </div>
                      {wizardStep === step && (
                        <CheckCircle2 className='h-5 w-5 text-primary' />
                      )}
                    </div>
                    <p className='text-muted-foreground text-sm ml-11'>
                      {stepFields.length} fields:{" "}
                      {stepFields.map((f) => f.label).join(", ")}
                    </p>
                  </button>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Style Upload Dialog */}
      <Dialog
        open={showStyleUploadDialog}
        onOpenChange={setShowStyleUploadDialog}
      >
        <DialogContent className='bg-card border-2 border-border rounded-[var(--radius-card)] max-w-md shadow-[var(--elevation-lg)]'>
          <DialogHeader>
            <DialogTitle className='text-foreground flex items-center gap-2'>
              <div className='h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center'>
                <Palette className='h-4 w-4 text-primary' />
              </div>
              Upload Custom Style
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              Upload a CSS file or design token JSON to customize the color
              scheme
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div
              onClick={() => styleUploadInputRef.current?.click()}
              className='border-2 border-dashed border-border rounded-[var(--radius)] p-8 hover:border-foreground/30 transition-colors cursor-pointer bg-background'
            >
              <div className='flex flex-col items-center gap-3'>
                <div className='h-12 w-12 rounded-[var(--radius)] bg-primary/10 flex items-center justify-center'>
                  <Upload className='h-6 w-6 text-primary' />
                </div>
                <div className='text-center'>
                  <p
                    className='text-foreground'
                    style={{ fontSize: "13px", fontWeight: "500" }}
                  >
                    Click to upload style file
                  </p>
                  <p
                    className='text-muted-foreground'
                    style={{ fontSize: "11px" }}
                  >
                    Supports .css, .json files
                  </p>
                </div>
              </div>
            </div>
            <input
              ref={styleUploadInputRef}
              type='file'
              accept='.css,.json'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  toast.success(
                    `Style file "${file.name}" uploaded successfully`
                  );
                  setShowStyleUploadDialog(false);
                }
              }}
              className='hidden'
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Font Upload Dialog */}
      <Dialog
        open={showFontUploadDialog}
        onOpenChange={setShowFontUploadDialog}
      >
        <DialogContent className='bg-card border-2 border-border rounded-[var(--radius-card)] max-w-md shadow-[var(--elevation-lg)]'>
          <DialogHeader>
            <DialogTitle className='text-foreground flex items-center gap-2'>
              <div className='h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center'>
                <Type className='h-4 w-4 text-primary' />
              </div>
              Upload Custom Font
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              Upload custom font files to add new typography options
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div
              onClick={() => fontUploadInputRef.current?.click()}
              className='border-2 border-dashed border-border rounded-[var(--radius)] p-8 hover:border-foreground/30 transition-colors cursor-pointer bg-background'
            >
              <div className='flex flex-col items-center gap-3'>
                <div className='h-12 w-12 rounded-[var(--radius)] bg-primary/10 flex items-center justify-center'>
                  <Upload className='h-6 w-6 text-primary' />
                </div>
                <div className='text-center'>
                  <p
                    className='text-foreground'
                    style={{ fontSize: "13px", fontWeight: "500" }}
                  >
                    Click to upload font file
                  </p>
                  <p
                    className='text-muted-foreground'
                    style={{ fontSize: "11px" }}
                  >
                    Supports .woff, .woff2, .ttf, .otf files
                  </p>
                </div>
              </div>
            </div>
            <input
              ref={fontUploadInputRef}
              type='file'
              accept='.woff,.woff2,.ttf,.otf'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  toast.success(
                    `Font file "${file.name}" uploaded successfully`
                  );
                  setShowFontUploadDialog(false);
                }
              }}
              className='hidden'
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Upload Dialog */}
      <Dialog
        open={showTemplateUploadDialog}
        onOpenChange={setShowTemplateUploadDialog}
      >
        <DialogContent className='bg-card border-2 border-border rounded-[var(--radius-card)] max-w-md shadow-[var(--elevation-lg)]'>
          <DialogHeader>
            <DialogTitle className='text-foreground flex items-center gap-2'>
              <div className='h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center'>
                <Wand2 className='h-4 w-4 text-primary' />
              </div>
              Upload HTML Template
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              Upload an HTML file to use as a custom form template
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div
              onClick={() => templateHtmlInputRef.current?.click()}
              className='border-2 border-dashed border-border rounded-[var(--radius)] p-8 hover:border-foreground/30 transition-colors cursor-pointer bg-background'
            >
              <div className='flex flex-col items-center gap-3'>
                <div className='h-12 w-12 rounded-[var(--radius)] bg-primary/10 flex items-center justify-center'>
                  <Upload className='h-6 w-6 text-primary' />
                </div>
                <div className='text-center'>
                  <p
                    className='text-foreground'
                    style={{ fontSize: "13px", fontWeight: "500" }}
                  >
                    Click to upload HTML template
                  </p>
                  <p
                    className='text-muted-foreground'
                    style={{ fontSize: "11px" }}
                  >
                    Supports .html, .htm files
                  </p>
                </div>
              </div>
            </div>
            <input
              ref={templateHtmlInputRef}
              type='file'
              accept='.html,.htm'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleTemplateHtmlUpload(file);
                }
              }}
              className='hidden'
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className='fixed inset-0 bg-background/95 flex items-center justify-center z-50'>
          <div className='p-8 text-center relative'>
            {/* Animated Logo Loader */}
            <div className='relative mb-6'>
              <div className='relative h-24 w-24 mx-auto'>
                {/* Glow effect */}
                <div className='absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl scale-110 animate-pulse' />

                {/* SVG Logo with animations */}
                <div className='relative h-24 w-24'>
                  <svg
                    width='96'
                    height='96'
                    viewBox='0 0 64 64'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-full h-full'
                  >
                    <defs>
                      <filter
                        id='filter0_loader_editor'
                        x='9.87988'
                        y='4.76001'
                        width='45.7266'
                        height='16.0312'
                        filterUnits='userSpaceOnUse'
                        colorInterpolationFilters='sRGB'
                      >
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feBlend
                          mode='normal'
                          in='SourceGraphic'
                          in2='BackgroundImageFix'
                          result='shape'
                        />
                        <feGaussianBlur
                          stdDeviation='0.5'
                          result='effect1_foregroundBlur'
                        />
                      </filter>
                      <filter
                        id='filter1_loader_editor'
                        x='8.46387'
                        y='43.1794'
                        width='45.7266'
                        height='16.0312'
                        filterUnits='userSpaceOnUse'
                        colorInterpolationFilters='sRGB'
                      >
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feBlend
                          mode='normal'
                          in='SourceGraphic'
                          in2='BackgroundImageFix'
                          result='shape'
                        />
                        <feGaussianBlur
                          stdDeviation='0.5'
                          result='effect1_foregroundBlur'
                        />
                      </filter>
                      <linearGradient
                        id='paint0_loader_editor'
                        x1='10.8232'
                        y1='5.72879'
                        x2='46.1092'
                        y2='-10.3627'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='white' />
                        <stop offset='1' stopColor='#00BDFF' />
                      </linearGradient>
                      <linearGradient
                        id='paint1_loader_editor'
                        x1='51.5199'
                        y1='14.4'
                        x2='15.1596'
                        y2='31.7874'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='white' />
                        <stop offset='1' stopColor='#00BDFF' />
                      </linearGradient>
                      <linearGradient
                        id='paint2_loader_editor'
                        x1='9.4072'
                        y1='44.1482'
                        x2='44.6932'
                        y2='28.0567'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='white' />
                        <stop offset='1' stopColor='#00BDFF' />
                      </linearGradient>
                      <linearGradient
                        id='paint3_loader_editor'
                        x1='9.4072'
                        y1='44.1482'
                        x2='44.6932'
                        y2='28.0567'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='white' />
                        <stop offset='1' stopColor='#00BDFF' />
                      </linearGradient>
                    </defs>

                    {/* Rotating outer circle */}
                    <g
                      style={{
                        transformOrigin: "center",
                        animation: "spin 3s linear infinite",
                      }}
                    >
                      <path
                        d='M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z'
                        fill='#001C56'
                      />

                      {/* Inner rings */}
                      <path
                        d='M31.9999 57.92C46.3359 57.92 57.9199 46.336 57.9199 32C57.9199 17.664 46.3359 6.07998 31.9999 6.07998C17.6639 6.07998 6.07993 17.664 6.07993 32C6.07992 46.336 17.6639 57.92 31.9999 57.92ZM31.9999 8.19198C45.1839 8.19198 55.8079 18.88 55.8079 32C55.8079 45.12 45.1839 55.808 31.9999 55.808C18.8159 55.808 8.19193 45.184 8.19193 32C8.19193 18.816 18.8159 8.19198 31.9999 8.19198Z'
                        fill='white'
                        fillOpacity='0.48'
                      />
                      <path
                        d='M32.0001 6.08002C17.6641 6.08002 6.08008 17.664 6.08008 32C6.08008 46.336 17.6641 57.92 32.0001 57.92C46.3361 57.92 57.9201 46.336 57.9201 32C57.9201 17.664 46.3361 6.08002 32.0001 6.08002ZM32.0001 55.808C18.8161 55.808 8.19208 45.12 8.19208 32C8.19208 18.88 18.8161 8.19202 32.0001 8.19202C45.1841 8.19202 55.8081 18.816 55.8081 32C55.8081 45.184 45.1841 55.808 32.0001 55.808Z'
                        fill='white'
                        fillOpacity='0.48'
                      />

                      {/* Top orbital arc */}
                      <g filter='url(#filter0_loader_editor)'>
                        <path
                          d='M11.0776 16.8027C21.3816 2.27466 43.1416 2.14666 54.0856 16.0347C54.9176 16.9947 54.7256 18.4667 53.7016 19.2987C52.6776 20.1307 51.0776 19.8747 50.3736 18.7867C49.4136 17.3147 48.2616 15.9067 46.9176 14.6907C40.2616 8.29066 29.5736 6.75466 21.3176 10.9787C17.9896 12.6427 15.0456 15.0747 12.7416 18.0827C11.9736 19.1067 10.3096 17.9547 11.0776 16.8027Z'
                          fill='url(#paint0_loader_editor)'
                        />
                      </g>
                      <path
                        d='M11.0776 16.8027C21.3816 2.27466 43.1416 2.14666 54.0856 16.0347C54.9176 16.9947 54.7256 18.4667 53.7016 19.2987C52.6776 20.1307 51.0776 19.8747 50.3736 18.7867C49.4136 17.3147 48.2616 15.9067 46.9176 14.6907C40.2616 8.29066 29.5736 6.75466 21.3176 10.9787C17.9896 12.6427 15.0456 15.0747 12.7416 18.0827C11.9736 19.1067 10.3096 17.9547 11.0776 16.8027Z'
                        fill='url(#paint1_loader_editor)'
                      />

                      {/* Bottom orbital arc */}
                      <g filter='url(#filter1_loader_editor)'>
                        <path
                          d='M52.9925 47.168C42.6885 61.696 20.9285 61.824 9.98454 47.936C9.15254 46.976 9.34454 45.504 10.3685 44.672C11.3925 43.84 12.9925 44.096 13.6965 45.184C14.6565 46.656 15.8085 48.064 17.1525 49.28C23.8085 55.68 34.4965 57.216 42.7525 52.992C46.0805 51.328 49.0245 48.896 51.3285 45.888C52.0965 44.928 53.7605 46.08 52.9925 47.168Z'
                          fill='url(#paint2_loader_editor)'
                        />
                      </g>
                      <path
                        d='M52.9925 47.168C42.6885 61.696 20.9285 61.824 9.98454 47.936C9.15254 46.976 9.34454 45.504 10.3685 44.672C11.3925 43.84 12.9925 44.096 13.6965 45.184C14.6565 46.656 15.8085 48.064 17.1525 49.28C23.8085 55.68 34.4965 57.216 42.7525 52.992C46.0805 51.328 49.0245 48.896 51.3285 45.888C52.0965 44.928 53.7605 46.08 52.9925 47.168Z'
                        fill='url(#paint3_loader_editor)'
                      />
                    </g>

                    {/* Center sparkle - pulsating (stays in center) */}
                    <g
                      style={{
                        transformOrigin: "center",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    >
                      <path
                        d='M21.248 32L24.192 31.168C27.52 30.208 30.144 27.584 31.104 24.256L31.936 21.312L32.768 24.256C33.728 27.584 36.352 30.208 39.68 31.168L42.624 32L39.68 32.832C36.48 33.856 33.856 36.48 32.832 39.808L32 42.752L31.168 39.808C30.144 36.48 27.52 33.856 24.192 32.832L21.248 32Z'
                        fill='white'
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className='relative space-y-3'>
              <h3 className='text-foreground'>Regenerating Journey</h3>

              {/* Scrolling status messages */}
              <div className='min-h-[60px] flex items-center justify-center'>
                <div className='relative overflow-hidden h-12 w-full max-w-md'>
                  {loadingMessages.map((message, index) => (
                    <div
                      key={index}
                      className='absolute inset-0 flex items-center justify-center transition-all duration-500'
                      style={{
                        transform: `translateY(${
                          (index - loadingMessageIndex) * 100
                        }%)`,
                        opacity: index === loadingMessageIndex ? 1 : 0,
                      }}
                    >
                      <p
                        className='text-center px-4'
                        style={{ color: "var(--loader-subtext)" }}
                      >
                        {message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress indicator */}
              <div className='space-y-2'>
                <div className='flex items-center justify-center gap-1'>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className='h-1.5 w-1.5 rounded-full bg-primary'
                      style={{
                        animation: "pulse 1.5s ease-in-out infinite",
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Progress bar */}
                <div className='w-full max-w-xs mx-auto h-1 bg-secondary rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-primary rounded-full transition-all duration-700'
                    style={{
                      width: `${Math.min(
                        ((loadingMessageIndex + 1) / loadingMessages.length) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
