import React, { useState, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Slider } from './ui/slider';
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
  Upload,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { FormSchema } from '../types/schema';
import { FormRenderer } from './FormRenderer';
import { TravelInsuranceForm } from './TravelInsuranceForm';
import { TravelInsuranceFormGlass } from './TravelInsuranceFormGlass';
import { DeathClaimForm } from './DeathClaimForm';
import { SchemaViewer } from './SchemaViewer';
import { TestViewer } from './TestViewer';
import { DeploymentPanel } from './DeploymentPanel';
import { APIViewer } from './APIViewer';
import { TestCase, MockApiEndpoint } from '../types/schema';
import { RulesValidationManager } from './RulesValidationManager';
import Simple from '../imports/Simple';
import TwoColumn from '../imports/Simple-210-107';
import Carded from '../imports/Carded';
import Sharp from '../imports/Sharp';
import Rounded from '../imports/Rounded';
import Pill from '../imports/Pill';
import Compact from '../imports/Compact';
import Comfortable from '../imports/Comfortable';
import Spacious from '../imports/Spacious';
import Top from '../imports/Top';
import Left from '../imports/Left';
import Sm from '../imports/Sm';
import Md from '../imports/Md';
import Lg from '../imports/Lg';
import Dots from '../imports/Dots';
import Numbers from '../imports/Numbers';
import Progress from '../imports/Progress-220-226';
import Breadcrumb from '../imports/Breadcrumb';
import Steppers from '../imports/Steppers';

interface FormEditorPageProps {
  requirements: string;
  schema: FormSchema;
  tests: any[];
  mockApi: MockApiEndpoint[];
  onSchemaUpdate: (schema: FormSchema) => void;
  onRegenerate: (newRequirements: string) => void;
}

export function FormEditorPage({
  requirements,
  schema,
  tests,
  mockApi,
  onSchemaUpdate,
  onRegenerate
}: FormEditorPageProps) {
  const [editableRequirements, setEditableRequirements] = useState(requirements);
  const [originalRequirements, setOriginalRequirements] = useState(requirements);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingRequirements, setIsEditingRequirements] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedTemplate, setSelectedTemplate] = useState(schema.layout || 'simple');
  const [selectedTheme, setSelectedTheme] = useState('corporate');
  const [highlightRequired, setHighlightRequired] = useState(false);
  const [showFieldsList, setShowFieldsList] = useState(false);
  const [showStepsDialog, setShowStepsDialog] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [showStepper, setShowStepper] = useState(true);

  // Panel collapse state
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);

  // Image upload state
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  // Theme JSON upload state
  const themeJsonInputRef = React.useRef<HTMLInputElement>(null);

  // Rules and Validation dialog state
  const [showRulesDialog, setShowRulesDialog] = useState(false);

  // UI Configuration state
  const [borderRadius, setBorderRadius] = useState<'sharp' | 'rounded' | 'pill'>('rounded');
  const [spacing, setSpacing] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [stepperType, setStepperType] = useState<'dots' | 'numbers' | 'progress' | 'breadcrumb'>('numbers');
  const [labelPosition, setLabelPosition] = useState<'top' | 'left' | 'inline'>('top');
  const [inputSize, setInputSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Form data state for live preview
  const [formData, setFormData] = useState<any>({});

  // Define templates and themes outside component or memoize them
  const templates = React.useMemo(() => [
    { id: 'simple', name: 'Simple', preview: '▭', description: 'Single column layout' },
    { id: 'two-column', name: 'Two Column', preview: '▯▯', description: 'Side-by-side fields' },
    { id: 'carded', name: 'Carded', preview: '▢▢', description: 'Each field in a card' },
  ], []);

  const themes = React.useMemo(() => [
    { id: 'corporate', name: 'Corporate', colors: ['#1e40af', '#3b82f6'] },
    { id: 'ocean', name: 'Ocean', colors: ['#0e7490', '#06b6d4'] },
    { id: 'forest', name: 'Forest', colors: ['#047857', '#10b981'] },
    { id: 'sunset', name: 'Sunset', colors: ['#dc2626', '#f59e0b'] },
    { id: 'primary', name: 'Primary', colors: ['#001C56', '#00BBFF'] },
    { id: 'slate', name: 'Slate', colors: ['#475569', '#64748b'] },
  ], []);

  // Memoize the selected theme colors to prevent unnecessary re-renders
  const selectedThemeColors = React.useMemo(() =>
    themes.find(t => t.id === selectedTheme)?.colors,
    [themes, selectedTheme]
  );

  // Memoize the callback to prevent re-renders
  const handleFormDataChange = useCallback((data: any) => {
    setFormData(data);
  }, []);

  const loadingMessages = [
    "Analyzing your requirements...",
    "Generating form schema...",
    "Creating UI components...",
    "Setting up data bindings...",
    "Building validation rules...",
    "Generating mock APIs...",
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
      const templateName = templates.find(t => t.id === selectedTemplate)?.name || selectedTemplate;
      onSchemaUpdate({
        ...schema,
        layout: selectedTemplate as 'simple' | 'two-column' | 'carded'
      });
      toast.success(`Template changed to ${templateName}`);
    }
  }, [selectedTemplate]);

  // Show toast when theme changes
  React.useEffect(() => {
    const themeName = themes.find(t => t.id === selectedTheme)?.name;
    if (themeName && selectedTheme !== 'corporate') {
      toast.success(`Theme changed to ${themeName}`);
    }
  }, [selectedTheme]);

  // Reset wizard step when template changes
  React.useEffect(() => {
    setWizardStep(0);
    setHighlightRequired(false);
  }, [selectedTemplate]);

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
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.success('Listening...');
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');

      setEditableRequirements(prev => prev + ' ' + transcript);
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
        if (!themeData.id || !themeData.name || !themeData.colors || !Array.isArray(themeData.colors)) {
          toast.error('Invalid theme JSON format. Required: { id, name, colors: [] }');
          return;
        }

        if (themeData.colors.length < 2) {
          toast.error('Theme must have at least 2 colors');
          return;
        }

        // Check if theme already exists
        const existingThemeIndex = themes.findIndex(t => t.id === themeData.id);

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
        toast.error('Failed to parse JSON file. Please check the format.');
        console.error('Theme JSON parse error:', error);
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
    };

    reader.readAsText(file);
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    toast.success(`Image uploaded: ${file.name}`);
    // Simulate image analysis
    setTimeout(() => {
      setEditableRequirements(prev => prev + `\n\nImage analysis from ${file.name}: Detected additional form requirements.`);
    }, 1000);
  };

  const handleFieldsClick = () => {
    setShowFieldsList(true);
    toast.info(`Showing ${schema.fields.length} fields`);
  };

  const handleRequiredClick = () => {
    setHighlightRequired(!highlightRequired);
    const requiredCount = schema.fields.filter(f => f.validations?.some(v => v.type === 'required')).length;
    if (!highlightRequired) {
      toast.info(`Highlighting ${requiredCount} required fields`);
    } else {
      toast.info('Required fields highlighting disabled');
    }
  };

  const handleStepsClick = () => {
    if (showStepper) {
      setShowStepsDialog(true);
      toast.info('Step navigation opened');
    } else {
      toast.info('Enable "Show Stepper" in UI Customization to use multi-step navigation');
    }
  };

  const handleWizardStepChange = (step: number) => {
    setWizardStep(step);
    setShowStepsDialog(false);
    toast.success(`Navigated to Step ${step + 1}`);
  };

  const getViewportWidth = () => {
    switch (viewportMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex relative bg-background overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--color-border)) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tr from-purple/10 to-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left Panel - Form Configurator */}
      <div className={`relative border-r-2 border-border bg-card/95 backdrop-blur-sm flex flex-col transition-all duration-300 shadow-[var(--elevation-md)] ${leftPanelCollapsed ? 'w-0 border-r-0' : 'w-80'} overflow-hidden z-10`}>
        {!leftPanelCollapsed && (
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6 h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Requirements Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center shadow-[var(--elevation-sm)]">
                    <Wand2 className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="text-foreground">Requirements</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingRequirements(!isEditingRequirements)}
                  className="rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all"
                  aria-label={isEditingRequirements ? 'Cancel editing requirements' : 'Edit requirements'}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              {isEditingRequirements ? (
                <div className="space-y-3">
                  <Textarea
                    value={editableRequirements}
                    onChange={(e) => {
                      setEditableRequirements(e.target.value);
                    }}
                    className="h-[450px] overflow-y-auto resize-none bg-input-background border border-border rounded-[var(--radius-input)] focus:border-primary transition-all"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <input
                      ref={imageInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                    <Button
                      onClick={handleMicrophoneToggle}
                      size="sm"
                      variant="outline"
                      className={`border rounded-[var(--radius-button)] transition-all ${isListening ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}
                      title={isListening ? 'Stop recording' : 'Start voice input'}
                    >
                      {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                    </Button>
                    <Button
                      onClick={() => imageInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      className="border border-border rounded-[var(--radius-button)] hover:border-primary/50 hover:bg-primary/5 transition-all"
                      title="Upload image"
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={handleRegenerate}
                      size="sm"
                      disabled={!hasChanges}
                      className="flex-1 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:bg-primary/90 shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button
                      onClick={() => {
                        setEditableRequirements(requirements);
                        setIsEditingRequirements(false);
                        setUploadedImage(null);
                      }}
                      size="sm"
                      variant="outline"
                      className="border border-border rounded-[var(--radius-button)] hover:border-destructive hover:bg-destructive/5 hover:text-destructive transition-all"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-background/80 rounded-[var(--radius-card)] border border-border shadow-[var(--elevation-sm)]">
                  <p className="text-muted-foreground line-clamp-4 break-words">{requirements}</p>
                </div>
              )}

              {/* Rules and Validation Button */}
              <Button
                onClick={() => setShowRulesDialog(true)}
                variant="outline"
                className="w-full border border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <ShieldCheck className="h-4 w-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
                <span>Rules and Validation</span>
              </Button>
            </div>

            <Separator />

            {/* Template Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center shadow-[var(--elevation-sm)]">
                  <Layout className="h-4 w-4 text-primary" />
                </div>
                <h4 className="text-foreground">Layout</h4>
              </div>
              <p className="text-muted-foreground">
                {templates.find(t => t.id === selectedTemplate)?.description}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id as any)}
                    className={`p-4 rounded-[var(--radius-card)] border transition-all duration-300 hover:scale-105 ${
                      selectedTemplate === template.id
                        ? 'bg-[var(--color-selected-bg)] border-[var(--color-selected-border)] text-[var(--color-selected-border)] shadow-[var(--elevation-md)]'
                        : 'border-border hover:border-primary/50 bg-card shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)]'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-[58px] w-[58px] flex items-center justify-center">
                        {template.id === 'simple' && <Simple />}
                        {template.id === 'two-column' && <TwoColumn />}
                        {template.id === 'carded' && <Carded />}
                      </div>
                      <p className={selectedTemplate === template.id ? "text-[var(--color-selected-border)]" : "text-foreground"}>{template.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Theme Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center shadow-[var(--elevation-sm)]">
                  <Palette className="h-4 w-4 text-primary" />
                </div>
                <h4 className="text-foreground">Theme</h4>
              </div>
              <p className="text-muted-foreground">
                Apply custom color schemes to your form
              </p>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-4 rounded-[var(--radius-card)] border transition-all duration-300 hover:scale-105 ${
                      selectedTheme === theme.id
                        ? 'bg-[var(--color-selected-bg)] border-[var(--color-selected-border)] text-[var(--color-selected-border)] shadow-[var(--elevation-md)]'
                        : 'border-border hover:border-primary/50 bg-card shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)]'
                    }`}
                  >
                    <div className="flex gap-1.5 mb-3">
                      {theme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="h-7 flex-1 rounded-[var(--radius)] transition-transform hover:scale-110 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className={selectedTheme === theme.id ? "text-[var(--color-selected-border)]" : "text-foreground"}>{theme.name}</p>
                  </button>
                ))}
              </div>

              {/* Upload Theme JSON */}
              <div className="pt-2">
                <input
                  ref={themeJsonInputRef}
                  type="file"
                  className="hidden"
                  accept=".json,application/json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleThemeJsonUpload(file);
                  }}
                />
                <Button
                  onClick={() => themeJsonInputRef.current?.click()}
                  variant="outline"
                  className="w-full border border-dashed border-border hover:border-primary hover:bg-primary/5 rounded-[var(--radius-button)] transition-all"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Theme JSON
                </Button>

              </div>
            </div>

            <Separator />

            {/* UI Customization - Always Visible */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center shadow-[var(--elevation-sm)]">
                  <Sliders className="h-4 w-4 text-primary" />
                </div>
                <h4 className="text-foreground">UI Customization</h4>
              </div>

              {/* Show Stepper Toggle - FIRST OPTION */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3.5 w-3.5 text-muted-foreground">
                    <Steppers />
                  </div>
                  <label className="text-foreground">Stepper</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['off', 'on'] as const).map((mode) => {
                    const isSelected = (mode === 'on' && showStepper) || (mode === 'off' && !showStepper);
                    return (
                      <button
                        key={mode}
                        onClick={() => {
                          const newValue = mode === 'on';
                          setShowStepper(newValue);
                          if (newValue) {
                            setWizardStep(0);
                          }
                          toast.success(mode === 'on' ? 'Stepper enabled' : 'Stepper disabled');
                        }}
                        className={`p-2 rounded-[var(--radius)] border transition-all text-center ${
                          isSelected
                            ? 'bg-[var(--color-selected-bg)] border-[var(--color-selected-border)]'
                            : 'border-border hover:border-primary/50 bg-card'
                        }`}
                      >
                        <p className={`text-xs uppercase ${isSelected ? 'text-[var(--color-selected-border)]' : 'text-foreground'}`}>{mode}</p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-muted-foreground text-xs px-1">
                  Enable multi-step navigation for your form
                </p>
              </div>

              {/* Stepper Type - Only show when stepper is enabled */}
              {showStepper && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="h-3.5 w-3.5 text-muted-foreground" />
                    <label className="text-foreground">Stepper Type</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['dots', 'numbers', 'progress', 'breadcrumb'] as const).map((type) => {
                      const isSelected = stepperType === type;
                      return (
                        <button
                          key={type}
                          onClick={() => {
                            setStepperType(type);
                            toast.success(`Stepper: ${type}`);
                          }}
                          className={`p-2 rounded-[var(--radius)] border transition-all text-center ${
                            isSelected
                              ? 'bg-[var(--color-selected-bg)] border-[var(--color-selected-border)]'
                              : 'border-border hover:border-primary/50 bg-card'
                          }`}
                        >
                          <div className="h-[58px] w-[58px] mx-auto mb-1 flex items-center justify-center">
                            {type === 'dots' && <Dots />}
                            {type === 'numbers' && <Numbers />}
                            {type === 'progress' && <Progress />}
                            {type === 'breadcrumb' && <Breadcrumb />}
                          </div>
                          <p className={`text-xs capitalize ${isSelected ? 'text-[var(--color-selected-border)]' : 'text-foreground'}`}>{type}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Border Radius */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-foreground">Border Radius</label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['sharp', 'rounded', 'pill'] as const).map((type) => {
                    const isSelected = borderRadius === type;
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setBorderRadius(type);
                          toast.success(`Border radius: ${type}`);
                        }}
                        className={`p-2 rounded-[var(--radius)] border transition-all text-center ${
                          isSelected
                            ? 'bg-[var(--color-selected-bg)] border-[var(--color-selected-border)]'
                            : 'border-border hover:border-primary/50 bg-card'
                        }`}
                      >
                        <div className="h-[58px] w-[58px] mx-auto mb-1 flex items-center justify-center">
                          {type === 'sharp' && <Sharp />}
                          {type === 'rounded' && <Rounded />}
                          {type === 'pill' && <Pill />}
                        </div>
                        <p className={`text-xs capitalize ${isSelected ? 'text-[var(--color-selected-border)]' : 'text-foreground'}`}>{type}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spacing Density */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Move className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-foreground">Spacing</label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['compact', 'comfortable', 'spacious'] as const).map((type) => {
                    const isSelected = spacing === type;
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setSpacing(type);
                          toast.success(`Spacing: ${type}`);
                        }}
                        className={`p-2 rounded-[var(--radius)] border transition-all text-center ${
                          isSelected
                            ? 'bg-[var(--color-selected-bg)] border-[var(--color-selected-border)]'
                            : 'border-border hover:border-primary/50 bg-card'
                        }`}
                      >
                        <div className="h-[58px] w-[58px] mx-auto mb-1 flex items-center justify-center">
                          {type === 'compact' && <Compact />}
                          {type === 'comfortable' && <Comfortable />}
                          {type === 'spacious' && <Spacious />}
                        </div>
                        <p className={`text-xs capitalize ${isSelected ? 'text-[var(--color-selected-border)]' : 'text-foreground'}`}>{type}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Label Position */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Type className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-foreground">Label Position</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['top', 'left'] as const).map((type) => {
                    const isSelected = labelPosition === type;
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setLabelPosition(type);
                          toast.success(`Label position: ${type}`);
                        }}
                        className={`p-2 rounded-[var(--radius)] border-2 transition-all text-center ${
                          isSelected
                            ? 'bg-[var(--color-selected-bg)] border-[var(--color-selected-border)]'
                            : 'border-border hover:border-primary/50 bg-card'
                        }`}
                      >
                        <div className="h-[58px] w-[58px] mx-auto mb-1 flex items-center justify-center">
                          {type === 'top' && <Top />}
                          {type === 'left' && <Left />}
                        </div>
                        <p className={`text-xs capitalize ${isSelected ? 'text-[var(--color-selected-border)]' : 'text-foreground'}`}>{type}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Size */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-foreground">Input Size</label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['sm', 'md', 'lg'] as const).map((size) => {
                    const isSelected = inputSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setInputSize(size);
                          toast.success(`Input size: ${size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}`);
                        }}
                        className={`p-2 rounded-[var(--radius)] border-2 transition-all text-center min-w-0 ${
                          isSelected
                            ? 'bg-[var(--color-selected-bg)] border-[var(--color-selected-border)]'
                            : 'border-border hover:border-primary/50 bg-card'
                        }`}
                      >
                        <div className="h-[58px] w-[58px] mx-auto mb-1 flex items-center justify-center">
                          {size === 'sm' && <Sm />}
                          {size === 'md' && <Md />}
                          {size === 'lg' && <Lg />}
                        </div>
                        <p className={`text-xs uppercase ${isSelected ? 'text-[var(--color-selected-border)]' : 'text-foreground'}`}>{size}</p>
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

      {/* Left Panel Toggle Button - Always Visible */}
      <Button
        onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
        className={`absolute top-1/2 -translate-y-1/2 h-12 w-6 p-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-r-[var(--radius-card)] rounded-l-none shadow-[var(--elevation-lg)] hover:shadow-[var(--elevation-xl)] z-20 transition-all duration-300 ${
          leftPanelCollapsed ? 'left-0' : 'left-[19.75rem]'
        }`}
        aria-label={leftPanelCollapsed ? 'Expand configurator panel' : 'Collapse configurator panel'}
      >
        {leftPanelCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Center Panel - Canvas */}
      <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative z-10">
        {/* Canvas Toolbar */}
        <div className="h-16 border-b-2 border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0 shadow-[var(--elevation-sm)]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center shadow-[var(--elevation-sm)]">
              <Monitor className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-foreground">Canvas</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-background border-2 border-border rounded-[var(--radius-card)] shadow-[var(--elevation-sm)]">
              <Button
                variant={viewportMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewportMode('desktop')}
                className={`rounded-[var(--radius)] transition-all ${
                  viewportMode === 'desktop' ? 'shadow-[var(--elevation-sm)]' : 'hover:bg-primary/10'
                }`}
                style={viewportMode === 'desktop' ? { backgroundColor: '#EEF6FA', borderColor: '#006BD0', color: '#006BD0' } : undefined}
                aria-label="Desktop view"
                aria-pressed={viewportMode === 'desktop'}
              >
                <Monitor className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant={viewportMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewportMode('tablet')}
                className={`rounded-[var(--radius)] transition-all ${
                  viewportMode === 'tablet' ? 'shadow-[var(--elevation-sm)]' : 'hover:bg-primary/10'
                }`}
                style={viewportMode === 'tablet' ? { backgroundColor: '#EEF6FA', borderColor: '#006BD0', color: '#006BD0' } : undefined}
                aria-label="Tablet view"
                aria-pressed={viewportMode === 'tablet'}
              >
                <Tablet className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant={viewportMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewportMode('mobile')}
                className={`rounded-[var(--radius)] transition-all ${
                  viewportMode === 'mobile' ? 'shadow-[var(--elevation-sm)]' : 'hover:bg-primary/10'
                }`}
                style={viewportMode === 'mobile' ? { backgroundColor: '#EEF6FA', borderColor: '#006BD0', color: '#006BD0' } : undefined}
                aria-label="Mobile view"
                aria-pressed={viewportMode === 'mobile'}
              >
                <Smartphone className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="p-8">
              <div
                key={`${selectedTemplate}-${selectedTheme}`}
                className={`mx-auto transition-all animate-in fade-in-50 duration-300 ${getViewportWidth()}`}
              >
                {/* Use TravelInsuranceFormGlass for travel insurance, DeathClaimForm for death claim, otherwise use FormRenderer */}
                {schema.title.toLowerCase().includes('travel insurance') ? (
                  <TravelInsuranceFormGlass
                    showStepper={showStepper}
                    stepperType={stepperType}
                    borderRadius={borderRadius}
                    spacing={spacing}
                    labelPosition={labelPosition}
                    inputSize={inputSize}
                    template={selectedTemplate as 'simple' | 'two-column' | 'carded'}
                    themeColors={selectedThemeColors}
                    onFormDataChange={handleFormDataChange}
                  />
                ) : schema.title.toLowerCase().includes('death claim') ? (
                  <DeathClaimForm
                    showStepper={showStepper}
                    stepperType={stepperType}
                    borderRadius={borderRadius}
                    spacing={spacing}
                    labelPosition={labelPosition}
                    inputSize={inputSize}
                    template={selectedTemplate as 'simple' | 'two-column' | 'carded'}
                    themeColors={selectedThemeColors}
                    onFormDataChange={handleFormDataChange}
                  />
                ) : (
                  <FormRenderer
                    schema={schema}
                    onFormDataChange={handleFormDataChange}
                    template={selectedTemplate as 'simple' | 'two-column' | 'carded'}
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

      {/* Right Panel - Schema, APIs, Tests, Deploy */}
      <div className={`relative border-l-2 border-border bg-card/95 backdrop-blur-sm transition-all duration-300 shadow-[var(--elevation-md)] ${rightPanelCollapsed ? 'w-0 border-l-0' : 'w-96'} overflow-hidden z-10`}>
        {!rightPanelCollapsed && (
          <Tabs defaultValue="schema" className="h-full flex flex-col">
          <div className="border-b-2 border-border bg-background/50">
            <TabsList className="w-full bg-transparent rounded-none h-14 p-0 grid grid-cols-4">
              <TabsTrigger
                value="schema"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-selected-border)] data-[state=active]:bg-[var(--color-selected-bg)] data-[state=active]:text-[var(--color-selected-border)] h-full transition-all"
              >
                <Code2 className="h-4 w-4 mr-1" />
                Schema
              </TabsTrigger>
              <TabsTrigger
                value="apis"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-selected-border)] data-[state=active]:bg-[var(--color-selected-bg)] data-[state=active]:text-[var(--color-selected-border)] h-full transition-all"
              >
                <Globe className="h-4 w-4 mr-1" />
                APIs
              </TabsTrigger>
              <TabsTrigger
                value="tests"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-selected-border)] data-[state=active]:bg-[var(--color-selected-bg)] data-[state=active]:text-[var(--color-selected-border)] h-full transition-all"
              >
                <TestTube2 className="h-4 w-4 mr-1" />
                Tests
              </TabsTrigger>
              <TabsTrigger
                value="deploy"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-selected-border)] data-[state=active]:bg-[var(--color-selected-bg)] data-[state=active]:text-[var(--color-selected-border)] h-full transition-all"
              >
                <Rocket className="h-4 w-4 mr-1" />
                Deploy
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="schema" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <SchemaViewer schema={schema} formData={formData} />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="apis" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <APIViewer mockApi={mockApi} />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tests" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <TestViewer tests={tests} schema={schema} />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="deploy" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
              <div className="p-6 w-full min-w-0 max-w-full overflow-hidden" style={{ boxSizing: 'border-box' }}>
                <div className="w-full min-w-0 max-w-full overflow-hidden">
                  <DeploymentPanel schema={schema} mockApi={mockApi} />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        )}
      </div>

      {/* Right Panel Toggle Button - Always Visible */}
      <Button
        onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
        className={`absolute top-1/2 -translate-y-1/2 h-12 w-6 p-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-l-[var(--radius-card)] rounded-r-none shadow-[var(--elevation-lg)] hover:shadow-[var(--elevation-xl)] z-20 transition-all duration-300 ${
          rightPanelCollapsed ? 'right-0' : 'right-[23.75rem]'
        }`}
        aria-label={rightPanelCollapsed ? 'Expand right panel' : 'Collapse right panel'}
      >
        {rightPanelCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Fields List Dialog */}
      <Dialog open={showFieldsList} onOpenChange={setShowFieldsList}>
        <DialogContent className="bg-card border-2 border-border rounded-[var(--radius-card)] max-w-2xl shadow-[var(--elevation-lg)]">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <div className="h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center">
                <List className="h-4 w-4 text-primary" />
              </div>
              All Fields ({schema.fields.length})
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Complete list of form fields with their types and validations
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 pr-4">
              {schema.fields.map((field, index) => {
                const isRequired = field.validations?.some(v => v.type === 'required');
                return (
                  <div
                    key={field.id}
                    className="p-4 bg-background rounded-[var(--radius-card)] border-2 border-border hover:border-primary/50 transition-all shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{index + 1}. {field.label}</span>
                        {isRequired && (
                          <Badge className="bg-destructive text-destructive-foreground rounded-[var(--radius-pill)]">
                            Required
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-primary/10 text-primary rounded-[var(--radius-pill)]">
                        {field.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Field name: <code className="bg-muted px-1 rounded">{field.name}</code>
                    </p>
                    {field.description && (
                      <p className="text-muted-foreground text-sm mt-1">{field.description}</p>
                    )}
                    {field.validations && field.validations.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {field.validations.map((val, vidx) => (
                          <Badge key={vidx} variant="outline" className="rounded-[var(--radius-pill)] text-xs">
                            {val.type}{val.value ? `: ${val.value}` : ''}
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
        <DialogContent className="bg-card border-2 border-border rounded-[var(--radius-card)] shadow-[var(--elevation-lg)]">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <div className="h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center">
                <Navigation className="h-4 w-4 text-primary" />
              </div>
              Wizard Steps Navigation
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Jump to any step in your wizard form
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedTemplate === ('wizard' as any) && [0, 1, 2].map((step) => {
              const fieldsPerStep = Math.ceil(schema.fields.length / 3);
              const stepFields = schema.fields.slice(step * fieldsPerStep, (step + 1) * fieldsPerStep);
              return (
                <button
                  key={step}
                  onClick={() => handleWizardStepChange(step)}
                  className={`w-full p-4 rounded-[var(--radius-card)] border-2 transition-all duration-300 text-left hover:border-primary hover:bg-primary/10 hover:shadow-[var(--elevation-md)] ${
                    wizardStep === step ? 'border-primary bg-primary/10 shadow-[var(--elevation-md)]' : 'border-border bg-background shadow-[var(--elevation-sm)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        wizardStep === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {step + 1}
                      </div>
                      <span className="text-foreground">Step {step + 1}</span>
                    </div>
                    {wizardStep === step && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-muted-foreground text-sm ml-11">
                    {stepFields.length} fields: {stepFields.map(f => f.label).join(', ')}
                  </p>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rules and Validation Dialog */}
      <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
        <DialogContent className="bg-card border-2 border-border rounded-[var(--radius-card)] max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-[var(--elevation-lg)]">
          <DialogHeader className="flex-shrink-0 pb-4">
            <DialogTitle className="text-foreground flex items-center gap-2">
              <div className="h-8 w-8 rounded-[var(--radius-card)] bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              Rules and Validation
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Define custom validation rules and field dependencies to control form behavior
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 overflow-auto -mx-6 px-6">
            <RulesValidationManager schema={schema} onSchemaUpdate={onSchemaUpdate} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50">
          <div className="p-8 text-center relative">
            {/* Animated Logo Loader */}
            <div className="relative mb-6">
              <div className="relative h-24 w-24 mx-auto">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl scale-110 animate-pulse" />

                {/* SVG Logo with animations */}
                <div className="relative h-24 w-24">
                  <svg width="96" height="96" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <filter id="filter0_loader_editor" x="9.87988" y="4.76001" width="45.7266" height="16.0312" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur"/>
                      </filter>
                      <filter id="filter1_loader_editor" x="8.46387" y="43.1794" width="45.7266" height="16.0312" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur"/>
                      </filter>
                      <linearGradient id="paint0_loader_editor" x1="10.8232" y1="5.72879" x2="46.1092" y2="-10.3627" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="#00BDFF"/>
                      </linearGradient>
                      <linearGradient id="paint1_loader_editor" x1="51.5199" y1="14.4" x2="15.1596" y2="31.7874" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="#00BDFF"/>
                      </linearGradient>
                      <linearGradient id="paint2_loader_editor" x1="9.4072" y1="44.1482" x2="44.6932" y2="28.0567" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="#00BDFF"/>
                      </linearGradient>
                      <linearGradient id="paint3_loader_editor" x1="9.4072" y1="44.1482" x2="44.6932" y2="28.0567" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white"/>
                        <stop offset="1" stopColor="#00BDFF"/>
                      </linearGradient>
                    </defs>

                    {/* Rotating outer circle */}
                    <g style={{ transformOrigin: 'center', animation: 'spin 3s linear infinite' }}>
                      <path d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z" fill="#001C56"/>

                      {/* Inner rings */}
                      <path d="M31.9999 57.92C46.3359 57.92 57.9199 46.336 57.9199 32C57.9199 17.664 46.3359 6.07998 31.9999 6.07998C17.6639 6.07998 6.07993 17.664 6.07993 32C6.07992 46.336 17.6639 57.92 31.9999 57.92ZM31.9999 8.19198C45.1839 8.19198 55.8079 18.88 55.8079 32C55.8079 45.12 45.1839 55.808 31.9999 55.808C18.8159 55.808 8.19193 45.184 8.19193 32C8.19193 18.816 18.8159 8.19198 31.9999 8.19198Z" fill="white" fillOpacity="0.48"/>
                      <path d="M32.0001 6.08002C17.6641 6.08002 6.08008 17.664 6.08008 32C6.08008 46.336 17.6641 57.92 32.0001 57.92C46.3361 57.92 57.9201 46.336 57.9201 32C57.9201 17.664 46.3361 6.08002 32.0001 6.08002ZM32.0001 55.808C18.8161 55.808 8.19208 45.12 8.19208 32C8.19208 18.88 18.8161 8.19202 32.0001 8.19202C45.1841 8.19202 55.8081 18.816 55.8081 32C55.8081 45.184 45.1841 55.808 32.0001 55.808Z" fill="white" fillOpacity="0.48"/>

                      {/* Top orbital arc */}
                      <g filter="url(#filter0_loader_editor)">
                        <path d="M11.0776 16.8027C21.3816 2.27466 43.1416 2.14666 54.0856 16.0347C54.9176 16.9947 54.7256 18.4667 53.7016 19.2987C52.6776 20.1307 51.0776 19.8747 50.3736 18.7867C49.4136 17.3147 48.2616 15.9067 46.9176 14.6907C40.2616 8.29066 29.5736 6.75466 21.3176 10.9787C17.9896 12.6427 15.0456 15.0747 12.7416 18.0827C11.9736 19.1067 10.3096 17.9547 11.0776 16.8027Z" fill="url(#paint0_loader_editor)"/>
                      </g>
                      <path d="M11.0776 16.8027C21.3816 2.27466 43.1416 2.14666 54.0856 16.0347C54.9176 16.9947 54.7256 18.4667 53.7016 19.2987C52.6776 20.1307 51.0776 19.8747 50.3736 18.7867C49.4136 17.3147 48.2616 15.9067 46.9176 14.6907C40.2616 8.29066 29.5736 6.75466 21.3176 10.9787C17.9896 12.6427 15.0456 15.0747 12.7416 18.0827C11.9736 19.1067 10.3096 17.9547 11.0776 16.8027Z" fill="url(#paint1_loader_editor)"/>

                      {/* Bottom orbital arc */}
                      <g filter="url(#filter1_loader_editor)">
                        <path d="M52.9925 47.168C42.6885 61.696 20.9285 61.824 9.98454 47.936C9.15254 46.976 9.34454 45.504 10.3685 44.672C11.3925 43.84 12.9925 44.096 13.6965 45.184C14.6565 46.656 15.8085 48.064 17.1525 49.28C23.8085 55.68 34.4965 57.216 42.7525 52.992C46.0805 51.328 49.0245 48.896 51.3285 45.888C52.0965 44.928 53.7605 46.08 52.9925 47.168Z" fill="url(#paint2_loader_editor)"/>
                      </g>
                      <path d="M52.9925 47.168C42.6885 61.696 20.9285 61.824 9.98454 47.936C9.15254 46.976 9.34454 45.504 10.3685 44.672C11.3925 43.84 12.9925 44.096 13.6965 45.184C14.6565 46.656 15.8085 48.064 17.1525 49.28C23.8085 55.68 34.4965 57.216 42.7525 52.992C46.0805 51.328 49.0245 48.896 51.3285 45.888C52.0965 44.928 53.7605 46.08 52.9925 47.168Z" fill="url(#paint3_loader_editor)"/>
                    </g>

                    {/* Center sparkle - pulsating (stays in center) */}
                    <g style={{ transformOrigin: 'center', animation: 'pulse 2s ease-in-out infinite' }}>
                      <path d="M21.248 32L24.192 31.168C27.52 30.208 30.144 27.584 31.104 24.256L31.936 21.312L32.768 24.256C33.728 27.584 36.352 30.208 39.68 31.168L42.624 32L39.68 32.832C36.48 33.856 33.856 36.48 32.832 39.808L32 42.752L31.168 39.808C30.144 36.48 27.52 33.856 24.192 32.832L21.248 32Z" fill="white"/>
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="relative space-y-3">
              <h3 className="text-foreground">Regenerating Journey</h3>

              {/* Scrolling status messages */}
              <div className="min-h-[60px] flex items-center justify-center">
                <div className="relative overflow-hidden h-12 w-full max-w-md">
                  {loadingMessages.map((message, index) => (
                    <div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                      style={{
                        transform: `translateY(${(index - loadingMessageIndex) * 100}%)`,
                        opacity: index === loadingMessageIndex ? 1 : 0,
                      }}
                    >
                      <p className="text-center px-4" style={{ color: 'var(--loader-subtext)' }}>
                        {message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-primary"
                      style={{
                        animation: 'pulse 1.5s ease-in-out infinite',
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs mx-auto h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(((loadingMessageIndex + 1) / loadingMessages.length) * 100, 100)}%`
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
