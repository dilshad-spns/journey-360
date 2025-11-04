import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  Settings2,
  Palette,
  Layout,
  Code2,
  Eye,
  Download,
  Upload,
  RotateCcw,
  GripVertical,
  Plus,
  Trash2,
  EyeOff,
  Moon,
  Sun,
  FileJson,
  Wand2
} from 'lucide-react';
import { FormSchema, FieldSchema } from '../types/schema';

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  layout: 'single' | 'two-column' | 'wizard' | 'carded' | 'compact';
  thumbnail?: string;
}

interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackground: string;
  borderRadius: string;
  shadowLevel: string;
  fontFamily: string;
}

interface FormConfiguratorProps {
  schema: FormSchema;
  onSchemaUpdate: (schema: FormSchema) => void;
  onThemeUpdate?: (theme: ThemeConfig) => void;
  onClose?: () => void;
}

const defaultTemplates: FormTemplate[] = [
  {
    id: 'simple',
    name: 'Simple Form',
    description: 'Single column, minimal design',
    layout: 'single',
  },
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Side-by-side layout',
    layout: 'two-column',
  },
  {
    id: 'carded',
    name: 'Carded Form',
    description: 'Fields grouped in cards',
    layout: 'carded',
  },
  {
    id: 'compact',
    name: 'Compact Form',
    description: 'Dense, space-efficient',
    layout: 'compact',
  },
];

const renderField = (field: FieldSchema, darkMode: boolean, theme: ThemeConfig) => {
  const inputClasses = `w-full p-3 border rounded-[var(--radius-input)] transition-all focus:ring-2 focus:ring-offset-0 ${
    darkMode
      ? 'bg-slate-800 border-slate-700 text-white focus:ring-slate-600'
      : 'bg-input-background border-border focus:ring-primary/20 focus:border-primary'
  }`;

  if (field.type === 'textarea') {
    return (
      <textarea
        placeholder={field.placeholder}
        className={inputClasses}
        style={{ borderRadius: theme.borderRadius }}
        rows={4}
      />
    );
  } else if (field.type === 'select') {
    return (
      <select
        className={inputClasses}
        style={{ borderRadius: theme.borderRadius }}
      >
        <option value="">Select an option</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (field.type === 'checkbox') {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4"
          style={{ accentColor: theme.primaryColor }}
        />
        <span className={darkMode ? 'text-slate-300' : 'text-foreground'}>
          {field.placeholder || 'Check this box'}
        </span>
      </div>
    );
  } else {
    return (
      <input
        type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        placeholder={field.placeholder}
        className={inputClasses}
        style={{ borderRadius: theme.borderRadius }}
      />
    );
  }
};

export function FormConfigurator({ schema, onSchemaUpdate, onThemeUpdate, onClose }: FormConfiguratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('simple');
  const [showStepper, setShowStepper] = useState(false);
  const [stepperStyle, setStepperStyle] = useState<string>('horizontal');
  const [autoValidation, setAutoValidation] = useState(true);
  const [previewDarkMode, setPreviewDarkMode] = useState(false);
  const [fields, setFields] = useState<FieldSchema[]>(schema.fields);
  const [draggedField, setDraggedField] = useState<number | null>(null);
  
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: '#001C56',
    accentColor: '#0ea5e9',
    backgroundColor: '#fafbfc',
    cardBackground: '#ffffff',
    borderRadius: '8px',
    shadowLevel: 'medium',
    fontFamily: 'Inter',
  });

  const handleFieldReorder = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    setFields(newFields);
    onSchemaUpdate({ ...schema, fields: newFields });
  };

  const handleFieldUpdate = (index: number, updates: Partial<FieldSchema>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
    onSchemaUpdate({ ...schema, fields: newFields });
  };

  const handleFieldDelete = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    onSchemaUpdate({ ...schema, fields: newFields });
  };

  const handleAddField = () => {
    const newField: FieldSchema = {
      id: `field_${Date.now()}`,
      name: `field_${fields.length + 1}`,
      label: `New Field ${fields.length + 1}`,
      type: 'text',
      placeholder: 'Enter value...',
    };
    const newFields = [...fields, newField];
    setFields(newFields);
    onSchemaUpdate({ ...schema, fields: newFields });
  };

  const handleThemeChange = (key: keyof ThemeConfig, value: string) => {
    const newTheme = { ...theme, [key]: value };
    setTheme(newTheme);
    if (onThemeUpdate) {
      onThemeUpdate(newTheme);
    }
  };

  const handleExportConfig = () => {
    const config = {
      schema: { ...schema, fields },
      theme,
      template: selectedTemplate,
      showStepper,
      stepperStyle,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-config-${Date.now()}.json`;
    a.click();
  };

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (imported.theme) {
            setTheme(imported.theme);
            if (onThemeUpdate) {
              onThemeUpdate(imported.theme);
            }
          }
        } catch (error) {
          console.error('Error importing theme:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetToDefault = () => {
    setFields(schema.fields);
    setTheme({
      primaryColor: '#001C56',
      accentColor: '#0ea5e9',
      backgroundColor: '#fafbfc',
      cardBackground: '#ffffff',
      borderRadius: '8px',
      shadowLevel: 'medium',
      fontFamily: 'Inter',
    });
    setSelectedTemplate('simple');
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] bg-background">
      {/* Left Panel - Configuration Options */}
      <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-border bg-card">
        <ScrollArea className="h-64 md:h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[var(--radius)] bg-primary flex items-center justify-center">
                  <Settings2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-foreground">Form Configurator</h3>
                  <p className="text-muted-foreground">Customize your form</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Layout Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layout className="h-4 w-4 text-primary" />
                  <h4 className="text-foreground">Form Layout</h4>
                </div>
                <Badge className="bg-primary text-primary-foreground rounded-[var(--radius-pill)]">
                  {defaultTemplates.length} layouts
                </Badge>
              </div>
              <div className="grid gap-3">
                {defaultTemplates.map((template, index) => {
                  const templateIcons = {
                    simple: '▭',
                    'two-column': '▯▯',
                    carded: '▢▢',
                    compact: '☰',
                  };
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-[var(--radius-card)] border-2 text-left transition-all group ${
                        selectedTemplate === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 bg-card'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-[var(--radius)] flex items-center justify-center transition-all ${
                          selectedTemplate === template.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                        }`}>
                          <span>{templateIcons[template.id as keyof typeof templateIcons]}</span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-foreground">{template.name}</span>
                            {selectedTemplate === template.id && (
                              <Badge className="bg-primary text-primary-foreground rounded-[var(--radius-pill)]">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Form Structure Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <h4 className="text-foreground">Form Structure</h4>
                </div>
                <Badge className="bg-primary text-primary-foreground rounded-[var(--radius-pill)]">
                  {fields.length} fields
                </Badge>
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={() => setDraggedField(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedField !== null) {
                        handleFieldReorder(draggedField, index);
                        setDraggedField(null);
                      }
                    }}
                    className="p-3 bg-background rounded-[var(--radius)] border border-border hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div className="flex-1 space-y-2">
                        <Input
                          value={field.label}
                          onChange={(e) => handleFieldUpdate(index, { label: e.target.value })}
                          className="bg-card border-border rounded-[var(--radius-input)]"
                        />
                        <Select
                          value={field.type}
                          onValueChange={(value) => handleFieldUpdate(index, { type: value as any })}
                        >
                          <SelectTrigger className="bg-card border-border rounded-[var(--radius-input)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="radio">Radio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFieldDelete(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleAddField}
                variant="outline"
                className="w-full border-2 border-dashed border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Field
              </Button>
            </div>

            <Separator />

            {/* UI Customization */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                <h4 className="text-foreground">UI Customization</h4>
              </div>
              
              {/* Show Stepper Toggle */}
              <div className="flex items-center justify-between p-3 bg-background rounded-[var(--radius)] border border-border">
                <Label htmlFor="show-stepper" className="text-foreground">
                  Show Stepper
                </Label>
                <Switch
                  id="show-stepper"
                  checked={showStepper}
                  onCheckedChange={setShowStepper}
                />
              </div>

              {/* Stepper Type - Only show when stepper is enabled */}
              {showStepper && (
                <div className="space-y-2">
                  <Label className="text-foreground">Stepper Type</Label>
                  <Select value={stepperStyle} onValueChange={setStepperStyle}>
                    <SelectTrigger className="bg-card border-border rounded-[var(--radius-input)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="vertical">Vertical</SelectItem>
                      <SelectItem value="dots">Dots</SelectItem>
                      <SelectItem value="minimal">Minimal Tabs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            {/* Validation & Rules */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileJson className="h-4 w-4 text-primary" />
                <h4 className="text-foreground">Validation & Rules</h4>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-[var(--radius)] border border-border">
                <Label htmlFor="auto-validation" className="text-foreground">
                  Auto-validation
                </Label>
                <Switch
                  id="auto-validation"
                  checked={autoValidation}
                  onCheckedChange={setAutoValidation}
                />
              </div>
              <Button
                variant="outline"
                className="w-full border-2 border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Code2 className="h-4 w-4 mr-1" />
                Edit Validation Schema
              </Button>
            </div>

            <Separator />

            {/* Theme Configurator */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                <h4 className="text-foreground">Theme Configuration</h4>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-foreground">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                      className="w-14 h-10 p-1 border-border rounded-[var(--radius-input)]"
                    />
                    <Input
                      type="text"
                      value={theme.primaryColor}
                      onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                      className="flex-1 bg-card border-border rounded-[var(--radius-input)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                      className="w-14 h-10 p-1 border-border rounded-[var(--radius-input)]"
                    />
                    <Input
                      type="text"
                      value={theme.accentColor}
                      onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                      className="flex-1 bg-card border-border rounded-[var(--radius-input)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Border Radius</Label>
                  <Select
                    value={theme.borderRadius}
                    onValueChange={(value) => handleThemeChange('borderRadius', value)}
                  >
                    <SelectTrigger className="bg-card border-border rounded-[var(--radius-input)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0px">None</SelectItem>
                      <SelectItem value="4px">Small</SelectItem>
                      <SelectItem value="8px">Medium</SelectItem>
                      <SelectItem value="12px">Large</SelectItem>
                      <SelectItem value="16px">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Shadow Level</Label>
                  <Select
                    value={theme.shadowLevel}
                    onValueChange={(value) => handleThemeChange('shadowLevel', value)}
                  >
                    <SelectTrigger className="bg-card border-border rounded-[var(--radius-input)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Font Family</Label>
                  <Select
                    value={theme.fontFamily}
                    onValueChange={(value) => handleThemeChange('fontFamily', value)}
                  >
                    <SelectTrigger className="bg-card border-border rounded-[var(--radius-input)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="system-ui">System UI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <label htmlFor="import-theme" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-1" />
                      Import Theme
                    </span>
                  </Button>
                  <input
                    id="import-theme"
                    type="file"
                    accept=".json"
                    onChange={handleImportTheme}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <Separator />

            {/* Configuration Summary */}
            <div className="space-y-3 p-4 bg-background rounded-[var(--radius-card)] border border-border">
              <h4 className="text-foreground">Configuration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Layout:</span>
                  <span className="text-foreground">{defaultTemplates.find(t => t.id === selectedTemplate)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fields:</span>
                  <Badge className="bg-primary text-primary-foreground rounded-[var(--radius-pill)]">
                    {fields.length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required Fields:</span>
                  <Badge className="bg-primary text-primary-foreground rounded-[var(--radius-pill)]">
                    {fields.filter(f => f.validations?.some(v => v.type === 'required')).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stepper:</span>
                  <Badge className={`rounded-[var(--radius-pill)] ${
                    showStepper 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {showStepper ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auto-validation:</span>
                  <Badge className={`rounded-[var(--radius-pill)] ${
                    autoValidation 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {autoValidation ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="flex-1 bg-background">
        <div className="h-full flex flex-col">
          {/* Preview Toolbar */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-[var(--radius)] bg-primary flex items-center justify-center">
                <Eye className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="text-foreground">Live Preview</h4>
                <p className="text-muted-foreground">Real-time form rendering</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewDarkMode(!previewDarkMode)}
                className="rounded-[var(--radius-button)] hover:bg-secondary transition-all"
              >
                {previewDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToDefault}
                className="border-2 border-border rounded-[var(--radius-button)] hover:border-destructive hover:bg-destructive/5 hover:text-destructive transition-all"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportConfig}
                className="border-2 border-border rounded-[var(--radius-button)] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <ScrollArea className="flex-1">
            <div
              className={`p-8 ${previewDarkMode ? 'dark bg-slate-900' : 'bg-background'}`}
              style={{
                fontFamily: theme.fontFamily,
              }}
            >
              <Card
                className="max-w-2xl mx-auto p-8 border border-border"
                style={{
                  borderRadius: theme.borderRadius,
                  boxShadow:
                    theme.shadowLevel === 'none'
                      ? 'none'
                      : theme.shadowLevel === 'small'
                      ? 'var(--elevation-sm)'
                      : theme.shadowLevel === 'large'
                      ? 'var(--elevation-lg)'
                      : 'var(--elevation-md)',
                }}
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className={previewDarkMode ? 'text-white' : 'text-foreground'}>
                      {schema.title}
                    </h3>
                    {schema.description && (
                      <p className={previewDarkMode ? 'text-slate-400' : 'text-muted-foreground'}>
                        {schema.description}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div
                    className={`grid gap-6 ${
                      selectedTemplate === 'two-column' ? 'md:grid-cols-2 grid-cols-1' : 'grid-cols-1'
                    } ${selectedTemplate === 'compact' ? 'gap-4' : ''}`}
                  >
                    {showStepper && (
                      <div className="mb-6">
                        {/* Horizontal Stepper */}
                        {stepperStyle === 'horizontal' && (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              {[1, 2, 3].map((step) => (
                                <React.Fragment key={step}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                        step === 1
                                          ? 'bg-primary text-primary-foreground'
                                          : previewDarkMode
                                          ? 'bg-slate-700 text-slate-400'
                                          : 'bg-secondary text-muted-foreground'
                                      }`}
                                      style={step === 1 ? { backgroundColor: theme.primaryColor } : {}}
                                    >
                                      {step}
                                    </div>
                                    <span className={previewDarkMode ? 'text-slate-400 text-sm' : 'text-muted-foreground text-sm'}>
                                      Step {step}
                                    </span>
                                  </div>
                                  {step < 3 && (
                                    <div
                                      className={`flex-1 h-0.5 mx-2 ${
                                        previewDarkMode ? 'bg-slate-700' : 'bg-border'
                                      }`}
                                    />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                            <div className={`h-1 rounded-full ${previewDarkMode ? 'bg-slate-700' : 'bg-secondary'}`}>
                              <div
                                className="h-1 rounded-full transition-all"
                                style={{ width: '33%', backgroundColor: theme.primaryColor }}
                              />
                            </div>
                          </>
                        )}
                        
                        {/* Vertical Stepper */}
                        {stepperStyle === 'vertical' && (
                          <div className="flex flex-col space-y-4 mb-6">
                            {[1, 2, 3].map((step) => (
                              <div key={step} className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                      step === 1
                                        ? 'bg-primary text-primary-foreground'
                                        : previewDarkMode
                                        ? 'bg-slate-700 text-slate-400'
                                        : 'bg-secondary text-muted-foreground'
                                    }`}
                                    style={step === 1 ? { backgroundColor: theme.primaryColor } : {}}
                                  >
                                    {step}
                                  </div>
                                  {step < 3 && (
                                    <div
                                      className={`w-0.5 h-12 my-1 ${
                                        previewDarkMode ? 'bg-slate-700' : 'bg-border'
                                      }`}
                                    />
                                  )}
                                </div>
                                <div className="flex-1 pt-1">
                                  <p className={`${previewDarkMode ? 'text-white' : 'text-foreground'} ${step === 1 ? '' : 'opacity-60'}`}>
                                    Step {step}
                                  </p>
                                  <p className={`text-sm ${previewDarkMode ? 'text-slate-400' : 'text-muted-foreground'}`}>
                                    {step === 1 ? 'Current step' : step === 2 ? 'Next step' : 'Final step'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Dots Stepper */}
                        {stepperStyle === 'dots' && (
                          <div className="flex items-center justify-center gap-2 mb-6">
                            {[1, 2, 3].map((step) => (
                              <div
                                key={step}
                                className={`h-2 rounded-full transition-all ${
                                  step === 1 ? 'w-8' : 'w-2'
                                } ${
                                  step === 1
                                    ? 'bg-primary'
                                    : previewDarkMode
                                    ? 'bg-slate-700'
                                    : 'bg-secondary'
                                }`}
                                style={step === 1 ? { backgroundColor: theme.primaryColor } : {}}
                              />
                            ))}
                          </div>
                        )}
                        
                        {/* Minimal Tabs Stepper */}
                        {stepperStyle === 'minimal' && (
                          <div className="flex gap-2 mb-6 border-b border-border">
                            {[1, 2, 3].map((step) => (
                              <button
                                key={step}
                                className={`px-4 py-2 relative ${
                                  step === 1
                                    ? previewDarkMode ? 'text-white' : 'text-foreground'
                                    : previewDarkMode ? 'text-slate-400' : 'text-muted-foreground'
                                }`}
                                style={step === 1 ? { color: theme.primaryColor } : {}}
                              >
                                Step {step}
                                {step === 1 && (
                                  <div
                                    className="absolute bottom-0 left-0 right-0 h-0.5"
                                    style={{ backgroundColor: theme.primaryColor }}
                                  />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {selectedTemplate === 'carded' ? (
                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <Card
                            key={field.id}
                            className={`p-4 ${
                              previewDarkMode
                                ? 'bg-slate-800 border-slate-700'
                                : 'bg-card border-border'
                            }`}
                            style={{ borderRadius: theme.borderRadius }}
                          >
                            <div className="space-y-2">
                              <Label
                                className={previewDarkMode ? 'text-white' : 'text-foreground'}
                                style={{ color: theme.primaryColor }}
                              >
                                {field.label}
                                {field.validations?.some((v) => v.type === 'required') && (
                                  <span className="text-destructive ml-1">*</span>
                                )}
                              </Label>
                              {renderField(field, previewDarkMode, theme)}
                              {field.description && (
                                <p className={`text-sm ${previewDarkMode ? 'text-slate-400' : 'text-muted-foreground'}`}>
                                  {field.description}
                                </p>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <Label
                            className={previewDarkMode ? 'text-white' : 'text-foreground'}
                            style={{ color: theme.primaryColor }}
                          >
                            {field.label}
                            {field.validations?.some((v) => v.type === 'required') && (
                              <span className="text-destructive ml-1">*</span>
                            )}
                          </Label>
                          {renderField(field, previewDarkMode, theme)}
                          {field.description && (
                            <p className={`text-sm ${previewDarkMode ? 'text-slate-400' : 'text-muted-foreground'}`}>
                              {field.description}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <button
                      className="px-6 py-3 rounded-[var(--radius-button)] text-white transition-all hover:opacity-90"
                      style={{
                        backgroundColor: theme.primaryColor,
                        borderRadius: theme.borderRadius,
                      }}
                    >
                      Submit Form
                    </button>
                    <button
                      className={`px-6 py-3 rounded-[var(--radius-button)] border-2 transition-all ${
                        previewDarkMode
                          ? 'border-slate-700 text-white hover:bg-slate-800'
                          : 'border-border hover:bg-secondary'
                      }`}
                      style={{ borderRadius: theme.borderRadius }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
