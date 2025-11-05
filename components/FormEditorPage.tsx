import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
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
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Code2,
  TestTube2,
  Rocket,
  Palette,
  Layout,
  Wand2,
  Pencil,
  List,
  AlertCircle,
  Layers,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sliders,
  Maximize2,
  Move,
  Type,
  Circle,
  Hash,
  BarChart3,
  Navigation,
  Mic,
  MicOff,
  Image as ImageIcon,
} from "lucide-react";
import { FormSchema } from "../types/schema";
import { FormRenderer } from "./FormRenderer";
import { SchemaViewer } from "./SchemaViewer";
import { TestViewer } from "./TestViewer";
import { DeploymentPanel } from "./DeploymentPanel";
// import { Test } from '../utils/testGenerator';
// import { MockEndpoint } from '../utils/mockApi';

interface FormEditorPageProps {
  requirements: string;
  schema: FormSchema;
  tests: any[];
  mockApi: any[];
  onSchemaUpdate: (schema: FormSchema) => void;
  onRegenerate: (newRequirements: string) => void;
}

export function FormEditorPage({
  requirements,
  schema,
  tests,
  mockApi,
  onSchemaUpdate,
  onRegenerate,
}: FormEditorPageProps) {
  const [editableRequirements, setEditableRequirements] =
    useState(requirements);
  const [isEditingRequirements, setIsEditingRequirements] = useState(false);
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

  // Panel collapse state
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);

  // Image upload state
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  // UI Configuration state
  const [borderRadius, setBorderRadius] = useState<
    "sharp" | "rounded" | "pill"
  >("rounded");
  const [spacing, setSpacing] = useState<
    "compact" | "comfortable" | "spacious"
  >("comfortable");
  const [stepperType, setStepperType] = useState<
    "dots" | "numbers" | "progress" | "breadcrumb"
  >("progress");
  const [labelPosition, setLabelPosition] = useState<"top" | "left" | "inline">(
    "top"
  );
  const [inputSize, setInputSize] = useState<"sm" | "md" | "lg">("md");

  // Update schema when template changes
  React.useEffect(() => {
    if (schema && schema.layout !== selectedTemplate) {
      const templateName =
        templates.find((t) => t.id === selectedTemplate)?.name ||
        selectedTemplate;
      onSchemaUpdate({
        ...schema,
        layout: selectedTemplate as
          | "simple"
          | "two-column"
          | "wizard"
          | "carded",
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

  const handleRegenerate = () => {
    if (editableRequirements.trim() !== requirements) {
      onRegenerate(editableRequirements.trim());
    }
    setIsEditingRequirements(false);
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
    if (selectedTemplate === "wizard") {
      setShowStepsDialog(true);
      toast.info("Step navigation opened");
    } else {
      toast.info("Switch to Wizard template to enable multi-step navigation");
    }
  };

  const handleWizardStepChange = (step: number) => {
    setWizardStep(step);
    setShowStepsDialog(false);
    toast.success(`Navigated to Step ${step + 1}`);
  };

  const templates = [
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
      id: "wizard",
      name: "Wizard",
      preview: "①②③",
      description: "Multi-step form",
    },
    {
      id: "carded",
      name: "Carded",
      preview: "▢▢",
      description: "Each field in a card",
    },
  ];

  const themes = [
    { id: "corporate", name: "Corporate", colors: ["#1e40af", "#3b82f6"] },
    { id: "ocean", name: "Ocean", colors: ["#0e7490", "#06b6d4"] },
    { id: "forest", name: "Forest", colors: ["#047857", "#10b981"] },
    { id: "sunset", name: "Sunset", colors: ["#dc2626", "#f59e0b"] },
    { id: "primary", name: "Primary", colors: ["#001C56", "#00BBFF"] },
    { id: "slate", name: "Slate", colors: ["#475569", "#64748b"] },
  ];

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

  return (
    <div className='h-[calc(100vh-4rem)] flex relative'>
      {/* Left Panel - Form Configurator */}
      <div
        className={`border-r border-border bg-card flex flex-col transition-all duration-300 ${
          leftPanelCollapsed ? "w-0 border-r-0" : "w-80"
        } overflow-hidden`}
      >
        {!leftPanelCollapsed && (
          <ScrollArea className='flex-1'>
            <div className='p-6 space-y-6 h-[calc(100vh-4rem)] overflow-y-auto'>
              {/* Requirements Summary */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <h4 className='text-foreground'>Requirements</h4>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() =>
                      setIsEditingRequirements(!isEditingRequirements)
                    }
                    className='rounded-[var(--radius-button)] hover:bg-secondary'
                    aria-label={
                      isEditingRequirements
                        ? "Cancel editing requirements"
                        : "Edit requirements"
                    }
                  >
                    <Pencil className='h-4 w-4' aria-hidden='true' />
                  </Button>
                </div>
                {isEditingRequirements ? (
                  <div className='space-y-3'>
                    <Textarea
                      value={editableRequirements}
                      onChange={(e) => setEditableRequirements(e.target.value)}
                      className='min-h-[120px] bg-input-background border-border rounded-[var(--radius-input)]'
                    />
                    <div className='flex gap-2 flex-wrap'>
                      <input
                        ref={imageInputRef}
                        type='file'
                        className='hidden'
                        accept='image/*'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                      <Button
                        onClick={handleMicrophoneToggle}
                        size='sm'
                        variant='outline'
                        className={`border-2 rounded-[var(--radius-button)] ${
                          isListening
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        }`}
                        title={
                          isListening ? "Stop recording" : "Start voice input"
                        }
                      >
                        {isListening ? (
                          <MicOff className='h-3 w-3' />
                        ) : (
                          <Mic className='h-3 w-3' />
                        )}
                      </Button>
                      <Button
                        onClick={() => imageInputRef.current?.click()}
                        size='sm'
                        variant='outline'
                        className='border-2 border-border rounded-[var(--radius-button)]'
                        title='Upload image'
                      >
                        <ImageIcon className='h-3 w-3' />
                      </Button>
                      <Button
                        onClick={handleRegenerate}
                        size='sm'
                        className='flex-1 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90'
                      >
                        <RotateCcw className='h-3 w-3 mr-1' />
                        Regenerate
                      </Button>
                      <Button
                        onClick={() => {
                          setEditableRequirements(requirements);
                          setIsEditingRequirements(false);
                          setUploadedImage(null);
                        }}
                        size='sm'
                        variant='outline'
                        className='border-2 border-border rounded-[var(--radius-button)]'
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='p-4 bg-background rounded-[var(--radius)] border border-border'>
                    <p className='text-muted-foreground line-clamp-4 break-words'>
                      {requirements}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Template Selection */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Layout className='h-4 w-4 text-primary' />
                    <h4 className='text-foreground'>Template</h4>
                  </div>
                </div>
                <p className='text-muted-foreground text-xs'>
                  {
                    templates.find((t) => t.id === selectedTemplate)
                      ?.description
                  }
                </p>
                <div className='grid grid-cols-2 gap-2'>
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template?.id as any)}
                      className={`p-3 rounded-[var(--radius)] border-2 transition-all text-center hover:scale-105 ${
                        selectedTemplate === template.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 bg-card"
                      }`}
                    >
                      <div
                        className={`text-2xl mb-1 transition-colors ${
                          selectedTemplate === template.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {template.preview}
                      </div>
                      <p className='text-foreground text-sm'>{template.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Theme Selection */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Palette className='h-4 w-4 text-primary' />
                    <h4 className='text-foreground'>Theme</h4>
                  </div>
                </div>
                <p className='text-muted-foreground text-xs'>
                  Apply custom color schemes to your form
                </p>
                <div className='grid grid-cols-2 gap-2'>
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-3 rounded-[var(--radius)] border-2 transition-all hover:scale-105 ${
                        selectedTheme === theme.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 bg-card"
                      }`}
                    >
                      <div className='flex gap-1 mb-2'>
                        {theme.colors.map((color, index) => (
                          <div
                            key={index}
                            className='h-6 flex-1 rounded-[var(--radius-sm)] transition-transform hover:scale-110'
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className='text-foreground text-sm'>{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* UI Customization - Always Visible */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Sliders className='h-4 w-4 text-primary' />
                  <h4 className='text-foreground'>UI Customization</h4>
                </div>

                {/* Border Radius */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Maximize2 className='h-3.5 w-3.5 text-muted-foreground' />
                    <label className='text-foreground'>Border Radius</label>
                  </div>
                  <div className='grid grid-cols-3 gap-2'>
                    {(["sharp", "rounded", "pill"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setBorderRadius(type);
                          toast.success(`Border radius: ${type}`);
                        }}
                        className={`p-2 rounded-[var(--radius)] border-2 transition-all text-center ${
                          borderRadius === type
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        <div
                          className={`h-8 mx-auto mb-1 bg-primary/20 border-2 border-primary/40 ${
                            type === "sharp"
                              ? "rounded-none"
                              : type === "rounded"
                              ? "rounded-md"
                              : "rounded-full"
                          }`}
                        />
                        <p className='text-foreground text-xs capitalize'>
                          {type}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing Density */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Move className='h-3.5 w-3.5 text-muted-foreground' />
                    <label className='text-foreground'>Spacing</label>
                  </div>
                  <div className='grid grid-cols-3 gap-2'>
                    {(["compact", "comfortable", "spacious"] as const).map(
                      (type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setSpacing(type);
                            toast.success(`Spacing: ${type}`);
                          }}
                          className={`p-2 rounded-[var(--radius)] border-2 transition-all text-center ${
                            spacing === type
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 bg-card"
                          }`}
                        >
                          <div className='space-y-1 mb-1'>
                            <div
                              className={`h-1.5 bg-primary/40 rounded-sm ${
                                type === "compact"
                                  ? "mx-4"
                                  : type === "comfortable"
                                  ? "mx-2"
                                  : "mx-0"
                              }`}
                            />
                            <div
                              className={`h-1.5 bg-primary/40 rounded-sm ${
                                type === "compact"
                                  ? "mx-4"
                                  : type === "comfortable"
                                  ? "mx-2"
                                  : "mx-0"
                              }`}
                            />
                          </div>
                          <p className='text-foreground text-xs capitalize'>
                            {type}
                          </p>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Stepper Type - Only show for wizard template */}
                {selectedTemplate === "wizard" && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Navigation className='h-3.5 w-3.5 text-muted-foreground' />
                      <label className='text-foreground'>Stepper Type</label>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      {(
                        ["dots", "numbers", "progress", "breadcrumb"] as const
                      ).map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setStepperType(type);
                            toast.success(`Stepper: ${type}`);
                          }}
                          className={`p-2 rounded-[var(--radius)] border-2 transition-all text-center ${
                            stepperType === type
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 bg-card"
                          }`}
                        >
                          <div className='flex items-center justify-center gap-1 mb-1 h-6'>
                            {type === "dots" && (
                              <>
                                <Circle className='h-2 w-2 fill-primary text-primary' />
                                <Circle className='h-2 w-2 text-muted-foreground' />
                                <Circle className='h-2 w-2 text-muted-foreground' />
                              </>
                            )}
                            {type === "numbers" && (
                              <>
                                <Hash className='h-3 w-3 text-primary' />
                                <Hash className='h-3 w-3 text-muted-foreground' />
                              </>
                            )}
                            {type === "progress" && (
                              <BarChart3 className='h-4 w-4 text-primary' />
                            )}
                            {type === "breadcrumb" && (
                              <ChevronRight className='h-4 w-4 text-primary' />
                            )}
                          </div>
                          <p className='text-foreground text-xs capitalize'>
                            {type}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Label Position */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Type className='h-3.5 w-3.5 text-muted-foreground' />
                    <label className='text-foreground'>Label Position</label>
                  </div>
                  <div className='grid grid-cols-3 gap-2'>
                    {(["top", "left", "inline"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setLabelPosition(type);
                          toast.success(`Label position: ${type}`);
                        }}
                        className={`p-2 rounded-[var(--radius)] border-2 transition-all text-center ${
                          labelPosition === type
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        <div
                          className={`mb-1 ${
                            type === "left"
                              ? "flex items-center gap-1"
                              : "space-y-1"
                          }`}
                        >
                          <div
                            className='h-1 bg-primary/40 rounded-sm'
                            style={{
                              width:
                                type === "inline"
                                  ? "60%"
                                  : type === "left"
                                  ? "40%"
                                  : "100%",
                            }}
                          />
                          <div className='h-2 bg-primary/20 border border-primary/40 rounded-sm flex-1' />
                        </div>
                        <p className='text-foreground text-xs capitalize'>
                          {type}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Size */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Maximize2 className='h-3.5 w-3.5 text-muted-foreground' />
                    <label className='text-foreground'>Input Size</label>
                  </div>
                  <div className='grid grid-cols-3 gap-2'>
                    {(["sm", "md", "lg"] as const).map((size) => (
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
                        className={`p-2 rounded-[var(--radius)] border-2 transition-all text-center min-w-0 ${
                          inputSize === size
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        <div
                          className={`bg-primary/20 border border-primary/40 rounded-sm mx-auto mb-1 ${
                            size === "sm"
                              ? "h-4 w-[70%]"
                              : size === "md"
                              ? "h-6 w-[80%]"
                              : "h-8 w-[90%]"
                          }`}
                        />
                        <p className='text-foreground text-xs uppercase'>
                          {size}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Left Panel Toggle Button - Always Visible */}
      <Button
        onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
        className={`absolute top-1/2 -translate-y-1/2 h-12 w-6 p-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[var(--radius)] shadow-md z-20 transition-all duration-300 ${
          leftPanelCollapsed ? "left-0" : "left-[19.75rem]"
        }`}
        aria-label={
          leftPanelCollapsed
            ? "Expand configurator panel"
            : "Collapse configurator panel"
        }
      >
        {leftPanelCollapsed ? (
          <ChevronRight className='h-4 w-4' />
        ) : (
          <ChevronLeft className='h-4 w-4' />
        )}
      </Button>

      {/* Center Panel - Canvas */}
      <div className='flex-1 flex flex-col bg-background overflow-hidden'>
        {/* Canvas Toolbar */}
        <div className='h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0'>
          <h3 className='text-foreground'>Canvas</h3>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1 p-1 bg-secondary rounded-[var(--radius)]'>
              <Button
                variant={viewportMode === "desktop" ? "default" : "ghost"}
                size='sm'
                onClick={() => setViewportMode("desktop")}
                className={`rounded-[var(--radius-sm)] ${
                  viewportMode === "desktop"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                aria-label='Desktop view'
                aria-pressed={viewportMode === "desktop"}
              >
                <Monitor className='h-4 w-4' aria-hidden='true' />
              </Button>
              <Button
                variant={viewportMode === "tablet" ? "default" : "ghost"}
                size='sm'
                onClick={() => setViewportMode("tablet")}
                className={`rounded-[var(--radius-sm)] ${
                  viewportMode === "tablet"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                aria-label='Tablet view'
                aria-pressed={viewportMode === "tablet"}
              >
                <Tablet className='h-4 w-4' aria-hidden='true' />
              </Button>
              <Button
                variant={viewportMode === "mobile" ? "default" : "ghost"}
                size='sm'
                onClick={() => setViewportMode("mobile")}
                className={`rounded-[var(--radius-sm)] ${
                  viewportMode === "mobile"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                aria-label='Mobile view'
                aria-pressed={viewportMode === "mobile"}
              >
                <Smartphone className='h-4 w-4' aria-hidden='true' />
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className='flex-1 overflow-y-auto'>
          <ScrollArea className='h-full'>
            <div className='p-8'>
              <div
                key={`${selectedTemplate}-${selectedTheme}`}
                className={`mx-auto transition-all animate-in fade-in-50 duration-300 ${getViewportWidth()}`}
              >
                <FormRenderer
                  schema={schema}
                  onFormDataChange={() => {}}
                  template={
                    selectedTemplate as
                      | "simple"
                      | "two-column"
                      | "wizard"
                      | "carded"
                  }
                  themeColors={
                    themes.find((t) => t.id === selectedTheme)?.colors
                  }
                  highlightRequired={highlightRequired}
                  wizardStep={wizardStep}
                  onWizardStepChange={setWizardStep}
                  borderRadius={borderRadius}
                  spacing={spacing}
                  stepperType={stepperType}
                  labelPosition={labelPosition}
                  inputSize={inputSize}
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Right Panel - Tests, Deploy, Schema */}
      <div
        className={`border-l border-border bg-card transition-all duration-300 ${
          rightPanelCollapsed ? "w-0 border-l-0" : "w-96"
        } overflow-hidden`}
      >
        {!rightPanelCollapsed && (
          <Tabs defaultValue='schema' className='h-full flex flex-col'>
            <div className='border-b border-border'>
              <TabsList className='w-full bg-transparent rounded-none h-14 p-0'>
                <TabsTrigger
                  value='schema'
                  className='flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent h-full'
                >
                  <Code2 className='h-4 w-4 mr-1' />
                  Schema
                </TabsTrigger>
                <TabsTrigger
                  value='tests'
                  className='flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent h-full'
                >
                  <TestTube2 className='h-4 w-4 mr-1' />
                  Tests
                </TabsTrigger>
                <TabsTrigger
                  value='deploy'
                  className='flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent h-full'
                >
                  <Rocket className='h-4 w-4 mr-1' />
                  Deploy
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='schema' className='flex-1 overflow-hidden m-0'>
              <ScrollArea className='h-full'>
                <div className='p-6'>
                  <SchemaViewer schema={schema} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value='tests' className='flex-1 overflow-hidden m-0'>
              <ScrollArea className='h-full'>
                <div className='p-4 overflow-auto'>
                  <TestViewer tests={tests} schema={schema} />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value='deploy' className='flex-1 overflow-hidden m-0'>
              <ScrollArea className='h-full'>
                <div className='p-6'>
                  <DeploymentPanel schema={schema} mockApi={mockApi} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Right Panel Toggle Button - Always Visible */}
      <Button
        onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
        className={`absolute top-1/2 -translate-y-1/2 h-12 w-6 p-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[var(--radius)] shadow-md z-20 transition-all duration-300 ${
          rightPanelCollapsed ? "right-0" : "right-[23.75rem]"
        }`}
        aria-label={
          rightPanelCollapsed ? "Expand right panel" : "Collapse right panel"
        }
      >
        {rightPanelCollapsed ? (
          <ChevronLeft className='h-4 w-4' />
        ) : (
          <ChevronRight className='h-4 w-4' />
        )}
      </Button>

      {/* Fields List Dialog */}
      <Dialog open={showFieldsList} onOpenChange={setShowFieldsList}>
        <DialogContent className='bg-card border-border rounded-[var(--radius-card)] max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-foreground'>
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
                    className='p-4 bg-background rounded-[var(--radius)] border border-border'
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
        <DialogContent className='bg-card border-border rounded-[var(--radius-card)]'>
          <DialogHeader>
            <DialogTitle className='text-foreground'>
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
                    className={`w-full p-4 rounded-[var(--radius)] border-2 transition-all text-left hover:border-primary hover:bg-primary/5 ${
                      wizardStep === step
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background"
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
    </div>
  );
}
